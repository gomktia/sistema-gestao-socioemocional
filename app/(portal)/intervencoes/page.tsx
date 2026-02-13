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
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Grupos de {labels.subjects}
                    </h1>
                    <p className="text-slate-500 mt-1.5 text-sm">Gestão de grupos focais para {labels.subjects.toLowerCase()} de risco moderado.</p>
                </div>

                <CreateGroupButton students={students} labels={labels} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <Card key={group.id} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/10 transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                        <CardHeader className="bg-slate-50/30 pb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                    {TYPE_LABELS[group.type] || group.type}
                                </span>
                                <div className="flex items-center gap-1">
                                    <EditGroupButton group={group} students={students} labels={labels} />
                                    <DeleteGroupButton group={group} labels={labels} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-black text-slate-900 tracking-tight">{group.name}</CardTitle>
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase shrink-0">
                                    <Calendar size={12} strokeWidth={1.5} />
                                    {new Date(group.startDate).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            {group.description && (
                                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{group.description}</p>
                            )}
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs text-slate-500 font-extrabold uppercase tracking-widest">
                                    <span>{labels.subjects} no Grupo</span>
                                    <span className="bg-slate-50 px-2.5 py-1 rounded-full text-slate-600 font-black">
                                        {group.students?.length || 0}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {(group.students || []).slice(0, 4).map((student: any) => (
                                        <div key={student.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100/50 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors">
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
                    <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <Users2 className="text-slate-200 mb-4" size={64} strokeWidth={1.5} />
                        <h3 className="text-slate-400 font-black text-xl uppercase tracking-tight">Nenhum grupo ativo</h3>
                        <p className="text-slate-400 text-sm max-w-xs mt-2">
                            Comece criando uma oficina ou grupo de foco para {labels.subjects.toLowerCase()}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
