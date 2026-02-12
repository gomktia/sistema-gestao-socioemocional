'use server';

import { Resend } from 'resend';
import { getLabels } from '@/src/lib/utils/labels';
import { prisma } from '@/lib/prisma';
import { OrganizationType } from '@/src/core/types';

// Helper to get Resend instance safely
const getResend = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('RESEND_API_KEY is not set. Emails will be logged to console only.');
        return null;
    }
    return new Resend(apiKey);
};

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
    const resend = getResend();
    const labels = getLabels(organizationType);

    if (!resend) {
        console.log(`[MOCK EMAIL] Welcome to ${userEmail} (${userName}) at ${organizationName}`);
        return { success: true, mock: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'SocioIntelligence <onboarding@seudominio.com.br>',
            to: [userEmail],
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
          <p>Abraço,<br />Equipe SocioIntelligence</p>
        </div>
      `,
        });

        if (error) throw new Error(error.message);
        return { success: true, data };
    } catch (err: any) {
        console.error('Erro ao enviar e-mail de boas-vindas:', err);
        return { success: false, error: 'Falha no envio do e-mail.' };
    }
}

/**
 * Dispara a dica sobre o Laudo IA (estratégia de retenção)
 */
export async function sendIADraftTipEmail(userId: string) {
    const resend = getResend();

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { tenant: true }
    });

    if (!user || !user.tenant) return;

    const labels = getLabels(user.tenant.organizationType as OrganizationType);

    if (!resend) {
        console.log(`[MOCK EMAIL] IA Tip to ${user.email} (${user.name})`);
        return { success: true, mock: true };
    }

    try {
        await resend.emails.send({
            from: 'SocioIntelligence <suporte@seudominio.com.br>',
            to: [user.email],
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
        return { success: true };
    } catch (err) {
        console.error('Erro ao enviar dica de IA:', err);
        return { success: false };
    }
}

export async function sendRiskAlertEmail(managerEmail: string, studentName: string, tier: string, link: string) {
    const resend = getResend();

    if (!resend) {
        console.log(`[MOCK EMAIL] Risk Alert for ${studentName} to ${managerEmail}`);
        return { success: true, mock: true };
    }

    try {
        await resend.emails.send({
            from: 'SocioIntelligence Alertas <alerts@seudominio.com.br>',
            to: [managerEmail],
            subject: `ALERTA CRÍTICO: ${studentName}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2 style="color: #e11d48;">Atenção: Risco Identificado</h2>
                    <p>O sistema identificou métricas preocupantes para o aluno <strong>${studentName}</strong>.</p>
                    <p><strong>Classificação Atual:</strong> ${tier}</p>
                    <p>Recomendamos uma intervenção imediata.</p>
                    <a href="${link}" style="background-color: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver Laudo Completo</a>
                </div>
            `
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending risk email:', error);
        return { success: false, error };
    }
}

export async function sendPlanUpgradeEmail(adminEmail: string, currentUsage: number) {
    const resend = getResend();

    if (!resend) {
        console.log(`[MOCK EMAIL] Upgrade offer to ${adminEmail}`);
        return { success: true, mock: true };
    }

    try {
        await resend.emails.send({
            from: 'SocioIntelligence Comercial <sales@seudominio.com.br>',
            to: [adminEmail],
            subject: 'Potencialize sua Gestão com o Plano Sovereign',
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h1>Seus Resultados Estão Crescendo!</h1>
                    <p>Notamos que sua organização já gerou mais de <strong>${currentUsage} relatórios</strong>.</p>
                    <p>Você está pronto para o próximo nível? Conheça o plano Sovereign e tenha acesso a análises preditivas avançadas.</p>
                </div>
            `
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending upgrade email:', error);
        return { success: false, error };
    }
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
    const resend = getResend();

    if (!resend) {
        console.log(`[MOCK EMAIL] Monthly Report to ${directorEmail}`);
        return { success: true, mock: true };
    }

    try {
        await resend.emails.send({
            from: 'SocioIntelligence Relatórios <reports@seudominio.com.br>',
            to: [directorEmail],
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
                    <p style="font-size: 12px; color: #94a3b8;">EduInteligência - Dados que transformam vidas.</p>
                </div>
            `
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending monthly report:', error);
        return { success: false, error };
    }
}
