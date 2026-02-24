import { getDashboardMetrics } from '@/app/actions/super-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ShieldCheck,
    Building2,
    Users,
    CreditCard,
    Clock,
    ExternalLink,
    FileText,
    Activity,
    BrainCircuit,
    AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { CreateSchoolDialog } from '@/components/admin/CreateSchoolDialog';

export const metadata = {
    title: 'Super Admin | Triavium SaaS',
};

function getSuggestedPlan(studentCount: number, assessmentCount: number): string {
    if (studentCount > 1000) return 'SOVEREIGN';
    if (studentCount > 200) return 'ADVANCE';
    return 'ESSENTIAL';
}

function getPlanBadge(plan: string): React.ReactNode {
    if (plan === 'SOVEREIGN') {
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">SOVEREIGN</Badge>;
    }
    if (plan === 'ADVANCE') {
        return <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px]">ADVANCE</Badge>;
    }
    return <Badge variant="outline" className="text-slate-400 text-[10px]">ESSENTIAL</Badge>;
}

export default async function SuperAdminPage() {
    const metrics = await getDashboardMetrics();

    const {
        totalTenants,
        activeTenants,
        totalStudents,
        totalAssessments,
        totalReports,
        inactiveSchools,
        tenants,
    } = metrics;

    const revenueMonthly = activeTenants * 1990;
    const activePercent = totalTenants > 0
        ? Math.round((activeTenants / totalTenants) * 100)
        : 0;

    const tenantsWithBadSubscription = tenants.filter(
        (t) => t.subscriptionStatus !== 'active'
    );

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
                        <p className="text-slate-500 mt-1">Visão estratégica de todas as organizações e métricas de uso.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/marketing">
                            <Button variant="outline" className="border-slate-200 shadow-sm font-black text-xs uppercase">
                                Landing Page
                            </Button>
                        </Link>
                        <CreateSchoolDialog />
                    </div>
                </div>

                {/* Estatísticas Globais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Escolas" value={totalTenants} icon={Building2} color="text-indigo-600" />
                    <StatCard title="Assinaturas Ativas" value={activeTenants} icon={CreditCard} color="text-emerald-500" />
                    <StatCard title="Alunos Monitorados" value={totalStudents.toLocaleString('pt-BR')} icon={Users} color="text-blue-500" />
                    <StatCard
                        title="Receita Estimada"
                        value={`R$ ${revenueMonthly.toLocaleString('pt-BR')}`}
                        icon={Clock}
                        color="text-amber-500"
                        description="(baseado em planos ativos)"
                    />
                </div>

                {/* Métricas de Uso (Operational) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-slate-200 shadow-sm bg-white p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <Badge variant="secondary" className="bg-purple-50 text-purple-700">Laudos Gerados</Badge>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalReports}</h3>
                            <p className="text-xs text-slate-400 font-medium">Documentos oficiais emitidos</p>
                        </div>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-white p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <Badge variant="secondary" className="bg-orange-50 text-orange-700">Triagens (SRSS)</Badge>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalAssessments}</h3>
                            <p className="text-xs text-slate-400 font-medium">Avaliações de risco aplicadas</p>
                        </div>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-white p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                <BrainCircuit size={20} />
                            </div>
                            <Badge variant="secondary" className="bg-cyan-50 text-cyan-700">Escolas Ativas</Badge>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{activePercent}%</h3>
                            <p className="text-xs text-slate-400 font-medium">{activeTenants} de {totalTenants} escolas ativas</p>
                        </div>
                    </Card>
                </div>

                {/* Alerts Section */}
                {(inactiveSchools.length > 0 || tenantsWithBadSubscription.length > 0) && (
                    <div className="space-y-4">
                        {inactiveSchools.length > 0 && (
                            <Card className="border-amber-200 bg-amber-50 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-black text-amber-800 uppercase tracking-wide">
                                                Escolas sem atividade nos últimos 30 dias
                                            </h4>
                                            <p className="text-xs text-amber-700">
                                                {inactiveSchools.length} escola(s) ativa(s) sem nenhuma triagem recente.
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {inactiveSchools.map((school) => (
                                                    <Link key={school.id} href={`/super-admin/escola/${school.id}`}>
                                                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 cursor-pointer text-xs">
                                                            {school.name}
                                                        </Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {tenantsWithBadSubscription.length > 0 && (
                            <Card className="border-red-200 bg-red-50 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                            <CreditCard size={20} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-black text-red-800 uppercase tracking-wide">
                                                Assinaturas com problema
                                            </h4>
                                            <p className="text-xs text-red-700">
                                                {tenantsWithBadSubscription.length} escola(s) com assinatura diferente de &quot;active&quot;.
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {tenantsWithBadSubscription.map((t) => (
                                                    <Link key={t.id} href={`/super-admin/escola/${t.id}`}>
                                                        <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200 cursor-pointer text-xs">
                                                            {t.name} ({t.subscriptionStatus})
                                                        </Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Lista de Escolas / Tenants */}
                <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100 py-6 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest px-1">Organizações & Uso</CardTitle>
                            <CardDescription className="px-1 text-xs mt-1">Monitore o consumo para identificar oportunidades de upgrade.</CardDescription>
                        </div>
                        <Button variant="ghost" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 h-8">
                            VER RELATÓRIO COMPLETO
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-4">Organização</th>
                                        <th className="px-6 py-4 text-center">Membros</th>
                                        <th className="px-6 py-4 text-center">Triagens</th>
                                        <th className="px-6 py-4 text-center">Alunos</th>
                                        <th className="px-6 py-4">Plano Sugerido</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {tenants.map((tenant) => {
                                        const suggestedPlan = getSuggestedPlan(
                                            tenant._count.students,
                                            tenant._count.assessments
                                        );

                                        return (
                                            <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                            <Building2 size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-800 text-sm leading-none mb-1">{tenant.name}</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn(
                                                                    "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                                                                    tenant.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                                                )}>
                                                                    {tenant.isActive ? 'Ativo' : 'Inativo'}
                                                                </span>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tenant.slug}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center font-black text-slate-600 text-sm">
                                                    {tenant._count.users}
                                                </td>
                                                <td className="px-6 py-5 text-center font-black text-slate-600 text-sm">
                                                    {tenant._count.assessments}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <Badge variant="outline" className="font-black border-slate-200">
                                                        {tenant._count.students}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {getPlanBadge(suggestedPlan)}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/super-admin/escola/${tenant.id}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 shadow-none">
                                                                <ExternalLink size={16} />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ size?: number }>;
    color: string;
    description?: string;
}

function StatCard({ title, value, icon: Icon, color, description }: StatCardProps) {
    return (
        <Card className="border-slate-200 shadow-sm bg-white p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center", color)}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
            {description && (
                <p className="text-[10px] text-slate-400 mt-1">{description}</p>
            )}
        </Card>
    );
}
