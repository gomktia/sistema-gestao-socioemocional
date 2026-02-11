// ============================================================
// RBAC - Role-Based Access Control
// Controla o que cada papel pode ver/fazer no sistema
//
// Regras do Protocolo SRSS-IE (Seção D - Ética e Sigilo):
// - Professores: veem riscos (Tier/cor), NÃO veem histórico clínico
// - Alunos: veem apenas suas forças de caráter, NÃO veem riscos
// - Gestores/Psicólogos: acesso total a dados qualitativos e clínicos
// ============================================================

import { UserRole } from '../types';

export enum Permission {
  // Alunos
  STUDENT_VIEW_LIST = 'STUDENT_VIEW_LIST',
  STUDENT_VIEW_DETAIL = 'STUDENT_VIEW_DETAIL',
  STUDENT_CREATE = 'STUDENT_CREATE',
  STUDENT_EDIT = 'STUDENT_EDIT',

  // Avaliações
  ASSESSMENT_VIEW_OWN_STRENGTHS = 'ASSESSMENT_VIEW_OWN_STRENGTHS',    // Aluno vê suas forças
  ASSESSMENT_VIEW_RISK_TIER = 'ASSESSMENT_VIEW_RISK_TIER',            // Ver tier/cor do risco
  ASSESSMENT_VIEW_RISK_DETAIL = 'ASSESSMENT_VIEW_RISK_DETAIL',        // Ver scores detalhados
  ASSESSMENT_VIEW_RAW_ANSWERS = 'ASSESSMENT_VIEW_RAW_ANSWERS',        // Ver respostas brutas
  ASSESSMENT_APPLY_VIA = 'ASSESSMENT_APPLY_VIA',                      // Aplicar questionário VIA
  ASSESSMENT_APPLY_SRSS = 'ASSESSMENT_APPLY_SRSS',                    // Preencher SRSS-IE

  // Intervenções
  INTERVENTION_VIEW_LIST = 'INTERVENTION_VIEW_LIST',
  INTERVENTION_VIEW_QUALITATIVE = 'INTERVENTION_VIEW_QUALITATIVE',    // Observações clínicas
  INTERVENTION_CREATE = 'INTERVENTION_CREATE',
  INTERVENTION_EDIT = 'INTERVENTION_EDIT',

  // Relatórios e Dashboards
  REPORT_CLASS_OVERVIEW = 'REPORT_CLASS_OVERVIEW',       // Visão geral da turma
  REPORT_SCHOOL_ANALYTICS = 'REPORT_SCHOOL_ANALYTICS',   // Analytics da escola toda
  REPORT_STUDENT_HISTORY = 'REPORT_STUDENT_HISTORY',     // Histórico longitudinal do aluno
  REPORT_EXPORT_DATA = 'REPORT_EXPORT_DATA',             // Exportar dados

  // Administração
  TENANT_MANAGE = 'TENANT_MANAGE',
  USER_MANAGE = 'USER_MANAGE',
}

/** Mapa de permissões por papel */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission), // Acesso total

  [UserRole.MANAGER]: [
    Permission.STUDENT_VIEW_LIST,
    Permission.STUDENT_VIEW_DETAIL,
    Permission.STUDENT_CREATE,
    Permission.STUDENT_EDIT,
    Permission.ASSESSMENT_VIEW_RISK_TIER,
    Permission.ASSESSMENT_VIEW_RISK_DETAIL,
    Permission.ASSESSMENT_VIEW_RAW_ANSWERS,
    Permission.ASSESSMENT_APPLY_VIA,
    Permission.ASSESSMENT_APPLY_SRSS,
    Permission.INTERVENTION_VIEW_LIST,
    Permission.INTERVENTION_VIEW_QUALITATIVE,
    Permission.INTERVENTION_CREATE,
    Permission.INTERVENTION_EDIT,
    Permission.REPORT_CLASS_OVERVIEW,
    Permission.REPORT_SCHOOL_ANALYTICS,
    Permission.REPORT_STUDENT_HISTORY,
    Permission.REPORT_EXPORT_DATA,
    Permission.USER_MANAGE,
  ],

  [UserRole.PSYCHOLOGIST]: [
    Permission.STUDENT_VIEW_LIST,
    Permission.STUDENT_VIEW_DETAIL,
    Permission.ASSESSMENT_VIEW_RISK_TIER,
    Permission.ASSESSMENT_VIEW_RISK_DETAIL,
    Permission.ASSESSMENT_VIEW_RAW_ANSWERS,
    Permission.ASSESSMENT_APPLY_SRSS,
    Permission.INTERVENTION_VIEW_LIST,
    Permission.INTERVENTION_VIEW_QUALITATIVE,  // Acesso a dados clínicos
    Permission.INTERVENTION_CREATE,
    Permission.INTERVENTION_EDIT,
    Permission.REPORT_CLASS_OVERVIEW,
    Permission.REPORT_STUDENT_HISTORY,
    Permission.REPORT_EXPORT_DATA,
  ],

  [UserRole.COUNSELOR]: [
    Permission.STUDENT_VIEW_LIST,
    Permission.STUDENT_VIEW_DETAIL,
    Permission.ASSESSMENT_VIEW_RISK_TIER,
    Permission.ASSESSMENT_VIEW_RISK_DETAIL,
    Permission.ASSESSMENT_APPLY_SRSS,
    Permission.INTERVENTION_VIEW_LIST,
    Permission.INTERVENTION_VIEW_QUALITATIVE,  // Acesso a dados clínicos
    Permission.INTERVENTION_CREATE,
    Permission.INTERVENTION_EDIT,
    Permission.REPORT_CLASS_OVERVIEW,
    Permission.REPORT_STUDENT_HISTORY,
  ],

  [UserRole.TEACHER]: [
    // Professores veem riscos (tier/cor), mas NÃO histórico clínico
    Permission.STUDENT_VIEW_LIST,
    Permission.ASSESSMENT_VIEW_RISK_TIER,       // Apenas tier/cor
    Permission.ASSESSMENT_APPLY_SRSS,           // Pode preencher SRSS-IE
    Permission.INTERVENTION_VIEW_LIST,          // Vê lista de intervenções
    // NÃO tem: INTERVENTION_VIEW_QUALITATIVE
    // NÃO tem: ASSESSMENT_VIEW_RISK_DETAIL
    // NÃO tem: ASSESSMENT_VIEW_RAW_ANSWERS
    Permission.REPORT_CLASS_OVERVIEW,
  ],

  [UserRole.STUDENT]: [
    // Alunos veem APENAS suas forças de caráter
    Permission.ASSESSMENT_VIEW_OWN_STRENGTHS,
    Permission.ASSESSMENT_APPLY_VIA,            // Pode responder o questionário
    // NÃO vê: riscos, intervenções, dados de outros alunos
  ],
};

/** Verifica se um papel possui determinada permissão */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** Retorna todas as permissões de um papel */
export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Filtra os dados do perfil do aluno com base no papel do usuário.
 * Garante que professores não vejam dados clínicos e alunos não vejam riscos.
 */
export function filterProfileByRole(
  profile: Record<string, unknown>,
  viewerRole: UserRole
): Record<string, unknown> {
  const filtered = { ...profile };

  if (viewerRole === UserRole.STUDENT) {
    // Aluno só vê suas forças
    delete filtered.externalizing;
    delete filtered.internalizing;
    delete filtered.overallTier;
    delete filtered.overallColor;
    delete filtered.gradeAlerts;
    delete filtered.interventionSuggestions;
    delete filtered.developmentAreas;
    return filtered;
  }

  if (viewerRole === UserRole.TEACHER) {
    // Professor vê tier/cor mas não detalhes de score nem sugestões clínicas
    delete filtered.interventionSuggestions;
    if (filtered.externalizing && typeof filtered.externalizing === 'object') {
      const ext = filtered.externalizing as Record<string, unknown>;
      filtered.externalizing = { tier: ext.tier, color: ext.color, label: ext.label };
    }
    if (filtered.internalizing && typeof filtered.internalizing === 'object') {
      const int = filtered.internalizing as Record<string, unknown>;
      filtered.internalizing = { tier: int.tier, color: int.color, label: int.label };
    }
    return filtered;
  }

  // Manager, Psychologist, Counselor, Admin → acesso completo
  return filtered;
}
