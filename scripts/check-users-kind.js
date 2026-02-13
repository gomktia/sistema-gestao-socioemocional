const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
    const pg = new Client({ connectionString: DATABASE_URL });
    await pg.connect();

    const { rows } = await pg.query(`
    SELECT relname, relkind 
    FROM pg_class 
    JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid 
    WHERE nspname = 'auth' AND relname = 'users'
  `);
    console.table(rows);
    // relkind: r = ordinary table, v = view, m = materialized view, c = composite type, f = foreign table, p = partitioned table

    await pg.end();
}

main().catch(console.error);
