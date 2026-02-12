'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getLabels } from '@/src/lib/utils/labels';
import { UserRole } from '@/src/core/types';
import * as XLSX from 'xlsx';

export async function generateExcelReport() {
    const user = await getCurrentUser();
    if (!user) return { error: 'Não autorizado' };

    const labels = getLabels(user.organizationType);

    // 1. Fetch Students with their latest data
    const students = await prisma.student.findMany({
        where: {
            tenantId: user.tenantId,
            isActive: true,
        },
        include: {
            classroom: true,
            assessments: {
                where: {
                    type: { in: ['SRSS_IE', 'VIA_STRENGTHS'] },
                    // Get latest
                },
                orderBy: { appliedAt: 'desc' },
            },
            schoolIndicators: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { name: 'asc' }
    });

    // 2. Transform Data
    const data = students.map(student => {
        // Find latest SRSS-IE
        const srss = student.assessments.find(a => a.type === 'SRSS_IE');
        const via = student.assessments.find(a => a.type === 'VIA_STRENGTHS');
        const indicators = student.schoolIndicators[0];

        // Process Strengths
        let strengths = '';
        if (via && via.processedScores) {
            const scores = via.processedScores as any;
            if (scores.signatureTop5 && Array.isArray(scores.signatureTop5)) {
                strengths = scores.signatureTop5.map((s: any) => s.strength).join(', ');
            }
        }

        return {
            [labels.subject]: student.name,
            'Turma': student.classroom?.name || 'N/A',
            'Nível de Risco': srss?.overallTier?.replace('TIER_', 'Nível ') || 'Não avaliado',
            [`% Faltas`]: indicators ? `${indicators.attendanceRate}%` : 'N/A',
            'Forças de Assinatura': strengths || 'Pendente',
            // Add a status column for better readability
            'Status': srss?.overallTier === 'TIER_3' ? 'CRÍTICO' :
                srss?.overallTier === 'TIER_2' ? 'ATENÇÃO' :
                    srss?.overallTier === 'TIER_1' ? 'NORMAL' : 'PENDENTE'
        };
    });

    // 3. Create Workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Relatório ${labels.subjects}`);

    // 4. Generate Buffer
    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // 5. Return Base64
    return {
        success: true,
        base64: buf.toString('base64'),
        filename: `relatorio_${labels.subjects.toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`
    };
}

export async function getRiskEvolutionData() {
    const user = await getCurrentUser();
    if (!user) return [];

    const windows = ['DIAGNOSTIC', 'MONITORING', 'FINAL'];
    const windowLabels: Record<string, string> = {
        'DIAGNOSTIC': 'Março',
        'MONITORING': 'Junho',
        'FINAL': 'Outubro'
    };

    // We need to count tiers for each window
    // Since we store all assessments, we can group by window and tier

    const assessments = await prisma.assessment.groupBy({
        by: ['screeningWindow', 'overallTier'],
        where: {
            tenantId: user.tenantId,
            type: 'SRSS_IE',
            academicYear: new Date().getFullYear(),
            overallTier: { not: null }
        },
        _count: {
            overallTier: true
        }
    });

    // Process into chart format
    // [{ name: 'Março', Tier1: 10, Tier2: 5, Tier3: 2 }, ...]

    return windows.map(w => {
        const tier1 = assessments.find(a => a.screeningWindow === w && a.overallTier === 'TIER_1')?._count.overallTier || 0;
        const tier2 = assessments.find(a => a.screeningWindow === w && a.overallTier === 'TIER_2')?._count.overallTier || 0;
        const tier3 = assessments.find(a => a.screeningWindow === w && a.overallTier === 'TIER_3')?._count.overallTier || 0;

        // Only return if there is data for this window (optional, but good for cleanliness)
        // Or return all windows to show progression even if empty (0)
        return {
            name: windowLabels[w],
            'Baixo Risco': tier1,
            'Risco Moderado': tier2,
            'Alto Risco': tier3
        };
    });
}

/**
 * Obtém os dados completos do aluno para o relatório.
 */
export async function getStudentForReport(studentId: string) {
    const user = await getCurrentUser();
    const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

    if (!user || !allowedRoles.includes(user.role)) return null;

    const student = await prisma.student.findFirst({
        where: { id: studentId, tenantId: user.tenantId },
        include: {
            classroom: true,
            assessments: {
                where: { type: { in: ['SRSS_IE', 'VIA_STRENGTHS'] } },
                orderBy: { appliedAt: 'desc' },
                include: { screeningTeacher: true }
            },
            schoolIndicators: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    return student;
}

/**
 * Gera um texto rascunho para o laudo com base na inteligência do sistema.
 */
export async function generateDraftOpinion(student: any) {
    const labels = getLabels(student.tenant?.organizationType);
    const isEducational = student.tenant?.organizationType === 'EDUCATIONAL';

    // Find latest SRSS
    const srss = student.assessments.find((a: any) => a.type === 'SRSS_IE');
    const via = student.assessments.find((a: any) => a.type === 'VIA_STRENGTHS');
    const indicator = student.schoolIndicators[0];

    const riskLevel = srss?.overallTier === 'TIER_3' ? 'Alto Risco' :
        srss?.overallTier === 'TIER_2' ? 'Risco Moderado' : 'Baixo Risco';

    let strengthsText = 'ainda não foram mapeadas';
    if (via && via.processedScores) {
        const scores = via.processedScores as any;
        if (scores.signatureTop5) {
            strengthsText = scores.signatureTop5.map((s: any) => s.strength).join(', ');
        }
    }

    const attendanceText = indicator ?
        `apresenta uma taxa de frequência de ${indicator.attendanceRate}%, o que ${indicator.attendanceRate < 85 ? 'requer atenção' : 'é satisfatório'}` :
        'não possui dados recentes de frequência';

    let bnccContext = '';
    if (isEducational) {
        bnccContext = `
Em consonância com as Competências Gerais da BNCC, especificamente a Competência 8 (Autoconhecimento e Autocuidado) e 9 (Empatia e Cooperação), observamos que o aluno demonstra potencial para desenvolver maior resiliência emocional e habilidades de convivência.
        `.trim();
    }

    const draft = `
PARECER TÉCNICO SOCIOEMOCIONAL

1. ANÁLISE DE PERFIL
O ${labels.subject.toLowerCase()} ${student.name}, matriculado na turma ${student.classroom?.name || 'Não informada'}, foi avaliado no contexto do Programa de Desenvolvimento Socioemocional. Atualmente, encontra-se classificado no nível de ${riskLevel} para comportamentos internalizantes e externalizantes.

2. PONTOS FORTES
Através da avaliação VIA de Forças de Caráter, identificamos que as forças de assinatura do ${labels.subject.toLowerCase()} são: ${strengthsText}. Estas forças representam recursos internos valiosos que podem ser alavancados para mitigar riscos identificados.

3. INDICADORES ESCOLARES
No que tange ao desempenho acadêmico e comportamental, o ${labels.subject.toLowerCase()} ${attendanceText}.

${isEducational ? '4. CONTEXTO PEDAGÓGICO (BNCC)\n' + bnccContext + '\n\n' : ''}5. RECOMENDAÇÕES E ENCAMINHAMENTOS
Considerando a análise integrada dos dados, recomenda-se a continuidade do monitoramento e a inclusão do ${labels.subject.toLowerCase()} em grupos focais voltados para Regulação Emocional e Habilidades Sociais. É fundamental o envolvimento da família para reforçar as estratégias trabalhadas no ambiente ${labels.organization.toLowerCase()}.

Este parecer é confidencial e deve ser utilizado exclusivamente para fins pedagógicos e de suporte ao desenvolvimento do ${labels.subject.toLowerCase()}.
`.trim();

    return draft;
}

/**
 * Salva o parecer no histórico de intervenções.
 */
export async function saveProfessionalOpinion(studentId: string, text: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Não autorizado.' };

    try {
        // Encontrar tier atual
        const assessment = await prisma.assessment.findFirst({
            where: {
                studentId,
                type: 'SRSS_IE',
                academicYear: new Date().getFullYear()
            },
            orderBy: { appliedAt: 'desc' }
        });

        const tier = assessment?.overallTier || 'TIER_1';

        await prisma.interventionLog.create({
            data: {
                tenantId: user.tenantId,
                studentId,
                authorId: user.id,
                type: 'INDIVIDUAL_PLAN',
                status: 'COMPLETED',
                tier,
                title: 'Emissão de Laudo Técnico',
                description: text,
                observations: 'Laudo gerado via sistema.',
                startDate: new Date(),
            }
        });

        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Erro ao salvar histórico.' };
    }
}
