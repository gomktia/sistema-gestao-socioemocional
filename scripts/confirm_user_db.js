const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function confirmUsers() {
    const emailsToConfirm = [
        'geisonhoehr@gmail.com',
        'admin@escola.com',
        'psi@escola.com',
        'professor@escola.com',
        'aluno@escola.com'
    ];

    console.log('Starting email confirmation for test users...');

    for (const email of emailsToConfirm) {
        try {
            console.log(`Checking user: ${email}...`);
            // Check if user exists in auth.users
            // Note: Use raw query because auth.users is in a different schema usually not introspected by default Prisma setup for public schema
            const users = await prisma.$queryRaw`SELECT id, email, email_confirmed_at FROM auth.users WHERE email = ${email}`;

            if (!users || users.length === 0) {
                console.warn(`User ${email} NOT found in auth.users table.`);
                continue;
            }

            const user = users[0];
            if (user.email_confirmed_at) {
                console.log(`User ${email} is ALREADY confirmed.`);
                continue;
            }

            // Update email_confirmed_at
            await prisma.$executeRaw`
                UPDATE auth.users 
                SET email_confirmed_at = NOW(), updated_at = NOW() 
                WHERE email = ${email}
            `;

            console.log(`SUCCESS: User ${email} confirmed.`);

        } catch (error) {
            console.error(`Error confirming user ${email}:`, error);
        }
    }

    console.log('Finished processing users.');
    await prisma.$disconnect();
}

confirmUsers();
