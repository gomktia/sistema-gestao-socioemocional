
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
            // Since email is scoped by tenantId, we must find the user first or use updateMany if we want to update all users with that email (which likely isn't the intent if they are different users, but here it's seeding demo data).
            // Assuming we want to update ANY user with this email for the demo.
            const existingUsers = await prisma.user.findMany({
                where: { email: user.email }
            });

            for (const dbUser of existingUsers) {
                await prisma.user.update({
                    where: { id: dbUser.id },
                    data: { cpf: user.cpf },
                });
                console.log(`Updated CPF for ${user.email} (ID: ${dbUser.id})`);
            }
        } catch (e: any) {
            console.error(`Could not update ${user.email}: ${e.message}`)
        }
    }

    // Also update student record for the test student
    try {
        const studentUser = await prisma.user.findFirst({
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
    } catch (e: any) {
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
