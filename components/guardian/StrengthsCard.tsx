import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Strength {
  label: string;
  virtue: string;
  description: string;
}

interface StrengthsCardProps {
  strengths: Strength[];
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  if (strengths.length === 0) return null;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Star size={20} className="text-amber-500" />
          Forças de Caráter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {strengths.map((s, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              {i + 1}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{s.label}</p>
              <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">{s.virtue}</p>
              <p className="text-sm text-slate-600">{s.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
