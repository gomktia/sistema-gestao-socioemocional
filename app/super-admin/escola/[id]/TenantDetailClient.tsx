'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Building2,
    Users,
    GraduationCap,
    BookOpen,
    ClipboardList,
    FileText,
    LogIn,
    Save,
    Loader2,
    Power,
    Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    updateTenantDetails,
    toggleTenantActive,
    impersonateTenant,
    getUsers,
} from '@/app/actions/super-admin';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ORG_TYPES = [
    { value: 'EDUCATIONAL', label: 'Escola' },
    { value: 'MILITARY', label: 'Militar' },
    { value: 'CORPORATE', label: 'Corporativo' },
    { value: 'SPORTS', label: 'Esportivo' },
] as const;

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Admin',
    MANAGER: 'Gestor',
    PSYCHOLOGIST: 'Psicólogo',
    COUNSELOR: 'Orientador',
    TEACHER: 'Professor',
    STUDENT: 'Aluno',
    RESPONSIBLE: 'Responsável',
};

const ROLE_COLORS: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700',
    MANAGER: 'bg-indigo-100 text-indigo-700',
    PSYCHOLOGIST: 'bg-purple-100 text-purple-700',
    COUNSELOR: 'bg-cyan-100 text-cyan-700',
    TEACHER: 'bg-blue-100 text-blue-700',
    STUDENT: 'bg-emerald-100 text-emerald-700',
    RESPONSIBLE: 'bg-amber-100 text-amber-700',
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TenantData {
    id: string;
    name: string;
    slug: string;
    customDomain: string | null;
    cnpj: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    phone: string | null;
    email: string | null;
    logoUrl: string | null;
    organizationType: string;
    isActive: boolean;
    subscriptionStatus: string;
    createdAt: string;
    updatedAt: string;
    _count: {
        users: number;
        students: number;
        assessments: number;
        classrooms: number;
        interventionLogs: number;
    };
}

interface TenantUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    tenant: { name: string } | null;
}

interface TenantDetailClientProps {
    tenant: TenantData;
    usersByRole: Record<string, number>;
    riskDistribution: Record<string, number>;
    lastActivity: string | null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TenantDetailClient({
    tenant: initialTenant,
    usersByRole,
    riskDistribution,
    lastActivity,
}: TenantDetailClientProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [tenant, setTenant] = useState(initialTenant);

    // Users tab state
    const [users, setUsers] = useState<TenantUser[]>([]);
    const [usersLoaded, setUsersLoaded] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Config form state
    const [form, setForm] = useState({
        name: tenant.name,
        email: tenant.email ?? '',
        phone: tenant.phone ?? '',
        cnpj: tenant.cnpj ?? '',
        address: tenant.address ?? '',
        city: tenant.city ?? '',
        state: tenant.state ?? '',
        organizationType: tenant.organizationType,
        subscriptionStatus: tenant.subscriptionStatus,
    });

    // Risk distribution totals for bar widths
    const tier1 = riskDistribution['TIER_1'] ?? 0;
    const tier2 = riskDistribution['TIER_2'] ?? 0;
    const tier3 = riskDistribution['TIER_3'] ?? 0;
    const riskTotal = tier1 + tier2 + tier3;

    function loadUsers(): void {
        if (usersLoaded || loadingUsers) return;
        setLoadingUsers(true);
        getUsers({ tenantId: tenant.id, pageSize: 100 })
            .then((result) => {
                setUsers(
                    result.users.map((u) => ({
                        ...u,
                        createdAt:
                            typeof u.createdAt === 'string'
                                ? u.createdAt
                                : new Date(u.createdAt).toISOString(),
                    }))
                );
                setUsersLoaded(true);
            })
            .catch(() => {
                toast.error('Erro ao carregar usuários.');
            })
            .finally(() => {
                setLoadingUsers(false);
            });
    }

    function handleImpersonate(): void {
        startTransition(async () => {
            const result = await impersonateTenant(tenant.id);
            if ('error' in result) {
                toast.error(result.error);
                return;
            }
            router.push('/inicio');
            router.refresh();
        });
    }

    function handleSave(): void {
        startTransition(async () => {
            const result = await updateTenantDetails(tenant.id, {
                name: form.name,
                email: form.email || undefined,
                phone: form.phone || undefined,
                cnpj: form.cnpj || undefined,
                address: form.address || undefined,
                city: form.city || undefined,
                state: form.state || undefined,
                organizationType: form.organizationType as
                    | 'EDUCATIONAL'
                    | 'MILITARY'
                    | 'CORPORATE'
                    | 'SPORTS',
                subscriptionStatus: form.subscriptionStatus,
            });

            if ('error' in result) {
                toast.error(result.error);
                return;
            }

            toast.success('Configurações salvas com sucesso.');
            router.refresh();
        });
    }

    function handleToggleActive(): void {
        startTransition(async () => {
            const result = await toggleTenantActive(tenant.id);
            if ('error' in result) {
                toast.error(result.error);
                return;
            }
            setTenant((prev) => ({
                ...prev,
                isActive: result.isActive ?? !prev.isActive,
            }));
            toast.success(
                result.isActive ? 'Escola ativada.' : 'Escola desativada.'
            );
            router.refresh();
        });
    }

    function handleTabChange(value: string): void {
        if (value === 'usuarios') {
            loadUsers();
        }
    }

    // -----------------------------------------------------------------------
    // Render helpers
    // -----------------------------------------------------------------------

    function renderRiskBar(
        label: string,
        count: number,
        colorClass: string
    ): React.ReactNode {
        const pct = riskTotal > 0 ? (count / riskTotal) * 100 : 0;
        return (
            <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 w-16">
                    {label}
                </span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={cn('h-full rounded-full', colorClass)}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <span className="text-xs font-black text-slate-600 w-8 text-right">
                    {count}
                </span>
            </div>
        );
    }

    // -----------------------------------------------------------------------
    // Main render
    // -----------------------------------------------------------------------

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/super-admin/escolas">
                        <Button
                            variant="ghost"
                            className="pl-0 text-slate-500 hover:text-slate-900"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                {tenant.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {tenant.slug}
                                </span>
                                <Badge
                                    className={cn(
                                        'text-[9px] font-black uppercase tracking-widest border-none shadow-none',
                                        tenant.isActive
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-slate-100 text-slate-500'
                                    )}
                                >
                                    {tenant.isActive ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleImpersonate}
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-black text-xs uppercase"
                >
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <LogIn className="mr-2 h-4 w-4" />
                    )}
                    Entrar como Gestor
                </Button>
            </div>

            {/* Tabs */}
            <Tabs
                defaultValue="visao-geral"
                onValueChange={handleTabChange}
                className="space-y-6"
            >
                <TabsList className="bg-slate-100 rounded-xl p-1">
                    <TabsTrigger
                        value="visao-geral"
                        className="rounded-lg font-bold text-xs uppercase tracking-wide data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Visão Geral
                    </TabsTrigger>
                    <TabsTrigger
                        value="usuarios"
                        className="rounded-lg font-bold text-xs uppercase tracking-wide data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Usuários
                    </TabsTrigger>
                    <TabsTrigger
                        value="configuracoes"
                        className="rounded-lg font-bold text-xs uppercase tracking-wide data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Configurações
                    </TabsTrigger>
                </TabsList>

                {/* ============================================================
                    Tab 1: Visão Geral
                   ============================================================ */}
                <TabsContent value="visao-geral" className="space-y-6">
                    {/* Metric cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <MetricCard
                            icon={GraduationCap}
                            label="Alunos"
                            value={tenant._count.students}
                            color="text-blue-600 bg-blue-50"
                        />
                        <MetricCard
                            icon={Users}
                            label="Usuários"
                            value={tenant._count.users}
                            color="text-indigo-600 bg-indigo-50"
                        />
                        <MetricCard
                            icon={BookOpen}
                            label="Turmas"
                            value={tenant._count.classrooms}
                            color="text-violet-600 bg-violet-50"
                        />
                        <MetricCard
                            icon={ClipboardList}
                            label="Triagens"
                            value={tenant._count.assessments}
                            color="text-orange-600 bg-orange-50"
                        />
                        <MetricCard
                            icon={FileText}
                            label="Laudos"
                            value={tenant._count.interventionLogs}
                            color="text-purple-600 bg-purple-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Users by role */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Usuários por Função
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(usersByRole).map(
                                        ([role, count]) => (
                                            <Badge
                                                key={role}
                                                className={cn(
                                                    'text-[10px] font-bold border-none shadow-none',
                                                    ROLE_COLORS[role] ??
                                                        'bg-slate-100 text-slate-600'
                                                )}
                                            >
                                                {ROLE_LABELS[role] ?? role}{' '}
                                                ({count})
                                            </Badge>
                                        )
                                    )}
                                    {Object.keys(usersByRole).length === 0 && (
                                        <p className="text-xs text-slate-400">
                                            Nenhum usuário cadastrado.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Risk distribution */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Distribuição de Risco
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {renderRiskBar(
                                    'Tier 1',
                                    tier1,
                                    'bg-emerald-500'
                                )}
                                {renderRiskBar(
                                    'Tier 2',
                                    tier2,
                                    'bg-amber-500'
                                )}
                                {renderRiskBar(
                                    'Tier 3',
                                    tier3,
                                    'bg-red-500'
                                )}
                                {riskTotal === 0 && (
                                    <p className="text-xs text-slate-400">
                                        Nenhuma triagem realizada.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Last activity */}
                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Última Atividade
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                                        <Calendar size={20} />
                                    </div>
                                    {lastActivity ? (
                                        <div>
                                            <p className="text-sm font-black text-slate-800">
                                                {new Date(
                                                    lastActivity
                                                ).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                                                Última triagem
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400">
                                            Nenhuma atividade registrada.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* ============================================================
                    Tab 2: Usuários
                   ============================================================ */}
                <TabsContent value="usuarios">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-100 py-5">
                            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Usuários desta Escola
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loadingUsers && (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                                </div>
                            )}

                            {usersLoaded && users.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-sm text-slate-400">
                                        Nenhum usuário encontrado.
                                    </p>
                                </div>
                            )}

                            {usersLoaded && users.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50/50">
                                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                                <th className="px-6 py-4">
                                                    Nome
                                                </th>
                                                <th className="px-6 py-4">
                                                    Email
                                                </th>
                                                <th className="px-6 py-4">
                                                    Função
                                                </th>
                                                <th className="px-6 py-4">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4">
                                                    Criado em
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {users.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-slate-50/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge
                                                            className={cn(
                                                                'text-[9px] font-black uppercase tracking-widest border-none shadow-none',
                                                                ROLE_COLORS[
                                                                    user.role
                                                                ] ??
                                                                    'bg-slate-100 text-slate-600'
                                                            )}
                                                        >
                                                            {ROLE_LABELS[
                                                                user.role
                                                            ] ?? user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge
                                                            className={cn(
                                                                'text-[9px] font-black uppercase tracking-widest border-none shadow-none',
                                                                user.isActive
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-slate-100 text-slate-500'
                                                            )}
                                                        >
                                                            {user.isActive
                                                                ? 'Ativo'
                                                                : 'Inativo'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-500">
                                                        {new Date(
                                                            user.createdAt
                                                        ).toLocaleDateString(
                                                            'pt-BR'
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ============================================================
                    Tab 3: Configurações
                   ============================================================ */}
                <TabsContent value="configuracoes" className="space-y-6">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 py-5">
                            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Dados da Escola
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FieldGroup label="Nome *">
                                    <Input
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="h-11 rounded-xl"
                                    />
                                </FieldGroup>

                                <FieldGroup label="Email">
                                    <Input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        className="h-11 rounded-xl"
                                    />
                                </FieldGroup>

                                <FieldGroup label="Telefone">
                                    <Input
                                        value={form.phone}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        placeholder="(11) 99999-9999"
                                        className="h-11 rounded-xl"
                                    />
                                </FieldGroup>

                                <FieldGroup label="CNPJ">
                                    <Input
                                        value={form.cnpj}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                cnpj: e.target.value,
                                            }))
                                        }
                                        placeholder="00.000.000/0000-00"
                                        className="h-11 rounded-xl"
                                    />
                                </FieldGroup>

                                <FieldGroup label="Endereço" span2>
                                    <Input
                                        value={form.address}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                address: e.target.value,
                                            }))
                                        }
                                        className="h-11 rounded-xl"
                                    />
                                </FieldGroup>

                                <FieldGroup label="Cidade">
                                    <Input
                                        value={form.city}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                city: e.target.value,
                                            }))
                                        }
                                        className="h-11 rounded-xl"
                                    />
                                </FieldGroup>

                                <FieldGroup label="Estado">
                                    <Input
                                        value={form.state}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                state: e.target.value
                                                    .toUpperCase()
                                                    .slice(0, 2),
                                            }))
                                        }
                                        placeholder="SP"
                                        maxLength={2}
                                        className="h-11 rounded-xl"
                                    />
                                </FieldGroup>
                            </div>

                            {/* Organization type selector */}
                            <div className="mt-6 space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Tipo de Organização
                                </Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {ORG_TYPES.map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    organizationType: t.value,
                                                }))
                                            }
                                            className={cn(
                                                'p-3 rounded-xl border-2 text-sm font-bold transition-all',
                                                form.organizationType ===
                                                    t.value
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-100 text-slate-600 hover:border-slate-200'
                                            )}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subscription status */}
                            <div className="mt-6 space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Status da Assinatura
                                </Label>
                                <Select
                                    value={form.subscriptionStatus}
                                    onValueChange={(value) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            subscriptionStatus: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="h-11 rounded-xl w-64">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="past_due">
                                            Past Due
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={isPending || !form.name.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-black text-xs uppercase"
                        >
                            {isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Salvar Configurações
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleToggleActive}
                            disabled={isPending}
                            className={cn(
                                'font-black text-xs uppercase',
                                tenant.isActive
                                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            )}
                        >
                            <Power className="mr-2 h-4 w-4" />
                            {tenant.isActive
                                ? 'Desativar Escola'
                                : 'Ativar Escola'}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MetricCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    value: number;
    color: string;
}) {
    return (
        <Card className="border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
                <div
                    className={cn(
                        'h-9 w-9 rounded-xl flex items-center justify-center',
                        color
                    )}
                >
                    <Icon size={18} />
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                {label}
            </p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {value.toLocaleString('pt-BR')}
            </h3>
        </Card>
    );
}

function FieldGroup({
    label,
    children,
    span2 = false,
}: {
    label: string;
    children: React.ReactNode;
    span2?: boolean;
}) {
    return (
        <div className={cn('space-y-2', span2 && 'md:col-span-2')}>
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {label}
            </Label>
            {children}
        </div>
    );
}
