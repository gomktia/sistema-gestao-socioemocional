'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { calculateStudentProfile, calculateStrengthScores, calculateRiskScores } from '@/src/core/logic/scoring';
import { GradeLevel, VIARawAnswers, SRSSRawAnswers, UserRole } from '@/src/core/types';
import { revalidatePath } from 'next/cache';

/**
 * Salva as respostas do questionário VIA.
 * Se todas as 71 perguntas estiverem respondidas, calcula os scores e as forças de assinatura.
 */
export async function saveVIAAnswers(answers: VIARawAnswers) {
    const user = await getCurrentUser();
    if (!user || user.role !== UserRole.STUDENT || !user.studentId) {
        return { error: 'Não autorizado ou perfil de aluno não encontrado.' };
    }

    const supabase = await createClient();

    // Verificar quantidade de respostas
    const answeredCount = Object.keys(answers).length;
    const isComplete = answeredCount >= 71;

    let processedScores = null;
    let signatureStrengths = null;

    if (isComplete) {
        // Calcular scores usando o motor de lógica core
        const strengthScores = calculateStrengthScores(answers);
        const sorted = [...strengthScores].sort((a, b) => b.normalizedScore - a.normalizedScore);

        signatureStrengths = sorted.slice(0, 5);
        processedScores = {
            strengths: strengthScores,
            signatureTop5: signatureStrengths,
            developmentAreas: sorted.slice(-5).reverse(),
        };
    }

    // UPSERT na tabela de assessments
    const { error } = await supabase.from('assessments').upsert({
        tenantId: user.tenantId,
        studentId: user.studentId,
        type: 'VIA_STRENGTHS',
        screeningWindow: 'DIAGNOSTIC',
        academicYear: new Date().getFullYear(),
        rawAnswers: answers,
        processedScores: processedScores,
        appliedAt: new Date().toISOString(),
    }, {
        onConflict: 'tenantId,studentId,type,screeningWindow,academicYear',
    });

    if (error) {
        console.error('Error saving VIA:', error.message);
        return { error: 'Erro ao salvar o questionário.' };
    }

    revalidatePath('/minhas-forcas');
    revalidatePath('/questionario');

    return {
        success: true,
        complete: isComplete,
        signatureStrengths: signatureStrengths
    };
}

/**
 * Obtém os resultados de força do aluno atual.
 */
export async function getMyStrengths() {
    const user = await getCurrentUser();
    if (!user || !user.studentId) return null;

    const supabase = await createClient();
    const { data } = await supabase
        .from('assessments')
        .select('processedScores, appliedAt')
        .eq('studentId', user.studentId)
        .eq('type', 'VIA_STRENGTHS')
        .order('appliedAt', { ascending: false })
        .limit(1)
        .single();

    return data;
}

/**
 * Salva a triagem SRSS-IE realizada pelo professor.
 */
export async function saveSRSSScreening(studentId: string, answers: SRSSRawAnswers) {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.TEACHER, UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) {
        return { error: 'Não autorizado.' };
    }

    const supabase = await createClient();

    // Obter dados do aluno para garantir que pertence ao mesmo tenant
    const { data: student } = await supabase
        .from('students')
        .select('tenantId, grade')
        .eq('id', studentId)
        .single();

    if (!student || student.tenantId !== user.tenantId) {
        return { error: 'Aluno não encontrado ou acesso negado.' };
    }

    // Calcular risco
    const risk = calculateRiskScores(answers);
    const overallTier = risk.externalizing.tier; // Simplificação

    const { error } = await supabase.from('assessments').upsert({
        tenantId: user.tenantId,
        studentId,
        type: 'SRSS_IE',
        screeningWindow: 'DIAGNOSTIC',
        academicYear: new Date().getFullYear(),
        screeningTeacherId: user.id,
        rawAnswers: answers,
        processedScores: risk,
        overallTier: overallTier,
        externalizingScore: risk.externalizing.score,
        internalizingScore: risk.internalizing.score,
        appliedAt: new Date().toISOString(),
    });

    if (error) return { error: 'Erro ao salvar triagem.' };

    // Gatilho de Notificação Crítica se for Tier 3
    if (overallTier === 'TIER_3') {
        const { notifyCriticalRisk } = await import('@/lib/notifications');
        // Usar o nome do aluno que já buscamos acima
        const { data: studentFull } = await supabase.from('students').select('name').eq('id', studentId).single();
        await notifyCriticalRisk(user.tenantId, studentId, studentFull?.name || 'Aluno');
    }

    revalidatePath('/turma');
    return { success: true, risk };
}
