import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { SRSSGrid } from '@/components/teacher/SRSSGrid';

export const metadata = {
    title: 'Triagem Socioemocional | SRSS-IE',
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lançar Triagem</h1>
                    <p className="text-slate-500 mt-1">Instrumento SRSS-IE para identificação de riscos externos e internos.</p>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800">
                <div className="flex-shrink-0">💡</div>
                <p className="text-xs leading-relaxed">
                    <strong>Dica:</strong> Clique nos quadrados numéricos para alterar os valores.
                    O cálculo do Tier (Rastro) é feito em tempo real assim que os 12 itens de um aluno são preenchidos.
                </p>
            </div>

            <SRSSGrid students={students} existingData={existingData} />
        </div>
    );
}
