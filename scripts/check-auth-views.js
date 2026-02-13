const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== Checking for Views in auth schema ===\n');
    const { rows } = await pg.query(`
    SELECT table_name 
    FROM information_schema.views 
    WHERE table_schema = 'auth'
  `);
    console.table(rows);

    await pg.end();
}

main().catch(console.error);
