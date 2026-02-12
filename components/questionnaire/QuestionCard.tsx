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

interface QuestionCardProps {
    number: number;
    text: string;
    value: number | undefined;
    onChange: (value: number) => void;
}

export function QuestionCard({ number, text, value, onChange }: QuestionCardProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex gap-3">
                <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">
                    {number}
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                    {text}
                </p>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
                {EMOJIS.map((emoji, i) => {
                    const isSelected = value === i;
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onChange(i)}
                            className={cn(
                                'flex flex-col items-center gap-2 rounded-xl p-2.5 transition-all duration-200 border-2',
                                isSelected
                                    ? 'bg-indigo-50 border-indigo-500 shadow-md transform scale-[1.02]'
                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                            )}
                        >
                            <span className={cn(
                                'text-2xl sm:text-3xl transition-transform duration-200',
                                isSelected ? 'scale-110' : 'grayscale-[0.5] opacity-70'
                            )}>
                                {emoji}
                            </span>
                            <span className={cn(
                                'text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter text-center leading-none',
                                isSelected ? 'text-indigo-600' : 'text-slate-400'
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
