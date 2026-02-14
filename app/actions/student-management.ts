'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { AssessmentType } from "@prisma/client"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUser } from "@/lib/auth"

// Helper to get Supabase Admin client only when needed
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error("Supabase credentials missing (Service Role Key)");
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

export async function toggleFormAccess(studentId: string, isEnabled: boolean, durationHours?: number) {
    const currentUser = await getCurrentUser()
    if (!currentUser || !['ADMIN', 'MANAGER', 'PSYCHOLOGIST'].includes(currentUser.role)) {
        throw new Error("Unauthorized")
    }

    try {
        const data: any = { isFormEnabled: isEnabled }

        if (isEnabled && durationHours) {
            const expiresAt = new Date()
            expiresAt.setHours(expiresAt.getHours() + durationHours)
            data.formAccessExpiresAt = expiresAt
        } else {
            // Se for acesso permanente (sem duração) ou desabilitar -> limpa expiração
            data.formAccessExpiresAt = null
        }

        const student = await prisma.student.update({
            where: { id: studentId, tenantId: currentUser.tenantId },
            data
        })
        revalidatePath(`/alunos/${studentId}`)
        return { success: true, data: student }
    } catch (error) {
        console.error('Error toggling form access:', error)
        return { success: false, error: 'Failed' }
    }
}

export async function resetAssessment(studentId: string, type: AssessmentType) {
    const currentUser = await getCurrentUser()
    if (!currentUser || !['ADMIN', 'MANAGER', 'PSYCHOLOGIST'].includes(currentUser.role)) {
        throw new Error("Unauthorized")
    }

    try {
        // Delete assessment of specific type for this student
        // NOTE: This assumes we want to delete the MOST RECENT one or ALL?
        // Usually "Reset" implies deleting the current active one to allow retaking.
        // For safety, let's delete only the one in the current screening window if possible,
        // or just all if generic. Let's start with deleting ALL of that type to be drastic/sure as requested "Reset".
        // Alternatively, just finding and deleting the latest.

        await prisma.assessment.deleteMany({
            where: {
                studentId,
                tenantId: currentUser.tenantId,
                type: type
            }
        })

        revalidatePath(`/alunos/${studentId}`)
        return { success: true }
    } catch (error) {
        console.error('Error resetting assessment:', error)
        return { success: false, error: 'Failed' }
    }
}

export async function updateStudentCredentials(studentId: string, email?: string, password?: string) {
    const currentUser = await getCurrentUser()
    if (!currentUser || !['ADMIN', 'MANAGER', 'PSYCHOLOGIST'].includes(currentUser.role)) {
        throw new Error("Unauthorized")
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return { success: false, error: 'Server configuration error: Missing Service Role Key' }
    }

    try {
        // 1. Find the User associated with the student
        const student = await prisma.student.findUnique({
            where: { id: studentId, tenantId: currentUser.tenantId },
            include: { userAccount: true }
        })

        if (!student || !student.userAccount?.supabaseUid) {
            return { success: false, error: 'Student does not have an active account yet.' }
        }

        const uid = student.userAccount.supabaseUid
        const updates: any = {}
        if (email) updates.email = email
        if (password) updates.password = password

        if (Object.keys(updates).length > 0) {
            const { error } = await getSupabaseAdmin().auth.admin.updateUserById(uid, updates)
            if (error) throw error

            // Update local Prisma User if email changed
            if (email) {
                await prisma.user.update({
                    where: {
                        tenantId_supabaseUid: {
                            tenantId: currentUser.tenantId,
                            supabaseUid: uid
                        }
                    },
                    data: { email }
                })
            }
        }

        revalidatePath(`/alunos/${studentId}`)
        return { success: true }
    } catch (error: any) {
        console.error('Error updating credentials:', error)
        return { success: false, error: error.message || 'Failed' }
    }
}

export async function generateOnboardingLink(studentId: string) {
    const currentUser = await getCurrentUser()
    if (!currentUser || !['ADMIN', 'MANAGER', 'PSYCHOLOGIST'].includes(currentUser.role)) {
        throw new Error("Unauthorized")
    }

    try {
        // 1. Check if student already has a pending invitation
        const existingInvite = await prisma.studentInvitation.findFirst({
            where: { tenantId: currentUser.tenantId, usedByStudentId: studentId, status: 'PENDING' }
        })

        if (existingInvite) {
            return { success: true, url: `${process.env.NEXT_PUBLIC_APP_URL}/convite/${existingInvite.token}` }
        }

        // 2. Generate new token
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

        // 3. Create invitation
        // We are associating this invitation with a specific pre-existing student record?
        // The prompt says: "Ao clicar, o aluno preenche seus dados... cria a conta".
        // If we are generating the link FROM the student profile, we probably want to link this token to this specific student ID
        // so when they sign up, it connects to this record instead of creating a duplicate.

        // Let's store the studentId temporarily in the invitation or just assume the flow:
        // If specific student: We need a field store `studentId` in Invitation.
        // But I didn't add it. I added `usedByStudentId`.
        // I can use `usedByStudentId` to store the INTENDED student ID if I want? No, that's for after usage.

        // I'll create a new Invite WITHOUT linking to ID yet, BUT if I'm generating from the profile page, 
        // I probably want to update the Student record with this token?
        // Student has `accessCode`. Let's use that?
        // No, `accessCode` I added to Student. Let's use that as the token!

        await prisma.student.update({
            where: { id: studentId },
            data: { accessCode: token }
        })

        return { success: true, url: `${process.env.NEXT_PUBLIC_APP_URL}/convite/${token}` }

    } catch (error) {
        console.error('Error generating link:', error)
        return { success: false, error: 'Failed' }
    }
}
