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
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { TrendingDown, Users, AlertTriangle, CheckCircle2, ArrowUpRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImpactSummaryProps {
    comparisonData: {
        window: string;
        tier1: number;
        tier2: number;
        tier3: number;
    }[];
    totalStudents: number;
}

export function ImpactSummary({ comparisonData, totalStudents }: ImpactSummaryProps) {
    // Calcular redução do Tier 3 (entre a primeira e a última janela disponível)
    const firstWindowT3 = comparisonData[0]?.tier3 || 0;
    const lastWindowT3 = comparisonData[comparisonData.length - 1]?.tier3 || 0;

    const reductionT3 = firstWindowT3 > 0
        ? ((firstWindowT3 - lastWindowT3) / firstWindowT3) * 100
        : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Cards de Resumo Executivo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-indigo-100 bg-indigo-50/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Users size={24} />
                            </div>
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                Cobertura
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Alunos Mapeados</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-black text-slate-800">{totalStudents}</h2>
                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                <ArrowUpRight size={14} /> 100%
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-rose-100 bg-rose-50/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                                <TrendingDown size={24} />
                            </div>
                            <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                Impacto
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Redução de Risco Alto (T3)</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-black text-slate-800">{reductionT3.toFixed(1)}%</h2>
                            <p className="text-xs font-bold text-slate-500">desde Março</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 bg-emerald-50/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={24} />
                            </div>
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                Eficácia
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Meta de Camada 1 Alcançada</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-3xl font-black text-slate-800">
                                {((comparisonData[comparisonData.length - 1]?.tier1 / totalStudents) * 100).toFixed(0)}%
                            </h2>
                            <p className="text-xs font-bold text-slate-500">estáveis (T1)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gráfico de Evolução de Tiers (Bar Chart Comparativo) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Target className="text-indigo-500" size={16} />
                            Distribuição de Risco por Janela
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="window" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                                />
                                <Bar name="Tier 1 (Saudável)" dataKey="tier1" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar name="Tier 2 (Moderado)" dataKey="tier2" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar name="Tier 3 (Crítico)" dataKey="tier3" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-4 border-slate-200 shadow-sm flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest">Estado Atual (Outubro)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center">
                        {/* Visualização de Pizza simplificada via CSS ou Mini List */}
                        <div className="space-y-4 w-full">
                            {[
                                { label: 'Saudável (C1)', count: lastWindowT3, color: 'bg-emerald-500' },
                                { label: 'Risco Mod. (C2)', count: comparisonData[comparisonData.length - 1]?.tier2, color: 'bg-amber-500' },
                                { label: 'Risco Alto (C3)', count: comparisonData[comparisonData.length - 1]?.tier3, color: 'bg-rose-500' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-3 w-3 rounded-full", item.color)} />
                                        <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">{item.count || 0}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <div className="p-5 mt-auto bg-slate-50 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                            Dados baseados em triagens SRSS-IE
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
