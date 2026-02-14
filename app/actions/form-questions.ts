'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { AssessmentType, EducationalLevel } from "@prisma/client"
import { getCurrentUser } from "@/lib/auth"

// Helpers para verificar permissão
async function checkWritePermission() {
    const dbUser = await getCurrentUser();
    if (!dbUser) throw new Error("Unauthorized")

    // Apenas ADMIN (SaaS SuperAdmin) pode alterar protocolos do sistema
    if (dbUser.role !== 'ADMIN') {
        throw new Error("Forbidden - Somente Administradores SaaS podem alterar protocolos.")
    }

    return dbUser
}

async function checkReadPermission() {
    const dbUser = await getCurrentUser();
    if (!dbUser) throw new Error("Unauthorized")

    // Todos exceto STUDENT podem visualizar os protocolos para consulta
    if (dbUser.role === 'STUDENT') {
        throw new Error("Forbidden")
    }

    return dbUser
}

export async function getQuestions(educationalLevel?: EducationalLevel) {
    const user = await checkReadPermission()

    const where: any = {
        OR: [
            { tenantId: user.tenantId },
            { tenantId: null }
        ]
    }

    if (educationalLevel) {
        where.educationalLevel = educationalLevel
    }

    return await prisma.formQuestion.findMany({
        where,
        orderBy: [
            { type: 'asc' },
            { order: 'asc' },
            { number: 'asc' }
        ]
    })
}

export async function createQuestion(data: {
    number: number
    text: string
    category?: string
    type: AssessmentType
    educationalLevel?: EducationalLevel
    isActive?: boolean
    order?: number
    weight?: number
}) {
    const user = await checkWritePermission()

    try {
        const question = await prisma.formQuestion.create({
            data: {
                tenantId: user.tenantId, // Vincula ao tenant do usuário logado
                number: data.number,
                text: data.text,
                category: data.category,
                type: data.type,
                educationalLevel: data.educationalLevel || 'HIGH_SCHOOL',
                isActive: data.isActive ?? true,
                order: data.order ?? 0,
                weight: data.weight ?? 1
            }
        })
        revalidatePath('/admin/formularios')
        return { success: true, data: question }
    } catch (error) {
        console.error('Error creating question:', error)
        return { success: false, error: 'Failed to create question' }
    }
}

export async function updateQuestion(id: string, data: {
    number?: number
    text?: string
    category?: string
    type?: AssessmentType
    educationalLevel?: EducationalLevel
    isActive?: boolean
    order?: number
    weight?: number
}) {
    const user = await checkWritePermission()

    try {
        const question = await prisma.formQuestion.update({
            where: { id },
            data
        })
        revalidatePath('/admin/formularios')
        return { success: true, data: question }
    } catch (error) {
        console.error('Error updating question:', error)
        return { success: false, error: 'Failed to update question' }
    }
}

export async function deleteQuestion(id: string) {
    await checkWritePermission()

    try {
        await prisma.formQuestion.delete({
            where: { id }
        })
        revalidatePath('/admin/formularios')
        return { success: true }
    } catch (error) {
        console.error('Error deleting question:', error)
        return { success: false, error: 'Failed to delete question' }
    }
}
