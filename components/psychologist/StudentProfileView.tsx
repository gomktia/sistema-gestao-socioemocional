'use client';

import { useState } from 'react';
import { RiskSummaryCard } from '@/components/domain/RiskSummaryCard';
import { CrossoverCard } from '@/components/domain/CrossoverCard';
import { TierBadge } from '@/components/domain/TierBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, AlertTriangle, ListChecks, UserCircle2, ShieldAlert, FilePlus2, History, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EvolutionChart } from '@/components/charts/EvolutionChart';
import { Button } from '@/components/ui/button';
import { DownloadCrisisReportButton } from '@/components/reports/DownloadCrisisReportButton';
import { InterventionPlanForm } from './InterventionPlanForm';

interface StudentProfileViewProps {
    studentName: string;
    grade: string;
    profile: any;
    evolutionData?: any[];
    ewsAlert?: any;
    interventionPlans?: any[];
}

export function StudentProfileView({
    studentName,
    grade,
    profile,
    evolutionData = [],
    ewsAlert,
    interventionPlans = []
}: StudentProfileViewProps) {
    const [showPlanForm, setShowPlanForm] = useState(false);
    const {
        externalizing,
        internalizing,
        overallTier,
        signatureStrengths,
        gradeAlerts,
        interventionSuggestions
    } = profile;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* EWS Alerta (Early Warning) */}
            {ewsAlert && ewsAlert.alertLevel !== 'NONE' && (
                <div className={cn(
                    "p-4 rounded-xl border flex items-center justify-between gap-4 animate-in slide-in-from-top-2",
                    ewsAlert.alertLevel === 'CRITICAL' ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"
                )}>
                    <div className="flex items-center gap-4">
                        <AlertTriangle className={cn(
                            "shrink-0",
                            ewsAlert.alertLevel === 'CRITICAL' ? "text-rose-500" : "text-amber-500"
                        )} size={24} />
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">Risco Escolar Adicional (EWS)</h4>
                            <ul className="text-xs font-medium text-slate-700 space-y-0.5">
                                {ewsAlert.rationale.map((r: string, i: number) => (
                                    <li key={i}>• {r}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Gráfico de Evolução e Resumo de Risco */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <History size={16} />
                            Suporte Longitudinal (Evolução)
                        </h3>
                        <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-rose-500" /> Extern.</span>
                            <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-indigo-500" /> Intern.</span>
                        </div>
                    </div>
                    <EvolutionChart data={evolutionData} />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <RiskSummaryCard
                        externalizing={externalizing}
                        internalizing={internalizing}
                        overallTier={overallTier}
                    />

                    {overallTier === 'TIER_3' && (
                        <Card className="border-rose-200 bg-rose-50/20 overflow-hidden shrink-0">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-2 text-rose-700">
                                    <ShieldAlert size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">Protocolo de Crise</span>
                                </div>
                                <p className="text-[11px] text-rose-800 font-medium leading-relaxed">
                                    Gere o documento oficial de encaminhamento para a rede de saúde.
                                </p>
                                <DownloadCrisisReportButton
                                    studentName={studentName}
                                    grade={grade === 'ANO_1_EM' ? '1ª Série' : grade === 'ANO_2_EM' ? '2ª Série' : '3ª Série'}
                                    riskTier={overallTier}
                                    externalizingScore={externalizing.score}
                                    internalizingScore={internalizing.score}
                                    criticalAlerts={gradeAlerts}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Seção PEI (Camada 3) */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Target className="text-indigo-500" size={16} />
                        Plano de Intervenção Individual (PEI)
                    </h3>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-[10px] font-black uppercase tracking-widest bg-white"
                        onClick={() => setShowPlanForm(true)}
                    >
                        <FilePlus2 size={14} className="mr-2" />
                        Novo Plano
                    </Button>
                </div>

                {showPlanForm && (
                    <InterventionPlanForm
                        studentId={profile.studentId || ''}
                        signatureStrengths={signatureStrengths}
                        gradeAlerts={gradeAlerts}
                        onSuccess={() => {
                            setShowPlanForm(false);
                            // Revalidação ocorre via action
                        }}
                        onCancel={() => setShowPlanForm(false)}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interventionPlans.length > 0 ? (
                        interventionPlans.map((plan) => (
                            <Card key={plan.id} className="border-slate-100 shadow-sm hover:border-indigo-100 transition-colors group">
                                <CardHeader className="pb-2 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-tighter">
                                            PEI Ativo
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400">
                                            {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xs font-bold text-slate-600 uppercase">
                                        Foco: {plan.targetRisks.join(', ')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ações Estratégicas</p>
                                        <p className="text-xs text-slate-700 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                                            {plan.strategicActions}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-2 border-t border-slate-50">
                                        <div className="flex -space-x-2">
                                            {plan.leverageStrengths.map((s: string) => (
                                                <div key={s} className="h-6 w-6 rounded-full bg-indigo-500 text-[8px] font-bold text-white flex items-center justify-center border-2 border-white shadow-sm" title={s}>
                                                    {s.charAt(0)}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                            Monitorado por: {plan.author?.name || 'Psicólogo'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : !showPlanForm && (
                        <Card className="col-span-full bg-slate-50/50 border-dashed border-slate-200">
                            <CardContent className="p-12 text-center text-slate-400">
                                <Target className="mx-auto mb-2 opacity-10" size={32} />
                                <p className="text-xs font-medium">Nenhum plano PEI formalizado para este aluno.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* Cruzamento Preditivo (Camada 2) */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                    <ListChecks className="text-emerald-500" size={16} />
                    Sugestões de Apoio (Camada 2)
                </h3>

                {interventionSuggestions.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {interventionSuggestions.map((sugg: any, i: number) => (
                            <CrossoverCard
                                key={i}
                                targetRisk={sugg.targetRisk}
                                leverageStrength={sugg.leverageStrength}
                                strengthLabel={sugg.strengthLabel}
                                strategy={sugg.strategy}
                                rationale={sugg.rationale}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="bg-slate-50 border-dashed border-slate-200">
                        <CardContent className="p-8 text-center text-slate-400">
                            <Sparkles className="mx-auto mb-2 opacity-20" size={32} />
                            <p className="text-sm font-medium">Não há intervenções urgentes sugeridas. Aluno em Camada 1.</p>
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    );
}
