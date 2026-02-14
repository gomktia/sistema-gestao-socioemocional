'use client';

import { useState, useTransition } from 'react';
import { ChevronDown, School, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { switchTenant } from '@/app/actions/tenant-selector';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    role: string;
}

interface TenantSwitcherProps {
    tenants: Tenant[];
    activeTenantId: string;
    isCollapsed?: boolean;
}

export function TenantSwitcher({ tenants, activeTenantId, isCollapsed }: TenantSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

    const handleSwitch = (id: string) => {
        if (id === activeTenantId) return;
        setIsOpen(false);
        startTransition(async () => {
            try {
                await switchTenant(id);
            } catch (error: any) {
                if (error.message === 'NEXT_REDIRECT') return;
                console.error('Failed to switch tenant', error);
            }
        });
    };

    if (tenants.length <= 1) {
        if (isCollapsed) return null;
        return (
            <div className="px-3 mb-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400">
                    <School size={14} className="shrink-0" />
                    <span className="text-[11px] font-bold truncate tracking-tight">{activeTenant?.name}</span>
                </div>
            </div>
        );
    }

    if (isCollapsed) {
        return (
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-10 w-10 flex items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/30 transition-all relative group"
                >
                    <RefreshCw size={18} className={cn(isPending && "animate-spin")} />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50">
                        Trocar Unidade
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className="px-3 mb-6 relative z-30">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                    "bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 group",
                    isOpen && "bg-white/[0.08] border-indigo-500/30 ring-4 ring-indigo-500/10"
                )}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <School size={18} strokeWidth={1.5} />
                    </div>
                    <div className="text-left min-w-0">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em] leading-none mb-1">Unidade Ativa</p>
                        <p className="text-xs font-bold text-white truncate leading-none">{activeTenant?.name}</p>
                    </div>
                </div>
                <ChevronDown size={16} className={cn("text-slate-500 transition-transform duration-300 shrink-0", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-3 right-3 mt-2 py-2 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden">
                    <p className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">Suas Unidades</p>
                    {tenants.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => handleSwitch(t.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all hover:bg-white/5 group",
                                t.id === activeTenantId ? "text-indigo-400" : "text-slate-300"
                            )}
                        >
                            <div className="flex items-center gap-3 truncate">
                                <School size={16} className={cn("shrink-0", t.id === activeTenantId ? "text-indigo-400" : "text-slate-500")} />
                                <div className="truncate">
                                    <p className="truncate leading-none mb-1">{t.name}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">{t.role}</p>
                                </div>
                            </div>
                            {t.id === activeTenantId && <Check size={16} className="shrink-0" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
