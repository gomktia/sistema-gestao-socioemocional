const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function confirmUser() {
    const email = 'geisonhoehr@gmail.com';
    console.log(`Confirming email for user: ${email} via Direct Database Access...`);

    try {
        // Check if user exists in auth.users
        const users = await prisma.$queryRaw`SELECT id, email, email_confirmed_at FROM auth.users WHERE email = ${email}`;

        if (!users || users.length === 0) {
            console.error('User not found in auth.users table.');
            return;
        }

        console.log('User found:', users[0]);

        if (users[0].email_confirmed_at) {
            console.log('User is already confirmed.');
            return;
        }

        // Update email_confirmed_at
        const result = await prisma.$executeRaw`
        UPDATE auth.users 
        SET email_confirmed_at = NOW(), updated_at = NOW() 
        WHERE email = ${email}
      `;

        console.log(`Updated user(s). Email confirmed successfully! result: ${result}`);

    } catch (error) {
        console.error('Error confirming user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

confirmUser();
