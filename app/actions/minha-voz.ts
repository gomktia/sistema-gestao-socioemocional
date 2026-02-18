
'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeMessageRisk, MessageRiskLevel } from '@/src/core/logic/sentiment';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
            }
        });

        if (risk === MessageRiskLevel.HIGH) {
            console.warn(`[ALERT] User ${user.name} posted HIGH RISK message.`);

            const psychologists = await prisma.user.findMany({
                where: { tenantId: user.tenantId, role: 'PSYCHOLOGIST' },
                select: { email: true }
            });

            if (process.env.RESEND_API_KEY && psychologists.length > 0) {
                await resend.emails.send({
                    from: 'Triavium Alert <onboarding@resend.dev>', // Default Resend testing sender
                    to: psychologists.map(p => p.email),
                    subject: `🚨 ALERTA DE RISCO - ${user.name}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2 style="color: #e11d48;">Alerta de Risco Detectado</h2>
                            <p>O aluno <strong>${user.name}</strong> enviou uma mensagem classificada como ALTO RISCO.</p>
                            <div style="background: #fff1f2; padding: 15px; border-left: 4px solid #e11d48; margin: 20px 0;">
                                "${content}"
                            </div>
                            <p>Por favor, verifique o painel do aluno imediatamente.</p>
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}/alunos/${user.studentId}" style="display: inline-block; background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                Acessar Perfil do Aluno
                            </a>
                        </div>
                    `
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
