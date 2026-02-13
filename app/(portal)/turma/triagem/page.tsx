import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { SRSSGrid } from '@/components/teacher/SRSSGrid';
import { getLabels } from '@/src/lib/utils/labels';
import { ClipboardCheck, Lightbulb } from 'lucide-react';

export const metadata = {
    title: 'Lançar Triagem | Inteligência Socioemocional',
};

export default async function TriagemPage() {
    const user = await getCurrentUser();

    const allowedRoles = [UserRole.TEACHER, UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];
    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const students = await prisma.student.findMany({
        where: { tenantId: user.tenantId, isActive: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });

    const assessments = await prisma.assessment.findMany({
        where: {
            tenantId: user.tenantId,
            type: 'SRSS_IE',
            academicYear: new Date().getFullYear(),
        },
        select: { studentId: true, rawAnswers: true, overallTier: true },
    });

    const existingData: Record<string, any> = {};
    assessments.forEach(a => {
        existingData[a.studentId] = {
            answers: a.rawAnswers,
            tier: a.overallTier
        };
    });

    const labels = getLabels(user.organizationType);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                        <ClipboardCheck size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lançar Triagem</h1>
                        <p className="text-slate-500 mt-0.5 text-sm">Identificação preventiva de riscos comportamentais e socioemocionais.</p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-50/30 rounded-3xl p-6 flex items-start gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Lightbulb size={20} className="text-amber-600" strokeWidth={1.5} />
                </div>
                <div>
                    <h4 className="font-extrabold text-amber-900 text-sm tracking-tight">Como funciona</h4>
                    <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                        Clique nas células para atribuir valores (0-3) a cada item do instrumento SRSS.
                        O cálculo do Risco (Tier) é atualizado automaticamente assim que o instrumento é concluído para cada {labels?.subject?.toLowerCase() ?? 'aluno'}.
                    </p>
                </div>
            </div>

            <SRSSGrid students={students} existingData={existingData} labels={labels} />
        </div>
    );
}
