import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { getInterventionGroups, getStudentsForSelection } from '@/app/actions/interventions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users2, Calendar } from 'lucide-react';
import { TierBadge } from '@/components/domain/TierBadge';
import {
    CreateGroupButton,
    EditGroupButton,
    DeleteGroupButton,
} from '@/components/interventions/InterventionGroupActions';
import { getLabels } from '@/src/lib/utils/labels';

export const metadata = {
    title: 'Grupos de Intervenção | Camada 2',
};

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

export default async function IntervencoesPage() {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const labels = getLabels(user.organizationType);

    const [groups, students] = await Promise.all([
        getInterventionGroups(),
        getStudentsForSelection(),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Grupos de {labels.subjects}
                    </h1>
                    <p className="text-slate-500 mt-1">Gestão de grupos focais para {labels.subjects.toLowerCase()} de risco moderado.</p>
                </div>

                <CreateGroupButton students={students} labels={labels} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <Card key={group.id} className="border-slate-200 hover:border-indigo-200 transition-all group overflow-hidden">
                        <CardHeader className="bg-slate-50/50 pb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                    {TYPE_LABELS[group.type] || group.type}
                                </span>
                                <div className="flex items-center gap-1">
                                    <EditGroupButton group={group} students={students} labels={labels} />
                                    <DeleteGroupButton group={group} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-black text-slate-800">{group.name}</CardTitle>
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase shrink-0">
                                    <Calendar size={12} />
                                    {new Date(group.startDate).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            {group.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{group.description}</p>
                            )}
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                                    <span>{labels.subjects} no Grupo</span>
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-black">
                                        {group.students?.length || 0}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {(group.students || []).slice(0, 4).map((student: any) => (
                                        <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-700">
                                            <span className="truncate max-w-[150px]">{student.name}</span>
                                            <TierBadge tier={student.overallTier} />
                                        </div>
                                    ))}
                                    {(group.students?.length || 0) > 4 && (
                                        <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest pt-1">
                                            + {group.students.length - 4} outros {labels.subjects.toLowerCase()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {groups.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
                        <Users2 className="text-slate-200 mb-4" size={64} />
                        <h3 className="text-slate-400 font-black text-xl uppercase tracking-tighter">Nenhum grupo ativo</h3>
                        <p className="text-slate-400 text-sm max-w-xs mt-2">
                            Comece criando uma oficina ou grupo de foco para {labels.subjects.toLowerCase()}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
