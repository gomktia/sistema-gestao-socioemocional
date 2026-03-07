'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';
import { calculateStudentProfile, calculateStrengthScores, calculateRiskScores } from '@/src/core/logic/scoring';
import { calculateBigFiveScores } from '@/src/core/logic/bigfive';
import { calculateIEAAScores } from '@/src/core/logic/ieaa';
import { calculateSDQScores } from '@/src/core/logic/sdq';
import { calculateFamilySocioemotionalScores } from '@/src/core/logic/family-socioemotional';
import { GradeLevel, VIARawAnswers, SRSSRawAnswers, UserRole, BigFiveRawAnswers, IEAARawAnswers, SDQRawAnswers, SDQVersion, FamilySocioemotionalRawAnswers, FamilySocioemotionalZone } from '@/src/core/types';
import { revalidatePath } from 'next/cache';
import { saveVIAInputSchema, saveSRSSInputSchema, saveBigFiveInputSchema, saveIEAAInputSchema, saveSDQTeacherInputSchema, saveSDQParentInputSchema, saveFamilySocioemotionalInputSchema } from '@/lib/validators/assessment';
import { upsertAssessment } from '@/lib/assessment-utils';

/**
 * Salva as respostas do questionário VIA.
 * Se todas as 71 perguntas estiverem respondidas, calcula os scores e as forças de assinatura.
 */
export async function saveVIAAnswers(answers: VIARawAnswers, targetStudentId?: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Não autorizado.' };

    const parsed = saveVIAInputSchema.safeParse({ answers, targetStudentId });
    if (!parsed.success) {
        return { error: 'Dados invalidos: ' + parsed.error.issues[0]?.message };
    }

    let studentIdToSave = user.studentId;

    if (targetStudentId && targetStudentId !== user.studentId) {
        // Modo Entrevista (Psicólogo/Staff) apenas se for para OUTRO aluno
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
        // Auto-aplicação (Aluno) ou salvando o próprio perfil
        studentIdToSave = user.studentId || (targetStudentId ?? null);

        if (!studentIdToSave && user.role !== UserRole.STUDENT) {
            return { error: 'ID do aluno não definido para esta operação.' };
        }

        if (user.role === UserRole.STUDENT && !user.studentId) {
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
        await upsertAssessment({
            tenantId: user.tenantId,
            studentId: studentIdToSave,
            type: 'VIA_STRENGTHS',
            screeningWindow: 'DIAGNOSTIC',
            academicYear: new Date().getFullYear(),
            findByScreeningWindow: true,
            screeningTeacherId: targetStudentId ? user.id : undefined,
            rawAnswers: answers as unknown as Prisma.InputJsonValue,
            processedScores: processedScores as unknown as Prisma.InputJsonValue,
        });
    } catch (e: unknown) {
        console.error('Error saving VIA:', e instanceof Error ? e.message : e);
        return { error: 'Erro ao salvar o questionário.' };
    }

    revalidatePath('/inicio');
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

    const parsed = saveSRSSInputSchema.safeParse({ studentId, answers });
    if (!parsed.success) {
        return { error: 'Dados invalidos: ' + parsed.error.issues[0]?.message };
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
        await upsertAssessment({
            tenantId: user.tenantId,
            studentId,
            type: 'SRSS_IE',
            screeningWindow: 'DIAGNOSTIC',
            academicYear: new Date().getFullYear(),
            findByScreeningWindow: true,
            screeningTeacherId: user.id,
            rawAnswers: answers as unknown as Prisma.InputJsonValue,
            processedScores: risk as unknown as Prisma.InputJsonValue,
            extraData: {
                overallTier: overallTier,
                externalizingScore: risk.externalizing.score,
                internalizingScore: risk.internalizing.score,
            },
        });
    } catch (e: unknown) {
        console.error('Error saving SRSS:', e instanceof Error ? e.message : e);
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

/**
 * Salva as respostas do questionário Big Five.
 */
export async function saveBigFiveAnswers(answers: BigFiveRawAnswers, targetStudentId?: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Não autorizado.' };

    const parsed = saveBigFiveInputSchema.safeParse({ answers, targetStudentId });
    if (!parsed.success) {
        return { error: 'Dados invalidos: ' + parsed.error.issues[0]?.message };
    }

    let studentIdToSave = user.studentId;

    if (targetStudentId && targetStudentId !== user.studentId) {
        if (!['PSYCHOLOGIST', 'MANAGER', 'ADMIN', 'COUNSELOR'].includes(user.role)) {
            return { error: 'Permissão negada.' };
        }
        const targetStudent = await prisma.student.findUnique({
            where: { id: targetStudentId, tenantId: user.tenantId },
            select: { id: true }
        });
        if (!targetStudent) return { error: 'Aluno não encontrado.' };
        studentIdToSave = targetStudentId;
    } else {
        if (!studentIdToSave && user.role !== UserRole.STUDENT) {
            return { error: 'ID do aluno não definido.' };
        }
    }

    if (!studentIdToSave) return { error: 'ID do aluno não definido.' };

    const answeredCount = Object.keys(answers).length;
    const isComplete = answeredCount >= 50;

    let processedScores = null;
    if (isComplete) {
        processedScores = calculateBigFiveScores(answers);
    }

    try {
        await upsertAssessment({
            tenantId: user.tenantId,
            studentId: studentIdToSave,
            type: 'BIG_FIVE',
            findByScreeningWindow: false,
            screeningTeacherId: targetStudentId ? user.id : undefined,
            rawAnswers: answers as unknown as Prisma.InputJsonValue,
            processedScores: processedScores as unknown as Prisma.InputJsonValue,
        });
    } catch (e: unknown) {
        console.error('Error saving Big Five:', e);
        return { error: 'Erro ao salvar Big Five.' };
    }

    revalidatePath('/inicio');
    return { success: true, complete: isComplete, scores: processedScores };
}

export async function getMyBigFive() {
    const user = await getCurrentUser();
    if (!user || !user.studentId) return null;

    return await prisma.assessment.findFirst({
        where: {
            studentId: user.studentId,
            type: 'BIG_FIVE',
        },
        orderBy: { appliedAt: 'desc' },
    });
}

/**
 * Salva as respostas do questionário IEAA.
 */
export async function saveIEAAAnswers(answers: IEAARawAnswers, targetStudentId?: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Não autorizado.' };

    const parsed = saveIEAAInputSchema.safeParse({ answers, targetStudentId });
    if (!parsed.success) {
        return { error: 'Dados invalidos: ' + parsed.error.issues[0]?.message };
    }

    let studentIdToSave = user.studentId;

    if (targetStudentId && targetStudentId !== user.studentId) {
        if (!['PSYCHOLOGIST', 'MANAGER', 'ADMIN', 'COUNSELOR'].includes(user.role)) {
            return { error: 'Permissão negada.' };
        }
        const targetStudent = await prisma.student.findUnique({
            where: { id: targetStudentId, tenantId: user.tenantId },
            select: { id: true }
        });
        if (!targetStudent) return { error: 'Aluno não encontrado.' };
        studentIdToSave = targetStudentId;
    } else {
        if (!studentIdToSave && user.role !== UserRole.STUDENT) {
            return { error: 'ID do aluno não definido.' };
        }
    }

    if (!studentIdToSave) return { error: 'ID do aluno não definido.' };

    const answeredCount = Object.keys(answers).length;
    const isComplete = answeredCount >= 50;

    let processedScores = null;
    if (isComplete) {
        processedScores = calculateIEAAScores(answers);
    }

    try {
        await upsertAssessment({
            tenantId: user.tenantId,
            studentId: studentIdToSave,
            type: 'IEAA',
            findByScreeningWindow: false,
            screeningTeacherId: targetStudentId ? user.id : undefined,
            rawAnswers: answers as unknown as Prisma.InputJsonValue,
            processedScores: processedScores as unknown as Prisma.InputJsonValue,
        });
    } catch (e: unknown) {
        console.error('Error saving IEAA:', e);
        return { error: 'Erro ao salvar IEAA.' };
    }

    revalidatePath('/inicio');
    return { success: true, complete: isComplete, scores: processedScores };
}

export async function getMyIEAA() {
    const user = await getCurrentUser();
    if (!user || !user.studentId) return null;

    return await prisma.assessment.findFirst({
        where: {
            studentId: user.studentId,
            type: 'IEAA',
        },
        orderBy: { appliedAt: 'desc' },
    });
}

/**
 * Salva a triagem SDQ realizada pelo professor.
 */
export async function saveSDQTeacherScreening(studentId: string, answers: SDQRawAnswers) {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.TEACHER, UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        return { error: 'Não autorizado.' };
    }

    const parsed = saveSDQTeacherInputSchema.safeParse({ studentId, answers });
    if (!parsed.success) {
        return { error: 'Dados invalidos: ' + parsed.error.issues[0]?.message };
    }

    const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { tenantId: true, name: true },
    });

    if (!student || student.tenantId !== user.tenantId) {
        return { error: 'Aluno não encontrado ou acesso negado.' };
    }

    const answeredCount = Object.keys(answers).length;
    const isComplete = answeredCount >= 25;

    let processedScores = null;
    if (isComplete) {
        processedScores = calculateSDQScores(answers, SDQVersion.TEACHER);
    }

    try {
        await upsertAssessment({
            tenantId: user.tenantId,
            studentId,
            type: 'SDQ',
            screeningWindow: 'DIAGNOSTIC',
            academicYear: new Date().getFullYear(),
            findByScreeningWindow: true,
            screeningTeacherId: user.id,
            rawAnswers: answers as unknown as Prisma.InputJsonValue,
            processedScores: processedScores as unknown as Prisma.InputJsonValue,
        });
    } catch (e: unknown) {
        console.error('Error saving SDQ teacher:', e instanceof Error ? e.message : e);
        return { error: 'Erro ao salvar SDQ.' };
    }

    revalidatePath('/turma/triagem');
    return { success: true, complete: isComplete, scores: processedScores };
}

/**
 * Salva as respostas do SDQ preenchido pelo responsável.
 */
export async function saveSDQParentAnswers(answers: SDQRawAnswers, targetStudentId: string) {
    const user = await getCurrentUser();

    if (!user || user.role !== UserRole.RESPONSIBLE) {
        return { error: 'Não autorizado. Apenas responsáveis podem preencher o SDQ.' };
    }

    const parsed = saveSDQParentInputSchema.safeParse({ answers, targetStudentId });
    if (!parsed.success) {
        return { error: 'Dados invalidos: ' + parsed.error.issues[0]?.message };
    }

    // Verify parent-student link via StudentGuardian
    const guardianLink = await prisma.studentGuardian.findFirst({
        where: {
            guardianId: user.id,
            studentId: targetStudentId,
            tenantId: user.tenantId,
        },
    });

    if (!guardianLink) {
        return { error: 'Vínculo com o aluno não encontrado.' };
    }

    const answeredCount = Object.keys(answers).length;
    const isComplete = answeredCount >= 25;

    let processedScores = null;
    if (isComplete) {
        processedScores = calculateSDQScores(answers, SDQVersion.PARENT);
    }

    try {
        await upsertAssessment({
            tenantId: user.tenantId,
            studentId: targetStudentId,
            type: 'SDQ',
            findByScreeningWindow: false,
            screeningTeacherId: undefined, // null discriminates parent version
            rawAnswers: answers as unknown as Prisma.InputJsonValue,
            processedScores: processedScores as unknown as Prisma.InputJsonValue,
        });
    } catch (e: unknown) {
        console.error('Error saving SDQ parent:', e instanceof Error ? e.message : e);
        return { error: 'Erro ao salvar SDQ.' };
    }

    revalidatePath('/responsavel/sdq');
    revalidatePath('/responsavel');
    return { success: true, complete: isComplete, scores: processedScores };
}

export async function getMyChildSDQ() {
    const user = await getCurrentUser();
    if (!user || user.role !== UserRole.RESPONSIBLE) return null;

    const guardianLink = await prisma.studentGuardian.findFirst({
        where: { guardianId: user.id, tenantId: user.tenantId },
        select: { studentId: true },
    });

    if (!guardianLink) return null;

    return await prisma.assessment.findFirst({
        where: {
            studentId: guardianLink.studentId,
            type: 'SDQ',
            screeningTeacherId: null, // Parent version only
        },
        orderBy: { appliedAt: 'desc' },
    });
}

/**
 * Salva as respostas da Percepção Familiar (Heteroavaliação Socioemocional) pelo responsável.
 */
export async function saveFamilySocioemotionalAnswers(
    answers: FamilySocioemotionalRawAnswers,
    targetStudentId: string
) {
    const user = await getCurrentUser();

    if (!user || user.role !== UserRole.RESPONSIBLE) {
        return { error: 'Não autorizado. Apenas responsáveis podem preencher este formulário.' };
    }

    const parsed = saveFamilySocioemotionalInputSchema.safeParse({ answers, targetStudentId });
    if (!parsed.success) {
        return { error: 'Dados inválidos: ' + parsed.error.issues[0]?.message };
    }

    // Verify parent-student link via StudentGuardian
    const guardianLink = await prisma.studentGuardian.findFirst({
        where: {
            guardianId: user.id,
            studentId: targetStudentId,
            tenantId: user.tenantId,
        },
    });

    if (!guardianLink) {
        return { error: 'Vínculo com o aluno não encontrado.' };
    }

    const answeredCount = Object.keys(answers).length;
    const isComplete = answeredCount >= 15;

    let processedScores = null;
    if (isComplete) {
        processedScores = calculateFamilySocioemotionalScores(answers);

        // Notify if any axis is in Zona de Atenção (in-app + email)
        if (processedScores.attentionAxes.length > 0) {
            const student = await prisma.student.findUnique({
                where: { id: targetStudentId },
                select: { name: true },
            });

            const axisNames = processedScores.attentionAxes.map(a => a.label).join(', ');

            const { notifyFamilyAttentionZone } = await import('@/lib/notifications');
            await notifyFamilyAttentionZone(
                user.tenantId,
                targetStudentId,
                student?.name || 'aluno(a)',
                axisNames,
            );
        }
    }

    try {
        await upsertAssessment({
            tenantId: user.tenantId,
            studentId: targetStudentId,
            type: 'FAMILY_SOCIOEMOTIONAL',
            findByScreeningWindow: false,
            screeningTeacherId: undefined,
            rawAnswers: answers as unknown as Prisma.InputJsonValue,
            processedScores: processedScores as unknown as Prisma.InputJsonValue,
        });
    } catch (e: unknown) {
        console.error('Error saving Family Socioemotional:', e instanceof Error ? e.message : e);
        return { error: 'Erro ao salvar o formulário.' };
    }

    revalidatePath('/responsavel/percepcao-familiar');
    revalidatePath('/responsavel');
    return { success: true, complete: isComplete, scores: processedScores };
}
