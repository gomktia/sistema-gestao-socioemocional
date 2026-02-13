'use server'

import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)


type ValidationResult =
    | { valid: false; error?: string }
    | { valid: true; type: 'INVITATION'; data: any }
    | { valid: true; type: 'STUDENT_CODE'; data: { id: string; name: string; tenant: { id: string; name: string } } };

export async function validateInviteToken(token: string): Promise<ValidationResult> {
    if (!token) return { valid: false }

    // 1. Try to find in StudentInvitation (Not used in simplified flow but good to have)
    const invitation = await prisma.studentInvitation.findUnique({
        where: { token },
        include: { tenant: true }
    })

    if (invitation) {
        if (invitation.status !== 'PENDING') return { valid: false, error: 'Convite já utilizado ou expirado.' }
        return { valid: true, type: 'INVITATION', data: invitation }
    }

    // 2. Try to find in Student.accessCode
    const student = await prisma.student.findFirst({
        where: { accessCode: token },
        select: { id: true, name: true, tenant: { select: { name: true, id: true } } }
    })

    if (student) {
        return { valid: true, type: 'STUDENT_CODE', data: student }
    }

    return { valid: false, error: 'Código de convite inválido.' }
}

export async function completeStudentRegistration(token: string, data: {
    birthDate: Date
    email: string
    password: string
    name?: string
    cpf?: string
}) {
    // Re-validate token
    const validation = await validateInviteToken(token)
    if (!validation.valid) throw new Error(validation.error || "Token inválido")

    let studentId: string | null = null
    let tenantId: string = ''
    let existingStudentName: string = ''

    if (validation.valid && validation.type === 'STUDENT_CODE') {
        const studentData = (validation as { type: 'STUDENT_CODE', data: { id: string, name: string, tenant: { id: string } } }).data
        studentId = studentData.id
        tenantId = studentData.tenant.id
        existingStudentName = studentData.name
    } else {
        throw new Error("Fluxo de convite genérico não implementado.")
    }

    if (!studentId) throw new Error("Erro interno: ID do aluno não encontrado.")

    // 1. Create Supabase Auth User
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { name: data.name || existingStudentName }
    })

    if (authError) {
        console.error("Auth Error:", authError)
        return { success: false, error: authError.message }
    }

    if (!authUser.user) return { success: false, error: "Falha ao criar usuário." }

    try {
        // 2. Update Student Record
        const updateData: any = {
            birthDate: data.birthDate,
            isActive: true,
            isFormEnabled: true,
            accessCode: null
        }

        if (data.cpf) {
            updateData.cpf = data.cpf
        }

        await prisma.student.update({
            where: { id: studentId },
            data: updateData
        })

        // 3. Create Prisma User Linked to Student
        await prisma.user.create({
            data: {
                tenantId: tenantId,
                email: data.email,
                cpf: data.cpf,
                name: data.name || existingStudentName,
                role: 'STUDENT',
                supabaseUid: authUser.user.id,
                studentId: studentId
            }
        })

        return { success: true }

    } catch (dbError) {
        console.error("DB Error:", dbError)
        // Rollback auth user
        await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
        return { success: false, error: "Erro ao salvar dados no sistema. CPF ou Email já utilizados?" }
    }
}

export async function registerStudentAction(formData: FormData) {
    const token = formData.get('token') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const birthDateStr = formData.get('birthDate') as string
    const name = formData.get('name') as string
    const cpf = formData.get('cpf') as string

    // ... validation ...
    if (!token || !email || !password || !birthDateStr) {
        return { success: false, error: "Dados incompletos" }
    }

    if (password !== confirmPassword) {
        return { success: false, error: "Senhas não conferem" }
    }

    try {
        const result = await completeStudentRegistration(token, {
            email,
            password,
            birthDate: new Date(birthDateStr),
            name,
            cpf
        })

        if (!result.success) {
            return { success: false, error: result.error }
        }

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message || 'Erro desconhecido' }
    }
}

