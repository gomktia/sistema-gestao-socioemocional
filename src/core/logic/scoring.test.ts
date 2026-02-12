import { describe, it, expect } from 'vitest';
import {
    calculateRiskScores,
    calculateStrengthScores,
    generateGradeAlerts,
    calculateStudentProfile,
} from './scoring';
import {
    RiskTier,
    RiskColor,
    GradeLevel,
    VIARawAnswers,
    SRSSRawAnswers,
} from '../types';

// ============================================================
// HELPERS
// ============================================================

function makeSRSSAnswers(defaultValue: number = 0): SRSSRawAnswers {
    const answers: SRSSRawAnswers = {};
    for (let i = 1; i <= 12; i++) answers[i] = defaultValue;
    return answers;
}

function makeVIAAnswers(defaultValue: number = 2): VIARawAnswers {
    const answers: VIARawAnswers = {};
    for (let i = 1; i <= 71; i++) answers[i] = defaultValue;
    return answers;
}

// ============================================================
// SRSS-IE TIER CLASSIFICATION
// Cutoffs Externalizante: Verde 0-3 | Amarelo 4-8 | Vermelho 9-21
// Cutoffs Internalizante: Verde 0-3 | Amarelo 4-5 | Vermelho 6-15
// ============================================================

describe('SRSS-IE Tier Classification', () => {

    // --- TIER 1 (VERDE) ---

    describe('TIER_1 (Verde) — Baixo Risco', () => {
        it('score 0 em ambos os domínios → VERDE', () => {
            const result = calculateRiskScores(makeSRSSAnswers(0));

            expect(result.externalizing.tier).toBe(RiskTier.TIER_1);
            expect(result.externalizing.color).toBe(RiskColor.GREEN);
            expect(result.externalizing.score).toBe(0);

            expect(result.internalizing.tier).toBe(RiskTier.TIER_1);
            expect(result.internalizing.color).toBe(RiskColor.GREEN);
            expect(result.internalizing.score).toBe(0);
        });

        it('externalizante no limite superior (3) → ainda VERDE', () => {
            const answers = makeSRSSAnswers(0);
            answers[1] = 1; answers[2] = 1; answers[3] = 1; // ext = 3

            const result = calculateRiskScores(answers);
            expect(result.externalizing.tier).toBe(RiskTier.TIER_1);
            expect(result.externalizing.score).toBe(3);
        });

        it('internalizante no limite superior (3) → ainda VERDE', () => {
            const answers = makeSRSSAnswers(0);
            answers[8] = 1; answers[9] = 1; answers[10] = 1; // int = 3

            const result = calculateRiskScores(answers);
            expect(result.internalizing.tier).toBe(RiskTier.TIER_1);
            expect(result.internalizing.score).toBe(3);
        });
    });

    // --- TIER 2 (AMARELO) ---

    describe('TIER_2 (Amarelo) — Risco Moderado', () => {
        it('externalizante = 4 (limite inferior amarelo) → AMARELO', () => {
            const answers = makeSRSSAnswers(0);
            answers[1] = 2; answers[2] = 2; // ext = 4

            const result = calculateRiskScores(answers);
            expect(result.externalizing.tier).toBe(RiskTier.TIER_2);
            expect(result.externalizing.color).toBe(RiskColor.YELLOW);
            expect(result.externalizing.score).toBe(4);
        });

        it('externalizante = 8 (limite superior amarelo) → AMARELO', () => {
            const answers = makeSRSSAnswers(0);
            answers[1] = 3; answers[2] = 3; answers[3] = 2; // ext = 8

            const result = calculateRiskScores(answers);
            expect(result.externalizing.tier).toBe(RiskTier.TIER_2);
            expect(result.externalizing.score).toBe(8);
        });

        it('internalizante = 4 (limite inferior amarelo) → AMARELO', () => {
            const answers = makeSRSSAnswers(0);
            answers[8] = 2; answers[9] = 2; // int = 4

            const result = calculateRiskScores(answers);
            expect(result.internalizing.tier).toBe(RiskTier.TIER_2);
            expect(result.internalizing.color).toBe(RiskColor.YELLOW);
            expect(result.internalizing.score).toBe(4);
        });

        it('internalizante = 5 (limite superior amarelo) → AMARELO', () => {
            const answers = makeSRSSAnswers(0);
            answers[8] = 2; answers[9] = 2; answers[10] = 1; // int = 5

            const result = calculateRiskScores(answers);
            expect(result.internalizing.tier).toBe(RiskTier.TIER_2);
            expect(result.internalizing.score).toBe(5);
        });
    });

    // --- TIER 3 (VERMELHO) ---

    describe('TIER_3 (Vermelho) — Alto Risco', () => {
        it('externalizante = 9 (limite inferior vermelho) → VERMELHO', () => {
            const answers = makeSRSSAnswers(0);
            answers[1] = 3; answers[2] = 3; answers[3] = 3; // ext = 9

            const result = calculateRiskScores(answers);
            expect(result.externalizing.tier).toBe(RiskTier.TIER_3);
            expect(result.externalizing.color).toBe(RiskColor.RED);
            expect(result.externalizing.score).toBe(9);
        });

        it('externalizante = 21 (score máximo) → VERMELHO', () => {
            const answers = makeSRSSAnswers(3); // todos = 3
            const result = calculateRiskScores(answers);

            expect(result.externalizing.tier).toBe(RiskTier.TIER_3);
            expect(result.externalizing.score).toBe(21); // 7 itens × 3
            expect(result.externalizing.maxPossible).toBe(21);
        });

        it('internalizante = 6 (limite inferior vermelho) → VERMELHO', () => {
            const answers = makeSRSSAnswers(0);
            answers[8] = 2; answers[9] = 2; answers[10] = 2; // int = 6

            const result = calculateRiskScores(answers);
            expect(result.internalizing.tier).toBe(RiskTier.TIER_3);
            expect(result.internalizing.color).toBe(RiskColor.RED);
            expect(result.internalizing.score).toBe(6);
        });

        it('internalizante = 15 (score máximo) → VERMELHO', () => {
            const answers = makeSRSSAnswers(3);
            const result = calculateRiskScores(answers);

            expect(result.internalizing.tier).toBe(RiskTier.TIER_3);
            expect(result.internalizing.score).toBe(15); // 5 itens × 3
            expect(result.internalizing.maxPossible).toBe(15);
        });
    });

    // --- TRANSIÇÕES DE FRONTEIRA ---

    describe('Transições de fronteira entre tiers', () => {
        it('ext 3→4: transição VERDE→AMARELO', () => {
            const green = makeSRSSAnswers(0);
            green[1] = 1; green[2] = 1; green[3] = 1; // ext = 3

            const yellow = makeSRSSAnswers(0);
            yellow[1] = 2; yellow[2] = 1; yellow[3] = 1; // ext = 4

            expect(calculateRiskScores(green).externalizing.tier).toBe(RiskTier.TIER_1);
            expect(calculateRiskScores(yellow).externalizing.tier).toBe(RiskTier.TIER_2);
        });

        it('ext 8→9: transição AMARELO→VERMELHO', () => {
            const yellow = makeSRSSAnswers(0);
            yellow[1] = 3; yellow[2] = 3; yellow[3] = 2; // ext = 8

            const red = makeSRSSAnswers(0);
            red[1] = 3; red[2] = 3; red[3] = 3; // ext = 9

            expect(calculateRiskScores(yellow).externalizing.tier).toBe(RiskTier.TIER_2);
            expect(calculateRiskScores(red).externalizing.tier).toBe(RiskTier.TIER_3);
        });

        it('int 3→4: transição VERDE→AMARELO', () => {
            const green = makeSRSSAnswers(0);
            green[8] = 1; green[9] = 1; green[10] = 1; // int = 3

            const yellow = makeSRSSAnswers(0);
            yellow[8] = 2; yellow[9] = 1; yellow[10] = 1; // int = 4

            expect(calculateRiskScores(green).internalizing.tier).toBe(RiskTier.TIER_1);
            expect(calculateRiskScores(yellow).internalizing.tier).toBe(RiskTier.TIER_2);
        });

        it('int 5→6: transição AMARELO→VERMELHO', () => {
            const yellow = makeSRSSAnswers(0);
            yellow[8] = 2; yellow[9] = 2; yellow[10] = 1; // int = 5

            const red = makeSRSSAnswers(0);
            red[8] = 2; red[9] = 2; red[10] = 2; // int = 6

            expect(calculateRiskScores(yellow).internalizing.tier).toBe(RiskTier.TIER_2);
            expect(calculateRiskScores(red).internalizing.tier).toBe(RiskTier.TIER_3);
        });
    });

    // --- VALIDAÇÃO DE ENTRADA ---

    describe('Validação de entrada', () => {
        it('lança erro se item SRSS-IE está ausente', () => {
            const answers = makeSRSSAnswers(0);
            delete (answers as any)[1];
            expect(() => calculateRiskScores(answers)).toThrow(/Resposta ausente/);
        });

        it('lança erro se valor > 3', () => {
            const answers = makeSRSSAnswers(0);
            answers[1] = 4;
            expect(() => calculateRiskScores(answers)).toThrow(/Valor inválido/);
        });

        it('lança erro se valor < 0', () => {
            const answers = makeSRSSAnswers(0);
            answers[1] = -1;
            expect(() => calculateRiskScores(answers)).toThrow(/Valor inválido/);
        });
    });

    // --- DOMÍNIOS INDEPENDENTES ---

    describe('Domínios são independentes', () => {
        it('ext VERMELHO + int VERDE é possível', () => {
            const answers = makeSRSSAnswers(0);
            // Ext alto
            answers[1] = 3; answers[2] = 3; answers[3] = 3; // ext = 9
            // Int baixo (tudo 0)

            const result = calculateRiskScores(answers);
            expect(result.externalizing.tier).toBe(RiskTier.TIER_3);
            expect(result.internalizing.tier).toBe(RiskTier.TIER_1);
        });

        it('ext VERDE + int VERMELHO é possível', () => {
            const answers = makeSRSSAnswers(0);
            // Ext baixo (tudo 0)
            // Int alto
            answers[8] = 3; answers[9] = 3; // int = 6

            const result = calculateRiskScores(answers);
            expect(result.externalizing.tier).toBe(RiskTier.TIER_1);
            expect(result.internalizing.tier).toBe(RiskTier.TIER_3);
        });
    });
});

// ============================================================
// VIA — TOP 5 FORÇAS DE ASSINATURA + DESEMPATE
// ============================================================

describe('Top 5 Forças de Assinatura', () => {
    it('retorna exatamente 5 signature strengths e 5 development areas', () => {
        const via = makeVIAAnswers(2);
        const scores = calculateStrengthScores(via);
        const sorted = [...scores].sort((a, b) => b.normalizedScore - a.normalizedScore);

        expect(sorted.slice(0, 5)).toHaveLength(5);
        expect(sorted.slice(-5)).toHaveLength(5);
    });

    it('identifica a força mais alta corretamente', () => {
        const via = makeVIAAnswers(1); // Base baixa
        // Criatividade (itens 3, 30, 48) no máximo
        via[3] = 4; via[30] = 4; via[48] = 4; // soma = 12, normalized = 100

        const scores = calculateStrengthScores(via);
        const sorted = [...scores].sort((a, b) => b.normalizedScore - a.normalizedScore);

        expect(sorted[0].label).toBe('Criatividade');
        expect(sorted[0].normalizedScore).toBe(100);
    });

    it('identifica a força mais fraca corretamente', () => {
        const via = makeVIAAnswers(3); // Base alta
        // Bravura (itens 35, 57, 67) no mínimo
        via[35] = 0; via[57] = 0; via[67] = 0; // soma = 0, normalized = 0

        const scores = calculateStrengthScores(via);
        const sorted = [...scores].sort((a, b) => b.normalizedScore - a.normalizedScore);

        expect(sorted[sorted.length - 1].label).toBe('Bravura');
        expect(sorted[sorted.length - 1].normalizedScore).toBe(0);
    });

    it('desempate: forças com mesmo score mantêm ordem estável', () => {
        // Todas respostas iguais = todas as forças com 3 itens empatam
        const via = makeVIAAnswers(3);
        const scores = calculateStrengthScores(via);
        const sorted = [...scores].sort((a, b) => b.normalizedScore - a.normalizedScore);

        // Com score uniforme, forças de 3 itens = 75%, Apreciação ao Belo (2 itens) = 75% também
        // Todos empatam em 75% — o top 5 deve conter exatamente 5 itens
        const top5 = sorted.slice(0, 5);
        expect(top5).toHaveLength(5);

        // Todas devem ter o mesmo score
        expect(top5.every(s => s.normalizedScore === 75)).toBe(true);

        // Rodar 2x deve dar a mesma ordem (estabilidade)
        const scores2 = calculateStrengthScores(via);
        const sorted2 = [...scores2].sort((a, b) => b.normalizedScore - a.normalizedScore);
        const top5_2 = sorted2.slice(0, 5);

        expect(top5.map(s => s.label)).toEqual(top5_2.map(s => s.label));
    });

    it('desempate parcial: distingue corretamente quando poucas forças diferem', () => {
        const via = makeVIAAnswers(2); // Base: normalized = 50% para 3 itens

        // Tornar 3 forças claramente superiores
        // Humor (14, 42, 64) → soma 12 → 100%
        via[14] = 4; via[42] = 4; via[64] = 4;
        // Gratidão (22, 24, 44) → soma 11 → 92%
        via[22] = 4; via[24] = 4; via[44] = 3;
        // Esperança (15, 27, 49) → soma 10 → 83%
        via[15] = 4; via[27] = 3; via[49] = 3;

        const scores = calculateStrengthScores(via);
        const sorted = [...scores].sort((a, b) => b.normalizedScore - a.normalizedScore);

        expect(sorted[0].label).toBe('Humor');
        expect(sorted[0].normalizedScore).toBe(100);
        expect(sorted[1].label).toBe('Gratidão');
        expect(sorted[1].normalizedScore).toBe(92);
        expect(sorted[2].label).toBe('Esperança');
        expect(sorted[2].normalizedScore).toBe(83);
    });

    it('Apreciação ao Belo (2 itens) normaliza corretamente vs forças de 3 itens', () => {
        const via = makeVIAAnswers(0);
        // Apreciação ao Belo (itens 39, 43) — 2 itens, max = 8
        via[39] = 4; via[43] = 4; // soma = 8, normalized = 100%
        // Criatividade (itens 3, 30, 48) — 3 itens, max = 12
        via[3] = 4; via[30] = 4; via[48] = 3; // soma = 11, normalized = 92%

        const scores = calculateStrengthScores(via);
        const belo = scores.find(s => s.label === 'Apreciação ao Belo')!;
        const criat = scores.find(s => s.label === 'Criatividade')!;

        expect(belo.normalizedScore).toBe(100);
        expect(belo.maxPossible).toBe(8);
        expect(criat.normalizedScore).toBe(92);
        expect(criat.maxPossible).toBe(12);

        // Belo deve ficar acima de Criatividade no ranking
        const sorted = [...scores].sort((a, b) => b.normalizedScore - a.normalizedScore);
        const beloIdx = sorted.findIndex(s => s.label === 'Apreciação ao Belo');
        const criatIdx = sorted.findIndex(s => s.label === 'Criatividade');
        expect(beloIdx).toBeLessThan(criatIdx);
    });

    it('calculateStudentProfile retorna top 5 e bottom 5 corretos', () => {
        const via = makeVIAAnswers(2);
        // Forçar top 1 claro
        via[3] = 4; via[30] = 4; via[48] = 4; // Criatividade = 100%
        // Forçar bottom 1 claro
        via[35] = 0; via[57] = 0; via[67] = 0; // Bravura = 0%

        const srss = makeSRSSAnswers(0);
        const profile = calculateStudentProfile(via, srss, GradeLevel.PRIMEIRO_ANO);

        expect(profile.signatureStrengths).toHaveLength(5);
        expect(profile.developmentAreas).toHaveLength(5);
        expect(profile.signatureStrengths[0].label).toBe('Criatividade');
        expect(profile.developmentAreas[0].label).toBe('Bravura');
    });
});

// ============================================================
// OVERALL TIER (perfil integrado)
// ============================================================

describe('Overall Tier no perfil integrado', () => {
    it('overall = o PIOR entre ext e int', () => {
        const via = makeVIAAnswers(2);
        const srss = makeSRSSAnswers(0);
        srss[8] = 3; srss[9] = 3; // int = 6 → TIER_3, ext = 0 → TIER_1

        const profile = calculateStudentProfile(via, srss, GradeLevel.PRIMEIRO_ANO);

        expect(profile.externalizing.tier).toBe(RiskTier.TIER_1);
        expect(profile.internalizing.tier).toBe(RiskTier.TIER_3);
        expect(profile.overallTier).toBe(RiskTier.TIER_3);
        expect(profile.overallColor).toBe(RiskColor.RED);
    });

    it('overall VERDE quando ambos são VERDE', () => {
        const via = makeVIAAnswers(2);
        const srss = makeSRSSAnswers(0);

        const profile = calculateStudentProfile(via, srss, GradeLevel.PRIMEIRO_ANO);
        expect(profile.overallTier).toBe(RiskTier.TIER_1);
        expect(profile.overallColor).toBe(RiskColor.GREEN);
    });
});
