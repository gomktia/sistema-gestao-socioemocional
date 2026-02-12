'use client';

import { Button } from '@/components/ui/button';
import { CreditCard, AlertCircle, Phone } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionExpiredPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-100/50">
                        <AlertCircle size={40} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assinatura Suspensa</h1>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Identificamos uma pendência financeira na assinatura da sua escola. O acesso ao portal foi temporariamente bloqueado.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-4 text-left">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status da Conta</p>
                            <p className="font-bold text-rose-600">Inadimplente (Past Due)</p>
                        </div>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 font-black uppercase tracking-widest text-xs">
                        Regularizar Agora
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    <Link href="/marketing">
                        <Button variant="ghost" className="text-slate-400 font-bold hover:text-indigo-600">
                            Voltar ao Início
                        </Button>
                    </Link>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Phone size={12} />
                        Suporte: (11) 99999-9999
                    </div>
                </div>
            </div>
        </div>
    );
}
