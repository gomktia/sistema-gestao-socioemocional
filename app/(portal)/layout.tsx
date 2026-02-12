import { redirect } from 'next/navigation';
import { getCurrentUser, canAccessRoute } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { getNavForRole } from '@/components/sidebar-nav';
import { headers } from 'next/headers';

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    // Obter o pathname atual para verificar permissão RBAC
    // Nota: Next.js não fornece o pathname diretamente em Server Components,
    // mas podemos passar através do middleware se necessário ou usar headers.
    // Por simplicidade aqui, confiamos no middleware para a proteção básica
    // e no canAccessRoute para lógica de renderização se necessário.

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
