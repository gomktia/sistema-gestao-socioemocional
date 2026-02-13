const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres:Geison%402026@db.terwfdltjoiodcdzyctk.supabase.co:5432/postgres';

async function main() {
  const pg = new Client({ connectionString: DATABASE_URL });
  await pg.connect();

  // 1. Check if GoTrue can query - simulate its exact query pattern
  console.log('=== Simulating GoTrue queries ===\n');

  // GoTrue queries auth.users by email
  try {
    const { rows } = await pg.query(`
      SELECT * FROM auth.users WHERE email = 'geisonhoehr@gmail.com'
    `);
    console.log('1. SELECT auth.users by email: OK (' + rows.length + ' rows)');
  } catch(e) {
    console.log('1. SELECT auth.users: FAIL -', e.message);
  }

  // GoTrue also queries auth.identities
  try {
    const { rows } = await pg.query(`
      SELECT * FROM auth.identities WHERE user_id = (SELECT id FROM auth.users WHERE email = 'geisonhoehr@gmail.com')
    `);
    console.log('2. SELECT auth.identities: OK (' + rows.length + ' rows)');
  } catch(e) {
    console.log('2. SELECT auth.identities: FAIL -', e.message);
  }

  // 3. Check if supabase_auth_admin role exists and has proper permissions
  console.log('\n--- Checking supabase_auth_admin permissions...');
  try {
    const { rows } = await pg.query(`
      SELECT rolname, rolsuper, rolcanlogin FROM pg_roles WHERE rolname = 'supabase_auth_admin'
    `);
    if (rows.length > 0) {
      console.log('  Role exists:', rows[0]);
    } else {
      console.log('  ⚠ Role supabase_auth_admin NOT FOUND!');
    }
  } catch(e) {
    console.log('  Error:', e.message);
  }

  // 4. Check grants on auth.users for supabase_auth_admin
  console.log('\n--- Grants on auth.users...');
  try {
    const { rows } = await pg.query(`
      SELECT grantee, privilege_type
      FROM information_schema.role_table_grants
      WHERE table_schema = 'auth' AND table_name = 'users'
      AND grantee IN ('supabase_auth_admin', 'authenticated', 'anon', 'service_role')
      ORDER BY grantee, privilege_type
    `);
    rows.forEach(r => console.log(`  ${r.grantee}: ${r.privilege_type}`));
    if (rows.length === 0) console.log('  ⚠ NO GRANTS FOUND!');
  } catch(e) {
    console.log('  Error:', e.message);
  }

  // 5. Check grants on auth.identities
  console.log('\n--- Grants on auth.identities...');
  try {
    const { rows } = await pg.query(`
      SELECT grantee, privilege_type
      FROM information_schema.role_table_grants
      WHERE table_schema = 'auth' AND table_name = 'identities'
      AND grantee IN ('supabase_auth_admin', 'authenticated', 'anon', 'service_role')
      ORDER BY grantee, privilege_type
    `);
    rows.forEach(r => console.log(`  ${r.grantee}: ${r.privilege_type}`));
  } catch(e) {
    console.log('  Error:', e.message);
  }

  // 6. Check grants on public.users (GoTrue might query this too for hooks)
  console.log('\n--- Grants on public.users...');
  try {
    const { rows } = await pg.query(`
      SELECT grantee, privilege_type
      FROM information_schema.role_table_grants
      WHERE table_schema = 'public' AND table_name = 'users'
      AND grantee IN ('supabase_auth_admin', 'authenticated', 'anon', 'service_role', 'postgres')
      ORDER BY grantee, privilege_type
    `);
    rows.forEach(r => console.log(`  ${r.grantee}: ${r.privilege_type}`));
  } catch(e) {
    console.log('  Error:', e.message);
  }

  // 7. Check if there are database hooks/triggers on auth schema
  console.log('\n--- Auth hooks config...');
  try {
    const { rows } = await pg.query(`
      SELECT * FROM auth.hooks WHERE enabled = true
    `);
    rows.forEach(r => console.log(`  Hook: ${r.hook_table_id} -> ${r.hook_function_id}`));
    if (rows.length === 0) console.log('  No auth hooks');
  } catch(e) {
    console.log('  Table auth.hooks not found or error:', e.message);
  }

  // 8. Check Supabase auth config
  console.log('\n--- Auth config...');
  try {
    const { rows } = await pg.query(`SELECT * FROM auth.config LIMIT 1`);
    if (rows.length > 0) console.log('  Config:', JSON.stringify(rows[0]).substring(0, 200));
  } catch(e) {
    // This table might not exist
    console.log('  auth.config not available');
  }

  // 9. Try to set role and query like GoTrue does
  console.log('\n--- Simulating GoTrue connection...');
  try {
    await pg.query(`SET ROLE supabase_auth_admin`);
    const { rows } = await pg.query(`SELECT id, email FROM auth.users LIMIT 1`);
    console.log('  Query as supabase_auth_admin: OK', rows[0]?.email);
    await pg.query(`RESET ROLE`);
  } catch(e) {
    console.log('  FAIL as supabase_auth_admin:', e.message);
    await pg.query(`RESET ROLE`).catch(() => {});
  }

  // 10. Try querying public.users as supabase_auth_admin
  console.log('\n--- Querying public.users as supabase_auth_admin...');
  try {
    await pg.query(`SET ROLE supabase_auth_admin`);
    const { rows } = await pg.query(`SELECT id, email FROM public.users LIMIT 1`);
    console.log('  Query public.users: OK', rows[0]?.email);
    await pg.query(`RESET ROLE`);
  } catch(e) {
    console.log('  ⚠ FAIL:', e.message);
    await pg.query(`RESET ROLE`).catch(() => {});
  }

  await pg.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
