'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { revalidatePath } from 'next/cache';
import { InterventionType, Prisma } from '@prisma/client';

const ALLOWED_ROLES = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

/**
 * Cria um novo grupo de intervenção de Camada 2.
 */
export async function createInterventionGroup(
    name: string,
    type: string,
    studentIds: string[],
    description?: string
) {
    const user = await getCurrentUser();
    if (!user || !ALLOWED_ROLES.includes(user.role)) return { error: 'Não autorizado.' };

    if (!Object.keys(InterventionType).includes(type)) {
        return { error: 'Tipo de intervenção inválido.' };
    }

    const validStudents = await prisma.student.findMany({
        where: { id: { in: studentIds }, tenantId: user.tenantId },
        select: { id: true },
    });
    if (validStudents.length !== studentIds.length) {
        return { error: 'Um ou mais alunos não pertencem à sua escola.' };
    }

    try {
        const group = await prisma.interventionGroup.create({
            data: {
                tenantId: user.tenantId,
                name,
                description: description || null,
                type: type as InterventionType,
                startDate: new Date(),
                isActive: true,
                students: {
                    connect: validStudents.map(s => ({ id: s.id })),
                },
            },
        });

        revalidatePath('/intervencoes');
        return { success: true, group };
    } catch (e: any) {
        console.error('Error creating intervention group:', e.message);
        return { error: 'Erro ao criar grupo.' };
    }
}

/**
 * Atualiza um grupo de intervenção existente.
 */
export async function updateInterventionGroup(
    id: string,
    data: {
        name?: string;
        type?: string;
        description?: string;
        studentIds?: string[];
        isActive?: boolean;
    }
) {
    const user = await getCurrentUser();
    if (!user || !ALLOWED_ROLES.includes(user.role)) return { error: 'Não autorizado.' };

    const existing = await prisma.interventionGroup.findFirst({
        where: { id, tenantId: user.tenantId },
        include: { students: { select: { id: true } } },
    });
    if (!existing) return { error: 'Grupo não encontrado.' };

    if (data.studentIds) {
        const validStudents = await prisma.student.findMany({
            where: { id: { in: data.studentIds }, tenantId: user.tenantId },
            select: { id: true },
        });
        if (validStudents.length !== data.studentIds.length) {
            return { error: 'Um ou mais alunos não pertencem à sua escola.' };
        }
    }

    try {
        const updateData: Prisma.InterventionGroupUpdateInput = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.type !== undefined) {
            if (!Object.keys(InterventionType).includes(data.type)) {
                return { error: 'Tipo de intervenção inválido.' };
            }
            updateData.type = data.type as InterventionType;
        }
        if (data.description !== undefined) updateData.description = data.description || null;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;

        if (data.studentIds) {
            updateData.students = {
                set: data.studentIds.map(sid => ({ id: sid })),
            };
        }

        await prisma.interventionGroup.update({
            where: { id },
            data: updateData,
        });

        revalidatePath('/intervencoes');
        return { success: true };
    } catch (e: any) {
        console.error('Error updating intervention group:', e.message);
        return { error: 'Erro ao atualizar grupo.' };
    }
}

/**
 * Desativa (soft delete) um grupo de intervenção.
 */
export async function deleteInterventionGroup(id: string) {
    const user = await getCurrentUser();
    if (!user || !ALLOWED_ROLES.includes(user.role)) return { error: 'Não autorizado.' };

    const result = await prisma.interventionGroup.updateMany({
        where: { id, tenantId: user.tenantId },
        data: { isActive: false },
    });

    if (result.count === 0) return { error: 'Grupo não encontrado.' };

    revalidatePath('/intervencoes');
    return { success: true };
}

/**
 * Busca um grupo de intervenção por ID.
 */
export async function getInterventionGroupById(id: string) {
    const user = await getCurrentUser();
    if (!user) return null;

    return prisma.interventionGroup.findFirst({
        where: { id, tenantId: user.tenantId },
        include: {
            students: {
                select: { id: true, name: true },
            },
        },
    });
}

/**
 * Busca grupos de intervenção ativos.
 */
export async function getInterventionGroups() {
    const user = await getCurrentUser();
    if (!user) return [];

    return prisma.interventionGroup.findMany({
        where: { tenantId: user.tenantId, isActive: true },
        include: {
            students: {
                select: { id: true, name: true },
            },
        },
        orderBy: { startDate: 'desc' },
    });
}

/**
 * Busca alunos ativos do tenant para seleção no formulário.
 */
export async function getStudentsForSelection() {
    const user = await getCurrentUser();
    if (!user) return [];

    return prisma.student.findMany({
        where: { tenantId: user.tenantId, isActive: true },
        select: {
            id: true,
            name: true,
            classroom: { select: { name: true } },
        },
        orderBy: { name: 'asc' },
    });
}
