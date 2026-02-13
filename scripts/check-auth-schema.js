const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const { rows } = await pg.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = \'auth\' AND table_name = \'users\'');
    console.log('Columns in auth.users:');
    console.table(rows);

    await pg.end();
}

main().catch(console.error);
