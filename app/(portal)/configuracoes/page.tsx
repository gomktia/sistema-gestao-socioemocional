import { getCurrentUser } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Shield, Key, Bell, HelpCircle, FileText, ChevronRight, Settings } from 'lucide-react';
import { getQuestions } from '@/app/actions/form-questions';
import { getLabels } from '@/src/lib/utils/labels';

export default async function SettingsPage() {
    const user = await getCurrentUser();
    if (!user) return null;

    const labels = getLabels(user.organizationType);
    const questions = user.role !== 'STUDENT' ? await getQuestions() : [];

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configurações</h1>
                <p className="text-slate-500 mt-1">Gerencie sua conta e as preferências do sistema.</p>
            </div>

            <Tabs defaultValue="perfil" className="space-y-8">
                <TabsList className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200 h-14 w-full sm:w-auto overflow-x-auto justify-start sm:justify-center">
                    <TabsTrigger value="perfil" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all flex items-center gap-2">
                        <UserCircle size={18} />
                        Perfil
                    </TabsTrigger>
                    {user.role !== 'STUDENT' && (
                        <TabsTrigger value="protocolos" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all flex items-center gap-2">
                            <FileText size={18} />
                            Protocolos
                        </TabsTrigger>
                    )}
                    <TabsTrigger value="seguranca" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 transition-all flex items-center gap-2">
                        <Shield size={18} />
                        Segurança
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="perfil" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-1 rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-8 text-center bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
                                    <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-4xl font-black mb-4 border-4 border-white/10">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h2 className="text-xl font-black truncate">{user.name}</h2>
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">{user.role}</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID Usuário</span>
                                        <span className="text-sm font-mono text-slate-600">#{user.id.slice(-6)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Escola</span>
                                        <span className="text-sm font-bold text-slate-900">Ativa</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="lg:col-span-2 space-y-6">
                            <Card className="rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
                                <CardContent className="p-8 space-y-8">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 mb-6">Informações Pessoais</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nome Completo</label>
                                                <div className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center text-slate-900 font-bold italic opacity-60">
                                                    {user.name}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">E-mail</label>
                                                <div className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center text-slate-900 font-bold italic opacity-60">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-bold shadow-lg shadow-indigo-200">
                                            Salvar Alterações
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="protocolos" className="space-y-6">
                    <Card className="rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Domínios de Avaliação</h3>
                                <p className="text-slate-500 text-sm">Gerencie o banco de perguntas dos protocolos VIA e SRSS.</p>
                            </div>
                            <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-slate-600">
                                Exportar Protocolo
                            </Button>
                        </div>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Questão</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {questions.map((q: any) => (
                                            <tr key={q.id} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="px-8 py-4 font-mono text-xs text-slate-400">{q.number}</td>
                                                <td className="px-8 py-4">
                                                    <span className={cn(
                                                        "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                                                        q.type === 'VIA' ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"
                                                    )}>
                                                        {q.type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 truncate max-w-md text-sm font-bold text-slate-600">{q.text}</td>
                                                <td className="px-8 py-4 text-xs font-bold text-slate-400">{q.category || 'Geral'}</td>
                                                <td className="px-8 py-4 text-right">
                                                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                                        <Settings size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seguranca" className="space-y-6">
                    <Card className="rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
                                <Key size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Alterar Senha</h3>
                                <p className="text-slate-500 text-xs">Proteja sua conta com uma senha forte.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-40 pointer-events-none">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha Atual</label>
                                <div className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center text-slate-300">••••••••</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nova Senha</label>
                                <div className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center text-slate-300">••••••••</div>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <Button disabled className="bg-slate-100 text-slate-400 rounded-2xl h-12 px-8 font-bold">
                                Atualizar Credenciais
                            </Button>
                            <p className="text-[10px] text-slate-400 mt-4 italic">Modulo de segurança sob manutenção programada.</p>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
