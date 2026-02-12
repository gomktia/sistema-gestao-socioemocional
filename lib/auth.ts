import { createClient } from '@/lib/supabase/server';
import { UserRole } from '@core/types';

export interface AppUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId: string;
    studentId: string | null;
}

/**
 * Obtém o usuário atual autenticado e seus metadados do banco de dados (RBAC).
 */
export async function getCurrentUser(): Promise<AppUser | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 1. Tentar buscar por UID (já vinculado)
    let { data: dbUser } = await supabase
        .from('users')
        .select('id, email, name, role, tenantId, studentId, supabaseUid')
        .eq('supabaseUid', user.id)
        .single();

    // 2. Se não encontrou por UID, tentar por Email (Primeiro acesso)
    if (!dbUser) {
        const { data: matchedEmail } = await supabase
            .from('users')
            .select('id, email, name, role, tenantId, studentId, supabaseUid')
            .eq('email', user.email)
            .single();

        if (matchedEmail) {
            // Vincular o UID do Supabase ao registro no banco
            const { data: updatedUser } = await supabase
                .from('users')
                .update({ supabaseUid: user.id })
                .eq('id', matchedEmail.id)
                .select()
                .single();

            dbUser = updatedUser;
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
export function canAccessRoute(role: string, pathname: string): boolean {
    const matchedRoute = Object.keys(ROUTE_ACCESS).find(
        (route) => pathname === route || pathname.startsWith(route + '/')
    );
    if (!matchedRoute) return true; // Rotas não mapeadas são tratadas como públicas dentro do portal
    return ROUTE_ACCESS[matchedRoute].includes(role);
}
