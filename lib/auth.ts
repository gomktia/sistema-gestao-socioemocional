import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@core/types';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export interface AppUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId: string;
    studentId: string | null;
    organizationType: string;
}

/**
 * Obtém o usuário atual autenticado e seus metadados do banco de dados (RBAC).
 * Usa Supabase Auth para verificar a sessão e Prisma para consultar o banco.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return null;

        const cookieStore = await cookies();
        const activeTenantId = cookieStore.get('active_tenant_id')?.value;

        // Tentar buscar por UID ou Email, priorizando o tenant ativo se o cookie existir
        let dbUser: any;

        if (activeTenantId) {
            dbUser = await prisma.user.findFirst({
                where: {
                    tenantId: activeTenantId,
                    OR: [
                        { supabaseUid: user.id },
                        { email: user.email || '' }
                    ]
                },
                include: {
                    tenant: {
                        select: { organizationType: true }
                    }
                }
            });
        }

        // Se não encontrou pelo tenant ativo ou não tem cookie, busca o primeiro disponível
        if (!dbUser) {
            dbUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { supabaseUid: user.id },
                        { email: user.email || '' }
                    ]
                },
                include: {
                    tenant: {
                        select: { organizationType: true }
                    }
                }
            });
        }

        if (dbUser && !dbUser.supabaseUid && user.id) {
            // Vincular o UID do Supabase se for o primeiro acesso
            await prisma.user.update({
                where: { id: dbUser.id },
                data: { supabaseUid: user.id },
            });
        }

        if (!dbUser) return null;

        return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role as UserRole,
            tenantId: dbUser.tenantId,
            studentId: dbUser.studentId,
            organizationType: dbUser.tenant?.organizationType ?? 'EDUCATIONAL',
        };
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        return null;
    }
}

/**
 * Mapeia cada Role para sua página inicial padrão.
 */
const ROLE_HOME: Record<string, string> = {
    STUDENT: '/minhas-forcas',
    TEACHER: '/inicio',
    PSYCHOLOGIST: '/inicio',
    COUNSELOR: '/inicio',
    MANAGER: '/inicio',
    ADMIN: '/super-admin',
};

export function getHomeForRole(role: string): string {
    return ROLE_HOME[role] ?? '/';
}

/**
 * Define quais permissões são necessárias para cada grupo de rotas.
 */
const ROUTE_ACCESS: Record<string, string[]> = {
    '/questionario': ['STUDENT'],
    '/minhas-forcas': ['STUDENT'],
    '/turma': ['TEACHER', 'MANAGER', 'ADMIN', 'PSYCHOLOGIST', 'COUNSELOR'],
    '/alunos': ['PSYCHOLOGIST', 'COUNSELOR', 'MANAGER', 'ADMIN'],
    '/intervencoes': ['PSYCHOLOGIST', 'COUNSELOR', 'MANAGER', 'ADMIN'],
    '/relatorios': ['PSYCHOLOGIST', 'COUNSELOR', 'MANAGER', 'ADMIN'],
    '/gestao': ['MANAGER', 'ADMIN'],
    '/escola/configuracoes': ['MANAGER', 'ADMIN'],
    '/super-admin': ['ADMIN'],
    '/inicio': ['TEACHER', 'MANAGER', 'ADMIN', 'PSYCHOLOGIST', 'COUNSELOR', 'STUDENT'],
};

/**
 * Verifica se o usuário com determinado Role pode acessar a rota.
 */
export async function requireSuperAdmin(): Promise<AppUser> {
    const user = await getCurrentUser();
    if (!user || user.role !== UserRole.ADMIN) {
        redirect('/');
    }
    return user;
}

export function canAccessRoute(role: string, pathname: string): boolean {
    const matchedRoute = Object.keys(ROUTE_ACCESS).find(
        (route) => pathname === route || pathname.startsWith(route + '/')
    );
    if (!matchedRoute) return true;
    return ROUTE_ACCESS[matchedRoute].includes(role);
}
