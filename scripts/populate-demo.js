const { PrismaClient, Role, GradeLevel, OrganizationType } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Populando Banco de Dados para Testes ---');

    const tenantId = 'cmlikvzpv0000vv8k1qk2zi5i';
    const tenantName = 'Colégio Educador do Futuro';

    try {
        // 1. Garantir que o Tenant exista (já deve existir, mas vamos atualizar o nome por segurança)
        const tenant = await prisma.tenant.upsert({
            where: { id: tenantId },
            update: { name: tenantName, organizationType: OrganizationType.EDUCATIONAL, onboardingCompleted: true },
            create: {
                id: tenantId,
                name: tenantName,
                slug: 'colegio-educador',
                organizationType: OrganizationType.EDUCATIONAL,
                onboardingCompleted: true
            }
        });
        console.log(`✓ Tenant: ${tenant.name}`);

        // 2. Criar Turmas (1º, 2º e 3º Ano do EM)
        const classroomsData = [
            { name: '1º Ano A - EM', grade: GradeLevel.ANO_1_EM, year: 2026, shift: 'Manhã' },
            { name: '2º Ano B - EM', grade: GradeLevel.ANO_2_EM, year: 2026, shift: 'Manhã' },
            { name: '3º Ano C - EM', grade: GradeLevel.ANO_3_EM, year: 2026, shift: 'Manhã' }
        ];

        const classrooms = [];
        for (const c of classroomsData) {
            const classroom = await prisma.classroom.upsert({
                where: { tenantId_name_year: { tenantId, name: c.name, year: c.year } },
                update: {},
                create: { ...c, tenantId }
            });
            classrooms.push(classroom);
            console.log(`  ✓ Turma: ${classroom.name}`);
        }

        // 3. Criar Alunos de Exemplo
        const studentsData = [
            { name: 'Ana Beatriz Silva', grade: GradeLevel.ANO_1_EM, classroomId: classrooms[0].id, enrollmentId: 'MAT001' },
            { name: 'Bruno Henrique Sousa', grade: GradeLevel.ANO_1_EM, classroomId: classrooms[0].id, enrollmentId: 'MAT002' },
            { name: 'Carla Dias', grade: GradeLevel.ANO_2_EM, classroomId: classrooms[1].id, enrollmentId: 'MAT003' },
            { name: 'Daniel Mendes', grade: GradeLevel.ANO_2_EM, classroomId: classrooms[1].id, enrollmentId: 'MAT004' },
            { name: 'Eduarda Lima', grade: GradeLevel.ANO_3_EM, classroomId: classrooms[2].id, enrollmentId: 'MAT005' },
            { name: 'Fábio Jr', grade: GradeLevel.ANO_3_EM, classroomId: classrooms[2].id, enrollmentId: 'MAT006' },
            { name: 'Giovanna Ewbank', grade: GradeLevel.ANO_1_EM, classroomId: classrooms[0].id, enrollmentId: 'MAT007' },
            { name: 'Hugo Gloss', grade: GradeLevel.ANO_2_EM, classroomId: classrooms[1].id, enrollmentId: 'MAT008' },
            { name: 'Iza Pesadão', grade: GradeLevel.ANO_3_EM, classroomId: classrooms[2].id, enrollmentId: 'MAT009' }
        ];

        for (const s of studentsData) {
            await prisma.student.upsert({
                where: { tenantId_enrollmentId: { tenantId, enrollmentId: s.enrollmentId } },
                update: { classroomId: s.classroomId },
                create: { ...s, tenantId }
            });
        }
        console.log(`✓ 9 Alunos criados em 3 turmas.`);

        // 4. Configurar Usuários de Teste (Links já existentes no Login Page)
        // geisonhoehr@gmail.com (Super Admin - Tenant Global)
        // admin@escola.com (Manager - Escola)
        // psi@escola.com (Psychologist - Escola)
        // professor@escola.com (Teacher - Escola)

        // O admin@escola.com já garantimos no passo anterior, mas vamos garantir os outros
        const testUsers = [
            { email: 'psi@escola.com', name: 'Dr. Roberto Mendes', role: Role.PSYCHOLOGIST },
            { email: 'professor@escola.com', name: 'Prof. Marcos Souza', role: Role.TEACHER }
        ];

        for (const u of testUsers) {
            await prisma.user.upsert({
                where: { tenantId_email: { tenantId, email: u.email } },
                update: { role: u.role },
                create: { ...u, tenantId }
            });
        }
        console.log(`✓ Usuários psi@escola.com e professor@escola.com garantidos.`);

        console.log('\n--- Script de População Concluído com Sucesso ---');
        console.log('Dica: Use os botões de "Dev Quick Access" na tela de login para testar cada função.');

    } catch (error) {
        console.error('✗ Erro ao popular banco:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
