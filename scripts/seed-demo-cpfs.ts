
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = [
        { email: 'geisonhoehr@gmail.com', cpf: '11111111111' },
        { email: 'admin@escola.com', cpf: '22222222222' },
        { email: 'psi@escola.com', cpf: '33333333333' },
        { email: 'professor@escola.com', cpf: '44444444444' },
        { email: 'aluno@escola.com', cpf: '55555555555' },
    ]

    for (const user of users) {
        try {
            await prisma.user.update({
                where: { email: user.email },
                data: { cpf: user.cpf },
            })
            console.log(`Updated CPF for ${user.email}`)
        } catch (e) {
            console.error(`Could not update ${user.email}: ${e.message}`)
        }
    }

    // Also update student record for the test student
    try {
        const studentUser = await prisma.user.findUnique({
            where: { email: 'aluno@escola.com' },
            select: { studentId: true }
        })

        if (studentUser?.studentId) {
            await prisma.student.update({
                where: { id: studentUser.studentId },
                data: { cpf: '55555555555' }
            })
            console.log('Updated Student record CPF for aluno@escola.com')
        }
    } catch (e) {
        console.error(`Could not update student record: ${e.message}`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
