-- ============================================================
-- 004: POLÍTICAS RLS COMPLETAS
-- Complementa rls-and-functions.sql e 003-fixes-from-review.sql
-- Cobre: school_indicators, intervention_groups, intervention_plans, notifications
-- Adiciona: INSERT/UPDATE/DELETE policies em todas as tabelas operacionais
-- ============================================================

-- ===== 1. HABILITAR RLS NAS TABELAS QUE FALTAM =====

ALTER TABLE school_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ===== 2. TENANT ISOLATION (SELECT) NAS NOVAS TABELAS =====

CREATE POLICY school_indicator_tenant_isolation ON school_indicators
  FOR SELECT USING ("tenantId" = get_user_tenant_id());

CREATE POLICY intervention_group_tenant_isolation ON intervention_groups
  FOR SELECT USING ("tenantId" = get_user_tenant_id());

CREATE POLICY intervention_plan_tenant_isolation ON intervention_plans
  FOR SELECT USING ("tenantId" = get_user_tenant_id());

CREATE POLICY notification_tenant_isolation ON notifications
  FOR SELECT USING ("tenantId" = get_user_tenant_id());

-- ===== 3. INSERT POLICIES (só pode inserir no próprio tenant) =====

CREATE POLICY tenant_insert ON tenants
  FOR INSERT WITH CHECK (true); -- Apenas ADMIN via service_role

CREATE POLICY user_insert ON users
  FOR INSERT WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY classroom_insert ON classrooms
  FOR INSERT WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY student_insert ON students
  FOR INSERT WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY assessment_insert ON assessments
  FOR INSERT WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY intervention_log_insert ON intervention_logs
  FOR INSERT WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY school_indicator_insert ON school_indicators
  FOR INSERT WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY intervention_group_insert ON intervention_groups
  FOR INSERT WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY intervention_plan_insert ON intervention_plans
  FOR INSERT WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY notification_insert ON notifications
  FOR INSERT WITH CHECK ("tenantId" = get_user_tenant_id());

-- ===== 4. UPDATE POLICIES (só pode atualizar no próprio tenant) =====

CREATE POLICY user_update ON users
  FOR UPDATE USING ("tenantId" = get_user_tenant_id())
  WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY classroom_update ON classrooms
  FOR UPDATE USING ("tenantId" = get_user_tenant_id())
  WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY student_update ON students
  FOR UPDATE USING ("tenantId" = get_user_tenant_id())
  WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY assessment_update ON assessments
  FOR UPDATE USING ("tenantId" = get_user_tenant_id())
  WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY intervention_log_update ON intervention_logs
  FOR UPDATE USING ("tenantId" = get_user_tenant_id())
  WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY school_indicator_update ON school_indicators
  FOR UPDATE USING ("tenantId" = get_user_tenant_id())
  WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY intervention_group_update ON intervention_groups
  FOR UPDATE USING ("tenantId" = get_user_tenant_id())
  WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY intervention_plan_update ON intervention_plans
  FOR UPDATE USING ("tenantId" = get_user_tenant_id())
  WITH CHECK ("tenantId" = get_user_tenant_id());

CREATE POLICY notification_update ON notifications
  FOR UPDATE USING ("tenantId" = get_user_tenant_id())
  WITH CHECK ("tenantId" = get_user_tenant_id());

-- ===== 5. DELETE POLICIES (restrito a MANAGER e ADMIN) =====

CREATE POLICY student_delete ON students
  FOR DELETE USING (
    "tenantId" = get_user_tenant_id()
    AND get_user_role() IN ('MANAGER', 'ADMIN')
  );

CREATE POLICY classroom_delete ON classrooms
  FOR DELETE USING (
    "tenantId" = get_user_tenant_id()
    AND get_user_role() IN ('MANAGER', 'ADMIN')
  );

CREATE POLICY assessment_delete ON assessments
  FOR DELETE USING (
    "tenantId" = get_user_tenant_id()
    AND get_user_role() IN ('MANAGER', 'ADMIN')
  );

CREATE POLICY intervention_log_delete ON intervention_logs
  FOR DELETE USING (
    "tenantId" = get_user_tenant_id()
    AND get_user_role() IN ('MANAGER', 'ADMIN')
  );

CREATE POLICY school_indicator_delete ON school_indicators
  FOR DELETE USING (
    "tenantId" = get_user_tenant_id()
    AND get_user_role() IN ('MANAGER', 'ADMIN')
  );

CREATE POLICY intervention_group_delete ON intervention_groups
  FOR DELETE USING (
    "tenantId" = get_user_tenant_id()
    AND get_user_role() IN ('MANAGER', 'ADMIN')
  );

CREATE POLICY intervention_plan_delete ON intervention_plans
  FOR DELETE USING (
    "tenantId" = get_user_tenant_id()
    AND get_user_role() IN ('MANAGER', 'ADMIN')
  );

CREATE POLICY notification_delete ON notifications
  FOR DELETE USING (
    "tenantId" = get_user_tenant_id()
    AND get_user_role() IN ('MANAGER', 'ADMIN')
  );

-- ===== 6. ROLE-SPECIFIC RESTRICTIONS =====

-- Students: não podem ver school_indicators, intervention_groups ou intervention_plans
CREATE POLICY student_no_school_indicators ON school_indicators AS RESTRICTIVE
  FOR SELECT USING (get_user_role() != 'STUDENT');

CREATE POLICY student_no_intervention_groups ON intervention_groups AS RESTRICTIVE
  FOR SELECT USING (get_user_role() != 'STUDENT');

CREATE POLICY student_no_intervention_plans ON intervention_plans AS RESTRICTIVE
  FOR SELECT USING (get_user_role() != 'STUDENT');

-- Students: só veem notificações direcionadas a eles
CREATE POLICY student_own_notifications ON notifications AS RESTRICTIVE
  FOR SELECT USING (
    get_user_role() != 'STUDENT'
    OR "userId" = (SELECT id FROM users WHERE "supabaseUid" = auth.uid()::text LIMIT 1)
  );

-- Students: não podem inserir, atualizar ou deletar dados operacionais
CREATE POLICY student_no_insert_assessments ON assessments AS RESTRICTIVE
  FOR INSERT WITH CHECK (
    NOT (get_user_role() = 'STUDENT' AND type = 'SRSS_IE')
  );

-- ===== 7. TRIGGERS PARA NOVAS TABELAS =====

DROP TRIGGER IF EXISTS trg_school_indicators_updated ON school_indicators;
CREATE TRIGGER trg_school_indicators_updated
  BEFORE UPDATE ON school_indicators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_intervention_groups_updated ON intervention_groups;
CREATE TRIGGER trg_intervention_groups_updated
  BEFORE UPDATE ON intervention_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_intervention_plans_updated ON intervention_plans;
CREATE TRIGGER trg_intervention_plans_updated
  BEFORE UPDATE ON intervention_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
