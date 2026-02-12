const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando seed completo para demonstração longitudinal...');

    // 1. Criar Tenant (Escola)
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'escola-exemplo' },
        update: {},
        create: {
            name: 'Colégio Educador do Futuro',
            slug: 'escola-exemplo',
            isActive: true,
        },
    });

    // 2. Criar Psicólogo (Autor do PEI)
    const psychologist = await prisma.user.upsert({
        where: { tenantId_email: { tenantId: tenant.id, email: 'psi@escola.com' } },
        update: {},
        create: {
            tenantId: tenant.id,
            email: 'psi@escola.com',
            name: 'Dr. Roberto Mendes',
            role: 'PSYCHOLOGIST',
        },
    });

    // 3. Criar Alunos (Amostra de 20 alunos)
    const studentsData = [
        { name: 'Ana Beatriz Silva', grade: 'ANO_1_EM' },
        { name: 'Bruno Oliveira', grade: 'ANO_1_EM' },
        { name: 'Carla Souza', grade: 'ANO_1_EM' },
        { name: 'Daniel Santos', grade: 'ANO_2_EM' },
        { name: 'Eduarda Lima', grade: 'ANO_2_EM' },
        { name: 'Felipe Costa', grade: 'ANO_2_EM' },
        { name: 'Gabriel Rocha', grade: 'ANO_3_EM' },
        { name: 'Heloísa Fernandes', grade: 'ANO_3_EM' },
        { name: 'Igor Martins', grade: 'ANO_1_EM' },
        { name: 'Julia Castro', grade: 'ANO_1_EM' },
        { name: 'Kevin Souza', grade: 'ANO_2_EM' },
        { name: 'Larissa Porto', grade: 'ANO_2_EM' },
        { name: 'Murilo Veiga', grade: 'ANO_3_EM' },
        { name: 'Natália Ramos', grade: 'ANO_3_EM' },
        { name: 'Otávio Guerra', grade: 'ANO_1_EM' },
        { name: 'Paula Noite', grade: 'ANO_2_EM' },
        { name: 'Ricardo Alvo', grade: 'ANO_2_EM' },
        { name: 'Sérgio Reis', grade: 'ANO_3_EM' },
        { name: 'Tiago Leite', grade: 'ANO_1_EM' },
        { name: 'Vitoria Régia', grade: 'ANO_2_EM' },
    ];

    // Dummy raw answers to bypass constraint
    const dummyAnswers = { "1": 3, "2": 2, "3": 1 };

    for (const s of studentsData) {
        // Upsert student to avoid unique constraint errors if re-running
        const student = await prisma.student.upsert({
            where: {
                tenantId_enrollmentId: {
                    tenantId: tenant.id,
                    enrollmentId: s.name.replace(/ /g, '_').toLowerCase()
                }
            },
            update: {},
            create: {
                tenantId: tenant.id,
                name: s.name,
                grade: s.grade,
                enrollmentId: s.name.replace(/ /g, '_').toLowerCase(),
                isActive: true,
            },
        });

        // --- MARÇO (DIAGNÓSTICO) ---
        const rand = Math.random();
        let tierM = 'TIER_1';
        let extM = 2;
        let intM = 1;

        if (rand < 0.3) {
            tierM = 'TIER_3'; extM = 12; intM = 8;
        } else if (rand < 0.7) {
            tierM = 'TIER_2'; extM = 6; intM = 4;
        }

        await prisma.assessment.create({
            data: {
                tenantId: tenant.id,
                studentId: student.id,
                type: 'SRSS_IE',
                screeningWindow: 'DIAGNOSTIC',
                academicYear: 2026,
                overallTier: tierM,
                processedScores: {
                    externalizing: { score: extM, tier: tierM },
                    internalizing: { score: intM, tier: tierM }
                },
                rawAnswers: dummyAnswers,
                appliedAt: new Date('2026-03-10').toISOString()
            }
        });

        // --- JUNHO (MONITORAMENTO) ---
        // Alguns alunos se mantêm ou pioram levemente
        let tierJ = tierM;
        let extJ = extM;
        let intJ = intM;

        if (tierM === 'TIER_1' && Math.random() < 0.1) {
            tierJ = 'TIER_2'; extJ = 5; intJ = 3;
        }

        await prisma.assessment.create({
            data: {
                tenantId: tenant.id,
                studentId: student.id,
                type: 'SRSS_IE',
                screeningWindow: 'MONITORING',
                academicYear: 2026,
                overallTier: tierJ,
                processedScores: {
                    externalizing: { score: extJ, tier: tierJ },
                    internalizing: { score: intJ, tier: tierJ }
                },
                rawAnswers: dummyAnswers,
                appliedAt: new Date('2026-06-15').toISOString()
            }
        });

        // --- OUTUBRO (FINAL) - MELHORIA DE 60% ---
        let tierO = tierJ;
        let extO = extJ;
        let intO = intJ;

        if ((tierJ === 'TIER_3' || tierJ === 'TIER_2') && Math.random() < 0.6) {
            if (tierJ === 'TIER_3') {
                tierO = 'TIER_2'; extO = 6; intO = 4;
            } else {
                tierO = 'TIER_1'; extO = 2; intO = 1;
            }
        }

        await prisma.assessment.create({
            data: {
                tenantId: tenant.id,
                studentId: student.id,
                type: 'SRSS_IE',
                screeningWindow: 'FINAL',
                academicYear: 2026,
                overallTier: tierO,
                processedScores: {
                    externalizing: { score: extO, tier: tierO },
                    internalizing: { score: intO, tier: tierO }
                },
                rawAnswers: dummyAnswers,
                appliedAt: new Date('2026-10-20').toISOString()
            }
        });

        // --- EWS (OUTUBRO) ---
        const isEWSAlert = Math.random() < 0.05;
        await prisma.schoolIndicator.upsert({
            where: {
                studentId_academicYear_quarter: {
                    studentId: student.id,
                    academicYear: 2026,
                    quarter: 4
                }
            },
            update: {},
            create: {
                tenantId: tenant.id,
                studentId: student.id,
                academicYear: 2026,
                quarter: 4,
                attendanceRate: isEWSAlert ? 85 : 98,
                academicAverage: isEWSAlert ? 4.0 : 8.5,
                previousAverage: isEWSAlert ? 8.5 : 8.0,
                disciplinaryLogs: isEWSAlert ? 4 : 0,
            }
        });

        // --- PEI (Se Junho era TIER_3) ---
        if (tierJ === 'TIER_3') {
            await prisma.interventionPlan.create({
                data: {
                    tenantId: tenant.id,
                    studentId: student.id,
                    authorId: psychologist.id,
                    status: tierO === 'TIER_3' ? 'ACTIVE' : 'COMPLETED',
                    targetRisks: ['Indisciplina ativa', 'Conflito com pares'],
                    leverageStrengths: ['Liderança', 'Bondade'],
                    strategicActions: 'Aluno atuará como monitor de atividades práticas para canalizar a energia de liderança de forma positiva.',
                    expectedOutcome: 'Redução de conflitos e maior engajamento acadêmico.',
                    createdAt: new Date('2026-06-25').toISOString()
                }
            });
        }
    }

    console.log('Seed Longitudinal de Outubro concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
