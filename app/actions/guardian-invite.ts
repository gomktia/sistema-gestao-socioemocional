'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { UserRole } from '@/src/core/types';
import { randomUUID } from 'crypto';
import { sendEmail } from '@/lib/mail';
import { getTenantUrl } from '@/lib/tenant-resolver';
import { validateGuardianInviteInput, type InviteInput } from '@/lib/validators/guardian-invite';

// ============================================================
// Send Guardian Invite (server action)
// ============================================================

const INVITE_EXPIRY_DAYS = 7;

export async function sendGuardianInvite(input: InviteInput) {
  const user = await getCurrentUser();
  const allowedRoles = [UserRole.PSYCHOLOGIST, UserRole.COUNSELOR, UserRole.MANAGER, UserRole.ADMIN];

  if (!user || !allowedRoles.includes(user.role)) {
    return { success: false, error: 'Sem permissão.' };
  }

  const validation = validateGuardianInviteInput(input);
  if (!validation.success || !validation.data) {
    return { success: false, error: validation.error };
  }

  const { email, relationship, studentId } = validation.data;

  // Verify student belongs to user's tenant
  const student = await prisma.student.findFirst({
    where: { id: studentId, tenantId: user.tenantId },
    select: { id: true, name: true },
  });

  if (!student) {
    return { success: false, error: 'Aluno não encontrado.' };
  }

  // Check if guardian already linked
  const existingGuardian = await prisma.user.findFirst({
    where: {
      tenantId: user.tenantId,
      email,
      role: 'RESPONSIBLE',
    },
  });

  if (existingGuardian) {
    const alreadyLinked = await prisma.studentGuardian.findUnique({
      where: { studentId_guardianId: { studentId, guardianId: existingGuardian.id } },
    });

    if (alreadyLinked) {
      return { success: false, error: 'Este responsável já está vinculado a este aluno.' };
    }

    // Link existing guardian to new child
    await prisma.studentGuardian.create({
      data: {
        tenantId: user.tenantId,
        studentId,
        guardianId: existingGuardian.id,
        relationship: relationship as any,
      },
    });

    return { success: true, alreadyHadAccount: true };
  }

  // Create or update invite
  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRY_DAYS);

  // Expire any existing pending invites for this email+student
  await prisma.guardianInvite.updateMany({
    where: { tenantId: user.tenantId, studentId, email, status: 'PENDING' },
    data: { status: 'EXPIRED' },
  });

  await prisma.guardianInvite.create({
    data: {
      tenantId: user.tenantId,
      studentId,
      email,
      token,
      relationship: relationship as any,
      invitedBy: user.id,
      expiresAt,
    },
  });

  // Send email
  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId },
    select: { name: true, slug: true, customDomain: true },
  });

  const baseUrl = tenant
    ? getTenantUrl({ slug: tenant.slug, customDomain: tenant.customDomain })
    : process.env.NEXT_PUBLIC_APP_URL || 'https://triavium.com.br';
  const inviteLink = `${baseUrl}/convite-responsavel?token=${token}`;

  let emailSent = false;
  try {
    const result = await sendEmail({
      to: email,
      subject: `Acompanhe o desenvolvimento de ${student.name} - ${tenant?.name || 'Triavium'}`,
      html: getGuardianInviteEmailHtml(student.name, inviteLink, tenant?.name || 'Triavium'),
    });
    emailSent = result.success;
  } catch (err) {
    console.error('Failed to send guardian invite email:', err);
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      tenantId: user.tenantId,
      userId: user.id,
      action: 'GUARDIAN_INVITE_SENT',
      targetId: studentId,
      details: { email, relationship, emailSent },
    },
  });

  return { success: true, inviteLink, emailSent };
}

// ============================================================
// Validate Guardian Token (server action)
// ============================================================

export async function validateGuardianToken(token: string) {
  if (!token) return { valid: false, error: 'Token não informado.' };

  const invite = await prisma.guardianInvite.findUnique({
    where: { token },
    include: {
      student: { select: { id: true, name: true } },
      tenant: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!invite) return { valid: false, error: 'Convite não encontrado.' };
  if (invite.status !== 'PENDING') return { valid: false, error: 'Convite já utilizado ou expirado.' };
  if (new Date() > invite.expiresAt) {
    await prisma.guardianInvite.update({ where: { id: invite.id }, data: { status: 'EXPIRED' } });
    return { valid: false, error: 'Convite expirado.' };
  }

  return {
    valid: true,
    data: {
      inviteId: invite.id,
      email: invite.email,
      studentName: invite.student.name,
      studentId: invite.student.id,
      tenantId: invite.tenant.id,
      tenantName: invite.tenant.name,
    },
  };
}

// ============================================================
// Register Guardian (server action)
// ============================================================

export async function registerGuardian(formData: FormData) {
  const token = formData.get('token') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!token || !name || !email || !password) {
    return { success: false, error: 'Todos os campos são obrigatórios.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'As senhas não coincidem.' };
  }

  const validation = await validateGuardianToken(token);
  if (!validation.valid || !validation.data) {
    return { success: false, error: validation.error };
  }

  const { inviteId, studentId, tenantId } = validation.data;

  // Fetch invite to get relationship
  const invite = await prisma.guardianInvite.findUnique({
    where: { id: inviteId },
    select: { relationship: true },
  });

  // Create Supabase auth user
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email.toLowerCase(),
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    if (authError?.message?.includes('already been registered')) {
      return { success: false, error: 'Este e-mail já possui uma conta. Faça login.' };
    }
    return { success: false, error: authError?.message || 'Erro ao criar conta.' };
  }

  // Create User record
  const newUser = await prisma.user.create({
    data: {
      tenantId,
      email: email.toLowerCase(),
      name,
      role: 'RESPONSIBLE',
      supabaseUid: authData.user.id,
      isActive: true,
    },
  });

  // Create StudentGuardian link
  await prisma.studentGuardian.create({
    data: {
      tenantId,
      studentId,
      guardianId: newUser.id,
      relationship: invite?.relationship || 'OUTRO',
    },
  });

  // Mark invite as accepted
  await prisma.guardianInvite.update({
    where: { id: inviteId },
    data: { status: 'ACCEPTED' },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: newUser.id,
      action: 'GUARDIAN_ACCOUNT_CREATED',
      targetId: studentId,
      details: { email: email.toLowerCase(), name },
    },
  });

  return { success: true };
}

// ============================================================
// Email template (private)
// ============================================================

function getGuardianInviteEmailHtml(studentName: string, inviteLink: string, tenantName: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#059669 0%,#10b981 100%);border-radius:16px 16px 0 0;">
        <tr><td style="padding:40px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">${tenantName}</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Portal da Família</p>
        </td></tr>
      </table>
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#fff;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="padding:48px 40px;">
          <h2 style="color:#1e293b;margin:0 0 8px;font-size:24px;font-weight:700;">Olá!</h2>
          <p style="color:#64748b;margin:0 0 32px;font-size:16px;line-height:1.6;">
            Você foi convidado(a) para acompanhar o desenvolvimento de <strong style="color:#059669;">${studentName}</strong> pela plataforma <strong>${tenantName}</strong>.
          </p>
          <div style="background:#f0fdf4;border-radius:12px;padding:24px;margin-bottom:32px;border-left:4px solid #059669;">
            <p style="color:#475569;margin:0;font-size:15px;line-height:1.6;">
              No Portal da Família, você poderá ver as forças de caráter do(a) seu(sua) filho(a), sugestões de atividades para fazer em casa e acompanhar a evolução ao longo do ano.
            </p>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${inviteLink}" style="display:inline-block;background:linear-gradient(135deg,#059669 0%,#10b981 100%);color:#fff;text-decoration:none;padding:16px 48px;border-radius:12px;font-size:16px;font-weight:600;box-shadow:0 4px 14px rgba(5,150,105,0.4);">
                Criar Minha Conta
              </a>
            </td></tr>
          </table>
          <p style="color:#94a3b8;margin:32px 0 0;font-size:13px;text-align:center;">
            Este convite é válido por 7 dias.<br>
            Se o botão não funcionar, copie e cole este link no navegador:<br>
            <a href="${inviteLink}" style="color:#059669;word-break:break-all;">${inviteLink}</a>
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;background-color:#f8fafc;border-radius:0 0 16px 16px;border-top:1px solid #e2e8f0;">
          <p style="color:#94a3b8;margin:0;font-size:12px;text-align:center;">
            &copy; ${new Date().getFullYear()} Triavium Educação e Desenvolvimento LTDA
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
