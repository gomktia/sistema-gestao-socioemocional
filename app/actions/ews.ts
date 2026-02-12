'use server';

import { createClient } from '@/lib/supabase/server';
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

    const supabase = await createClient();

    const { data: plan, error } = await supabase
        .from('intervention_plans')
        .insert({
            tenantId: user.tenantId,
            studentId: params.studentId,
            authorId: user.id,
            targetRisks: params.targetRisks,
            leverageStrengths: params.leverageStrengths,
            strategicActions: params.strategicActions,
            expectedOutcome: params.expectedOutcome,
            reviewDate: params.reviewDate,
            status: 'ACTIVE',
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving PEI:', error.message);
        return { error: 'Erro ao salvar o plano.' };
    }

    revalidatePath(`/alunos/${params.studentId}`);
    return { success: true, plan };
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

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('school_indicators')
        .upsert({
            tenantId: user.tenantId,
            studentId: params.studentId,
            academicYear: params.academicYear,
            quarter: params.quarter,
            attendanceRate: params.attendanceRate,
            academicAverage: params.academicAverage,
            disciplinaryLogs: params.disciplinaryLogs,
            previousAverage: params.previousAverage,
        }, {
            onConflict: 'studentId,academicYear,quarter'
        });

    if (error) {
        console.error('Error saving EWS:', error.message);
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

        // Buscar nome do aluno
        const { data: student } = await supabase.from('students').select('name').eq('id', params.studentId).single();

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
    revalidatePath('/gestao/ews'); // Futura página de lançamento rápido
    return { success: true };
}
