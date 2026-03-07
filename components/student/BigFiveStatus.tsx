
'use client';

import { BigFiveRadarResult } from '@/components/bigfive/BigFiveRadarResult';
import { BrainCircuit, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export function BigFiveStatus({ scores, studentName }: { scores: any[], studentName: string }) {
    if (!scores || scores.length === 0) {
        return (
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-3xl p-8 border border-white/50 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500 min-h-[300px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-violet-200/50 blur-3xl group-hover:scale-125 transition-transform" />

                <div className="relative z-10 max-w-sm">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-6 group-hover:-translate-y-1 transition-transform">
                        <BrainCircuit size={28} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
                        Descubra seu Perfil de Aprendizagem
                    </h3>

                    <p className="text-slate-600 font-medium leading-relaxed mb-8">
                        Responda ao questionário Big Five e entenda como sua personalidade influencia seus estudos e relações.
                    </p>

                    <Link href="/bigfive">
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all flex items-center gap-3 group/btn">
                            <Sparkles size={16} className="group-hover/btn:animate-pulse" />
                            Iniciar Teste Agora
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate domain insights
    const stability = scores.find(s => s.domain === 'ESTABILIDADE')?.score || 0;
    const conscientiousness = scores.find(s => s.domain === 'CONSCIENCIOSIDADE')?.score || 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Chart Column */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative min-h-[360px]">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <BrainCircuit size={14} className="text-violet-500" />
                    Seu Mapa de Personalidade
                </h3>
                <div className="w-full flex-1 min-h-0">
                    <BigFiveRadarResult scores={scores} />
                </div>
            </div>

            {/* Insights Column */}
            <div className="flex flex-col gap-4">
                <Card className="flex-1 bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col justify-center h-full">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <TrendingUp size={16} />
                            </div>
                            <h4 className="font-bold text-emerald-800 text-sm uppercase tracking-wide">Ponto de Força</h4>
                        </div>
                        {conscientiousness > 3.5 ? (
                            <>
                                <p className="text-lg font-black text-slate-800 tracking-tight mb-1">
                                    Alta Organização e Foco
                                </p>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    Sua Conscienciosidade elevada indica que você é determinado e persistente nos estudos.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-lg font-black text-slate-800 tracking-tight mb-1">
                                    Criatividade e Flexibilidade
                                </p>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    Você tende a ser adaptável e aberto a novas experiências, o que é ótimo para inovação.
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="flex-1 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col justify-center h-full">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumo dos Domínios</span>
                        </div>
                        <div className="space-y-3">
                            {scores.slice(0, 3).map((s, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{s.label}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors"
                                                style={{ width: `${(s.score / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 w-3">{s.score.toFixed(0)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[9px] text-slate-400 text-center mt-3 pt-3 border-t border-slate-50">
                            Finalidade exclusivamente pedagógica.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
