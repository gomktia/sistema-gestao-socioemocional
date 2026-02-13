const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const tenants = await prisma.tenant.findMany({
            select: { id: true, name: true, organizationType: true }
        });
        console.log('Available Tenants:');
        console.table(tenants);
    } catch (error) {
        console.error('Error fetching tenants:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
