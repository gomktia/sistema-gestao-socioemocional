'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from './sidebar-nav';
import { TenantSwitcher } from './TenantSwitcher';
import {
    LogOut,
    Menu,
    X,
    Home,
    ClipboardList,
    Trophy,
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Layers,
    HeartPulse,
    School,
    CreditCard,
    LifeBuoy,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    GraduationCap,
    ShieldAlert,
    ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getLabels } from '@/src/lib/utils/labels';

const ICON_MAP: Record<string, any> = {
    Home,
    ClipboardList,
    Trophy,
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Layers,
    HeartPulse,
    School,
    CreditCard,
    LifeBuoy,
    GraduationCap,
    ShieldAlert
};

interface SidebarProps {
    items: NavItem[];
    userName: string;
    userEmail?: string;
    userRole: string;
    organizationType?: string;
    tenants?: any[];
    activeTenantId?: string;
}

export function Sidebar({ items, userName, userEmail, userRole, organizationType, tenants = [], activeTenantId = '' }: SidebarProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const labels = getLabels(organizationType);
    const roleLabels: Record<string, string> = {
        STUDENT: labels.subject,
        TEACHER: labels.actor,
        PSYCHOLOGIST: 'Psicólogo',
        COUNSELOR: 'Orientador',
        MANAGER: 'Gestor',
        ADMIN: 'Administrador',
    };

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const SidebarHeader = () => (
        <div className={cn("p-6 pb-2 flex items-center justify-between transition-all duration-300 relative z-20", isCollapsed && "p-4 justify-center")}>
            <div className={cn("flex items-center gap-3.5 transition-opacity duration-300 overflow-hidden", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                    <span className="text-white font-black text-lg">GS</span>
                </div>
                <div>
                    <h2 className="text-lg font-black text-white whitespace-nowrap tracking-tight">EduInteligência</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SaaS Edition</p>
                </div>
            </div>

            {isCollapsed && (
                <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg cursor-pointer" onClick={toggleCollapse}>
                    <span className="text-white font-black text-lg">GS</span>
                </div>
            )}
        </div>
    );

    const toggleGroup = (label: string) => {
        setExpandedGroups(prev =>
            prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
        );
    };

    const NavList = () => (
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {items.map((item) => {
                const Icon = ICON_MAP[item.iconName] || Home;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedGroups.includes(item.label);
                const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/super-admin' && pathname.startsWith(item.href));

                if (hasChildren) {
                    return (
                        <div key={item.label} className="space-y-1">
                            <button
                                onClick={() => toggleGroup(item.label)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
                                    isActive ? "bg-white/5 text-white" : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={20} strokeWidth={1.5} className={cn("shrink-0", isActive ? "text-indigo-400" : "group-hover:text-indigo-300")} />
                                    {!isCollapsed && <span className="font-semibold text-[13px]">{item.label}</span>}
                                </div>
                                {!isCollapsed && (
                                    <ChevronDown size={14} className={cn("transition-transform duration-300", isExpanded && "rotate-180")} />
                                )}
                            </button>

                            {isExpanded && !isCollapsed && (
                                <div className="pl-11 space-y-1 animate-in slide-in-from-top-2 duration-300">
                                    {item.children?.map(child => {
                                        const ChildIcon = ICON_MAP[child.iconName] || Home;
                                        const isChildActive = pathname === child.href;
                                        return (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                                                    isChildActive ? "text-white bg-white/5" : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                                                )}
                                            >
                                                <ChildIcon size={14} strokeWidth={1.5} />
                                                {child.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                            isActive
                                ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl ring-1 ring-white/[0.05]"
                                : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200",
                            isCollapsed && "justify-center px-2 py-3"
                        )}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <Icon
                            size={20}
                            strokeWidth={1.5}
                            className={cn(
                                "shrink-0 transition-all duration-300 group-hover:scale-110",
                                isActive ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" : "group-hover:text-indigo-300"
                            )}
                        />

                        {!isCollapsed && (
                            <span className="font-semibold text-[13px] truncate animate-in fade-in slide-in-from-left-2 duration-300">
                                {item.label}
                            </span>
                        )}

                        {isActive && !isCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-indigo-400 rounded-r-full shadow-[0_0_12px_#818cf8]" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    const UserProfile = () => (
        <div className="p-4 bg-black/20 backdrop-blur-xl border-t border-white/5 relative z-20">
            <div className={cn("flex items-center gap-3 w-full p-2.5 rounded-2xl transition-all hover:bg-white/5 cursor-pointer group", isCollapsed && "justify-center p-0 hover:bg-transparent")}>
                <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg border-2 border-[#0f172a] group-hover:border-indigo-500/50 transition-colors">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#0f172a] shadow-[0_0_8px_#10b981]"></div>
                </div>

                {!isCollapsed && (
                    <div className="flex-1 min-w-0 overflow-hidden text-left animate-in fade-in slide-in-from-left-2 duration-300">
                        <p className="text-sm font-bold text-white truncate leading-tight group-hover:text-indigo-200 transition-colors">{userName}</p>
                        <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mt-0.5">{roleLabels[userRole] || userRole}</p>
                    </div>
                )}
            </div>

            <form action="/signout" method="POST" className="mt-2">
                <button
                    type="submit"
                    className={cn(
                        "w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all active:scale-95",
                        isCollapsed && "justify-center"
                    )}
                    title="Sair"
                >
                    <LogOut size={16} strokeWidth={1.5} />
                    {!isCollapsed && <span>Sair do Sistema</span>}
                </button>
            </form>
        </div>
    );

    const CollapseToggle = () => (
        <button
            onClick={toggleCollapse}
            className="hidden lg:flex absolute -right-4 top-10 z-50 h-8 w-8 items-center justify-center rounded-full bg-[#1e293b] border-2 border-[#0f172a] text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-90"
        >
            {isCollapsed ? <ChevronRight size={16} strokeWidth={1.5} /> : <ChevronLeft size={16} strokeWidth={1.5} />}
        </button>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl w-full">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-white font-black text-sm">GS</span>
                    </div>
                    <span className="text-white font-extrabold text-sm tracking-tight">EduInteligência</span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-slate-300 hover:bg-white/10 rounded-xl active:scale-95 transition-all"
                >
                    {isMobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-40 bg-[#0f172a] transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col shadow-2xl h-full border-r border-white/[0.04]",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:static lg:inset-auto",
                isCollapsed ? "w-[76px]" : "w-72"
            )}>
                <CollapseToggle />
                <SidebarHeader />
                <TenantSwitcher
                    tenants={tenants}
                    activeTenantId={activeTenantId}
                    isCollapsed={isCollapsed}
                />
                <NavList />
                <UserProfile />

                {/* Background Decoration */}
                <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-indigo-950/30 to-transparent pointer-events-none" />
            </div>

            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-[#000000]/70 backdrop-blur-sm lg:hidden transition-opacity duration-500"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
