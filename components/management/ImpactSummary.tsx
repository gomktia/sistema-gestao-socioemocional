'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { TrendingDown, Users, CheckCircle2, ArrowUpRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrganizationLabels } from '@/src/lib/utils/labels';

interface ImpactSummaryProps {
    comparisonData: {
        window: string;
        tier1: number;
        tier2: number;
        tier3: number;
    }[];
    totalStudents: number;
    labels: OrganizationLabels;
}

export function ImpactSummary({ comparisonData, totalStudents, labels }: ImpactSummaryProps) {
    const firstWindowT3 = comparisonData[0]?.tier3 || 0;
    const lastWindowT3 = comparisonData[comparisonData.length - 1]?.tier3 || 0;

    const reductionT3 = firstWindowT3 > 0
        ? ((firstWindowT3 - lastWindowT3) / firstWindowT3) * 100
        : 0;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Cards de Resumo Executivo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Users size={24} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                Cobertura
                            </span>
                        </div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Total {labels.subjects} Mapeados</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{totalStudents}</h2>
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                <ArrowUpRight size={14} strokeWidth={1.5} /> 100%
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-rose-500/10 transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <TrendingDown size={24} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                Impacto
                            </span>
                        </div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Redução de Risco Alto (T3)</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{reductionT3.toFixed(1)}%</h2>
                            <p className="text-xs font-bold text-slate-500">desde o início</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-emerald-500/10 transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={24} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                Eficácia
                            </span>
                        </div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Meta de Camada 1 Alcançada</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                {totalStudents > 0
                                    ? ((comparisonData[comparisonData.length - 1]?.tier1 / totalStudents) * 100).toFixed(0)
                                    : 0}%
                            </h2>
                            <p className="text-xs font-bold text-slate-500">estáveis (T1)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gráfico de Evolução de Tiers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Target className="text-indigo-500" size={16} strokeWidth={1.5} />
                            Distribuição de Risco por Janela
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparisonData}>
                                <defs>
                                    <linearGradient id="impGradT1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="impGradT2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="impGradT3" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="window" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '10px 14px', fontWeight: 600 }}
                                />
                                <Bar name="Tier 1 (Saudável)" dataKey="tier1" fill="url(#impGradT1)" radius={[0, 0, 8, 8]} stackId="a" />
                                <Bar name="Tier 2 (Moderado)" dataKey="tier2" fill="url(#impGradT2)" stackId="a" />
                                <Bar name="Tier 3 (Crítico)" dataKey="tier3" fill="url(#impGradT3)" radius={[8, 8, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-4 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-extrabold text-slate-500 uppercase tracking-widest">Estado Atual</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center">
                        <div className="space-y-3 w-full">
                            {[
                                { label: 'Saudável (C1)', count: comparisonData[comparisonData.length - 1]?.tier1, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                                { label: 'Risco Mod. (C2)', count: comparisonData[comparisonData.length - 1]?.tier2, color: 'bg-amber-500', bg: 'bg-amber-50' },
                                { label: 'Risco Alto (C3)', count: comparisonData[comparisonData.length - 1]?.tier3, color: 'bg-rose-500', bg: 'bg-rose-50' },
                            ].map((item, i) => (
                                <div key={i} className={cn("flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md", item.bg)}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-3 w-3 rounded-full shadow-sm", item.color)} />
                                        <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">{item.count || 0}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <div className="p-5 mt-auto bg-slate-50/50 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                            Monitoramento baseado em inteligência de risco
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
