
const { PrismaClient } = require('@prisma/client')

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
            const dbUser = await prisma.user.findFirst({
                where: { email: user.email }
            })

            if (dbUser) {
                await prisma.user.update({
                    where: { id: dbUser.id },
                    data: { cpf: user.cpf },
                })
                console.log(`Updated CPF for ${user.email}`)
            } else {
                console.warn(`User not found: ${user.email}`)
            }
        } catch (e) {
            console.error(`Could not update ${user.email}: ${e.message}`)
        }
    }

    try {
        const studentUser = await prisma.user.findFirst({
            where: { email: 'aluno@escola.com' },
            select: { studentId: true }
        })

        if (studentUser && studentUser.studentId) {
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
