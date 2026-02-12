import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    ExternalLink,
    FileText,
    Activity,
    BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const metadata = {
    title: 'Super Admin | EduInteligência SaaS',
};

function getSuggestedPlan(studentCount: number, reportCount: number, assessmentCount: number) {
    // Sovereign Logic: Very high volume or high intensity usage (many reports/assessments per student)
    if (studentCount > 1000 || reportCount > 500) return 'SOVEREIGN';

    // Advance Logic: Moderate volume or active usage of reports
    if (studentCount > 200 || reportCount > 50) return 'ADVANCE';

    // Essential Logic: Default entry level
    return 'ESSENTIAL';
}

export default async function SuperAdminPage() {
    await requireSuperAdmin();

    const tenants = await prisma.tenant.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    users: true,
                    students: true,
                    assessments: true,
                    interventionLogs: {
                        where: { type: 'INDIVIDUAL_PLAN' } // Count only reports/plans
                    }
                }
            },
        },
    });

    // 2. Metadados Globais
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter(t => t.subscriptionStatus === 'active').length;
    const totalStudents = tenants.reduce((acc, t) => acc + t._count.students, 0);
    const totalReports = tenants.reduce((acc, t) => acc + t._count.interventionLogs, 0);
    const totalAssessments = tenants.reduce((acc, t) => acc + t._count.assessments, 0);

    // Revenue placeholder logic
    const revenueMonthly = activeTenants * 1990; // Base Plan price

    // Sort tenants by usage (potential upgrades)
    const topConsumers = [...tenants].sort((a, b) => b._count.interventionLogs - a._count.interventionLogs).slice(0, 5);

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
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-black text-xs uppercase">
                            Cadastrar Nova Escola
                        </Button>
                    </div>
                </div>

                {/* Estatísticas Globais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Escolas" value={totalTenants} icon={Building2} color="text-indigo-600" />
                    <StatCard title="Assinaturas Ativas" value={activeTenants} icon={CreditCard} color="text-emerald-500" />
                    <StatCard title="Alunos Monitorados" value={totalStudents.toLocaleString('pt-BR')} icon={Users} color="text-blue-500" />
                    <StatCard title="MRR Estimado" value={`R$ ${revenueMonthly.toLocaleString('pt-BR')}`} icon={Clock} color="text-amber-500" />
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
                            <Badge variant="secondary" className="bg-cyan-50 text-cyan-700">Health Score</Badge>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">98.5%</h3>
                            <p className="text-xs text-slate-400 font-medium">Uptime e estabilidade do sistema</p>
                        </div>
                    </Card>
                </div>

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
                                        <th className="px-6 py-4 text-center">Laudos</th>
                                        <th className="px-6 py-4">Plano Sugerido</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {tenants.map((tenant) => {
                                        const suggestedPlan = getSuggestedPlan(
                                            tenant._count.students,
                                            tenant._count.interventionLogs,
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
                                                    {tenant._count.students}
                                                </td>
                                                <td className="px-6 py-5 text-center font-black text-slate-600 text-sm">
                                                    {tenant._count.assessments}
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <Badge variant="outline" className="font-black border-slate-200">
                                                        {tenant._count.interventionLogs}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {suggestedPlan === 'SOVEREIGN' ? (
                                                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">SOVEREIGN</Badge>
                                                    ) : suggestedPlan === 'ADVANCE' ? (
                                                        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px]">ADVANCE</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-slate-400 text-[10px]">ESSENTIAL</Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/super-admin/school-access/${tenant.slug}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 shadow-none">
                                                                <ExternalLink size={16} />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
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
