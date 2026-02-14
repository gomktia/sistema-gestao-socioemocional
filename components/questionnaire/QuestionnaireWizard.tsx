'use client';

// ... imports
import { useState, useTransition, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VIA_ITEMS_BY_VIRTUE, VIA_ITEM_TEXTS } from '@/src/core/content/questionnaire-items';
import { QuestionCard } from './QuestionCard';
import { saveVIAAnswers } from '@/app/actions/assessment';
import { ChevronLeft, ChevronRight, Save, CheckCircle2, Loader2, Sparkles, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
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
    studentName = 'Aluno',
    isInterviewMode = false
}: {
    initialAnswers?: VIARawAnswers
    studentId?: string
    studentName?: string
    isInterviewMode?: boolean
}) {
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [answers, setAnswers] = useState<VIARawAnswers>(initialAnswers);
    const [isSaving, setIsSaving] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [showValidation, setShowValidation] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(true); // Default to focus mode
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
        <div className={cn(
            "transition-all duration-500 ease-in-out",
            isFocusMode ? "fixed inset-0 z-[100] bg-slate-50 overflow-y-auto" : ""
        )}>
            {/* Focus Mode Header */}
            {isFocusMode && (
                <header className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 z-50 px-6 sm:px-10 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-black/5">
                            <span className="text-white font-black text-lg">GS</span>
                        </div>
                        <div className="hidden sm:block">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">EduInteligência</h2>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avaliação Socioemocional</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-100/80 rounded-full pl-1.5 pr-5 py-1.5 border border-slate-200">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs ring-2 ring-white shadow-sm">
                                {studentName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-xs text-right hidden sm:block">
                                <p className="font-bold text-slate-700 leading-tight">{studentName}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Aluno</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsFocusMode(false)}
                            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                            title="Sair do Modo Foco"
                        >
                            <Minimize2 size={20} strokeWidth={2} />
                        </button>
                    </div>
                </header>
            )}

            <div className={cn(
                "max-w-3xl mx-auto space-y-8 pb-32 transition-all duration-500",
                isFocusMode ? "pt-28 px-4" : "pt-4"
            )}>
                {!isFocusMode && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setIsFocusMode(true)}
                            className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
                        >
                            <Maximize2 size={14} />
                            Modo Foco
                        </button>
                    </div>
                )}

                {/* Header com Progresso - Premium */}
                <div className={cn(
                    "z-30 space-y-6 transition-all duration-300",
                    isFocusMode ? "relative" : "sticky top-16 lg:top-0 bg-slate-50/95 backdrop-blur-xl pt-4 pb-4"
                )}>
                    {/* Step indicators */}
                    <div className="flex items-center gap-2 px-1">
                        {STEPS.map((_, idx) => {
                            const stepItems = VIA_ITEMS_BY_VIRTUE[STEPS[idx]].items;
                            const stepAnswered = stepItems.every(num => answers[num] !== undefined);
                            const isActive = idx === currentStepIdx;
                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "h-2 flex-1 rounded-full transition-all duration-700 relative overflow-hidden",
                                        isActive
                                            ? `bg-gradient-to-r ${STEP_COLORS[idx % STEP_COLORS.length].from} ${STEP_COLORS[idx % STEP_COLORS.length].to} shadow-lg scale-y-125`
                                            : stepAnswered
                                                ? 'bg-emerald-400'
                                                : idx < currentStepIdx
                                                    ? 'bg-slate-300'
                                                    : 'bg-slate-200'
                                    )}
                                >
                                    {isActive && <div className="absolute inset-0 bg-white/30 animate-pulse" />}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-end justify-between px-1">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "h-10 w-10 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-base font-black shadow-lg shadow-indigo-100",
                                    colors.from, colors.to
                                )}>
                                    {currentStepIdx + 1}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none animate-in fade-in slide-in-from-left-4 duration-500 key-[currentStepIdx]">
                                        {stepConfig.label}
                                    </h2>
                                    <p className="text-sm font-medium text-slate-500 mt-1 animate-in fade-in slide-in-from-left-4 duration-700">
                                        {stepConfig.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right space-y-1 hidden sm:block">
                            <div className="flex items-baseline justify-end gap-1">
                                <span className={cn("text-3xl font-black tracking-tight", colors.text)}>{progressPercent}%</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Concluído</span>
                            </div>
                        </div>
                    </div>

                    {/* Contagem da categoria atual */}
                    <div className={cn(
                        "flex items-center justify-between px-5 py-3 rounded-2xl transition-all border",
                        allCurrentAnswered
                            ? "bg-emerald-50 border-emerald-100 shadow-sm"
                            : `${colors.bg} border-transparent`
                    )}>
                        <span className={cn(
                            "text-sm font-bold flex items-center gap-2",
                            allCurrentAnswered ? "text-emerald-700" : colors.text
                        )}>
                            {allCurrentAnswered ? (
                                <>
                                    <div className="bg-emerald-200 rounded-full p-0.5"><CheckCircle2 size={16} className="text-emerald-700" /></div>
                                    Categoria concluída!
                                </>
                            ) : (
                                <>
                                    <span className="opacity-70">Progresso da seção:</span>
                                    <span className="text-lg">{currentStepAnswered}</span>
                                    <span className="opacity-50">/</span>
                                    <span className="opacity-70">{stepConfig.items.length}</span>
                                </>
                            )}
                        </span>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest bg-white/50 px-2 py-1 rounded-lg">
                            Etapa {currentStepIdx + 1} de {STEPS.length}
                        </span>
                    </div>
                </div>

                {/* Alerta de validação */}
                {showValidation && !allCurrentAnswered && (
                    <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 animate-in slide-in-from-top duration-300 shadow-sm">
                        <AlertCircle size={22} className="text-rose-500 shrink-0" strokeWidth={2} />
                        <p className="text-sm text-rose-800 font-bold">
                            Faltam {unansweredItems.length} questões nesta página. Por favor, responda todas para continuar.
                        </p>
                    </div>
                )}

                {/* Lista de Perguntas do Passo Atual */}
                {/* Usando key para forçar re-render e animação na troca de step */}
                <div key={currentStepKey} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                    {stepConfig.items.map((num, idx) => (
                        <div
                            key={num}
                            id={`question-${num}`}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
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
                <div className={cn(
                    "fixed bottom-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_30px_rgba(0,0,0,0.05)] transition-all duration-300",
                    isFocusMode ? "left-0 right-0 p-5" : "left-0 right-0 lg:left-72 p-4"
                )}>
                    <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                        <button
                            onClick={handleBack}
                            disabled={currentStepIdx === 0}
                            className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
                        >
                            <ChevronLeft size={20} strokeWidth={2.5} />
                            Anterior
                        </button>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            {isPending ? (
                                <span className="flex items-center gap-2 text-indigo-500 animate-pulse">
                                    <Loader2 size={14} className="animate-spin" />
                                    Salvando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                    Salvo
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={isSaving}
                            className={cn(
                                'flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-extrabold transition-all active:scale-95 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
                                !allCurrentAnswered
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none hover:translate-y-0'
                                    : isLastStep
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200'
                                        : `bg-gradient-to-r ${colors.from} ${colors.to} text-white shadow-indigo-200`
                            )}
                        >
                            {isSaving ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : isLastStep ? (
                                <>
                                    <Sparkles size={20} strokeWidth={2} />
                                    Finalizar
                                </>
                            ) : (
                                <>
                                    Próxima
                                    <ChevronRight size={20} strokeWidth={2.5} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
