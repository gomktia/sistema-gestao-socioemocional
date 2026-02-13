const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const { rows } = await pg.query('SELECT identity_data FROM auth.identities WHERE provider = \'email\' LIMIT 1');
    console.log('Identity Data (JSON):', JSON.stringify(rows[0].identity_data, null, 2));

    await pg.end();
}

main().catch(console.error);
