import { NotificationBell } from './NotificationBell';
import { UserRole } from '@/src/core/types';

interface HeaderProps {
    userName: string;
    userRole: string;
}

export function Header({ userName, userRole }: HeaderProps) {
    const roleLabels: Record<string, string> = {
        STUDENT: 'Aluno',
        TEACHER: 'Professor',
        PSYCHOLOGIST: 'Psicólogo',
        COUNSELOR: 'Orientador',
        MANAGER: 'Gestor',
        ADMIN: 'Admin',
    };

    return (
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 lg:hidden">
                {/* Espaço para o gatilho do sidebar mobile se necessário */}
            </div>

            <div className="hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bem-vindo(a)</p>
                <p className="text-sm font-bold text-slate-700">{userName}</p>
            </div>

            <div className="flex items-center gap-2">
                {(userRole === 'MANAGER' || userRole === 'PSYCHOLOGIST' || userRole === 'ADMIN') && (
                    <NotificationBell />
                )}

                <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block" />

                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                        {roleLabels[userRole] || userRole}
                    </span>
                </div>
            </div>
        </header>
    );
}
