// ============================================================
// TIPOS DO DOMÍNIO - Sistema de Gestão Socioemocional
// ============================================================

// --- Enums ---

export enum GradeLevel {
  PRIMEIRO_ANO = 'ANO_1_EM',
  SEGUNDO_ANO = 'ANO_2_EM',
  TERCEIRO_ANO = 'ANO_3_EM',
}

export enum RiskTier {
  TIER_1 = 'TIER_1', // Verde - Baixo Risco - Camada Universal
  TIER_2 = 'TIER_2', // Amarelo - Risco Moderado - Camada Focalizada
  TIER_3 = 'TIER_3', // Vermelho - Alto Risco - Camada Intensiva
}

export enum RiskColor {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
}

export enum RiskDomain {
  EXTERNALIZING = 'EXTERNALIZING',
  INTERNALIZING = 'INTERNALIZING',
}

export enum UserRole {
  ADMIN = 'ADMIN',           // Administrador do sistema (SaaS)
  MANAGER = 'MANAGER',       // Gestor escolar
  PSYCHOLOGIST = 'PSYCHOLOGIST', // Psicólogo escolar
  COUNSELOR = 'COUNSELOR',   // Orientador educacional
  TEACHER = 'TEACHER',       // Professor
  STUDENT = 'STUDENT',       // Aluno
}

export enum ScreeningWindow {
  DIAGNOSTIC = 'DIAGNOSTIC',     // Março - 30-45 dias após início
  MONITORING = 'MONITORING',     // Junho/Julho - Final do 1º semestre
  FINAL = 'FINAL',               // Outubro - Meio do 2º semestre
}

// --- VIA Character Strengths ---

export enum VirtueCategory {
  SABEDORIA = 'SABEDORIA',
  CORAGEM = 'CORAGEM',
  HUMANIDADE = 'HUMANIDADE',
  JUSTICA = 'JUSTICA',
  MODERACAO = 'MODERACAO',
  TRANSCENDENCIA = 'TRANSCENDENCIA',
}

export enum CharacterStrength {
  CRIATIVIDADE = 'CRIATIVIDADE',
  CURIOSIDADE = 'CURIOSIDADE',
  PENSAMENTO_CRITICO = 'PENSAMENTO_CRITICO',
  AMOR_APRENDIZADO = 'AMOR_APRENDIZADO',
  SENSATEZ = 'SENSATEZ',
  BRAVURA = 'BRAVURA',
  PERSEVERANCA = 'PERSEVERANCA',
  AUTENTICIDADE = 'AUTENTICIDADE',
  VITALIDADE = 'VITALIDADE',
  AMOR = 'AMOR',
  BONDADE = 'BONDADE',
  INTELIGENCIA_SOCIAL = 'INTELIGENCIA_SOCIAL',
  CIDADANIA = 'CIDADANIA',
  IMPARCIALIDADE = 'IMPARCIALIDADE',
  LIDERANCA = 'LIDERANCA',
  PERDAO = 'PERDAO',
  MODESTIA = 'MODESTIA',
  PRUDENCIA = 'PRUDENCIA',
  AUTORREGULACAO = 'AUTORREGULACAO',
  APRECIACAO_BELO = 'APRECIACAO_BELO',
  GRATIDAO = 'GRATIDAO',
  HUMOR = 'HUMOR',
  ESPERANCA = 'ESPERANCA',
  ESPIRITUALIDADE = 'ESPIRITUALIDADE',
}

// --- Interfaces ---

/** Respostas brutas do questionário VIA (71 itens, escala 0-4) */
export interface VIARawAnswers {
  /** Chave: número do item (1-71), Valor: resposta (0-4) */
  [itemNumber: number]: number;
}

/** Respostas brutas do SRSS-IE (12 itens, escala 0-3) */
export interface SRSSRawAnswers {
  /** Chave: número do item (1-12), Valor: resposta (0-3) */
  [itemNumber: number]: number;
}

export interface StrengthScore {
  strength: CharacterStrength;
  virtue: VirtueCategory;
  label: string;
  items: number[];
  rawSum: number;
  maxPossible: number;
  /** Score normalizado 0-100 para comparação entre forças com nº diferente de itens */
  normalizedScore: number;
}

export interface RiskSubscaleResult {
  domain: RiskDomain;
  score: number;
  maxPossible: number;
  tier: RiskTier;
  color: RiskColor;
  label: string;
}

export interface GradeSpecificAlert {
  itemNumber: number;
  itemLabel: string;
  score: number;
  severity: 'WATCH' | 'CRITICAL';
  rationale: string;
}

export interface InterventionSuggestion {
  targetRisk: string;
  leverageStrength: CharacterStrength;
  strengthLabel: string;
  strategy: string;
  rationale: string;
}

export interface StudentProfile {
  // Risco (SRSS-IE)
  externalizing: RiskSubscaleResult;
  internalizing: RiskSubscaleResult;
  overallTier: RiskTier;
  overallColor: RiskColor;

  // Forças (VIA)
  allStrengths: StrengthScore[];
  signatureStrengths: StrengthScore[]; // Top 5
  developmentAreas: StrengthScore[];   // Bottom 5

  // Cruzamento Preditivo
  gradeAlerts: GradeSpecificAlert[];
  interventionSuggestions: InterventionSuggestion[];
}
