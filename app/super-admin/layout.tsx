import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { getNavForRole } from '@/components/sidebar-nav';
import { requireSuperAdmin } from '@/lib/auth';

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // SECURITY (V1.1): Defesa em profundidade - valida\u00e7\u00e3o redundante
    // N\u00e3o confiar apenas no middleware
    const user = await requireSuperAdmin();

    if (!user) {
        redirect('/login');
    }

    if (user.role !== 'ADMIN') {
        redirect('/');
    }

    // Clear impersonation cookies when returning to super-admin panel
    const cookieStore = await cookies();
    if (cookieStore.get('impersonating')?.value === 'true') {
        cookieStore.delete('impersonating');
        cookieStore.delete('active_tenant_id');
        const originalId = cookieStore.get('original_tenant_id')?.value;
        if (originalId) {
            cookieStore.set('active_tenant_id', originalId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
            });
        }
        cookieStore.delete('original_tenant_id');
    }

    const navItems = getNavForRole(user.role);

    return (
        <div className="flex flex-col h-screen overflow-hidden lg:flex-row bg-slate-50">
            <Sidebar
                items={navItems}
                userName={user.name}
                userEmail={user.email}
                userRole={user.role}
            />

            <main className="flex-1 flex flex-col min-h-0 pt-16 lg:pt-0 overflow-y-auto">
                <Header
                    userName={user.name}
                    userRole={user.role}
                    userId={user.id}
                />

                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
