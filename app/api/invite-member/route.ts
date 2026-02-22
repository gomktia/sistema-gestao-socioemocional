import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrador',
    MANAGER: 'Gestor',
    PSYCHOLOGIST: 'Psicólogo',
    COUNSELOR: 'Orientador',
    TEACHER: 'Professor',
};

function getInviteEmailHtml(name: string, role: string, inviteLink: string, tenantName: string): string {
    const roleLabel = ROLE_LABELS[role] || role;

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
                        <td style="padding: 40px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                                Triavium
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">
                                Educação e Desenvolvimento LTDA
                            </p>
                        </td>
                    </tr>
                </table>

                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 0 0 16px 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="padding: 48px 40px;">
                            <h2 style="color: #1e293b; margin: 0 0 8px; font-size: 24px; font-weight: 700;">
                                Olá, ${name}! 👋
                            </h2>
                            <p style="color: #64748b; margin: 0 0 32px; font-size: 16px; line-height: 1.6;">
                                Você foi convidado(a) para fazer parte da equipe <strong style="color: #4f46e5;">${tenantName}</strong> como <strong>${roleLabel}</strong>.
                            </p>

                            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%); border-radius: 12px; padding: 24px; margin-bottom: 32px; border-left: 4px solid #4f46e5;">
                                <p style="color: #475569; margin: 0; font-size: 15px; line-height: 1.6;">
                                    Com a plataforma Triavium, você terá acesso a ferramentas avançadas para acompanhamento socioemocional e desenvolvimento integral dos estudantes.
                                </p>
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="${inviteLink}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">
                                            Completar meu cadastro
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #94a3b8; margin: 32px 0 0; font-size: 13px; text-align: center;">
                                Se o botão não funcionar, copie e cole este link no navegador:<br>
                                <a href="${inviteLink}" style="color: #4f46e5; word-break: break-all;">${inviteLink}</a>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 24px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #94a3b8; margin: 0; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Triavium Educação e Desenvolvimento LTDA<br>
                                Este convite é válido por 7 dias.
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

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
            return NextResponse.json(
                { error: 'Acesso negado' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { email, name, role, tenantId } = body;

        if (!email || !name || !role) {
            return NextResponse.json(
                { error: 'Email, nome e funcao sao obrigatorios' },
                { status: 400 }
            );
        }

        // Verificar se email ja existe no tenant
        const existingUser = await prisma.user.findFirst({
            where: {
                tenantId: tenantId || user.tenantId,
                email: email.toLowerCase()
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email ja esta cadastrado nesta organizacao' },
                { status: 400 }
            );
        }

        // Buscar nome do tenant para o email
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId || user.tenantId },
            select: { name: true }
        });

        // Criar usuario pendente (sera ativado quando fizer login)
        const newUser = await prisma.user.create({
            data: {
                tenantId: tenantId || user.tenantId,
                email: email.toLowerCase(),
                name,
                role: role as any,
                isActive: true,
            }
        });

        // Gerar token seguro usando crypto
        const inviteToken = randomBytes(32).toString('hex');
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://triavium.com.br'}/convite/${inviteToken}`;

        // Armazenar token no usuario para validacao posterior
        await prisma.user.update({
            where: { id: newUser.id },
            data: { supabaseUid: `invite:${inviteToken}` } // Temporario ate ativar conta
        });

        // Enviar email de convite
        let emailSent = false;
        let emailError: string | null = null;

        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Triavium <noreply@triavium.com.br>',
                    to: email.toLowerCase(),
                    subject: `🎉 Você foi convidado(a) para a equipe ${tenant?.name || 'Triavium'}`,
                    html: getInviteEmailHtml(name, role, inviteLink, tenant?.name || 'Triavium'),
                });
                emailSent = true;
            } catch (err: any) {
                console.error('Failed to send invite email:', err);
                emailError = err.message || 'Erro ao enviar email';
            }
        } else {
            console.warn('RESEND_API_KEY not configured, skipping email');
            emailError = 'Serviço de email não configurado';
        }

        return NextResponse.json({
            success: true,
            inviteLink,
            emailSent,
            emailError,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });
    } catch (error: any) {
        console.error('Error inviting member:', error);

        return NextResponse.json(
            { error: error.message || 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
