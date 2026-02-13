const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const email = 'admin@escola.com';
    console.log(`=== Checking IDs for ${email} ===\n`);

    const { rows: u } = await pg.query('SELECT id FROM auth.users WHERE email = $1', [email]);
    const uid = u[0].id;

    const { rows: i } = await pg.query('SELECT user_id, identity_data FROM auth.identities WHERE user_id = $1', [uid]);

    console.log('User UID:', uid);
    console.log('Identity user_id:', i[0].user_id);
    console.log('Identity Data Sub:', i[0].identity_data.sub);

    if (uid !== i[0].user_id || uid !== i[0].identity_data.sub) {
        console.log('❌ MISMATCH DETECTED!');
    } else {
        console.log('✓ IDs match.');
    }

    await pg.end();
}

main().catch(console.error);
