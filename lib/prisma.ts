import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
    try {
        return new PrismaClient();
    } catch (e) {
        console.error('Failed to initialize PrismaClient. Check DATABASE_URL.', e);
        return undefined as unknown as PrismaClient;
    }
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
