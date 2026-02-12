'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { VIA_ITEMS_BY_VIRTUE, VIA_ITEM_TEXTS } from '@/src/core/content/questionnaire-items';
import { QuestionCard } from './QuestionCard';
import { saveVIAAnswers } from '@/app/actions/assessment';
import { ChevronLeft, ChevronRight, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { VIARawAnswers } from '@/src/core/types';

const STEPS = Object.keys(VIA_ITEMS_BY_VIRTUE) as Array<keyof typeof VIA_ITEMS_BY_VIRTUE>;

export function QuestionnaireWizard({ initialAnswers = {} }: { initialAnswers?: VIARawAnswers }) {
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [answers, setAnswers] = useState<VIARawAnswers>(initialAnswers);
    const [isSaving, setIsSaving] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const currentStepKey = STEPS[currentStepIdx];
    const stepConfig = VIA_ITEMS_BY_VIRTUE[currentStepKey];
    const isLastStep = currentStepIdx === STEPS.length - 1;

    const handleAnswerChange = (questionNumber: number, value: number) => {
        const newAnswers = { ...answers, [questionNumber]: value };
        setAnswers(newAnswers);

        // Auto-save a cada resposta (debounce opcional, mas aqui fazemos direto para simplicidade)
        startTransition(async () => {
            await saveVIAAnswers(newAnswers);
        });
    };

    const handleNext = async () => {
        if (isLastStep) {
            setIsSaving(true);
            const result = await saveVIAAnswers(answers);
            if (result.success && result.complete) {
                router.push('/minhas-forcas');
            } else {
                setIsSaving(false);
                alert('Por favor, responda todas as questões para finalizar.');
            }
        } else {
            setCurrentStepIdx(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStepIdx > 0) {
            setCurrentStepIdx(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    // Cálculo de progresso
    const totalQuestions = 71;
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            {/* Header com Progresso */}
            <div className="sticky top-16 lg:top-0 z-30 bg-slate-50/95 backdrop-blur-sm pt-4 pb-6 space-y-4">
                <div className="flex items-center justify-between px-2">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{stepConfig.label}</h1>
                        <p className="text-sm text-slate-500">{stepConfig.description}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-bold text-indigo-600">{progressPercent}%</span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Concluído</p>
                    </div>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Lista de Perguntas do Passo Atual */}
            <div className="space-y-6">
                {stepConfig.items.map((num) => (
                    <QuestionCard
                        key={num}
                        number={num}
                        text={VIA_ITEM_TEXTS[num]}
                        value={answers[num]}
                        onChange={(val) => handleAnswerChange(num, val)}
                    />
                ))}
            </div>

            {/* Navegação de Rodapé */}
            <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-slate-200 p-4 z-40">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handleBack}
                        disabled={currentStepIdx === 0}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-all"
                    >
                        <ChevronLeft size={18} />
                        Anterior
                    </button>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        {isPending && <Loader2 size={14} className="animate-spin text-indigo-500" />}
                        <span className="hidden sm:inline">
                            {isPending ? 'Salvando...' : 'Progresso salvo'}
                        </span>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={isSaving}
                        className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg
              ${isLastStep
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}
            `}
                    >
                        {isSaving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : isLastStep ? (
                            <>
                                Finalizar e Ver Resultados
                                <CheckCircle2 size={18} />
                            </>
                        ) : (
                            <>
                                Próxima Categoria
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
