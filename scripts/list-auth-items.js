const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    console.log('=== Listing tables in AUTH schema ===\n');
    const { rows } = await pg.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'auth'
  `);
    console.log(rows.map(r => r.table_name).join(', '));

    console.log('\n=== Checking for triggers in AUTH schema ===\n');
    const { rows: triggers } = await pg.query(`
    SELECT trigger_name, event_manipulation, event_object_table, action_statement
    FROM information_schema.triggers
    WHERE event_object_schema = 'auth'
  `);
    console.table(triggers);

    await pg.end();
}

main().catch(console.error);
