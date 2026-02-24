'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { exitImpersonation } from '@/app/actions/super-admin';

interface ImpersonationBannerProps {
    tenantName: string;
}

export function ImpersonationBanner({ tenantName }: ImpersonationBannerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleExit() {
        startTransition(async () => {
            const result = await exitImpersonation();
            if (result.success) {
                router.push(result.redirectTo);
                router.refresh();
            }
        });
    }

    return (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
                <ShieldAlert size={18} className="shrink-0" />
                <span className="text-sm font-bold">
                    Visualizando: <strong className="font-black">{tenantName}</strong>
                </span>
            </div>
            <button
                onClick={handleExit}
                disabled={isPending}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
                {isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <ArrowLeft size={14} />
                )}
                Voltar ao Painel Global
            </button>
        </div>
    );
}
