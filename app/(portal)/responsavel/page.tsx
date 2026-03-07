import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/src/core/types';
import { ChildSelector } from '@/components/guardian/ChildSelector';
import { Heart, ClipboardCheck, Users } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ filho?: string }>;
}

export default async function ResponsavelPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.RESPONSIBLE) {
    redirect('/');
  }

  const params = await searchParams;

  // Fetch all children linked to this guardian via StudentGuardian
  const guardianLinks = await prisma.studentGuardian.findMany({
    where: { guardianId: user.id, tenantId: user.tenantId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          grade: true,
          tenant: {
            select: {
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      },
    },
  });

  // Empty state: no children linked
  if (guardianLinks.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Heart size={24} className="text-rose-500" />
            Portal do Responsável
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe o desenvolvimento socioemocional do(a) seu(sua) filho(a)
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
          <h3 className="text-slate-500 font-bold mb-2">Nenhum aluno vinculado</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Você ainda não possui nenhum(a) filho(a) vinculado(a) ao seu perfil.
            Entre em contato com a escola para solicitar o vínculo.
          </p>
        </div>
      </div>
    );
  }

  // Resolve selected child from ?filho= param or default to first
  const selectedLink = params.filho
    ? guardianLinks.find(l => l.student.id === params.filho) ?? guardianLinks[0]
    : guardianLinks[0];
  const student = selectedLink.student;
  const filhoParam = student.id;

  const gradeDisplay =
    student.grade === 'ANO_1_EM' ? '1ª Série EM' :
    student.grade === 'ANO_2_EM' ? '2ª Série EM' : '3ª Série EM';

  // Check for existing parent SDQ
  const parentSDQ = await prisma.assessment.findFirst({
    where: {
      studentId: student.id,
      type: 'SDQ',
      screeningTeacherId: null,
    },
    orderBy: { appliedAt: 'desc' },
    select: { processedScores: true },
  });
  const sdqComplete = !!parentSDQ?.processedScores;

  // Check for existing Percepção Familiar assessment
  const familyAssessment = await prisma.assessment.findFirst({
    where: {
      studentId: student.id,
      type: 'FAMILY_SOCIOEMOTIONAL',
      screeningTeacherId: null,
    },
    orderBy: { appliedAt: 'desc' },
    select: { processedScores: true },
  });
  const familyComplete = !!familyAssessment?.processedScores;

  // Create audit log entry (non-blocking)
  prisma.auditLog.create({
    data: {
      tenantId: user.tenantId,
      userId: user.id,
      action: 'GUARDIAN_VIEWED_CHILD',
      targetId: student.id,
      details: { childName: student.name },
    },
  }).catch((err) => console.error('Audit log failed:', err));

  // Build children list for the selector
  const childrenList = guardianLinks.map(l => ({
    id: l.student.id,
    name: l.student.name,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Heart size={24} className="text-rose-500" />
          Portal do Responsável
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Acompanhe o desenvolvimento socioemocional do(a) seu(sua) filho(a)
        </p>
      </div>

      {/* Multi-child selector */}
      <ChildSelector children={childrenList} selectedId={filhoParam} />

      {/* Student info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">
          {gradeDisplay}
        </p>
      </div>

      {/* SDQ Status Card */}
      <div className={`rounded-2xl p-6 shadow-sm border ${sdqComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-teal-50 border-teal-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${sdqComplete ? 'bg-emerald-100' : 'bg-teal-100'}`}>
              <ClipboardCheck size={20} className={sdqComplete ? 'text-emerald-600' : 'text-teal-600'} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {sdqComplete ? 'SDQ Concluído' : 'Questionário SDQ'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {sdqComplete
                  ? 'Você já preencheu o Questionário de Capacidades e Dificuldades.'
                  : 'Ajude-nos a compreender melhor o comportamento do(a) seu(sua) filho(a).'}
              </p>
            </div>
          </div>
          {!sdqComplete && (
            <Link
              href={`/responsavel/sdq?filho=${filhoParam}`}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
            >
              Responder SDQ
            </Link>
          )}
        </div>
      </div>

      {/* Percepção Familiar Card */}
      <div className={`rounded-2xl p-6 shadow-sm border ${familyComplete ? 'bg-emerald-50 border-emerald-200' : 'bg-violet-50 border-violet-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${familyComplete ? 'bg-emerald-100' : 'bg-violet-100'}`}>
              <Users size={20} className={familyComplete ? 'text-emerald-600' : 'text-violet-600'} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {familyComplete ? 'Percepção Familiar Concluída' : 'Percepção Familiar'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {familyComplete
                  ? 'Você já registrou sua percepção sobre as competências socioemocionais.'
                  : 'Compartilhe como você percebe o desenvolvimento socioemocional do(a) seu(sua) filho(a).'}
              </p>
            </div>
          </div>
          {!familyComplete && (
            <Link
              href={`/responsavel/percepcao-familiar?filho=${filhoParam}`}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
            >
              Responder
            </Link>
          )}
        </div>
      </div>

      {/* Informational message */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <h3 className="text-slate-700 font-bold mb-2">Como funciona?</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
          As informações coletadas nos questionários são ferramentas internas da escola
          para auxiliar no desenvolvimento do(a) seu(sua) filho(a). A equipe pedagógica
          utilizará esses dados para melhorar o ambiente e o acompanhamento escolar.
        </p>
        <p className="text-slate-400 text-xs mt-3">
          Caso deseje acessar os resultados, você pode solicitar formalmente junto à coordenação da escola (LGPD).
        </p>
      </div>

      {/* School contact info */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
          Contato da Escola
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <p><span className="font-medium">Escola:</span> {student.tenant.name}</p>
          {student.tenant.phone && (
            <p><span className="font-medium">Telefone:</span> {student.tenant.phone}</p>
          )}
          {student.tenant.email && (
            <p><span className="font-medium">E-mail:</span> {student.tenant.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}
