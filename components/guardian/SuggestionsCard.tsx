import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface Suggestion {
  strengthLabel: string;
  activities: string[];
}

interface SuggestionsCardProps {
  suggestions: Suggestion[];
}

export function SuggestionsCard({ suggestions }: SuggestionsCardProps) {
  if (suggestions.length === 0) return null;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb size={20} className="text-yellow-500" />
          Sugestões para Casa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {suggestions.map((s, i) => (
          <div key={i}>
            <p className="font-semibold text-slate-800 mb-2">{s.strengthLabel}</p>
            <ul className="space-y-2">
              {s.activities.map((activity, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
