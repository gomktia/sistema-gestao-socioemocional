const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const { rows } = await pg.query('SELECT * FROM pg_extension WHERE extname = \'pgcrypto\'');
    if (rows.length > 0) {
        console.log('✓ pgcrypto is installed.');
    } else {
        console.log('✗ pgcrypto is MISSING!');
    }

    await pg.end();
}

main().catch(console.error);
