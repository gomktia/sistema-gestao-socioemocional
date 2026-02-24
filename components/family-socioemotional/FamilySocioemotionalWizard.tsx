'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    FAMILY_SOCIOEMOTIONAL_ITEMS,
    FAMILY_SOCIOEMOTIONAL_AXES_INFO,
    FAMILY_SOCIOEMOTIONAL_LABELS,
} from '@/src/core/content/family-socioemotional-items';
import { QuestionCard } from '@/components/questionnaire/QuestionCard';
import { saveFamilySocioemotionalAnswers } from '@/app/actions/assessment';
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, Sparkles, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import { FamilySocioemotionalRawAnswers, FamilySocioemotionalAxis } from '@/src/core/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AXES = Object.values(FamilySocioemotionalAxis);

const AXIS_COLORS: Record<FamilySocioemotionalAxis, { from: string; to: string; bg: string; text: string; ring: string }> = {
    [FamilySocioemotionalAxis.AUTOGESTAO]:        { from: 'from-indigo-500',  to: 'to-violet-500',  bg: 'bg-indigo-50',  text: 'text-indigo-600',  ring: 'ring-indigo-200' },
    [FamilySocioemotionalAxis.RESILIENCIA]:       { from: 'from-sky-500',     to: 'to-cyan-500',    bg: 'bg-sky-50',     text: 'text-sky-600',     ring: 'ring-sky-200' },
    [FamilySocioemotionalAxis.AMABILIDADE]:       { from: 'from-rose-500',    to: 'to-pink-500',    bg: 'bg-rose-50',    text: 'text-rose-600',    ring: 'ring-rose-200' },
    [FamilySocioemotionalAxis.ENGAJAMENTO_SOCIAL]:{ from: 'from-amber-500',   to: 'to-orange-500',  bg: 'bg-amber-50',   text: 'text-amber-600',   ring: 'ring-amber-200' },
    [FamilySocioemotionalAxis.ABERTURA]:          { from: 'from-emerald-500', to: 'to-teal-500',    bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
};

export function FamilySocioemotionalWizard({
    initialAnswers = {},
    studentId,
    studentName = 'Aluno',
}: {
    initialAnswers?: FamilySocioemotionalRawAnswers;
    studentId: string;
    studentName?: string;
}) {
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [answers, setAnswers] = useState<FamilySocioemotionalRawAnswers>(initialAnswers);
    const [isSaving, setIsSaving] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [showValidation, setShowValidation] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(true);
    const router = useRouter();

    const currentAxis = AXES[currentStepIdx];
    const axisInfo = FAMILY_SOCIOEMOTIONAL_AXES_INFO[currentAxis];
    const isLastStep = currentStepIdx === AXES.length - 1;
    const colors = AXIS_COLORS[currentAxis];

    const unansweredItems = useMemo(() => {
        return axisInfo.itemIds.filter(id => answers[id] === undefined);
    }, [axisInfo.itemIds, answers]);

    const allCurrentAnswered = unansweredItems.length === 0;

    const handleAnswerChange = (questionId: number, value: number) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);
        setShowValidation(false);

        startTransition(async () => {
            try {
                await saveFamilySocioemotionalAnswers(newAnswers, studentId);
            } catch (err) {
                console.error('Background save error:', err);
            }
        });
    };

    const handleNext = async () => {
        if (!allCurrentAnswered) {
            setShowValidation(true);
            toast.error('Responda todas as questões antes de avançar.');
            const firstUnanswered = document.getElementById(`question-${unansweredItems[0]}`);
            firstUnanswered?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (isLastStep) {
            setIsSaving(true);
            try {
                const result = await saveFamilySocioemotionalAnswers(answers, studentId);
                if (result.success && result.complete) {
                    toast.success('Percepção Familiar registrada com sucesso!');
                    router.push('/responsavel/percepcao-familiar/resultado');
                    router.refresh();
                } else if (result.error) {
                    setIsSaving(false);
                    toast.error(result.error);
                } else {
                    setIsSaving(false);
                    toast.error('Finalize todas as questões.');
                }
            } catch (err: any) {
                setIsSaving(false);
                toast.error(`Erro: ${err.message}`);
            }
        } else {
            setCurrentStepIdx(prev => prev + 1);
            setShowValidation(false);
            const main = document.querySelector('main');
            main ? main.scrollTo({ top: 0, behavior: 'smooth' }) : window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStepIdx > 0) {
            setCurrentStepIdx(prev => prev - 1);
            setShowValidation(false);
            const main = document.querySelector('main');
            main ? main.scrollTo({ top: 0, behavior: 'smooth' }) : window.scrollTo(0, 0);
        }
    };

    const totalQuestions = 15;
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    return (
        <div className={cn(
            "transition-all duration-500 ease-in-out",
            isFocusMode ? "fixed inset-0 z-[100] bg-slate-50 overflow-y-auto" : ""
        )}>
            {isFocusMode && (
                <header className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 z-50 px-6 sm:px-10 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 ring-1 ring-black/5">
                            <span className="text-white font-black text-lg">TR</span>
                        </div>
                        <div className="hidden sm:block">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">Triavium</h2>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Percepção Familiar</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-100/80 rounded-full pl-1.5 pr-5 py-1.5 border border-slate-200">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs ring-2 ring-white shadow-sm">
                                {studentName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-xs text-right hidden sm:block">
                                <p className="font-bold text-slate-700 leading-tight">{studentName}</p>
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
                            className="flex items-center gap-2 text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-xl transition-colors"
                        >
                            <Maximize2 size={14} />
                            Modo Foco
                        </button>
                    </div>
                )}

                <div className={cn(
                    "z-30 space-y-6 transition-all duration-300",
                    isFocusMode ? "relative" : "sticky top-16 lg:top-0 bg-slate-50/95 backdrop-blur-xl pt-4 pb-4"
                )}>
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 px-1">
                        {AXES.map((_, idx) => {
                            const axisConfig = FAMILY_SOCIOEMOTIONAL_AXES_INFO[AXES[idx]];
                            const stepAllAnswered = axisConfig.itemIds.every(id => answers[id] !== undefined);
                            const isActive = idx === currentStepIdx;
                            return (
                                <div
                                    key={idx}
                                    className={cn(
                                        "h-2 flex-1 rounded-full transition-all duration-700 relative overflow-hidden",
                                        isActive
                                            ? `bg-gradient-to-r ${AXIS_COLORS[AXES[idx]].from} ${AXIS_COLORS[AXES[idx]].to} shadow-lg scale-y-125`
                                            : stepAllAnswered
                                                ? 'bg-emerald-400'
                                                : idx < currentStepIdx
                                                    ? 'bg-slate-300'
                                                    : 'bg-slate-200'
                                    )}
                                />
                            );
                        })}
                    </div>

                    <div className="flex items-end justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "h-10 w-10 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-base font-black shadow-lg shadow-violet-100",
                                colors.from, colors.to
                            )}>
                                {currentStepIdx + 1}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                                    {axisInfo.label}
                                </h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">
                                    {axisInfo.description}
                                </p>
                            </div>
                        </div>
                        <div className="text-right space-y-1 hidden sm:block">
                            <div className="flex items-baseline justify-end gap-1">
                                <span className={cn("text-3xl font-black tracking-tight", colors.text)}>{progressPercent}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {showValidation && !allCurrentAnswered && (
                    <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4 animate-in slide-in-from-top duration-300 shadow-sm">
                        <AlertCircle size={22} className="text-rose-500 shrink-0" strokeWidth={2} />
                        <p className="text-sm text-rose-800 font-bold">
                            Faltam {unansweredItems.length} questões.
                        </p>
                    </div>
                )}

                {/* Instruction banner (first step only) */}
                {currentStepIdx === 0 && answeredCount === 0 && (
                    <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 space-y-2">
                        <h3 className="text-sm font-black text-violet-900">Como responder</h3>
                        <p className="text-xs text-violet-700 leading-relaxed">
                            Baseado em suas observações nos <strong>últimos seis meses</strong>, assinale a alternativa que melhor descreve
                            a frequência dessas atitudes do(a) {studentName}. Utilize a escala: Nunca | Raramente | Algumas Vezes | Frequentemente | Quase Sempre.
                        </p>
                    </div>
                )}

                <div key={currentAxis} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {axisInfo.itemIds.map((id, idx) => {
                        const item = FAMILY_SOCIOEMOTIONAL_ITEMS.find(i => i.id === id);
                        if (!item) return null;
                        return (
                            <div
                                key={id}
                                id={`question-${id}`}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <QuestionCard
                                    number={idx + 1}
                                    text={item.text}
                                    value={answers[id]}
                                    onChange={(val) => handleAnswerChange(id, val)}
                                    highlight={showValidation}
                                    labels={FAMILY_SOCIOEMOTIONAL_LABELS}
                                />
                            </div>
                        );
                    })}
                </div>

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
                            <ChevronLeft size={20} />
                            Anterior
                        </button>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            {isPending ? (
                                <span className="flex items-center gap-2 text-violet-500 animate-pulse">
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
                                        : `bg-gradient-to-r ${colors.from} ${colors.to} text-white shadow-violet-200`
                            )}
                        >
                            {isSaving ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : isLastStep ? (
                                <>
                                    <Sparkles size={20} />
                                    Finalizar
                                </>
                            ) : (
                                <>
                                    Próxima
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
