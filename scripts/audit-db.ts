import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function audit() {
  // 1. Listar tabelas
  const tables = await prisma.$queryRaw<{ table_name: string }[]>`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
  console.log('=== TABELAS ===');
  tables.forEach(t => console.log(' ', t.table_name));

  // 2. Listar enums
  const enums = await prisma.$queryRaw<{ typname: string; enumlabel: string }[]>`
    SELECT t.typname, e.enumlabel
    FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid
    ORDER BY t.typname, e.enumsortorder
  `;
  console.log('\n=== ENUMS ===');
  const grouped: Record<string, string[]> = {};
  enums.forEach(e => {
    if (!grouped[e.typname]) grouped[e.typname] = [];
    grouped[e.typname].push(e.enumlabel);
  });
  Object.entries(grouped).forEach(([name, vals]) => {
    console.log(`  ${name}: ${vals.join(', ')}`);
  });

  // 3. RLS status
  const rls = await prisma.$queryRaw<{ tablename: string; rowsecurity: boolean }[]>`
    SELECT tablename, rowsecurity FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT LIKE '_prisma%'
    ORDER BY tablename
  `;
  console.log('\n=== RLS STATUS ===');
  rls.forEach(r => console.log(`  ${r.tablename}: RLS ${r.rowsecurity ? 'ON' : 'OFF'}`));

  // 4. Policies
  const policies = await prisma.$queryRaw<{ tablename: string; policyname: string; cmd: string }[]>`
    SELECT tablename, policyname, cmd FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname
  `;
  console.log('\n=== POLICIES ===');
  policies.forEach(p => console.log(`  ${p.tablename} → ${p.policyname} (${p.cmd})`));

  // 5. Triggers
  const triggers = await prisma.$queryRaw<{ trigger_name: string; event_object_table: string }[]>`
    SELECT trigger_name, event_object_table FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table
  `;
  console.log('\n=== TRIGGERS ===');
  triggers.forEach(t => console.log(`  ${t.event_object_table} → ${t.trigger_name}`));

  // 6. Colunas das tabelas principais
  for (const table of ['assessments', 'students', 'intervention_logs']) {
    const cols = await prisma.$queryRaw<{ column_name: string; data_type: string; udt_name: string; is_nullable: string }[]>`
      SELECT column_name, data_type, udt_name, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${table}
      ORDER BY ordinal_position
    `;
    console.log(`\n=== COLUNAS: ${table} ===`);
    cols.forEach(c => console.log(`  ${c.column_name} (${c.udt_name}) ${c.is_nullable === 'NO' ? 'NOT NULL' : 'nullable'}`));
  }

  await prisma.$disconnect();
}

audit().catch(e => { console.error(e); process.exit(1); });
