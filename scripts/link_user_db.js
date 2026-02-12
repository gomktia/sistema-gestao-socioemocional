const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserLink() {
    const email = 'geisonhoehr@gmail.com';
    console.log(`Checking user link for: ${email}...`);

    try {
        // Check public.users
        const users = await prisma.user.findMany({
            where: { email: email }
        });

        if (!users || users.length === 0) {
            console.error('User not found in public.users table.');
            return;
        }

        console.log('Public User found:', users[0]);

        // Check auth.users to get the ID
        const authUsers = await prisma.$queryRaw`SELECT id, email FROM auth.users WHERE email = ${email}`;
        if (!authUsers || authUsers.length === 0) {
            console.error('User not found in auth.users table.');
            return;
        }
        console.log('Auth User found:', authUsers[0]);

        if (users[0].supabaseUid === authUsers[0].id) {
            console.log('User is already linked correctly.');
        } else {
            console.log('User is NOT linked correctly. Linking now...');
            await prisma.user.update({
                where: { id: users[0].id },
                data: { supabaseUid: authUsers[0].id }
            });
            console.log('User linked successfully!');
        }

    } catch (error) {
        console.error('Error checking/linking user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUserLink();
