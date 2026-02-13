'use server'

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function acceptConsent() {
    const user = await getCurrentUser()
    if (!user || !user.studentId) return { error: "Usuário inválido" }

    try {
        await prisma.student.update({
            where: { id: user.studentId },
            data: { consentAcceptedAt: new Date() }
        })
        revalidatePath('/questionario')
        return { success: true }
    } catch (e) {
        return { error: "Erro ao registrar aceite." }
    }
}
