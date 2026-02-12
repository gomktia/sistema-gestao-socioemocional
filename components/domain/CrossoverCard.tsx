import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrossoverCardProps {
    targetRisk: string;
    leverageStrength: string;
    strengthLabel: string;
    strategy: string;
    rationale: string;
}

export function CrossoverCard({
    targetRisk,
    targetRiskLabel,
    strengthLabel,
    strategy,
    rationale,
}: CrossoverCardProps & { targetRiskLabel?: string }) {
    return (
        <Card className="relative overflow-hidden border-l-4 border-l-indigo-600 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 italic">
                        <Target size={14} className="stroke-[2.5]" />
                        <span className="text-xs font-bold uppercase tracking-tight">{targetRisk}</span>
                    </div>

                    <ArrowRight className="text-slate-300" size={16} />

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <Sparkles size={14} className="stroke-[2.5]" />
                        <span className="text-xs font-bold uppercase tracking-tight">{strengthLabel}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Lightbulb size={16} className="text-amber-500" />
                        Estratégia Sugerida
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {strategy}
                    </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <p className="text-[11px] text-slate-500 italic leading-snug">
                        <strong className="text-slate-700 not-italic uppercase tracking-tighter mr-1">Racional Técnico:</strong>
                        {rationale}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
