import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'emerald' | 'amber' | 'red' | 'indigo';
}

const COLOR_MAP = {
  emerald: {
    bg: 'from-emerald-50 to-emerald-50/30',
    icon: 'text-emerald-600 bg-emerald-100',
    value: 'text-emerald-900',
    label: 'text-emerald-600',
  },
  amber: {
    bg: 'from-amber-50 to-amber-50/30',
    icon: 'text-amber-600 bg-amber-100',
    value: 'text-amber-900',
    label: 'text-amber-600',
  },
  red: {
    bg: 'from-red-50 to-red-50/30',
    icon: 'text-red-600 bg-red-100',
    value: 'text-red-900',
    label: 'text-red-600',
  },
  indigo: {
    bg: 'from-indigo-50 to-indigo-50/30',
    icon: 'text-indigo-600 bg-indigo-100',
    value: 'text-indigo-900',
    label: 'text-indigo-600',
  },
};

export function KPICard({ label, value, icon: Icon, color }: KPICardProps) {
  const c = COLOR_MAP[color];

  return (
    <Card className={`border-none bg-gradient-to-br ${c.bg} shadow-[0_8px_30px_rgb(0,0,0,0.04)]`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 rounded-xl ${c.icon} flex items-center justify-center`}>
            <Icon size={20} />
          </div>
          <div>
            <p className={`text-2xl font-black tracking-tight ${c.value}`}>{value}</p>
            <p className={`text-[10px] font-extrabold uppercase tracking-[0.15em] ${c.label}`}>
              {label}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
