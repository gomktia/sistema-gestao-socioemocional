import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { getMyStrengths } from '@/app/actions/assessment';
import { StrengthsView } from '@/components/student/StrengthsView';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { DownloadReportButton } from '@/components/reports/DownloadReportButton';
import { STRENGTH_DESCRIPTIONS } from '@/src/core/content/strength-descriptions';
import { DataPortabilityCard } from '@/components/legal/DataPortabilityCard';

export const metadata = {
    title: 'Minhas Forças de Caráter',
};

export default async function MinhasForcasPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== UserRole.STUDENT) {
        redirect('/');
    }

    if (!user.studentId) {
        return (
            <div className="p-8 text-center bg-rose-50 border border-rose-100 rounded-3xl">
                <p className="text-rose-600 font-bold">Erro: Sua conta de aluno não está vinculada a um registro de matrícula.</p>
                <p className="text-slate-500 text-sm mt-2">Por favor, contate o administrador do sistema.</p>
            </div>
        );
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

    // Obter Plano de Desenvolvimento (Intervenções que o psicólogo liberou)
    const developmentPlan = await prisma.interventionPlan.findMany({
        where: { tenantId: user.tenantId, studentId: user.studentId },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
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

            {/* Seção de Plano de Desenvolvimento */}
            <section className="mt-12 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-100">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Plano de Desenvolvimento</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Orientações da Equipe Psicopedagógica</p>
                    </div>
                </div>

                {developmentPlan.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {developmentPlan.map((plan) => (
                            <Card key={plan.id} className="border-none shadow-xl shadow-slate-100 border-l-4 border-violet-500 overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest mb-1">Ações Estratégicas</p>
                                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                {plan.strategicActions}
                                            </p>
                                        </div>
                                        {plan.expectedOutcome && (
                                            <div className="pt-4 border-t border-slate-50">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Objetivo</p>
                                                <p className="text-xs text-slate-500 italic">
                                                    {plan.expectedOutcome}
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-[9px] font-bold text-slate-400">
                                                Atualizado em: {new Date(plan.updatedAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-[9px] font-black bg-violet-50 text-violet-600 px-2 py-1 rounded-full uppercase">
                                                {plan.status}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 text-sm font-medium">
                            Seu plano de desenvolvimento personalizado está sendo preparado pela nossa equipe.
                            Fique atento às próximas atualizações!
                        </p>
                    </div>
                )}
            </section>

            <DataPortabilityCard studentId={user.studentId} studentName={user.name} />
        </div>
    );
}
