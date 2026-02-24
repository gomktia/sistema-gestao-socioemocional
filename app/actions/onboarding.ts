'use server';

import { getLabels } from '@/src/lib/utils/labels';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { OrganizationType, UserRole } from '@/src/core/types';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/mail';

const MANAGER_ROLES = [UserRole.MANAGER, UserRole.ADMIN];

interface WelcomeEmailProps {
    userEmail: string;
    userName: string;
    organizationName: string;
    organizationType: OrganizationType;
}

/**
 * Dispara o e-mail de Boas-vindas adaptado ao nicho do cliente
 */
export async function sendWelcomeEmail({
    userEmail,
    userName,
    organizationName,
    organizationType
}: WelcomeEmailProps) {
    const labels = getLabels(organizationType);

    return sendEmail({
        to: userEmail,
        subject: `Bem-vindo à nossa plataforma, ${userName}!`,
        html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Olá, ${userName}!</h2>
          <p>É um prazer ter a <strong>${organizationName}</strong> connosco.</p>
          <p>O seu ambiente de gestão já está configurado para monitorizar os seus <strong>${labels.subjects.toLowerCase()}</strong> com segurança e inteligência.</p>
          <hr />
          <h3>Próximos Passos:</h3>
          <ul>
            <li><strong>Aceda ao Painel:</strong> Utilize as suas credenciais para entrar no sistema.</li>
            <li><strong>Importe os seus ${labels.subjects}:</strong> Comece a registar o seu efetivo para iniciar as triagens.</li>
            <li><strong>Gere Relatórios:</strong> Assim que os dados forem inseridos, poderá gerar laudos profissionais em PDF.</li>
          </ul>
          <p>Estamos aqui para devolver o seu tempo de gestão e focar no que importa: as pessoas.</p>
          <p>Abraço,<br />Equipe Triavium</p>
        </div>
      `,
    });
}

/**
 * Dispara a dica sobre o Laudo IA (estratégia de retenção)
 */
export async function sendIADraftTipEmail(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { tenant: true }
    });

    if (!user || !user.tenant) return;

    const labels = getLabels(user.tenant.organizationType as OrganizationType);

    return sendEmail({
        to: user.email,
        subject: 'Dica Pro: Como poupar 80% do tempo nos laudos',
        html: `
        <div style="font-family: sans-serif;">
          <h2>Dica de Produtividade: Laudos com IA</h2>
          <p>Olá, ${user.name},</p>
          <p>Sabia que já pode gerar um rascunho profissional para o seu <strong>${labels.subject}</strong> em segundos?</p>
          <p>O nosso sistema analisa as Forças de Caráter e o Risco de cada membro e prepara uma base sólida para o seu parecer final.</p>
          <p><strong>Aceda ao perfil de um ${labels.subject.toLowerCase()} e clique em "Gerar Rascunho IA" para testar agora!</strong></p>
        </div>
      `,
    });
}

export async function sendRiskAlertEmail(managerEmail: string, studentName: string, tier: string, link: string) {
    return sendEmail({
        to: managerEmail,
        subject: `ALERTA CRÍTICO: ${studentName}`,
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h2 style="color: #e11d48;">Atenção: Risco Identificado</h2>
                <p>O sistema identificou métricas preocupantes para o aluno <strong>${studentName}</strong>.</p>
                <p><strong>Classificação Atual:</strong> ${tier}</p>
                <p>Recomendamos uma intervenção imediata.</p>
                <a href="${link}" style="background-color: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Laudo Completo</a>
            </div>
        `,
    });
}

export async function sendPlanUpgradeEmail(adminEmail: string, currentUsage: number) {
    return sendEmail({
        to: adminEmail,
        subject: 'Potencialize sua Gestão com o Plano Sovereign',
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h1>Seus Resultados Estão Crescendo!</h1>
                <p>Notamos que sua organização já gerou mais de <strong>${currentUsage} relatórios</strong>.</p>
                <p>Você está pronto para o próximo nível? Conheça o plano Sovereign e tenha acesso a análises preditivas avançadas.</p>
            </div>
        `,
    });
}

interface MonthlyReportProps {
    directorEmail: string;
    schoolName: string;
    criticalCount: number;
    improvedCount: number;
    month: string;
}

/**
 * Envia o Relatório Gerencial Mensal para a Direção
 */
export async function sendMonthlyDirectionReport({ directorEmail, schoolName, criticalCount, improvedCount, month }: MonthlyReportProps) {
    return sendEmail({
        to: directorEmail,
        subject: `Relatório de Impacto Socioemocional - ${month}`,
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px;">
                <h2 style="color: #4f46e5;">Relatório Mensal: ${schoolName}</h2>
                <p>Olá, Direção.</p>
                <p>Este é o resumo do impacto das intervenções socioemocionais realizadas neste mês.</p>

                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <div style="margin-bottom: 15px;">
                        <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Alunos em Risco Crítico Identificados</span>
                        <span style="font-size: 24px; font-weight: bold; color: #e11d48;">${criticalCount}</span>
                    </div>
                    <div>
                        <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Alunos que Saíram do Risco (Evolução Positiva)</span>
                        <span style="font-size: 24px; font-weight: bold; color: #10b981;">${improvedCount}</span>
                    </div>
                </div>

                <p>Ação Recomendada: Agendar reunião com a equipe de orientação para analisar os casos que apresentaram melhora e replicar as práticas de sucesso.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #94a3b8;">Triavium - Dados que transformam vidas.</p>
            </div>
        `,
    });
}

// ============================================================
// WELCOME WIZARD ACTIONS
// ============================================================

export async function updateTenantInfo(data: {
    name: string;
    phone?: string;
    email?: string;
    city?: string;
    state?: string;
}) {
    const user = await getCurrentUser();
    if (!user || !MANAGER_ROLES.includes(user.role)) return { error: 'Não autorizado.' };

    await prisma.tenant.update({
        where: { id: user.tenantId },
        data: {
            name: data.name,
            phone: data.phone || null,
            email: data.email || null,
            city: data.city || null,
            state: data.state || null,
        },
    });

    return { success: true };
}

export async function createFirstClassroom(data: {
    name: string;
    grade: string;
    shift?: string;
}) {
    const user = await getCurrentUser();
    if (!user || !MANAGER_ROLES.includes(user.role)) return { error: 'Não autorizado.' };

    try {
        await prisma.classroom.create({
            data: {
                tenantId: user.tenantId,
                name: data.name,
                grade: data.grade as any,
                year: new Date().getFullYear(),
                shift: data.shift || null,
            },
        });
        return { success: true };
    } catch (e: any) {
        if (e.code === 'P2002') return { error: 'Turma com este nome já existe.' };
        return { error: 'Erro ao criar turma.' };
    }
}

export async function inviteTeamMember(data: {
    name: string;
    email: string;
    role: string;
}) {
    const user = await getCurrentUser();
    if (!user || !MANAGER_ROLES.includes(user.role)) return { error: 'Não autorizado.' };

    const existing = await prisma.user.findFirst({
        where: { tenantId: user.tenantId, email: data.email },
    });
    if (existing) return { error: 'Este email já está cadastrado.' };

    try {
        await prisma.user.create({
            data: {
                tenantId: user.tenantId,
                name: data.name,
                email: data.email,
                role: data.role as any,
            },
        });
        return { success: true };
    } catch {
        return { error: 'Erro ao convidar membro.' };
    }
}

export async function completeOnboarding() {
    const user = await getCurrentUser();
    if (!user || !MANAGER_ROLES.includes(user.role)) return { error: 'Não autorizado.' };

    await prisma.tenant.update({
        where: { id: user.tenantId },
        data: { onboardingCompleted: true },
    });

    revalidatePath('/');
    return { success: true };
}
