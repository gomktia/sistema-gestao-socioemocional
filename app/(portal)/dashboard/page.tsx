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
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Dashboard de Resultados
                    </h1>
                    <p className="text-slate-500 mt-1.5 text-sm">
                        Acompanhamento estratégico da evolução socioemocional dos {labels.subjects.toLowerCase()}.
                    </p>
                </div>

                <ExcelExportButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Evolução do Risco</CardTitle>
                        <CardDescription className="text-sm">
                            Migração de {labels.subjects.toLowerCase()} entre os níveis de risco ao longo do ano.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <RiskEvolutionChart data={evolutionData} />
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {(user.role === 'MANAGER' || user.role === 'ADMIN') && (
                        <Card className="border-none bg-gradient-to-br from-emerald-50 to-emerald-50/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-[0.2em]">
                                    Status do Contrato
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between gap-2">
                                    <div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-slate-900 tracking-tight">540</span>
                                            <span className="text-xs font-bold text-slate-400">/ 1000</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Alunos Ativos</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">54%</span>
                                    </div>
                                </div>

                                {/* Gradient Progress Bar */}
                                <div className="h-3 w-full bg-slate-100 rounded-full mt-4 overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)] relative overflow-hidden"
                                        style={{ width: '54%' }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]" />
                                    </div>
                                </div>
                                <p className="text-[9px] text-slate-400 mt-3 italic">
                                    Próxima renovação: 12/12/2026
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-none bg-gradient-to-br from-indigo-50 to-indigo-50/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-extrabold text-indigo-900 uppercase tracking-widest">
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

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-extrabold text-slate-600 uppercase tracking-widest">
                                Próximos Passos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">1</div>
                                <p className="text-xs text-slate-600 pt-1.5">Revisar grupos de intervenção ativos.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0">2</div>
                                <p className="text-xs text-slate-600 pt-1.5">Exportar relatório para reunião de conselho.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-7 w-7 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-xs font-black shrink-0">3</div>
                                <p className="text-xs text-slate-400 pt-1.5">Planejar triagem final de Outubro.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
