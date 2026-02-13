const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const { rows } = await pg.query('SHOW search_path');
    console.log('Current search_path:', rows[0].search_path);

    const { rows: dbConfig } = await pg.query('SELECT datname, datconfig FROM pg_database WHERE datname = current_database()');
    console.log('Database Config:', dbConfig[0].datconfig);

    await pg.end();
}

main().catch(console.error);
