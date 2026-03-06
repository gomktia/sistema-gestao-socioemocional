/**
 * Script para criar um Responsável (pai/mãe) de teste no sistema.
 *
 * Uso:
 *   npx tsx scripts/add-test-responsible.ts
 *
 * O que faz:
 *   1. Busca o primeiro tenant e o primeiro aluno disponível
 *   2. Cria o usuário no Supabase Auth com senha temporária
 *   3. Cria o registro User no Prisma com role RESPONSIBLE
 *   4. Cria o vínculo StudentGuardian (PAI)
 *
 * Requer as env vars: DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// Config — edite aqui
// ============================================================
const RESPONSIBLE_EMAIL = 'pai.teste@triavium.com.br';
const RESPONSIBLE_NAME = 'Carlos Teste (Pai)';
const TEMP_PASSWORD = 'Triavium@2026!pai';
const RELATIONSHIP = 'PAI'; // MAE, PAI, AVO_A, TIO_A, OUTRO
// ============================================================

async function main() {
    const prisma = new PrismaClient();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no .env');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    try {
        // 1. Verificar se já existe no Prisma
        const existing = await prisma.user.findFirst({
            where: { email: RESPONSIBLE_EMAIL },
        });

        if (existing) {
            console.log(`⚠️  Usuário ${RESPONSIBLE_EMAIL} já existe (role: ${existing.role}).`);

            // Verificar se já tem vínculo com aluno
            const existingLink = await prisma.studentGuardian.findFirst({
                where: { guardianId: existing.id },
                include: { student: { select: { name: true } } },
            });

            if (existingLink) {
                console.log(`✅ Já vinculado ao aluno: ${existingLink.student.name}`);
            } else {
                console.log('⚠️  Sem vínculo com aluno. Criando...');
                await linkToStudent(prisma, existing.id, existing.tenantId);
            }
            return;
        }

        // 2. Buscar tenant
        const tenant = await prisma.tenant.findFirst({
            orderBy: { createdAt: 'asc' },
            select: { id: true, name: true },
        });

        if (!tenant) {
            console.error('❌ Nenhum tenant encontrado.');
            process.exit(1);
        }

        console.log(`📍 Usando tenant: ${tenant.name} (${tenant.id})`);

        // 3. Verificar se existe aluno no tenant
        const student = await prisma.student.findFirst({
            where: { tenantId: tenant.id },
            select: { id: true, name: true, grade: true },
            orderBy: { createdAt: 'asc' },
        });

        if (!student) {
            console.error('❌ Nenhum aluno encontrado no tenant. Crie um aluno antes.');
            process.exit(1);
        }

        console.log(`👦 Aluno encontrado: ${student.name} (${student.grade})`);

        // 4. Criar no Supabase Auth
        let supabaseUid: string;

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: RESPONSIBLE_EMAIL,
            password: TEMP_PASSWORD,
            email_confirm: true,
        });

        if (authError) {
            if (authError.message?.includes('already been registered')) {
                console.log('ℹ️  Usuário já existe no Supabase Auth. Buscando UID...');
                const { data: listData } = await supabase.auth.admin.listUsers();
                const existingAuth = listData?.users?.find(u => u.email === RESPONSIBLE_EMAIL);
                if (!existingAuth) {
                    console.error('❌ Não encontrou o usuário no Supabase Auth.');
                    process.exit(1);
                }
                supabaseUid = existingAuth.id;
            } else {
                console.error('❌ Erro ao criar no Supabase Auth:', authError.message);
                process.exit(1);
            }
        } else {
            supabaseUid = authData.user!.id;
            console.log('✅ Usuário criado no Supabase Auth:', supabaseUid);
        }

        // 5. Criar User no Prisma
        const user = await prisma.user.create({
            data: {
                tenantId: tenant.id,
                email: RESPONSIBLE_EMAIL,
                name: RESPONSIBLE_NAME,
                role: 'RESPONSIBLE',
                supabaseUid,
                isActive: true,
            },
        });
        console.log('✅ Usuário criado no Prisma com role RESPONSIBLE.');

        // 6. Criar vínculo StudentGuardian
        await prisma.studentGuardian.create({
            data: {
                tenantId: tenant.id,
                studentId: student.id,
                guardianId: user.id,
                relationship: RELATIONSHIP as any,
            },
        });
        console.log(`✅ Vínculo criado: ${RESPONSIBLE_NAME} → ${student.name} (${RELATIONSHIP})`);

        console.log('\n✅ Responsável de teste criado com sucesso!');
        console.log(`   Email: ${RESPONSIBLE_EMAIL}`);
        console.log(`   Senha: ${TEMP_PASSWORD}`);
        console.log(`   Role: RESPONSIBLE`);
        console.log(`   Tenant: ${tenant.name}`);
        console.log(`   Filho: ${student.name}`);

    } finally {
        await prisma.$disconnect();
    }
}

async function linkToStudent(prisma: PrismaClient, guardianId: string, tenantId: string) {
    const student = await prisma.student.findFirst({
        where: { tenantId },
        select: { id: true, name: true },
        orderBy: { createdAt: 'asc' },
    });

    if (!student) {
        console.error('❌ Nenhum aluno encontrado no tenant.');
        return;
    }

    // Check if link already exists
    const existingLink = await prisma.studentGuardian.findUnique({
        where: { studentId_guardianId: { studentId: student.id, guardianId } },
    });

    if (existingLink) {
        console.log(`✅ Vínculo já existe com: ${student.name}`);
        return;
    }

    await prisma.studentGuardian.create({
        data: {
            tenantId,
            studentId: student.id,
            guardianId,
            relationship: RELATIONSHIP as any,
        },
    });

    console.log(`✅ Vínculo criado com: ${student.name}`);
}

main().catch((err) => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
