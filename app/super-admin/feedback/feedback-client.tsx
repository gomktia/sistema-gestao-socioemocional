'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    MessageSquareHeart,
    ChevronDown,
    ChevronUp,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { updateFeedbackStatus } from '@/app/actions/feedback';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FeedbackStatus = 'PENDING' | 'REVIEWING' | 'PLANNED' | 'IMPLEMENTED' | 'REJECTED';

interface Feedback {
    id: string;
    subject: string;
    description: string;
    status: FeedbackStatus;
    createdAt: Date;
    user: { name: string; email: string };
    tenant: { name: string };
}

interface FeedbackClientProps {
    initialFeedbacks: Feedback[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<FeedbackStatus, { label: string; classes: string }> = {
    PENDING: { label: 'Pendente', classes: 'bg-amber-100 text-amber-700' },
    REVIEWING: { label: 'Analisando', classes: 'bg-blue-100 text-blue-700' },
    PLANNED: { label: 'Planejado', classes: 'bg-violet-100 text-violet-700' },
    IMPLEMENTED: { label: 'Implementado', classes: 'bg-emerald-100 text-emerald-700' },
    REJECTED: { label: 'Rejeitado', classes: 'bg-rose-100 text-rose-700' },
};

const ALL_STATUSES: FeedbackStatus[] = ['PENDING', 'REVIEWING', 'PLANNED', 'IMPLEMENTED', 'REJECTED'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FeedbackClient({ initialFeedbacks }: FeedbackClientProps) {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function getStatusCount(status: FeedbackStatus): number {
        return feedbacks.filter((f) => f.status === status).length;
    }

    function handleToggleExpand(id: string) {
        setExpandedId((prev) => (prev === id ? null : id));
    }

    function handleStatusChange(feedbackId: string, newStatus: FeedbackStatus) {
        setUpdatingId(feedbackId);

        startTransition(async () => {
            const result = await updateFeedbackStatus(feedbackId, newStatus);

            if (result.success) {
                setFeedbacks((prev) =>
                    prev.map((f) =>
                        f.id === feedbackId ? { ...f, status: newStatus } : f
                    )
                );
                toast.success(`Status atualizado para "${STATUS_CONFIG[newStatus].label}".`);
            } else {
                toast.error('Erro ao atualizar status.');
            }

            setUpdatingId(null);
        });
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                        <MessageSquareHeart size={14} />
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                        Voz do Educador
                    </span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Feedback dos Educadores
                </h1>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {ALL_STATUSES.map((status) => {
                    const config = STATUS_CONFIG[status];
                    return (
                        <Card key={status} className="border-slate-200 shadow-sm bg-white p-4">
                            <div className="flex items-center justify-between mb-2">
                                <Badge
                                    className={cn(
                                        'text-[9px] font-black uppercase tracking-widest border-none shadow-none',
                                        config.classes
                                    )}
                                >
                                    {config.label}
                                </Badge>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                {getStatusCount(status)}
                            </h3>
                        </Card>
                    );
                })}
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
                {feedbacks.map((feedback) => {
                    const isExpanded = expandedId === feedback.id;
                    const isUpdating = updatingId === feedback.id;
                    const config = STATUS_CONFIG[feedback.status];

                    return (
                        <Card
                            key={feedback.id}
                            className="border-slate-200 shadow-sm bg-white overflow-hidden"
                        >
                            <CardContent className="p-0">
                                {/* Main Row */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
                                    <div
                                        className="flex-1 cursor-pointer min-w-0"
                                        onClick={() => handleToggleExpand(feedback.id)}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-slate-800 text-sm truncate">
                                                {feedback.subject}
                                            </h3>
                                            {isExpanded ? (
                                                <ChevronUp size={14} className="text-slate-400 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {feedback.user.name} &middot; {feedback.tenant.name} &middot;{' '}
                                            {new Date(feedback.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <Badge
                                            className={cn(
                                                'text-[9px] font-black uppercase tracking-widest border-none shadow-none',
                                                config.classes
                                            )}
                                        >
                                            {config.label}
                                        </Badge>

                                        <div className="relative">
                                            {isUpdating && (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin text-indigo-500 absolute -left-6 top-1/2 -translate-y-1/2"
                                                />
                                            )}
                                            <Select
                                                value={feedback.status}
                                                onValueChange={(v) =>
                                                    handleStatusChange(feedback.id, v as FeedbackStatus)
                                                }
                                                disabled={isUpdating}
                                            >
                                                <SelectTrigger className="w-[160px] h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ALL_STATUSES.map((s) => (
                                                        <SelectItem key={s} value={s}>
                                                            {STATUS_CONFIG[s].label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Description */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-0 border-t border-slate-100">
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap pt-4">
                                            {feedback.description}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-3">
                                            Enviado por {feedback.user.email}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}

                {feedbacks.length === 0 && (
                    <Card className="border-slate-200 shadow-sm p-12 text-center">
                        <CardContent className="flex flex-col items-center justify-center space-y-4">
                            <div className="h-16 w-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200">
                                <MessageSquareHeart size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">
                                Nenhum feedback recebido
                            </h3>
                            <p className="text-slate-400 max-w-md">
                                Quando os educadores enviarem sugestoes, elas aparecerao aqui.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
