'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateStudentProfile, calculateStrengthScores, calculateRiskScores } from '@/src/core/logic/scoring';
import { GradeLevel, VIARawAnswers, SRSSRawAnswers, UserRole } from '@/src/core/types';
import { revalidatePath } from 'next/cache';

/**
 * Salva as respostas do questionário VIA.
 * Se todas as 71 perguntas estiverem respondidas, calcula os scores e as forças de assinatura.
 */
export async function saveVIAAnswers(answers: VIARawAnswers, targetStudentId?: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Não autorizado.' };

    let studentIdToSave = user.studentId;

    if (targetStudentId) {
        // Modo Entrevista (Psicólogo/Staff)
        if (!['PSYCHOLOGIST', 'MANAGER', 'ADMIN', 'COUNSELOR'].includes(user.role)) {
            return { error: 'Permissão negada para realizar entrevista.' };
        }

        // Verificar se aluno pertence ao tenant
        const targetStudent = await prisma.student.findUnique({
            where: { id: targetStudentId, tenantId: user.tenantId },
            select: { id: true }
        });

        if (!targetStudent) {
            return { error: 'Aluno não encontrado neste tenant.' };
        }
        studentIdToSave = targetStudentId;
    } else {
        // Auto-aplicação (Aluno)
        if (user.role !== UserRole.STUDENT || !user.studentId) {
            return { error: 'Perfil de aluno não encontrado.' };
        }
    }

    if (!studentIdToSave) return { error: 'ID do aluno não definido.' };

    // Verificar quantidade de respostas
    const answeredCount = Object.keys(answers).length;
    const isComplete = answeredCount >= 71;

    let processedScores = null;
    let signatureStrengths = null;

    if (isComplete) {
        // ... (rest of logic same)
        const strengthScores = calculateStrengthScores(answers);
        const sorted = [...strengthScores].sort((a, b) => b.normalizedScore - a.normalizedScore);

        signatureStrengths = sorted.slice(0, 5);
        processedScores = {
            strengths: strengthScores,
            signatureTop5: signatureStrengths,
            developmentAreas: sorted.slice(-5).reverse(),
        };
    }

    try {
        // Tentar encontrar assessment existente para upsert
        const existing = await prisma.assessment.findFirst({
            where: {
                tenantId: user.tenantId,
                studentId: studentIdToSave,
                type: 'VIA_STRENGTHS',
                screeningWindow: 'DIAGNOSTIC',
                academicYear: new Date().getFullYear(),
            },
        });

        if (existing) {
            await prisma.assessment.update({
                where: { id: existing.id },
                data: {
                    rawAnswers: answers as any,
                    processedScores: processedScores as any,
                    appliedAt: new Date(),
                },
            });
        } else {
            await prisma.assessment.create({
                data: {
                    tenantId: user.tenantId,
                    studentId: studentIdToSave,
                    type: 'VIA_STRENGTHS',
                    screeningWindow: 'DIAGNOSTIC',
                    academicYear: new Date().getFullYear(),
                    // Se foi entrevista, quem aplicou?
                    screeningTeacherId: targetStudentId ? user.id : undefined,
                    rawAnswers: answers as any,
                    processedScores: processedScores as any,
                    appliedAt: new Date(),
                },
            });
        }
    } catch (e: any) {
        console.error('Error saving VIA:', e.message);
        return { error: 'Erro ao salvar o questionário.' };
    }

    revalidatePath('/minhas-forcas');
    revalidatePath('/questionario');

    return {
        success: true,
        complete: isComplete,
        signatureStrengths: signatureStrengths
    };
}

/**
 * Obtém os resultados de força do aluno atual.
 */
export async function getMyStrengths() {
    const user = await getCurrentUser();
    if (!user || !user.studentId) return null;

    const data = await prisma.assessment.findFirst({
        where: {
            studentId: user.studentId,
            type: 'VIA_STRENGTHS',
        },
        select: { processedScores: true, appliedAt: true },
        orderBy: { appliedAt: 'desc' },
    });

    return data;
}

/**
 * Salva a triagem SRSS-IE realizada pelo professor.
 */
export async function saveSRSSScreening(studentId: string, answers: SRSSRawAnswers) {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.TEACHER, UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        return { error: 'Não autorizado.' };
    }

    // Obter dados do aluno para garantir que pertence ao mesmo tenant
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { tenantId: true, grade: true, name: true },
    });

    if (!student || student.tenantId !== user.tenantId) {
        return { error: 'Aluno não encontrado ou acesso negado.' };
    }

    // Calcular risco
    const risk = calculateRiskScores(answers);
    const overallTier = risk.externalizing.tier; // Simplificação

    try {
        const existing = await prisma.assessment.findFirst({
            where: {
                tenantId: user.tenantId,
                studentId,
                type: 'SRSS_IE',
                screeningWindow: 'DIAGNOSTIC',
                academicYear: new Date().getFullYear(),
            },
        });

        if (existing) {
            await prisma.assessment.update({
                where: { id: existing.id },
                data: {
                    screeningTeacherId: user.id,
                    rawAnswers: answers as any,
                    processedScores: risk as any,
                    overallTier: overallTier,
                    externalizingScore: risk.externalizing.score,
                    internalizingScore: risk.internalizing.score,
                    appliedAt: new Date(),
                },
            });
        } else {
            await prisma.assessment.create({
                data: {
                    tenantId: user.tenantId,
                    studentId,
                    type: 'SRSS_IE',
                    screeningWindow: 'DIAGNOSTIC',
                    academicYear: new Date().getFullYear(),
                    screeningTeacherId: user.id,
                    rawAnswers: answers as any,
                    processedScores: risk as any,
                    overallTier: overallTier,
                    externalizingScore: risk.externalizing.score,
                    internalizingScore: risk.internalizing.score,
                    appliedAt: new Date(),
                },
            });
        }
    } catch (e: any) {
        console.error('Error saving SRSS:', e.message);
        return { error: 'Erro ao salvar triagem.' };
    }

    // Gatilho de Notificação Crítica se for Tier 3
    if (overallTier === 'TIER_3') {
        const { notifyCriticalRisk } = await import('@/lib/notifications');
        await notifyCriticalRisk(user.tenantId, studentId, student.name);
    }

    revalidatePath('/turma');
    return { success: true, risk };
}
