const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const { rows } = await pg.query('SELECT email, length(encrypted_password) as len, encrypted_password FROM auth.users WHERE email = \'admin@escola.com\'');
    console.table(rows);

    await pg.end();
}

main().catch(console.error);
