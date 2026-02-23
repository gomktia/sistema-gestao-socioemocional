# Portal do Responsável — Design Document

## Overview

Parent/guardian portal allowing families to view their children's character strengths, positive evolution narrative, and home activity suggestions. MVP scope: strengths + suggestions only (no communications or LGPD consent signing).

## Architecture Decision

**Shared Portal Layout (Approach A)** — reuse the existing `(portal)` route group. The RBAC system already prevents unauthorized route access, so a separate layout is unnecessary duplication.

## Schema Changes

### 1. Add `RESPONSIBLE` to UserRole enum

```prisma
enum UserRole {
  ADMIN
  MANAGER
  PSYCHOLOGIST
  COUNSELOR
  TEACHER
  STUDENT
  RESPONSIBLE  // NEW
}
```

### 2. New `StudentGuardian` junction table

Supports multiple children per guardian and multiple guardians per student.

```prisma
model StudentGuardian {
  id          String              @id @default(cuid())
  tenantId    String
  studentId   String
  guardianId  String
  relationship GuardianRelationship
  createdAt   DateTime            @default(now())

  tenant   Tenant  @relation(fields: [tenantId], references: [id])
  student  Student @relation(fields: [studentId], references: [id])
  guardian User    @relation(fields: [guardianId], references: [id])

  @@unique([studentId, guardianId])
  @@index([guardianId])
  @@index([tenantId])
}

enum GuardianRelationship {
  MAE
  PAI
  AVO_A
  TIO_A
  OUTRO
}
```

### 3. New `GuardianInvite` table

```prisma
model GuardianInvite {
  id         String              @id @default(cuid())
  tenantId   String
  studentId  String
  email      String
  token      String              @unique
  status     InviteStatus        @default(PENDING)
  invitedBy  String
  createdAt  DateTime            @default(now())
  expiresAt  DateTime

  tenant  Tenant  @relation(fields: [tenantId], references: [id])
  student Student @relation(fields: [studentId], references: [id])
  inviter User    @relation(fields: [invitedBy], references: [id])

  @@index([token])
  @@index([tenantId])
}

enum InviteStatus {
  PENDING
  ACCEPTED
  EXPIRED
}
```

## Invitation Flow

1. Staff (Psychologist/Counselor/Manager) clicks "Convidar Responsável" on student profile
2. Dialog opens — enters guardian email and relationship type
3. Server action creates `GuardianInvite` with unique token (crypto.randomUUID), expires in 7 days
4. Email sent via Resend with link: `/convite?token=xxx`
5. Guardian clicks link → `/convite` page validates token, shows registration form (email pre-filled)
6. Guardian creates Supabase account → server action creates `User` (role=RESPONSIBLE) + `StudentGuardian` record
7. `GuardianInvite.status` set to ACCEPTED
8. Guardian redirected to `/responsavel`

### Edge Cases
- **Existing guardian account + new child**: If email matches existing RESPONSIBLE user, skip registration — just create new `StudentGuardian` link and redirect to login
- **Expired invite**: Show friendly message with "Contact school" guidance
- **Duplicate invite**: Allow re-sending (update existing record with new token/expiry)

## Guardian Dashboard (`/responsavel`)

### Child Selector
- If guardian has multiple children, show selector at top (tabs or dropdown)
- Default to first child

### Strengths Card
- Top 5 VIA signature strengths with name, virtue category, description
- Reuses existing `STRENGTH_DESCRIPTIONS` from `src/core/scoring.ts`

### Evolution Section
- Family-friendly narrative from `generateEvolutionNarrative()`
- Positive framing, no technical terms, no risk scores

### Suggestions Section
- Home activity suggestions per strength from `getHomeSuggestions()`
- 2-3 actionable activities per strength

### School Contact
- School name from tenant
- Contact info (if available)

## Permissions (RBAC)

### New role in ROLE_PERMISSIONS:
```typescript
RESPONSIBLE: [
  Permission.ASSESSMENT_VIEW_OWN_STRENGTHS,
]
```

### filterProfileByRole for RESPONSIBLE:
Same allowlist as STUDENT — only `allStrengths`, `signatureStrengths`.

### Data access:
- Guardian can ONLY access students linked via `StudentGuardian`
- All queries scoped by `tenantId` AND `guardianId`

### NOT visible to guardians:
- Risk tiers, SRSS-IE scores, Big Five raw data
- Intervention plans, logs, groups
- Teacher observations, behavior records
- Clinical/qualitative notes
- Other students' data

## Navigation (sidebar-nav.ts)

```typescript
RESPONSIBLE: [
  { title: "Início", href: "/responsavel", icon: Home },
  { title: "Perfil", href: "/responsavel/perfil", icon: User },
]
```

## Routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/responsavel` | RESPONSIBLE | Dashboard with child strengths |
| `/responsavel/perfil` | RESPONSIBLE | Guardian profile settings |
| `/convite` | Public | Invitation acceptance page |

### Auth routing changes:
- `RESPONSIBLE` home → `/responsavel`
- Add `/convite` to `PUBLIC_PATHS`
- Add `/responsavel` to `ROUTE_ACCESS` for RESPONSIBLE role

## Email Template

Simple Resend email with:
- School name in header
- "Você foi convidado para acompanhar o desenvolvimento de {studentName}"
- CTA button: "Criar Minha Conta"
- Link expires in 7 days note

## Security Considerations

- Token is crypto.randomUUID (128-bit entropy)
- Invite expires in 7 days
- Guardian can only see linked students (enforced at query level)
- All data scoped by tenantId
- No risk/clinical data exposed via filterProfileByRole allowlist
- Audit log: GUARDIAN_INVITE_SENT, GUARDIAN_ACCOUNT_CREATED, GUARDIAN_VIEWED_CHILD
