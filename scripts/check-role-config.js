const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const { rows } = await pg.query('SELECT rolname, rolconfig FROM pg_roles WHERE rolname = \'supabase_auth_admin\'');
    console.log('Role Config:', rows[0].rolconfig);

    await pg.end();
}

main().catch(console.error);
