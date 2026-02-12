'use client';

import { useState, useEffect } from 'react';
import { Bell, ChevronRight, Circle } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        fetchNotifications();

        // Inscrição em tempo real para novas notificações
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                (payload) => {
                    setNotifications((prev) => [payload.new, ...prev]);
                    setUnreadCount((count) => count + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .order('createdAt', { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        }
    };

    const markAsRead = async (id: string) => {
        await supabase.from('notifications').update({ isRead: true }).eq('id', id);
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
                    <Bell className="h-5 w-5 text-slate-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-rose-500 border-2 border-white rounded-full" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0" align="end">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-800">Notificações</h3>
                    {unreadCount > 0 && (
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                            {unreadCount} novas
                        </span>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                            {notifications.map((n) => (
                                <Link
                                    key={n.id}
                                    href={n.link || '#'}
                                    onClick={() => markAsRead(n.id)}
                                    className={cn(
                                        "flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors group",
                                        !n.isRead && "bg-indigo-50/10"
                                    )}
                                >
                                    <div className={cn(
                                        "h-2 w-2 rounded-full mt-2 shrink-0",
                                        !n.isRead ? "bg-indigo-500" : "bg-transparent"
                                    )} />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {n.title}
                                        </p>
                                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                            {n.message}
                                        </p>
                                        <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">
                                            {new Date(n.createdAt).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 mt-1" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            <Bell className="mx-auto mb-2 opacity-10" size={32} />
                            <p className="text-xs font-medium">Nenhuma notificação por enquanto.</p>
                        </div>
                    )}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                    <Button variant="ghost" className="text-[10px] font-bold text-slate-500 uppercase h-8 hover:bg-white w-full">
                        Ver todas as notificações
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
