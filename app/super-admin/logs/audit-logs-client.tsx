'use client';

import { useCallback, useRef, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ScrollText,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAuditLogs } from '@/app/actions/super-admin';
import type { JsonValue } from '@prisma/client/runtime/library';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Tenant {
    id: string;
    name: string;
}

interface AuditLog {
    id: string;
    action: string;
    targetId: string | null;
    details: JsonValue;
    timestamp: Date;
    user: { name: string; email: string };
    tenant: { name: string };
}

interface LogsData {
    logs: AuditLog[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface Filters {
    tenantId: string;
    action: string;
    startDate: string;
    endDate: string;
    page: number;
}

interface AuditLogsClientProps {
    initialData: LogsData;
    tenants: Tenant[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getActionBadgeClasses(action: string): string {
    if (action.includes('ACTIVATE') || action.includes('CREATE')) {
        return 'bg-emerald-100 text-emerald-700';
    }
    if (action.includes('UPDATE') || action.includes('CHANGE')) {
        return 'bg-blue-100 text-blue-700';
    }
    if (action.includes('DEACTIVATE') || action.includes('DELETE') || action.includes('RESET')) {
        return 'bg-rose-100 text-rose-700';
    }
    return 'bg-slate-100 text-slate-600';
}

function formatDetails(details: JsonValue): string {
    if (!details) return '-';

    const text = typeof details === 'string'
        ? details
        : JSON.stringify(details);

    if (text.length > 80) {
        return text.slice(0, 80) + '...';
    }
    return text;
}

function formatTimestamp(timestamp: Date): string {
    return new Date(timestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AuditLogsClient({ initialData, tenants }: AuditLogsClientProps) {
    const [data, setData] = useState<LogsData>(initialData);
    const [filters, setFilters] = useState<Filters>({
        tenantId: '',
        action: '',
        startDate: '',
        endDate: '',
        page: 1,
    });
    const [isPending, startTransition] = useTransition();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchLogs = useCallback(
        function fetchLogs(overrides?: Partial<Filters>) {
            const merged = { ...filters, ...overrides };

            startTransition(async () => {
                const result = await getAuditLogs({
                    tenantId: merged.tenantId || undefined,
                    action: merged.action || undefined,
                    startDate: merged.startDate || undefined,
                    endDate: merged.endDate || undefined,
                    page: merged.page,
                    pageSize: 50,
                });
                setData(result);
            });
        },
        [filters]
    );

    function handleFilterChange(key: keyof Filters, value: string) {
        const updated = { ...filters, [key]: value, page: 1 };
        setFilters(updated);
        fetchLogs({ [key]: value, page: 1 });
    }

    function handleActionChange(value: string) {
        setFilters((prev) => ({ ...prev, action: value, page: 1 }));

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchLogs({ action: value, page: 1 });
        }, 400);
    }

    function handlePageChange(newPage: number) {
        setFilters((prev) => ({ ...prev, page: newPage }));
        fetchLogs({ page: newPage });
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                        <ScrollText size={14} />
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                        Monitoramento
                    </span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Logs de Auditoria
                </h1>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

                <Input
                    placeholder="Filtrar por acao (ex: UPDATE, CREATE)..."
                    value={filters.action}
                    onChange={(e) => handleActionChange(e.target.value)}
                />

                <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />

                <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
            </div>

            {/* Table */}
            <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-black text-slate-500 uppercase tracking-widest px-1">
                        {data.total} registro{data.total !== 1 ? 's' : ''}
                    </CardTitle>
                    {isPending && <Loader2 size={16} className="animate-spin text-indigo-500" />}
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-6 py-4">Data/Hora</th>
                                    <th className="px-6 py-4">Usuario</th>
                                    <th className="px-6 py-4">Escola</th>
                                    <th className="px-6 py-4">Acao</th>
                                    <th className="px-6 py-4">Detalhes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                                            {formatTimestamp(log.timestamp)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-800 text-sm">
                                                {log.user.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {log.tenant.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={cn(
                                                    'text-[9px] font-black uppercase tracking-widest border-none shadow-none',
                                                    getActionBadgeClasses(log.action)
                                                )}
                                            >
                                                {log.action}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-mono max-w-xs truncate">
                                            {formatDetails(log.details)}
                                        </td>
                                    </tr>
                                ))}

                                {data.logs.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-12 text-center text-sm text-slate-400"
                                        >
                                            Nenhum log encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {data.totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-400">
                                Pagina {data.page} de {data.totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={data.page <= 1}
                                    onClick={() => handlePageChange(data.page - 1)}
                                    className="h-8"
                                >
                                    <ChevronLeft size={14} className="mr-1" />
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={data.page >= data.totalPages}
                                    onClick={() => handlePageChange(data.page + 1)}
                                    className="h-8"
                                >
                                    Proximo
                                    <ChevronRight size={14} className="ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
