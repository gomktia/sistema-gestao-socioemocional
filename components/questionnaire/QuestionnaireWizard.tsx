'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { VIA_ITEMS_BY_VIRTUE, VIA_ITEM_TEXTS } from '@/src/core/content/questionnaire-items';
import { QuestionCard } from './QuestionCard';
import { saveVIAAnswers } from '@/app/actions/assessment';
import { ChevronLeft, ChevronRight, Save, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { VIARawAnswers } from '@/src/core/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STEPS = Object.keys(VIA_ITEMS_BY_VIRTUE) as Array<keyof typeof VIA_ITEMS_BY_VIRTUE>;

const STEP_COLORS = [
    { from: 'from-violet-500', to: 'to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200' },
    { from: 'from-blue-500', to: 'to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
    { from: 'from-emerald-500', to: 'to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
    { from: 'from-amber-500', to: 'to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
    { from: 'from-rose-500', to: 'to-pink-500', bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200' },
    { from: 'from-indigo-500', to: 'to-blue-600', bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
];

export function QuestionnaireWizard({
    initialAnswers = {},
    studentId,
    isInterviewMode = false
}: {
    initialAnswers?: VIARawAnswers
    studentId?: string
    isInterviewMode?: boolean
}) {
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [answers, setAnswers] = useState<VIARawAnswers>(initialAnswers);
    const [isSaving, setIsSaving] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [showValidation, setShowValidation] = useState(false);
    const router = useRouter();

    const currentStepKey = STEPS[currentStepIdx];
    const stepConfig = VIA_ITEMS_BY_VIRTUE[currentStepKey];
    const isLastStep = currentStepIdx === STEPS.length - 1;
    const colors = STEP_COLORS[currentStepIdx % STEP_COLORS.length];

    // Verificar se todas as perguntas da página atual foram respondidas
    const unansweredItems = useMemo(() => {
        return stepConfig.items.filter(num => answers[num] === undefined);
    }, [stepConfig.items, answers]);

    const allCurrentAnswered = unansweredItems.length === 0;
    const currentStepAnswered = stepConfig.items.filter(num => answers[num] !== undefined).length;

    const handleAnswerChange = (questionNumber: number, value: number) => {
        const newAnswers = { ...answers, [questionNumber]: value };
        setAnswers(newAnswers);
        setShowValidation(false);

        startTransition(async () => {
            await saveVIAAnswers(newAnswers, studentId);
        });
    };

    const handleNext = async () => {
        // Validação: impedir avanço sem responder todas as questões
        if (!allCurrentAnswered) {
            setShowValidation(true);
            toast.error(`Responda todas as ${unansweredItems.length} questões restantes antes de avançar.`);
            // Scroll até a primeira pergunta sem resposta
            const firstUnanswered = document.getElementById(`question-${unansweredItems[0]}`);
            firstUnanswered?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (isLastStep) {
            setIsSaving(true);
            const result = await saveVIAAnswers(answers, studentId);
            if (result.success && result.complete) {
                router.push('/minhas-forcas');
            } else {
                setIsSaving(false);
                toast.error('Por favor, responda todas as questões para finalizar.');
            }
        } else {
            setCurrentStepIdx(prev => prev + 1);
            setShowValidation(false);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStepIdx > 0) {
            setCurrentStepIdx(prev => prev - 1);
            setShowValidation(false);
            window.scrollTo(0, 0);
        }
    };

    // Cálculo de progresso
    const totalQuestions = 71;
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-28">
            {/* Header com Progresso - Premium */}
            <div className="sticky top-16 lg:top-0 z-30 bg-slate-50/80 backdrop-blur-xl pt-4 pb-5 space-y-5">
                {/* Step indicators */}
                <div className="flex items-center gap-1.5 px-1">
                    {STEPS.map((_, idx) => {
                        const stepItems = VIA_ITEMS_BY_VIRTUE[STEPS[idx]].items;
                        const stepAnswered = stepItems.every(num => answers[num] !== undefined);
                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "h-1.5 flex-1 rounded-full transition-all duration-500",
                                    idx === currentStepIdx
                                        ? `bg-gradient-to-r ${STEP_COLORS[idx % STEP_COLORS.length].from} ${STEP_COLORS[idx % STEP_COLORS.length].to}`
                                        : stepAnswered
                                            ? 'bg-emerald-400'
                                            : idx < currentStepIdx
                                                ? 'bg-slate-300'
                                                : 'bg-slate-200'
                                )}
                            />
                        );
                    })}
                </div>

                <div className="flex items-center justify-between px-1">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                            <div className={cn(
                                "h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-black shadow-lg",
                                colors.from, colors.to
                            )}>
                                {currentStepIdx + 1}
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">{stepConfig.label}</h2>
                                <p className="text-xs text-slate-500">{stepConfig.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right space-y-0.5">
                        <span className={cn("text-xl font-black", colors.text)}>{progressPercent}%</span>
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">Concluído</p>
                    </div>
                </div>

                {/* Progress bar global */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div
                        className={cn("h-full bg-gradient-to-r rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.3)]", colors.from, colors.to)}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Contagem da categoria atual */}
                <div className={cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all",
                    allCurrentAnswered ? "bg-emerald-50" : colors.bg
                )}>
                    <span className={cn(
                        "text-xs font-bold",
                        allCurrentAnswered ? "text-emerald-600" : colors.text
                    )}>
                        {allCurrentAnswered ? (
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 size={14} strokeWidth={2} /> Todas respondidas nesta categoria!
                            </span>
                        ) : (
                            `${currentStepAnswered} de ${stepConfig.items.length} respondidas nesta categoria`
                        )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                        Etapa {currentStepIdx + 1}/{STEPS.length}
                    </span>
                </div>
            </div>

            {/* Alerta de validação */}
            {showValidation && !allCurrentAnswered && (
                <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 animate-in slide-in-from-top duration-300">
                    <AlertCircle size={20} className="text-rose-500 shrink-0" strokeWidth={1.5} />
                    <p className="text-sm text-rose-700 font-semibold">
                        Você ainda tem {unansweredItems.length} {unansweredItems.length === 1 ? 'questão não respondida' : 'questões não respondidas'} nesta página.
                        Responda todas para avançar.
                    </p>
                </div>
            )}

            {/* Lista de Perguntas do Passo Atual */}
            <div className="space-y-4">
                {stepConfig.items.map((num) => (
                    <div key={num} id={`question-${num}`}>
                        <QuestionCard
                            number={num}
                            text={VIA_ITEM_TEXTS[num]}
                            value={answers[num]}
                            onChange={(val) => handleAnswerChange(num, val)}
                            highlight={showValidation}
                        />
                    </div>
                ))}
            </div>

            {/* Navegação de Rodapé - Premium */}
            <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 z-40 shadow-[0_-4px_20px_rgb(0,0,0,0.04)]">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={handleBack}
                        disabled={currentStepIdx === 0}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl disabled:opacity-30 transition-all active:scale-95"
                    >
                        <ChevronLeft size={18} strokeWidth={2} />
                        Anterior
                    </button>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        {isPending && <Loader2 size={14} className="animate-spin text-indigo-500" />}
                        <span className="hidden sm:inline font-medium">
                            {isPending ? 'Salvando...' : '✓ Progresso salvo'}
                        </span>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={isSaving}
                        className={cn(
                            'flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-extrabold transition-all active:scale-95',
                            !allCurrentAnswered
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : isLastStep
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-200'
                                    : `bg-gradient-to-r ${colors.from} ${colors.to} text-white shadow-xl hover:shadow-2xl`
                        )}
                    >
                        {isSaving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : isLastStep ? (
                            <>
                                <Sparkles size={18} strokeWidth={1.5} />
                                Finalizar e Ver Resultados
                            </>
                        ) : (
                            <>
                                Próxima Categoria
                                <ChevronRight size={18} strokeWidth={2} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
