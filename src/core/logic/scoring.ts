// ============================================================
// MOTOR DE INTELIGÊNCIA SOCIOEMOCIONAL
// Regras extraídas de:
//   - Escala 9 ano.xlsx (aba Avaliação) → mapeamento VIA
//   - Protocolo SRSS-IE.pdf → scoring de risco e pontos de corte
//   - RTI Socioemocional.pdf → diferenciação por série
// ============================================================

import {
  CharacterStrength,
  VirtueCategory,
  RiskTier,
  RiskColor,
  RiskDomain,
  GradeLevel,
  ScreeningWindow,
  VIARawAnswers,
  SRSSRawAnswers,
  StrengthScore,
  RiskSubscaleResult,
  GradeSpecificAlert,
  InterventionSuggestion,
  StudentProfile,
} from '../types';

// ============================================================
// 1. MAPEAMENTO VIA: Item → Força de Caráter
//    Extraído das fórmulas da aba "Avaliação" do Excel
//    Cada força = SOMA dos itens listados (escala 0-4)
// ============================================================

export interface StrengthDefinition {
  strength: CharacterStrength;
  virtue: VirtueCategory;
  label: string;
  items: number[];
}

export const VIA_STRENGTH_MAP: StrengthDefinition[] = [
  // --- 1. SABEDORIA E CONHECIMENTO ---
  { strength: CharacterStrength.CRIATIVIDADE,       virtue: VirtueCategory.SABEDORIA,       label: 'Criatividade',        items: [3, 30, 48] },
  { strength: CharacterStrength.CURIOSIDADE,         virtue: VirtueCategory.SABEDORIA,       label: 'Curiosidade',         items: [23, 25, 69] },
  { strength: CharacterStrength.PENSAMENTO_CRITICO,  virtue: VirtueCategory.SABEDORIA,       label: 'Pensamento Crítico',  items: [7, 9, 71] },
  { strength: CharacterStrength.AMOR_APRENDIZADO,    virtue: VirtueCategory.SABEDORIA,       label: 'Amor ao Aprendizado', items: [5, 17, 45] },
  { strength: CharacterStrength.SENSATEZ,            virtue: VirtueCategory.SABEDORIA,       label: 'Sensatez',            items: [4, 63, 6] },

  // --- 2. CORAGEM ---
  { strength: CharacterStrength.BRAVURA,             virtue: VirtueCategory.CORAGEM,         label: 'Bravura',             items: [35, 57, 67] },
  { strength: CharacterStrength.PERSEVERANCA,        virtue: VirtueCategory.CORAGEM,         label: 'Perseverança',        items: [40, 47, 52] },
  { strength: CharacterStrength.AUTENTICIDADE,       virtue: VirtueCategory.CORAGEM,         label: 'Autenticidade',       items: [10, 33, 41] },
  { strength: CharacterStrength.VITALIDADE,          virtue: VirtueCategory.CORAGEM,         label: 'Vitalidade',          items: [13, 18, 53] },

  // --- 3. HUMANIDADE ---
  { strength: CharacterStrength.AMOR,                virtue: VirtueCategory.HUMANIDADE,      label: 'Amor',                items: [16, 37, 70] },
  { strength: CharacterStrength.BONDADE,             virtue: VirtueCategory.HUMANIDADE,      label: 'Bondade',             items: [21, 50, 66] },
  { strength: CharacterStrength.INTELIGENCIA_SOCIAL, virtue: VirtueCategory.HUMANIDADE,      label: 'Inteligência Social', items: [1, 20, 59] },

  // --- 4. JUSTIÇA ---
  { strength: CharacterStrength.CIDADANIA,           virtue: VirtueCategory.JUSTICA,         label: 'Cidadania',           items: [31, 34, 61] },
  { strength: CharacterStrength.IMPARCIALIDADE,      virtue: VirtueCategory.JUSTICA,         label: 'Imparcialidade',      items: [2, 58, 68] },
  { strength: CharacterStrength.LIDERANCA,           virtue: VirtueCategory.JUSTICA,         label: 'Liderança',           items: [19, 62, 55] },

  // --- 5. MODERAÇÃO ---
  { strength: CharacterStrength.PERDAO,              virtue: VirtueCategory.MODERACAO,       label: 'Perdão',              items: [26, 32, 54] },
  { strength: CharacterStrength.MODESTIA,            virtue: VirtueCategory.MODERACAO,       label: 'Modéstia',            items: [11, 46, 56] },
  { strength: CharacterStrength.PRUDENCIA,           virtue: VirtueCategory.MODERACAO,       label: 'Prudência',           items: [29, 36, 65] },
  { strength: CharacterStrength.AUTORREGULACAO,      virtue: VirtueCategory.MODERACAO,       label: 'Autorregulação',      items: [12, 38, 60] },

  // --- 6. TRANSCENDÊNCIA ---
  { strength: CharacterStrength.APRECIACAO_BELO,     virtue: VirtueCategory.TRANSCENDENCIA,  label: 'Apreciação ao Belo',  items: [39, 43] },  // Nota: apenas 2 itens
  { strength: CharacterStrength.GRATIDAO,            virtue: VirtueCategory.TRANSCENDENCIA,  label: 'Gratidão',            items: [22, 24, 44] },
  { strength: CharacterStrength.HUMOR,               virtue: VirtueCategory.TRANSCENDENCIA,  label: 'Humor',               items: [14, 42, 64] },
  { strength: CharacterStrength.ESPERANCA,           virtue: VirtueCategory.TRANSCENDENCIA,  label: 'Esperança',           items: [15, 27, 49] },
  { strength: CharacterStrength.ESPIRITUALIDADE,     virtue: VirtueCategory.TRANSCENDENCIA,  label: 'Espiritualidade',     items: [8, 28, 51] },
];

// ============================================================
// 2. SRSS-IE: Definição dos Itens e Pontos de Corte
//    Extraído do Protocolo SRSS-IE.pdf
//    Escala: 0=Nunca, 1=Ocasionalmente, 2=Frequentemente, 3=Muito Frequentemente
// ============================================================

export const SRSS_ITEMS = {
  externalizing: [
    { item: 1,  label: 'Furto / Pegar coisas sem permissão' },
    { item: 2,  label: 'Mentira, trapaça ou dissimulação' },
    { item: 3,  label: 'Problemas de comportamento (indisciplina ativa)' },
    { item: 4,  label: 'Rejeição pelos colegas (isolado pelo grupo)' },
    { item: 5,  label: 'Baixo desempenho acadêmico (aquém do potencial)' },
    { item: 6,  label: 'Atitude negativa / Desafiadora' },
    { item: 7,  label: 'Comportamento agressivo (físico ou verbal)' },
  ],
  internalizing: [
    { item: 8,  label: 'Apatia emocional (pouca expressão facial/reação)' },
    { item: 9,  label: 'Tímido / Retraído / Evita interação' },
    { item: 10, label: 'Triste / Deprimido / Melancólico' },
    { item: 11, label: 'Ansioso / Nervoso / Preocupado excessivamente' },
    { item: 12, label: 'Solitário (passa intervalos sozinho)' },
  ],
} as const;

/** Pontos de corte para Ensino Médio (extraídos do protocolo) */
export const SRSS_CUTOFFS = {
  externalizing: {
    maxPossible: 21,
    // Verde: 0-3, Amarelo: 4-8, Vermelho: 9-21
    [RiskTier.TIER_1]: { min: 0, max: 3 },
    [RiskTier.TIER_2]: { min: 4, max: 8 },
    [RiskTier.TIER_3]: { min: 9, max: 21 },
  },
  internalizing: {
    maxPossible: 15,
    // Verde: 0-3, Amarelo: 4-5, Vermelho: 6-15
    [RiskTier.TIER_1]: { min: 0, max: 3 },
    [RiskTier.TIER_2]: { min: 4, max: 5 },
    [RiskTier.TIER_3]: { min: 6, max: 15 },
  },
} as const;

// ============================================================
// 3. DIFERENCIAÇÃO POR SÉRIE: Itens críticos por ano
//    Extraído do RTI Socioemocional.pdf, Seção 4
// ============================================================

export const GRADE_FOCUS_ITEMS: Record<GradeLevel, {
  label: string;
  focusItems: { item: number; severity: 'WATCH' | 'CRITICAL'; rationale: string }[];
}> = {
  [GradeLevel.PRIMEIRO_ANO]: {
    label: '1ª Série - Foco na Adaptação',
    focusItems: [
      { item: 4,  severity: 'CRITICAL', rationale: 'Rejeição pelos colegas indica falha na integração ao Ensino Médio. Risco de evasão precoce.' },
      { item: 12, severity: 'CRITICAL', rationale: 'Solidão indica falha na construção de vínculos na transição. Necessidade de acolhimento estruturado.' },
      { item: 9,  severity: 'WATCH',    rationale: 'Retraimento pode indicar ansiedade social na adaptação ao novo ambiente escolar.' },
    ],
  },
  [GradeLevel.SEGUNDO_ANO]: {
    label: '2ª Série - Foco no Comportamento',
    focusItems: [
      { item: 3,  severity: 'CRITICAL', rationale: 'Indisciplina ativa é comum na fase de teste de limites. Necessidade de grupo de habilidades sociais.' },
      { item: 6,  severity: 'CRITICAL', rationale: 'Atitude desafiadora indica desengajamento escolar. Risco de deterioração do clima da turma.' },
      { item: 7,  severity: 'WATCH',    rationale: 'Agressividade nesta fase pode escalar para conflitos sérios com pares.' },
    ],
  },
  [GradeLevel.TERCEIRO_ANO]: {
    label: '3ª Série - Foco na Ansiedade',
    focusItems: [
      { item: 11, severity: 'CRITICAL', rationale: 'Ansiedade elevada sugere crise pré-vestibular/burnout. Contexto de "Ansiedade de Futuro".' },
      { item: 5,  severity: 'CRITICAL', rationale: 'Queda abrupta de desempenho no 3º ano pode indicar paralisia decisória ou burnout acadêmico.' },
      { item: 10, severity: 'WATCH',    rationale: 'Tristeza/depressão pode ser amplificada pela pressão de saída (ENEM, mercado de trabalho).' },
    ],
  },
};

// ============================================================
// 4. CRUZAMENTO PREDITIVO: Risco × Forças → Intervenção
//    Lógica: se o aluno está em Tier 3, usar suas forças de
//    assinatura como alavanca para a intervenção
// ============================================================

const INTERVENTION_MATRIX: Record<string, {
  leverageStrengths: CharacterStrength[];
  strategy: string;
  rationale: string;
}> = {
  // Riscos internalizantes × forças que podem mitigar
  'Apatia emocional': {
    leverageStrengths: [CharacterStrength.CRIATIVIDADE, CharacterStrength.HUMOR, CharacterStrength.VITALIDADE],
    strategy: 'Oficinas de expressão criativa (arte, escrita, teatro) para reativar a expressão emocional através do canal onde o aluno já demonstra competência.',
    rationale: 'A criatividade e o humor são vias de expressão indireta que contornam a resistência emocional típica da apatia.',
  },
  'Timidez/Retraimento': {
    leverageStrengths: [CharacterStrength.BONDADE, CharacterStrength.AMOR_APRENDIZADO, CharacterStrength.CURIOSIDADE],
    strategy: 'Atividades de tutoria entre pares onde o aluno ajuda outros em matérias que domina, criando interações estruturadas e seguras.',
    rationale: 'Tímidos se engajam mais quando a interação tem um propósito claro e valoriza sua competência.',
  },
  'Tristeza/Depressão': {
    leverageStrengths: [CharacterStrength.ESPERANCA, CharacterStrength.GRATIDAO, CharacterStrength.ESPIRITUALIDADE],
    strategy: 'Diário de gratidão guiado + exercícios de visualização de futuro positivo. Conectar com rede de apoio espiritual se relevante para o aluno.',
    rationale: 'Forças de transcendência oferecem sentido e perspectiva temporal, fundamentais para combater a desesperança.',
  },
  'Ansiedade': {
    leverageStrengths: [CharacterStrength.AUTORREGULACAO, CharacterStrength.PRUDENCIA, CharacterStrength.PERSEVERANCA],
    strategy: 'Oficina de gestão de ansiedade com técnicas de respiração e reestruturação cognitiva. Usar a prudência como âncora para planejamento realista.',
    rationale: 'Alunos com alta autorregulação e prudência já possuem o substrato para técnicas de coping; precisam apenas de ferramentas específicas.',
  },
  'Solidão': {
    leverageStrengths: [CharacterStrength.CIDADANIA, CharacterStrength.INTELIGENCIA_SOCIAL, CharacterStrength.LIDERANCA],
    strategy: 'Inserção gradual em projetos de grupo com papéis definidos. Mentoria "padrinho" com aluno de 2ª série que tem alta Amabilidade.',
    rationale: 'A solidão se rompe por conexão com propósito. Se o aluno tem força em cidadania ou liderança, dar-lhe um papel no grupo.',
  },
  // Riscos externalizantes sem mapeamento anterior (I4)
  'Furto': {
    leverageStrengths: [CharacterStrength.IMPARCIALIDADE, CharacterStrength.AUTENTICIDADE, CharacterStrength.PRUDENCIA],
    strategy: 'Trabalho de ética e responsabilidade: dilemas morais em grupo, restituição simbólica, reflexão sobre consequências com foco em valores pessoais.',
    rationale: 'Imparcialidade e autenticidade ajudam o aluno a internalizar normas sociais; prudência desenvolve a reflexão antes da ação.',
  },
  'Mentira': {
    leverageStrengths: [CharacterStrength.AUTENTICIDADE, CharacterStrength.IMPARCIALIDADE, CharacterStrength.INTELIGENCIA_SOCIAL],
    strategy: 'Círculos restaurativos de confiança + exercícios de comunicação assertiva. Valorizar a autenticidade como força, não como fraqueza.',
    rationale: 'A mentira frequentemente vem da percepção de que a verdade é perigosa. Reforçar autenticidade como virtude reduz a necessidade de dissimulação.',
  },
  'Rejeição pelos colegas': {
    leverageStrengths: [CharacterStrength.CIDADANIA, CharacterStrength.BONDADE, CharacterStrength.INTELIGENCIA_SOCIAL],
    strategy: 'Programa de inclusão com papel definido em projetos coletivos. Mentoria "padrinho" com aluno sociável. Treino de habilidades sociais (Del Prette).',
    rationale: 'A rejeição se combate com pertencimento. Se o aluno tem cidadania ou bondade, dar-lhe função visível no grupo constrói aceitação.',
  },
  // Riscos externalizantes × forças que podem mitigar
  'Indisciplina': {
    leverageStrengths: [CharacterStrength.LIDERANCA, CharacterStrength.CRIATIVIDADE, CharacterStrength.BRAVURA],
    strategy: 'Canalizar a energia para liderança positiva: mediador de conflitos na turma, líder de projeto comunitário, ou desafios criativos.',
    rationale: 'A indisciplina frequentemente mascara energia não canalizada. Liderança e bravura redirecionadas geram engajamento.',
  },
  'Agressividade': {
    leverageStrengths: [CharacterStrength.AUTORREGULACAO, CharacterStrength.PERDAO, CharacterStrength.IMPARCIALIDADE],
    strategy: 'Treinamento de habilidades sociais (Método Del Prette): role-playing de situações de conflito com resposta assertiva não-violenta.',
    rationale: 'A autorregulação e o perdão são os antídotos diretos da agressividade reativa.',
  },
  'Atitude desafiadora': {
    leverageStrengths: [CharacterStrength.PENSAMENTO_CRITICO, CharacterStrength.AUTENTICIDADE, CharacterStrength.SENSATEZ],
    strategy: 'Debates estruturados e parlamento estudantil. Transformar a oposição em pensamento crítico construtivo.',
    rationale: 'A atitude desafiadora pode ser expressão distorcida de autenticidade e pensamento crítico.',
  },
  'Baixo desempenho': {
    leverageStrengths: [CharacterStrength.PERSEVERANCA, CharacterStrength.AMOR_APRENDIZADO, CharacterStrength.CURIOSIDADE],
    strategy: 'Ensino explícito de hábitos de estudo + metas semanais com reforço positivo. Conectar conteúdo à curiosidade natural do aluno.',
    rationale: 'Se o aluno tem curiosidade mas baixo desempenho, o problema é metodológico, não motivacional.',
  },
};

// ============================================================
// 5. FUNÇÕES DE CÁLCULO
// ============================================================

/** Calcula os scores das 24 forças de caráter a partir das respostas do questionário VIA */
export function calculateStrengthScores(answers: VIARawAnswers): StrengthScore[] {
  return VIA_STRENGTH_MAP.map((def) => {
    const rawSum = def.items.reduce((sum, item) => {
      const val = answers[item];
      if (val === undefined || val === null) {
        throw new Error(`Resposta ausente para o item ${item} (Força: ${def.label})`);
      }
      if (val < 0 || val > 4) {
        throw new Error(`Valor inválido ${val} para item ${item}. Esperado: 0-4`);
      }
      return sum + val;
    }, 0);

    const maxPossible = def.items.length * 4;

    return {
      strength: def.strength,
      virtue: def.virtue,
      label: def.label,
      items: def.items,
      rawSum,
      maxPossible,
      normalizedScore: Math.round((rawSum / maxPossible) * 100),
    };
  });
}

/** Classifica uma pontuação de subescala SRSS-IE no Tier correspondente */
function classifyRiskTier(
  score: number,
  domain: 'externalizing' | 'internalizing'
): { tier: RiskTier; color: RiskColor } {
  const cutoffs = SRSS_CUTOFFS[domain];

  if (score <= cutoffs[RiskTier.TIER_1].max) {
    return { tier: RiskTier.TIER_1, color: RiskColor.GREEN };
  }
  if (score <= cutoffs[RiskTier.TIER_2].max) {
    return { tier: RiskTier.TIER_2, color: RiskColor.YELLOW };
  }
  return { tier: RiskTier.TIER_3, color: RiskColor.RED };
}

/** Calcula os resultados das subescalas SRSS-IE */
export function calculateRiskScores(answers: SRSSRawAnswers): {
  externalizing: RiskSubscaleResult;
  internalizing: RiskSubscaleResult;
} {
  // Validação
  for (let i = 1; i <= 12; i++) {
    const val = answers[i];
    if (val === undefined || val === null) {
      throw new Error(`Resposta ausente para o item SRSS-IE ${i}`);
    }
    if (val < 0 || val > 3) {
      throw new Error(`Valor inválido ${val} para item SRSS-IE ${i}. Esperado: 0-3`);
    }
  }

  // Subescala Externalizante: soma itens 1-7
  const extScore = [1, 2, 3, 4, 5, 6, 7].reduce((sum, i) => sum + answers[i], 0);
  const extClass = classifyRiskTier(extScore, 'externalizing');

  // Subescala Internalizante: soma itens 8-12
  const intScore = [8, 9, 10, 11, 12].reduce((sum, i) => sum + answers[i], 0);
  const intClass = classifyRiskTier(intScore, 'internalizing');

  const tierLabels: Record<RiskTier, string> = {
    [RiskTier.TIER_1]: 'Baixo Risco - Camada 1 (Universal)',
    [RiskTier.TIER_2]: 'Risco Moderado - Camada 2 (Focalizada)',
    [RiskTier.TIER_3]: 'Alto Risco - Camada 3 (Intensiva)',
  };

  return {
    externalizing: {
      domain: RiskDomain.EXTERNALIZING,
      score: extScore,
      maxPossible: 21,
      tier: extClass.tier,
      color: extClass.color,
      label: tierLabels[extClass.tier],
    },
    internalizing: {
      domain: RiskDomain.INTERNALIZING,
      score: intScore,
      maxPossible: 15,
      tier: intClass.tier,
      color: intClass.color,
      label: tierLabels[intClass.tier],
    },
  };
}

/** Gera alertas específicos por série com base nos itens SRSS-IE críticos */
export function generateGradeAlerts(
  srssAnswers: SRSSRawAnswers,
  grade: GradeLevel
): GradeSpecificAlert[] {
  const gradeFocus = GRADE_FOCUS_ITEMS[grade];
  const alerts: GradeSpecificAlert[] = [];

  for (const focus of gradeFocus.focusItems) {
    const score = srssAnswers[focus.item];
    // Alerta se score >= 2 (Frequentemente ou Muito Frequentemente)
    if (score >= 2) {
      const itemDef = [...SRSS_ITEMS.externalizing, ...SRSS_ITEMS.internalizing]
        .find(i => i.item === focus.item);

      alerts.push({
        itemNumber: focus.item,
        itemLabel: itemDef?.label ?? `Item ${focus.item}`,
        score,
        severity: focus.severity,
        rationale: focus.rationale,
      });
    }
  }

  return alerts;
}

/** Gera sugestões de intervenção cruzando risco com forças de assinatura */
export function generateInterventionSuggestions(
  risk: { externalizing: RiskSubscaleResult; internalizing: RiskSubscaleResult },
  srssAnswers: SRSSRawAnswers,
  signatureStrengths: StrengthScore[]
): InterventionSuggestion[] {
  const suggestions: InterventionSuggestion[] = [];
  const topStrengths = new Set(signatureStrengths.map(s => s.strength));

  // Mapear itens SRSS-IE elevados (>= 2) aos riscos correspondentes
  const riskItemMapping: { item: number; riskLabel: string }[] = [
    { item: 1,  riskLabel: 'Furto' },
    { item: 2,  riskLabel: 'Mentira' },
    { item: 3,  riskLabel: 'Indisciplina' },
    { item: 4,  riskLabel: 'Rejeição pelos colegas' },
    { item: 5,  riskLabel: 'Baixo desempenho' },
    { item: 6,  riskLabel: 'Atitude desafiadora' },
    { item: 7,  riskLabel: 'Agressividade' },
    { item: 8,  riskLabel: 'Apatia emocional' },
    { item: 9,  riskLabel: 'Timidez/Retraimento' },
    { item: 10, riskLabel: 'Tristeza/Depressão' },
    { item: 11, riskLabel: 'Ansiedade' },
    { item: 12, riskLabel: 'Solidão' },
  ];

  for (const mapping of riskItemMapping) {
    const score = srssAnswers[mapping.item];
    if (score < 2) continue;

    const matrix = INTERVENTION_MATRIX[mapping.riskLabel];
    if (!matrix) continue;

    // Encontrar a melhor força de assinatura que casa com a intervenção
    const matchingStrength = matrix.leverageStrengths.find(s => topStrengths.has(s));
    // Fallback (I5): se nenhuma força de assinatura casa, usar a primeira força sugerida pela matriz
    const selectedStrength = matchingStrength ?? matrix.leverageStrengths[0];
    const strengthDef = VIA_STRENGTH_MAP.find(d => d.strength === selectedStrength);
    suggestions.push({
      targetRisk: mapping.riskLabel,
      leverageStrength: selectedStrength,
      strengthLabel: strengthDef?.label ?? selectedStrength,
      strategy: matrix.strategy,
      rationale: matchingStrength
        ? matrix.rationale
        : `${matrix.rationale} (Nota: nenhuma das forças de assinatura do aluno coincide com as forças ideais para esta intervenção. Recomenda-se desenvolver ${strengthDef?.label ?? selectedStrength} como parte do plano.)`,
    });
  }

  return suggestions;
}

// ============================================================
// 6. FUNÇÃO PRINCIPAL: calculateStudentProfile
// ============================================================

/**
 * Calcula o perfil completo do aluno integrando:
 * - Nível de Risco (SRSS-IE → Tier)
 * - 24 Forças de Caráter (VIA → Top 5 assinatura)
 * - Alertas específicos por série
 * - Sugestões de intervenção cruzadas (Risco × Forças)
 */
export function calculateStudentProfile(
  viaAnswers: VIARawAnswers,
  srssAnswers: SRSSRawAnswers,
  grade: GradeLevel
): StudentProfile {
  // 1. Calcular forças
  const allStrengths = calculateStrengthScores(viaAnswers);
  const sorted = [...allStrengths].sort((a, b) => b.normalizedScore - a.normalizedScore);
  const signatureStrengths = sorted.slice(0, 5);
  const developmentAreas = sorted.slice(-5).reverse();

  // 2. Calcular risco
  const risk = calculateRiskScores(srssAnswers);

  // 3. Tier geral = o PIOR entre externalizante e internalizante
  const tierOrder = [RiskTier.TIER_1, RiskTier.TIER_2, RiskTier.TIER_3];
  const overallTierIndex = Math.max(
    tierOrder.indexOf(risk.externalizing.tier),
    tierOrder.indexOf(risk.internalizing.tier)
  );
  const overallTier = tierOrder[overallTierIndex];
  const colorMap: Record<RiskTier, RiskColor> = {
    [RiskTier.TIER_1]: RiskColor.GREEN,
    [RiskTier.TIER_2]: RiskColor.YELLOW,
    [RiskTier.TIER_3]: RiskColor.RED,
  };

  // 4. Alertas por série
  const gradeAlerts = generateGradeAlerts(srssAnswers, grade);

  // 5. Sugestões de intervenção (apenas se Tier 2 ou 3)
  let interventionSuggestions: InterventionSuggestion[] = [];
  if (overallTier !== RiskTier.TIER_1) {
    interventionSuggestions = generateInterventionSuggestions(
      risk,
      srssAnswers,
      signatureStrengths
    );
  }

  return {
    externalizing: risk.externalizing,
    internalizing: risk.internalizing,
    overallTier,
    overallColor: colorMap[overallTier],
    allStrengths,
    signatureStrengths,
    developmentAreas,
    gradeAlerts,
    interventionSuggestions,
  };
}
