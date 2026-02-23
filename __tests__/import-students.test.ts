import { describe, it, expect } from 'vitest';
import { mapHeaders, validateRow, parseImportData } from '@/lib/import/parse-students';

describe('mapHeaders', () => {
  it('maps Portuguese headers to canonical keys', () => {
    const headers = ['Nome', 'Turma', 'Matricula', 'CPF'];
    const result = mapHeaders(headers);
    expect(result).toEqual({ nome: 0, turma: 1, matricula: 2, cpf: 3 });
  });

  it('maps English headers to canonical keys', () => {
    const headers = ['name', 'classroom', 'enrollment'];
    const result = mapHeaders(headers);
    expect(result).toEqual({ nome: 0, turma: 1, matricula: 2 });
  });

  it('returns null for missing required column "nome"', () => {
    const headers = ['Turma', 'CPF'];
    const result = mapHeaders(headers);
    expect(result).toBeNull();
  });

  it('returns null for missing required column "turma"', () => {
    const headers = ['Nome', 'CPF'];
    const result = mapHeaders(headers);
    expect(result).toBeNull();
  });

  it('handles case-insensitive and trimmed headers', () => {
    const headers = ['  NOME  ', ' turma '];
    const result = mapHeaders(headers);
    expect(result).toEqual({ nome: 0, turma: 1 });
  });
});

describe('validateRow', () => {
  it('returns valid for a row with nome and turma', () => {
    const result = validateRow({ nome: 'Joao Silva', turma: 'Turma A' });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects empty nome', () => {
    const result = validateRow({ nome: '', turma: 'Turma A' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Nome e obrigatorio');
  });

  it('rejects nome with 1 character', () => {
    const result = validateRow({ nome: 'A', turma: 'Turma A' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Nome deve ter pelo menos 2 caracteres');
  });

  it('rejects empty turma', () => {
    const result = validateRow({ nome: 'Joao', turma: '' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Turma e obrigatoria');
  });

  it('validates CPF format when present (11 digits)', () => {
    const result = validateRow({ nome: 'Joao', turma: 'A', cpf: '12345678901' });
    expect(result.valid).toBe(true);
  });

  it('validates CPF format when present (formatted)', () => {
    const result = validateRow({ nome: 'Joao', turma: 'A', cpf: '123.456.789-01' });
    expect(result.valid).toBe(true);
  });

  it('rejects invalid CPF', () => {
    const result = validateRow({ nome: 'Joao', turma: 'A', cpf: '123' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('CPF invalido');
  });

  it('validates date in DD/MM/YYYY format', () => {
    const result = validateRow({ nome: 'Joao', turma: 'A', nascimento: '15/03/2008' });
    expect(result.valid).toBe(true);
    expect(result.data?.birthDate).toBeInstanceOf(Date);
  });

  it('validates date in YYYY-MM-DD format', () => {
    const result = validateRow({ nome: 'Joao', turma: 'A', nascimento: '2008-03-15' });
    expect(result.valid).toBe(true);
  });

  it('rejects invalid date', () => {
    const result = validateRow({ nome: 'Joao', turma: 'A', nascimento: 'not-a-date' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Data de nascimento invalida (use DD/MM/AAAA)');
  });

  it('accepts optional guardian fields', () => {
    const result = validateRow({
      nome: 'Joao', turma: 'A',
      responsavel: 'Maria Silva', telefone: '11999998888', email_responsavel: 'maria@email.com'
    });
    expect(result.valid).toBe(true);
    expect(result.data?.guardianName).toBe('Maria Silva');
  });

  it('rejects invalid guardian email', () => {
    const result = validateRow({
      nome: 'Joao', turma: 'A', email_responsavel: 'not-an-email'
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Email do responsavel invalido');
  });
});

describe('parseImportData', () => {
  it('parses a simple 2-row dataset', () => {
    const rows = [
      ['Nome', 'Turma'],
      ['Joao Silva', 'Turma A'],
      ['Maria Santos', 'Turma B'],
    ];
    const result = parseImportData(rows);
    expect(result.valid).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
    expect(result.classrooms).toEqual(new Set(['Turma A', 'Turma B']));
  });

  it('separates valid and error rows', () => {
    const rows = [
      ['Nome', 'Turma'],
      ['Joao Silva', 'Turma A'],
      ['', 'Turma B'],
    ];
    const result = parseImportData(rows);
    expect(result.valid).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].row).toBe(3);
  });

  it('returns headerError if required columns missing', () => {
    const rows = [
      ['CPF', 'Email'],
      ['12345678901', 'test@test.com'],
    ];
    const result = parseImportData(rows);
    expect(result.headerError).toBeTruthy();
    expect(result.valid).toHaveLength(0);
  });

  it('skips completely empty rows', () => {
    const rows = [
      ['Nome', 'Turma'],
      ['Joao Silva', 'Turma A'],
      ['', ''],
      ['Maria Santos', 'Turma B'],
    ];
    const result = parseImportData(rows);
    expect(result.valid).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
  });
});
