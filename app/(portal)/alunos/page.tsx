import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { createClient } from '@/lib/supabase/server';
import { TierBadge } from '@/components/domain/TierBadge';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { UserSearch, ChevronRight, Filter } from 'lucide-react';

export const metadata = {
    title: 'Gestão de Alunos',
};

export default async function AlunosPage() {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const supabase = await createClient();

    const { data: students } = await supabase
        .from('students')
        .select('id, name, grade')
        .eq('tenantId', user.tenantId)
        .eq('isActive', true)
        .order('name');

    const { data: assessments } = await supabase
        .from('assessments')
        .select('studentId, overallTier')
        .eq('tenantId', user.tenantId)
        .eq('type', 'SRSS_IE')
        .eq('academicYear', new Date().getFullYear());

    const tierMap = new Map((assessments || []).map(a => [a.studentId, a.overallTier]));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Alunos</h1>
                    <p className="text-slate-500 mt-1">Monitore o risco socioemocional e planeje intervenções.</p>
                </div>
            </div>

            <div className="grid gap-3">
                {students?.map((student) => {
                    const tier = tierMap.get(student.id);
                    return (
                        <Link key={student.id} href={`/alunos/${student.id}`}>
                            <Card className="hover:border-indigo-300 hover:shadow-md transition-all group">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <UserSearch size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{student.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.grade}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {tier ? (
                                            <TierBadge tier={tier} />
                                        ) : (
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Pendente</span>
                                        )}
                                        <ChevronRight className="text-slate-300 group-hover:text-indigo-400 transition-colors" size={20} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
