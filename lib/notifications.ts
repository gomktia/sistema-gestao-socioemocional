import { prisma } from '@/lib/prisma';

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
    try {
        await prisma.notification.create({
            data: {
                tenantId: params.tenantId,
                userId: params.userId || null,
                studentId: params.studentId || null,
                type: params.type,
                title: params.title,
                message: params.message,
                link: params.link || null,
                isRead: false,
            },
        });

        return { success: true };
    } catch (e: any) {
        console.error('Error creating notification:', e.message);
        return { success: false, error: e.message };
    }
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
