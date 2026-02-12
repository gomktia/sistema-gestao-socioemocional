import { createClient } from '@/lib/supabase/server';
import { UserRole } from '@/src/core/types';

export enum NotificationType {
    CRITICAL_RISK = 'CRITICAL_RISK',
    NEW_ASSESSMENT = 'NEW_ASSESSMENT',
    INTERVENTION_DUE = 'INTERVENTION_DUE',
    SYSTEM_ALERT = 'SYSTEM_ALERT'
}

interface CreateNotificationParams {
    tenantId: string;
    userId?: string;
    studentId?: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
}

export async function createNotification(params: CreateNotificationParams) {
    const supabase = await createClient();

    const { error } = await supabase.from('notifications').insert({
        tenantId: params.tenantId,
        userId: params.userId || null,
        studentId: params.studentId || null,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link || null,
        isRead: false,
        createdAt: new Date().toISOString(),
    });

    if (error) {
        console.error('Error creating notification:', error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Envia um alerta crítico para todos os gestores do tenant.
 */
export async function notifyCriticalRisk(tenantId: string, studentId: string, studentName: string) {
    return createNotification({
        tenantId,
        studentId,
        type: NotificationType.CRITICAL_RISK,
        title: '⚠️ ALERTA CRÍTICO: Rastro Vermelho',
        message: `O aluno ${studentName} foi classificado em Tier 3 (Rastro Vermelho) na triagem SRSS-IE. Uma intervenção imediata é recomendada.`,
        link: `/alunos/${studentId}`
    });
}
