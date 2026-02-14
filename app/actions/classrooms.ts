'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { GradeLevel } from '@/src/core/types';

export async function getClassrooms() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    return await prisma.classroom.findMany({
        where: { tenantId: user.tenantId },
        include: { _count: { select: { students: true } } },
        orderBy: { name: 'asc' }
    });
}

export async function getClassroomById(id: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    return await prisma.classroom.findUnique({
        where: { id, tenantId: user.tenantId },
        include: {
            students: {
                select: {
                    id: true,
                    name: true,
                    grade: true,
                    enrollmentId: true,
                    isActive: true
                }
            }
        }
    });
}

export async function createClassroom(data: { name: string; grade: GradeLevel; year: number; shift?: string }) {
    const user = await getCurrentUser();
    if (!user || user.role === 'STUDENT') throw new Error('Unauthorized');

    const classroom = await prisma.classroom.create({
        data: {
            ...data,
            tenantId: user.tenantId
        }
    });

    revalidatePath('/turmas');
    return classroom;
}

export async function deleteClassroom(id: string) {
    const user = await getCurrentUser();
    if (!user || user.role === 'STUDENT') throw new Error('Unauthorized');

    await prisma.classroom.delete({
        where: { id, tenantId: user.tenantId }
    });

    revalidatePath('/turmas');
    return { success: true };
}

export async function addStudentsToClass(classroomId: string, studentIds: string[]) {
    const user = await getCurrentUser();
    if (!user || user.role === 'STUDENT') throw new Error('Unauthorized');

    await prisma.student.updateMany({
        where: {
            id: { in: studentIds },
            tenantId: user.tenantId
        },
        data: { classroomId }
    });

    revalidatePath('/turmas');
    revalidatePath(`/turmas/${classroomId}`);
    return { success: true };
}

export async function removeStudentFromClass(studentId: string) {
    const user = await getCurrentUser();
    if (!user || user.role === 'STUDENT') throw new Error('Unauthorized');

    await prisma.student.update({
        where: { id: studentId, tenantId: user.tenantId },
        data: { classroomId: null }
    });

    revalidatePath('/turmas');
    return { success: true };
}
