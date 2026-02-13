const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const email = 'admin@escola.com';
    console.log(`=== Checking Auth details for ${email} ===\n`);

    const { rows: userRows } = await pg.query('SELECT id, email, encrypted_password, raw_user_meta_data, raw_app_meta_data FROM auth.users WHERE email = $1', [email]);
    if (userRows.length === 0) {
        console.log('User not found in auth.users');
        await pg.end();
        return;
    }
    const user = userRows[0];
    console.log('User ID:', user.id);
    console.log('Metadata:', user.raw_user_meta_data);
    console.log('App Metadata:', user.raw_app_meta_data);
    console.log('Password Hash exists:', !!user.encrypted_password);

    const { rows: identityRows } = await pg.query('SELECT * FROM auth.identities WHERE user_id = $1', [user.id]);
    console.log('\nIdentities:', identityRows.length);
    console.table(identityRows.map(i => ({
        id: i.id,
        provider: i.provider,
        identity_data: i.identity_data,
        last_sign_in_at: i.last_sign_in_at
    })));

    await pg.end();
}

main().catch(console.error);
