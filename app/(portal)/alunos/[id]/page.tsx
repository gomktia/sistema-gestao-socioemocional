import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, GradeLevel as CoreGradeLevel } from '@/src/core/types';
import { calculateStudentProfile } from '@/src/core/logic/scoring';
import { StudentProfileView } from '@/components/psychologist/StudentProfileView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, UserCircle } from 'lucide-react';

export default async function AlunoDetalhePage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const student = await prisma.student.findUnique({
        where: { id: params.id },
        select: { id: true, name: true, grade: true, tenantId: true },
    });

    if (!student || student.tenantId !== user.tenantId) {
        notFound();
    }

    // Obter todas as avaliações (para dados longitudinais)
    const allAssessments = await prisma.assessment.findMany({
        where: { tenantId: user.tenantId, studentId: student.id },
        select: { type: true, rawAnswers: true, processedScores: true, screeningWindow: true, academicYear: true, appliedAt: true },
        orderBy: { appliedAt: 'asc' },
    });

    const viaAnswers = allAssessments.find(a => a.type === 'VIA_STRENGTHS')?.rawAnswers;
    const srssAnswers = allAssessments.find(a => a.type === 'SRSS_IE')?.rawAnswers;

    // Dados para o Gráfico de Evolução
    const evolutionData = allAssessments
        .filter(a => a.type === 'SRSS_IE')
        .map(a => ({
            window: a.screeningWindow === 'DIAGNOSTIC' ? 'Março' : a.screeningWindow === 'MONITORING' ? 'Junho' : 'Outubro',
            externalizing: (a.processedScores as any)?.externalizing?.score || 0,
            internalizing: (a.processedScores as any)?.internalizing?.score || 0,
        }));

    // Obter Indicadores EWS
    const ewsData = await prisma.schoolIndicator.findFirst({
        where: { tenantId: user.tenantId, studentId: student.id },
        orderBy: { quarter: 'desc' },
    });

    let ewsAlert = null;
    if (ewsData) {
        const { calculateEWSAlert } = await import('@/src/core/logic/ews');
        ewsAlert = calculateEWSAlert(
            ewsData.attendanceRate,
            ewsData.academicAverage,
            ewsData.previousAverage ?? undefined,
            ewsData.disciplinaryLogs
        );
    }

    let profile = null;
    if (viaAnswers && srssAnswers) {
        const gradeMap: Record<string, CoreGradeLevel> = {
            'ANO_1_EM': CoreGradeLevel.PRIMEIRO_ANO,
            'ANO_2_EM': CoreGradeLevel.SEGUNDO_ANO,
            'ANO_3_EM': CoreGradeLevel.TERCEIRO_ANO,
        };

        profile = calculateStudentProfile(
            viaAnswers as any,
            srssAnswers as any,
            gradeMap[student.grade] || CoreGradeLevel.PRIMEIRO_ANO
        );
    }

    // Obter Planos de Intervenção (PEI)
    const interventionPlans = await prisma.interventionPlan.findMany({
        where: { tenantId: user.tenantId, studentId: student.id },
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/alunos">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ChevronLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <UserCircle size={24} className="text-slate-400" />
                        {student.name}
                    </h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {student.grade === 'ANO_1_EM' ? '1ª Série EM' : student.grade === 'ANO_2_EM' ? '2ª Série EM' : '3ª Série EM'}
                    </p>
                </div>
            </div>

            {!profile ? (
                <div className="bg-slate-100 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                    <h3 className="text-slate-500 font-bold mb-2">Perfil Incompleto</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                        Este aluno precisa completar o questionário VIA e o professor deve realizar a triagem SRSS-IE para gerar o perfil integrado e intervenções.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <div className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase", viaAnswers ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500")}>
                            VIA {viaAnswers ? '✓' : 'Pendente'}
                        </div>
                        <div className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase", srssAnswers ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500")}>
                            SRSS-IE {srssAnswers ? '✓' : 'Pendente'}
                        </div>
                    </div>
                </div>
            ) : (
                <StudentProfileView
                    studentName={student.name}
                    grade={student.grade}
                    profile={profile}
                    evolutionData={evolutionData}
                    ewsAlert={ewsAlert}
                    interventionPlans={interventionPlans}
                />
            )}
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
