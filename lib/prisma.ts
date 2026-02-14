import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
    try {
        const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;

        if (!url) {
            console.error('DATABASE_URL is missing. Available Env Vars:', Object.keys(process.env).filter(k => k.includes('URL')));
            throw new Error("DATABASE_URL is missing");
        }

        return new PrismaClient({
            datasources: {
                db: {
                    url: url,
                },
            },
        });
    } catch (e) {
        console.error('Failed to initialize PrismaClient. Check DATABASE_URL.', e);
        return undefined as unknown as PrismaClient;
    }
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
