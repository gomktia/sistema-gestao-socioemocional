import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, CheckCircle, TrendingUp, FileBarChart } from 'lucide-react';
import { getLabels } from '@/src/lib/utils/labels';

export const metadata = {
    title: 'Financeiro | Gestão',
};

export default async function FinanceiroPage() {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
        redirect('/');
    }

    const labels = getLabels(user.organizationType);

    const subscription = {
        plan: 'Plano Anual - Premium',
        status: 'active',
        renewalDate: '12/12/2026',
        licenses: { total: 1000, used: 540 },
        amount: 'R$ 14.900,00'
    };

    const invoices = [
        { id: 'INV-2026-001', date: '12/12/2025', amount: 'R$ 14.900,00', status: 'paid', period: 'Jan 2026 - Dez 2026' },
        { id: 'INV-2025-001', date: '12/12/2024', amount: 'R$ 12.500,00', status: 'paid', period: 'Jan 2025 - Dez 2025' },
    ];

    const usagePercentage = (subscription.licenses.used / subscription.licenses.total) * 100;

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financeiro & Assinatura</h1>
                <p className="text-slate-500 mt-1.5 text-sm">Gerencie seu plano, faturas e consumo de licenças.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subscription Status Card */}
                <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative group hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" />
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                                    <CreditCard className="text-indigo-600" size={24} strokeWidth={1.5} />
                                    {subscription.plan}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1.5">
                                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                                        <CheckCircle size={12} strokeWidth={1.5} /> Ativo
                                    </span>
                                    <span className="text-sm text-slate-400">Renovação em {subscription.renewalDate}</span>
                                </CardDescription>
                            </div>
                            <Button variant="outline" className="hidden sm:flex border-indigo-100 text-indigo-700 hover:bg-indigo-50 rounded-2xl active:scale-95 transition-all">
                                Alterar Plano
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100/50">
                            <div className="flex items-end justify-between mb-3">
                                <div>
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Uso de Licenças</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900 tracking-tight">{subscription.licenses.used}</span>
                                        <span className="text-sm font-medium text-slate-500">/ {subscription.licenses.total} {labels.subjects.toLowerCase()}</span>
                                    </div>
                                </div>
                                <span className="text-xl font-black text-indigo-600">{usagePercentage.toFixed(0)}%</span>
                            </div>

                            {/* Gradient Progress Bar */}
                            <div className="h-4 w-full bg-slate-200/60 rounded-full overflow-hidden relative shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] relative overflow-hidden"
                                    style={{ width: `${usagePercentage}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2.5 text-right font-medium">
                                Você ainda tem <strong className="text-slate-600">{subscription.licenses.total - subscription.licenses.used}</strong> licenças disponíveis.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Card */}
                <Card className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white border-none shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full" />

                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-300">Investimento Anual</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-end h-40">
                        <p className="text-4xl font-black tracking-tight">{subscription.amount}</p>
                        <p className="text-sm text-indigo-300 mt-1.5 font-medium flex items-center gap-1.5">
                            <TrendingUp size={16} strokeWidth={1.5} /> Contrato vigente
                        </p>
                        <Button className="mt-6 w-full bg-white text-slate-900 hover:bg-slate-100 font-extrabold active:scale-95 transition-all rounded-2xl shadow-lg">
                            Baixar Contrato
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices List */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <CardHeader>
                    <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Histórico de Faturas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {invoices.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/60 hover:bg-slate-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md border border-slate-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-11 w-11 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                        <FileBarChart size={20} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-slate-800 text-sm tracking-tight">{inv.period}</p>
                                        <p className="text-xs text-slate-500">Emitido em {inv.date}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-6">
                                    <div>
                                        <p className="font-black text-slate-900">{inv.amount}</p>
                                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-widest">Pago</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-95 transition-all">
                                        <Download size={20} strokeWidth={1.5} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
