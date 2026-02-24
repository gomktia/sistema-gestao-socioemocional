'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BadgeDollarSign,
    TrendingUp,
    Clock,
    AlertTriangle,
    Plus,
    FileText,
    CheckCircle2,
    XCircle,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    getInvoices,
    createInvoice,
    updateInvoiceStatus,
    assignPlan,
} from '@/app/actions/super-admin';
import type { InvoiceStatus } from '@prisma/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Tenant {
    id: string;
    name: string;
}

interface InvoiceRow {
    id: string;
    tenantId: string;
    planId: string | null;
    amount: number;
    dueDate: Date;
    paidDate: Date | null;
    status: InvoiceStatus;
    description: string | null;
    createdAt: Date;
    tenant: { id: string; name: string };
    plan: { id: string; planName: string } | null;
}

interface InvoicesData {
    invoices: InvoiceRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface DashboardData {
    mrr: number;
    activePlansCount: number;
    pendingInvoices: number;
    overdueInvoices: number;
    paidThisMonth: number;
    plans: Array<{
        id: string;
        tenantId: string;
        planName: string;
        monthlyPrice: number;
        studentLimit: number | null;
        startDate: Date;
        endDate: Date | null;
        isActive: boolean;
        createdAt: Date;
        tenant: { id: string; name: string };
    }>;
}

interface Filters {
    tenantId: string;
    status: string;
    page: number;
}

interface FinanceiroClientProps {
    dashboard: DashboardData;
    initialInvoices: InvoicesData;
    tenants: Tenant[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_BADGE_CLASSES: Record<InvoiceStatus, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    PAID: 'bg-emerald-100 text-emerald-700',
    OVERDUE: 'bg-rose-100 text-rose-700',
    CANCELLED: 'bg-slate-100 text-slate-500',
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    OVERDUE: 'Vencida',
    CANCELLED: 'Cancelada',
};

const PLAN_OPTIONS = ['ESSENTIAL', 'ADVANCE', 'SOVEREIGN', 'CUSTOM'] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FinanceiroClient({ dashboard, initialInvoices, tenants }: FinanceiroClientProps) {
    const [invoicesData, setInvoicesData] = useState<InvoicesData>(initialInvoices);
    const [filters, setFilters] = useState<Filters>({
        tenantId: '',
        status: '',
        page: 1,
    });
    const [isPending, startTransition] = useTransition();

    // Dialog state
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [planDialogOpen, setPlanDialogOpen] = useState(false);

    // New Invoice form
    const [newInvoiceTenantId, setNewInvoiceTenantId] = useState('');
    const [newInvoiceAmount, setNewInvoiceAmount] = useState('');
    const [newInvoiceDueDate, setNewInvoiceDueDate] = useState('');
    const [newInvoiceDescription, setNewInvoiceDescription] = useState('');

    // Assign Plan form
    const [planTenantId, setPlanTenantId] = useState('');
    const [planName, setPlanName] = useState('');
    const [planPrice, setPlanPrice] = useState('');
    const [planStudentLimit, setPlanStudentLimit] = useState('');
    const [planStartDate, setPlanStartDate] = useState('');

    // -------------------------------------------------------------------
    // Fetch invoices
    // -------------------------------------------------------------------

    function fetchInvoices(overrides?: Partial<Filters>) {
        const merged = { ...filters, ...overrides };

        startTransition(async () => {
            const result = await getInvoices({
                tenantId: merged.tenantId || undefined,
                status: merged.status || undefined,
                page: merged.page,
                pageSize: 50,
            });
            setInvoicesData(result);
        });
    }

    function handleFilterChange(key: keyof Filters, value: string) {
        const updated = { ...filters, [key]: value, page: 1 };
        setFilters(updated);
        fetchInvoices({ [key]: value, page: 1 });
    }

    function handlePageChange(newPage: number) {
        setFilters((prev) => ({ ...prev, page: newPage }));
        fetchInvoices({ page: newPage });
    }

    // -------------------------------------------------------------------
    // Actions
    // -------------------------------------------------------------------

    function handleCreateInvoice() {
        if (!newInvoiceTenantId || !newInvoiceAmount || !newInvoiceDueDate) {
            toast.error('Preencha escola, valor e vencimento.');
            return;
        }

        const amount = parseFloat(newInvoiceAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Valor invalido.');
            return;
        }

        startTransition(async () => {
            const result = await createInvoice({
                tenantId: newInvoiceTenantId,
                amount,
                dueDate: newInvoiceDueDate,
                description: newInvoiceDescription || undefined,
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success('Fatura criada com sucesso.');
            setInvoiceDialogOpen(false);
            resetInvoiceForm();
            fetchInvoices();
        });
    }

    function resetInvoiceForm() {
        setNewInvoiceTenantId('');
        setNewInvoiceAmount('');
        setNewInvoiceDueDate('');
        setNewInvoiceDescription('');
    }

    function handleStatusChange(invoiceId: string, status: InvoiceStatus) {
        startTransition(async () => {
            const result = await updateInvoiceStatus(invoiceId, status);
            if (result.error) {
                toast.error(result.error);
                return;
            }
            toast.success(`Status atualizado para ${STATUS_LABELS[status]}.`);
            fetchInvoices();
        });
    }

    function handleAssignPlan() {
        if (!planTenantId || !planName || !planPrice || !planStartDate) {
            toast.error('Preencha todos os campos obrigatorios.');
            return;
        }

        const price = parseFloat(planPrice);
        if (isNaN(price) || price <= 0) {
            toast.error('Preco invalido.');
            return;
        }

        const studentLimit = planStudentLimit ? parseInt(planStudentLimit, 10) : undefined;

        startTransition(async () => {
            const result = await assignPlan({
                tenantId: planTenantId,
                planName,
                monthlyPrice: price,
                studentLimit,
                startDate: planStartDate,
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success('Plano atribuido com sucesso.');
            setPlanDialogOpen(false);
            resetPlanForm();
        });
    }

    function resetPlanForm() {
        setPlanTenantId('');
        setPlanName('');
        setPlanPrice('');
        setPlanStudentLimit('');
        setPlanStartDate('');
    }

    // -------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                            <BadgeDollarSign size={14} />
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                            Gestao Financeira
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Financeiro
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-black text-xs uppercase"
                        onClick={() => setInvoiceDialogOpen(true)}
                    >
                        <Plus size={16} className="mr-2" />
                        Nova Fatura
                    </Button>
                    <Button
                        variant="outline"
                        className="font-black text-xs uppercase"
                        onClick={() => setPlanDialogOpen(true)}
                    >
                        <FileText size={16} className="mr-2" />
                        Atribuir Plano
                    </Button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    MRR
                                </p>
                                <p className="text-2xl font-black text-slate-900 mt-1">
                                    {formatCurrency(dashboard.mrr)}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {dashboard.activePlansCount} plano{dashboard.activePlansCount !== 1 ? 's' : ''} ativo{dashboard.activePlansCount !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <TrendingUp size={20} className="text-indigo-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Receita do Mes
                                </p>
                                <p className="text-2xl font-black text-slate-900 mt-1">
                                    {formatCurrency(dashboard.paidThisMonth)}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <BadgeDollarSign size={20} className="text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn(
                    'border-slate-200 shadow-xl shadow-slate-200/50',
                    dashboard.pendingInvoices > 0 && 'border-amber-200'
                )}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Faturas Pendentes
                                </p>
                                <p className={cn(
                                    'text-2xl font-black mt-1',
                                    dashboard.pendingInvoices > 0 ? 'text-amber-600' : 'text-slate-900'
                                )}>
                                    {dashboard.pendingInvoices}
                                </p>
                            </div>
                            <div className={cn(
                                'h-10 w-10 rounded-lg flex items-center justify-center',
                                dashboard.pendingInvoices > 0 ? 'bg-amber-50' : 'bg-slate-50'
                            )}>
                                <Clock size={20} className={dashboard.pendingInvoices > 0 ? 'text-amber-600' : 'text-slate-400'} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={cn(
                    'border-slate-200 shadow-xl shadow-slate-200/50',
                    dashboard.overdueInvoices > 0 && 'border-rose-200'
                )}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Faturas Vencidas
                                </p>
                                <p className={cn(
                                    'text-2xl font-black mt-1',
                                    dashboard.overdueInvoices > 0 ? 'text-rose-600' : 'text-slate-900'
                                )}>
                                    {dashboard.overdueInvoices}
                                </p>
                            </div>
                            <div className={cn(
                                'h-10 w-10 rounded-lg flex items-center justify-center',
                                dashboard.overdueInvoices > 0 ? 'bg-rose-50' : 'bg-slate-50'
                            )}>
                                <AlertTriangle size={20} className={dashboard.overdueInvoices > 0 ? 'text-rose-600' : 'text-slate-400'} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select
                    value={filters.tenantId}
                    onValueChange={(v) => handleFilterChange('tenantId', v === '__all__' ? '' : v)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Todas as Escolas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">Todas as Escolas</SelectItem>
                        {tenants.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                                {t.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.status}
                    onValueChange={(v) => handleFilterChange('status', v === '__all__' ? '' : v)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Todos os Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">Todos os Status</SelectItem>
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="PAID">Pago</SelectItem>
                        <SelectItem value="OVERDUE">Vencida</SelectItem>
                        <SelectItem value="CANCELLED">Cancelada</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Invoice Table */}
            <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest px-1">
                        {invoicesData.total} fatura{invoicesData.total !== 1 ? 's' : ''}
                    </CardTitle>
                    {isPending && <Loader2 size={16} className="animate-spin text-indigo-500" />}
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-6 py-4">Escola</th>
                                    <th className="px-6 py-4">Descricao</th>
                                    <th className="px-6 py-4">Valor</th>
                                    <th className="px-6 py-4">Vencimento</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Pago em</th>
                                    <th className="px-6 py-4 text-right">Acoes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {invoicesData.invoices.map((invoice) => (
                                    <tr
                                        key={invoice.id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                                            {invoice.tenant.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                            {invoice.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                            {formatCurrency(invoice.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                                            {formatDate(invoice.dueDate)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={cn(
                                                    'text-[9px] font-black uppercase tracking-widest border-none shadow-none',
                                                    STATUS_BADGE_CLASSES[invoice.status]
                                                )}
                                            >
                                                {STATUS_LABELS[invoice.status]}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                                            {invoice.paidDate ? formatDate(invoice.paidDate) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                                                        onClick={() => handleStatusChange(invoice.id, 'PAID')}
                                                        title="Marcar como Pago"
                                                        disabled={isPending}
                                                    >
                                                        <CheckCircle2 size={15} />
                                                    </Button>
                                                )}
                                                {invoice.status !== 'CANCELLED' && invoice.status !== 'PAID' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-rose-600"
                                                        onClick={() => handleStatusChange(invoice.id, 'CANCELLED')}
                                                        title="Cancelar Fatura"
                                                        disabled={isPending}
                                                    >
                                                        <XCircle size={15} />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {invoicesData.invoices.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-12 text-center text-sm text-slate-400"
                                        >
                                            Nenhuma fatura encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {invoicesData.totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-400">
                                Pagina {invoicesData.page} de {invoicesData.totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={invoicesData.page <= 1}
                                    onClick={() => handlePageChange(invoicesData.page - 1)}
                                    className="h-8"
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={invoicesData.page >= invoicesData.totalPages}
                                    onClick={() => handlePageChange(invoicesData.page + 1)}
                                    className="h-8"
                                >
                                    Proximo
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Nova Fatura Dialog */}
            <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nova Fatura</DialogTitle>
                        <DialogDescription>
                            Crie uma nova fatura para uma escola.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label>Escola</Label>
                            <Select value={newInvoiceTenantId} onValueChange={setNewInvoiceTenantId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecionar escola" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tenants.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Valor (R$)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={newInvoiceAmount}
                                onChange={(e) => setNewInvoiceAmount(e.target.value)}
                                placeholder="0,00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vencimento</Label>
                            <Input
                                type="date"
                                value={newInvoiceDueDate}
                                onChange={(e) => setNewInvoiceDueDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Descricao</Label>
                            <Textarea
                                value={newInvoiceDescription}
                                onChange={(e) => setNewInvoiceDescription(e.target.value)}
                                placeholder="Descricao da fatura (opcional)"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setInvoiceDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700"
                                disabled={isPending}
                                onClick={handleCreateInvoice}
                            >
                                {isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
                                Criar Fatura
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Atribuir Plano Dialog */}
            <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Atribuir Plano</DialogTitle>
                        <DialogDescription>
                            Atribua um plano de assinatura a uma escola.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label>Escola</Label>
                            <Select value={planTenantId} onValueChange={setPlanTenantId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecionar escola" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tenants.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Plano</Label>
                            <Select value={planName} onValueChange={setPlanName}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecionar plano" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PLAN_OPTIONS.map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Preco Mensal (R$)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={planPrice}
                                onChange={(e) => setPlanPrice(e.target.value)}
                                placeholder="0,00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Limite de Alunos</Label>
                            <Input
                                type="number"
                                min="0"
                                value={planStudentLimit}
                                onChange={(e) => setPlanStudentLimit(e.target.value)}
                                placeholder="Sem limite (opcional)"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Data de Inicio</Label>
                            <Input
                                type="date"
                                value={planStartDate}
                                onChange={(e) => setPlanStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700"
                                disabled={isPending}
                                onClick={handleAssignPlan}
                            >
                                {isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
                                Atribuir Plano
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
