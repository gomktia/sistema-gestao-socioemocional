import { redirect } from 'next/navigation';
import { getCurrentUser, canAccessRoute } from '@/lib/auth';
import { getCachedTenant } from '@/lib/cache';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { getNavForRole } from '@/components/sidebar-nav';
import { OnboardingCheck } from '@/components/onboarding/OnboardingCheck';
import { TourGuide } from '@/components/onboarding/TourGuide';
import { GlossaryButton } from '@/components/onboarding/GlossaryButton';
import { getLabels } from '@/src/lib/utils/labels';
import { UserRole } from '@/src/core/types';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const tenant = user.tenantId
        ? await getCachedTenant(user.tenantId)
        : null;

    if (tenant && tenant.subscriptionStatus !== 'active') {
        redirect('/subscription-expired');
    }

    const navItems = getNavForRole(user.role, user.organizationType);
    const labels = getLabels(user.organizationType);
    const isManager = user.role === UserRole.MANAGER || user.role === UserRole.ADMIN;
    const showWizard = isManager && tenant ? !tenant.onboardingCompleted : false;

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { tourCompletedAt: true },
    });
    const showTour = !dbUser?.tourCompletedAt && user.role !== UserRole.RESPONSIBLE && !showWizard;

    // Multi-tenancy: Buscar todos os vínculos
    const { getMyTenants } = await import('@/app/actions/tenant-selector');
    const tenants = await getMyTenants();

    return (
        <div className="flex flex-col h-screen overflow-hidden lg:flex-row bg-slate-50">
            <Sidebar
                items={navItems}
                userName={user.name}
                userRole={user.role}
                organizationType={user.organizationType}
                tenants={tenants}
                activeTenantId={user.tenantId}
            />

            <main className="flex-1 flex flex-col min-h-0 pt-16 lg:pt-0 overflow-y-auto">
                <Header
                    userName={user.name}
                    userRole={user.role}
                    organizationType={user.organizationType}
                    userId={user.id}
                />

                <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>

            <OnboardingCheck
                showWizard={showWizard}
                tenantName={tenant?.name ?? ''}
                labels={labels}
            />
            <TourGuide userRole={user.role} showTour={showTour} />
            <GlossaryButton />
        </div>
    );
}
