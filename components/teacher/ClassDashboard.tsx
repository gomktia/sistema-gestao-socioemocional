'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TierBadge } from '@/components/domain/TierBadge';
import { cn } from '@/lib/utils';
import { Users, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface StudentRisk {
    id: string;
    name: string;
    overallTier: string;
    alerts: number;
    grade?: string;
}

interface ClassDashboardProps {
    students: StudentRisk[];
}

export function ClassDashboard({ students }: ClassDashboardProps) {
    const total = students.length || 1;
    const t1 = students.filter(s => s.overallTier === 'TIER_1').length;
    const t2 = students.filter(s => s.overallTier === 'TIER_2').length;
    const t3 = students.filter(s => s.overallTier === 'TIER_3').length;

    const atRisk = students.filter(s => s.overallTier !== 'TIER_1').sort((a, b) => b.overallTier.localeCompare(a.overallTier));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Resumo em Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Alunos</p>
                            <p className="text-2xl font-black text-slate-900">{students.length}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 bg-emerald-50/20">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-wider">Camada 1</p>
                            <p className="text-2xl font-black text-emerald-700">{t1}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-amber-100 bg-amber-50/20">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-amber-600/60 uppercase tracking-wider">Camada 2</p>
                            <p className="text-2xl font-black text-amber-700">{t2}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-rose-100 bg-rose-50/20">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-rose-600/60 uppercase tracking-wider">Camada 3</p>
                            <p className="text-2xl font-black text-rose-700">{t3}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de Atenção */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Alunos em Foco (Risco)</h3>
                    <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">ORDE POR GRAVIDADE</span>
                </div>

                {atRisk.length > 0 ? (
                    <div className="grid gap-3">
                        {atRisk.map(student => (
                            <Card key={student.id} className="hover:border-slate-300 transition-colors">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{student.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                {student.grade === 'ANO_1_EM' ? '1ª Série' : student.grade === 'ANO_2_EM' ? '2ª Série' : '3ª Série'}
                                            </span>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Alertas críticos: {student.alerts}</p>
                                        </div>
                                    </div>
                                    <TierBadge tier={student.overallTier} />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <CheckCircle2 className="mx-auto text-emerald-400 mb-2 opacity-50" size={32} />
                        <p className="text-slate-400 text-sm font-medium">Todos os alunos estão em Camada 1!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
