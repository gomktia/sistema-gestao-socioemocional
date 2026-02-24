'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/mail';

const MESSAGE_TYPES: Record<string, string> = {
  AVISO: 'Aviso',
  PARABENS: 'Parabéns',
  REUNIAO: 'Reunião',
  SUGESTAO: 'Sugestão',
};

export async function sendFamilyMessage(input: {
  studentId: string;
  type: string;
  subject: string;
  message: string;
}) {
  const user = await getCurrentUser();
  const allowedRoles = [UserRole.TEACHER, UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER];

  if (!user || !allowedRoles.includes(user.role)) {
    return { success: false, error: 'Sem permissão.' };
  }

  const { studentId, type, subject, message } = input;

  if (!studentId || !type || !subject?.trim() || !message?.trim()) {
    return { success: false, error: 'Todos os campos são obrigatórios.' };
  }

  if (!MESSAGE_TYPES[type]) {
    return { success: false, error: 'Tipo de mensagem inválido.' };
  }

  // Verify student belongs to user's tenant
  const student = await prisma.student.findFirst({
    where: { id: studentId, tenantId: user.tenantId },
    select: { id: true, name: true },
  });

  if (!student) {
    return { success: false, error: 'Aluno não encontrado.' };
  }

  // Create the message
  const comm = await prisma.familyCommunication.create({
    data: {
      tenantId: user.tenantId,
      studentId,
      senderId: user.id,
      type,
      subject: subject.trim(),
      message: message.trim(),
    },
  });

  // Send email to linked guardians
  const guardianLinks = await prisma.studentGuardian.findMany({
    where: { studentId, tenantId: user.tenantId },
    include: { guardian: { select: { email: true, name: true } } },
  });

  let emailSent = false;
  if (guardianLinks.length > 0) {
    try {
      const guardianEmails = guardianLinks.map((g) => g.guardian.email);
      const result = await sendEmail({
        to: guardianEmails,
        subject: `[${MESSAGE_TYPES[type]}] ${subject} - ${student.name}`,
        html: getFamilyMessageEmailHtml(student.name, MESSAGE_TYPES[type], subject, message, user.name),
      });
      emailSent = result.success;
    } catch (err) {
      console.error('Failed to send family communication email:', err);
    }
  }

  // Audit log
  prisma.auditLog.create({
    data: {
      tenantId: user.tenantId,
      userId: user.id,
      action: 'FAMILY_MESSAGE_SENT',
      targetId: studentId,
      details: { type, subject, emailSent },
    },
  }).catch((err) => console.error('Audit log failed:', err));

  revalidatePath(`/alunos/${studentId}`);
  revalidatePath('/responsavel/mensagens');

  return { success: true, emailSent };
}

export async function getFamilyMessages(studentId?: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Não autenticado.', messages: [] };
  }

  // If RESPONSIBLE, fetch messages for all linked students
  if (user.role === UserRole.RESPONSIBLE) {
    const guardianLinks = await prisma.studentGuardian.findMany({
      where: { guardianId: user.id, tenantId: user.tenantId },
      select: { studentId: true },
    });

    const studentIds = guardianLinks.map((g) => g.studentId);
    if (studentIds.length === 0) {
      return { success: true, messages: [] };
    }

    const messages = await prisma.familyCommunication.findMany({
      where: { tenantId: user.tenantId, studentId: { in: studentIds } },
      include: {
        student: { select: { name: true } },
        sender: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, messages };
  }

  // Staff: fetch messages for specific student
  const staffRoles = [UserRole.TEACHER, UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];
  if (!staffRoles.includes(user.role)) {
    return { success: false, error: 'Sem permissão.', messages: [] };
  }

  if (!studentId) {
    return { success: false, error: 'ID do aluno é obrigatório.', messages: [] };
  }

  const messages = await prisma.familyCommunication.findMany({
    where: { tenantId: user.tenantId, studentId },
    include: {
      student: { select: { name: true } },
      sender: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { success: true, messages };
}

export async function markFamilyMessageRead(messageId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== UserRole.RESPONSIBLE) {
    return { success: false, error: 'Sem permissão.' };
  }

  // Verify the message belongs to a student linked to this guardian
  const message = await prisma.familyCommunication.findUnique({
    where: { id: messageId },
    select: { studentId: true, tenantId: true },
  });

  if (!message || message.tenantId !== user.tenantId) {
    return { success: false, error: 'Mensagem não encontrada.' };
  }

  const link = await prisma.studentGuardian.findFirst({
    where: { guardianId: user.id, studentId: message.studentId, tenantId: user.tenantId },
  });

  if (!link) {
    return { success: false, error: 'Sem permissão.' };
  }

  await prisma.familyCommunication.update({
    where: { id: messageId },
    data: { isRead: true },
  });

  revalidatePath('/responsavel/mensagens');

  return { success: true };
}

function getFamilyMessageEmailHtml(
  studentName: string,
  typeLabel: string,
  subject: string,
  message: string,
  senderName: string
): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 800;">Triavium</h1>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">Comunicação Escola-Família</p>
      </div>
      <div style="background: white; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px;">
        <div style="background: #f8fafc; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
          <span style="display: inline-block; background: #6366f1; color: white; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px;">${typeLabel}</span>
          <p style="margin: 0; font-size: 12px; color: #64748b;">Aluno(a): <strong>${studentName}</strong></p>
        </div>
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #1e293b;">${subject}</h2>
        <p style="margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Enviado por <strong>${senderName}</strong></p>
        <p style="margin: 8px 0 0; font-size: 11px; color: #cbd5e1;">Acesse o Portal do Responsável para ver todas as mensagens.</p>
      </div>
    </div>
  `;
}
