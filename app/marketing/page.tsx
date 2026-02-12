'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
    Users2
} from 'lucide-react';

export default function LandingPage() {
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
                    <Link className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors hidden md:block" href="#features">Funcionalidades</Link>
                    <Link className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors hidden md:block" href="#impact">Impacto</Link>
                    <Link className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors" href="/login">Entrar</Link>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-black text-xs uppercase tracking-widest px-6 h-11">Acessar Demo</Button>
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
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">SaaS Socioemocional de Próxima Geração</span>
                                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl xl:text-7xl/none text-slate-900">
                                        A Inteligência que sua Escola precisa para <span className="text-indigo-600">Proteger e Desenvolver</span> seus alunos.
                                    </h1>
                                    <p className="max-w-[540px] text-slate-500 md:text-xl font-medium leading-relaxed">
                                        A primeira plataforma SaaS que une o framework RTI (Resposta à Intervenção) com dados acadêmicos para prever riscos e sugerir intervenções personalizadas.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-200">
                                        Solicitar Proposta <ArrowRight className="ml-2" size={18} />
                                    </Button>
                                    <Button variant="outline" className="h-14 px-8 border-slate-200 text-sm font-black uppercase tracking-widest hover:bg-slate-50">
                                        Ver Demonstração
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center"><Users2 size={14} /></div>)}
                                    </div>
                                    <span>+50 Escolas utilizando a metodologia RTI</span>
                                </div>
                            </div>
                            <div className="relative animate-in zoom-in duration-1000">
                                <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                                    <img
                                        alt="Dashboard Preview"
                                        className="aspect-video object-cover"
                                        src="https://images.unsplash.com/photo-1551288049-bbbda546697c?q=80&w=2070&auto=format&fit=crop"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent h-1/2" />
                                </div>
                                <div className="absolute -top-6 -right-6 h-32 w-32 bg-indigo-600 rounded-3xl -z-10 shadow-3xl rotate-12" />
                                <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-emerald-500 rounded-full -z-10 shadow-3xl opacity-20 blur-2xl" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section id="impact" className="w-full py-20 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Resultados Comprovados</h2>
                            <p className="text-3xl font-black tracking-tighter sm:text-5xl text-slate-900">Educação data-driven para decisões assertivas.</p>
                            <p className="max-w-[700px] text-slate-500 md:text-lg font-medium">
                                Nossa plataforma transforma dados complexos em ações pedagógicas claras, reduzindo custos e aumentando a retenção.
                            </p>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                { title: "Redução de Riscos", value: "65%", label: "Queda em alertas críticos (Tier 3) no primeiro ano de uso.", icon: TrendingUp, color: "text-emerald-500" },
                                { title: "Prevenção de Evasão", value: "40%", label: "Antecipação de evasão escolar através dos indicadores EWS.", icon: ShieldCheck, color: "text-indigo-500" },
                                { title: "Gestão do Tempo", value: "80%", label: "Economia de tempo da equipe técnica com PEIs automatizados.", icon: BarChart3, color: "text-amber-500" }
                            ].map((item, i) => (
                                <Card key={i} className="border-none shadow-xl shadow-slate-200/50 bg-white p-8 group hover:-translate-y-2 transition-transform duration-300">
                                    <div className={`p-3 rounded-2xl bg-slate-50 inline-block mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors ${item.color}`}>
                                        <item.icon size={32} />
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-900 mb-2">{item.value}</h3>
                                    <p className="text-lg font-bold text-slate-800 mb-4">{item.title}</p>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.label}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-20 bg-white relative">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid gap-12 lg:grid-cols-2 items-center">
                            <div className="relative">
                                <div className="bg-indigo-600 rounded-[40px] aspect-square flex items-center justify-center overflow-hidden shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
                                        className="object-cover w-full h-full opacity-80"
                                        alt="School environment"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-[200px]">
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 italic">"Mudou completamente o clima escolar do Colégio."</p>
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black tracking-tighter text-slate-900">O que a sua escola ganha?</h2>
                                    <p className="text-slate-500 font-medium">Combinamos psicologia positiva com machine learning para resultados pedagógicos.</p>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { title: "RTI Socioemocional", desc: "Framework de resposta à intervenção automatizado para camadas 1, 2 e 3.", icon: BarChart3 },
                                        { title: "Early Warning System (EWS)", desc: "Alerta precoce cruzando faltas, notas e comportamento.", icon: LineChart },
                                        { title: "Framework VIA Strengths", desc: "Mapeamento completo das 24 forças de caráter dos alunos.", icon: BrainCircuit },
                                        { title: "Protocolos de Crise Digital", desc: "Encaminhamentos automáticos para rede de saúde (CAPS/SAMU).", icon: ShieldCheck }
                                    ].map((feat, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                                            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                <feat.icon size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{feat.title}</h4>
                                                <p className="text-sm text-slate-500 mt-1">{feat.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-20 bg-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-900/20" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10 text-center space-y-8">
                        <h2 className="text-3xl font-black tracking-tighter sm:text-6xl text-white">Pronto para digitalizar o suporte socioemocional?</h2>
                        <p className="max-w-[800px] mx-auto text-indigo-100 text-lg md:text-xl font-medium">
                            Agende uma reunião estratégica agora e descubra como o EduInteligência pode transformar o desempenho e o bem-estar dos seus alunos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 h-16 px-12 text-md font-black uppercase tracking-widest shadow-2xl">
                                Começar Agora
                            </Button>
                            <Button variant="outline" className="h-16 px-12 text-md font-black uppercase tracking-widest bg-transparent border-white text-white hover:bg-white/10">
                                Falar com consultor
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full py-12 bg-white border-t border-slate-100">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                        <div className="space-y-6">
                            <Link className="flex items-center gap-2" href="#">
                                <BrainCircuit className="text-indigo-600" size={28} />
                                <span className="font-black text-xl tracking-tighter text-slate-900">EduInteligência</span>
                            </Link>
                            <p className="text-sm text-slate-500 font-medium">
                                Transformando a educação através de dados, psicologia e inteligência artificial.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-widest mb-6">Plataforma</h4>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Framework RTI</Link></li>
                                <li><Link href="#" className="hover:text-indigo-600 transition-colors">VIA Strengths</Link></li>
                                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Alertas EWS</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-widest mb-6">Escola</h4>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Casos de Sucesso</Link></li>
                                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Metodologia</Link></li>
                                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Página de Preços</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-xs uppercase tracking-widest mb-6">Suporte</h4>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Centro de Ajuda</Link></li>
                                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Fale conosco</Link></li>
                                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Privacidade & LGPD</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 EduInteligência SaaS. Todos os direitos reservados.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-slate-400 hover:text-indigo-600"><Users2 size={20} /></Link>
                            <Link href="#" className="text-slate-400 hover:text-indigo-600"><TrendingUp size={20} /></Link>
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
