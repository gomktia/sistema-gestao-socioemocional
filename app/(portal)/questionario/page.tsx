import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard';
import { VIARawAnswers } from '@/src/core/types';
import { Sparkles } from 'lucide-react';

export const metadata = {
    title: 'Questionário Socioemocional | VIA',
};

// ... imports
import { ConsentModal } from '@/components/legal/ConsentModal';

export default async function QuestionarioPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== UserRole.STUDENT) {
        redirect('/');
    }

    if (!user.studentId) {
        // ... error state
        return (
            <div className="p-8 text-center bg-rose-50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-rose-600 font-bold">Erro: Sua conta de aluno não está vinculada a um registro de matrícula.</p>
                <p className="text-slate-500 text-sm mt-2">Por favor, contate o administrador do sistema.</p>
            </div>
        );
    }

    const studentAccess = await prisma.student.findUnique({
        where: { id: user.studentId },
        select: {
            isFormEnabled: true,
            formAccessExpiresAt: true,
            consentAcceptedAt: true, // Fetch consent status
            tenant: {
                select: { name: true }
            }
        }
    });

    const hasAccess = studentAccess?.isFormEnabled || (studentAccess?.formAccessExpiresAt && studentAccess.formAccessExpiresAt > new Date());

    if (!hasAccess) {
        // ... blocked state
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="bg-slate-200 p-4 rounded-full mb-4">
                    <Sparkles className="text-slate-400 w-8 h-8 opacity-50" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Acesso ao Questionário Bloqueado</h2>
                <p className="text-slate-500 max-w-md">
                    No momento, este questionário não está liberado para você. Aguarde a liberação pelo psicólogo ou coordenador da sua escola.
                </p>
            </div>
        );
    }

    // Check LGPD Consent
    if (!studentAccess?.consentAcceptedAt) {
        return (
            <>
                <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
                    {/* Dummy content or simplified view behind modal */}
                    <div className="space-y-8">
                        <div className="text-center max-w-xl mx-auto space-y-3">
                            <div className="h-14 w-14 rounded-2xl bg-slate-200 mx-auto" />
                            <h1 className="text-3xl font-black text-slate-300">Carregando...</h1>
                        </div>
                    </div>
                </div>
                <ConsentModal tenantName={studentAccess?.tenant?.name} />
            </>
        )
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
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center max-w-xl mx-auto space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-violet-200">
                    <Sparkles size={28} strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mapeamento de Forças</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Este questionário nos ajudará a entender seus talentos e pontos fortes.
                    Responda com sinceridade — não existem respostas certas ou erradas!
                </p>
            </div>

            <QuestionnaireWizard initialAnswers={initialAnswers} />
        </div>
    );
}
