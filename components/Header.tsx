import { NotificationBell } from './NotificationBell';
import { UserRole } from '@/src/core/types';
import { getLabels } from '@/src/lib/utils/labels';

interface HeaderProps {
    userName: string;
    userRole: string;
    organizationType?: string;
}

export function Header({ userName, userRole, organizationType }: HeaderProps) {
    const labels = getLabels(organizationType);
    const roleLabels: Record<string, string> = {
        STUDENT: labels.subject,
        TEACHER: labels.actor,
        PSYCHOLOGIST: 'Psicólogo',
        COUNSELOR: 'Orientador',
        MANAGER: 'Gestor',
        ADMIN: 'Admin',
    };

    return (
        <header className="h-16 border-b border-slate-100 bg-white/70 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 lg:hidden">
                {/* Espaço para o gatilho do sidebar mobile se necessário */}
            </div>

            <div className="hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bem-vindo(a)</p>
                <p className="text-sm font-extrabold text-slate-800 tracking-tight">{userName}</p>
            </div>

            <div className="flex items-center gap-3">
                {(userRole === 'MANAGER' || userRole === 'PSYCHOLOGIST' || userRole === 'ADMIN') && (
                    <NotificationBell />
                )}

                <div className="h-8 w-[1px] bg-slate-100 mx-1 hidden sm:block" />

                <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-4 py-2 flex items-center gap-2.5 shadow-[0_1px_3px_rgb(0,0,0,0.02)]">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                    <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-tight">
                        {roleLabels[userRole] || userRole}
                    </span>
                </div>
            </div>
        </header>
    );
}
