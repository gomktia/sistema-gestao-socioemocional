import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { getFinancialDashboard, getInvoices } from '@/app/actions/super-admin';
import { FinanceiroClient } from './financeiro-client';

export const metadata = {
    title: 'Financeiro | Triavium SaaS',
};

export default async function FinanceiroPage() {
    await requireSuperAdmin();

    const [dashboard, invoicesData, tenants] = await Promise.all([
        getFinancialDashboard(),
        getInvoices(),
        prisma.tenant.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        }),
    ]);

    return (
        <FinanceiroClient
            dashboard={dashboard}
            initialInvoices={invoicesData}
            tenants={tenants}
        />
    );
}
