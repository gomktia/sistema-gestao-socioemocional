# Intervention Monitoring Dashboard — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dedicated dashboard page at `/dashboard/intervencoes` for MANAGER/ADMIN to track intervention efficacy through KPIs, tier migration charts, and per-group before/after comparisons.

**Architecture:** New page under existing `(portal)` route group. Pure calculation functions in `lib/intervention-monitoring.ts` (testable). Server action in `app/actions/reports.ts` for data fetching. Three new client/server components in `components/dashboard/`. Uses Recharts (already installed) for charts.

**Tech Stack:** Next.js 15, React 19, TypeScript, Prisma 6, Recharts, Tailwind CSS, shadcn/ui, Vitest

---

### Task 1: Pure calculation functions with tests

**Files:**
- Create: `lib/intervention-monitoring.ts`
- Create: `__tests__/intervention-monitoring.test.ts`

**Step 1: Write the failing tests**

Create `__tests__/intervention-monitoring.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  calculateTierMigration,
  calculateGroupEfficacy,
  tierToNumber,
} from '@/lib/intervention-monitoring';

describe('tierToNumber', () => {
  it('maps TIER_1 to 1, TIER_2 to 2, TIER_3 to 3', () => {
    expect(tierToNumber('TIER_1')).toBe(1);
    expect(tierToNumber('TIER_2')).toBe(2);
    expect(tierToNumber('TIER_3')).toBe(3);
  });

  it('returns 0 for null/undefined', () => {
    expect(tierToNumber(null)).toBe(0);
    expect(tierToNumber(undefined)).toBe(0);
  });
});

describe('calculateTierMigration', () => {
  it('counts improved, unchanged, worsened for matching students', () => {
    const before = [
      { studentId: 'a', tier: 'TIER_3' },
      { studentId: 'b', tier: 'TIER_2' },
      { studentId: 'c', tier: 'TIER_1' },
      { studentId: 'd', tier: 'TIER_2' },
    ];
    const after = [
      { studentId: 'a', tier: 'TIER_2' }, // improved
      { studentId: 'b', tier: 'TIER_2' }, // unchanged
      { studentId: 'c', tier: 'TIER_2' }, // worsened
      { studentId: 'd', tier: 'TIER_1' }, // improved
    ];
    const result = calculateTierMigration(before, after);
    expect(result.improved).toBe(2);
    expect(result.unchanged).toBe(1);
    expect(result.worsened).toBe(1);
    expect(result.total).toBe(4);
  });

  it('only counts students present in both sets', () => {
    const before = [
      { studentId: 'a', tier: 'TIER_3' },
      { studentId: 'b', tier: 'TIER_2' },
    ];
    const after = [
      { studentId: 'a', tier: 'TIER_1' }, // improved
      { studentId: 'c', tier: 'TIER_1' }, // not in before, ignored
    ];
    const result = calculateTierMigration(before, after);
    expect(result.improved).toBe(1);
    expect(result.unchanged).toBe(0);
    expect(result.worsened).toBe(0);
    expect(result.total).toBe(1);
  });

  it('returns zeros for empty arrays', () => {
    const result = calculateTierMigration([], []);
    expect(result.improved).toBe(0);
    expect(result.unchanged).toBe(0);
    expect(result.worsened).toBe(0);
    expect(result.total).toBe(0);
  });
});

describe('calculateGroupEfficacy', () => {
  it('calculates percentage improved correctly', () => {
    const students = [
      { studentId: 'a', tierBefore: 'TIER_3', tierAfter: 'TIER_2' },
      { studentId: 'b', tierBefore: 'TIER_2', tierAfter: 'TIER_1' },
      { studentId: 'c', tierBefore: 'TIER_2', tierAfter: 'TIER_2' },
      { studentId: 'd', tierBefore: 'TIER_1', tierAfter: 'TIER_2' },
    ];
    const result = calculateGroupEfficacy(students);
    expect(result.improved).toBe(2);
    expect(result.unchanged).toBe(1);
    expect(result.worsened).toBe(1);
    expect(result.percentImproved).toBe(50);
  });

  it('returns 0% for empty array', () => {
    const result = calculateGroupEfficacy([]);
    expect(result.improved).toBe(0);
    expect(result.percentImproved).toBe(0);
  });

  it('returns 100% when all improved', () => {
    const students = [
      { studentId: 'a', tierBefore: 'TIER_3', tierAfter: 'TIER_1' },
      { studentId: 'b', tierBefore: 'TIER_2', tierAfter: 'TIER_1' },
    ];
    const result = calculateGroupEfficacy(students);
    expect(result.percentImproved).toBe(100);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run __tests__/intervention-monitoring.test.ts`
Expected: FAIL — module not found

**Step 3: Write minimal implementation**

Create `lib/intervention-monitoring.ts`:

```typescript
// Pure functions for intervention monitoring calculations.
// No server-side dependencies — fully testable.

interface TierEntry {
  studentId: string;
  tier: string;
}

interface GroupStudentEntry {
  studentId: string;
  tierBefore: string;
  tierAfter: string;
}

interface MigrationResult {
  improved: number;
  unchanged: number;
  worsened: number;
  total: number;
}

interface EfficacyResult {
  improved: number;
  unchanged: number;
  worsened: number;
  percentImproved: number;
}

/** Convert tier string to numeric value for comparison. Lower = better. */
export function tierToNumber(tier: string | null | undefined): number {
  if (!tier) return 0;
  const map: Record<string, number> = { TIER_1: 1, TIER_2: 2, TIER_3: 3 };
  return map[tier] ?? 0;
}

/**
 * Compare tiers between two screening windows for the same students.
 * Only students present in both arrays are counted.
 */
export function calculateTierMigration(
  before: TierEntry[],
  after: TierEntry[]
): MigrationResult {
  const afterMap = new Map(after.map((e) => [e.studentId, e.tier]));

  let improved = 0;
  let unchanged = 0;
  let worsened = 0;

  for (const entry of before) {
    const afterTier = afterMap.get(entry.studentId);
    if (afterTier === undefined) continue;

    const bNum = tierToNumber(entry.tier);
    const aNum = tierToNumber(afterTier);

    if (aNum < bNum) improved++;
    else if (aNum === bNum) unchanged++;
    else worsened++;
  }

  return { improved, unchanged, worsened, total: improved + unchanged + worsened };
}

/**
 * Calculate efficacy for a single intervention group.
 * Each entry has the student's tier before joining the group and their current tier.
 */
export function calculateGroupEfficacy(
  students: GroupStudentEntry[]
): EfficacyResult {
  if (students.length === 0) {
    return { improved: 0, unchanged: 0, worsened: 0, percentImproved: 0 };
  }

  let improved = 0;
  let unchanged = 0;
  let worsened = 0;

  for (const s of students) {
    const bNum = tierToNumber(s.tierBefore);
    const aNum = tierToNumber(s.tierAfter);

    if (aNum < bNum) improved++;
    else if (aNum === bNum) unchanged++;
    else worsened++;
  }

  const percentImproved = Math.round((improved / students.length) * 100);
  return { improved, unchanged, worsened, percentImproved };
}
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run __tests__/intervention-monitoring.test.ts`
Expected: 8 tests PASS

**Step 5: Commit**

```bash
git add lib/intervention-monitoring.ts __tests__/intervention-monitoring.test.ts
git commit -m "feat: add pure calculation functions for intervention monitoring"
```

---

### Task 2: Server action for monitoring data

**Files:**
- Modify: `app/actions/reports.ts` (append new function at end)

**Step 1: Add `getInterventionMonitoringData` to `app/actions/reports.ts`**

Append after the existing `saveProfessionalOpinion` function (after line 252):

```typescript
// ============================================================
// Intervention Monitoring Data
// ============================================================

import { calculateTierMigration, calculateGroupEfficacy } from '@/lib/intervention-monitoring';

interface InterventionMonitoringData {
  kpis: {
    totalTier3: number;
    migrationPositivePercent: number;
    migrationNegativePercent: number;
    activeGroups: number;
  };
  tierMigration: {
    label: string;
    improved: number;
    unchanged: number;
    worsened: number;
  }[];
  groupEfficacy: {
    id: string;
    name: string;
    type: string;
    studentCount: number;
    percentImproved: number;
    percentUnchanged: number;
    percentWorsened: number;
  }[];
}

export async function getInterventionMonitoringData(): Promise<InterventionMonitoringData | null> {
  const user = await getCurrentUser();
  const allowedRoles = [UserRole.MANAGER, UserRole.ADMIN];

  if (!user || !allowedRoles.includes(user.role)) return null;

  const currentYear = new Date().getFullYear();

  // 1. Fetch all SRSS-IE assessments for this year, grouped by student+window
  const assessments = await prisma.assessment.findMany({
    where: {
      tenantId: user.tenantId,
      type: 'SRSS_IE',
      academicYear: currentYear,
      overallTier: { not: null },
    },
    select: {
      studentId: true,
      screeningWindow: true,
      overallTier: true,
    },
    orderBy: { appliedAt: 'desc' },
  });

  // Deduplicate: keep latest per student+window
  const latestByStudentWindow = new Map<string, { studentId: string; tier: string }>();
  for (const a of assessments) {
    const key = `${a.studentId}-${a.screeningWindow}`;
    if (!latestByStudentWindow.has(key)) {
      latestByStudentWindow.set(key, { studentId: a.studentId, tier: a.overallTier! });
    }
  }

  // Group by window
  const byWindow: Record<string, { studentId: string; tier: string }[]> = {
    DIAGNOSTIC: [],
    MONITORING: [],
    FINAL: [],
  };
  for (const [key, entry] of latestByStudentWindow) {
    const window = key.split('-').pop()!;
    if (byWindow[window]) byWindow[window].push(entry);
  }

  // 2. Calculate tier migrations between consecutive windows
  const windowPairs = [
    { before: 'DIAGNOSTIC', after: 'MONITORING', label: 'Mar → Jun' },
    { before: 'MONITORING', after: 'FINAL', label: 'Jun → Out' },
  ];

  const tierMigration = windowPairs
    .map((pair) => {
      const result = calculateTierMigration(byWindow[pair.before], byWindow[pair.after]);
      return { label: pair.label, ...result };
    })
    .filter((m) => m.total > 0);

  // 3. KPIs
  // Current Tier 3 count: from the most recent window with data
  const latestWindow = byWindow.FINAL.length > 0
    ? byWindow.FINAL
    : byWindow.MONITORING.length > 0
      ? byWindow.MONITORING
      : byWindow.DIAGNOSTIC;

  const totalTier3 = latestWindow.filter((e) => e.tier === 'TIER_3').length;

  // Overall migration: compare earliest window with data to latest
  const earliestWindow = byWindow.DIAGNOSTIC.length > 0
    ? byWindow.DIAGNOSTIC
    : byWindow.MONITORING.length > 0
      ? byWindow.MONITORING
      : byWindow.FINAL;

  const overallMigration = calculateTierMigration(earliestWindow, latestWindow);
  const migrationPositivePercent = overallMigration.total > 0
    ? Math.round((overallMigration.improved / overallMigration.total) * 100)
    : 0;
  const migrationNegativePercent = overallMigration.total > 0
    ? Math.round((overallMigration.worsened / overallMigration.total) * 100)
    : 0;

  // 4. Active groups count
  const activeGroups = await prisma.interventionGroup.count({
    where: { tenantId: user.tenantId, isActive: true },
  });

  // 5. Group efficacy: for each active group, compare before/after tiers
  const groups = await prisma.interventionGroup.findMany({
    where: { tenantId: user.tenantId, isActive: true },
    include: {
      students: {
        select: { id: true, name: true },
      },
    },
  });

  const groupEfficacy = groups.map((group) => {
    const studentEntries = group.students.map((student) => {
      // Find this student's earliest and latest tier
      const studentAssessments = assessments.filter((a) => a.studentId === student.id);
      const earliest = studentAssessments[studentAssessments.length - 1];
      const latest = studentAssessments[0];

      return {
        studentId: student.id,
        tierBefore: earliest?.overallTier || 'TIER_1',
        tierAfter: latest?.overallTier || earliest?.overallTier || 'TIER_1',
      };
    });

    const efficacy = calculateGroupEfficacy(studentEntries);

    return {
      id: group.id,
      name: group.name,
      type: group.type,
      studentCount: group.students.length,
      percentImproved: efficacy.percentImproved,
      percentUnchanged: group.students.length > 0
        ? Math.round((efficacy.unchanged / group.students.length) * 100)
        : 0,
      percentWorsened: group.students.length > 0
        ? Math.round((efficacy.worsened / group.students.length) * 100)
        : 0,
    };
  });

  return {
    kpis: { totalTier3, migrationPositivePercent, migrationNegativePercent, activeGroups },
    tierMigration,
    groupEfficacy,
  };
}
```

**Important:** The `import` for `calculateTierMigration` and `calculateGroupEfficacy` must go at the top of the file with the other imports (near line 4-7). The `UserRole` import already exists.

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add app/actions/reports.ts
git commit -m "feat: add getInterventionMonitoringData server action"
```

---

### Task 3: KPICard component

**Files:**
- Create: `components/dashboard/KPICard.tsx`

**Step 1: Create the component**

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'emerald' | 'amber' | 'red' | 'indigo';
}

const COLOR_MAP = {
  emerald: {
    bg: 'from-emerald-50 to-emerald-50/30',
    icon: 'text-emerald-600 bg-emerald-100',
    value: 'text-emerald-900',
    label: 'text-emerald-600',
  },
  amber: {
    bg: 'from-amber-50 to-amber-50/30',
    icon: 'text-amber-600 bg-amber-100',
    value: 'text-amber-900',
    label: 'text-amber-600',
  },
  red: {
    bg: 'from-red-50 to-red-50/30',
    icon: 'text-red-600 bg-red-100',
    value: 'text-red-900',
    label: 'text-red-600',
  },
  indigo: {
    bg: 'from-indigo-50 to-indigo-50/30',
    icon: 'text-indigo-600 bg-indigo-100',
    value: 'text-indigo-900',
    label: 'text-indigo-600',
  },
};

export function KPICard({ label, value, icon: Icon, color }: KPICardProps) {
  const c = COLOR_MAP[color];

  return (
    <Card className={`border-none bg-gradient-to-br ${c.bg} shadow-[0_8px_30px_rgb(0,0,0,0.04)]`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 rounded-xl ${c.icon} flex items-center justify-center`}>
            <Icon size={20} />
          </div>
          <div>
            <p className={`text-2xl font-black tracking-tight ${c.value}`}>{value}</p>
            <p className={`text-[10px] font-extrabold uppercase tracking-[0.15em] ${c.label}`}>
              {label}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/dashboard/KPICard.tsx
git commit -m "feat: add KPICard component for dashboard metrics"
```

---

### Task 4: TierMigrationChart component

**Files:**
- Create: `components/dashboard/TierMigrationChart.tsx`

**Step 1: Create the component**

This is a client component using Recharts (already installed — used by `RiskEvolutionChart.tsx`). It renders a grouped bar chart showing improved/unchanged/worsened per window transition.

```tsx
'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TierMigrationChartProps {
  data: {
    label: string;
    improved: number;
    unchanged: number;
    worsened: number;
  }[];
}

export function TierMigrationChart({ data }: TierMigrationChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-400 text-sm font-medium">
        Dados insuficientes. Necessárias ao menos 2 janelas de triagem.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="gradImproved" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="gradUnchanged" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity={1} />
              <stop offset="100%" stopColor="#64748b" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="gradWorsened" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: 600,
            }}
            cursor={{ fill: '#f8fafc', radius: 8 }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}
          />
          <Bar
            dataKey="improved"
            name="Melhorou"
            fill="url(#gradImproved)"
            radius={[8, 8, 0, 0]}
            barSize={48}
          />
          <Bar
            dataKey="unchanged"
            name="Manteve"
            fill="url(#gradUnchanged)"
            radius={[8, 8, 0, 0]}
            barSize={48}
          />
          <Bar
            dataKey="worsened"
            name="Piorou"
            fill="url(#gradWorsened)"
            radius={[8, 8, 0, 0]}
            barSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/dashboard/TierMigrationChart.tsx
git commit -m "feat: add TierMigrationChart component with Recharts"
```

---

### Task 5: GroupEfficacyTable component

**Files:**
- Create: `components/dashboard/GroupEfficacyTable.tsx`

**Step 1: Create the component**

This is a server component (no 'use client'). It renders a table of intervention groups with efficacy percentages.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users2 } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  SOCIAL_SKILLS_GROUP: 'Habilidades Sociais',
  EMOTION_REGULATION: 'Regulação Emocional',
  CAREER_GUIDANCE: 'Orientação Vocacional',
  PEER_MENTORING: 'Mentoria entre Pares',
  STUDY_SKILLS: 'Habilidades de Estudo',
  CHECK_IN_CHECK_OUT: 'Check-in / Check-out',
  FAMILY_MEETING: 'Reunião Familiar',
  INDIVIDUAL_PLAN: 'Plano Individual',
  PSYCHOLOGIST_REFERRAL: 'Encaminhamento Psicólogo',
  EXTERNAL_REFERRAL: 'Encaminhamento Externo',
  CRISIS_PROTOCOL: 'Protocolo de Crise',
};

interface GroupEfficacyEntry {
  id: string;
  name: string;
  type: string;
  studentCount: number;
  percentImproved: number;
  percentUnchanged: number;
  percentWorsened: number;
}

interface GroupEfficacyTableProps {
  groups: GroupEfficacyEntry[];
}

export function GroupEfficacyTable({ groups }: GroupEfficacyTableProps) {
  if (groups.length === 0) {
    return (
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <CardContent className="py-16 text-center">
          <Users2 className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1.5} />
          <p className="text-slate-400 font-bold">Nenhum grupo de intervenção ativo</p>
          <p className="text-slate-400 text-sm mt-1">
            Crie grupos na página de Intervenções para acompanhar a eficácia.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <CardHeader>
        <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
          Eficácia por Grupo de Intervenção
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                  Grupo
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                  Tipo
                </th>
                <th className="text-center py-3 px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                  Alunos
                </th>
                <th className="text-center py-3 px-4 text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">
                  Melhorou
                </th>
                <th className="text-center py-3 px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                  Manteve
                </th>
                <th className="text-center py-3 px-4 text-[10px] font-extrabold text-red-500 uppercase tracking-widest">
                  Piorou
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{group.name}</td>
                  <td className="py-3 px-4 text-slate-500">
                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {TYPE_LABELS[group.type] || group.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">{group.studentCount}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-black text-emerald-600">{group.percentImproved}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-slate-400">{group.percentUnchanged}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-black text-red-500">{group.percentWorsened}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/dashboard/GroupEfficacyTable.tsx
git commit -m "feat: add GroupEfficacyTable component for intervention efficacy"
```

---

### Task 6: Dashboard page and routing

**Files:**
- Create: `app/(portal)/dashboard/intervencoes/page.tsx`
- Modify: `components/sidebar-nav.ts` (add nav entry for MANAGER and ADMIN)
- Modify: `lib/auth.ts` (add route access)

**Step 1: Create the page**

Create `app/(portal)/dashboard/intervencoes/page.tsx`:

```tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { getInterventionMonitoringData } from '@/app/actions/reports';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KPICard } from '@/components/dashboard/KPICard';
import { TierMigrationChart } from '@/components/dashboard/TierMigrationChart';
import { GroupEfficacyTable } from '@/components/dashboard/GroupEfficacyTable';
import { AlertTriangle, TrendingUp, TrendingDown, Layers } from 'lucide-react';

export const metadata = {
  title: 'Monitoramento de Intervenções | Sistema Socioemocional',
};

export default async function InterventionMonitoringPage() {
  const user = await getCurrentUser();
  const allowedRoles = [UserRole.MANAGER, UserRole.ADMIN];

  if (!user || !allowedRoles.includes(user.role)) {
    redirect('/');
  }

  const data = await getInterventionMonitoringData();

  if (!data) {
    redirect('/');
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Monitoramento de Intervenções
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm">
          Acompanhe a eficácia das intervenções e a migração entre níveis de risco.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Alunos em Alto Risco"
          value={data.kpis.totalTier3}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          label="Migração Positiva"
          value={`${data.kpis.migrationPositivePercent}%`}
          icon={TrendingUp}
          color="emerald"
        />
        <KPICard
          label="Migração Negativa"
          value={`${data.kpis.migrationNegativePercent}%`}
          icon={TrendingDown}
          color="amber"
        />
        <KPICard
          label="Grupos Ativos"
          value={data.kpis.activeGroups}
          icon={Layers}
          color="indigo"
        />
      </div>

      {/* Tier Migration Chart */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <CardHeader>
          <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
            Migração entre Níveis de Risco
          </CardTitle>
          <CardDescription className="text-sm">
            Quantos alunos melhoraram, mantiveram ou pioraram de nível entre as janelas de triagem.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-0">
          <TierMigrationChart data={data.tierMigration} />
        </CardContent>
      </Card>

      {/* Group Efficacy Table */}
      <GroupEfficacyTable groups={data.groupEfficacy} />
    </div>
  );
}
```

**Step 2: Add sidebar navigation entry**

In `components/sidebar-nav.ts`, add `{ label: 'Monitoramento', href: '/dashboard/intervencoes', iconName: 'TrendingUp' }` to:
- **MANAGER** array: after the `Dashboard` entry (after line 75, which has `href: '/dashboard'`)
- **ADMIN** array: add after `Painel Global` entry

For MANAGER, insert after line 75:
```typescript
{ label: 'Monitoramento', href: '/dashboard/intervencoes', iconName: 'TrendingUp' },
```

For ADMIN, insert after line 90 (after `{ label: 'Painel Global', ...}`):
```typescript
{ label: 'Monitoramento', href: '/dashboard/intervencoes', iconName: 'TrendingUp' },
```

**Step 3: Add route access**

In `lib/auth.ts`, the ROUTE_ACCESS already includes `'/dashboard': ['MANAGER', 'ADMIN']` at line 146. Since the `canAccessRoute` function (line 169) checks `pathname.startsWith(route + '/')`, the existing `/dashboard` entry already covers `/dashboard/intervencoes`. No change needed here.

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 5: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (including the new 8 from Task 1)

**Step 6: Commit**

```bash
git add "app/(portal)/dashboard/intervencoes/page.tsx" components/sidebar-nav.ts
git commit -m "feat: add intervention monitoring dashboard page with navigation"
```

---

### Task 7: Final verification

**Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass (169 total: 161 existing + 8 new)

**Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Verify no regressions**

Check that existing dashboard page still works by verifying its imports haven't broken:
- Read `app/(portal)/dashboard/page.tsx` — should be unchanged
- Read `app/actions/reports.ts` — should have new function appended, all existing functions intact
