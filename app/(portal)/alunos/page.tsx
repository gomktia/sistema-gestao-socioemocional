import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { TierBadge } from '@/components/domain/TierBadge';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserSearch, ChevronRight } from 'lucide-react';
import { getLabels } from '@/src/lib/utils/labels';

export const metadata = {
    title: 'Gestão de Membros',
};

export default async function AlunosPage() {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const labels = getLabels(user.organizationType);

    const students = await prisma.student.findMany({
        where: { tenantId: user.tenantId, isActive: true },
        select: { id: true, name: true, grade: true },
        orderBy: { name: 'asc' },
    });

    const assessments = await prisma.assessment.findMany({
        where: {
            tenantId: user.tenantId,
            type: 'SRSS_IE',
            academicYear: new Date().getFullYear(),
        },
        select: { studentId: true, overallTier: true },
    });

    const tierMap = new Map(assessments.map(a => [a.studentId, a.overallTier]));

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de {labels.subjects}</h1>
                    <p className="text-slate-500 mt-1.5 text-sm">Monitore o risco socioemocional e planeje intervenções.</p>
                </div>
            </div>

            {students.length > 0 ? (
                <div className="grid gap-3">
                    {students.map((student) => {
                        const tier = assessments.find(a => a.studentId === student.id)?.overallTier;
                        const displayGrade =
                            student.grade === 'ANO_1_EM' ? (labels.organization === 'Escola' ? '1ª Série EM' : 'Nível 1') :
                                student.grade === 'ANO_2_EM' ? (labels.organization === 'Escola' ? '2ª Série EM' : 'Nível 2') :
                                    (labels.organization === 'Escola' ? '3ª Série EM' : 'Nível 3');

                        return (
                            <Link key={student.id} href={`/alunos/${student.id}`}>
                                <Card className="group overflow-hidden border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-2xl hover:ring-1 hover:ring-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                                    <CardContent className="p-0 sm:p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 transition-colors duration-300 flex items-center justify-center text-indigo-400 group-hover:text-white shadow-inner">
                                                <UserSearch size={22} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h4 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors tracking-tight">{student.name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-0.5 rounded-full">{displayGrade}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            {tier ? (
                                                <TierBadge tier={tier} />
                                            ) : (
                                                <span className="hidden sm:inline-flex text-[10px] font-extrabold text-slate-300 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-full">Avaliação Pendente</span>
                                            )}
                                            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300">
                                                <ChevronRight size={18} strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <UserSearch size={32} className="text-slate-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Nenhum {labels.subject} Encontrado</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-8 text-sm">
                        Parece que ainda não há {labels.subjects.toLowerCase()} cadastrados nesta unidade.
                    </p>
                    <Link href="/turma">
                        <Button variant="outline" className="border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 rounded-2xl active:scale-95 transition-all">
                            Gerenciar Importações
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
