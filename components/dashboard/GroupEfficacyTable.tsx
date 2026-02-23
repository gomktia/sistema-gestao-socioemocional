import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users2 } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  SOCIAL_SKILLS_GROUP: 'Habilidades Sociais',
  EMOTION_REGULATION: 'Regulação Emocional',
  CAREER_GUIDANCE: 'Orientação Vocacional',
  PEER_MENTORING: 'Mentoria entre Pares',
  STUDY_SKILLS: 'Habilidades de Estudo',
  CHECK_IN_CHECK_OUT: 'Check-in / Check-out',
  FAMILY_MEETING: 'Reunião Familiar',
  INDIVIDUAL_PLAN: 'Plano Individual',
  PSYCHOLOGIST_REFERRAL: 'Encaminhamento Psicólogo',
  EXTERNAL_REFERRAL: 'Encaminhamento Externo',
  CRISIS_PROTOCOL: 'Protocolo de Crise',
};

interface GroupEfficacyEntry {
  id: string;
  name: string;
  type: string;
  studentCount: number;
  percentImproved: number;
  percentUnchanged: number;
  percentWorsened: number;
}

interface GroupEfficacyTableProps {
  groups: GroupEfficacyEntry[];
}

export function GroupEfficacyTable({ groups }: GroupEfficacyTableProps) {
  if (groups.length === 0) {
    return (
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <CardContent className="py-16 text-center">
          <Users2 className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1.5} />
          <p className="text-slate-400 font-bold">Nenhum grupo de intervenção ativo</p>
          <p className="text-slate-400 text-sm mt-1">
            Crie grupos na página de Intervenções para acompanhar a eficácia.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <CardHeader>
        <CardTitle className="text-lg font-black text-slate-900 tracking-tight">
          Eficácia por Grupo de Intervenção
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Grupo</th>
                <th className="text-left py-3 px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Tipo</th>
                <th className="text-center py-3 px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Alunos</th>
                <th className="text-center py-3 px-4 text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">Melhorou</th>
                <th className="text-center py-3 px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Manteve</th>
                <th className="text-center py-3 px-4 text-[10px] font-extrabold text-red-500 uppercase tracking-widest">Piorou</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{group.name}</td>
                  <td className="py-3 px-4 text-slate-500">
                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {TYPE_LABELS[group.type] || group.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">{group.studentCount}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-black text-emerald-600">{group.percentImproved}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-slate-400">{group.percentUnchanged}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-black text-red-500">{group.percentWorsened}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
