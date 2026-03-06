/**
 * Script para adicionar um Super Admin ao sistema.
 *
 * Uso:
 *   npx tsx scripts/add-super-admin.ts
 *
 * O que faz:
 *   1. Cria o usuário no Supabase Auth com senha temporária
 *   2. Cria o registro User no Prisma com role ADMIN
 *   3. Dispara email de redefinição de senha
 *
 * Requer as env vars: DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// ============================================================
// Config — edite aqui
// ============================================================
const NEW_ADMIN_EMAIL = 'medeiros@marciomedeiros.org';
const NEW_ADMIN_NAME = 'Márcio Medeiros';
const TEMP_PASSWORD = 'Triavium@2026!tmp'; // será trocada no primeiro acesso
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
            where: { email: NEW_ADMIN_EMAIL },
        });

        if (existing) {
            console.log(`⚠️  Usuário ${NEW_ADMIN_EMAIL} já existe no Prisma (role: ${existing.role}).`);
            if (existing.role !== 'ADMIN') {
                await prisma.user.update({
                    where: { id: existing.id },
                    data: { role: 'ADMIN' },
                });
                console.log('✅ Role atualizada para ADMIN.');
            }
            return;
        }

        // 2. Buscar um tenant para associar
        const tenant = await prisma.tenant.findFirst({
            orderBy: { createdAt: 'asc' },
            select: { id: true, name: true },
        });

        if (!tenant) {
            console.error('❌ Nenhum tenant encontrado no banco.');
            process.exit(1);
        }

        console.log(`📍 Usando tenant: ${tenant.name} (${tenant.id})`);

        // 3. Criar no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: NEW_ADMIN_EMAIL,
            password: TEMP_PASSWORD,
            email_confirm: true,
        });

        if (authError) {
            if (authError.message?.includes('already been registered')) {
                console.log('ℹ️  Usuário já existe no Supabase Auth. Prosseguindo...');
                // Buscar UID existente
                const { data: listData } = await supabase.auth.admin.listUsers();
                const existingAuth = listData?.users?.find(u => u.email === NEW_ADMIN_EMAIL);
                if (existingAuth) {
                    await createPrismaUser(prisma, tenant.id, existingAuth.id);
                }
            } else {
                console.error('❌ Erro ao criar no Supabase Auth:', authError.message);
                process.exit(1);
            }
        } else if (authData.user) {
            console.log('✅ Usuário criado no Supabase Auth:', authData.user.id);
            await createPrismaUser(prisma, tenant.id, authData.user.id);
        }

        // 4. Enviar email de redefinição de senha
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://triavium.com.br';

        const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: NEW_ADMIN_EMAIL,
            options: {
                redirectTo: `${appUrl}/auth/callback?next=/redefinir-senha`,
            },
        });

        if (resetError) {
            console.error('⚠️  Erro ao gerar link de redefinição:', resetError.message);
            console.log(`👉 Senha temporária: ${TEMP_PASSWORD}`);
            console.log('👉 O usuário pode usar "Esqueci minha senha" no login para redefinir.');
            return;
        }

        const resetLink = resetData?.properties?.action_link;

        if (resetLink && process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'Triavium <noreply@triavium.com.br>',
                to: NEW_ADMIN_EMAIL,
                subject: 'Bem-vindo ao Triavium — Defina sua senha',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900;">Triavium</h1>
                        </div>
                        <div style="padding: 32px; background: white; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                                Olá, <strong>${NEW_ADMIN_NAME}</strong>!
                            </p>
                            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                                Sua conta de administrador foi criada no sistema Triavium. Clique no botão abaixo para definir sua senha:
                            </p>
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${resetLink}" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
                                    Definir Minha Senha
                                </a>
                            </div>
                            <p style="color: #94a3b8; font-size: 13px;">
                                Este link expira em 1 hora. Se expirar, use "Esqueci minha senha" na tela de login.
                            </p>
                        </div>
                    </div>
                `,
            });
            console.log('📧 Email de redefinição enviado para', NEW_ADMIN_EMAIL);
        } else {
            console.log('⚠️  RESEND_API_KEY não configurada. Email não enviado.');
            console.log(`👉 Link de redefinição: ${resetLink || 'não gerado'}`);
            console.log(`👉 Senha temporária: ${TEMP_PASSWORD}`);
        }

        console.log('\n✅ Super Admin criado com sucesso!');
        console.log(`   Email: ${NEW_ADMIN_EMAIL}`);
        console.log(`   Role: ADMIN`);
        console.log(`   Tenant: ${tenant.name}`);

    } finally {
        await prisma.$disconnect();
    }
}

async function createPrismaUser(prisma: PrismaClient, tenantId: string, supabaseUid: string) {
    await prisma.user.create({
        data: {
            tenantId,
            email: NEW_ADMIN_EMAIL,
            name: NEW_ADMIN_NAME,
            role: 'ADMIN',
            supabaseUid,
            isActive: true,
        },
    });
    console.log('✅ Usuário criado no Prisma com role ADMIN.');
}

main().catch((err) => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
