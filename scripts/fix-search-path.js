const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== Checking and FIXING Search Paths ===\n');

    const queries = [
        // Ensure auth schema is in the search path for auth admin
        `ALTER ROLE supabase_auth_admin SET search_path TO auth, public;`,
        `ALTER ROLE authenticated SET search_path TO public, auth;`,
        `ALTER ROLE anon SET search_path TO public, auth;`,
        `ALTER ROLE service_role SET search_path TO public, auth;`,

        // Also set it for the postgres user just in case
        `ALTER ROLE postgres SET search_path TO public, auth, extensions;`,

        // Grant usage on extensions if they exist
        `GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;`
    ];

    for (const q of queries) {
        try {
            await pg.query(q);
            console.log(`✓ Executed: ${q}`);
        } catch (e) {
            console.log(`✗ Failed: ${q} - ${e.message}`);
        }
    }

    // Check current search path for session
    const { rows } = await pg.query('SHOW search_path');
    console.log('\nCurrent Search Path (postgres):', rows[0].search_path);

    await pg.end();
}

main().catch(console.error);
