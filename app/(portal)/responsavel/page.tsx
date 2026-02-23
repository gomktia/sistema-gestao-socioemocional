import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, GradeLevel as CoreGradeLevel } from '@/src/core/types';
import { calculateStudentProfile } from '@/src/core/logic/scoring';
import { generateEvolutionNarrative, getHomeSuggestions } from '@/lib/report/family-report-helpers';
import { STRENGTH_DESCRIPTIONS } from '@/src/core/content/strength-descriptions';
import { StrengthsCard } from '@/components/guardian/StrengthsCard';
import { EvolutionCard } from '@/components/guardian/EvolutionCard';
import { SuggestionsCard } from '@/components/guardian/SuggestionsCard';
import { Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ResponsavelPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== UserRole.RESPONSIBLE) {
    redirect('/');
  }

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
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
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

  // Use the first child (multi-child selector is for future implementation)
  const firstLink = guardianLinks[0];
  const student = firstLink.student;

  const gradeDisplay =
    student.grade === 'ANO_1_EM' ? '1ª Série EM' :
    student.grade === 'ANO_2_EM' ? '2ª Série EM' : '3ª Série EM';

  // Fetch assessments for this child
  const allAssessments = await prisma.assessment.findMany({
    where: { tenantId: user.tenantId, studentId: student.id },
    select: {
      type: true,
      rawAnswers: true,
      processedScores: true,
      screeningWindow: true,
      academicYear: true,
      appliedAt: true,
    },
    orderBy: { appliedAt: 'asc' },
  });

  type AssessmentRow = (typeof allAssessments)[number];
  const viaAnswers = allAssessments.find((a: AssessmentRow) => a.type === 'VIA_STRENGTHS')?.rawAnswers;
  const srssAnswers = allAssessments.find((a: AssessmentRow) => a.type === 'SRSS_IE')?.rawAnswers;
  const bigFiveScores = allAssessments.find((a: AssessmentRow) => a.type === 'BIG_FIVE')?.processedScores as any;

  // Evolution data from SRSS-IE assessments
  const evolutionData = allAssessments
    .filter((a: AssessmentRow) => a.type === 'SRSS_IE')
    .map((a: AssessmentRow) => ({
      window: a.screeningWindow === 'DIAGNOSTIC' ? 'Marco' : a.screeningWindow === 'MONITORING' ? 'Junho' : 'Outubro',
      externalizing: (a.processedScores as any)?.externalizing?.score || 0,
      internalizing: (a.processedScores as any)?.internalizing?.score || 0,
    }));

  // Check if VIA assessment is complete (71 items)
  const isViaComplete = viaAnswers && Object.keys(viaAnswers as object).length >= 71;

  let profile = null;
  if (isViaComplete && srssAnswers) {
    const gradeMap: Record<string, CoreGradeLevel> = {
      'ANO_1_EM': CoreGradeLevel.PRIMEIRO_ANO,
      'ANO_2_EM': CoreGradeLevel.SEGUNDO_ANO,
      'ANO_3_EM': CoreGradeLevel.TERCEIRO_ANO,
    };

    const coreGrade = gradeMap[student.grade] || CoreGradeLevel.PRIMEIRO_ANO;

    profile = calculateStudentProfile(
      viaAnswers as any,
      srssAnswers as any,
      coreGrade,
      bigFiveScores
    );
  }

  // Prepare strengths, evolution, and suggestions if profile is available
  let strengths: { label: string; virtue: string; description: string }[] = [];
  let evolutionNarrative = '';
  let homeSuggestions: { strengthLabel: string; activities: string[] }[] = [];

  if (profile) {
    strengths = profile.signatureStrengths.map((s) => {
      const desc = STRENGTH_DESCRIPTIONS[s.strength];
      return {
        label: s.label,
        virtue: s.virtue,
        description: desc?.description || '',
      };
    });

    evolutionNarrative = generateEvolutionNarrative(evolutionData);
    homeSuggestions = getHomeSuggestions(
      profile.signatureStrengths.map((s) => ({ strength: s.strength, label: s.label }))
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Heart size={24} className="text-rose-500" />
          Portal do Responsável
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Acompanhe o desenvolvimento socioemocional do(a) seu(sua) filho(a)
        </p>
      </div>

      {/* Multi-child note */}
      {guardianLinks.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
          Você possui {guardianLinks.length} filho(a)(s) vinculado(s). Em breve será possível alternar entre eles.
        </div>
      )}

      {/* Student info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">
          {gradeDisplay}
        </p>
      </div>

      {/* Main content */}
      {!profile ? (
        <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
          <h3 className="text-slate-500 font-bold mb-2">Avaliações em Andamento</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            As avaliações do(a) {student.name} ainda estão sendo realizadas.
            Assim que forem concluídas, você poderá visualizar as forças de caráter,
            evolução e sugestões de atividades para casa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Strengths */}
          <div>
            <StrengthsCard strengths={strengths} />
          </div>

          {/* Right column: Evolution + Suggestions */}
          <div className="space-y-6">
            <EvolutionCard narrative={evolutionNarrative} />
            <SuggestionsCard suggestions={homeSuggestions} />
          </div>
        </div>
      )}

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
