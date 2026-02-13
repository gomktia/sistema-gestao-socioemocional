'use client';

import { useState } from 'react';
import { login } from './actions';
import { Loader2, Lock, Mail, BrainCircuit, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const TEST_USERS = [
        { label: 'Super Admin', email: 'geisonhoehr@gmail.com', role: 'SaaS', color: 'bg-slate-900 text-white' },
        { label: 'Gestor', email: 'admin@escola.com', role: 'Escola', color: 'bg-indigo-600 text-white' },
        { label: 'Psicólogo', email: 'psi@escola.com', role: 'Escola', color: 'bg-pink-600 text-white' },
        { label: 'Professor', email: 'professor@escola.com', role: 'Escola', color: 'bg-emerald-600 text-white' },
    ];

    const handleQuickLogin = async (uEmail: string) => {
        setPending(true);
        setError(null);
        const formData = new FormData();
        formData.set('email', uEmail);
        formData.set('password', '123456');
        setEmail(uEmail);
        setPassword('123456');
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
            setPending(false);
        }
    };

    async function handleSubmit(formData: FormData) {
        setPending(true);
        setError(null);
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
            setPending(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/40 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="p-8 sm:p-12">
                        {/* Header */}
                        <div className="mb-10 text-center">
                            <Link href="/" className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-100 mb-6 hover:scale-110 transition-transform duration-500">
                                <BrainCircuit size={32} />
                            </Link>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portal de Comando</h1>
                            <p className="text-sm text-slate-500 mt-2 font-medium">Acesse a inteligência socioemocional</p>
                        </div>

                        {/* Form */}
                        <form action={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                                >
                                    CPF ou Email Institucional
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="000.000.000-00 ou email@escola.com"
                                        required
                                        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label
                                        htmlFor="password"
                                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                                    >
                                        Senha de Acesso
                                    </label>
                                    <Link href="#" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600">Esqueci a senha</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-xs font-bold text-rose-600 flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600 inline-block shrink-0" /> {error}
                                    </p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={pending}
                                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 group"
                            >
                                {pending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Validando Acesso...
                                    </>
                                ) : (
                                    <>
                                        Entrar no Sistema <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Developer Shortcuts */}
                        <div className="mt-12 pt-8 border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">
                                Dev Quick Access
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {TEST_USERS.map((user) => (
                                    <button
                                        key={user.label}
                                        type="button"
                                        onClick={() => handleQuickLogin(user.email)}
                                        className={cn(
                                            "h-10 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm",
                                            user.color
                                        )}
                                    >
                                        {user.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 p-6 text-center border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            © 2026 GomkTia Intelligence Systems
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
