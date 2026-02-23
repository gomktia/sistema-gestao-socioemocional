# P1.4 — Monitoramento de Progresso das Intervenções: Design

## Goal

Dashboard dedicado para gestores acompanharem a eficácia das intervenções sociemocionais, com KPIs de migração entre tiers, gráfico de fluxo entre janelas de triagem, e comparativo antes/depois por grupo de intervenção.

## Decisions

| Question | Answer |
|----------|--------|
| Audience | MANAGER e ADMIN apenas |
| Granularity | Visão por janela (3 pontos: Diagnóstica, Monitoramento, Final) |
| Comparison | Antes/depois do grupo (tier de entrada vs tier atual) |
| Approach | Dashboard separado em `/dashboard/intervencoes` |

## Architecture

### Route

- **Page**: `app/(portal)/dashboard/intervencoes/page.tsx`
- **Access**: MANAGER, ADMIN only (same pattern as existing `/dashboard`)
- **Nav**: New sidebar entry "Monitoramento" for MANAGER and ADMIN

### Data Layer

New server action `getInterventionMonitoringData()` in `app/actions/reports.ts` returning:

```typescript
interface InterventionMonitoringData {
  kpis: {
    totalTier3: number;           // Current Tier 3 count
    migrationPositive: number;    // % of students who improved (3→2 or 2→1)
    migrationNegative: number;    // % of students who worsened (1→2 or 2→3)
    activeGroups: number;         // Count of active InterventionGroups
  };
  tierMigration: TierMigrationData[];  // Per-window-pair migration counts
  groupEfficacy: GroupEfficacyData[];  // Per-group before/after comparison
}
```

**Tier migration** query: For each student with SRSS-IE assessments in the current academic year, compare `overallTier` across consecutive screening windows (DIAGNOSTIC→MONITORING, MONITORING→FINAL). Count how many moved up, stayed, or moved down.

**Group efficacy** query: For each active InterventionGroup, get the students linked to it. For each student, compare their earliest `overallTier` (at or before group start) with their most recent `overallTier`. Calculate % improved, % unchanged, % worsened.

### Pure Functions (Testable)

Extract calculation logic into pure functions in `lib/intervention-monitoring.ts`:

```typescript
// Calculate migration between two sets of tier data
function calculateTierMigration(
  before: { studentId: string; tier: string }[],
  after: { studentId: string; tier: string }[]
): { improved: number; unchanged: number; worsened: number; total: number }

// Calculate group efficacy from before/after tier data
function calculateGroupEfficacy(
  students: { studentId: string; tierBefore: string; tierAfter: string }[]
): { improved: number; unchanged: number; worsened: number; percentImproved: number }
```

### Components

1. **KPICard** (`components/dashboard/KPICard.tsx`)
   - Reusable card: icon, value, label, trend indicator, color theme
   - Used 4x in the dashboard header row

2. **TierMigrationChart** (`components/dashboard/TierMigrationChart.tsx`)
   - Recharts grouped bar chart
   - X-axis: window transitions ("Mar→Jun", "Jun→Out")
   - Three bars per group: "Melhorou" (green), "Manteve" (slate), "Piorou" (red)
   - Same visual style as RiskEvolutionChart (gradients, rounded corners, tooltip)

3. **GroupEfficacyTable** (`components/dashboard/GroupEfficacyTable.tsx`)
   - Server component table listing each InterventionGroup
   - Columns: Nome, Tipo, Alunos, % Melhora, % Manteve, % Piorou
   - Color-coded % cells (green for improvement, red for worsening)
   - Empty state when no groups exist

### Page Layout

```
[Header: Title + subtitle]
[4x KPICard in grid row]
[TierMigrationChart in full-width card]
[GroupEfficacyTable in full-width card]
```

### Navigation

Add to `sidebar-nav.ts`:
- MANAGER: `{ label: 'Monitoramento', href: '/dashboard/intervencoes', iconName: 'TrendingUp' }` after "Dashboard"
- ADMIN: Same entry added to ADMIN nav

Add to `lib/auth.ts` ROUTE_ACCESS:
- `'/dashboard/intervencoes': ['MANAGER', 'ADMIN']`

## Testing

- Pure function tests for `calculateTierMigration` and `calculateGroupEfficacy`
- Edge cases: no data, single window only, empty groups, all same tier
- Test with mock tier data (no DB needed)

## Out of Scope

- Individual student evolution graph (already exists in student detail page)
- EWS indicators in this dashboard
- Group vs control comparison
- PSYCHOLOGIST/COUNSELOR access (they see data in student profiles)
