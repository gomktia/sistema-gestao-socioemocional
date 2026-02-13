'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { AssessmentType } from "@prisma/client"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Helper para verificar permissão
async function checkPermission() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const dbUser = await prisma.user.findUnique({
        where: { supabaseUid: user.id },
    })

    // Permitir ADMIN e PSYCHOLOGIST
    if (!dbUser || !['ADMIN', 'PSYCHOLOGIST'].includes(dbUser.role)) {
        throw new Error("Forbidden")
    }

    return dbUser
}

export async function getQuestions() {
    const user = await checkPermission()
    // Admin vê global + tenant questions? Ou só tenant?
    // Se "isolamento total", ele vê apenas do tenant dele.
    // Mas se tenantId for null (global), ele também deveria ver?
    // Vamos assumir: Perguntas do Tenant + Perguntas Globais (tenantId is null)
    // OU se o user for SUPER ADMIN (Sem tenant?), ele vê tudo?
    // User sempre tem tenantId.

    return await prisma.formQuestion.findMany({
        where: {
            OR: [
                { tenantId: user.tenantId },
                { tenantId: null }
            ]
        },
        orderBy: [
            { type: 'asc' },
            { order: 'asc' }, // Changed from number to order
            { number: 'asc' }
        ]
    })
}

export async function createQuestion(data: {
    number: number
    text: string
    category?: string
    type: AssessmentType
    isActive?: boolean
    order?: number
    weight?: number
}) {
    const user = await checkPermission()

    try {
        const question = await prisma.formQuestion.create({
            data: {
                tenantId: user.tenantId, // Vincula ao tenant do usuário logado
                number: data.number,
                text: data.text,
                category: data.category,
                type: data.type,
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
    isActive?: boolean
    order?: number
    weight?: number
}) {
    const user = await checkPermission()

    try {
        // Ensure user owns question or is super admin?
        // Basic update
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
    await checkPermission()

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
