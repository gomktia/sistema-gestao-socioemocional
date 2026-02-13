import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Users, BarChart3, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getLabels } from '@/src/lib/utils/labels';

export const metadata = {
    title: 'Relatórios Integrados | Central de Exportação',
};

export default async function RelatoriosPage() {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const labels = getLabels(user.organizationType);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Relatórios e Documentos
                    </h1>
                    <p className="text-slate-500 mt-1.5 text-sm">Central de exportação de laudos, pareceres e mapas de risco.</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-50/30 rounded-3xl p-7 flex gap-5 items-start shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="bg-white p-3.5 rounded-2xl shadow-sm text-indigo-600">
                    <FileText size={24} strokeWidth={1.5} />
                </div>
                <div>
                    <h3 className="text-lg font-extrabold text-indigo-900 tracking-tight">Novo Fluxo de Relatórios</h3>
                    <p className="text-indigo-700 text-sm mt-1.5 leading-relaxed">
                        Para otimizar o fluxo de trabalho, a geração de documentos individuais agora é feita diretamente no perfil de cada {labels.subject.toLowerCase()}.
                        Acesse a lista de {labels.subjects.toLowerCase()}, selecione um perfil e use os botões de ação para emitir Laudos, PEIs e Encaminhamentos.
                    </p>
                    <Link href="/alunos">
                        <Button className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 rounded-2xl active:scale-95 transition-all">
                            Ir para Lista de {labels.subjects}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-slate-700 group-hover:text-indigo-700 transition-colors">
                            <Users size={20} strokeWidth={1.5} />
                            <span>Lista Geral de {labels.subjects}</span>
                        </CardTitle>
                        <CardDescription>Formatos: Excel (.xlsx), PDF</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500 mb-4 h-10 leading-relaxed">Exportação completa da base de dados com status de triagem e forças de caráter.</p>
                        <Button variant="outline" className="w-full text-xs font-extrabold uppercase tracking-wider rounded-2xl active:scale-95 transition-all" disabled>
                            Disponível em breve
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-slate-700 group-hover:text-indigo-700 transition-colors">
                            <BarChart3 size={20} strokeWidth={1.5} />
                            <span>Relatório de Impacto (Gestão)</span>
                        </CardTitle>
                        <CardDescription>Formatos: PDF</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500 mb-4 h-10 leading-relaxed">Análise executiva de eficácia das intervenções e redução de riscos (Comparativo Semestral).</p>
                        <Link href="/gestao">
                            <Button variant="outline" className="w-full text-xs font-extrabold uppercase tracking-wider rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-200 active:scale-95 transition-all">
                                Acessar Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-rose-500/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-slate-700 group-hover:text-rose-700 transition-colors">
                            <ShieldAlert size={20} strokeWidth={1.5} />
                            <span>Protocolos de Crise</span>
                        </CardTitle>
                        <CardDescription>Formatos: PDF (Oficial)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500 mb-4 h-10 leading-relaxed">Histórico de emissão de documentos de encaminhamento externo de urgência.</p>
                        <Button variant="outline" className="w-full text-xs font-extrabold uppercase tracking-wider rounded-2xl active:scale-95 transition-all" disabled>
                            Consultar Histórico
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
