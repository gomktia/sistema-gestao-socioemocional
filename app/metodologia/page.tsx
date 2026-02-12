import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ChevronRight, BrainCircuit, Activity, ShieldCheck, HeartPulse, FileDown } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Metodologia Científica | Sistema Socioemocional',
    description: 'Conheça a base científica do nosso sistema de gestão socioemocional: SRSS-IE e VIA Character Strengths.',
};

export default function MetodologiaPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Header / Nav Area */}
            <div className="border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-black text-xl text-slate-900 flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <BrainCircuit size={18} />
                        </div>
                        EduInteligência
                    </div>
                    <div className="flex gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="font-bold text-slate-600">Entrar</Button>
                        </Link>
                        <Link href="/marketing">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold">Solicitar Demo</Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-slate-50 py-20 border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <span className="text-indigo-600 font-black uppercase tracking-widest text-xs mb-4 block">Ciência Aplicada</span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                        Não é "achismo". <br />
                        É <span className="text-indigo-600">Evidência Científica.</span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
                        Nossa plataforma integra os dois protocolos mais respeitados mundialmente para triagem de risco e desenvolvimento de virtudes. Conheça o motor por trás dos nossos dados.
                    </p>
                    {/* DOWNLOAD WHITEPAPER BUTTON */}
                    <div className="flex justify-center">
                        <Button size="lg" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold">
                            <FileDown className="mr-2" size={18} />
                            Baixar Whitepaper Técnico (PDF)
                        </Button>
                    </div>
                </div>
            </div>

            {/* Protocols Section */}
            <div className="py-20 max-w-7xl mx-auto px-6 space-y-24">

                {/* SRSS-IE */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                            <Activity size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">SRSS-IE: Triagem de Risco</h2>
                        <h3 className="text-lg font-bold text-slate-600 mb-6 uppercase tracking-wide">Student Risk Screening Scale - Internalizing & Externalizing</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Originalmente desenvolvida por Drummond (1994) e expandida por Lane et al., a SRSS-IE é uma ferramenta de triagem universal. Ela permite identificar precocemente alunos com comportamento de risco antes que o fracasso escolar ocorra.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-rose-500 mt-1 shrink-0" size={18} />
                                <span className="text-slate-700 text-sm font-medium"><strong>Internalizantes:</strong> Ansiedade, retraimento, tristeza, isolamento.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-rose-500 mt-1 shrink-0" size={18} />
                                <span className="text-slate-700 text-sm font-medium"><strong>Externalizantes:</strong> Agressividade, mentira, furtos, desobediência.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-rose-500 mt-1 shrink-0" size={18} />
                                <span className="text-slate-700 text-sm font-medium"><strong>Validação:</strong> Alta confiabilidade teste-reteste e consistência interna.</span>
                            </li>
                        </ul>
                        <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                            <p className="text-xs text-rose-800 font-bold italic">
                                "A detecção precoce é o fator #1 para o sucesso de intervenções escolares." — Lane et al.
                            </p>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 bg-slate-100 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100 opacity-50" />
                        {/* Abstract Representation */}
                        <div className="relative z-10 space-y-4 w-full max-w-sm">
                            <Card className="border-l-4 border-l-emerald-500 shadow-lg">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Baixo Risco (Tier 1)</span>
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-2 py-0.5 rounded">80%</span>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-amber-500 shadow-lg ml-4 opacity-90">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Risco Moderado (Tier 2)</span>
                                    <span className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-0.5 rounded">15%</span>
                                </CardContent>
                            </Card>
                            <Card className="border-l-4 border-l-rose-500 shadow-lg ml-8 opacity-80">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Alto Risco (Tier 3)</span>
                                    <span className="bg-rose-100 text-rose-700 text-xs font-black px-2 py-0.5 rounded">5%</span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* VIA Character Strengths */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-1 bg-indigo-50 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden">
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                            {['Criatividade', 'Coragem', 'Humanidade', 'Justiça'].map((virtue) => (
                                <div key={virtue} className="bg-white p-4 rounded-xl shadow-sm text-center">
                                    <HeartPulse className="mx-auto text-indigo-400 mb-2" size={24} />
                                    <span className="font-bold text-slate-700 text-sm">{virtue}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="order-2">
                        <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">VIA: Forças de Caráter</h2>
                        <h3 className="text-lg font-bold text-slate-600 mb-6 uppercase tracking-wide">Values in Action Classification</h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Desenvolvido pelo Dr. Martin Seligman e Dr. Christopher Peterson, o VIA é a "Tabela Periódica do Caráter". Ao invés de focar apenas no que está "errado" (patologia), focamos no que está "certo" (forças), permitindo intervenções baseadas em recursos.
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-indigo-500 mt-1 shrink-0" size={18} />
                                <span className="text-slate-700 text-sm font-medium"><strong>24 Forças Universais:</strong> Mapeadas transculturalmente em milhões de pessoas.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-indigo-500 mt-1 shrink-0" size={18} />
                                <span className="text-slate-700 text-sm font-medium"><strong>Assinatura de Força:</strong> As 5 forças "topo" que definem a identidade do indivíduo.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="text-indigo-500 mt-1 shrink-0" size={18} />
                                <span className="text-slate-700 text-sm font-medium"><strong>Aplicação:</strong> Aumento de engajamento, melhoria de clima e redução de conflitos.</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            {/* CTA */}
            <div className="bg-slate-900 py-20 text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <h2 className="text-3xl font-black text-white mb-6">Pronto para aplicar ciência na prática?</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Agende uma demonstração com nossos especialistas e veja como estes protocolos funcionam no nosso painel.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/marketing">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8">
                                Agendar Demo
                                <ChevronRight className="ml-2" size={18} />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="text-white border-slate-700 hover:bg-slate-800 hover:text-white">
                                Acessar Sistema
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
