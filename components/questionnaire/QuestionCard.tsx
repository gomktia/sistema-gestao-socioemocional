'use client';

import { cn } from '@/lib/utils';

const EMOJIS = ['😟', '😕', '😐', '🙂', '😄'];
const LABELS = [
    'Nada a ver comigo',
    'Pouco a ver',
    'Mais ou menos',
    'Bastante a ver',
    'Tudo a ver comigo'
];

const SELECTED_COLORS = [
    { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-600', shadow: 'shadow-rose-100' },
    { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-600', shadow: 'shadow-amber-100' },
    { bg: 'bg-slate-50', border: 'border-slate-400', text: 'text-slate-600', shadow: 'shadow-slate-100' },
    { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-600', shadow: 'shadow-sky-100' },
    { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-600', shadow: 'shadow-emerald-100' },
];

interface QuestionCardProps {
    number: number;
    text: string;
    value: number | undefined;
    onChange: (value: number) => void;
    highlight?: boolean;
}

export function QuestionCard({ number, text, value, onChange, highlight }: QuestionCardProps) {
    return (
        <div className={cn(
            "bg-white rounded-3xl p-6 sm:p-7 space-y-5 transition-all duration-300",
            "shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
            highlight && value === undefined && "ring-2 ring-rose-300 animate-[pulse_1.5s_ease-in-out_2]",
            value !== undefined && "ring-1 ring-emerald-200/60"
        )}>
            <div className="flex gap-4 items-start">
                <span className={cn(
                    "flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black transition-colors",
                    value !== undefined
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-indigo-100 text-indigo-600"
                )}>
                    {value !== undefined ? '✓' : number}
                </span>
                <p className="text-slate-800 font-semibold leading-relaxed text-[15px]">
                    {text}
                </p>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {EMOJIS.map((emoji, i) => {
                    const isSelected = value === i;
                    const colors = SELECTED_COLORS[i];
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onChange(i)}
                            className={cn(
                                'flex flex-col items-center gap-2.5 rounded-2xl p-3 sm:p-4 transition-all duration-200 border-2 cursor-pointer',
                                isSelected
                                    ? `${colors.bg} ${colors.border} shadow-lg ${colors.shadow} scale-[1.03]`
                                    : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-md active:scale-95'
                            )}
                        >
                            <span className={cn(
                                'text-2xl sm:text-3xl transition-all duration-200',
                                isSelected ? 'scale-110 drop-shadow-sm' : 'grayscale-[0.4] opacity-60 hover:opacity-90 hover:grayscale-0'
                            )}>
                                {emoji}
                            </span>
                            <span className={cn(
                                'text-[8px] sm:text-[10px] font-extrabold uppercase tracking-tight text-center leading-tight',
                                isSelected ? colors.text : 'text-slate-400'
                            )}>
                                {LABELS[i]}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
