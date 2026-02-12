'use server';

import { getCurrentUser, AppUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';

/**
 * Exige um usuário autenticado. Lança erro se não logado.
 */
export async function requireAuthenticatedUser(): Promise<AppUser> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Não autenticado.');
    return user;
}

/**
 * Exige que o usuário tenha uma das roles permitidas.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AppUser> {
    const user = await requireAuthenticatedUser();
    if (!allowedRoles.includes(user.role)) {
        throw new Error('Sem permissão para esta ação.');
    }
    return user;
}

/**
 * Valida que um aluno pertence ao tenant do usuário.
 * Retorna o aluno se válido, lança erro se não encontrado ou de outro tenant.
 */
export async function validateStudentBelongsToTenant(studentId: string, tenantId: string) {
    const student = await prisma.student.findFirst({
        where: { id: studentId, tenantId },
    });
    if (!student) {
        throw new Error('Aluno não encontrado ou acesso negado.');
    }
    return student;
}

/**
 * Valida que múltiplos alunos pertencem ao tenant do usuário.
 * Retorna os IDs válidos. Lança erro se algum não pertence.
 */
export async function validateStudentsBelongToTenant(studentIds: string[], tenantId: string) {
    const validStudents = await prisma.student.findMany({
        where: { id: { in: studentIds }, tenantId },
        select: { id: true },
    });
    if (validStudents.length !== studentIds.length) {
        throw new Error('Um ou mais alunos não pertencem à sua escola.');
    }
    return validStudents;
}
