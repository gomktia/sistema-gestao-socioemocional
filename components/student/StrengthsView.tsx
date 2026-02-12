'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { STRENGTH_DESCRIPTIONS } from '@/src/core/content/strength-descriptions';
import { ChevronDown, ChevronUp, Sparkles, Trophy, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Strength {
    strength: string;
    virtue: string;
    label: string;
    normalizedScore: number;
}

interface StrengthsViewProps {
    signatureStrengths: Strength[];
    allStrengths: Strength[];
}

const RANK_BADGES = [
    { emoji: '🥇', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { emoji: '🥈', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { emoji: '🥉', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { emoji: '✨', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { emoji: '✨', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
];

export function StrengthsView({ signatureStrengths, allStrengths }: StrengthsViewProps) {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Seção das 5 Forças de Assinatura */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <Trophy className="text-yellow-500" size={20} />
                    <h2 className="text-lg font-bold text-slate-800">Suas 5 Forças de Assinatura</h2>
                </div>

                <div className="grid gap-3">
                    {signatureStrengths.map((s, i) => {
                        const desc = STRENGTH_DESCRIPTIONS[s.strength];
                        const isExpanded = expandedIdx === i;
                        const badge = RANK_BADGES[i];

                        return (
                            <Card
                                key={s.strength}
                                className={cn(
                                    "overflow-hidden transition-all duration-300 border",
                                    isExpanded ? "ring-2 ring-indigo-500/20 border-indigo-200 shadow-lg" : "hover:border-slate-300"
                                )}
                            >
                                <button
                                    onClick={() => setExpandedIdx(isExpanded ? null : i)}
                                    className="w-full text-left outline-none"
                                >
                                    <CardContent className="p-0">
                                        <div className={cn(
                                            "flex items-center justify-between p-4 sm:p-5 transition-colors",
                                            isExpanded ? "bg-indigo-50/30" : "bg-white"
                                        )}>
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "flex h-10 w-10 items-center justify-center rounded-xl border text-xl",
                                                    badge.color
                                                )}>
                                                    {badge.emoji}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{s.label}</h3>
                                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                                        Virtude: {s.virtue}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-lg font-black text-slate-900 leading-none">{s.normalizedScore}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Score</p>
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronUp className="h-5 w-5 text-slate-400" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-slate-400" />
                                                )}
                                            </div>
                                        </div>

                                        {isExpanded && desc && (
                                            <div className="p-5 bg-white border-t border-indigo-100 space-y-4 animate-in slide-in-from-top-2">
                                                <div className="space-y-2">
                                                    <p className="text-slate-600 text-sm leading-relaxed">
                                                        {desc.description}
                                                    </p>
                                                </div>
                                                <div className="bg-indigo-50/50 rounded-lg p-4 flex gap-3">
                                                    <Lightbulb className="text-indigo-600 flex-shrink-0" size={18} />
                                                    <div>
                                                        <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Dica de Desenvolvimento</p>
                                                        <p className="text-indigo-800 text-sm italic">
                                                            {desc.tip}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </button>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* Seção Mensagem Final Positiva */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-1">Você é incrível!</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed">
                            Essas 5 forças são sua "assinatura" no mundo. Use-as para enfrentar desafios,
                            aprender novos conteúdos e fortalecer suas amizades. Elas são seus maiores superpoderes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
