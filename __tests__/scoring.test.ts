import { describe, it, expect } from 'vitest';
import {
    calculateStrengthScores,
    calculateRiskScores,
    generateGradeAlerts,
    calculateStudentProfile,
    VIA_STRENGTH_MAP,
} from '@core/logic/scoring';
import {
    RiskTier,
    RiskColor,
    GradeLevel,
    VIARawAnswers,
    SRSSRawAnswers,
    CharacterStrength,
} from '@core/types';

// ============================================================
// HELPERS
// ============================================================

/** Gera respostas VIA completas (71 itens) com um valor padrão */
function makeVIAAnswers(defaultValue: number = 2): VIARawAnswers {
    const answers: VIARawAnswers = {};
    for (let i = 1; i <= 71; i++) {
        answers[i] = defaultValue;
    }
    return answers;
}

/** Gera respostas SRSS-IE completas (12 itens) com um valor padrão */
function makeSRSSAnswers(defaultValue: number = 0): SRSSRawAnswers {
    const answers: SRSSRawAnswers = {};
    for (let i = 1; i <= 12; i++) {
        answers[i] = defaultValue;
    }
    return answers;
}

// ============================================================
// VIA CHARACTER STRENGTHS TESTS
// ============================================================

describe('calculateStrengthScores', () => {
    it('calcula 24 forças corretamente com respostas uniformes', () => {
        const answers = makeVIAAnswers(3); // Todas as respostas = 3
        const scores = calculateStrengthScores(answers);

        expect(scores).toHaveLength(24);

        // Cada força com 3 itens: soma = 3*3 = 9, max = 12, normalized = 75%
        const threeItemStrength = scores.find(
            (s) => s.strength === CharacterStrength.CRIATIVIDADE
        );
        expect(threeItemStrength).toBeDefined();
        expect(threeItemStrength!.rawSum).toBe(9);
        expect(threeItemStrength!.maxPossible).toBe(12);
        expect(threeItemStrength!.normalizedScore).toBe(75);

        // Apreciação ao Belo tem apenas 2 itens: soma = 3*2 = 6, max = 8, normalized = 75%
        const twoItemStrength = scores.find(
            (s) => s.strength === CharacterStrength.APRECIACAO_BELO
        );
        expect(twoItemStrength).toBeDefined();
        expect(twoItemStrength!.rawSum).toBe(6);
        expect(twoItemStrength!.maxPossible).toBe(8);
        expect(twoItemStrength!.normalizedScore).toBe(75);
    });

    it('retorna score máximo (100%) quando todas respostas são 4', () => {
        const answers = makeVIAAnswers(4);
        const scores = calculateStrengthScores(answers);

        scores.forEach((score) => {
            expect(score.normalizedScore).toBe(100);
        });
    });

    it('retorna score mínimo (0%) quando todas respostas são 0', () => {
        const answers = makeVIAAnswers(0);
        const scores = calculateStrengthScores(answers);

        scores.forEach((score) => {
            expect(score.normalizedScore).toBe(0);
            expect(score.rawSum).toBe(0);
        });
    });

    it('ordena top 5 signature strengths corretamente', () => {
        const answers = makeVIAAnswers(2);

        // Tornar Criatividade (itens 3, 30, 48) a mais forte
        answers[3] = 4;
        answers[30] = 4;
        answers[48] = 4;

        // E Humor (itens 14, 42, 64) a segunda mais forte
        answers[14] = 4;
        answers[42] = 4;
        answers[64] = 3;

        const scores = calculateStrengthScores(answers);
        const sorted = [...scores].sort(
            (a, b) => b.normalizedScore - a.normalizedScore
        );
        const top5 = sorted.slice(0, 5);

        expect(top5[0].strength).toBe(CharacterStrength.CRIATIVIDADE);
        expect(top5[0].normalizedScore).toBe(100); // 12/12
    });

    it('lança erro se um item está faltando', () => {
        const answers = makeVIAAnswers(2);
        delete (answers as any)[1]; // Remove item 1

        expect(() => calculateStrengthScores(answers)).toThrow(
            /Resposta ausente para o item 1/
        );
    });

    it('lança erro se um valor está fora do range 0-4', () => {
        const answers = makeVIAAnswers(2);
        answers[1] = 5;

        expect(() => calculateStrengthScores(answers)).toThrow(
            /Valor inválido 5 para item 1/
        );
    });

    it('cobre todas as 24 forças mapeadas', () => {
        expect(VIA_STRENGTH_MAP).toHaveLength(24);

        // Verificar que todos os itens de 1-71 estão mapeados pelo menos uma vez
        const allItems = new Set<number>();
        VIA_STRENGTH_MAP.forEach((def) => {
            def.items.forEach((item) => allItems.add(item));
        });

        // Nota: nem todos os 71 itens precisam estar mapeados (alguns itens podem não estar em nenhuma força)
        // Mas todos os mapeados devem estar no range 1-71
        allItems.forEach((item) => {
            expect(item).toBeGreaterThanOrEqual(1);
            expect(item).toBeLessThanOrEqual(71);
        });
    });
});

// ============================================================
// SRSS-IE RISK SCORING TESTS
// ============================================================

describe('calculateRiskScores', () => {
    it('classifica TIER_1 (verde) quando todos os scores são 0', () => {
        const answers = makeSRSSAnswers(0);
        const result = calculateRiskScores(answers);

        expect(result.externalizing.tier).toBe(RiskTier.TIER_1);
        expect(result.externalizing.color).toBe(RiskColor.GREEN);
        expect(result.externalizing.score).toBe(0);

        expect(result.internalizing.tier).toBe(RiskTier.TIER_1);
        expect(result.internalizing.color).toBe(RiskColor.GREEN);
        expect(result.internalizing.score).toBe(0);
    });

    it('classifica TIER_1 no limite exato (ext=3, int=3)', () => {
        const answers = makeSRSSAnswers(0);
        // Externalizing: itens 1-7, precisa somar exatamente 3
        answers[1] = 1;
        answers[2] = 1;
        answers[3] = 1;
        // Internalizing: itens 8-12, precisa somar exatamente 3
        answers[8] = 1;
        answers[9] = 1;
        answers[10] = 1;

        const result = calculateRiskScores(answers);

        expect(result.externalizing.tier).toBe(RiskTier.TIER_1);
        expect(result.externalizing.score).toBe(3);

        expect(result.internalizing.tier).toBe(RiskTier.TIER_1);
        expect(result.internalizing.score).toBe(3);
    });

    it('classifica TIER_2 (amarelo) no limite inferior (ext=4, int=4)', () => {
        const answers = makeSRSSAnswers(0);
        // Externalizing: soma = 4
        answers[1] = 2;
        answers[2] = 2;
        // Internalizing: soma = 4
        answers[8] = 2;
        answers[9] = 2;

        const result = calculateRiskScores(answers);

        expect(result.externalizing.tier).toBe(RiskTier.TIER_2);
        expect(result.externalizing.color).toBe(RiskColor.YELLOW);

        expect(result.internalizing.tier).toBe(RiskTier.TIER_2);
        expect(result.internalizing.color).toBe(RiskColor.YELLOW);
    });

    it('classifica TIER_2 no limite superior (ext=8, int=5)', () => {
        const answers = makeSRSSAnswers(0);
        // Externalizing: soma = 8
        answers[1] = 3;
        answers[2] = 3;
        answers[3] = 2;
        // Internalizing: soma = 5
        answers[8] = 2;
        answers[9] = 2;
        answers[10] = 1;

        const result = calculateRiskScores(answers);

        expect(result.externalizing.tier).toBe(RiskTier.TIER_2);
        expect(result.externalizing.score).toBe(8);

        expect(result.internalizing.tier).toBe(RiskTier.TIER_2);
        expect(result.internalizing.score).toBe(5);
    });

    it('classifica TIER_3 (vermelho) no limite inferior (ext=9, int=6)', () => {
        const answers = makeSRSSAnswers(0);
        // Externalizing: soma = 9
        answers[1] = 3;
        answers[2] = 3;
        answers[3] = 3;
        // Internalizing: soma = 6
        answers[8] = 2;
        answers[9] = 2;
        answers[10] = 2;

        const result = calculateRiskScores(answers);

        expect(result.externalizing.tier).toBe(RiskTier.TIER_3);
        expect(result.externalizing.color).toBe(RiskColor.RED);
        expect(result.externalizing.score).toBe(9);

        expect(result.internalizing.tier).toBe(RiskTier.TIER_3);
        expect(result.internalizing.color).toBe(RiskColor.RED);
        expect(result.internalizing.score).toBe(6);
    });

    it('classifica TIER_3 no score máximo (ext=21, int=15)', () => {
        const answers = makeSRSSAnswers(3); // Todos os itens = 3 (máximo)
        const result = calculateRiskScores(answers);

        expect(result.externalizing.tier).toBe(RiskTier.TIER_3);
        expect(result.externalizing.score).toBe(21); // 7 * 3
        expect(result.externalizing.maxPossible).toBe(21);

        expect(result.internalizing.tier).toBe(RiskTier.TIER_3);
        expect(result.internalizing.score).toBe(15); // 5 * 3
        expect(result.internalizing.maxPossible).toBe(15);
    });

    it('lança erro se item SRSS-IE está faltando', () => {
        const answers = makeSRSSAnswers(0);
        delete (answers as any)[1];

        expect(() => calculateRiskScores(answers)).toThrow(
            /Resposta ausente para o item SRSS-IE 1/
        );
    });

    it('lança erro se valor SRSS-IE fora do range 0-3', () => {
        const answers = makeSRSSAnswers(0);
        answers[1] = 4;

        expect(() => calculateRiskScores(answers)).toThrow(
            /Valor inválido 4 para item SRSS-IE 1/
        );
    });
});

// ============================================================
// GRADE-SPECIFIC ALERTS TESTS
// ============================================================

describe('generateGradeAlerts', () => {
    it('gera alertas CRITICAL para 1ª série com itens 4 e 12 elevados', () => {
        const answers = makeSRSSAnswers(0);
        answers[4] = 2; // Rejeição (CRITICAL para 1ª série)
        answers[12] = 3; // Solidão (CRITICAL para 1ª série)

        const alerts = generateGradeAlerts(answers, GradeLevel.PRIMEIRO_ANO);

        expect(alerts).toHaveLength(2);
        expect(alerts[0].severity).toBe('CRITICAL');
        expect(alerts[0].itemNumber).toBe(4);
        expect(alerts[1].severity).toBe('CRITICAL');
        expect(alerts[1].itemNumber).toBe(12);
    });

    it('não gera alerta quando scores são baixos (< 2)', () => {
        const answers = makeSRSSAnswers(1); // Todos = 1 (< 2)
        const alerts = generateGradeAlerts(answers, GradeLevel.PRIMEIRO_ANO);

        expect(alerts).toHaveLength(0);
    });

    it('gera alertas corretos para 2ª série (indisciplina + desafio)', () => {
        const answers = makeSRSSAnswers(0);
        answers[3] = 3; // Indisciplina (CRITICAL para 2ª série)
        answers[6] = 2; // Desafiador (CRITICAL para 2ª série)
        answers[7] = 2; // Agressividade (WATCH para 2ª série)

        const alerts = generateGradeAlerts(answers, GradeLevel.SEGUNDO_ANO);

        expect(alerts).toHaveLength(3);
        const criticals = alerts.filter((a) => a.severity === 'CRITICAL');
        const watches = alerts.filter((a) => a.severity === 'WATCH');
        expect(criticals).toHaveLength(2);
        expect(watches).toHaveLength(1);
    });

    it('gera alertas corretos para 3ª série (ansiedade + queda acadêmica)', () => {
        const answers = makeSRSSAnswers(0);
        answers[11] = 3; // Ansiedade (CRITICAL para 3ª série)
        answers[5] = 2; // Baixo desempenho (CRITICAL para 3ª série)

        const alerts = generateGradeAlerts(answers, GradeLevel.TERCEIRO_ANO);

        expect(alerts).toHaveLength(2);
        expect(alerts.every((a) => a.severity === 'CRITICAL')).toBe(true);
    });
});

// ============================================================
// STUDENT PROFILE INTEGRATION TESTS
// ============================================================

describe('calculateStudentProfile', () => {
    it('calcula perfil completo com tier geral = o pior dos dois domínios', () => {
        const via = makeVIAAnswers(3);
        const srss = makeSRSSAnswers(0);
        // Internalizing alto (TIER_3), externalizing baixo (TIER_1)
        srss[8] = 3;
        srss[9] = 3; // soma int = 6 → TIER_3

        const profile = calculateStudentProfile(
            via,
            srss,
            GradeLevel.PRIMEIRO_ANO
        );

        expect(profile.externalizing.tier).toBe(RiskTier.TIER_1);
        expect(profile.internalizing.tier).toBe(RiskTier.TIER_3);
        // Overall = pior dos dois
        expect(profile.overallTier).toBe(RiskTier.TIER_3);
        expect(profile.overallColor).toBe(RiskColor.RED);
    });

    it('retorna 24 forças e 5 signature strengths', () => {
        const via = makeVIAAnswers(2);
        const srss = makeSRSSAnswers(0);

        const profile = calculateStudentProfile(
            via,
            srss,
            GradeLevel.PRIMEIRO_ANO
        );

        expect(profile.allStrengths).toHaveLength(24);
        expect(profile.signatureStrengths).toHaveLength(5);
        expect(profile.developmentAreas).toHaveLength(5);
    });

    it('gera sugestões de intervenção apenas para TIER_2 ou TIER_3', () => {
        const via = makeVIAAnswers(3);

        // TIER_1: sem sugestões
        const srssTier1 = makeSRSSAnswers(0);
        const profileTier1 = calculateStudentProfile(
            via,
            srssTier1,
            GradeLevel.PRIMEIRO_ANO
        );
        expect(profileTier1.interventionSuggestions).toHaveLength(0);

        // TIER_3: com sugestões
        const srssTier3 = makeSRSSAnswers(2); // Score alto em tudo
        const profileTier3 = calculateStudentProfile(
            via,
            srssTier3,
            GradeLevel.PRIMEIRO_ANO
        );
        expect(profileTier3.interventionSuggestions.length).toBeGreaterThan(0);
    });

    it('inclui alertas grade-specific no perfil', () => {
        const via = makeVIAAnswers(2);
        const srss = makeSRSSAnswers(0);
        srss[11] = 3; // Ansiedade alta
        srss[5] = 2; // Baixo desempenho

        const profile = calculateStudentProfile(
            via,
            srss,
            GradeLevel.TERCEIRO_ANO
        );

        expect(profile.gradeAlerts.length).toBeGreaterThan(0);
        expect(profile.gradeAlerts.some((a) => a.itemNumber === 11)).toBe(true);
    });
});
