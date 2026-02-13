const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== Attempting to FIX confirmed_at column ===\n');

    try {
        // Drop the generated column and recreate it as a regular one
        await pg.query('ALTER TABLE auth.users ALTER COLUMN confirmed_at DROP EXPRESSION');
        console.log('✓ Dropped generation expression from confirmed_at.');
    } catch (e) {
        console.log('✗ Failed:', e.message);
    }

    await pg.end();
}

main().catch(console.error);
