'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BehaviorCategory, AlertLevel, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type BehaviorLogInput = {
    studentId: string;
    category: BehaviorCategory;
    severity: number;
    description?: string;
};

/**
 * Cria um novo registro de comportamento e processa alertas automáticos.
 */
export async function createBehaviorLog(data: BehaviorLogInput) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Não autenticado');
    }

    // Verificar se o usuário tem permissão (Professor, Gestor, Piscólogo)
    // Assumindo que qualquer staff pode criar logs, mas a visualização é restrita

    const log = await prisma.behaviorLog.create({
        data: {
            tenantId: user.tenantId,
            studentId: data.studentId,
            teacherId: user.id,
            category: data.category,
            severity: data.severity,
            description: data.description,
        },
    });

    // Processar Lógica de Inteligência Nativa
    await processBehaviorAlerts(data.studentId, user.tenantId);

    revalidatePath(`/alunos/${data.studentId}`);
    revalidatePath('/dashboard');

    return log;
}

/**
 * Processa as regras de alerta baseadas no histórico recente do aluno.
 */
async function processBehaviorAlerts(studentId: string, tenantId: string) {
    // Buscar aluno e histórico recente (15 dias)
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    const [student, recentLogs, lastAssessment] = await Promise.all([
        prisma.student.findUnique({ where: { id: studentId } }),
        prisma.behaviorLog.findMany({
            where: {
                studentId,
                createdAt: { gte: fifteenDaysAgo },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.assessment.findFirst({
            where: { studentId, type: 'SRSS_IE' },
            orderBy: { appliedAt: 'desc' }
        })
    ]);

    if (!student || recentLogs.length === 0) return;

    let newAlertLevel: AlertLevel = 'GREEN';
    const latestLog = recentLogs[0];

    // --- Lógica de Classificação de Risco ---

    // 1. Severidade: Se tem ALGO grave nos últimos 15 dias, já é RED.
    // Mas para NOTIFICAÇÃO, olhamos se o log ATUAL disparou isso.
    const hasSeverity3 = recentLogs.some(log => log.severity === 3);

    // 2. Frequência
    const negativeCategories: BehaviorCategory[] = ['CONFLITO', 'ISOLAMENTO', 'TRISTEZA', 'AGRESSIVIDADE'];
    const negativeCount = recentLogs.filter(log => negativeCategories.includes(log.category)).length;

    if (hasSeverity3) {
        newAlertLevel = 'RED';
    } else if (negativeCount >= 3) {
        newAlertLevel = 'YELLOW';
    }

    // --- Lógica de Notificação (Disparo de Evento) ---
    // Notificar apenas se o log ATUAL for o gatilho de um estado crítico

    const isTier3 = lastAssessment?.overallTier === 'TIER_3';
    let shouldNotify = false;
    let notificationTitle = '';
    let notificationMessage = '';
    let notificationType: NotificationType = NotificationType.CRITICAL_RISK;

    // Gatilho 1: Log Atual é Severidade 3
    if (latestLog.severity === 3) {
        shouldNotify = true;
        newAlertLevel = 'RED'; // Garante RED
        notificationTitle = '🚨 Alerta Vermelho: Alta Severidade';
        notificationMessage = `O aluno ${student.name} apresentou comportamento de Alta Severidade (Nível 3).`;
    }
    // Gatilho 2: Regra Híbrida (Isolamento + Tier 3)
    else if (latestLog.category === 'ISOLAMENTO' && isTier3) {
        shouldNotify = true;
        newAlertLevel = 'RED'; // Garante RED
        notificationTitle = '🚨 Alerta Híbrido: Risco Iminente';
        notificationMessage = `O aluno ${student.name} (Tier 3) apresentou comportamento de ISOLAMENTO. Atenção imediata recomendada.`;
    }

    if (shouldNotify) {
        const staffUsers = await prisma.user.findMany({
            where: {
                tenantId,
                role: { in: ['PSYCHOLOGIST', 'MANAGER', 'ADMIN'] }
            }
        });

        if (staffUsers.length > 0) {
            // 1. Notificações In-App
            await prisma.notification.createMany({
                data: staffUsers.map(u => ({
                    tenantId,
                    userId: u.id,
                    studentId: student.id,
                    type: notificationType,
                    title: notificationTitle,
                    message: notificationMessage,
                    isRead: false,
                    link: `/alunos/${student.id}`
                }))
            });

            // 2. Envio de E-mail
            const emails = staffUsers.map(u => u.email).filter((e): e is string => !!e);
            if (emails.length > 0) {
                await sendCriticalAlertEmail({
                    to: emails,
                    studentName: student.name,
                    tier: isTier3 ? 'TIER 3 (Alto Risco)' : (lastAssessment?.overallTier || 'N/A'),
                    lastLogCategory: latestLog.category,
                    lastLogDescription: latestLog.description || 'Sem descrição',
                    alertLink: `${process.env.NEXT_PUBLIC_APP_URL}/alunos/${student.id}`
                });
            }

            // 3. Webhook
            await triggerWebhook('CRITICAL_ALERT', {
                studentId: student.id,
                studentName: student.name,
                alertLevel: newAlertLevel,
                triggerLog: latestLog,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Atualizar status do aluno se mudou
    if (student.systemAlertLevel !== newAlertLevel) {
        await prisma.student.update({
            where: { id: studentId },
            data: { systemAlertLevel: newAlertLevel },
        });
    }
}

/**
 * Busca logs com regras de privacidade estritas.
 * Professor A só vê logs criados por Professor A.
 * Gestores/Psicólogos veem tudo do tenant.
 */
export async function getBehaviorLogs(studentId: string) {
    const user = await getCurrentUser();
    if (!user) return [];

    const where: Prisma.BehaviorLogWhereInput = {
        studentId,
        tenantId: user.tenantId,
    };

    // Regra de Privacidade: Professores só veem seus próprios logs
    if (user.role === 'TEACHER') {
        where.teacherId = user.id;
    }

    return prisma.behaviorLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            teacher: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
    });
}

/**
 * Busca alunos com alertas ativos (Amarelo ou Vermelho) para o Dashboard.
 * Ordena por: Vermelho > Amarelo
 */
export async function getRecentAlerts() {
    const user = await getCurrentUser();
    if (!user || ['TEACHER', 'STUDENT'].includes(user.role)) return [];

    // Busca alunos com alerta
    const students = await prisma.student.findMany({
        where: {
            tenantId: user.tenantId,
            systemAlertLevel: { in: ['RED', 'YELLOW'] }
        },
        select: {
            id: true,
            name: true,
            grade: true,
            systemAlertLevel: true,
            behaviorLogs: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                    category: true,
                    description: true,
                    createdAt: true
                }
            }
        }
    });

    // Ordenação manual para garantir RED > YELLOW
    return students.sort((a, b) => {
        if (a.systemAlertLevel === 'RED' && b.systemAlertLevel !== 'RED') return -1;
        if (a.systemAlertLevel !== 'RED' && b.systemAlertLevel === 'RED') return 1;
        return 0;
    });
}

/**
 * Busca estatísticas resumidas para o StudentSummaryCard.
 */
export async function getStudentSummaryStats(studentId: string) {
    const user = await getCurrentUser();
    if (!user) return null;

    // Calcular início do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [student, logsCount, lastAssessment] = await Promise.all([
        prisma.student.findUnique({
            where: { id: studentId },
            select: { systemAlertLevel: true, name: true }
        }),
        prisma.behaviorLog.count({
            where: {
                studentId,
                createdAt: { gte: startOfMonth }
            }
        }),
        prisma.assessment.findFirst({
            where: { studentId, type: 'SRSS_IE' },
            orderBy: { appliedAt: 'desc' },
            select: { overallTier: true }
        })
    ]);

    return {
        systemAlertLevel: student?.systemAlertLevel || 'GREEN',
        monthlyLogs: logsCount,
        srssTier: lastAssessment?.overallTier || 'N/A'
    };
}
