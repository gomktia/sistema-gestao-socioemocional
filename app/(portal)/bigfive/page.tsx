
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { BigFiveWizardLazy as BigFiveWizard } from '@/components/bigfive/BigFiveWizardLazy';
import { BigFiveRawAnswers } from '@/src/core/types';
import { Sparkles } from 'lucide-react';

export const metadata = {
    title: 'Questionário Big Five | Triavium',
};

export default async function BigFivePage() {
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

    const assessment = await prisma.assessment.findFirst({
        where: {
            tenantId: user.tenantId,
            studentId: user.studentId!,
            type: 'BIG_FIVE',
        },
        select: { rawAnswers: true, processedScores: true },
        orderBy: { appliedAt: 'desc' },
    });

    if (assessment?.processedScores) {
        redirect('/inicio');
    }

    const initialAnswers = (assessment?.rawAnswers as unknown as BigFiveRawAnswers) || {};

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center max-w-xl mx-auto space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-200">
                    <Sparkles size={28} strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mapeamento Big Five</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Descubra seus traços de personalidade nos 5 grandes domínios.
                </p>
            </div>

            <BigFiveWizard
                initialAnswers={initialAnswers}
                studentName={user.name}
                studentId={user.studentId}
            />
        </div>
    );
}
