const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== Attempting to FIX Auth Schema Grants ===\n');

    const queries = [
        // Grant USAGE on auth schema
        `GRANT USAGE ON SCHEMA auth TO supabase_auth_admin, anon, authenticated, service_role;`,

        // Grant SELECT on users and identities (GoTrue needs this)
        `GRANT ALL ON auth.users TO supabase_auth_admin;`,
        `GRANT ALL ON auth.identities TO supabase_auth_admin;`,
        `GRANT ALL ON auth.sessions TO supabase_auth_admin;`,
        `GRANT ALL ON auth.refresh_tokens TO supabase_auth_admin;`,
        `GRANT ALL ON auth.instances TO supabase_auth_admin;`,
        `GRANT ALL ON auth.audit_log_errors TO supabase_auth_admin;`,

        // Auth schema tables often needed by others
        `GRANT SELECT ON auth.users TO anon, authenticated, service_role;`,
        `GRANT SELECT ON auth.identities TO anon, authenticated, service_role;`,

        // Ensure public schema has standard grants too
        `GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;`,
        `GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;`,
        `GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;`,
    ];

    for (const q of queries) {
        try {
            await pg.query(q);
            console.log(`✓ Executed: ${q.substring(0, 50)}...`);
        } catch (e) {
            console.log(`✗ Failed: ${q.substring(0, 50)}... - ${e.message}`);
        }
    }

    await pg.end();
    console.log('\nGrants fix completed.');
}

main().catch(console.error);
