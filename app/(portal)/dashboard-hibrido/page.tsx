
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, IEAAResult } from '@/src/core/types';
import { redirect } from 'next/navigation';
import { BrainCircuit, BookOpen } from 'lucide-react';
import { HybridDashboardView } from '@/components/dashboard/HybridDashboardView';
import { IEAADashboardView } from '@/components/dashboard/IEAADashboardView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
    title: 'Análise Híbrida | Triavium',
};

export default async function HybridDashboardPage() {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    // Fetch all students and their assessments
    const students = await prisma.student.findMany({
        where: { tenantId: user.tenantId },
        select: {
            id: true,
            name: true,
            grade: true,
            assessments: {
                select: {
                    type: true,
                    processedScores: true
                }
            }
        }
    });

    type StudentEntry = (typeof students)[number];
    type AssessmentEntry = StudentEntry['assessments'][number];

    // Process data for Big Five / SRSS analysis
    const analysisData = students.map((student: StudentEntry) => {
        const bigFive = student.assessments.find((a: AssessmentEntry) => a.type === 'BIG_FIVE')?.processedScores as any;
        const srss = student.assessments.find((a: AssessmentEntry) => a.type === 'SRSS_IE')?.processedScores as any;

        if (!bigFive || !srss) return null;

        // Big Five Scores
        const stability = bigFive.find((s: any) => s.domain === 'ESTABILIDADE')?.score || 0;
        const conscientiousness = bigFive.find((s: any) => s.domain === 'CONSCIENCIOSIDADE')?.score || 0;
        const agreeableness = bigFive.find((s: any) => s.domain === 'AMABILIDADE')?.score || 0;

        // SRSS Scores
        const internalizing = srss.internalizing?.score || 0;
        const externalizing = srss.externalizing?.score || 0;

        return {
            id: student.id,
            name: student.name,
            stability,
            conscientiousness,
            internalizing,
            externalizing,
            riskTier: Math.max(
                srss.internalizing?.tier === 'TIER_3' ? 3 : srss.internalizing?.tier === 'TIER_2' ? 2 : 1,
                srss.externalizing?.tier === 'TIER_3' ? 3 : srss.externalizing?.tier === 'TIER_2' ? 2 : 1
            )
        };
    }).filter(Boolean);

    // Process data for IEAA analysis
    const ieaaData = students.map((student: StudentEntry) => {
        const ieaa = student.assessments.find((a: AssessmentEntry) => a.type === 'IEAA')?.processedScores as IEAAResult | undefined;
        if (!ieaa) return null;

        return {
            id: student.id,
            name: student.name,
            result: ieaa,
        };
    }).filter(Boolean) as { id: string; name: string; result: IEAAResult }[];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BrainCircuit size={32} className="text-violet-600" />
                        Análise Híbrida de Dados
                    </h1>
                    <p className="text-slate-500 font-medium">Correlação entre múltiplas dimensões de avaliação.</p>
                </div>
            </div>

            <Tabs defaultValue="personality" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                    <TabsTrigger value="personality" className="flex items-center gap-2">
                        <BrainCircuit size={16} />
                        Personalidade x Risco
                    </TabsTrigger>
                    <TabsTrigger value="ieaa" className="flex items-center gap-2">
                        <BookOpen size={16} />
                        Autorregulação (IEAA)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="personality">
                    <HybridDashboardView data={analysisData} />
                </TabsContent>

                <TabsContent value="ieaa">
                    <IEAADashboardView data={ieaaData} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
