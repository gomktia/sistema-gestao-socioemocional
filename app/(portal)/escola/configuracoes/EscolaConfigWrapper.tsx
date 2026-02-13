'use client';

import { useState } from 'react';
import { updateTenantSettings } from '@/app/actions/tenant';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, ImageIcon, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EscolaConfigPage({ tenant }: { tenant: any }) {
    const [name, setName] = useState(tenant?.name || '');
    const [logoUrl, setLogoUrl] = useState(tenant?.logoUrl || '');
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPending(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('logoUrl', logoUrl);

        const result = await updateTenantSettings(formData);
        setPending(false);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Configurações salvas com sucesso!');
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configurações da Escola</h1>
                <p className="text-slate-500 mt-1.5 text-sm">Gerencie a identidade visual e o nome da sua instituição.</p>
            </div>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 p-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Building2 size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Identidade Institucional</CardTitle>
                            <CardDescription className="text-sm">Essas informações aparecerão em todos os relatórios.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="space-y-2.5">
                            <Label htmlFor="name" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                                Nome Oficial da Instituição
                            </Label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} strokeWidth={1.5} />
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Colégio Educador do Futuro"
                                    className="h-14 pl-12 rounded-2xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <Label htmlFor="logoUrl" className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                                URL do Logotipo
                            </Label>
                            <div className="relative group">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} strokeWidth={1.5} />
                                <Input
                                    id="logoUrl"
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    placeholder="https://exemplo.com/logo.png"
                                    className="h-14 pl-12 rounded-2xl border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {logoUrl && (
                            <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-100/50 flex items-center justify-center">
                                <img src={logoUrl} alt="Preview Logo" className="max-h-24 object-contain" onError={() => toast.error('Falha ao carregar o logo da URL fornecida.')} />
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={pending}
                            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                        >
                            {pending ? (
                                'Salvando...'
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save size={18} strokeWidth={1.5} /> Salvar Configurações
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-50/30 border-none p-7 rounded-3xl flex items-start gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={24} strokeWidth={1.5} />
                <div>
                    <h4 className="font-extrabold text-emerald-900 text-sm tracking-tight">Escola Verificada</h4>
                    <p className="text-emerald-700 text-xs mt-1.5 leading-relaxed">
                        Sua instituição está com o plano socioemocional ativo para o ano letivo de 2026.
                        As alterações aqui serão refletidas no cabeçalho das páginas e nos relatórios gerados.
                    </p>
                </div>
            </div>
        </div>
    );
}
