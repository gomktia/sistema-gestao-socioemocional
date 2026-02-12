const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Buscar um aluno existente para o seed
    const student = await prisma.student.findFirst();
    if (!student) {
        console.log('Nenhum aluno encontrado para o seed.');
        return;
    }

    const tenantId = student.tenantId;

    // 1. Seed de Indicadores Escolares (EWS)
    await prisma.schoolIndicator.upsert({
        where: {
            studentId_academicYear_quarter: {
                studentId: student.id,
                academicYear: 2026,
                quarter: 1
            }
        },
        update: {},
        create: {
            tenantId,
            studentId: student.id,
            academicYear: 2026,
            quarter: 1,
            attendanceRate: 85.5, // Alerta: < 90%
            academicAverage: 6.2,
            previousAverage: 8.5, // Alerta: queda > 20%
            disciplinaryLogs: 4   // Alerta: >= 3
        }
    });

    // 2. Seed de Triagens Históricas (Evolução Longitudinal)
    // Março (Diagnóstico - Tier 1)
    await prisma.assessment.create({
        data: {
            tenantId,
            studentId: student.id,
            type: 'SRSS_IE',
            screeningWindow: 'DIAGNOSTIC',
            academicYear: 2026,
            overallTier: 'TIER_1',
            processedScores: {
                externalizing: { score: 4, tier: 'TIER_1' },
                internalizing: { score: 2, tier: 'TIER_1' }
            },
            appliedAt: new Date('2026-03-15').toISOString()
        }
    });

    // Junho (Monitoramento - Tier 2)
    await prisma.assessment.create({
        data: {
            tenantId,
            studentId: student.id,
            type: 'SRSS_IE',
            screeningWindow: 'MONITORING',
            academicYear: 2026,
            overallTier: 'TIER_2',
            processedScores: {
                externalizing: { score: 10, tier: 'TIER_2' },
                internalizing: { score: 6, tier: 'TIER_2' }
            },
            appliedAt: new Date('2026-06-20').toISOString()
        }
    });

    console.log('Seed de indicadores e evolução concluído.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
