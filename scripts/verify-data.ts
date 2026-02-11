import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verify() {
  // 1. Tabelas
  const tables = await prisma.$queryRaw<{ table_name: string }[]>`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
  console.log('=== TABELAS (total: ' + tables.length + ') ===');
  tables.forEach(t => console.log(' ', t.table_name));

  // 2. Verificar dados de referência
  const viaItems = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) as count FROM via_question_items`;
  const srssItems = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) as count FROM srss_ie_items`;
  const cutoffs = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) as count FROM srss_ie_cutoffs`;
  const gradeConfig = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) as count FROM grade_focus_config`;
  const strengthMap = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*) as count FROM via_strength_mapping`;

  console.log('\n=== DADOS DE REFERÊNCIA ===');
  console.log(`  via_question_items: ${viaItems[0].count} itens (esperado: 71)`);
  console.log(`  srss_ie_items: ${srssItems[0].count} itens (esperado: 12)`);
  console.log(`  srss_ie_cutoffs: ${cutoffs[0].count} regras (esperado: 6)`);
  console.log(`  grade_focus_config: ${gradeConfig[0].count} alertas (esperado: 9)`);
  console.log(`  via_strength_mapping: ${strengthMap[0].count} forças (esperado: 24)`);

  // 3. Verificar RLS
  const rls = await prisma.$queryRaw<{ tablename: string; rowsecurity: boolean }[]>`
    SELECT tablename, rowsecurity FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT LIKE '_prisma%'
    ORDER BY tablename
  `;
  console.log('\n=== RLS STATUS ===');
  rls.forEach(r => console.log(`  ${r.tablename}: ${r.rowsecurity ? 'ON' : 'OFF'}`));

  // 4. Policies
  const policies = await prisma.$queryRaw<{ tablename: string; policyname: string }[]>`
    SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename
  `;
  console.log('\n=== POLICIES (' + policies.length + ') ===');
  policies.forEach(p => console.log(`  ${p.tablename} → ${p.policyname}`));

  // 5. Amostra de dados
  const sampleVia = await prisma.$queryRaw<{ item_number: number; text_pt: string; strength: string }[]>`
    SELECT item_number, text_pt, strength FROM via_question_items ORDER BY item_number LIMIT 5
  `;
  console.log('\n=== AMOSTRA VIA (primeiros 5) ===');
  sampleVia.forEach(i => console.log(`  Item ${i.item_number}: "${i.text_pt}" → ${i.strength}`));

  const sampleCutoffs = await prisma.$queryRaw<{ domain: string; tier: string; min_score: number; max_score: number; color: string }[]>`
    SELECT domain, tier, min_score, max_score, color FROM srss_ie_cutoffs ORDER BY domain, min_score
  `;
  console.log('\n=== PONTOS DE CORTE SRSS-IE ===');
  sampleCutoffs.forEach(c => console.log(`  ${c.domain} ${c.tier}: ${c.min_score}-${c.max_score} (${c.color})`));

  await prisma.$disconnect();
}

verify().catch(e => { console.error(e); process.exit(1); });
