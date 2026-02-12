'use client';

import { useState } from 'react';
import { login } from './actions';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const TEST_USERS = [
        { label: 'Super Admin', email: 'geisonhoehr@gmail.com', role: 'SaaS', color: 'bg-slate-800 text-white' },
        { label: 'Gestor', email: 'admin@escola.com', role: 'Escola', color: 'bg-indigo-100 text-indigo-700' },
        { label: 'Psicólogo', email: 'psi@escola.com', role: 'Escola', color: 'bg-pink-100 text-pink-700' },
        { label: 'Professor', email: 'professor@escola.com', role: 'Escola', color: 'bg-emerald-100 text-emerald-700' },
        { label: 'Aluno', email: 'aluno@escola.com', role: 'Escola', color: 'bg-blue-100 text-blue-700' },
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
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden max-w-md w-full mx-auto">
            <div className="p-6 sm:p-8">
                <div className="mb-8 text-center text-indigo-600">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 mb-4">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestão Socioemocional</h1>
                    <p className="text-sm text-slate-500 mt-1">Bem-vindo(a) ao portal de inteligência</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-slate-700 mb-1"
                        >
                            Email institucional
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplo@escola.com.br"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Senha
                            </label>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3">
                            <p className="text-sm font-medium text-red-600">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={pending}
                        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {pending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Validando...
                            </>
                        ) : (
                            'Entrar no Portal'
                        )}
                    </button>
                </form>

                {/* Quick Login / Acesso Rápido */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
                        ⚡ Acesso Rápido (Ambiente de Teste)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {TEST_USERS.map((user) => (
                            <button
                                key={user.label}
                                type="button"
                                onClick={() => handleQuickLogin(user.email)}
                                className={`text-xs font-semibold py-2 px-3 rounded-md transition-opacity hover:opacity-80 flex items-center justify-between group ${user.color}`}
                            >
                                <span>{user.label}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase">Entrar</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-4 text-center border-t border-slate-100 space-y-2">
                <p className="text-xs text-slate-500">
                    Problemas com o acesso? Procure a orientação educacional.
                </p>
                <Link href="/demo-setup" className="block text-[10px] font-black text-indigo-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                    Configuração de Demo (Primeiro Acesso)
                </Link>
            </div>
        </div>
    );
}
