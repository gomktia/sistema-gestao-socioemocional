const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== Attempting to RESTORE email uniqueness ===\n');

    try {
        // 1. Double check for duplicates
        const { rows: dups } = await pg.query('SELECT email, count(*) FROM auth.users GROUP BY email HAVING count(*) > 1');
        if (dups.length > 0) {
            console.log('✗ DUPLICATES FOUND! Manual cleanup required.');
            console.table(dups);
        } else {
            console.log('✓ No duplicates found.');

            // 2. Add Unique constraint
            await pg.query('ALTER TABLE auth.users ADD CONSTRAINT users_email_partial_key UNIQUE (email)');
            console.log('✓ Unique constraint added to auth.users(email).');
        }
    } catch (e) {
        console.log('✗ Failed:', e.message);
    }

    await pg.end();
}

main().catch(console.error);
