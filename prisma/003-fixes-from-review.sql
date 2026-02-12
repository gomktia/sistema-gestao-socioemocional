-- ============================================================
-- FIXES do Code Review (C3, C4, I2) + Recriar tabelas de referência
-- ============================================================

-- ===== RECRIAR TABELAS DE REFERÊNCIA (dropadas pelo Prisma) =====

-- VIA Question Items (71 itens)
CREATE TABLE IF NOT EXISTS via_question_items (
  id SERIAL PRIMARY KEY, item_number INTEGER NOT NULL UNIQUE,
  text_pt TEXT NOT NULL, strength TEXT NOT NULL, virtue TEXT NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 4
);
INSERT INTO via_question_items (item_number, text_pt, strength, virtue) VALUES
(1,'Sei o que fazer para que as pessoas se sintam bem','Inteligência Social','Humanidade'),
(2,'Trato todas as pessoas com igualdade','Imparcialidade','Justiça'),
(3,'Faço as coisas de jeitos diferentes','Criatividade','Sabedoria'),
(4,'Sou competente em dar conselhos','Sensatez','Sabedoria'),
(5,'Ter que aprender coisas novas me motiva','Amor ao Aprendizado','Sabedoria'),
(6,'Faço bons julgamentos, mesmo em situações difíceis','Sensatez','Sabedoria'),
(7,'Penso em diferentes possibilidades quando tomo uma decisão','Pensamento Crítico','Sabedoria'),
(8,'Sinto que a minha vida tem um sentido maior','Espiritualidade','Transcendência'),
(9,'Sou competente para analisar problemas por diferentes Ângulos','Pensamento Crítico','Sabedoria'),
(10,'Não minto para agradar pessoas','Autenticidade','Coragem'),
(11,'Reconheço meus defeitos','Modéstia','Moderação'),
(12,'Sou paciente','Autorregulação','Moderação'),
(13,'Viver é empolgante','Vitalidade','Coragem'),
(14,'Levo a vida com bom humor','Humor','Transcendência'),
(15,'Coisas boas me aguardam no futuro','Esperança','Transcendência'),
(16,'Eu me sinto amado(a)','Amor','Humanidade'),
(17,'Não vejo o tempo passar quando estou aprendendo algo novo','Amor ao Aprendizado','Sabedoria'),
(18,'Sempre tenho muita energia','Vitalidade','Coragem'),
(19,'As pessoas confiam na minha capacidade de liderança','Liderança','Justiça'),
(20,'Expresso meus afetos com clareza','Inteligência Social','Humanidade'),
(21,'Gosto de fazer gentilezas para os outros','Bondade','Humanidade'),
(22,'Tenho que agradecer pelas pessoas que fazem parte da minha vida','Gratidão','Transcendência'),
(23,'Sinto uma forte atração por novidades','Curiosidade','Sabedoria'),
(24,'Consigo encontrar em minha vida motivos para ser grato(a)','Gratidão','Transcendência'),
(25,'Gosto de descobrir coisas novas','Curiosidade','Sabedoria'),
(26,'Não guardo mágoa se alguém me maltrata','Perdão','Moderação'),
(27,'Creio que amanhã será melhor que hoje','Esperança','Transcendência'),
(28,'Acredito em uma força sagrada que nos liga um ao outro','Espiritualidade','Transcendência'),
(29,'Penso muito antes de tomar uma decisão','Prudência','Moderação'),
(30,'Crio coisas úteis','Criatividade','Sabedoria'),
(31,'Penso que todo mundo deve dedicar parte de seu tempo para melhorar o local onde habita','Cidadania','Justiça'),
(32,'Perdoo as pessoas facilmente','Perdão','Moderação'),
(33,'Sou uma pessoa verdadeira','Autenticidade','Coragem'),
(34,'Consigo criar um bom ambiente nos grupos que trabalho','Cidadania','Justiça'),
(35,'Enfrento perigos para fazer o bem','Bravura','Coragem'),
(36,'Analiso o que as pessoas dizem antes de dar minha opinião','Prudência','Moderação'),
(37,'Sou uma pessoa amorosa','Amor','Humanidade'),
(38,'Mantenho a calma em situações difíceis','Autorregulação','Moderação'),
(39,'Sei admirar a beleza que existe no mundo','Apreciação ao Belo','Transcendência'),
(40,'Não desisto antes de atingir as minhas metas','Perseverança','Coragem'),
(41,'Ajo de acordo com meus sentimentos','Autenticidade','Coragem'),
(42,'Consigo fazer as pessoas sorrirem com facilidade','Humor','Transcendência'),
(43,'Sinto um encantamento por pessoas talentosas','Apreciação ao Belo','Transcendência'),
(44,'Agradeço a cada dia pela vida','Gratidão','Transcendência'),
(45,'Não perco as oportunidades que tenho para aprender coisas novas','Amor ao Aprendizado','Sabedoria'),
(46,'Sou uma pessoa que tem humildade','Modéstia','Moderação'),
(47,'Eu me esforço em tudo que faço','Perseverança','Coragem'),
(48,'Tenho ideias originais','Criatividade','Sabedoria'),
(49,'Sei que as coisas darão certo','Esperança','Transcendência'),
(50,'Acho que é importante ajudar os outros','Bondade','Humanidade'),
(51,'Acreditar em um ser superior dá sentido à minha vida','Espiritualidade','Transcendência'),
(52,'Persisto para conquistar o que desejo','Perseverança','Coragem'),
(53,'Eu me sinto cheio(a) de vida','Vitalidade','Coragem'),
(54,'Penso que a vingança não vale a pena','Perdão','Moderação'),
(55,'Sou uma pessoa bastante disciplinada','Liderança','Justiça'),
(56,'Não ajo como se eu fosse melhor do que os outros','Modéstia','Moderação'),
(57,'Corro risco para fazer o que tem que ser feito','Bravura','Coragem'),
(58,'As regras devem ser cumpridas por todos','Imparcialidade','Justiça'),
(59,'Tenho muita facilidade para perceber os sentimentos das pessoas mesmo sem elas me dizerem','Inteligência Social','Humanidade'),
(60,'Sou uma pessoa cuidadosa','Autorregulação','Moderação'),
(61,'Faço coisas concretas para tornar o mundo um lugar melhor para se viver','Cidadania','Justiça'),
(62,'Tenho facilidade para organizar trabalhos em grupo','Liderança','Justiça'),
(63,'Consigo ajudar pessoas a se entenderem quando há uma discussão','Sensatez','Sabedoria'),
(64,'Tenho facilidade para fazer uma situação chata se tornar divertida','Humor','Transcendência'),
(65,'Costumo tomar decisões quando estou ciente das consequências dos meus atos','Prudência','Moderação'),
(66,'Dar é mais importante que receber','Bondade','Humanidade'),
(67,'Eu me sinto bem ao fazer a coisa certa mesmo que isso possa me prejudicar','Bravura','Coragem'),
(68,'Sou uma pessoa justa','Imparcialidade','Justiça'),
(69,'Sempre quero descobrir como as coisas funcionam','Curiosidade','Sabedoria'),
(70,'Tenho muitos amores','Amor','Humanidade'),
(71,'Mantenho minha mente aberta','Pensamento Crítico','Sabedoria')
ON CONFLICT (item_number) DO NOTHING;

-- SRSS-IE Items (12 itens)
CREATE TABLE IF NOT EXISTS srss_ie_items (
  id SERIAL PRIMARY KEY, item_number INTEGER NOT NULL UNIQUE,
  text_pt TEXT NOT NULL, domain TEXT NOT NULL CHECK (domain IN ('EXTERNALIZING','INTERNALIZING')),
  max_score INTEGER NOT NULL DEFAULT 3
);
INSERT INTO srss_ie_items (item_number, text_pt, domain) VALUES
(1,'Furto / Pegar coisas sem permissão','EXTERNALIZING'),
(2,'Mentira, trapaça ou dissimulação','EXTERNALIZING'),
(3,'Problemas de comportamento (indisciplina ativa)','EXTERNALIZING'),
(4,'Rejeição pelos colegas (isolado pelo grupo)','EXTERNALIZING'),
(5,'Baixo desempenho acadêmico (aquém do potencial)','EXTERNALIZING'),
(6,'Atitude negativa / Desafiadora','EXTERNALIZING'),
(7,'Comportamento agressivo (físico ou verbal)','EXTERNALIZING'),
(8,'Apatia emocional (pouca expressão facial/reação)','INTERNALIZING'),
(9,'Tímido / Retraído / Evita interação','INTERNALIZING'),
(10,'Triste / Deprimido / Melancólico','INTERNALIZING'),
(11,'Ansioso / Nervoso / Preocupado excessivamente','INTERNALIZING'),
(12,'Solitário (passa intervalos sozinho)','INTERNALIZING')
ON CONFLICT (item_number) DO NOTHING;

-- SRSS-IE Cutoffs
CREATE TABLE IF NOT EXISTS srss_ie_cutoffs (
  id SERIAL PRIMARY KEY, domain TEXT NOT NULL CHECK (domain IN ('EXTERNALIZING','INTERNALIZING')),
  tier "RiskTier" NOT NULL, min_score INTEGER NOT NULL, max_score INTEGER NOT NULL,
  color TEXT NOT NULL CHECK (color IN ('GREEN','YELLOW','RED')),
  action_pt TEXT NOT NULL, UNIQUE(domain, tier)
);
INSERT INTO srss_ie_cutoffs (domain, tier, min_score, max_score, color, action_pt) VALUES
('EXTERNALIZING','TIER_1',0,3,'GREEN','Camada 1 (Universal): Mantém-se no Projeto de Vida e currículo regular.'),
('EXTERNALIZING','TIER_2',4,8,'YELLOW','Camada 2 (Focalizada): Encaminhar para grupos de habilidades sociais ou oficinas de regulação. Monitorar mensalmente.'),
('EXTERNALIZING','TIER_3',9,21,'RED','Camada 3 (Intensiva): Encaminhamento individual para Psicólogo Escolar/Orientador. Plano Individual (PEI).'),
('INTERNALIZING','TIER_1',0,3,'GREEN','Camada 1 (Universal): Mantém-se no Projeto de Vida e currículo regular.'),
('INTERNALIZING','TIER_2',4,5,'YELLOW','Camada 2 (Focalizada): Encaminhar para grupos de habilidades sociais ou oficinas de regulação. Monitorar mensalmente.'),
('INTERNALIZING','TIER_3',6,15,'RED','Camada 3 (Intensiva): Encaminhamento individual para Psicólogo Escolar/Orientador. Plano Individual (PEI).')
ON CONFLICT (domain, tier) DO NOTHING;

-- Grade Focus Config
CREATE TABLE IF NOT EXISTS grade_focus_config (
  id SERIAL PRIMARY KEY, grade "GradeLevel" NOT NULL,
  focus_label TEXT NOT NULL, srss_item INTEGER NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('WATCH','CRITICAL')),
  rationale_pt TEXT NOT NULL, UNIQUE(grade, srss_item)
);
INSERT INTO grade_focus_config (grade, focus_label, srss_item, severity, rationale_pt) VALUES
('ANO_1_EM','Adaptação e Integração',4,'CRITICAL','Rejeição pelos colegas indica falha na integração ao Ensino Médio. Risco de evasão precoce.'),
('ANO_1_EM','Adaptação e Integração',12,'CRITICAL','Solidão indica falha na construção de vínculos na transição. Necessidade de acolhimento estruturado.'),
('ANO_1_EM','Adaptação e Integração',9,'WATCH','Retraimento pode indicar ansiedade social na adaptação ao novo ambiente escolar.'),
('ANO_2_EM','Comportamento e Limites',3,'CRITICAL','Indisciplina ativa é comum na fase de teste de limites. Necessidade de grupo de habilidades sociais.'),
('ANO_2_EM','Comportamento e Limites',6,'CRITICAL','Atitude desafiadora indica desengajamento escolar. Risco de deterioração do clima da turma.'),
('ANO_2_EM','Comportamento e Limites',7,'WATCH','Agressividade nesta fase pode escalar para conflitos sérios com pares.'),
('ANO_3_EM','Ansiedade e Futuro',11,'CRITICAL','Ansiedade elevada sugere crise pré-vestibular/burnout. Contexto de Ansiedade de Futuro.'),
('ANO_3_EM','Ansiedade e Futuro',5,'CRITICAL','Queda abrupta de desempenho no 3º ano pode indicar paralisia decisória ou burnout acadêmico.'),
('ANO_3_EM','Ansiedade e Futuro',10,'WATCH','Tristeza/depressão pode ser amplificada pela pressão de saída (ENEM, mercado de trabalho).')
ON CONFLICT (grade, srss_item) DO NOTHING;

-- VIA Strength Mapping (24 forças)
CREATE TABLE IF NOT EXISTS via_strength_mapping (
  id SERIAL PRIMARY KEY, strength_id INTEGER NOT NULL UNIQUE,
  strength TEXT NOT NULL, virtue TEXT NOT NULL,
  item_numbers INTEGER[] NOT NULL, max_possible INTEGER NOT NULL
);
INSERT INTO via_strength_mapping (strength_id, strength, virtue, item_numbers, max_possible) VALUES
(1,'Criatividade','Sabedoria',ARRAY[3,30,48],12),
(2,'Curiosidade','Sabedoria',ARRAY[23,25,69],12),
(3,'Pensamento Crítico','Sabedoria',ARRAY[7,9,71],12),
(4,'Amor ao Aprendizado','Sabedoria',ARRAY[5,17,45],12),
(5,'Sensatez','Sabedoria',ARRAY[4,63,6],12),
(6,'Bravura','Coragem',ARRAY[35,57,67],12),
(7,'Perseverança','Coragem',ARRAY[40,47,52],12),
(8,'Autenticidade','Coragem',ARRAY[10,33,41],12),
(9,'Vitalidade','Coragem',ARRAY[13,18,53],12),
(10,'Amor','Humanidade',ARRAY[16,37,70],12),
(11,'Bondade','Humanidade',ARRAY[21,50,66],12),
(12,'Inteligência Social','Humanidade',ARRAY[1,20,59],12),
(13,'Cidadania','Justiça',ARRAY[31,34,61],12),
(14,'Imparcialidade','Justiça',ARRAY[2,58,68],12),
(15,'Liderança','Justiça',ARRAY[19,62,55],12),
(16,'Perdão','Moderação',ARRAY[26,32,54],12),
(17,'Modéstia','Moderação',ARRAY[11,46,56],12),
(18,'Prudência','Moderação',ARRAY[29,36,65],12),
(19,'Autorregulação','Moderação',ARRAY[12,38,60],12),
(20,'Apreciação ao Belo','Transcendência',ARRAY[39,43],8),
(21,'Gratidão','Transcendência',ARRAY[22,24,44],12),
(22,'Humor','Transcendência',ARRAY[14,42,64],12),
(23,'Esperança','Transcendência',ARRAY[15,27,49],12),
(24,'Espiritualidade','Transcendência',ARRAY[8,28,51],12)
ON CONFLICT (strength_id) DO NOTHING;

-- ===== FIX C3: Corrigir RLS policy assessment_student_own =====
-- Dropar a policy antiga que usa name matching
DROP POLICY IF EXISTS assessment_student_own ON assessments;

-- Nova policy: usa a FK studentId no User
CREATE POLICY assessment_student_own ON assessments
  FOR SELECT USING (
    get_user_role() = 'STUDENT'
    AND type = 'VIA_STRENGTHS'
    AND "studentId" = (
      SELECT u."studentId" FROM users u
      WHERE u."supabaseUid" = auth.uid()::text
      LIMIT 1
    )
  );

-- ===== FIX C4: Tornar teacher_srss_only RESTRICTIVE =====
DROP POLICY IF EXISTS teacher_srss_only ON assessments;

CREATE POLICY teacher_srss_only ON assessments AS RESTRICTIVE
  FOR INSERT WITH CHECK (
    NOT (get_user_role() = 'TEACHER' AND type = 'VIA_STRENGTHS')
  );

-- ===== FIX I2: Adicionar policies restritivas para STUDENT =====

-- Students: aluno só vê seu próprio registro
CREATE POLICY student_own_record ON students AS RESTRICTIVE
  FOR SELECT USING (
    get_user_role() != 'STUDENT'
    OR id = (SELECT u."studentId" FROM users u WHERE u."supabaseUid" = auth.uid()::text LIMIT 1)
  );

-- Intervention Logs: aluno NÃO pode ver nenhuma intervenção
CREATE POLICY student_no_interventions ON intervention_logs AS RESTRICTIVE
  FOR SELECT USING (
    get_user_role() != 'STUDENT'
  );

-- Assessments: aluno só vê VIA próprias (já coberto por assessment_student_own acima)
-- Mas precisamos garantir que SRSS_IE seja invisível para alunos
CREATE POLICY student_no_srss ON assessments AS RESTRICTIVE
  FOR SELECT USING (
    get_user_role() != 'STUDENT'
    OR (type = 'VIA_STRENGTHS' AND "studentId" = (
      SELECT u."studentId" FROM users u WHERE u."supabaseUid" = auth.uid()::text LIMIT 1
    ))
  );

-- ===== RLS nas tabelas de referência =====
ALTER TABLE via_question_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE srss_ie_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE srss_ie_cutoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_focus_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE via_strength_mapping ENABLE ROW LEVEL SECURITY;

CREATE POLICY via_items_read ON via_question_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY srss_items_read ON srss_ie_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY srss_cutoffs_read ON srss_ie_cutoffs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY grade_focus_read ON grade_focus_config FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY via_mapping_read ON via_strength_mapping FOR SELECT USING (auth.uid() IS NOT NULL);

-- ===== Recriar RLS e triggers que Prisma pode ter dropado =====
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_logs ENABLE ROW LEVEL SECURITY;

-- Recriar funções auxiliares
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS TEXT AS $$
  SELECT "tenantId" FROM users WHERE "supabaseUid" = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS "Role" AS $$
  SELECT role FROM users WHERE "supabaseUid" = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Recriar tenant isolation policies (IF NOT EXISTS via DROP IF EXISTS + CREATE)
DROP POLICY IF EXISTS tenant_isolation ON tenants;
CREATE POLICY tenant_isolation ON tenants FOR ALL USING (id = get_user_tenant_id());

DROP POLICY IF EXISTS user_tenant_isolation ON users;
CREATE POLICY user_tenant_isolation ON users FOR ALL USING ("tenantId" = get_user_tenant_id());

DROP POLICY IF EXISTS classroom_tenant_isolation ON classrooms;
CREATE POLICY classroom_tenant_isolation ON classrooms FOR ALL USING ("tenantId" = get_user_tenant_id());

DROP POLICY IF EXISTS student_tenant_isolation ON students;
CREATE POLICY student_tenant_isolation ON students FOR ALL USING ("tenantId" = get_user_tenant_id());

DROP POLICY IF EXISTS assessment_tenant_isolation ON assessments;
CREATE POLICY assessment_tenant_isolation ON assessments FOR ALL USING ("tenantId" = get_user_tenant_id());

DROP POLICY IF EXISTS intervention_tenant_isolation ON intervention_logs;
CREATE POLICY intervention_tenant_isolation ON intervention_logs FOR ALL USING ("tenantId" = get_user_tenant_id());

-- Triggers updated_at
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW."updatedAt" = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tenants_updated ON tenants;
CREATE TRIGGER trg_tenants_updated BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_students_updated ON students;
CREATE TRIGGER trg_students_updated BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_assessments_updated ON assessments;
CREATE TRIGGER trg_assessments_updated BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_interventions_updated ON intervention_logs;
CREATE TRIGGER trg_interventions_updated BEFORE UPDATE ON intervention_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
