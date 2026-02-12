import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { createClient } from '@/lib/supabase/server';
import { EWSQuickLaunch } from '@/components/management/EWSQuickLaunch';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Lançamento Rápido EWS | Gestão',
};

export default async function EWSPage() {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.MANAGER, UserRole.ADMIN, UserRole.COUNSELOR];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const supabase = await createClient();

    // Buscar lista de alunos
    const { data: students } = await supabase
        .from('students')
        .select('id, name, grade')
        .eq('tenantId', user.tenantId)
        .eq('isActive', true)
        .order('name');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/turma">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lançamento EWS</h1>
                        <p className="text-slate-500 mt-1">Insira os indicadores escolares para monitoramento de risco.</p>
                    </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-start gap-3 max-w-sm">
                    <Info className="text-indigo-500 shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] text-indigo-700 font-medium leading-relaxed">
                        Indicadores de faltas e notas são cruzados com os dados do SRSS-IE para gerar o Alerta de Risco Escolar Automatizado.
                    </p>
                </div>
            </div>

            <EWSQuickLaunch students={students || []} />
        </div>
    );
}
