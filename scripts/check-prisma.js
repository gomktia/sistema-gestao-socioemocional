const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing Prisma connection...');
        const usersCount = await prisma.user.count();
        console.log(`✓ Total users in Prisma: ${usersCount}`);

        const users = await prisma.user.findMany({
            select: { email: true, role: true, supabaseUid: true }
        });
        console.table(users);
    } catch (error) {
        console.error('✗ Prisma error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
