const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== Checking for triggers on auth.users ===\n');
    const { rows } = await pg.query(`
    SELECT tgname, tgenabled, tgtype, relname
    FROM pg_trigger 
    JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
    JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
    WHERE nspname = 'auth' AND relname = 'users'
  `);
    console.table(rows);

    await pg.end();
}

main().catch(console.error);
