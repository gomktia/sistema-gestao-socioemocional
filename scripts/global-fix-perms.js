const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== GLOBAL PERMISSIONS FIX ===\n');

    const schemas = ['auth', 'public', 'extensions'];
    const roles = ['anon', 'authenticated', 'service_role', 'postgres', 'supabase_auth_admin'];

    for (const schema of schemas) {
        for (const role of roles) {
            try {
                await pg.query(`GRANT USAGE ON SCHEMA ${schema} TO ${role}`);
                console.log(`✓ SCHEMA ${schema} -> ROLE ${role}`);
            } catch (e) {
                // Many will fail because some roles are system roles, that's okay
            }
        }
    }

    // Grant ALL on auth schema tables to supabase_auth_admin
    const authTables = ['users', 'identities', 'sessions', 'refresh_tokens', 'instances', 'audit_log_entries'];
    for (const table of authTables) {
        try {
            await pg.query(`GRANT ALL ON auth.${table} TO supabase_auth_admin`);
            console.log(`✓ TABLE auth.${table} -> ALL to supabase_auth_admin`);
        } catch (e) { }
    }

    await pg.end();
}

main().catch(console.error);
