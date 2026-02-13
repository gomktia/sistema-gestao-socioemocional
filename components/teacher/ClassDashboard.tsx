'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TierBadge } from '@/components/domain/TierBadge';
import { cn } from '@/lib/utils';
import { Users, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { OrganizationLabels } from '@/src/lib/utils/labels';

interface StudentRisk {
    id: string;
    name: string;
    overallTier: string;
    alerts: number;
    grade?: string;
}

interface ClassDashboardProps {
    students: StudentRisk[];
    labels?: OrganizationLabels;
}

export function ClassDashboard({ students, labels }: ClassDashboardProps) {
    const subjectsLabel = labels?.subjects ?? 'Alunos';
    const subjectsLower = subjectsLabel.toLowerCase();
    const studentsCount = students.length;
    const t1 = students.filter(s => s.overallTier === 'TIER_1').length;
    const t2 = students.filter(s => s.overallTier === 'TIER_2').length;
    const t3 = students.filter(s => s.overallTier === 'TIER_3').length;

    const atRisk = students.filter(s => s.overallTier !== 'TIER_1').sort((a, b) => b.overallTier.localeCompare(a.overallTier));

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Resumo em Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-blue-500/10 transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500">
                            <Users size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total {subjectsLabel}</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">{studentsCount}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-gradient-to-br from-emerald-50 to-emerald-50/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-emerald-500/10 transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-emerald-600/60 uppercase tracking-wider">Camada 1</p>
                            <p className="text-2xl font-black text-emerald-700 tracking-tight">{t1}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-gradient-to-br from-amber-50 to-amber-50/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-amber-500/10 transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <TrendingUp size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-amber-600/60 uppercase tracking-wider">Camada 2</p>
                            <p className="text-2xl font-black text-amber-700 tracking-tight">{t2}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-gradient-to-br from-rose-50 to-rose-50/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-rose-500/10 transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                            <AlertTriangle size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-extrabold text-rose-600/60 uppercase tracking-wider">Camada 3</p>
                            <p className="text-2xl font-black text-rose-700 tracking-tight">{t3}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de Atenção */}
            <section className="space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">{subjectsLabel} em Foco (Risco)</h3>
                    <span className="text-[10px] font-extrabold bg-slate-50 px-3 py-1.5 rounded-full text-slate-400 uppercase tracking-widest">ORDEM POR GRAVIDADE</span>
                </div>

                {atRisk.length > 0 ? (
                    <div className="grid gap-3">
                        {atRisk.map(student => (
                            <Link key={student.id} href={`/alunos/${student.id}`}>
                                <Card className="group cursor-pointer overflow-hidden border-none border-l-4 border-l-rose-400 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-2xl hover:ring-1 hover:ring-rose-500/10 transition-all duration-300 hover:-translate-y-1">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{student.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-extrabold bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                    {student.grade === 'ANO_1_EM' ? '1ª Série' : student.grade === 'ANO_2_EM' ? '2ª Série' : '3ª Série'}
                                                </span>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Alertas críticos: {student.alerts}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <TierBadge tier={student.overallTier} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <CheckCircle2 className="mx-auto text-emerald-400 mb-2 opacity-50" size={32} strokeWidth={1.5} />
                        <p className="text-slate-400 text-sm font-medium">Todos os {subjectsLower} estão em Camada 1!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
