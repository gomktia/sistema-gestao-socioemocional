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
