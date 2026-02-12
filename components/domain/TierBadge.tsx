import { cn } from '@/lib/utils';

export enum RiskTier {
    TIER_1 = 'TIER_1',
    TIER_2 = 'TIER_2',
    TIER_3 = 'TIER_3',
}

const TIER_CONFIG = {
    [RiskTier.TIER_1]: {
        label: 'Rastro Verde (Universal)',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500'
    },
    [RiskTier.TIER_2]: {
        label: 'Rastro Amarelo (Focalizado)',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500'
    },
    [RiskTier.TIER_3]: {
        label: 'Rastro Vermelho (Intensivo)',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500'
    },
} as const;

interface TierBadgeProps {
    tier: string;
    showLabel?: boolean;
    className?: string;
}

export function TierBadge({ tier, showLabel = true, className }: TierBadgeProps) {
    const config = TIER_CONFIG[tier as RiskTier] || TIER_CONFIG[RiskTier.TIER_1];

    return (
        <div className={cn(
            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider',
            config.color,
            className
        )}>
            <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
            {showLabel ? config.label : tier}
        </div>
    );
}
