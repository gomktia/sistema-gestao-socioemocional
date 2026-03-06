# Sistema Triavium - Próximos Passos

> **Para o Claude:** Leia este arquivo antes de começar. Ele contém o contexto completo do projeto e as próximas tarefas a implementar.

---

## Estado Atual do Projeto

O Sistema Triavium é uma plataforma SaaS multi-tenant de educação socioemocional para escolas brasileiras.

### Stack
- Next.js 15 + React 19 + TypeScript
- Prisma 6.0.0 + PostgreSQL (Supabase)
- Tailwind CSS + shadcn/ui
- Sentry (monitoramento)
- Resend (emails)
- Vercel (deploy)

### O que já está implementado (100%)
- 5 instrumentos de avaliação: VIA (Forças de Caráter), SRSS-IE (Triagem Comportamental), Big Five, IEAA (Autorregulação), EWS (Sistema de Alerta Precoce)
- Sistema RTI de 3 camadas (Universal, Direcionado, Intensivo) com InterventionGroup, InterventionLog, InterventionPlan
- Registro comportamental com alertas automáticos (severidade, categorias, regras de alerta)
- RBAC com 6 papéis: ADMIN, MANAGER, PSYCHOLOGIST, COUNSELOR, TEACHER, STUDENT
- Conformidade LGPD (consentimento, exportação de dados, auditoria)
- Multi-tenancy completo (Tenant, slug, subscription)
- "Minha Voz" — canal confidencial de escuta do aluno
- Dashboard executivo com evolução de risco entre janelas de triagem
- Relatórios com exportação Excel e PDF
- Notificações in-app com Supabase Realtime
- Onboarding wizard para gestores
- Demo setup para testes
- Hardening completo: 27 tasks em 4 fases (segurança, performance, qualidade, features)
- 121 testes passando
- Deploy funcionando na Vercel

### Repositório
- GitHub: https://github.com/gomktia/sistema-triavium-educacao.git
- Branch principal: main
- Vercel Project ID: prj_VZrQs7QmsRueLiweMASjYC0uuFow
- Supabase Project Ref: terwfdltjoiodcdzyctk (região sa-east-1)

---

## Roadmap de Próximas Features

### P0 — Crítico (implementar primeiro)

#### 1. Importação em Massa de Alunos
- Upload de CSV/Excel com dados dos alunos
- Validação de dados (nome, matrícula, turma, data nascimento)
- Preview antes de confirmar importação
- Tratamento de duplicatas (por matrícula)
- Relatório de erros pós-importação
- Arquivos envolvidos: criar `app/actions/import-students.ts`, `components/import/ImportStudentsDialog.tsx`
- Usar biblioteca `xlsx` ou `papaparse` para parsing
- Adicionar botão na página `/alunos`

#### 2. Portal do Responsável
- Novo role RESPONSIBLE (já existe no enum UserRole)
- Tela de login separada ou mesmo login com redirecionamento por role
- Dashboard do responsável mostrando:
  - Forças do filho (top 5 VIA) — SEM dados de risco
  - Sugestões de desenvolvimento
  - Comunicados da escola
- Consentimento LGPD digital (assinatura do responsável)
- Vinculação responsável-aluno (pode ter múltiplos filhos)
- Arquivos: criar rotas em `app/(portal)/responsavel/`, novo nav em `sidebar-nav.ts`

### P1 — Importante (implementar depois do P0)

#### 3. Relatório para Famílias (PDF)
- PDF amigável para entregar aos pais nas reuniões
- Conteúdo: forças do aluno, sugestões de atividades em casa, evolução positiva
- SEM termos técnicos, SEM scores de risco, SEM tiers
- Linguagem acessível e positiva
- Gerar via `@react-pdf/renderer` ou similar
- Botão no perfil do aluno: "Gerar Relatório para Família"

#### 4. Monitoramento de Progresso das Intervenções
- Gráfico de evolução do aluno ao longo das 3 janelas (Diagnóstica → Monitoramento → Final)
- Métricas de eficácia: % de alunos que migraram de Tier 3→2, Tier 2→1
- Comparativo antes/depois por grupo de intervenção
- Dashboard do gestor com KPIs de impacto
- Componentes em `components/dashboard/` e `components/management/`

#### 5. Tour Guiado / Onboarding Pedagógico
- Tour interativo no primeiro acesso (usar `driver.js` ou `react-joyride`)
- Steps contextuais por role (professor vê tour diferente do gestor)
- Tooltips explicando instrumentos e termos técnicos
- Glossário acessível: "O que é Tier 2?", "O que é Internalização?"
- Marcar tour como concluído no perfil do usuário

### P2 — Moderado (implementar após P1)

#### 6. Painel Comparativo entre Turmas
- Heatmap de risco por turma/série
- Ranking de turmas por % de alunos em cada tier
- Comparativo de adesão: qual turma completou mais triagens
- Filtros por janela de triagem, série, turno

#### 7. Calendário de Triagem Visual
- Visualização das 3 janelas de triagem no calendário
- Status de preenchimento por turma (completo/pendente/atrasado)
- Lembretes automáticos para professores (notificação + email)
- Configurável pelo gestor (datas de abertura/fechamento)

#### 8. Comunicação Escola-Família
- Envio de comunicados para responsáveis (in-app + email)
- Templates de mensagens (reunião, alerta positivo, convocação)
- Registro de atendimentos com famílias
- Agendamento de reuniões

### P3 — Baixa prioridade

#### 9. PWA / Experiência Mobile
- manifest.json + service worker
- Registro rápido de comportamento pelo celular
- Notificações push (web push API)

#### 10. SDQ (Strengths and Difficulties Questionnaire)
- Instrumento complementar ao SRSS-IE
- 25 itens, 5 escalas
- Versão para professor e para responsável

---

## Convenções do Projeto

- **Idioma do código:** inglês (variáveis, funções, types)
- **Idioma da UI:** português brasileiro
- **Testes:** Vitest + React Testing Library (121 testes existentes)
- **Estilo:** Tailwind CSS + componentes shadcn/ui
- **Server Actions:** app/actions/*.ts com validação Zod
- **Permissões:** checagem via `hasPermission()` em `src/core/permissions.ts`
- **Filtro de dados por role:** `filterProfileByRole()` (allowlist pattern)
- **Cache:** `unstable_cache` do Next.js para dados de tenant
- **Tipos:** centralizados em `src/core/types/index.ts`
- **Scoring:** motores de cálculo em `src/core/scoring.ts`, `src/core/bigfive.ts`, `src/core/ieaa.ts`

---

## Instruções para o Claude

1. Sempre leia os arquivos antes de modificá-los
2. Mantenha os 121 testes existentes passando
3. Siga o padrão de RBAC existente (hasPermission + filterProfileByRole)
4. Use Server Actions (não API routes) para mutações
5. Valide inputs com Zod
6. Isole dados por tenantId em todas as queries
7. Use `force-dynamic` em layouts que acessam cookies/auth
8. Commits em inglês, UI em português
9. Não adicione features além do solicitado (YAGNI)
10. Pergunte ao usuário antes de decisões arquiteturais importantes
