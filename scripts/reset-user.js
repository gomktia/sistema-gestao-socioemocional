const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const email = 'admin@escola.com';
    console.log(`=== Resetting password for ${email} ===\n`);

    try {
        const { rows } = await pg.query("SELECT crypt('123456', gen_salt('bf')) as hash");
        const hash = rows[0].hash;

        await pg.query('UPDATE auth.users SET encrypted_password = $1 WHERE email = $2', [hash, email]);
        console.log('✓ encrypted_password updated.');

    } catch (e) {
        console.log('✗ Failed:', e.message);
    }

    await pg.end();
}

main().catch(console.error);
