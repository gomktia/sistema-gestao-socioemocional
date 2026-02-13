const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== Granting to AUTHENTICATOR role ===\n');

    try {
        await pg.query('GRANT USAGE ON SCHEMA auth, public, extensions TO authenticator');
        console.log('✓ USAGE granted to authenticator.');

        await pg.query('GRANT supabase_auth_admin, anon, authenticated, service_role TO authenticator');
        console.log('✓ Roles granted to authenticator.');
    } catch (e) {
        console.log('✗ Failed:', e.message);
    }

    await pg.end();
}

main().catch(console.error);
