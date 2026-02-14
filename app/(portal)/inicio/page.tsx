import { getCurrentUser } from '@/lib/auth';
import { getLabels } from '@/src/lib/utils/labels';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import {
    Users,
    ClipboardList,
    TrendingUp,
    AlertCircle,
    ArrowRight,
    Star,
    Calendar,
    Target,
    Sparkles,
    Shield,
    MessageCircle,
    Download
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UserRole } from '@/src/core/types';

export default async function InicioPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const labels = getLabels(user.organizationType);
    const isStudent = user.role === 'STUDENT';

    // Data for Staff
    let staffData = null;
    if (!isStudent) {
        const [totalStudents, totalAssessments, criticalRiskCount] = await Promise.all([
            prisma.student.count({ where: { tenantId: user.tenantId, isActive: true } }),
            prisma.assessment.count({ where: { tenantId: user.tenantId, type: 'SRSS_IE' } }),
            prisma.assessment.count({
                where: {
                    tenantId: user.tenantId,
                    type: 'SRSS_IE',
                    overallTier: 'TIER_3',
                    academicYear: new Date().getFullYear()
                }
            })
        ]);
        staffData = { totalStudents, totalAssessments, criticalRiskCount };
    }

    // Data for Student
    let studentData = null;
    if (isStudent && user.studentId) {
        const [lastAssessment, lastVIA, activePlan] = await Promise.all([
            prisma.assessment.findFirst({
                where: { studentId: user.studentId },
                orderBy: { appliedAt: 'desc' },
                select: { appliedAt: true }
            }),
            prisma.assessment.findFirst({
                where: { studentId: user.studentId, type: 'VIA_STRENGTHS' },
                orderBy: { appliedAt: 'desc' },
                select: { processedScores: true }
            }),
            prisma.interventionPlan.findFirst({
                where: { studentId: user.studentId },
                orderBy: { createdAt: 'desc' },
                select: { status: true, author: { select: { name: true, role: true } } }
            })
        ]);

        let topStrength = null;
        if (lastVIA?.processedScores) {
            const scores = lastVIA.processedScores as any;
            if (scores.signatureTop5 && scores.signatureTop5.length > 0) {
                topStrength = scores.signatureTop5[0];
            }
        }

        studentData = {
            lastAssessmentDate: lastAssessment?.appliedAt,
            topStrength,
            planStatus: activePlan?.status === 'IN_PROGRESS' || activePlan?.status === 'COMPLETED' ? 'Ativo' : 'Pendente',
            authorName: activePlan?.author?.name || 'Coordenação'
        };
    }

    return (
        <div className="space-y-6">
            {/* Boas-vindas Hero (Compacto) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 sm:px-8 sm:py-6 text-white shadow-[0_20px_60px_rgba(79,70,229,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 min-h-[120px] max-h-auto sm:max-h-[140px]">
                <div className="relative z-10 max-w-xl">
                    <p className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        {isStudent ? 'Minha Jornada' : 'Painel de Inteligência'}
                    </p>
                    <h1 className="text-2xl sm:text-2xl font-black mb-1 leading-tight tracking-tight">
                        {isStudent ? 'Olá, ' : 'Bem-vindo, '}{user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-indigo-100/80 text-sm font-medium leading-normal max-w-lg hidden sm:block">
                        {isStudent
                            ? 'Acompanhe sua evolução socioemocional aqui.'
                            : 'Monitore o engajamento e a saúde emocional de suas turmas.'
                        }
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 relative z-10">
                    {isStudent ? (
                        <>
                            <Link href="/questionario">
                                <button className="bg-white text-indigo-600 px-4 py-2 rounded-2xl font-extrabold text-[11px] hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-800/20 uppercase tracking-wider">
                                    <Sparkles size={14} strokeWidth={2} />
                                    Responder VIA
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/turma/triagem">
                                <button className="bg-white text-indigo-600 px-4 py-2 rounded-2xl font-extrabold text-[11px] hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-800/20 uppercase tracking-wider">
                                    <ClipboardList size={14} strokeWidth={2} />
                                    Nova Triagem
                                </button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Decorations */}
                <div className="absolute top-0 right-0 -mr-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute bottom-0 right-1/4 -mb-10 h-24 w-24 rounded-full bg-violet-400/10 blur-xl" />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {isStudent ? (
                    <>
                        {/* Aluno: Minha Jornada */}
                        <Card className="hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-300 rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Calendar size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-widest">Atividade</span>
                                </div>
                                <p className="text-xl font-black text-slate-900 tracking-tight">
                                    {studentData?.lastAssessmentDate
                                        ? format(new Date(studentData.lastAssessmentDate), "dd 'de' MMMM", { locale: ptBR })
                                        : 'Nenhuma ainda'
                                    }
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Minha Última Jornada</p>
                            </CardContent>
                        </Card>

                        {/* Aluno: Força Principal */}
                        <Card className="hover:shadow-2xl hover:ring-1 hover:ring-violet-500/10 transition-all duration-300 rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                                        <Star size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] font-extrabold bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full uppercase tracking-widest">Destaque</span>
                                </div>
                                <p className="text-xl font-black text-slate-900 tracking-tight">
                                    {studentData?.topStrength?.label || 'Em descoberta...'}
                                </p>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Minha Força Principal</p>
                            </CardContent>
                        </Card>

                        {/* Aluno: Plano de Crescimento */}
                        <Card className="hover:shadow-2xl hover:ring-1 hover:ring-emerald-500/10 transition-all duration-300 rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Target size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest",
                                        studentData?.planStatus === 'Ativo' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                                    )}>
                                        {studentData?.planStatus}
                                    </span>
                                </div>
                                <p className="text-xl font-black text-slate-900 tracking-tight">Plano Individual</p>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Meu Crescimento</p>
                            </CardContent>
                        </Card>

                        {/* Aluno: Autoridade/Mentoria */}
                        <Card className="bg-slate-900 text-white hover:shadow-2xl transition-all duration-300 rounded-3xl border-none">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div>
                                    <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-1">Acompanhamento</p>
                                    <p className="text-sm font-bold text-slate-200">{studentData?.authorName}</p>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest">
                                    Psicologia Escolar <ArrowRight size={12} strokeWidth={1.5} />
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <>
                        <Card className="hover:shadow-2xl hover:ring-1 hover:ring-blue-500/10 hover:-translate-y-1 transition-all rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500">
                                        <Users size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] font-extrabold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest">ATIVOS</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{staffData?.totalStudents}</p>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{labels.subjects}</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 hover:-translate-y-1 transition-all rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <ClipboardList size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-widest">TOTAL</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{staffData?.totalAssessments}</p>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Triagens Realizadas</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl hover:ring-1 hover:ring-rose-500/10 hover:-translate-y-1 transition-all rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-11 w-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                                        <AlertCircle size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[10px] font-extrabold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full uppercase tracking-widest">URGENTE</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{staffData?.criticalRiskCount}</p>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{labels.subjects} em Camada 3</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 hover:shadow-2xl hover:ring-1 hover:ring-emerald-500/10 hover:-translate-y-1 transition-all rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none">
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
                    </>
                )}
            </div>

            {/* Ações Rápidas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="space-y-5">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Navegação Rápida</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Link href={isStudent ? "/questionario" : "/turma"} className="group">
                            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {isStudent ? <Sparkles size={24} strokeWidth={1.5} /> : <ClipboardList size={24} strokeWidth={1.5} />}
                                </div>
                                <h4 className="font-extrabold text-slate-900 mb-1 tracking-tight">
                                    {isStudent ? 'Responder VIA' : 'Mapa de Risco'}
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {isStudent
                                        ? 'Inicie ou complete seu questionário de forças de caráter.'
                                        : 'Visualize as pirâmides de intervenção e indicadores críticos.'
                                    }
                                </p>
                                <div className="mt-4 flex items-center text-indigo-600 text-xs font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Acessar <ArrowRight size={14} strokeWidth={1.5} />
                                </div>
                            </div>
                        </Link>

                        <Link href={isStudent ? "/minhas-forcas" : "/intervencoes"} className="group">
                            <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-purple-500/10 transition-all duration-300">
                                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {isStudent ? <Star size={24} strokeWidth={1.5} /> : <TrendingUp size={24} strokeWidth={1.5} />}
                                </div>
                                <h4 className="font-extrabold text-slate-900 mb-1 tracking-tight">
                                    {isStudent ? 'Meus Relatórios' : 'Intervenções (C2)'}
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {isStudent
                                        ? 'Veja o detalhamento do seu perfil e virtudes em destaque.'
                                        : 'Gestão dos planos individuais e grupos de apoio socioemocional.'
                                    }
                                </p>
                                <div className="mt-4 flex items-center text-purple-600 text-xs font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Acessar <ArrowRight size={14} strokeWidth={1.5} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="space-y-5">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">
                        {isStudent ? 'Meu Plano de Ação' : 'Painel de Impacto'}
                    </h3>
                    <Link href={isStudent ? "/minhas-forcas" : "/gestao"} className="block group">
                        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-emerald-500/10 transition-all duration-300 h-full min-h-[220px] flex flex-col justify-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                                    {isStudent ? 'Direcionamento de Crescimento' : 'Relatório Executivo'}
                                </h4>
                                <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                                    {isStudent
                                        ? 'Sua jornada está começando! Em breve sua mentoria personalizada aparecerá aqui.'
                                        : 'Visualize a eficácia das intervenções através da migração de risco entre janelas de triagem.'
                                    }
                                </p>
                                <span className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-200 active:scale-95 transition-all inline-block">
                                    {isStudent ? 'Ver Detalhes do Plano' : 'Abrir Gestão de Impacto'}
                                </span>
                            </div>
                            <div className="absolute right-0 bottom-0 -mb-8 -mr-8 h-40 w-40 bg-emerald-50 rounded-full group-hover:scale-125 transition-transform duration-500" />
                        </div>
                    </Link>
                </section>
            </div>

            {/* Footer Support Section - Only for Student */}
            {isStudent && (
                <Card className="bg-slate-50/50 border-none shadow-none rounded-3xl p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900">
                                <Shield size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 tracking-tight">Privacidade e Suporte</h4>
                                <p className="text-xs text-slate-500 font-medium">Seus dados estão protegidos sob a LGPD.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/minhas-forcas"
                                className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
                            >
                                <Download size={14} />
                                Baixar Meus Dados (LGPD)
                            </Link>
                            <a
                                href="https://wa.me/5500000000000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-indigo-50 px-5 py-2.5 rounded-2xl text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-all"
                            >
                                <MessageCircle size={14} />
                                Falar com Suporte
                            </a>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}

// Utility to merge class names
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
