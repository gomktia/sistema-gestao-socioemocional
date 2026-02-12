'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const DEMO_EMAILS = [
    'geisonhoehr@gmail.com',
    'admin@escola.com',
    'psi@escola.com',
    'professor@escola.com',
    'aluno@escola.com'
];

export default function DemoSetupPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [results, setResults] = useState<Record<string, 'success' | 'error' | 'exists'>>({});

    const supabase = createClient();

    const handleCreate = async (email: string) => {
        setLoading(email);

        const { error } = await supabase.auth.signUp({
            email,
            password: '123456',
        });

        setLoading(null);
        if (!error) {
            setResults(prev => ({ ...prev, [email]: 'success' }));
        } else if (error.message.includes('already registered')) {
            setResults(prev => ({ ...prev, [email]: 'exists' }));
        } else {
            console.error(error);
            setResults(prev => ({ ...prev, [email]: 'error' }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-2xl border-none">
                <CardHeader className="text-center pb-2">
                    <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={24} />
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900">Configuração de Demo</CardTitle>
                    <p className="text-sm text-slate-500 font-medium">Crie as contas de teste no Supabase Auth em um clique.</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3">
                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase tracking-tighter">
                            Aviso: Certifique-se de que "Confirm Email" está DESATIVADO no painel do Supabase Auth para funcionamento imediato.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {DEMO_EMAILS.map(email => (
                            <div key={email} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                                <span className="text-xs font-bold text-slate-700">{email}</span>
                                {results[email] === 'success' ? (
                                    <Badge className="bg-emerald-100 text-emerald-700">Criado</Badge>
                                ) : results[email] === 'exists' ? (
                                    <Badge className="bg-slate-200 text-slate-600">Já Existe</Badge>
                                ) : results[email] === 'error' ? (
                                    <Badge className="bg-rose-100 text-rose-700">Erro</Badge>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-[10px] font-black uppercase tracking-widest border-indigo-200 text-indigo-600"
                                        disabled={loading === email}
                                        onClick={() => handleCreate(email)}
                                    >
                                        {loading === email ? <Loader2 size={12} className="animate-spin" /> : 'Criar'}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <Link href="/login" className="block">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 h-12 font-black uppercase tracking-widest text-xs">
                            Ir para o Login
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest", className)}>
            {children}
        </span>
    );
}
