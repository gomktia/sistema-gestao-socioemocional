import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { ImpactSummary } from '@/components/management/ImpactSummary';
import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';
import Link from 'next/link';
import { getLabels } from '@/src/lib/utils/labels';

export const metadata = {
    title: 'Sumário Executivo | Gestão de Impacto',
};

export default async function GestaoPage() {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        redirect('/');
    }

    const labels = getLabels(user.organizationType);

    const totalStudents = await prisma.student.count({
        where: { tenantId: user.tenantId },
    });

    const assessments = await prisma.assessment.findMany({
        where: {
            tenantId: user.tenantId,
            type: 'SRSS_IE',
            academicYear: new Date().getFullYear(),
        },
        select: { screeningWindow: true, overallTier: true },
    });

    const windows = ['DIAGNOSTIC', 'MONITORING', 'FINAL'];
    const windowLabels: Record<string, string> = {
        'DIAGNOSTIC': 'Início (Diagnóstico)',
        'MONITORING': 'Meio (Monitoramento)',
        'FINAL': 'Fim (Final)'
    };

    const comparisonData = windows.map(w => {
        const windowAss = assessments.filter(a => a.screeningWindow === w);
        return {
            window: windowLabels[w],
            tier1: windowAss.filter(a => a.overallTier === 'TIER_1').length,
            tier2: windowAss.filter(a => a.overallTier === 'TIER_2').length,
            tier3: windowAss.filter(a => a.overallTier === 'TIER_3').length,
        };
    }).filter(wd => wd.tier1 + wd.tier2 + wd.tier3 > 0);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Gestão de Impacto
                        <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                            Live
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-1.5 text-sm">Sumário executivo de eficácia e monitoramento sociocomportamental.</p>
                </div>

                <div className="flex gap-3">
                    <Link href="/gestao/ews">
                        <Button variant="outline" className="border-slate-200 rounded-2xl active:scale-95 transition-all hover:border-indigo-200 hover:text-indigo-700">
                            <Database className="mr-2" size={16} strokeWidth={1.5} />
                            Indicadores EWS
                        </Button>
                    </Link>
                    <Button className="bg-slate-900 hover:bg-slate-800 rounded-2xl active:scale-95 transition-all shadow-lg">
                        <Download className="mr-2" size={16} strokeWidth={1.5} />
                        Exportar Relatório
                    </Button>
                </div>
            </div>

            <ImpactSummary
                totalStudents={totalStudents}
                comparisonData={comparisonData}
                labels={labels}
            />
        </div>
    );
}
