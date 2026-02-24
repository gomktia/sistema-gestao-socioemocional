import { prisma } from '@/lib/prisma';
import { createHmac } from 'crypto';

export async function triggerWebhook(event: string, payload: Record<string, unknown>): Promise<void> {
    const tenantId = payload.tenantId as string | undefined;
    if (!tenantId) return;

    const webhooks = await prisma.webhook.findMany({
        where: {
            tenantId,
            isActive: true,
            events: { has: event },
        },
    });

    for (const wh of webhooks) {
        const body = JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            data: payload,
        });
        const signature = createHmac('sha256', wh.secret).update(body).digest('hex');

        fetch(wh.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Triavium-Signature': signature,
            },
            body,
            signal: AbortSignal.timeout(10000),
        }).catch((err: Error) => {
            console.error(`Webhook ${wh.id} failed for event ${event}:`, err.message);
        });
    }
}
