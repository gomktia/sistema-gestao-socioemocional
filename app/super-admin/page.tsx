import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ShieldCheck,
    Building2,
    Users,
    CreditCard,
    Clock,
    AlertCircle,
    Settings2,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
    title: 'Super Admin | EduInteligência SaaS',
};

export default async function SuperAdminPage() {
    const user = await getCurrentUser();
    // Hardcoded for demo stability
    const adminEmail = 'geisonhoehr@gmail.com';

    if (!user || user.email !== adminEmail) {
        redirect('/');
    }

    const supabase = await createClient();

    // 1. Buscar todas as escolas (Tenants)
    const { data: tenants } = await supabase
        .from('tenants')
        .select(`
      *,
      _count_users: users(count),
      _count_students: students(count)
    `)
        .order('createdAt', { ascending: false });

    // 2. Metadados Globais
    const totalTenants = tenants?.length || 0;
    const activeTenants = tenants?.filter(t => t.subscriptionStatus === 'active').length || 0;
    const revenueMonthly = activeTenants * 987; // Ex: R$ 987,00 por escola

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <ShieldCheck size={14} />
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Painel Global</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Super Admin SaaS</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-slate-200 shadow-sm font-black text-xs uppercase">
                            Configurações Globais
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-black text-xs uppercase">
                            Cadastrar Nova Escola
                        </Button>
                    </div>
                </div>

                {/* Estatísticas Globais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Escolas" value={totalTenants} icon={Building2} color="text-indigo-600" />
                    <StatCard title="Assinaturas Ativas" value={activeTenants} icon={CreditCard} color="text-emerald-500" />
                    <StatCard title="Inadimplência" value={totalTenants - activeTenants} icon={AlertCircle} color="text-rose-500" />
                    <StatCard title="MRR Estimado" value={`R$ ${revenueMonthly.toLocaleString('pt-BR')}`} icon={Clock} color="text-amber-500" />
                </div>

                {/* Lista de Escolas Recentes */}
                <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 py-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest px-1">Últimas Escolas Cadastradas</CardTitle>
                        <Link href="/super-admin/escolas">
                            <Button variant="ghost" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 h-8">
                                VER TODAS
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                {/* ... table definition same as before but limited rows ... */}
                                <thead>
                                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-4">Escola / Tenant</th>
                                        <th className="px-6 py-4 text-center">Usuários</th>
                                        <th className="px-6 py-4 text-center">Alunos</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Assinatura</th>
                                        <th className="px-6 py-4">Criado em</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {tenants?.slice(0, 5).map((tenant) => (
                                        <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                                            {/* ... row content ... */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                        <Building2 size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 text-sm leading-none mb-1">{tenant.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tenant.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center px-1 font-black text-slate-600 text-sm">
                                                {tenant.count_users || 0}
                                            </td>
                                            <td className="px-6 py-5 text-center px-1 font-black text-slate-600 text-sm">
                                                {tenant.count_students || 0}
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                                                    tenant.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {tenant.isActive ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-tighter",
                                                        tenant.subscriptionStatus === 'active' ? "text-emerald-600" :
                                                            tenant.subscriptionStatus === 'past_due' ? "text-amber-600" : "text-rose-600"
                                                    )}>
                                                        {tenant.subscriptionStatus}
                                                    </span>
                                                    <div className="h-1 w-20 bg-slate-100 rounded-full">
                                                        <div className={cn(
                                                            "h-full rounded-full",
                                                            tenant.subscriptionStatus === 'active' ? "bg-emerald-500" : "bg-rose-500"
                                                        )} style={{ width: tenant.subscriptionStatus === 'active' ? '100%' : '30%' }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-[11px] font-bold text-slate-500">
                                                {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                                        <Settings2 size={16} />
                                                    </Button>
                                                    <Link href={`/super-admin/school-access/${tenant.slug}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 shadow-none">
                                                            <ExternalLink size={16} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <Card className="border-slate-200 shadow-sm bg-white p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center", color)}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        </Card>
    );
}
