-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'PSYCHOLOGIST', 'COUNSELOR', 'TEACHER', 'STUDENT');

-- CreateEnum
CREATE TYPE "GradeLevel" AS ENUM ('ANO_1_EM', 'ANO_2_EM', 'ANO_3_EM');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('VIA_STRENGTHS', 'SRSS_IE');

-- CreateEnum
CREATE TYPE "ScreeningWindow" AS ENUM ('DIAGNOSTIC', 'MONITORING', 'FINAL');

-- CreateEnum
CREATE TYPE "RiskTier" AS ENUM ('TIER_1', 'TIER_2', 'TIER_3');

-- CreateEnum
CREATE TYPE "InterventionStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InterventionType" AS ENUM ('SOCIAL_SKILLS_GROUP', 'EMOTION_REGULATION', 'CAREER_GUIDANCE', 'PEER_MENTORING', 'STUDY_SKILLS', 'INDIVIDUAL_PLAN', 'PSYCHOLOGIST_REFERRAL', 'EXTERNAL_REFERRAL', 'CRISIS_PROTOCOL', 'FAMILY_MEETING', 'CHECK_IN_CHECK_OUT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('CRITICAL_RISK', 'NEW_ASSESSMENT', 'INTERVENTION_DUE', 'SYSTEM_ALERT');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('EDUCATIONAL', 'MILITARY', 'CORPORATE', 'SPORTS');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "cnpj" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" VARCHAR(2),
    "phone" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "organizationType" "OrganizationType" NOT NULL DEFAULT 'EDUCATIONAL',
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "supabaseUid" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "grade" "GradeLevel" NOT NULL,
    "classroomId" TEXT,
    "enrollmentId" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFormEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_invitations" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "usedByStudentId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_questions" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT,
    "type" "AssessmentType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classrooms" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" "GradeLevel" NOT NULL,
    "year" INTEGER NOT NULL,
    "shift" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "AssessmentType" NOT NULL,
    "screeningWindow" "ScreeningWindow" NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "screeningTeacherId" TEXT,
    "rawAnswers" JSONB NOT NULL,
    "processedScores" JSONB,
    "overallTier" "RiskTier",
    "externalizingScore" INTEGER,
    "internalizingScore" INTEGER,
    "selfKnowledgeScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervention_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" "InterventionType" NOT NULL,
    "status" "InterventionStatus" NOT NULL DEFAULT 'PLANNED',
    "tier" "RiskTier" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "goals" TEXT,
    "observations" TEXT,
    "leverageStrengths" TEXT[],
    "targetRisks" TEXT[],
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "nextReview" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intervention_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_indicators" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "attendanceRate" DOUBLE PRECISION NOT NULL,
    "academicAverage" DOUBLE PRECISION NOT NULL,
    "disciplinaryLogs" INTEGER NOT NULL DEFAULT 0,
    "previousAverage" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervention_groups" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "InterventionType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "intervention_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervention_plans" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "targetRisks" TEXT[],
    "leverageStrengths" TEXT[],
    "strategicActions" TEXT NOT NULL,
    "expectedOutcome" TEXT,
    "reviewDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intervention_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "studentId" TEXT,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "via_question_items" (
    "id" SERIAL NOT NULL,
    "item_number" INTEGER NOT NULL,
    "text_pt" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "virtue" TEXT NOT NULL,
    "max_score" INTEGER NOT NULL DEFAULT 4,

    CONSTRAINT "via_question_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "srss_ie_items" (
    "id" SERIAL NOT NULL,
    "item_number" INTEGER NOT NULL,
    "text_pt" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "max_score" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "srss_ie_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "srss_ie_cutoffs" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,
    "tier" "RiskTier" NOT NULL,
    "min_score" INTEGER NOT NULL,
    "max_score" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "action_pt" TEXT NOT NULL,

    CONSTRAINT "srss_ie_cutoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_focus_config" (
    "id" SERIAL NOT NULL,
    "grade" "GradeLevel" NOT NULL,
    "focus_label" TEXT NOT NULL,
    "srss_item" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "rationale_pt" TEXT NOT NULL,

    CONSTRAINT "grade_focus_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "via_strength_mapping" (
    "id" SERIAL NOT NULL,
    "strength_id" INTEGER NOT NULL,
    "strength" TEXT NOT NULL,
    "virtue" TEXT NOT NULL,
    "item_numbers" INTEGER[],
    "max_possible" INTEGER NOT NULL,

    CONSTRAINT "via_strength_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InterventionGroupToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_InterventionGroupToStudent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_cnpj_key" ON "tenants"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "users_supabaseUid_key" ON "users"("supabaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "users_studentId_key" ON "users"("studentId");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE INDEX "users_supabaseUid_idx" ON "users"("supabaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenantId_email_key" ON "users"("tenantId", "email");

-- CreateIndex
CREATE INDEX "students_tenantId_idx" ON "students"("tenantId");

-- CreateIndex
CREATE INDEX "students_tenantId_grade_idx" ON "students"("tenantId", "grade");

-- CreateIndex
CREATE INDEX "students_classroomId_idx" ON "students"("classroomId");

-- CreateIndex
CREATE UNIQUE INDEX "students_tenantId_enrollmentId_key" ON "students"("tenantId", "enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "student_invitations_token_key" ON "student_invitations"("token");

-- CreateIndex
CREATE INDEX "student_invitations_token_idx" ON "student_invitations"("token");

-- CreateIndex
CREATE INDEX "student_invitations_tenantId_idx" ON "student_invitations"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "form_questions_type_number_key" ON "form_questions"("type", "number");

-- CreateIndex
CREATE INDEX "classrooms_tenantId_idx" ON "classrooms"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "classrooms_tenantId_name_year_key" ON "classrooms"("tenantId", "name", "year");

-- CreateIndex
CREATE INDEX "assessments_tenantId_idx" ON "assessments"("tenantId");

-- CreateIndex
CREATE INDEX "assessments_tenantId_studentId_idx" ON "assessments"("tenantId", "studentId");

-- CreateIndex
CREATE INDEX "assessments_tenantId_type_screeningWindow_academicYear_idx" ON "assessments"("tenantId", "type", "screeningWindow", "academicYear");

-- CreateIndex
CREATE INDEX "assessments_tenantId_overallTier_idx" ON "assessments"("tenantId", "overallTier");

-- CreateIndex
CREATE INDEX "assessments_studentId_type_appliedAt_idx" ON "assessments"("studentId", "type", "appliedAt");

-- CreateIndex
CREATE INDEX "intervention_logs_tenantId_idx" ON "intervention_logs"("tenantId");

-- CreateIndex
CREATE INDEX "intervention_logs_tenantId_studentId_idx" ON "intervention_logs"("tenantId", "studentId");

-- CreateIndex
CREATE INDEX "intervention_logs_tenantId_status_idx" ON "intervention_logs"("tenantId", "status");

-- CreateIndex
CREATE INDEX "intervention_logs_tenantId_tier_idx" ON "intervention_logs"("tenantId", "tier");

-- CreateIndex
CREATE INDEX "school_indicators_tenantId_idx" ON "school_indicators"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "school_indicators_studentId_academicYear_quarter_key" ON "school_indicators"("studentId", "academicYear", "quarter");

-- CreateIndex
CREATE INDEX "intervention_groups_tenantId_idx" ON "intervention_groups"("tenantId");

-- CreateIndex
CREATE INDEX "intervention_plans_studentId_idx" ON "intervention_plans"("studentId");

-- CreateIndex
CREATE INDEX "intervention_plans_tenantId_idx" ON "intervention_plans"("tenantId");

-- CreateIndex
CREATE INDEX "notifications_tenantId_idx" ON "notifications"("tenantId");

-- CreateIndex
CREATE INDEX "notifications_tenantId_userId_isRead_idx" ON "notifications"("tenantId", "userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_tenantId_createdAt_idx" ON "notifications"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "via_question_items_item_number_key" ON "via_question_items"("item_number");

-- CreateIndex
CREATE UNIQUE INDEX "srss_ie_items_item_number_key" ON "srss_ie_items"("item_number");

-- CreateIndex
CREATE UNIQUE INDEX "srss_ie_cutoffs_domain_tier_key" ON "srss_ie_cutoffs"("domain", "tier");

-- CreateIndex
CREATE UNIQUE INDEX "grade_focus_config_grade_srss_item_key" ON "grade_focus_config"("grade", "srss_item");

-- CreateIndex
CREATE UNIQUE INDEX "via_strength_mapping_strength_id_key" ON "via_strength_mapping"("strength_id");

-- CreateIndex
CREATE INDEX "_InterventionGroupToStudent_B_index" ON "_InterventionGroupToStudent"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_invitations" ADD CONSTRAINT "student_invitations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_screeningTeacherId_fkey" FOREIGN KEY ("screeningTeacherId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_logs" ADD CONSTRAINT "intervention_logs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_logs" ADD CONSTRAINT "intervention_logs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_logs" ADD CONSTRAINT "intervention_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_indicators" ADD CONSTRAINT "school_indicators_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_indicators" ADD CONSTRAINT "school_indicators_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_groups" ADD CONSTRAINT "intervention_groups_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_plans" ADD CONSTRAINT "intervention_plans_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_plans" ADD CONSTRAINT "intervention_plans_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervention_plans" ADD CONSTRAINT "intervention_plans_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_focus_config" ADD CONSTRAINT "grade_focus_config_srss_item_fkey" FOREIGN KEY ("srss_item") REFERENCES "srss_ie_items"("item_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterventionGroupToStudent" ADD CONSTRAINT "_InterventionGroupToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "intervention_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterventionGroupToStudent" ADD CONSTRAINT "_InterventionGroupToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
