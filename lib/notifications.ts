import { prisma } from '@/lib/prisma';
import { sendNotificationEmail } from '@/lib/mail';

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
 * Envia um alerta crítico (in-app + email) para psicólogos e gestores do tenant.
 */
export async function notifyCriticalRisk(tenantId: string, studentId: string, studentName: string) {
    // 1. In-app notification
    const result = await createNotification({
        tenantId,
        studentId,
        type: NotificationType.CRITICAL_RISK,
        title: '⚠️ ALERTA CRÍTICO: Rastro Vermelho',
        message: `O aluno ${studentName} foi classificado em Tier 3 (Rastro Vermelho) na triagem SRSS-IE. Uma intervenção imediata é recomendada.`,
        link: `/alunos/${studentId}`
    });

    // 2. Email to psychologists and managers
    try {
        const recipients = await prisma.user.findMany({
            where: {
                tenantId,
                role: { in: ['PSYCHOLOGIST', 'MANAGER', 'COUNSELOR'] },
                isActive: true,
            },
            select: { email: true },
        });

        const emails = recipients.map(r => r.email).filter(Boolean);

        if (emails.length > 0) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://triavium.com.br';
            await sendNotificationEmail({
                to: emails,
                studentName,
                title: 'ALERTA CRÍTICO: Rastro Vermelho (Tier 3)',
                message: `O aluno ${studentName} foi classificado em Tier 3 (Rastro Vermelho) na triagem SRSS-IE. Uma intervenção imediata é recomendada.`,
                link: `${baseUrl}/alunos/${studentId}`,
                severity: 'critical',
            });
        }
    } catch (error) {
        console.error('Error sending critical risk email:', error);
    }

    return result;
}

/**
 * Notifica (in-app + email) quando a Percepção Familiar detecta Zona de Atenção.
 */
export async function notifyFamilyAttentionZone(
    tenantId: string,
    studentId: string,
    studentName: string,
    axisNames: string,
) {
    const message = `A família de ${studentName} sinalizou vulnerabilidade nos eixos: ${axisNames}. Recomenda-se triangulação com autoavaliação e observação docente.`;

    // 1. In-app notification
    const result = await createNotification({
        tenantId,
        studentId,
        type: NotificationType.SYSTEM_ALERT,
        title: 'Percepção Familiar: Zona de Atenção',
        message,
        link: `/alunos/${studentId}`,
    });

    // 2. Email to psychologists and managers
    try {
        const recipients = await prisma.user.findMany({
            where: {
                tenantId,
                role: { in: ['PSYCHOLOGIST', 'MANAGER', 'COUNSELOR'] },
                isActive: true,
            },
            select: { email: true },
        });

        const emails = recipients.map(r => r.email).filter(Boolean);

        if (emails.length > 0) {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://triavium.com.br';
            await sendNotificationEmail({
                to: emails,
                studentName,
                title: 'Percepção Familiar: Zona de Atenção',
                message,
                link: `${baseUrl}/alunos/${studentId}`,
                severity: 'warning',
            });
        }
    } catch (error) {
        console.error('Error sending family attention zone email:', error);
    }

    return result;
}
