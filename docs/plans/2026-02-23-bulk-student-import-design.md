# Bulk Student Import — Design Document

**Date:** 2026-02-23
**Status:** Approved
**Feature:** Importacao em Massa de Alunos (P0)

---

## Summary

Add bulk student import via CSV/Excel file upload. A 3-step dialog (Upload -> Preview -> Confirm) accessible from the `/alunos` page. Only ADMIN and MANAGER roles can use it.

## User Flow

1. On `/alunos`, the user clicks **"Importar Alunos"**
2. A multi-step dialog opens:
   - **Step 1 — Upload:** Drag-and-drop or file picker (.csv, .xlsx). Max 5MB.
   - **Step 2 — Preview:** Table showing parsed rows. Valid rows in green, errors in red with messages. Summary: "X valid, Y errors, Z duplicates". User can go back and re-upload.
   - **Step 3 — Result:** After confirming, shows final summary: "42 students created, 3 new classrooms, 2 duplicates skipped". Option to download error report.

## File Format

Expected columns (flexible header mapping):

| Column | Required | Accepted Headers |
|--------|----------|-----------------|
| Nome | Yes | `nome`, `name`, `aluno` |
| Turma | Yes | `turma`, `classe`, `classroom` |
| Matricula | No | `matricula`, `enrollment`, `ra` |
| Data de Nascimento | No | `nascimento`, `data_nascimento`, `birth_date` |
| CPF | No | `cpf` |
| Nome do Responsavel | No | `responsavel`, `guardian` |
| Telefone do Responsavel | No | `telefone`, `phone` |
| Email do Responsavel | No | `email_responsavel`, `guardian_email` |

## Validation Rules (Server-side)

- **Nome:** Non-empty, 2-200 characters
- **Turma:** Non-empty
- **CPF:** If present, valid format (11 digits + check digits)
- **Data de Nascimento:** If present, valid date (DD/MM/YYYY or YYYY-MM-DD)
- **Duplicates:** Check `enrollmentId` and `cpf` against existing DB records -> mark as "skipped"
- **Non-existent classroom:** Auto-create (infer grade from name if possible)

## Duplicate Handling

- If a student with the same `enrollmentId` or `cpf` already exists in the tenant, skip the row
- Report skipped rows in the result summary

## Architecture

### Server Actions (`app/actions/import-students.ts`)

1. **`parseImportFile(formData: FormData)`**
   - Receives file, parses with `xlsx` library
   - Maps headers flexibly
   - Validates each row
   - Checks duplicates against DB
   - Returns `{ valid: Row[], errors: ErrorRow[], duplicates: Row[], newClassrooms: string[] }`

2. **`executeImport(validatedData)`**
   - Wraps in `prisma.$transaction`
   - Creates new classrooms first
   - Creates students via batch inserts
   - Logs audit: `action: 'STUDENTS_BULK_IMPORTED'`
   - Calls `revalidatePath('/alunos')`
   - Returns `{ created: number, classroomsCreated: number, skipped: number }`

### Component (`components/import/ImportStudentsDialog.tsx`)

- Client component with 3-step state machine
- Step 1: File upload with drag-and-drop
- Step 2: Preview table with validation status per row
- Step 3: Result summary

### Permissions

- Server action checks: `ADMIN` or `MANAGER` role
- All records created with `tenantId` from current user

### Parsing

- Use existing `xlsx` library (already in project for exports)
- `xlsx` reads both .csv and .xlsx formats

## Error Handling

- Empty file -> clear message
- Unsupported format -> clear message
- Missing required columns -> error naming the missing columns
- No valid rows -> disable confirm button
- DB error during transaction -> full rollback, user-facing message

## Audit

- Log `STUDENTS_BULK_IMPORTED` with details: `{ count, classroomsCreated, skippedDuplicates, filename }`

## Decisions

- **Format:** CSV and Excel (.xlsx)
- **Required fields:** Nome + Turma only
- **Duplicates:** Skip and report (no update)
- **Missing classroom:** Auto-create
- **Approach:** Dialog with 3 steps (not a separate page)
