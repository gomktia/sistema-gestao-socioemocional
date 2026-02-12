import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExcelExportButton } from '@/components/dashboard/ExcelExportButton';
import { RiskEvolutionChart } from '@/components/dashboard/RiskEvolutionChart';
import { getRiskEvolutionData } from '@/app/actions/reports';
import { getLabels } from '@/src/lib/utils/labels';

export const metadata = {
    title: 'Dashboard de Resultados | Sistema Socioemocional',
};

export default async function DashboardPage() {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.MANAGER, UserRole.ADMIN, UserRole.PSYCHOLOGIST];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const labels = getLabels(user.organizationType);
    const evolutionData = await getRiskEvolutionData();

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Dashboard de Resultados
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Acompanhamento estratégico da evolução socioemocional dos {labels.subjects.toLowerCase()}.
                    </p>
                </div>

                <ExcelExportButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-slate-800">Evolução do Risco</CardTitle>
                        <CardDescription>
                            Migração de {labels.subjects.toLowerCase()} entre os níveis de risco ao longo do ano.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <RiskEvolutionChart data={evolutionData} />
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-indigo-900 uppercase tracking-widest">
                                Destaques
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-indigo-700 leading-relaxed">
                                A janela de Monitoramento (Junho) mostrou uma redução de 12% nos casos de Alto Risco comparado ao Diagnóstico (Março).
                                <br /><br />
                                <strong>Ação Recomendada:</strong> Manter grupos de intervenção focados em regulação emocional.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                                Próximos Passos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                <p className="text-xs text-slate-600 pt-1">Revisar grupos de intervenção ativos.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                <p className="text-xs text-slate-600 pt-1">Exportar relatório para reunião de conselho.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                <p className="text-xs text-slate-400 pt-1">Planejar triagem final de Outubro.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
