/**
 * Script para alterar a senha do usuário "pai" (teste) diretamente no Supabase Auth.
 * Útil quando o e-mail é de teste e não recebe links de redefinição.
 *
 * Uso:
 *   npx tsx scripts/set-pai-password.ts
 *
 * Requer: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY no .env
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// Config — edite aqui
// ============================================================
const PAI_EMAIL = 'pai.teste@triavium.com.br';
const NEW_PASSWORD = '12345678'; // mínimo 8 caracteres (exigido pelo sistema)
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
        const user = await prisma.user.findFirst({
            where: { email: PAI_EMAIL },
            select: { id: true, name: true, email: true, supabaseUid: true },
        });

        if (!user) {
            console.error(`❌ Usuário com e-mail ${PAI_EMAIL} não encontrado.`);
            process.exit(1);
        }

        if (!user.supabaseUid) {
            console.error('❌ Usuário não possui supabaseUid vinculado.');
            process.exit(1);
        }

        const { error } = await supabase.auth.admin.updateUserById(user.supabaseUid, {
            password: NEW_PASSWORD,
        });

        if (error) {
            console.error('❌ Erro ao atualizar senha:', error.message);
            process.exit(1);
        }

        console.log('\n✅ Senha alterada com sucesso!');
        console.log(`   Usuário: ${user.name} (${user.email})`);
        console.log(`   Nova senha: ${NEW_PASSWORD}`);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((err) => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
