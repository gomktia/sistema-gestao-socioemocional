import { requireSuperAdmin } from '@/lib/auth';
import { getWebhooks, getTenantsList } from '@/app/actions/webhook-management';
import { WebhooksClient } from './webhooks-client';

export const metadata = {
    title: 'Webhooks | Triavium SaaS',
};

export default async function WebhooksPage() {
    await requireSuperAdmin();

    const [webhooks, tenants] = await Promise.all([
        getWebhooks(),
        getTenantsList(),
    ]);

    const serializedWebhooks = webhooks.map((wh) => ({
        ...wh,
        createdAt: wh.createdAt.toISOString(),
    }));

    return (
        <WebhooksClient
            initialWebhooks={serializedWebhooks}
            tenants={tenants}
        />
    );
}
