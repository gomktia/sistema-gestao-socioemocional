'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function fetchNotifications(limit: number = 10) {
    const user = await getCurrentUser();
    if (!user) return [];

    return prisma.notification.findMany({
        where: { tenantId: user.tenantId, userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}

export async function getUnreadCount() {
    const user = await getCurrentUser();
    if (!user) return 0;

    return prisma.notification.count({
        where: { tenantId: user.tenantId, userId: user.id, isRead: false },
    });
}

export async function fetchAllNotifications(page: number = 1, pageSize: number = 20) {
    const user = await getCurrentUser();
    if (!user) return { notifications: [], total: 0 };

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where: { tenantId: user.tenantId, userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: pageSize,
            skip: (page - 1) * pageSize,
        }),
        prisma.notification.count({
            where: { tenantId: user.tenantId, userId: user.id },
        }),
    ]);

    return { notifications, total };
}

export async function markNotificationAsRead(id: string) {
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.notification.updateMany({
        where: { id, tenantId: user.tenantId, userId: user.id },
        data: { isRead: true },
    });
}

export async function markAllNotificationsAsRead() {
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.notification.updateMany({
        where: { tenantId: user.tenantId, userId: user.id, isRead: false },
        data: { isRead: true },
    });

    revalidatePath('/notificacoes');
}
