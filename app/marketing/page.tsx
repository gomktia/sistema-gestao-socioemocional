'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
    TrendingUp,
    ShieldCheck,
    BrainCircuit,
    BarChart3,
    ChevronRight,
    Star,
    ArrowRight,
    School,
    LineChart,
    Users2,
    CheckCircle2,
    Building2,
    Briefcase,
    FileText,
    Zap
} from 'lucide-react';

export default function LandingPage() {
    const [activeNiche, setActiveNiche] = useState<'school' | 'military' | 'corporate'>('school');

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header */}
            <header className="px-4 lg:px-6 h-20 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                <Link className="flex items-center justify-center gap-2 group" href="#">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                        <BrainCircuit size={24} />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-slate-900">EduInteligência</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
                    <Link className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors hidden md:block" href="/metodologia">Metodologia Científica</Link>
                    <Link className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors hidden md:block" href="#solutions">Soluções</Link>
                    <Link className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors hidden md:block" href="#pricing">Planos</Link>
                    <Link className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors" href="/login">Entrar</Link>
                    <Link href="/login">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-black text-xs uppercase tracking-widest px-6 h-11">Acessar Demo</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-20 lg:py-32 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                            <div className="flex flex-col justify-center space-y-8 animate-in slide-in-from-left duration-700">
                                <div className="space-y-4">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">SaaS Multi-Tenant de Alta Performance</span>
                                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl xl:text-7xl/none text-slate-900">
                                        Inteligência Socioemocional para <span className="text-indigo-600">Líderes que Exigem Dados.</span>
                                    </h1>
                                    <p className="max-w-[540px] text-slate-500 md:text-xl font-medium leading-relaxed">
                                        A primeira plataforma que une triagem de risco (SRSS-IE) e forças de caráter (VIA) em um dashboard de comando adaptável para Escolas, Forças Armadas e Corporações.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                                    <Link href="/demo-setup">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-200">
                                            Solicitar Proposta <ArrowRight className="ml-2" size={18} />
                                        </Button>
                                    </Link>
                                    <Link href="/metodologia">
                                        <Button variant="outline" className="h-14 px-8 border-slate-200 text-sm font-black uppercase tracking-widest hover:bg-slate-50">
                                            Ver Metodologia
                                        </Button>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center"><ShieldCheck size={14} /></div>)}
                                    </div>
                                    <span>Certificado LGPD & Compliance Militar</span>
                                </div>
                            </div>
                            <div className="relative animate-in zoom-in duration-1000">
                                <div className="relative z-10 bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                    <div className="p-4 border-b border-white/10 flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-rose-500" />
                                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                        <div className="ml-4 h-6 w-64 bg-white/10 rounded-md" />
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-2">
                                                <div className="h-8 w-48 bg-white/20 rounded-md" />
                                                <div className="h-4 w-32 bg-white/10 rounded-md" />
                                            </div>
                                            <div className="h-10 w-10 bg-indigo-500 rounded-xl" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-32 bg-white/5 rounded-xl border border-white/10 p-4 space-y-2">
                                                <div className="h-4 w-8 bg-rose-500/50 rounded" />
                                                <div className="h-8 w-16 bg-white/20 rounded" />
                                            </div>
                                            <div className="h-32 bg-white/5 rounded-xl border border-white/10 p-4 space-y-2">
                                                <div className="h-4 w-8 bg-amber-500/50 rounded" />
                                                <div className="h-8 w-16 bg-white/20 rounded" />
                                            </div>
                                            <div className="h-32 bg-white/5 rounded-xl border border-white/10 p-4 space-y-2">
                                                <div className="h-4 w-8 bg-emerald-500/50 rounded" />
                                                <div className="h-8 w-16 bg-white/20 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-48 bg-white/5 rounded-xl border border-white/10 p-4">
                                            <div className="h-full w-full bg-gradient-to-t from-indigo-500/20 to-transparent rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Niches Solutions Section */}
                <section id="solutions" className="w-full py-20 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Soluções Adaptáveis</h2>
                            <h3 className="text-3xl font-black text-slate-900 sm:text-5xl">Um sistema. Múltiplas linguagens.</h3>
                        </div>

                        <div className="flex justify-center mb-12">
                            <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                                <button
                                    onClick={() => setActiveNiche('school')}
                                    className={cn("px-6 py-3 rounded-lg text-sm font-bold transition-all", activeNiche === 'school' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-900")}
                                >
                                    <School className="inline mr-2" size={16} /> Escolas
                                </button>
                                <button
                                    onClick={() => setActiveNiche('military')}
                                    className={cn("px-6 py-3 rounded-lg text-sm font-bold transition-all", activeNiche === 'military' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-900")}
                                >
                                    <ShieldCheck className="inline mr-2" size={16} /> Militar
                                </button>
                                <button
                                    onClick={() => setActiveNiche('corporate')}
                                    className={cn("px-6 py-3 rounded-lg text-sm font-bold transition-all", activeNiche === 'corporate' ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-900")}
                                >
                                    <Briefcase className="inline mr-2" size={16} /> Corporativo
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                {activeNiche === 'school' && (
                                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                        <span className="text-indigo-600 font-black uppercase tracking-widest text-xs">Nicho Educacional</span>
                                        <h4 className="text-3xl font-black text-slate-900 mt-2 mb-4">Transforme a Saúde Emocional no Maior Ativo da Sua Escola.</h4>
                                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                            Atenda às exigências do Novo Ensino Médio com uma plataforma que une triagem psicológica, prevenção ao bullying e melhora do desempenho acadêmico.
                                        </p>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" /> <span className="text-slate-700 font-medium">Identifique alunos silenciosos (bullying/ansiedade).</span></li>
                                            <li className="flex gap-3 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" /> <span className="text-slate-700 font-medium">Redução da inadimplência pelo acolhimento emocional.</span></li>
                                            <li className="flex gap-3 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" /> <span className="text-slate-700 font-medium">Automatize o trabalho dos orientadores.</span></li>
                                        </ul>
                                    </div>
                                )}
                                {activeNiche === 'military' && (
                                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                        <span className="text-indigo-600 font-black uppercase tracking-widest text-xs">Nicho Militar & Segurança</span>
                                        <h4 className="text-3xl font-black text-slate-900 mt-2 mb-4">Prontidão Operacional Começa na Mente da Tropa.</h4>
                                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                            Monitoramento de indicadores psicossociais e resiliência para Comandantes que exigem o máximo de seus efetivos, com segurança de dados de nível defesa.
                                        </p>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" /> <span className="text-slate-700 font-medium">Visibilidade de estresse pré-missão.</span></li>
                                            <li className="flex gap-3 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" /> <span className="text-slate-700 font-medium">Identificação precoce de TEPT e burnout.</span></li>
                                            <li className="flex gap-3 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" /> <span className="text-slate-700 font-medium">Gestão estratégica de baixas psicossociais.</span></li>
                                        </ul>
                                    </div>
                                )}
                                {activeNiche === 'corporate' && (
                                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                        <span className="text-indigo-600 font-black uppercase tracking-widest text-xs">Nicho Corporativo & ESG</span>
                                        <h4 className="text-3xl font-black text-slate-900 mt-2 mb-4">O 'S' do ESG com Métricas Reais e ROI Comprovado.</h4>
                                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                            Reduza o Burnout e aumente a retenção de talentos mapeando as Forças de Caráter dos seus colaboradores. Cultura organizacional baseada em dados.
                                        </p>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" /> <span className="text-slate-700 font-medium">Relatórios tangíveis para ESG.</span></li>
                                            <li className="flex gap-3 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" /> <span className="text-slate-700 font-medium">Mapeamento de talentos via VIA Strengths.</span></li>
                                            <li className="flex gap-3 items-start"><CheckCircle2 className="text-emerald-500 shrink-0" /> <span className="text-slate-700 font-medium">Redução de turnover por causas mentais.</span></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="bg-slate-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
                                <Users2 size={120} className="text-slate-300" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Soberania Profissional Section */}
                <section className="w-full py-20 bg-white border-y border-slate-100">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-50" />
                                <div className="relative z-10 space-y-6">
                                    <FileText className="text-indigo-400" size={48} />
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold">Laudo Gerado com IA</h3>
                                        <div className="bg-white/10 p-4 rounded-lg text-sm text-slate-300 font-mono leading-relaxed">
                                            "Com base na avaliação VIA, o aluno apresenta 'Perseverança' e 'Trabalho em Equipe' como forças de assinatura. O índice SRSS indica Risco Moderado..."
                                            <span className="animate-pulse">|</span>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold">Ver Exemplo de PDF</Button>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest">
                                    <Zap size={12} fill="currentColor" /> Nova Feature
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 leading-tight">
                                    A Tecnologia escreve o rascunho.<br />
                                    <span className="text-indigo-600">Você assina a obra de arte.</span>
                                </h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Sabemos que um laudo técnico exige precisão cirúrgica e sensibilidade humana.
                                    Nosso módulo de IA analisa milhões de cruzamentos de dados e gera um pré-laudo em segundos.
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                    Economize 80% do seu tempo de escrita, mas mantenha a palavra final e sua assinatura técnica.
                                </p>
                                <div className="pt-4">
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 items-center text-slate-700 font-bold"><CheckCircle2 size={18} className="text-indigo-600" /> Exportação PDF Profissional</li>
                                        <li className="flex gap-3 items-center text-slate-700 font-bold"><CheckCircle2 size={18} className="text-indigo-600" /> Editor de Texto Rico</li>
                                        <li className="flex gap-3 items-center text-slate-700 font-bold"><CheckCircle2 size={18} className="text-indigo-600" /> Histórico Blindado</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="w-full py-20 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Investimento Estratégico</h2>
                            <h3 className="text-3xl font-black text-slate-900 sm:text-5xl">Planos Adaptados à sua Maturidade</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Essential */}
                            <Card className="bg-white p-8 hover:shadow-xl transition-all border-t-4 border-t-slate-300">
                                <div className="space-y-4 mb-8">
                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Essential</h4>
                                    <div className="text-4xl font-black text-slate-900">R$ 1.990<span className="text-sm font-medium text-slate-400">/mês</span></div>
                                    <p className="text-sm text-slate-500 font-medium">Para diagnóstico inicial em pequenas unidades.</p>
                                </div>
                                <ul className="space-y-4 mb-8 text-sm font-medium text-slate-600">
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Até 200 Membros</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Triagem SRSS-IE Básica</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Dashboard Básico</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Suporte por Email</li>
                                </ul>
                                <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold">Começar Agora</Button>
                            </Card>

                            {/* Advance */}
                            <Card className="bg-white p-8 shadow-2xl scale-105 border-t-4 border-t-indigo-500 relative">
                                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">Mais Popular</div>
                                <div className="space-y-4 mb-8">
                                    <h4 className="text-lg font-black text-indigo-600 uppercase tracking-widest">Advance</h4>
                                    <div className="text-4xl font-black text-slate-900">R$ 3.490<span className="text-sm font-medium text-slate-400">/mês</span></div>
                                    <p className="text-sm text-slate-500 font-medium">Gestão completa de ciclo e intervenção.</p>
                                </div>
                                <ul className="space-y-4 mb-8 text-sm font-bold text-slate-700">
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Até 1.000 Membros</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> SRSS-IE + VIA Forças</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Dashboard Evolutivo (Mar/Jun/Out)</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-indigo-500" /> Exportação Excel</li>
                                </ul>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-lg shadow-indigo-200">Solicitar Advance</Button>
                            </Card>

                            {/* Sovereign */}
                            <Card className="bg-slate-900 p-8 text-white border-t-4 border-t-amber-400">
                                <div className="space-y-4 mb-8">
                                    <h4 className="text-lg font-black text-amber-400 uppercase tracking-widest">Sovereign</h4>
                                    <div className="text-4xl font-black text-white">Custom <span className="text-sm font-medium text-slate-400">/vol</span></div>
                                    <p className="text-sm text-slate-400 font-medium">Inteligência total para Redes e Grandes Comandos.</p>
                                </div>
                                <ul className="space-y-4 mb-8 text-sm font-medium text-slate-300">
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-400" /> Volume Ilimitado</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-400" /> Todos os Protocolos</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-400" /> Laudos PDF com IA</li>
                                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-amber-400" /> Gerente de Contas Dedicado</li>
                                </ul>
                                <Button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold">Falar com Consultor</Button>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Secure CTA */}
                <section className="w-full py-16 bg-white border-t border-slate-100">
                    <div className="container px-4 text-center">
                        <p className="text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
                            <ShieldCheck size={16} /> Seus dados estão 100% seguros e blindados.
                        </p>
                    </div>
                </section>
            </main>

            <footer className="w-full py-12 bg-white border-t border-slate-100">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 EduInteligência SaaS.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-slate-400 hover:text-indigo-600"><Users2 size={20} /></Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Card({
    children,
    className,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}) {
    return (
        <div className={cn("rounded-[2rem] border border-slate-200", className)} {...props}>
            {children}
        </div>
    );
}
