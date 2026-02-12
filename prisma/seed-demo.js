const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Iniciando Seed de Demonstração SaaS ---');

    // 1. Criar Tenant Principal (Escola Demo)
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'colegio-demo' },
        update: { subscriptionStatus: 'active' },
        create: {
            name: 'Colégio Educador do Futuro (DEMO)',
            slug: 'colegio-demo',
            isActive: true,
            subscriptionStatus: 'active',
        },
    });

    // 2. Criar Usuários de Teste (Serão vinculados por e-mail no primeiro login)
    const usersToCreate = [
        { email: 'admin@escola.com', name: 'Diretor Geral', role: 'MANAGER' },
        { email: 'psi@escola.com', name: 'Dr. Roberto Mendes', role: 'PSYCHOLOGIST' },
        { email: 'professor@escola.com', name: 'Prof. Marcos Souza', role: 'TEACHER' },
        { email: 'aluno@escola.com', name: 'Ana Beatriz Silva', role: 'STUDENT' },
        { email: 'geisonhoehr@gmail.com', name: 'Geison SuperAdmin', role: 'ADMIN' },
    ];

    console.log('Criando usuários de teste...');
    const createdUsers = {};
    for (const u of usersToCreate) {
        const user = await prisma.user.upsert({
            where: { tenantId_email: { tenantId: tenant.id, email: u.email } },
            update: { role: u.role, name: u.name },
            create: {
                tenantId: tenant.id,
                email: u.email,
                name: u.name,
                role: u.role,
            },
        });
        createdUsers[u.role] = user;
    }

    // 3. Criar Alunos Mockados (20 alunos)
    const studentsNames = [
        'Ana Beatriz Silva', 'Bruno Oliveira', 'Carla Souza', 'Daniel Santos',
        'Eduarda Lima', 'Felipe Costa', 'Gabriel Rocha', 'Heloísa Fernandes',
        'Igor Martins', 'Julia Castro', 'Kevin Souza', 'Larissa Porto',
        'Murilo Veiga', 'Natália Ramos', 'Otávio Guerra', 'Paula Noite',
        'Ricardo Alvo', 'Sérgio Reis', 'Tiago Leite', 'Vitoria Régia'
    ];

    const dummyAnswers = { "1": 3, "2": 2, "3": 1 };

    console.log('Populando dados longitudinais para 20 alunos...');
    for (const name of studentsNames) {
        const grade = name.includes('Silva') || name.includes('Oliveira') ? 'ANO_1_EM' :
            name.includes('Lima') || name.includes('Costa') ? 'ANO_2_EM' : 'ANO_3_EM';

        const student = await prisma.student.upsert({
            where: {
                tenantId_enrollmentId: {
                    tenantId: tenant.id,
                    enrollmentId: name.replace(/ /g, '_').toLowerCase()
                }
            },
            update: {},
            create: {
                tenantId: tenant.id,
                name: name,
                grade: grade,
                enrollmentId: name.replace(/ /g, '_').toLowerCase(),
                isActive: true,
            },
        });

        // Vincular o usuário de teste de aluno ao primeiro aluno da lista
        if (name === 'Ana Beatriz Silva' && !createdUsers.STUDENT.studentId) {
            await prisma.user.update({
                where: { id: createdUsers.STUDENT.id },
                data: { studentId: student.id }
            });
        }

        // Limpar dados existentes para evitar duplicação em re-runs
        await prisma.assessment.deleteMany({ where: { studentId: student.id } });
        await prisma.schoolIndicator.deleteMany({ where: { studentId: student.id } });
        await prisma.interventionPlan.deleteMany({ where: { studentId: student.id } });


        // Gerar Assessments (Março, Junho, Outubro)
        const tiers = ['TIER_1', 'TIER_2', 'TIER_3'];
        const diagTier = tiers[Math.floor(Math.random() * 3)];
        const monTier = diagTier === 'TIER_3' ? (Math.random() > 0.5 ? 'TIER_2' : 'TIER_3') : diagTier;
        const finalTier = (monTier === 'TIER_3' || monTier === 'TIER_2') ? 'TIER_1' : monTier; // Simular sucesso total

        const windows = [
            { w: 'DIAGNOSTIC', t: diagTier, d: '2026-03-10' },
            { w: 'MONITORING', t: monTier, d: '2026-06-15' },
            { w: 'FINAL', t: finalTier, d: '2026-10-20' },
        ];

        for (const win of windows) {
            await prisma.assessment.create({
                data: {
                    tenantId: tenant.id,
                    studentId: student.id,
                    type: 'SRSS_IE',
                    screeningWindow: win.w,
                    academicYear: 2026,
                    overallTier: win.t,
                    processedScores: {
                        externalizing: { score: win.t === 'TIER_1' ? 2 : win.t === 'TIER_2' ? 6 : 12, tier: win.t },
                        internalizing: { score: win.t === 'TIER_1' ? 1 : win.t === 'TIER_2' ? 4 : 8, tier: win.t }
                    },
                    rawAnswers: dummyAnswers,
                    appliedAt: new Date(win.d).toISOString()
                }
            });
        }

        // EWS (Outubro)
        const isEWS = name === 'Igor Martins'; // Igor terá alerta
        await prisma.schoolIndicator.create({
            data: {
                tenantId: tenant.id,
                studentId: student.id,
                academicYear: 2026,
                quarter: 4,
                attendanceRate: isEWS ? 84 : 96,
                academicAverage: isEWS ? 5.0 : 8.2,
                previousAverage: isEWS ? 8.5 : 8.0,
                disciplinaryLogs: isEWS ? 5 : 0,
            }
        });

        // PEI (Para quem era TIER_3 em Junho)
        if (monTier === 'TIER_3') {
            await prisma.interventionPlan.create({
                data: {
                    tenantId: tenant.id,
                    studentId: student.id,
                    authorId: createdUsers.PSYCHOLOGIST.id,
                    status: 'COMPLETED',
                    targetRisks: ['Baixo desempenho', 'Indisciplina'],
                    leverageStrengths: ['Persseverança', 'Curiosidade'],
                    strategicActions: 'Aluno integrado ao projeto de monitoria por pares para reforçar senso de pertencimento.',
                    expectedOutcome: 'Melhoria de nota e redução de faltas.',
                    createdAt: new Date('2026-06-25').toISOString()
                }
            });
        }
    }

    console.log('\n--- Seed concluído com sucesso! ---');
    console.log('Tenant: Colégio Educador do Futuro (Demo)');
    console.log('Logins disponíveis:');
    console.log('- Manager: admin@escola.com');
    console.log('- Psicólogo: psi@escola.com');
    console.log('- Professor: professor@escola.com');
    console.log('- Aluno: aluno@escola.com');
    console.log('- SuperAdmin: geison.hoehr@gmail.com');
    console.log('\nImportante: Para logar, use "Sign Up" no Supabase com estes emails e senha "123456". O sistema vinculará os dados automaticamente.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
