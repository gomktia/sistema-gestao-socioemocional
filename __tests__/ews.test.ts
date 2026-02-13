import { describe, it, expect } from 'vitest';
import { calculateEWSAlert } from '@core/logic/ews';

describe('calculateEWSAlert', () => {
    it('retorna NONE quando todos os indicadores estão normais', () => {
        const result = calculateEWSAlert(95, 7.5, 7.0, 0);

        expect(result.alertLevel).toBe('NONE');
        expect(result.hasAttendanceAlert).toBe(false);
        expect(result.hasGradeAlert).toBe(false);
        expect(result.hasDisciplinaryAlert).toBe(false);
        expect(result.rationale).toHaveLength(0);
    });

    it('retorna CRITICAL quando frequência < 90%', () => {
        const result = calculateEWSAlert(85, 7.5, 7.0, 0);

        expect(result.alertLevel).toBe('CRITICAL');
        expect(result.hasAttendanceAlert).toBe(true);
        expect(result.rationale[0]).toContain('85.0%');
    });

    it('retorna CRITICAL no limite exato (frequência = 89.9%)', () => {
        const result = calculateEWSAlert(89.9, 7.5, 7.0, 0);

        expect(result.alertLevel).toBe('CRITICAL');
        expect(result.hasAttendanceAlert).toBe(true);
    });

    it('retorna NONE no limite exato (frequência = 90%)', () => {
        const result = calculateEWSAlert(90, 7.5, 7.0, 0);

        expect(result.hasAttendanceAlert).toBe(false);
    });

    it('retorna WATCH quando queda acadêmica > 20%', () => {
        // Média anterior: 8.0, atual: 6.0 → queda de 25%
        const result = calculateEWSAlert(95, 6.0, 8.0, 0);

        expect(result.alertLevel).toBe('WATCH');
        expect(result.hasGradeAlert).toBe(true);
        expect(result.rationale[0]).toContain('25.0%');
    });

    it('não gera alerta de queda quando drop é exatamente 20%', () => {
        // Média anterior: 10.0, atual: 8.0 → queda de 20% (não > 20%)
        const result = calculateEWSAlert(95, 8.0, 10.0, 0);

        expect(result.hasGradeAlert).toBe(false);
    });

    it('gera alerta de queda quando drop é 20.1%', () => {
        // Média anterior: 10.0, atual: 7.99 → queda de 20.1%
        const result = calculateEWSAlert(95, 7.99, 10.0, 0);

        expect(result.hasGradeAlert).toBe(true);
    });

    it('retorna CRITICAL quando ocorrências disciplinares >= 3', () => {
        const result = calculateEWSAlert(95, 7.5, 7.0, 3);

        expect(result.alertLevel).toBe('CRITICAL');
        expect(result.hasDisciplinaryAlert).toBe(true);
        expect(result.rationale[0]).toContain('3 ocorrências');
    });

    it('não gera alerta disciplinar quando ocorrências < 3', () => {
        const result = calculateEWSAlert(95, 7.5, 7.0, 2);

        expect(result.hasDisciplinaryAlert).toBe(false);
    });

    it('acumula múltiplos alertas na rationale', () => {
        // Frequência baixa + queda acadêmica + disciplina alta
        const result = calculateEWSAlert(80, 5.0, 8.0, 5);

        expect(result.alertLevel).toBe('CRITICAL');
        expect(result.hasAttendanceAlert).toBe(true);
        expect(result.hasGradeAlert).toBe(true);
        expect(result.hasDisciplinaryAlert).toBe(true);
        expect(result.rationale).toHaveLength(3);
    });

    it('funciona sem média anterior (previousAverage undefined)', () => {
        const result = calculateEWSAlert(95, 7.5, undefined, 0);

        expect(result.alertLevel).toBe('NONE');
        expect(result.hasGradeAlert).toBe(false);
    });

    it('funciona com disciplinaryLogs padrão (0)', () => {
        const result = calculateEWSAlert(95, 7.5);

        expect(result.alertLevel).toBe('NONE');
        expect(result.hasDisciplinaryAlert).toBe(false);
    });

    it('CRITICAL sobrepõe WATCH quando frequência e queda coexistem', () => {
        // Frequência baixa (CRITICAL) + queda acadêmica (WATCH)
        const result = calculateEWSAlert(80, 6.0, 8.0, 0);

        expect(result.alertLevel).toBe('CRITICAL');
        expect(result.hasAttendanceAlert).toBe(true);
        expect(result.hasGradeAlert).toBe(true);
    });
});
