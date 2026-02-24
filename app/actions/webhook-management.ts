'use server';

import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';
import { randomBytes, createHmac } from 'crypto';

// ---------------------------------------------------------------------------
// getWebhooks
// ---------------------------------------------------------------------------

export async function getWebhooks(filters?: { tenantId?: string }) {
    await requireSuperAdmin();

    const where: Record<string, unknown> = {};
    if (filters?.tenantId) where.tenantId = filters.tenantId;

    return prisma.webhook.findMany({
        where,
        include: { tenant: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    });
}

// ---------------------------------------------------------------------------
// createWebhook
// ---------------------------------------------------------------------------

export async function createWebhook(data: {
    tenantId: string;
    url: string;
    events: string[];
}) {
    const admin = await requireSuperAdmin();
    const secret = randomBytes(32).toString('hex');

    const webhook = await prisma.webhook.create({
        data: {
            tenantId: data.tenantId,
            url: data.url,
            events: data.events,
            secret,
            isActive: true,
        },
    });

    await logAudit({
        tenantId: admin.tenantId,
        userId: admin.id,
        action: 'WEBHOOK_CREATED',
        targetId: webhook.id,
        details: { url: data.url, events: data.events },
    });

    revalidatePath('/super-admin/webhooks');
    return { success: true as const, id: webhook.id, secret };
}

// ---------------------------------------------------------------------------
// toggleWebhookActive
// ---------------------------------------------------------------------------

export async function toggleWebhookActive(webhookId: string) {
    const admin = await requireSuperAdmin();

    const webhook = await prisma.webhook.findUnique({ where: { id: webhookId } });
    if (!webhook) return { error: 'Webhook nao encontrado.' };

    const updated = await prisma.webhook.update({
        where: { id: webhookId },
        data: { isActive: !webhook.isActive },
    });

    await logAudit({
        tenantId: admin.tenantId,
        userId: admin.id,
        action: 'WEBHOOK_TOGGLED',
        targetId: webhookId,
        details: { isActive: updated.isActive },
    });

    revalidatePath('/super-admin/webhooks');
    return { success: true as const, isActive: updated.isActive };
}

// ---------------------------------------------------------------------------
// deleteWebhook
// ---------------------------------------------------------------------------

export async function deleteWebhook(webhookId: string) {
    const admin = await requireSuperAdmin();

    await prisma.webhook.delete({ where: { id: webhookId } });

    await logAudit({
        tenantId: admin.tenantId,
        userId: admin.id,
        action: 'WEBHOOK_DELETED',
        targetId: webhookId,
    });

    revalidatePath('/super-admin/webhooks');
    return { success: true as const };
}

// ---------------------------------------------------------------------------
// testWebhook
// ---------------------------------------------------------------------------

export async function testWebhook(webhookId: string) {
    await requireSuperAdmin();

    const webhook = await prisma.webhook.findUnique({ where: { id: webhookId } });
    if (!webhook) return { error: 'Webhook nao encontrado.' };

    const payload = JSON.stringify({
        event: 'test',
        timestamp: new Date().toISOString(),
        data: { message: 'Teste de webhook Triavium' },
    });

    const signature = createHmac('sha256', webhook.secret).update(payload).digest('hex');

    try {
        const res = await fetch(webhook.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Triavium-Signature': signature,
            },
            body: payload,
            signal: AbortSignal.timeout(10000),
        });

        return { success: true as const, status: res.status };
    } catch {
        return { error: 'Falha ao enviar teste. Verifique a URL.' };
    }
}

// ---------------------------------------------------------------------------
// getTenantsList
// ---------------------------------------------------------------------------

export async function getTenantsList() {
    await requireSuperAdmin();

    return prisma.tenant.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });
}
