const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspectIdentities() {
    console.log('--- Inspecting Identities ---');
    try {
        const email = 'psi@escola.com';
        const users = await prisma.$queryRaw`SELECT id FROM auth.users WHERE email = ${email}`;

        if (!users.length) {
            console.log('User not found');
            return;
        }
        const userId = users[0].id;
        console.log(`User ID for ${email}: ${userId}`);

        const identities = await prisma.$queryRaw`SELECT * FROM auth.identities WHERE user_id = ${userId}::uuid`;
        console.log('Identities found:', identities);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

inspectIdentities();
