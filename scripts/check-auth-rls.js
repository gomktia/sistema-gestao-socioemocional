const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== Checking RLS Policies on auth schema ===\n');
    const { rows } = await pg.query(`
    SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'auth'
  `);
    console.table(rows);

    await pg.end();
}

main().catch(console.error);
