'use client';

import { useState } from 'react';
import { login } from './actions';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

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
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
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
