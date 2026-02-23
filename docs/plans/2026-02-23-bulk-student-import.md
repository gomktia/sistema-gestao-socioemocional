# Bulk Student Import — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow ADMIN/MANAGER to import students in bulk via CSV/Excel upload with a 3-step dialog (Upload → Preview → Confirm).

**Architecture:** A single server action file handles parsing + validation + insertion. A client-side dialog component manages the 3-step UI. Pure validation logic is extracted to a testable module. Uses the existing `xlsx` library already in the project.

**Tech Stack:** Next.js Server Actions, Prisma, xlsx, Zod, Vitest, shadcn/ui Dialog + Table

---

### Task 1: Import Validation Logic (Pure Functions)

Create the core parsing and validation logic as pure, testable functions — no DB, no auth.

**Files:**
- Create: `lib/import/parse-students.ts`
- Test: `__tests__/import-students.test.ts`

**Step 1: Write the failing tests**

Create `__tests__/import-students.test.ts`:

```typescript
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
      ['', 'Turma B'],  // invalid - empty name
    ];
    const result = parseImportData(rows);
    expect(result.valid).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].row).toBe(3); // 1-indexed for user display
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
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run __tests__/import-students.test.ts`
Expected: FAIL — module `@/lib/import/parse-students` not found

**Step 3: Write the implementation**

Create `lib/import/parse-students.ts`:

```typescript
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Flexible header mapping: normalized_input -> canonical_key
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

/**
 * Maps raw spreadsheet headers to canonical keys.
 * Returns null if required columns (nome, turma) are missing.
 */
export function mapHeaders(headers: string[]): Record<string, number> | null {
  const mapped: Record<string, number> = {};

  headers.forEach((h, i) => {
    const normalized = h.trim().toLowerCase().replace(/[áàã]/g, 'a').replace(/[éê]/g, 'e').replace(/[íî]/g, 'i').replace(/[óô]/g, 'o').replace(/[úû]/g, 'u').replace(/ç/g, 'c');
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

/** Parse a date string in DD/MM/YYYY or YYYY-MM-DD format */
function parseDate(str: string): Date | null {
  const trimmed = str.trim();

  // DD/MM/YYYY
  const brMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (!isNaN(d.getTime()) && d.getFullYear() === Number(year)) return d;
    return null;
  }

  // YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (!isNaN(d.getTime()) && d.getFullYear() === Number(year)) return d;
    return null;
  }

  return null;
}

/** Validate a single row of import data */
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

/**
 * Parse a 2D array of strings (from xlsx) into validated import data.
 * First row is headers.
 */
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
    // Build raw object from header mapping
    const raw: Record<string, string> = {};
    for (const [key, colIdx] of Object.entries(headerMap)) {
      raw[key] = cells[colIdx] || '';
    }

    // Skip completely empty rows
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
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest run __tests__/import-students.test.ts`
Expected: ALL PASS

**Step 5: Commit**

```bash
git add lib/import/parse-students.ts __tests__/import-students.test.ts
git commit -m "feat: add bulk import parsing and validation logic with tests"
```

---

### Task 2: Server Action — Parse and Validate File

Create the server action that receives a file upload, uses xlsx to parse it, and returns validation results.

**Files:**
- Create: `app/actions/import-students.ts`
- Reference: `lib/import/parse-students.ts` (from Task 1)
- Reference: `lib/audit.ts` (existing)
- Reference: `lib/auth.ts` → `getCurrentUser()` (existing)

**Step 1: Write the server action**

Create `app/actions/import-students.ts`:

```typescript
'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { logAudit } from '@/lib/audit';
import * as XLSX from 'xlsx';
import { parseImportData, type ValidatedStudent } from '@/lib/import/parse-students';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

export interface ImportPreview {
  valid: { row: number; data: ValidatedStudent }[];
  errors: { row: number; rawData: Record<string, string>; errors: string[] }[];
  duplicates: { row: number; data: ValidatedStudent; reason: string }[];
  newClassrooms: string[];
  existingClassrooms: string[];
}

export async function parseImportFile(formData: FormData): Promise<
  { success: true; preview: ImportPreview } |
  { success: false; error: string }
> {
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) {
    return { success: false, error: 'Sem permissao para importar alunos.' };
  }

  const file = formData.get('file') as File | null;
  if (!file) return { success: false, error: 'Nenhum arquivo enviado.' };
  if (file.size > MAX_FILE_SIZE) return { success: false, error: 'Arquivo excede 5MB.' };

  // Parse file to 2D array
  let rows: string[][];
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as string[][];
  } catch {
    return { success: false, error: 'Erro ao ler arquivo. Verifique se e um CSV ou Excel valido.' };
  }

  const parsed = parseImportData(rows);
  if (parsed.headerError) return { success: false, error: parsed.headerError };

  // Check duplicates against DB
  const existingCpfs = new Set<string>();
  const existingEnrollments = new Set<string>();

  const cpfsToCheck = parsed.valid.map(r => r.data.cpf).filter(Boolean) as string[];
  if (cpfsToCheck.length > 0) {
    const existing = await prisma.student.findMany({
      where: { tenantId: user.tenantId, cpf: { in: cpfsToCheck } },
      select: { cpf: true },
    });
    existing.forEach(s => { if (s.cpf) existingCpfs.add(s.cpf); });
  }

  const enrollmentsToCheck = parsed.valid.map(r => r.data.enrollmentId).filter(Boolean) as string[];
  if (enrollmentsToCheck.length > 0) {
    const existing = await prisma.student.findMany({
      where: { tenantId: user.tenantId, enrollmentId: { in: enrollmentsToCheck } },
      select: { enrollmentId: true },
    });
    existing.forEach(s => { if (s.enrollmentId) existingEnrollments.add(s.enrollmentId); });
  }

  // Separate duplicates from valid
  const duplicates: ImportPreview['duplicates'] = [];
  const uniqueValid = parsed.valid.filter(r => {
    if (r.data.cpf && existingCpfs.has(r.data.cpf)) {
      duplicates.push({ row: r.row, data: r.data, reason: `CPF ${r.data.cpf} ja cadastrado` });
      return false;
    }
    if (r.data.enrollmentId && existingEnrollments.has(r.data.enrollmentId)) {
      duplicates.push({ row: r.row, data: r.data, reason: `Matricula ${r.data.enrollmentId} ja cadastrada` });
      return false;
    }
    return true;
  });

  // Check which classrooms exist
  const existingClassroomsDB = await prisma.classroom.findMany({
    where: { tenantId: user.tenantId, year: new Date().getFullYear() },
    select: { name: true },
  });
  const existingNames = new Set(existingClassroomsDB.map(c => c.name));

  const newClassrooms = [...parsed.classrooms].filter(name => !existingNames.has(name));
  const existingClassrooms = [...parsed.classrooms].filter(name => existingNames.has(name));

  return {
    success: true,
    preview: {
      valid: uniqueValid,
      errors: parsed.errors,
      duplicates,
      newClassrooms,
      existingClassrooms,
    },
  };
}

export async function executeImport(
  validStudents: { data: ValidatedStudent }[],
  newClassroomNames: string[]
): Promise<
  { success: true; created: number; classroomsCreated: number; skipped: number } |
  { success: false; error: string }
> {
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) {
    return { success: false, error: 'Sem permissao.' };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create new classrooms
      const classroomMap = new Map<string, string>(); // name -> id
      const year = new Date().getFullYear();

      // Fetch existing classrooms for mapping
      const existing = await tx.classroom.findMany({
        where: { tenantId: user.tenantId, year },
        select: { id: true, name: true },
      });
      existing.forEach(c => classroomMap.set(c.name, c.id));

      // Create missing classrooms
      for (const name of newClassroomNames) {
        if (!classroomMap.has(name)) {
          const grade = inferGradeFromName(name);
          const created = await tx.classroom.create({
            data: { tenantId: user.tenantId, name, grade, year },
          });
          classroomMap.set(name, created.id);
        }
      }

      // 2. Create students
      let createdCount = 0;
      for (const { data } of validStudents) {
        const classroomId = classroomMap.get(data.classroomName);
        await tx.student.create({
          data: {
            tenantId: user.tenantId,
            name: data.name,
            grade: inferGradeFromName(data.classroomName),
            classroomId: classroomId || null,
            enrollmentId: data.enrollmentId || null,
            birthDate: data.birthDate || null,
            cpf: data.cpf || null,
            guardianName: data.guardianName || null,
            guardianPhone: data.guardianPhone || null,
            guardianEmail: data.guardianEmail || null,
          },
        });
        createdCount++;
      }

      return { created: createdCount, classroomsCreated: newClassroomNames.length };
    });

    await logAudit({
      tenantId: user.tenantId,
      userId: user.id,
      action: 'STUDENTS_BULK_IMPORTED',
      details: {
        created: result.created,
        classroomsCreated: result.classroomsCreated,
      },
    });

    revalidatePath('/alunos');
    revalidatePath('/turma');

    return { success: true, ...result, skipped: 0 };
  } catch (error: any) {
    console.error('[IMPORT] Error executing bulk import:', error);
    return { success: false, error: 'Erro ao importar alunos. Nenhum dado foi alterado.' };
  }
}

/** Infer GradeLevel from classroom name. Defaults to ANO_1_EM. */
function inferGradeFromName(name: string): 'ANO_1_EM' | 'ANO_2_EM' | 'ANO_3_EM' {
  const lower = name.toLowerCase();
  if (lower.includes('3') || lower.includes('terceiro') || lower.includes('3a') || lower.includes('3o')) return 'ANO_3_EM';
  if (lower.includes('2') || lower.includes('segundo') || lower.includes('2a') || lower.includes('2o')) return 'ANO_2_EM';
  return 'ANO_1_EM';
}
```

**Step 2: Verify the action compiles**

Run: `npx tsc --noEmit app/actions/import-students.ts` (or just `npx next build` dry run)
Expected: No type errors

**Step 3: Commit**

```bash
git add app/actions/import-students.ts
git commit -m "feat: add server actions for bulk student import"
```

---

### Task 3: Import Dialog Component — Step 1 (Upload)

Build the multi-step dialog. Start with the file upload step.

**Files:**
- Create: `components/import/ImportStudentsDialog.tsx`
- Modify: `app/(portal)/alunos/page.tsx` — add the import button

**Step 1: Create the dialog component**

Create `components/import/ImportStudentsDialog.tsx`:

```tsx
'use client';

import { useState, useCallback, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { parseImportFile, executeImport, type ImportPreview } from '@/app/actions/import-students';
import { toast } from 'sonner';

type Step = 'upload' | 'preview' | 'result';

interface ImportResult {
  created: number;
  classroomsCreated: number;
  skipped: number;
}

export function ImportStudentsDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('upload');
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const reset = useCallback(() => {
    setStep('upload');
    setPreview(null);
    setResult(null);
    setError(null);
    setDragOver(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Reset after animation
    setTimeout(reset, 200);
  }, [reset]);

  const handleFile = useCallback((file: File) => {
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    startTransition(async () => {
      const res = await parseImportFile(formData);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setPreview(res.preview);
      setStep('preview');
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleConfirmImport = useCallback(() => {
    if (!preview) return;

    startTransition(async () => {
      const res = await executeImport(
        preview.valid.map(r => ({ data: r.data })),
        preview.newClassrooms
      );
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      setResult({ created: res.created, classroomsCreated: res.classroomsCreated, skipped: res.skipped });
      setStep('result');
      toast.success(`${res.created} alunos importados com sucesso!`);
    });
  }, [preview]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl active:scale-95 transition-all"
      >
        <Upload size={16} className="mr-2" />
        Importar Alunos
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight">
              {step === 'upload' && 'Importar Alunos'}
              {step === 'preview' && 'Confirmar Importacao'}
              {step === 'result' && 'Importacao Concluida'}
            </DialogTitle>
            <DialogDescription>
              {step === 'upload' && 'Envie um arquivo CSV ou Excel com os dados dos alunos.'}
              {step === 'preview' && 'Revise os dados antes de confirmar.'}
              {step === 'result' && 'Veja o resumo da importacao.'}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {isPending ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={40} className="text-indigo-500 animate-spin" />
                  <p className="text-sm text-slate-600 font-medium">Processando arquivo...</p>
                </div>
              ) : (
                <>
                  <FileSpreadsheet size={40} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-sm text-slate-600 mb-1 font-medium">
                    Arraste um arquivo CSV ou Excel aqui
                  </p>
                  <p className="text-xs text-slate-400 mb-4">ou clique para selecionar (max 5MB)</p>
                  <label>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                    <span className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors">
                      Selecionar Arquivo
                    </span>
                  </label>
                </>
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && preview && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Summary badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                  {preview.valid.length} validos
                </span>
                {preview.errors.length > 0 && (
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full">
                    {preview.errors.length} com erros
                  </span>
                )}
                {preview.duplicates.length > 0 && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                    {preview.duplicates.length} duplicados
                  </span>
                )}
                {preview.newClassrooms.length > 0 && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                    {preview.newClassrooms.length} turmas novas
                  </span>
                )}
              </div>

              {/* New classrooms alert */}
              {preview.newClassrooms.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                  <strong>Turmas novas que serao criadas:</strong>{' '}
                  {preview.newClassrooms.join(', ')}
                </div>
              )}

              {/* Valid rows table */}
              {preview.valid.length > 0 && (
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">Linha</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">Nome</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">Turma</th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase">Matricula</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {preview.valid.slice(0, 50).map((r) => (
                        <tr key={r.row} className="hover:bg-slate-50">
                          <td className="px-3 py-2 text-slate-400">{r.row}</td>
                          <td className="px-3 py-2 font-medium">{r.data.name}</td>
                          <td className="px-3 py-2">{r.data.classroomName}</td>
                          <td className="px-3 py-2 text-slate-500">{r.data.enrollmentId || '—'}</td>
                        </tr>
                      ))}
                      {preview.valid.length > 50 && (
                        <tr>
                          <td colSpan={4} className="px-3 py-2 text-center text-slate-400 text-xs">
                            ... e mais {preview.valid.length - 50} alunos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Error rows */}
              {preview.errors.length > 0 && (
                <div className="border border-red-200 rounded-xl overflow-hidden">
                  <div className="bg-red-50 px-3 py-2 text-xs font-bold text-red-700 uppercase">
                    Linhas com Erros (nao serao importadas)
                  </div>
                  <div className="divide-y divide-red-100">
                    {preview.errors.slice(0, 20).map((r) => (
                      <div key={r.row} className="px-3 py-2 text-sm">
                        <span className="text-red-500 font-bold">Linha {r.row}:</span>{' '}
                        <span className="text-red-700">{r.errors.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duplicate rows */}
              {preview.duplicates.length > 0 && (
                <div className="border border-amber-200 rounded-xl overflow-hidden">
                  <div className="bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 uppercase">
                    Duplicados (serao ignorados)
                  </div>
                  <div className="divide-y divide-amber-100">
                    {preview.duplicates.map((r) => (
                      <div key={r.row} className="px-3 py-2 text-sm">
                        <span className="text-amber-600 font-bold">Linha {r.row}:</span>{' '}
                        {r.data.name} — <span className="text-amber-700">{r.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Result */}
          {step === 'result' && result && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900">{result.created} alunos importados</p>
                {result.classroomsCreated > 0 && (
                  <p className="text-sm text-slate-500">{result.classroomsCreated} turmas criadas</p>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="gap-2">
            {step === 'preview' && (
              <>
                <Button variant="outline" onClick={reset} className="rounded-xl" disabled={isPending}>
                  <ArrowLeft size={16} className="mr-1" /> Voltar
                </Button>
                <Button
                  onClick={handleConfirmImport}
                  disabled={isPending || preview?.valid.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                  {isPending ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> Importando...</>
                  ) : (
                    <>Confirmar Importacao ({preview?.valid.length} alunos)</>
                  )}
                </Button>
              </>
            )}
            {step === 'result' && (
              <Button onClick={handleClose} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                Fechar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

**Step 2: Add the import button to the alunos page**

Modify `app/(portal)/alunos/page.tsx`:

- Add import: `import { ImportStudentsDialog } from '@/components/import/ImportStudentsDialog';`
- Add the button next to ExportStudentsPDF in the header area
- Only show for ADMIN and MANAGER roles

The button goes inside the `<div>` that contains `ExportStudentsPDF` (line 59-61). Change it to:

```tsx
<div className="flex items-center gap-2">
    {(user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) && (
        <ImportStudentsDialog />
    )}
    {students.length > 0 && (
        <ExportStudentsPDF students={studentsForExport} />
    )}
</div>
```

Also add the import button in the empty state (line 114-118), before the "Gerenciar Importacoes" button:

```tsx
{(user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) && (
    <ImportStudentsDialog />
)}
```

**Step 3: Verify app compiles**

Run: `npx next build` or `npx next dev` and navigate to `/alunos`
Expected: Page loads with "Importar Alunos" button visible for ADMIN/MANAGER

**Step 4: Commit**

```bash
git add components/import/ImportStudentsDialog.tsx app/\(portal\)/alunos/page.tsx
git commit -m "feat: add import students dialog with upload, preview, and result steps"
```

---

### Task 4: Manual Integration Test

Manually test the full flow end-to-end.

**Step 1: Create a test CSV file**

Create a file `test-import.csv` (in your local machine, not committed) with:

```csv
Nome,Turma,Matricula,CPF
Joao Silva,Turma A - 1o EM,2024001,12345678901
Maria Santos,Turma A - 1o EM,2024002,
Pedro Oliveira,Turma B - 2o EM,2024003,98765432100
Ana Costa,Turma B - 2o EM,,
,Turma C,,
Teste Invalido,Turma C,2024005,123
```

**Step 2: Test the upload flow**

1. Navigate to `/alunos` as ADMIN or MANAGER
2. Click "Importar Alunos"
3. Upload the test CSV
4. Verify preview shows:
   - 4 valid students
   - 1 error (empty name on row 6)
   - 1 error (invalid CPF on row 7)
   - New classrooms listed
5. Click "Confirmar Importacao"
6. Verify result shows "4 alunos importados"
7. Verify students appear in the list

**Step 3: Test duplicate detection**

1. Re-upload the same CSV
2. Verify duplicates are detected (by CPF/matricula)
3. Verify preview shows duplicates as "ignorados"

**Step 4: Commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: address issues found during manual testing"
```

---

### Task 5: Final Polish and Cleanup

**Step 1: Run all existing tests to ensure nothing broke**

Run: `npx vitest run`
Expected: All 121+ existing tests pass plus new import tests

**Step 2: Verify build succeeds**

Run: `npx next build`
Expected: Build succeeds with no errors

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: bulk student import via CSV/Excel (P0 complete)"
```
