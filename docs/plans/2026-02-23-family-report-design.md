# Family Report PDF — Design Document

**Date:** 2026-02-23
**Status:** Approved
**Feature:** Relatório para Famílias (P1.3)

---

## Summary

Expand the existing `TalentReport` component into a full Family Report PDF (3 pages). Add a personalized message field via a dialog, evolution narrative, and home activity suggestions. Button on both student profile and student list pages.

## User Flow

1. Psychologist/Counselor opens student profile (`/alunos/[id]`)
2. Clicks **"Gerar Relatório para Família"**
3. A dialog opens with a textarea for a **personalized message**
4. Clicks "Gerar PDF" → PDF downloads automatically
5. Audit logged: `FAMILY_REPORT_GENERATED`

## PDF Content (3 pages A4)

### Page 1 — Cover + Signature Strengths (existing, polished)
- Organization branding (school name from tenant)
- Student name, grade, date of issuance
- Top 5 Signature Strengths with virtue category
- Family tip per strength (already exists in TalentReport)

### Page 2 — Evolution + Home Suggestions
- **Positive Evolution Narrative**: Descriptive text showing progress across screening windows (Diagnostic → Monitoring → Final). NO numeric scores, NO risk tiers, NO technical terms. Example: "Na triagem de Março, João demonstrava necessidade de apoio na regulação emocional. Em Junho, houve melhoria significativa nesta área."
- **Home Activity Suggestions**: 3-5 practical activities based on the student's signature strengths. Mapped from strength type to concrete family activities.

### Page 3 — Professional Message + Closing
- Personalized message written by the psychologist/counselor
- Professional's name and role
- School contact information
- Footer disclaimer

## Content Guidelines

- **Language**: Accessible, positive, family-friendly Portuguese
- **NO**: Risk scores, tier numbers, technical terms (externalizing/internalizing), clinical jargon
- **YES**: Strengths-based framing, practical suggestions, encouraging tone
- Evolution described qualitatively ("melhoria", "progresso", "estabilidade") not quantitatively

## Evolution Narrative Logic

Map screening window data to qualitative descriptions:

| Score Change | Narrative |
|-------------|-----------|
| Decreased (improved) | "houve melhoria significativa" |
| Stable low | "manteve-se em nível saudável" |
| Stable mid | "manteve-se estável, com oportunidades de crescimento" |
| Increased (worsened) | "identificamos áreas que merecem atenção e apoio" |
| Single window only | "esta é a primeira avaliação, servindo como referência" |

## Home Suggestions Mapping

Each VIA strength maps to 2-3 family-friendly activities:

- **Curiosidade** → Explore museums, documentaries, science projects together
- **Criatividade** → Art projects, creative writing, building/making things
- **Perseverança** → Set small goals together, celebrate effort over results
- **Bondade** → Volunteer activities, helping neighbors, gratitude practice
- (Full mapping for all 24 strengths in implementation)

## Button Placement

### Student Profile (`/alunos/[id]`)
- Button "Gerar Relatório para Família" in the management panel area
- Only visible for PSYCHOLOGIST and COUNSELOR roles
- Disabled if VIA assessment is incomplete (need profile data)

### Student List (`/alunos`)
- Individual download icon per student row (future consideration)
- Initially: button only on profile page

## Dialog Component

- Modal dialog with:
  - Title: "Relatório para Família"
  - Student name displayed
  - Textarea: "Mensagem personalizada para a família" (optional, max 500 chars)
  - Placeholder text suggesting what to write
  - "Gerar PDF" button + "Cancelar"

## Architecture

### Modified File: `components/reports/TalentReport.tsx`
- Expand to accept new props: `evolutionNarrative`, `homeSuggestions`, `personalMessage`, `professionalName`, `schoolName`, `schoolContact`
- Add Page 2 and Page 3 sections
- Keep backward compatibility (new props optional)

### New File: `components/reports/FamilyReportDialog.tsx`
- Client component with dialog + textarea
- Calls dynamic import of TalentReport for PDF generation
- Handles download via blob URL pattern (same as ExportStudentsPDF)

### New File: `lib/report/family-report-helpers.ts`
- `generateEvolutionNarrative(evolutionData)` — Pure function mapping scores to qualitative text
- `getHomeSuggestions(signatureStrengths)` — Maps strengths to activity suggestions
- Testable, no side effects

### Modified File: `app/(portal)/alunos/[id]/page.tsx`
- Add FamilyReportDialog button (gated by role)
- Pass required data (strengths, evolution, student info)

## Permissions

- **Who can generate**: PSYCHOLOGIST, COUNSELOR only
- **Audit**: Log `FAMILY_REPORT_GENERATED` with `{ studentId, studentName, generatedBy }`
- **Data isolation**: tenantId check on all queries (already in place)

## Decisions

- **Approach**: Evolve existing TalentReport (not create new component)
- **PDF Library**: `@react-pdf/renderer` (already installed)
- **Evolution display**: Qualitative narrative text (not charts — charts don't render well in react-pdf)
- **Message field**: Optional textarea in dialog before generation
- **Batch export**: Deferred to future iteration (start with individual)
