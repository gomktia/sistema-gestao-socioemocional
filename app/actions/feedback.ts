'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function getFeedbackNotificationHtml(
    userName: string,
    userEmail: string,
    tenantName: string,
    subject: string,
    description: string
): string {
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
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #8b5cf6 100%); border-radius: 16px 16px 0 0;">
                    <tr>
                        <td style="padding: 32px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">
                                📣 Voz do Educador
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 13px;">
                                Nova sugestão recebida
                            </p>
                        </td>
                    </tr>
                </table>

                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 16px 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="padding: 40px;">
                            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="color: #64748b; font-size: 13px; padding-bottom: 8px;">
                                            <strong>De:</strong> ${userName} (${userEmail})
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-size: 13px;">
                                            <strong>Organização:</strong> ${tenantName}
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 20px; font-weight: 700;">
                                ${subject}
                            </h2>

                            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border-radius: 12px; padding: 24px; border-left: 4px solid #f59e0b;">
                                <p style="color: #475569; margin: 0; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">
${description}
                                </p>
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://triavium.com.br'}/super-admin/suporte" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">
                                            Ver no painel
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #94a3b8; margin: 0; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Triavium Educação e Desenvolvimento LTDA
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

export async function submitFeedback(data: { subject: string; description: string }) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('Voce precisa estar logado para enviar sugestoes');
    }

    // Buscar nome do tenant
    const tenant = await prisma.tenant.findUnique({
        where: { id: user.tenantId },
        select: { name: true }
    });

    const feedback = await prisma.productFeedback.create({
        data: {
            userId: user.id,
            tenantId: user.tenantId,
            subject: data.subject,
            description: data.description,
            status: 'PENDING',
        }
    });

    // Enviar email para administradores do sistema
    if (resend) {
        try {
            // Buscar admins globais (super admins)
            const admins = await prisma.user.findMany({
                where: {
                    role: 'ADMIN',
                    isActive: true,
                },
                select: { email: true }
            });

            const adminEmails = admins.map(a => a.email).filter(Boolean);

            if (adminEmails.length > 0) {
                await resend.emails.send({
                    from: 'Triavium <noreply@triavium.com.br>',
                    to: adminEmails,
                    subject: `📣 Nova sugestão: ${data.subject}`,
                    html: getFeedbackNotificationHtml(
                        user.name,
                        user.email,
                        tenant?.name || 'Organização',
                        data.subject,
                        data.description
                    ),
                });
            }
        } catch (err) {
            // Log error but don't fail the feedback submission
            console.error('Failed to send feedback notification email:', err);
        }
    }

    revalidatePath('/sugestoes');
    return { success: true, id: feedback.id };
}

export async function getFeedbacks() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        throw new Error('Acesso negado');
    }

    return await prisma.productFeedback.findMany({
        include: {
            user: {
                select: { name: true, email: true }
            },
            tenant: {
                select: { name: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function updateFeedbackStatus(id: string, status: 'PENDING' | 'REVIEWING' | 'PLANNED' | 'IMPLEMENTED' | 'REJECTED') {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        throw new Error('Acesso negado');
    }

    await prisma.productFeedback.update({
        where: { id },
        data: { status }
    });

    revalidatePath('/super-admin/suporte');
    return { success: true };
}
