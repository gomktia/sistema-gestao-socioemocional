-- ============================================================
-- RLS + TRIGGERS + FUNÇÕES AUXILIARES
-- Rodar no SQL Editor do Supabase após o Prisma criar as tabelas
-- ============================================================

-- ROW LEVEL SECURITY: Isolamento total entre tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_logs ENABLE ROW LEVEL SECURITY;

-- Funções auxiliares
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS TEXT AS $$
  SELECT "tenantId" FROM users WHERE "supabaseUid" = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS "Role" AS $$
  SELECT role FROM users WHERE "supabaseUid" = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Policies de isolamento por tenant
CREATE POLICY tenant_isolation ON tenants FOR ALL USING (id = get_user_tenant_id());
CREATE POLICY user_tenant_isolation ON users FOR ALL USING ("tenantId" = get_user_tenant_id());
CREATE POLICY classroom_tenant_isolation ON classrooms FOR ALL USING ("tenantId" = get_user_tenant_id());
CREATE POLICY student_tenant_isolation ON students FOR ALL USING ("tenantId" = get_user_tenant_id());
CREATE POLICY assessment_tenant_isolation ON assessments FOR ALL USING ("tenantId" = get_user_tenant_id());
CREATE POLICY intervention_tenant_isolation ON intervention_logs FOR ALL USING ("tenantId" = get_user_tenant_id());

-- Trigger: auto-update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_assessments_updated BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_interventions_updated BEFORE UPDATE ON intervention_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
