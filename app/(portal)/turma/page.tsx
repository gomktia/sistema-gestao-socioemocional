import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { ClassDashboard } from '@/components/teacher/ClassDashboard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { getLabels } from '@/src/lib/utils/labels';

export const metadata = {
    title: 'Minha Turma | Dashboard',
};

export default async function TurmaPage() {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.TEACHER, UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const students = await prisma.student.findMany({
        where: { tenantId: user.tenantId, isActive: true },
        select: { id: true, name: true, grade: true },
        orderBy: { name: 'asc' },
    });

    const assessments = await prisma.assessment.findMany({
        where: {
            tenantId: user.tenantId,
            type: 'SRSS_IE',
            academicYear: new Date().getFullYear(),
        },
        select: { studentId: true, overallTier: true, rawAnswers: true },
    });

    const assessmentMap = new Map(assessments.map(a => [a.studentId, a]));

    const { generateGradeAlerts } = await import('@/src/core/logic/scoring');
    const { GradeLevel: CoreGradeLevel } = await import('@/src/core/types');

    const gradeMap: Record<string, any> = {
        'ANO_1_EM': CoreGradeLevel.PRIMEIRO_ANO,
        'ANO_2_EM': CoreGradeLevel.SEGUNDO_ANO,
        'ANO_3_EM': CoreGradeLevel.TERCEIRO_ANO,
    };

    const studentsWithRisk = students.map(s => {
        const a = assessmentMap.get(s.id);
        const coreGrade = gradeMap[s.grade] || CoreGradeLevel.PRIMEIRO_ANO;

        const alertsList = a?.rawAnswers
            ? generateGradeAlerts(a.rawAnswers as any, coreGrade)
            : [];

        return {
            id: s.id,
            name: s.name,
            overallTier: a?.overallTier || 'TIER_1',
            alerts: alertsList.length,
            grade: s.grade
        };
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mapa de Risco</h1>
                    <p className="text-slate-500 mt-1.5 text-sm">Visão geral do clima socioemocional da turma.</p>
                </div>

                <Link href="/turma/triagem">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 rounded-2xl active:scale-95 transition-all">
                        <ClipboardList className="mr-2" size={18} strokeWidth={1.5} />
                        Atualizar Triagem
                    </Button>
                </Link>
            </div>

            <ClassDashboard students={studentsWithRisk} labels={getLabels(user.organizationType)} />
        </div>
    );
}
