import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@core/types';
import { redirect } from 'next/navigation';

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
 * Usa Supabase Auth para verificar a sessão e Prisma para consultar o banco,
 * evitando problemas com RLS do Supabase.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const userSelect = {
        id: true, email: true, name: true, role: true,
        tenantId: true, studentId: true, supabaseUid: true,
        tenant: { select: { organizationType: true } },
    } as const;

    // 1. Tentar buscar por UID (já vinculado)
    let dbUser = await prisma.user.findFirst({
        where: { supabaseUid: user.id },
        select: userSelect,
    });

    // 2. Se não encontrou por UID, tentar por Email (Primeiro acesso)
    if (!dbUser && user.email) {
        dbUser = await prisma.user.findFirst({
            where: { email: user.email },
            select: userSelect,
        });

        if (dbUser) {
            // Vincular o UID do Supabase ao registro no banco
            await prisma.user.update({
                where: { id: dbUser.id },
                data: { supabaseUid: user.id },
            });
        }
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
}

/**
 * Mapeia cada Role para sua página inicial padrão.
 */
const ROLE_HOME: Record<string, string> = {
    STUDENT: '/minhas-forcas',
    TEACHER: '/turma',
    PSYCHOLOGIST: '/alunos',
    COUNSELOR: '/alunos',
    MANAGER: '/turma',
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
    '/turma': ['TEACHER', 'MANAGER', 'ADMIN'],
    '/alunos': ['PSYCHOLOGIST', 'COUNSELOR', 'MANAGER', 'ADMIN'],
    '/intervencoes': ['PSYCHOLOGIST', 'COUNSELOR', 'MANAGER', 'ADMIN'],
    '/relatorios': ['PSYCHOLOGIST', 'COUNSELOR', 'MANAGER', 'ADMIN'],
    '/gestao': ['MANAGER', 'ADMIN'],
    '/super-admin': ['ADMIN'],
};

/**
 * Verifica se o usuário com determinado Role pode acessar a rota.
 */
/**
 * Exige que o usuário autenticado tenha role ADMIN.
 * Redireciona para / se não autorizado.
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
    if (!matchedRoute) return true; // Rotas não mapeadas são tratadas como públicas dentro do portal
    return ROUTE_ACCESS[matchedRoute].includes(role);
}
