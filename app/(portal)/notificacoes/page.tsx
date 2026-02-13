import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { fetchAllNotifications } from '@/app/actions/notifications';
import { Bell, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NotificationMarkAllButton } from './mark-all-button';
import { getLabels } from '@/src/lib/utils/labels';

export const metadata = {
    title: 'Notificações',
};

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
    CRITICAL_RISK: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    INTERVENTION_DUE: { icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
    NEW_ASSESSMENT: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
};

function getNotificationLink(n: any): string {
    if (n.link) return n.link;
    if (n.studentId) return `/alunos/${n.studentId}`;
    return '#';
}

export default async function NotificacoesPage() {
    const user = await getCurrentUser();
    if (!user || user.role === UserRole.STUDENT) {
        redirect('/');
    }

    const labels = getLabels(user.organizationType);
    const { notifications, total } = await fetchAllNotifications(1, 50);
    const unreadCount = notifications.filter((n: any) => !n.isRead).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notificações</h1>
                    <p className="text-slate-500 mt-1.5 text-sm">
                        {total} notificações no total
                        {unreadCount > 0 && ` (${unreadCount} não lidas)`}
                    </p>
                </div>

                {unreadCount > 0 && <NotificationMarkAllButton />}
            </div>

            <div className="space-y-3">
                {notifications.map((n: any) => {
                    const config = TYPE_CONFIG[n.type] || { icon: Bell, color: 'text-slate-600', bg: 'bg-slate-50' };
                    const Icon = config.icon;

                    return (
                        <Link key={n.id} href={getNotificationLink(n)}>
                            <Card className={cn(
                                "border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer",
                                !n.isRead && "border-l-4 border-l-indigo-500"
                            )}>
                                <CardContent className="p-5 flex items-start gap-4">
                                    <div className={cn("p-2.5 rounded-2xl shrink-0", config.bg)}>
                                        <Icon size={18} className={config.color} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className={cn(
                                            "text-sm leading-tight",
                                            !n.isRead ? "font-extrabold text-slate-900" : "font-medium text-slate-600"
                                        )}>
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                                            {new Date(n.createdAt).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                    {!n.isRead && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0 mt-1.5 shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
                                    )}
                                    <ChevronRight size={16} className="text-slate-300 shrink-0 mt-1" strokeWidth={1.5} />
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}

                {notifications.length === 0 && (
                    <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <Bell className="text-slate-200 mb-4" size={64} strokeWidth={1.5} />
                        <h3 className="text-slate-400 font-black text-xl uppercase tracking-tight">Nenhuma notificação</h3>
                        <p className="text-slate-400 text-sm max-w-xs mt-2">
                            Quando houver alertas de risco ou atualizações de {labels.subjects.toLowerCase()}, elas aparecerão aqui.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
