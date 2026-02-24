import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { getAuditLogs } from '@/app/actions/super-admin';
import { AuditLogsClient } from './audit-logs-client';

export const metadata = {
    title: 'Logs de Auditoria | Triavium SaaS',
};

export default async function LogsPage() {
    await requireSuperAdmin();

    const [initialData, tenants] = await Promise.all([
        getAuditLogs(),
        prisma.tenant.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        }),
    ]);

    return <AuditLogsClient initialData={initialData} tenants={tenants} />;
}
