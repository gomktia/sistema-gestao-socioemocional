import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard';
import { VIARawAnswers } from '@/src/core/types';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function InterviewPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();

    // Permissão: Apenas Staff
    if (!user || !['PSYCHOLOGIST', 'MANAGER', 'ADMIN', 'COUNSELOR'].includes(user.role)) {
        redirect('/');
    }

    const studentId = params.id;

    // Buscar aluno e avaliação existente
    const student = await prisma.student.findUnique({
        where: { id: studentId, tenantId: user.tenantId },
        select: { name: true }
    });

    if (!student) {
        return <div className="p-8 text-center text-rose-600">Aluno não encontrado.</div>;
    }

    const assessment = await prisma.assessment.findFirst({
        where: {
            tenantId: user.tenantId,
            studentId: studentId,
            type: 'VIA_STRENGTHS',
        },
        select: { rawAnswers: true, processedScores: true },
        orderBy: { appliedAt: 'desc' },
    });

    const initialAnswers = (assessment?.rawAnswers as VIARawAnswers) || {};

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header de Entrevista */}
            <div className="bg-white border-b border-indigo-100 py-6 px-4 md:px-8 mb-8 sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/alunos/${studentId}`} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                                    Modo Entrevista
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight">
                                Avaliação de {student.name}
                            </h1>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
                        <Sparkles size={16} />
                        <span>Preenchimento por Psicólogo</span>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-sm text-indigo-800 flex gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm h-fit">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                        <p className="font-bold mb-1">Instruções para o Aplicador</p>
                        <p className="opacity-90 leading-relaxed">
                            Leia as perguntas para o aluno e marque as respostas conforme o relato dele.
                            As respostas são salvas automaticamente a cada seleção.
                        </p>
                    </div>
                </div>

                <QuestionnaireWizard
                    initialAnswers={initialAnswers}
                    studentId={studentId}
                    isInterviewMode={true}
                />
            </div>
        </div>
    );
}
