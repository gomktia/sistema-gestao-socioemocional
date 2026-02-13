'use server'

import { prisma } from "@/lib/prisma"
import { createClient } from "@supabase/supabase-js"
import { isValidCPF, cleanCPF } from '@/src/lib/utils/cpf';

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

export async function selfRegisterStudent(formData: FormData) {
    const tenantId = formData.get('tenantId') as string
    const name = formData.get('name') as string
    const cpf = formData.get('cpf') as string
    const birthDateStr = formData.get('birthDate') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!tenantId || !name || !cpf || !birthDateStr || !email || !password) {
        return { success: false, error: "Preencha todos os campos obrigatórios." }
    }

    if (password !== confirmPassword) {
        return { success: false, error: "Senhas não conferem." }
    }

    if (!isValidCPF(cpf)) {
        return { success: false, error: "CPF inválido." }
    }

    const cleanCpfVal = cleanCPF(cpf);

    try {
        // Verificar tenant
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId }
        })
        if (!tenant) return { success: false, error: "Instituição não encontrada." }

        // Verificar unicidade (CPF, Email)
        const existingStudent = await prisma.student.findFirst({
            where: { OR: [{ cpf: cleanCpfVal }, { guardianEmail: email }] } // Simplificação
        })
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { cpf: cleanCpfVal }] }
        })

        if (existingUser) {
            return { success: false, error: "Usuário já cadastrado com este Email ou CPF." }
        }

        // Criar Auth no Supabase
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: { name: name }
        })

        if (authError || !authUser.user) {
            console.error("Auth Error:", authError)
            return { success: false, error: "Erro ao criar conta de acesso." }
        }

        // Transaction: Criar Student + User
        await prisma.$transaction(async (tx) => {
            // Criar Student
            const student = await tx.student.create({
                data: {
                    tenantId,
                    name,
                    cpf: cleanCpfVal,
                    birthDate: new Date(birthDateStr),
                    grade: 'ANO_1_EM', // Default ou deveria pedir? Pedir seria melhor, mas para simplificar vamos por default por enquanto ou NULL se permitido
                    isActive: true,
                    isFormEnabled: true
                }
            })

            // Criar User
            await tx.user.create({
                data: {
                    tenantId,
                    email,
                    cpf: cleanCpfVal,
                    name,
                    role: 'STUDENT',
                    supabaseUid: authUser.user!.id,
                    studentId: student.id
                }
            })
        })

        return { success: true }

    } catch (e: any) {
        console.error("Self Registration Error:", e)
        return { success: false, error: "Erro ao processar cadastro." }
    }
}
