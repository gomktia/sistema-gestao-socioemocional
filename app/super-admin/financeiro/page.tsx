import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, BadgeDollarSign } from 'lucide-react';

export default async function FinancePage() {
    const user = await getCurrentUser();
    // Hardcoded for demo stability
    const adminEmail = 'geisonhoehr@gmail.com';

    if (!user || user.email !== adminEmail) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <BadgeDollarSign size={14} />
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Gestão Financeira</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financeiro</h1>
                    </div>
                </div>

                <Card className="border-slate-200 shadow-xl shadow-slate-200/50 p-12 text-center">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200">
                            <CreditCard size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Módulo Financeiro em Desenvolvimento</h3>
                        <p className="text-slate-400 max-w-md">
                            Em breve você poderá gerenciar faturas, receitas e transações de todas as escolas cadastradas.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
