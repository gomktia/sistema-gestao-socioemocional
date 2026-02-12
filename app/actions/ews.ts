'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { revalidatePath } from 'next/cache';

/**
 * Salva um novo Plano de Intervenção Individual (PEI - Camada 3).
 */
export async function saveInterventionPlan(params: {
    studentId: string;
    targetRisks: string[];
    leverageStrengths: string[];
    strategicActions: string;
    expectedOutcome?: string;
    reviewDate?: string;
}) {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        return { error: 'Não autorizado.' };
    }

    // Validar que o aluno pertence ao tenant do usuário
    const student = await prisma.student.findFirst({
        where: { id: params.studentId, tenantId: user.tenantId },
    });
    if (!student) {
        return { error: 'Aluno não encontrado ou acesso negado.' };
    }

    try {
        const plan = await prisma.interventionPlan.create({
            data: {
                tenantId: user.tenantId,
                studentId: params.studentId,
                authorId: user.id,
                targetRisks: params.targetRisks,
                leverageStrengths: params.leverageStrengths,
                strategicActions: params.strategicActions,
                expectedOutcome: params.expectedOutcome,
                reviewDate: params.reviewDate ? new Date(params.reviewDate) : undefined,
                status: 'ACTIVE',
            },
        });

        revalidatePath(`/alunos/${params.studentId}`);
        return { success: true, plan };
    } catch (e: any) {
        console.error('Error saving PEI:', e.message);
        return { error: 'Erro ao salvar o plano.' };
    }
}

/**
 * Lança indicadores escolares (EWS) para um aluno.
 */
export async function saveSchoolIndicators(params: {
    studentId: string;
    academicYear: number;
    quarter: number;
    attendanceRate: number;
    academicAverage: number;
    disciplinaryLogs: number;
    previousAverage?: number;
}) {
    const user = await getCurrentUser();
    if (!user || user.role === UserRole.STUDENT) return { error: 'Não autorizado.' };

    // Validar que o aluno pertence ao tenant do usuário
    const studentCheck = await prisma.student.findFirst({
        where: { id: params.studentId, tenantId: user.tenantId },
    });
    if (!studentCheck) {
        return { error: 'Aluno não encontrado ou acesso negado.' };
    }

    try {
        await prisma.schoolIndicator.upsert({
            where: {
                studentId_academicYear_quarter: {
                    studentId: params.studentId,
                    academicYear: params.academicYear,
                    quarter: params.quarter,
                },
            },
            update: {
                attendanceRate: params.attendanceRate,
                academicAverage: params.academicAverage,
                disciplinaryLogs: params.disciplinaryLogs,
                previousAverage: params.previousAverage,
            },
            create: {
                tenantId: user.tenantId,
                studentId: params.studentId,
                academicYear: params.academicYear,
                quarter: params.quarter,
                attendanceRate: params.attendanceRate,
                academicAverage: params.academicAverage,
                disciplinaryLogs: params.disciplinaryLogs,
                previousAverage: params.previousAverage,
            },
        });
    } catch (e: any) {
        console.error('Error saving EWS:', e.message);
        return { error: 'Erro ao salvar indicadores.' };
    }

    // Verificar se deve gerar notificação automática (EWS Logic)
    const { calculateEWSAlert } = await import('@/src/core/logic/ews');
    const alert = calculateEWSAlert(
        params.attendanceRate,
        params.academicAverage,
        params.previousAverage,
        params.disciplinaryLogs
    );

    if (alert.alertLevel !== 'NONE') {
        const { createNotification, NotificationType } = await import('@/lib/notifications');

        const student = await prisma.student.findUnique({
            where: { id: params.studentId },
            select: { name: true },
        });

        await createNotification({
            tenantId: user.tenantId,
            studentId: params.studentId,
            type: NotificationType.SYSTEM_ALERT,
            title: `⚠️ EWS: Alerta de Risco Escolar (${alert.alertLevel === 'CRITICAL' ? 'Crítico' : 'Atenção'})`,
            message: `O aluno ${student?.name || 'estudante'} apresenta risco escolar: ${alert.rationale.join(' ')}`,
            link: `/alunos/${params.studentId}`
        });
    }

    revalidatePath(`/alunos/${params.studentId}`);
    revalidatePath('/gestao/ews');
    return { success: true };
}
