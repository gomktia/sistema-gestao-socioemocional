const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const { rows } = await pg.query(`
    SELECT column_name, is_generated, generation_expression 
    FROM information_schema.columns 
    WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'confirmed_at'
  `);
    console.table(rows);

    await pg.end();
}

main().catch(console.error);
