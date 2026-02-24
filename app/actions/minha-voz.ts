'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeMessageRisk, MessageRiskLevel } from '@/src/core/logic/sentiment';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/mail';
import { getTenantUrl } from '@/lib/tenant-resolver';

function getRiskAlertEmailHtml(studentName: string, content: string, profileUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #dc2626 0%, #e11d48 100%); border-radius: 16px 16px 0 0;">
                    <tr>
                        <td style="padding: 32px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">
                                🚨 ALERTA DE RISCO
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 13px;">
                                Ação imediata requerida
                            </p>
                        </td>
                    </tr>
                </table>

                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 16px 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #475569; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                                O aluno <strong style="color: #1e293b;">${studentName}</strong> enviou uma mensagem classificada como <strong style="color: #dc2626;">ALTO RISCO</strong>.
                            </p>

                            <div style="background: #fef2f2; border-radius: 12px; padding: 24px; border-left: 4px solid #dc2626; margin-bottom: 32px;">
                                <p style="color: #991b1b; margin: 0; font-size: 15px; line-height: 1.7; font-style: italic;">
                                    "${content}"
                                </p>
                            </div>

                            <p style="color: #64748b; margin: 0 0 24px; font-size: 14px;">
                                Por favor, verifique o painel do aluno imediatamente e tome as medidas necessárias.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="${profileUrl}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #e11d48 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);">
                                            Acessar Perfil do Aluno
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #94a3b8; margin: 0; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Triavium Educação e Desenvolvimento LTDA<br>
                                Sistema de Monitoramento Socioemocional
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

export async function sendStudentMessage(content: string) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'STUDENT' || !user.studentId) {
        return { error: 'Apenas alunos cadastrados podem enviar mensagens.' };
    }

    if (!content.trim()) return { error: 'A mensagem não pode estar vazia.' };

    const risk = analyzeMessageRisk(content);

    try {
        await prisma.studentMessage.create({
            data: {
                content,
                riskLevel: risk,
                studentId: user.studentId,
                tenantId: user.tenantId,
            }
        });

        if (risk === MessageRiskLevel.HIGH) {
            console.warn(`[ALERT] User ${user.name} posted HIGH RISK message.`);

            // Buscar psicólogos e dados do tenant
            const [psychologists, tenant] = await Promise.all([
                prisma.user.findMany({
                    where: { tenantId: user.tenantId, role: 'PSYCHOLOGIST' },
                    select: { email: true }
                }),
                prisma.tenant.findUnique({
                    where: { id: user.tenantId },
                    select: { slug: true, customDomain: true }
                })
            ]);

            if (psychologists.length > 0) {
                const tenantBaseUrl = tenant
                    ? getTenantUrl({ slug: tenant.slug, customDomain: tenant.customDomain })
                    : (process.env.NEXT_PUBLIC_APP_URL || 'https://triavium.com.br');
                const profileUrl = `${tenantBaseUrl}/alunos/${user.studentId}`;

                await sendEmail({
                    to: psychologists.map(p => p.email),
                    subject: `🚨 ALERTA DE RISCO - ${user.name}`,
                    html: getRiskAlertEmailHtml(user.name, content, profileUrl),
                }).catch(err => console.error('Failed to send alert email:', err));
            }
        }

        revalidatePath('/minha-voz');
        return { success: true };
    } catch (err) {
        console.error('Error sending message:', err);
        return { error: 'Erro ao enviar mensagem. Tente novamente.' };
    }
}
