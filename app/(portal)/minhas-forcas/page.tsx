import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { getMyStrengths } from '@/app/actions/assessment';
import { StrengthsView } from '@/components/student/StrengthsView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { DownloadReportButton } from '@/components/reports/DownloadReportButton';
import { STRENGTH_DESCRIPTIONS } from '@/src/core/content/strength-descriptions';

export const metadata = {
    title: 'Minhas Forças de Caráter',
};

export default async function MinhasForcasPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== UserRole.STUDENT) {
        redirect('/');
    }

    const assessment = await getMyStrengths();

    // Se não houver avaliação processada, redirecionar para o questionário
    if (!assessment || !assessment.processedScores) {
        redirect('/questionario');
    }

    const scores = assessment.processedScores as {
        strengths: any[];
        signatureTop5: any[];
    };

    // Preparar dados para o PDF
    const strengthsForPdf = scores.signatureTop5.map(s => ({
        label: s.label,
        virtue: s.virtue,
        description: STRENGTH_DESCRIPTIONS[s.strength]?.description || '',
        tip: STRENGTH_DESCRIPTIONS[s.strength]?.tip || '',
    }));

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Suas Forças</h1>
                    <p className="text-slate-500 mt-1">Conhecer a si mesmo é o primeiro passo para o sucesso.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/questionario">
                        <Button variant="outline" size="sm" className="text-slate-600">
                            Refazer Mapeamento
                        </Button>
                    </Link>
                    <DownloadReportButton
                        studentName={user.name}
                        grade="Geral"
                        signatureStrengths={strengthsForPdf}
                    />
                </div>
            </div>

            <StrengthsView
                signatureStrengths={scores.signatureTop5}
                allStrengths={scores.strengths}
            />
        </div>
    );
}
