import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TierBadge } from './TierBadge';
import { Progress } from '@/components/ui/progress';

interface RiskSubscale {
    domain: string;
    score: number;
    maxPossible: number;
    tier: string;
    label: string;
    color: string;
}

interface RiskSummaryCardProps {
    externalizing: RiskSubscale;
    internalizing: RiskSubscale;
    overallTier: string;
}

export function RiskSummaryCard({ externalizing, internalizing, overallTier }: RiskSummaryCardProps) {
    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Perfil de Risco (SRSS-IE)</CardTitle>
                <TierBadge tier={overallTier} />
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
                {/* Externalizante */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Externalizante</p>
                            <p className="text-sm font-semibold text-slate-700">{externalizing.label}</p>
                        </div>
                        <span className="text-lg font-black text-slate-900">{externalizing.score}<small className="text-[10px] text-slate-400 font-normal">/21</small></span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-500",
                                externalizing.color === 'RED' ? 'bg-rose-500' : externalizing.color === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                            )}
                            style={{ width: `${(externalizing.score / 21) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Internalizante */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Internalizante</p>
                            <p className="text-sm font-semibold text-slate-700">{internalizing.label}</p>
                        </div>
                        <span className="text-lg font-black text-slate-900">{internalizing.score}<small className="text-[10px] text-slate-400 font-normal">/15</small></span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-500",
                                internalizing.color === 'RED' ? 'bg-rose-500' : internalizing.color === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500'
                            )}
                            style={{ width: `${(internalizing.score / 15) * 100}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Helper para usar localmente se util não estiver disponivel
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
