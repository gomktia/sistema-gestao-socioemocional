import { redirect } from 'next/navigation';
import { getCurrentUser, canAccessRoute } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { getNavForRole } from '@/components/sidebar-nav';

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    // Verificação de assinatura (subscription) via Prisma
    if (user.tenantId) {
        const tenant = await prisma.tenant.findUnique({
            where: { id: user.tenantId },
            select: { subscriptionStatus: true },
        });

        if (tenant && tenant.subscriptionStatus !== 'active') {
            redirect('/subscription-expired');
        }
    }

    const navItems = getNavForRole(user.role);

    return (
        <div className="flex flex-col h-screen overflow-hidden lg:flex-row bg-slate-50">
            <Sidebar
                items={navItems}
                userName={user.name}
                userRole={user.role}
            />

            <main className="flex-1 flex flex-col min-h-0 pt-16 lg:pt-0 overflow-y-auto">
                <Header
                    userName={user.name}
                    userRole={user.role}
                />

                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
