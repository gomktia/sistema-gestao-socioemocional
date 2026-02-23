import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface EvolutionCardProps {
  narrative: string;
}

export function EvolutionCard({ narrative }: EvolutionCardProps) {
  if (!narrative) return null;

  return (
    <Card className="border-0 shadow-md border-l-4 border-l-emerald-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp size={20} className="text-emerald-600" />
          Evolução
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 leading-relaxed">{narrative}</p>
      </CardContent>
    </Card>
  );
}
