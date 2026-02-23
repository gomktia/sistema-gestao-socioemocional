const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HEADER_MAP: Record<string, string> = {
  nome: 'nome', name: 'nome', aluno: 'nome',
  turma: 'turma', classe: 'turma', classroom: 'turma',
  matricula: 'matricula', enrollment: 'matricula', ra: 'matricula',
  nascimento: 'nascimento', data_nascimento: 'nascimento', birth_date: 'nascimento',
  cpf: 'cpf',
  responsavel: 'responsavel', guardian: 'responsavel',
  telefone: 'telefone', phone: 'telefone',
  email_responsavel: 'email_responsavel', guardian_email: 'email_responsavel',
};

const REQUIRED_KEYS = ['nome', 'turma'];

export interface RawRow {
  nome: string;
  turma: string;
  matricula?: string;
  nascimento?: string;
  cpf?: string;
  responsavel?: string;
  telefone?: string;
  email_responsavel?: string;
}

export interface ValidatedStudent {
  name: string;
  classroomName: string;
  enrollmentId?: string;
  birthDate?: Date;
  cpf?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data?: ValidatedStudent;
}

export interface ErrorRow {
  row: number;
  rawData: Record<string, string>;
  errors: string[];
}

export interface ParseResult {
  valid: { row: number; data: ValidatedStudent }[];
  errors: ErrorRow[];
  classrooms: Set<string>;
  headerError?: string;
}

export function mapHeaders(headers: string[]): Record<string, number> | null {
  const mapped: Record<string, number> = {};

  headers.forEach((h, i) => {
    const normalized = h.trim().toLowerCase()
      .replace(/[áàã]/g, 'a').replace(/[éê]/g, 'e')
      .replace(/[íî]/g, 'i').replace(/[óô]/g, 'o')
      .replace(/[úû]/g, 'u').replace(/ç/g, 'c');
    const canonical = HEADER_MAP[normalized];
    if (canonical && !(canonical in mapped)) {
      mapped[canonical] = i;
    }
  });

  for (const key of REQUIRED_KEYS) {
    if (!(key in mapped)) return null;
  }

  return mapped;
}

function parseDate(str: string): Date | null {
  const trimmed = str.trim();

  const brMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (!isNaN(d.getTime()) && d.getFullYear() === Number(year)) return d;
    return null;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (!isNaN(d.getTime()) && d.getFullYear() === Number(year)) return d;
    return null;
  }

  return null;
}

export function validateRow(raw: Record<string, string>): ValidationResult {
  const errors: string[] = [];
  const nome = (raw.nome || '').trim();
  const turma = (raw.turma || '').trim();

  if (!nome) {
    errors.push('Nome e obrigatorio');
  } else if (nome.length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  if (!turma) {
    errors.push('Turma e obrigatoria');
  }

  const cpf = (raw.cpf || '').trim();
  if (cpf && !cpfRegex.test(cpf)) {
    errors.push('CPF invalido');
  }

  let birthDate: Date | undefined;
  const nascimento = (raw.nascimento || '').trim();
  if (nascimento) {
    const parsed = parseDate(nascimento);
    if (!parsed) {
      errors.push('Data de nascimento invalida (use DD/MM/AAAA)');
    } else {
      birthDate = parsed;
    }
  }

  const guardianEmail = (raw.email_responsavel || '').trim();
  if (guardianEmail && !emailRegex.test(guardianEmail)) {
    errors.push('Email do responsavel invalido');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      name: nome,
      classroomName: turma,
      enrollmentId: (raw.matricula || '').trim() || undefined,
      birthDate,
      cpf: cpf || undefined,
      guardianName: (raw.responsavel || '').trim() || undefined,
      guardianPhone: (raw.telefone || '').trim() || undefined,
      guardianEmail: guardianEmail || undefined,
    },
  };
}

export function parseImportData(rows: string[][]): ParseResult {
  if (rows.length < 2) {
    return { valid: [], errors: [], classrooms: new Set(), headerError: 'Arquivo vazio ou sem dados' };
  }

  const headerMap = mapHeaders(rows[0]);
  if (!headerMap) {
    return {
      valid: [],
      errors: [],
      classrooms: new Set(),
      headerError: 'Colunas obrigatorias nao encontradas: Nome e Turma',
    };
  }

  const validRows: ParseResult['valid'] = [];
  const errorRows: ErrorRow[] = [];
  const classrooms = new Set<string>();

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const raw: Record<string, string> = {};
    for (const [key, colIdx] of Object.entries(headerMap)) {
      raw[key] = cells[colIdx] || '';
    }

    if (Object.values(raw).every(v => !v.trim())) continue;

    const result = validateRow(raw);
    if (result.valid && result.data) {
      validRows.push({ row: i + 1, data: result.data });
      classrooms.add(result.data.classroomName);
    } else {
      errorRows.push({ row: i + 1, rawData: raw, errors: result.errors });
    }
  }

  return { valid: validRows, errors: errorRows, classrooms };
}
