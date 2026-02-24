'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Webhook,
    Plus,
    Loader2,
    Send,
    Trash2,
    Copy,
    Check,
    KeyRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    createWebhook,
    toggleWebhookActive,
    deleteWebhook,
    testWebhook,
    getWebhooks,
} from '@/app/actions/webhook-management';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WebhookRow {
    id: string;
    tenantId: string;
    url: string;
    events: string[];
    secret: string;
    isActive: boolean;
    createdAt: string;
    tenant: { name: string };
}

interface WebhooksClientProps {
    initialWebhooks: WebhookRow[];
    tenants: { id: string; name: string }[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AVAILABLE_EVENTS = [
    { value: 'ASSESSMENT_COMPLETED', label: 'Avaliacao Concluida' },
    { value: 'STUDENT_CREATED', label: 'Aluno Criado' },
    { value: 'RISK_TIER_CHANGED', label: 'Nivel de Risco Alterado' },
    { value: 'INTERVENTION_CREATED', label: 'Intervencao Criada' },
    { value: 'TICKET_CREATED', label: 'Chamado Criado' },
] as const;

const EVENT_LABELS: Record<string, string> = {
    ASSESSMENT_COMPLETED: 'Avaliacao',
    STUDENT_CREATED: 'Aluno',
    RISK_TIER_CHANGED: 'Risco',
    INTERVENTION_CREATED: 'Intervencao',
    TICKET_CREATED: 'Chamado',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WebhooksClient({ initialWebhooks, tenants }: WebhooksClientProps) {
    const [webhooks, setWebhooks] = useState<WebhookRow[]>(initialWebhooks);
    const [isPending, startTransition] = useTransition();

    // Create dialog state
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newTenantId, setNewTenantId] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newEvents, setNewEvents] = useState<string[]>([]);

    // Secret display dialog state
    const [secretDialogOpen, setSecretDialogOpen] = useState(false);
    const [displayedSecret, setDisplayedSecret] = useState('');
    const [secretCopied, setSecretCopied] = useState(false);

    // Delete confirmation state
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Filter state
    const [filterTenant, setFilterTenant] = useState('all');

    // -------------------------------------------------------------------
    // Refresh webhooks from server
    // -------------------------------------------------------------------

    function refreshWebhooks() {
        startTransition(async () => {
            const filters = filterTenant !== 'all' ? { tenantId: filterTenant } : undefined;
            const data = await getWebhooks(filters);
            setWebhooks(
                data.map((wh) => ({
                    ...wh,
                    createdAt: new Date(wh.createdAt).toISOString(),
                }))
            );
        });
    }

    // -------------------------------------------------------------------
    // Filter change
    // -------------------------------------------------------------------

    function handleFilterChange(value: string) {
        setFilterTenant(value);
        startTransition(async () => {
            const filters = value !== 'all' ? { tenantId: value } : undefined;
            const data = await getWebhooks(filters);
            setWebhooks(
                data.map((wh) => ({
                    ...wh,
                    createdAt: new Date(wh.createdAt).toISOString(),
                }))
            );
        });
    }

    // -------------------------------------------------------------------
    // Create webhook
    // -------------------------------------------------------------------

    function handleCreate() {
        if (!newTenantId || !newUrl || newEvents.length === 0) {
            toast.error('Preencha escola, URL e pelo menos um evento.');
            return;
        }

        try {
            new URL(newUrl);
        } catch {
            toast.error('URL invalida. Informe uma URL completa (https://...).');
            return;
        }

        startTransition(async () => {
            const result = await createWebhook({
                tenantId: newTenantId,
                url: newUrl,
                events: newEvents,
            });

            if ('error' in result) {
                toast.error(result.error as string);
                return;
            }

            toast.success('Webhook criado com sucesso.');
            setCreateDialogOpen(false);
            resetCreateForm();

            // Show secret once
            setDisplayedSecret(result.secret);
            setSecretCopied(false);
            setSecretDialogOpen(true);

            refreshWebhooks();
        });
    }

    function resetCreateForm() {
        setNewTenantId('');
        setNewUrl('');
        setNewEvents([]);
    }

    function handleEventToggle(eventValue: string, checked: boolean) {
        if (checked) {
            setNewEvents((prev) => [...prev, eventValue]);
        } else {
            setNewEvents((prev) => prev.filter((e) => e !== eventValue));
        }
    }

    // -------------------------------------------------------------------
    // Toggle active
    // -------------------------------------------------------------------

    function handleToggle(webhookId: string) {
        startTransition(async () => {
            const result = await toggleWebhookActive(webhookId);
            if ('error' in result) {
                toast.error(result.error);
                return;
            }
            const label = result.isActive ? 'ativado' : 'desativado';
            toast.success(`Webhook ${label}.`);
            refreshWebhooks();
        });
    }

    // -------------------------------------------------------------------
    // Test webhook
    // -------------------------------------------------------------------

    function handleTest(webhookId: string) {
        startTransition(async () => {
            const result = await testWebhook(webhookId);
            if ('error' in result) {
                toast.error(result.error);
                return;
            }
            toast.success(`Teste enviado. Status: ${result.status}`);
        });
    }

    // -------------------------------------------------------------------
    // Delete webhook
    // -------------------------------------------------------------------

    function handleDelete() {
        if (!deleteId) return;

        startTransition(async () => {
            const result = await deleteWebhook(deleteId);
            if ('error' in result) {
                toast.error(result.error as string);
                return;
            }
            toast.success('Webhook excluido.');
            setDeleteId(null);
            refreshWebhooks();
        });
    }

    // -------------------------------------------------------------------
    // Copy secret
    // -------------------------------------------------------------------

    function handleCopySecret() {
        navigator.clipboard.writeText(displayedSecret);
        setSecretCopied(true);
        toast.success('Secret copiado para a area de transferencia.');
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
                            <Webhook size={14} />
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                            Integracoes
                        </span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Webhooks
                    </h1>
                </div>
                <Button
                    className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-black text-xs uppercase"
                    onClick={() => setCreateDialogOpen(true)}
                >
                    <Plus size={16} className="mr-2" />
                    Criar Webhook
                </Button>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center gap-3">
                <Select value={filterTenant} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[200px] h-9 text-xs">
                        <SelectValue placeholder="Escola" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Escolas</SelectItem>
                        {tenants.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                                {t.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {isPending && <Loader2 size={16} className="animate-spin text-indigo-500" />}
            </div>

            {/* Webhooks Table */}
            <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 py-6">
                    <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest px-1">
                        {webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-6 py-4">Escola</th>
                                    <th className="px-6 py-4">URL</th>
                                    <th className="px-6 py-4">Eventos</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Criado em</th>
                                    <th className="px-6 py-4 text-right">Acoes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {webhooks.map((wh) => (
                                    <tr
                                        key={wh.id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-5 text-sm font-bold text-slate-800">
                                            {wh.tenant.name}
                                        </td>
                                        <td className="px-6 py-5">
                                            <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600 max-w-[240px] truncate block">
                                                {wh.url}
                                            </code>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1">
                                                {wh.events.map((event) => (
                                                    <Badge
                                                        key={event}
                                                        className="text-[9px] font-black uppercase tracking-widest border-none shadow-none bg-indigo-50 text-indigo-600"
                                                    >
                                                        {EVENT_LABELS[event] || event}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge
                                                className={cn(
                                                    'text-[9px] font-black uppercase tracking-widest border-none shadow-none',
                                                    wh.isActive
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-500'
                                                )}
                                            >
                                                {wh.isActive ? 'Ativo' : 'Inativo'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                                            {new Date(wh.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Switch
                                                    checked={wh.isActive}
                                                    onCheckedChange={() => handleToggle(wh.id)}
                                                    disabled={isPending}
                                                    className="data-[state=checked]:bg-indigo-600"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                                    onClick={() => handleTest(wh.id)}
                                                    disabled={isPending || !wh.isActive}
                                                    title="Enviar teste"
                                                >
                                                    <Send size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-rose-600"
                                                    onClick={() => setDeleteId(wh.id)}
                                                    disabled={isPending}
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {webhooks.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200">
                                    <Webhook size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">
                                    Nenhum webhook configurado
                                </h3>
                                <p className="text-slate-400 max-w-md">
                                    Crie um webhook para receber notificacoes de eventos em tempo real.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Webhook Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar Webhook</DialogTitle>
                        <DialogDescription>
                            Configure um endpoint para receber notificacoes de eventos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label>Escola</Label>
                            <Select value={newTenantId} onValueChange={setNewTenantId}>
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
                            <Label>URL do Endpoint</Label>
                            <Input
                                type="url"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="https://example.com/webhook"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label>Eventos</Label>
                            <div className="space-y-2">
                                {AVAILABLE_EVENTS.map((event) => (
                                    <div key={event.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`event-${event.value}`}
                                            checked={newEvents.includes(event.value)}
                                            onCheckedChange={(checked) =>
                                                handleEventToggle(event.value, checked === true)
                                            }
                                        />
                                        <label
                                            htmlFor={`event-${event.value}`}
                                            className="text-sm text-slate-700 cursor-pointer"
                                        >
                                            {event.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700"
                                disabled={isPending}
                                onClick={handleCreate}
                            >
                                {isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
                                Criar Webhook
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Secret Display Dialog */}
            <Dialog open={secretDialogOpen} onOpenChange={setSecretDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <KeyRound size={18} className="text-indigo-600" />
                            Secret do Webhook
                        </DialogTitle>
                        <DialogDescription>
                            Copie e guarde este secret. Ele nao sera exibido novamente.
                            Use-o para verificar as assinaturas HMAC-SHA256 dos payloads.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2">
                            <code className="flex-1 bg-slate-100 px-3 py-2 rounded-lg font-mono text-xs text-slate-700 break-all select-all">
                                {displayedSecret}
                            </code>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0"
                                onClick={handleCopySecret}
                            >
                                {secretCopied ? (
                                    <Check size={14} className="text-emerald-600" />
                                ) : (
                                    <Copy size={14} />
                                )}
                            </Button>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => setSecretDialogOpen(false)}>
                                Entendido
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Webhook</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este webhook? Esta acao nao pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-rose-600 hover:bg-rose-700"
                            onClick={handleDelete}
                        >
                            {isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
