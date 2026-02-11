-- ============================================================
-- MIGRATION: Sistema de Gestão Socioemocional
-- Target: Supabase PostgreSQL
-- Multi-tenant com RLS (Row Level Security)
-- ============================================================

-- Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'PSYCHOLOGIST', 'COUNSELOR', 'TEACHER', 'STUDENT');
CREATE TYPE "GradeLevel" AS ENUM ('ANO_1_EM', 'ANO_2_EM', 'ANO_3_EM');
CREATE TYPE "AssessmentType" AS ENUM ('VIA_STRENGTHS', 'SRSS_IE');
CREATE TYPE "ScreeningWindow" AS ENUM ('DIAGNOSTIC', 'MONITORING', 'FINAL');
CREATE TYPE "RiskTier" AS ENUM ('TIER_1', 'TIER_2', 'TIER_3');
CREATE TYPE "InterventionStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "InterventionType" AS ENUM (
  'SOCIAL_SKILLS_GROUP', 'EMOTION_REGULATION', 'CAREER_GUIDANCE',
  'PEER_MENTORING', 'STUDY_SKILLS', 'INDIVIDUAL_PLAN',
  'PSYCHOLOGIST_REFERRAL', 'EXTERNAL_REFERRAL', 'CRISIS_PROTOCOL',
  'FAMILY_MEETING', 'CHECK_IN_CHECK_OUT'
);

-- ============================================================
-- TENANTS (Escolas)
-- ============================================================
CREATE TABLE tenants (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name      TEXT NOT NULL,
  slug      TEXT NOT NULL UNIQUE,
  cnpj      TEXT UNIQUE,
  address   TEXT,
  city      TEXT,
  state     VARCHAR(2),
  phone     TEXT,
  email     TEXT,
  logo_url  TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- USERS (Usuários com RBAC)
-- ============================================================
CREATE TABLE users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          "Role" NOT NULL,
  supabase_uid  TEXT UNIQUE,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, email)
);
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_supabase_uid ON users(supabase_uid);

-- ============================================================
-- CLASSROOMS (Turmas)
-- ============================================================
CREATE TABLE classrooms (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  grade     "GradeLevel" NOT NULL,
  year      INTEGER NOT NULL,
  shift     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, name, year)
);
CREATE INDEX idx_classrooms_tenant ON classrooms(tenant_id);

-- ============================================================
-- STUDENTS (Alunos)
-- ============================================================
CREATE TABLE students (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id      TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  birth_date     DATE,
  grade          "GradeLevel" NOT NULL,
  classroom_id   TEXT REFERENCES classrooms(id),
  enrollment_id  TEXT,
  guardian_name   TEXT,
  guardian_phone  TEXT,
  guardian_email  TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, enrollment_id)
);
CREATE INDEX idx_students_tenant ON students(tenant_id);
CREATE INDEX idx_students_tenant_grade ON students(tenant_id, grade);
CREATE INDEX idx_students_classroom ON students(classroom_id);

-- ============================================================
-- ASSESSMENTS (Avaliações: VIA + SRSS-IE)
-- ============================================================
CREATE TABLE assessments (
  id                    TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id             TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id            TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type                  "AssessmentType" NOT NULL,
  screening_window      "ScreeningWindow" NOT NULL,
  academic_year         INTEGER NOT NULL,
  applied_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  screening_teacher_id  TEXT REFERENCES users(id),

  -- Respostas brutas (JSON)
  -- VIA: {"1": 3, "2": 4, ..., "71": 2}
  -- SRSS-IE: {"1": 0, "2": 1, ..., "12": 3}
  raw_answers           JSONB NOT NULL,

  -- Scores processados pelo motor de scoring (JSON)
  processed_scores      JSONB,

  -- Campos desnormalizados para queries e dashboards
  overall_tier          "RiskTier",
  externalizing_score   INTEGER,
  internalizing_score   INTEGER,
  self_knowledge_score  INTEGER,  -- Escala 1-10

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_assessments_tenant ON assessments(tenant_id);
CREATE INDEX idx_assessments_tenant_student ON assessments(tenant_id, student_id);
CREATE INDEX idx_assessments_screening ON assessments(tenant_id, type, screening_window, academic_year);
CREATE INDEX idx_assessments_tier ON assessments(tenant_id, overall_tier);
CREATE INDEX idx_assessments_student_type ON assessments(student_id, type, applied_at);

-- ============================================================
-- INTERVENTION_LOGS (Registro de Intervenções)
-- ============================================================
CREATE TABLE intervention_logs (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id        TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id       TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  author_id        TEXT NOT NULL REFERENCES users(id),
  type             "InterventionType" NOT NULL,
  status           "InterventionStatus" NOT NULL DEFAULT 'PLANNED',
  tier             "RiskTier" NOT NULL,

  title            TEXT NOT NULL,
  description      TEXT,
  goals            TEXT,
  observations     TEXT,  -- Dados clínicos (acesso restrito via RBAC)

  -- Cruzamento preditivo: forças usadas como alavanca
  leverage_strengths TEXT[] DEFAULT '{}',
  target_risks       TEXT[] DEFAULT '{}',

  start_date   DATE,
  end_date     DATE,
  next_review  DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_interventions_tenant ON intervention_logs(tenant_id);
CREATE INDEX idx_interventions_tenant_student ON intervention_logs(tenant_id, student_id);
CREATE INDEX idx_interventions_status ON intervention_logs(tenant_id, status);
CREATE INDEX idx_interventions_tier ON intervention_logs(tenant_id, tier);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Isolamento total de dados entre escolas (tenants)
-- ============================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_logs ENABLE ROW LEVEL SECURITY;

-- Função auxiliar: obter tenant_id do usuário autenticado
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS TEXT AS $$
  SELECT tenant_id FROM users WHERE supabase_uid = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Função auxiliar: obter role do usuário autenticado
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS "Role" AS $$
  SELECT role FROM users WHERE supabase_uid = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Policies: Cada tabela só mostra dados do tenant do usuário

-- Tenants: usuário vê apenas seu tenant
CREATE POLICY tenant_isolation ON tenants
  FOR ALL USING (id = get_user_tenant_id());

-- Users: vê apenas colegas do mesmo tenant
CREATE POLICY user_tenant_isolation ON users
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Classrooms: isolamento por tenant
CREATE POLICY classroom_tenant_isolation ON classrooms
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Students: isolamento por tenant
CREATE POLICY student_tenant_isolation ON students
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Assessments: isolamento por tenant + restrição por role
CREATE POLICY assessment_tenant_isolation ON assessments
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Assessments: Aluno vê apenas VIA_STRENGTHS próprio
CREATE POLICY assessment_student_own ON assessments
  FOR SELECT USING (
    get_user_role() = 'STUDENT'
    AND type = 'VIA_STRENGTHS'
    AND student_id IN (
      SELECT s.id FROM students s
      JOIN users u ON u.tenant_id = s.tenant_id
      WHERE u.supabase_uid = auth.uid()::text
      AND s.name = u.name  -- match por nome (ajustar conforme lógica real)
    )
  );

-- Intervention Logs: isolamento por tenant
CREATE POLICY intervention_tenant_isolation ON intervention_logs
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Intervention Logs: Professor NÃO vê campo observations (dados clínicos)
-- Nota: isso é melhor implementado na camada de aplicação (RBAC no código)
-- porque RLS não filtra colunas, apenas linhas.

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_interventions_updated_at BEFORE UPDATE ON intervention_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
