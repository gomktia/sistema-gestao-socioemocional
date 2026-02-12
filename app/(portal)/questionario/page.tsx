import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { createClient } from '@/lib/supabase/server';
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard';
import { VIARawAnswers } from '@/src/core/types';

export const metadata = {
    title: 'Questionário Socioemocional | VIA',
};

export default async function QuestionarioPage() {
    const user = await getCurrentUser();

    // Apenas alunos podem responder o questionário VIA
    if (!user || user.role !== UserRole.STUDENT) {
        redirect('/');
    }

    const supabase = await createClient();

    // Carregar respostas existentes, se houver
    const { data: assessment } = await supabase
        .from('assessments')
        .select('rawAnswers, processedScores')
        .eq('studentId', user.studentId)
        .eq('type', 'VIA_STRENGTHS')
        .order('appliedAt', { ascending: false })
        .limit(1)
        .single();

    // Se já estiver completado, podemos redirecionar para os resultados ou permitir editar.
    // O plano sugere que se já houver resultados, mostramos os resultados.
    if (assessment?.processedScores) {
        redirect('/minhas-forcas');
    }

    const initialAnswers = (assessment?.rawAnswers as VIARawAnswers) || {};

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Mapeamento de Forças</h1>
                <p className="text-slate-500">Este questionário nos ajudará a entender seus talentos e pontos fortes.</p>
            </div>

            <QuestionnaireWizard initialAnswers={initialAnswers} />
        </div>
    );
}
