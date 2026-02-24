import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const EMAIL_FROM = 'Triavium <noreply@triavium.com.br>';

// ============================================================
// Generic send function — single entry point for all emails
// ============================================================

interface SendEmailParams {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.warn('⚠️ RESEND_API_KEY não configurada. E-mail não enviado.');
        return { success: false, error: 'RESEND_API_KEY não configurada' };
    }

    try {
        await resend.emails.send({
            from: from || EMAIL_FROM,
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
        });
        console.log(`📧 E-mail enviado: "${subject}" → ${Array.isArray(to) ? to.join(', ') : to}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Erro ao enviar e-mail:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
}

// ============================================================
// Notification email — generic template for alerts
// ============================================================

interface NotificationEmailParams {
    to: string[];
    studentName: string;
    title: string;
    message: string;
    link: string;
    severity?: 'critical' | 'warning' | 'info';
}

export async function sendNotificationEmail({
    to,
    studentName,
    title,
    message,
    link,
    severity = 'warning',
}: NotificationEmailParams) {
    const colors = {
        critical: { bg: '#ef4444', text: '#991b1b', light: '#fee2e2' },
        warning: { bg: '#f59e0b', text: '#92400e', light: '#fef3c7' },
        info: { bg: '#3b82f6', text: '#1e40af', light: '#dbeafe' },
    };
    const c = colors[severity];

    return sendEmail({
        to,
        subject: `${severity === 'critical' ? '⚠️ [URGENTE]' : '📋'} ${title} - ${studentName}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: ${c.bg}; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">${title}</h1>
                </div>
                <div style="padding: 24px; background-color: #ffffff;">
                    <div style="background-color: ${c.light}; border-left: 4px solid ${c.bg}; padding: 16px; margin: 16px 0;">
                        <p style="color: #1e293b; margin: 0 0 8px; font-weight: bold;">Aluno(a): ${studentName}</p>
                        <p style="color: #475569; margin: 0; line-height: 1.5;">${message}</p>
                    </div>
                    <div style="text-align: center; margin-top: 24px;">
                        <a href="${link}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Ver Perfil do Aluno
                        </a>
                    </div>
                    <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                        © ${new Date().getFullYear()} Triavium Educação e Desenvolvimento LTDA
                    </p>
                </div>
            </div>
        `,
    });
}

// ============================================================
// Critical Alert email (SRSS Tier 3)
// ============================================================

interface CriticalAlertEmailProps {
    to: string[];
    studentName: string;
    tier: string;
    lastLogCategory: string;
    lastLogDescription: string;
    alertLink: string;
}

export async function sendCriticalAlertEmail({
    to,
    studentName,
    tier,
    lastLogCategory,
    lastLogDescription,
    alertLink,
}: CriticalAlertEmailProps) {
    return sendEmail({
        to,
        subject: `⚠️ [URGENTE] Alerta de Risco Crítico - Aluno: ${studentName}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #ef4444; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Risco Crítico Identificado</h1>
                </div>

                <div style="padding: 24px; background-color: #ffffff;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.5;">
                        A Inteligência Nativa detectou um padrão de alto risco que requer atenção imediata da equipe psicopedagógica.
                    </p>

                    <div style="background-color: #f8fafc; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0;">
                        <h3 style="color: #1e293b; margin: 0 0 12px 0;">Resumo Híbrido</h3>
                        <ul style="color: #475569; margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 8px;"><strong>Aluno:</strong> ${studentName}</li>
                            <li style="margin-bottom: 8px;"><strong>Classificação SRSS:</strong> <span style="background-color: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">${tier}</span></li>
                            <li style="margin-bottom: 8px;"><strong>Última Ocorrência:</strong> ${lastLogCategory}</li>
                            <li style="margin-bottom: 0;"><strong>Detalhes:</strong> "${lastLogDescription}"</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${alertLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Visualizar Perfil do Aluno
                        </a>
                    </div>

                    <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                        Ação Sugerida: Realizar acolhimento individual nas próximas 24h.
                    </p>
                </div>
            </div>
        `,
    });
}

// ============================================================
// Password Reset email
// ============================================================

export async function sendPasswordResetEmail({ to, resetLink }: { to: string; resetLink: string }) {
    return sendEmail({
        to,
        subject: 'Redefinição de Senha - Triavium',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.025em;">Triavium</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Redefinição de Senha</p>
                </div>

                <div style="padding: 32px; background-color: #ffffff;">
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
                    </p>

                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetLink}" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">
                            Redefinir Minha Senha
                        </a>
                    </div>

                    <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 24px 0 0;">
                        Este link expira em 1 hora. Se você não solicitou esta redefinição, ignore este e-mail — sua conta permanece segura.
                    </p>
                </div>

                <div style="padding: 16px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                        © ${new Date().getFullYear()} Triavium Educação e Desenvolvimento LTDA
                    </p>
                </div>
            </div>
        `,
    });
}
