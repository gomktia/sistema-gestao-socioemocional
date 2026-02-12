import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { fetchAllNotifications } from '@/app/actions/notifications';
import { Bell, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NotificationMarkAllButton } from './mark-all-button';

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

    const { notifications, total } = await fetchAllNotifications(1, 50);
    const unreadCount = notifications.filter((n: any) => !n.isRead).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notificações</h1>
                    <p className="text-slate-500 mt-1">
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
                                "border-slate-200 hover:border-indigo-200 transition-all cursor-pointer",
                                !n.isRead && "border-l-4 border-l-indigo-500"
                            )}>
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className={cn("p-2 rounded-lg shrink-0", config.bg)}>
                                        <Icon size={18} className={config.color} />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className={cn(
                                            "text-sm leading-tight",
                                            !n.isRead ? "font-bold text-slate-900" : "font-medium text-slate-600"
                                        )}>
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                            {new Date(n.createdAt).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                    {!n.isRead && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                                    )}
                                    <ChevronRight size={16} className="text-slate-300 shrink-0 mt-1" />
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}

                {notifications.length === 0 && (
                    <div className="py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
                        <Bell className="text-slate-200 mb-4" size={64} />
                        <h3 className="text-slate-400 font-black text-xl uppercase tracking-tighter">Nenhuma notificação</h3>
                        <p className="text-slate-400 text-sm max-w-xs mt-2">
                            Quando houver alertas de risco ou atualizações, elas aparecerão aqui.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
