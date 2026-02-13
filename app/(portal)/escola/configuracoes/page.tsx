import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import EscolaConfigPage from './EscolaConfigWrapper';

export const metadata = {
    title: 'Configurações da Escola | Sistema Socioemocional',
};

export default async function Page() {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
        redirect('/');
    }

    const tenant = await prisma.tenant.findUnique({
        where: { id: user.tenantId },
        select: { id: true, name: true, logoUrl: true }
    });

    return <EscolaConfigPage tenant={tenant} />;
}
