
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { IEAAWizardLazy as IEAAWizard } from '@/components/ieaa/IEAAWizardLazy';
import { IEAARawAnswers } from '@/src/core/types';
import { BookOpen } from 'lucide-react';

export const metadata = {
    title: 'IEAA - Estratégias de Aprendizagem | Triavium',
};

export default async function IEAAPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== UserRole.STUDENT) {
        redirect('/');
    }

    if (!user.studentId) {
        return (
            <div className="p-8 text-center bg-rose-50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-rose-600 font-bold">Erro: Sua conta de aluno não está vinculada a um registro de matrícula.</p>
                <p className="text-slate-500 text-sm mt-2">Por favor, contate o administrador do sistema.</p>
            </div>
        );
    }

    // Check if IEAA is enabled for student's classroom
    const student = await prisma.student.findUnique({
        where: { id: user.studentId },
        select: {
            classroom: {
                select: { id: true, name: true }
            }
        }
    });

    const assessment = await prisma.assessment.findFirst({
        where: {
            tenantId: user.tenantId,
            studentId: user.studentId!,
            type: 'IEAA',
        },
        select: { rawAnswers: true, processedScores: true },
        orderBy: { appliedAt: 'desc' },
    });

    if (assessment?.processedScores) {
        redirect('/inicio');
    }

    const initialAnswers = (assessment?.rawAnswers as unknown as IEAARawAnswers) || {};

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center max-w-xl mx-auto space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-200">
                    <BookOpen size={28} strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Estratégias de Aprendizagem</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Descubra seu perfil de autorregulação e estratégias de estudo.
                </p>
            </div>

            <IEAAWizard
                initialAnswers={initialAnswers}
                studentName={user.name}
                studentId={user.studentId}
            />
        </div>
    );
}
