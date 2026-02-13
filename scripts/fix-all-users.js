const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const tenantId = 'cmlikvzpv0000vv8k1qk2zi5i';
    const usersToFix = [
        { email: 'geisonhoehr@gmail.com', name: 'Geison SuperAdmin', role: 'ADMIN' },
        { email: 'psi@escola.com', name: 'Dr. Roberto Mendes', role: 'PSYCHOLOGIST' },
        { email: 'professor@escola.com', name: 'Prof. Marcos Souza', role: 'TEACHER' },
        { email: 'aluno@escola.com', name: 'Ana Beatriz Silva', role: 'STUDENT' }
    ];

    console.log('=== Iniciando Sincronização Global de Usuários ===\n');

    try {
        // 1. Gerar hash de senha padrão '123456'
        const { rows } = await pg.query("SELECT crypt('123456', gen_salt('bf')) as hash");
        const hash = rows[0].hash;
        console.log('✓ Hash padrão gerado.');

        for (const u of usersToFix) {
            console.log(`\nProcessando: ${u.email}...`);

            // 2. Garantir que exita no auth.users com a senha correta
            // Se não existir, o usuário precisa ser criado pelo painel do Supabase primeiro
            // mas vamos tentar atualizar os que já estão lá.
            const { rows: authUser } = await pg.query('SELECT id FROM auth.users WHERE email = $1', [u.email]);

            if (authUser.length === 0) {
                console.log(`  ⚠ Usuário ${u.email} não encontrado no sistema de Auth. Por favor, crie-o pelo painel do Supabase.`);
                continue;
            }

            const uid = authUser[0].id;
            const customId = 'c' + Math.random().toString(36).substring(2, 15).padEnd(12, '0') + Math.random().toString(36).substring(2, 15).padEnd(12, '0');

            // 3. Atualizar senha e confirmação no Auth
            await pg.query('UPDATE auth.users SET encrypted_password = $1, email_confirmed_at = now() WHERE id = $2', [hash, uid]);
            console.log('  ✓ Auth: Senha e Confirmação resetadas.');

            // 4. Limpar e Recriar no public.users
            await pg.query('DELETE FROM public.users WHERE email = $1', [u.email]);

            await pg.query(`
                INSERT INTO public.users (
                    id, email, name, role, "tenantId", "supabaseUid", "createdAt", "updatedAt"
                )
                VALUES ($1, $2, $3, $4, $5, $6, now(), now())
            `, [customId, u.email, u.name, u.role, tenantId, uid]);

            console.log(`  ✓ Público: Registro sincronizado com UID ${uid} e ID ${customId}.`);
        }

        console.log('\n=== Tudo pronto! Todos os usuários devem funcionar agora com a senha 123456 ===');

    } catch (e) {
        console.log('✗ Erro Crítico:', e.message);
    } finally {
        await pg.end();
    }
}

main().catch(console.error);
