import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/auth';
import { getTenantDetails } from '@/app/actions/super-admin';
import { TenantDetailClient } from './TenantDetailClient';

export const metadata = {
    title: 'Detalhes da Escola | Triavium SaaS',
};

export default async function EscolaDetailPage(props: {
    params: Promise<{ id: string }>;
}) {
    await requireSuperAdmin();

    const { id } = await props.params;
    const result = await getTenantDetails(id);

    if ('error' in result || !result.tenant) {
        redirect('/super-admin/escolas');
    }

    const serializedTenant = {
        ...result.tenant,
        createdAt: result.tenant.createdAt.toISOString(),
        updatedAt: result.tenant.updatedAt.toISOString(),
    };

    return (
        <TenantDetailClient
            tenant={serializedTenant}
            usersByRole={result.usersByRole}
            riskDistribution={result.riskDistribution}
            lastActivity={result.lastActivity ? result.lastActivity.toISOString() : null}
        />
    );
}
