import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard';
import { VIARawAnswers } from '@/src/core/types';

export const metadata = {
    title: 'Questionário Socioemocional | VIA',
};

export default async function QuestionarioPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== UserRole.STUDENT) {
        redirect('/');
    }

    const assessment = await prisma.assessment.findFirst({
        where: {
            tenantId: user.tenantId,
            studentId: user.studentId!,
            type: 'VIA_STRENGTHS',
        },
        select: { rawAnswers: true, processedScores: true },
        orderBy: { appliedAt: 'desc' },
    });

    if (assessment?.processedScores) {
        redirect('/minhas-forcas');
    }

    const initialAnswers = (assessment?.rawAnswers as VIARawAnswers) || {};

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Mapeamento de Forças</h1>
                <p className="text-slate-500">Este questionário nos ajudará a entender seus talentos e pontos fortes.</p>
            </div>

            <QuestionnaireWizard initialAnswers={initialAnswers} />
        </div>
    );
}
