'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from './sidebar-nav';
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
    UserCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
    LifeBuoy
};

interface SidebarProps {
    items: NavItem[];
    userName: string;
    userEmail?: string;
    userRole: string;
}

export function Sidebar({ items, userName, userEmail, userRole }: SidebarProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Fechar menu mobile ao navegar
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const roleLabels: Record<string, string> = {
        STUDENT: 'Aluno',
        TEACHER: 'Professor',
        PSYCHOLOGIST: 'Psicólogo',
        COUNSELOR: 'Orientador',
        MANAGER: 'Gestor',
        ADMIN: 'Administrador',
    };

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const SidebarHeader = () => (
        <div className={cn("p-6 border-b border-slate-800 flex items-center justify-between transition-all duration-300", isCollapsed && "p-4 justify-center")}>
            <div className={cn("flex items-center gap-3 transition-opacity duration-300 overflow-hidden", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/50">
                    <span className="text-white font-black text-sm">GS</span>
                </div>
                <h2 className="text-lg font-bold text-white whitespace-nowrap">EduInteligência</h2>
            </div>

            {/* Logo Collapsed */}
            {isCollapsed && (
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/50">
                    <span className="text-white font-black text-sm">GS</span>
                </div>
            )}
        </div>
    );

    const NavList = () => (
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {items.map((item) => {
                const Icon = ICON_MAP[item.iconName] || Home;
                // Fix active state for partial matches but avoid root mismatch
                const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/super-admin' && pathname.startsWith(item.href));
                const isExactActive = pathname === item.href;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                            (isActive || isExactActive)
                                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100",
                            isCollapsed && "justify-center px-2"
                        )}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <Icon size={20} className={cn("shrink-0", (isActive || isExactActive) && "text-indigo-400")} />

                        {!isCollapsed && (
                            <span className="font-medium text-sm truncate animate-in fade-in slide-in-from-left-2 duration-300">
                                {item.label}
                            </span>
                        )}

                        {/* Active Indicator Line (Left) */}
                        {(isActive || isExactActive) && !isCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );

    const UserProfile = () => (
        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
            <div className={cn("flex items-center gap-3 w-full p-2 rounded-lg bg-slate-800/50 border border-slate-700/50", isCollapsed && "justify-center p-0 border-none bg-transparent")}>
                <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0 border-2 border-slate-900">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                </div>

                {!isCollapsed && (
                    <div className="flex-1 min-w-0 overflow-hidden text-left animate-in fade-in slide-in-from-left-2 duration-300">
                        <p className="text-sm font-semibold text-white truncate leading-tight">{userName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{userEmail || 'email@oculto.com'}</p>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-wider mt-0.5">{roleLabels[userRole] || userRole}</p>
                    </div>
                )}
            </div>

            {/* Logout Button */}
            <form action="/auth/signout" method="POST" className="mt-2">
                <button
                    type="submit"
                    className={cn(
                        "w-full flex items-center gap-2 px-2 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors",
                        isCollapsed && "justify-center"
                    )}
                    title="Sair"
                >
                    <LogOut size={16} />
                    {!isCollapsed && <span>Sair do Sistema</span>}
                </button>
            </form>
        </div>
    );

    // Desktop Collapse Button
    const CollapseToggle = () => (
        <button
            onClick={toggleCollapse}
            className="hidden lg:flex absolute -right-3 top-9 z-50 h-6 w-6 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all shadow-xl"
        >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shadow-xl w-full">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-sm">GS</span>
                    </div>
                    <h2 className="font-bold text-white text-sm">EduInteligência</h2>
                </div>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-40 bg-slate-900 border-r border-slate-800 transform transition-all duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none h-full",
                isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:static lg:inset-auto",
                isCollapsed ? "w-20" : "w-72"
            )}>
                <CollapseToggle />
                <SidebarHeader />
                <NavList />
                <UserProfile />
            </div>

            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
