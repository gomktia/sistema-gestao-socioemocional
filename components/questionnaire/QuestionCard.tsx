'use client';

import { cn } from '@/lib/utils';
import { Circle, Check } from 'lucide-react';

const LABELS = [
    'Nada a ver comigo',
    'Pouco a ver',
    'Mais ou menos',
    'Bastante a ver',
    'Tudo a ver comigo'
];

const SELECTED_COLORS = [
    { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-900', ring: 'ring-slate-400' },
    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', ring: 'ring-blue-300' },
    { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', ring: 'ring-indigo-300' },
    { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', ring: 'ring-violet-300' },
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', ring: 'ring-purple-300' },
];

interface QuestionCardProps {
    number: number;
    text: string;
    value: number | undefined;
    onChange: (value: number) => void;
    highlight?: boolean;
}

function IntensityIcon({ level, isSelected }: { level: number; isSelected: boolean }) {
    // Escala visual: círculos concêntricos crescendo
    // level 0: 1 círculo pequeno
    // level 4: Círculo cheio grande

    const size = 24 + (level * 6); // 24, 30, 36, 42, 48 px
    const opacity = 0.3 + (level * 0.15); // 0.3, 0.45, 0.6, 0.75, 0.9

    return (
        <div className="relative flex items-center justify-center h-14 w-14">
            {/* Base ghost circle */}
            <div className={cn(
                "absolute rounded-full border-2 transition-all duration-300",
                isSelected ? "border-current opacity-100 scale-100" : "border-slate-200 scale-90"
            )}
                style={{
                    width: '100%',
                    height: '100%',
                    opacity: isSelected ? 1 : 0.5
                }} />

            {/* Active filled circle */}
            <div
                className={cn(
                    "rounded-full transition-all duration-300 shadow-sm",
                    isSelected ? "bg-current" : "bg-slate-300"
                )}
                style={{
                    width: `${35 + (level * 12)}%`,
                    height: `${35 + (level * 12)}%`,
                    opacity: isSelected ? 1 : opacity
                }}
            />

            {isSelected && (
                <Check className="absolute text-white w-5 h-5 animate-in zoom-in duration-300" strokeWidth={3} />
            )}
        </div>
    );
}

export function QuestionCard({ number, text, value, onChange, highlight }: QuestionCardProps) {
    return (
        <div className={cn(
            "bg-white rounded-3xl p-6 sm:p-8 space-y-6 transition-all duration-500",
            "shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-100",
            highlight && value === undefined && "ring-2 ring-rose-400 animate-[pulse_1.5s_ease-in-out_2]",
            value !== undefined && "ring-2 ring-emerald-500/20 bg-emerald-50/10"
        )}>
            <div className="flex gap-5 items-start">
                <span className={cn(
                    "flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black transition-colors shadow-sm",
                    value !== undefined
                        ? "bg-emerald-500 text-white shadow-emerald-200"
                        : "bg-slate-100 text-slate-500"
                )}>
                    {value !== undefined ? <Check size={18} strokeWidth={3} /> : number}
                </span>
                <p className="text-slate-900 font-bold leading-relaxed text-lg tracking-tight">
                    {text}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
                {LABELS.map((label, i) => {
                    const isSelected = value === i;
                    const colors = SELECTED_COLORS[i];
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onChange(i)}
                            className={cn(
                                'group flex flex-row sm:flex-col items-center justify-start sm:justify-between gap-4 sm:gap-3 rounded-2xl p-3 sm:p-4 transition-all duration-300 cursor-pointer relative overflow-hidden text-left sm:text-center w-full',
                                isSelected
                                    ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} shadow-md scale-[1.01] sm:scale-105`
                                    : 'bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-sm active:scale-95'
                            )}
                        >
                            <div className={cn("transition-colors duration-300 shrink-0", isSelected ? colors.text : "text-slate-400 group-hover:text-slate-500")}>
                                {/* Mobile: slightly smaller, Desktop: normal */}
                                <div className="scale-90 sm:scale-100 origin-center">
                                    <IntensityIcon level={i} isSelected={isSelected} />
                                </div>
                            </div>

                            <span className={cn(
                                'text-xs sm:text-[10px] md:text-xs font-bold uppercase tracking-wide leading-tight transition-colors duration-200',
                                isSelected ? colors.text : 'text-slate-500 font-semibold'
                            )}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

