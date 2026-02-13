import { getCurrentUser } from '@/lib/auth';
import { getLabels } from '@/src/lib/utils/labels';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ClipboardList, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function InicioPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const labels = getLabels(user.organizationType);

    const totalStudents = await prisma.student.count({ where: { tenantId: user.tenantId, isActive: true } });
    const totalAssessments = await prisma.assessment.count({ where: { tenantId: user.tenantId, type: 'SRSS_IE' } });

    const criticalRiskCount = await prisma.assessment.count({
        where: {
            tenantId: user.tenantId,
            type: 'SRSS_IE',
            overallTier: 'TIER_3',
            academicYear: new Date().getFullYear()
        }
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Boas-vindas Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-8 sm:p-12 text-white shadow-[0_20px_60px_rgba(79,70,229,0.25)]">
                <div className="relative z-10 max-w-2xl">
                    <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-3">Painel Socioemocional</p>
                    <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight tracking-tight">
                        Olá, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-indigo-100 text-lg font-medium mb-8 leading-relaxed max-w-xl">
                        Seu painel de inteligência socioemocional está pronto.
                        Acompanhe o desenvolvimento dos seus {labels.subjects.toLowerCase()} e tome decisões baseadas em dados.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/turma/triagem">
                            <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-extrabold text-sm hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-800/20">
                                <ClipboardList size={18} strokeWidth={1.5} />
                                Nova Triagem
                            </button>
                        </Link>
                        <Link href="/alunos">
                            <button className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-2xl font-extrabold text-sm hover:bg-white/20 transition-all active:scale-95 flex items-center gap-2 backdrop-blur-sm">
                                Ver {labels.subjects}
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 -mb-32 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute top-1/2 right-8 -translate-y-1/2 h-48 w-48 rounded-full bg-indigo-400/10 blur-2xl" />
            </div>

            {/* Quick Stats Grid - small cards keep hover */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card className="hover:shadow-2xl hover:ring-1 hover:ring-blue-500/10 hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500">
                                <Users size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-extrabold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest">ATIVOS</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">{totalStudents}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{labels.subjects}</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-2xl hover:ring-1 hover:ring-blue-500/10 hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <ClipboardList size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-widest">TOTAL</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">{totalAssessments}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Triagens Realizadas</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-2xl hover:ring-1 hover:ring-rose-500/10 hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <AlertCircle size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] font-extrabold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full uppercase tracking-widest">URGENTE</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">{criticalRiskCount}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{labels.subjects} em Camada 3</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 hover:shadow-2xl hover:ring-1 hover:ring-emerald-500/10 hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div>
                            <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-1">Status da Triagem</p>
                            <p className="text-sm font-bold text-emerald-800">Sua {labels.organization.toLowerCase()} está atualizada!</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest">
                            PRÓXIMA JANELA: OUTUBRO <TrendingUp size={12} strokeWidth={1.5} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Ações Rápidas em Grid - large containers NO hover movement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="space-y-5">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Navegação Rápida</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Link href="/turma" className="group">
                            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <ClipboardList size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="font-extrabold text-slate-900 mb-1 tracking-tight">Mapa de Risco</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Visualize as pirâmides de intervenção e indicadores críticos.</p>
                                <div className="mt-4 flex items-center text-indigo-600 text-xs font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Acessar <ArrowRight size={14} strokeWidth={1.5} />
                                </div>
                            </div>
                        </Link>

                        <Link href="/intervencoes" className="group">
                            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-purple-500/10 transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={24} strokeWidth={1.5} />
                                </div>
                                <h4 className="font-extrabold text-slate-900 mb-1 tracking-tight">Intervenções (C2)</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Gestão dos planos individuais e grupos de apoio socioemocional.</p>
                                <div className="mt-4 flex items-center text-purple-600 text-xs font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Acessar <ArrowRight size={14} strokeWidth={1.5} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="space-y-5">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Painel de Impacto</h3>
                    <Link href="/gestao" className="block group">
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-emerald-500/10 transition-all duration-300 h-full min-h-[220px] flex flex-col justify-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Relatório Executivo</h4>
                                <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                                    Visualize a eficácia das intervenções através da migração de risco entre janelas de triagem.
                                </p>
                                <span className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-200 active:scale-95 transition-all inline-block">
                                    Abrir Gestão de Impacto
                                </span>
                            </div>
                            <div className="absolute right-0 bottom-0 -mb-8 -mr-8 h-40 w-40 bg-emerald-50 rounded-full group-hover:scale-125 transition-transform duration-500" />
                        </div>
                    </Link>
                </section>
            </div>
        </div>
    );
}
