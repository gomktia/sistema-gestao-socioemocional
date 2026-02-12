# Design: Fluxo de Navegacao Aluno vs Professor
**Data:** 2026-02-11
**Status:** Aprovado via brainstorming

## Decisoes Principais

| Secao | Decisao |
|-------|---------|
| Navegacao | Portal unificado, sidebar dinamica por role |
| Questionario VIA | 6 steps por virtude, emojis, auto-save, mobile-first |
| Dashboard Professor | Grid SRSS-IE (desktop) + form (mobile) + mapa de risco |
| Resultados Aluno | Top 5 forcas, mapa 24 forcas por virtude, tom positivo |
| Cruzamento Preditivo | Cards Risco x Forca com CTA "Criar Intervencao" |
| Rotas e Auth | App Router groups, middleware RBAC, login -> redirect por role |
| Design System | Paleta RTI + Virtudes, shadcn/ui, 8 componentes custom |

---

## 1. Estrutura de Navegacao

Portal unificado com sidebar dinamica baseada no `role` do usuario logado.

### Sidebar por Role

- **STUDENT**: Inicio, Responder VIA, Minhas Forcas
- **TEACHER**: Inicio, Dashboard da Turma, Preencher SRSS-IE, Meus Alunos
- **PSYCHOLOGIST**: Inicio, Dashboard de Turmas, Alunos, Triagens, Intervencoes, Relatorios
- **COUNSELOR**: Mesmo do Psicologo (sem gestao)
- **MANAGER**: Tudo do Psicologo + Gestao (Turmas, Usuarios)
- **ADMIN**: Acesso total cross-tenant

---

## 2. Questionario VIA (Aluno)

### Divisao em Steps por Virtude (6 etapas)

- **Sabedoria**: 15 itens (5 forcas x 3 itens)
- **Coragem**: 12 itens (4 forcas x 3 itens)
- **Humanidade**: 9 itens (3 forcas x 3 itens)
- **Justica**: 9 itens (3 forcas x 3 itens)
- **Moderacao**: 12 itens (4 forcas x 3 itens)
- **Transcendencia**: 14 itens (5 forcas x 3 itens, Apreciacao ao Belo tem 2)

### Design Mobile-First

- Botoes de resposta grandes (min 48px) com emoji + numero
- Escala Likert visual: emojis como ancora (0-4)
- Auto-save por item (debounce 500ms, upsert no rawAnswers JSON)
- Scroll vertical continuo dentro do step
- Navegacao inferior fixa (Anterior/Proximo)
- Barra de progresso sticky no topo com nome da virtude
- Items embaralhados dentro do step para evitar vies
- Fallback localStorage se perder conexao

---

## 3. Dashboard do Professor

### 3a. Grid de Preenchimento SRSS-IE

- Layout spreadsheet: linhas = alunos, colunas = 12 itens
- Celula clicavel cicla 0->1->2->3->0
- Hover na coluna mostra label completo do item
- Tier calculado em tempo real ao completar 12 itens
- Auto-save por celula
- Alunos ordenáveis por nome ou tier
- Mobile: cai para formulario individual com swipe entre alunos

### 3b. Mapa de Risco da Turma

- 3 cards de resumo no topo (contagem por tier + percentual)
- Lista priorizada: Tier 3 primeiro, depois Tier 2
- Tier 1 oculto por padrao
- Alertas por serie (generateGradeAlerts agregado)
- Professor NAO ve scores numericos (apenas tier/cor + itens elevados)
- Clicar aluno expande card com forcas VIA (se respondeu)

---

## 4. Tela "Minhas Forcas" (Aluno)

### Principios

- Tom 100% positivo, nunca "fraqueza" ou "deficit"
- Bottom areas sao "Areas para Desenvolver" com linguagem de crescimento

### Elementos

- Top 5 forcas de assinatura em cards expandiveis (descricao + dica pratica + virtude-mae)
- Mapa completo das 24 forcas agrupado por 6 virtudes com barras coloridas
- Areas para Desenvolver: apenas 3 bottom com micro-sugestao acionavel
- Botao "Compartilhar com Professor" (aluno controla)

### Dados

- Consome `filterProfileByRole(profile, UserRole.STUDENT)` -> `{ allStrengths, signatureStrengths }`
- Descricoes amigiveis em `src/core/content/strength-descriptions.ts`
- Score normalizado 0-100 ja existe em `StrengthScore.normalizedScore`

---

## 5. Cruzamento Preditivo (Psicologo/Gestor)

### Layout: Perfil Integrado do Aluno

- Header dual: Risco (esquerda) x Forcas (direita)
- Alertas por serie com severity (CRITICO/OBSERVAR)
- Cards de cruzamento: Risco x Forca com estrategia e rationale
- Nota de fallback quando nenhuma forca de assinatura coincide
- Botao "Criar Intervencao" pre-preenche InterventionLog
- Historico longitudinal (3 janelas: Mar/Jun/Out) em grafico de linha
- Lista de intervencoes ativas com status e datas

### Diferenca entre papeis

- **Psicologo/Orientador**: tudo + campo observations (notas clinicas)
- **Gestor**: tudo exceto intervencoes clinicas (CRISIS_PROTOCOL, EXTERNAL_REFERRAL)
- **Professor**: NAO acessa esta tela

---

## 6. Rotas Next.js App Router

```
app/
  (auth)/
    login/page.tsx
    layout.tsx
  (portal)/
    layout.tsx              # Sidebar dinamica
    page.tsx                # Redirect por role
    questionario/page.tsx   # Aluno: VIA steps
    minhas-forcas/page.tsx  # Aluno: resultados
    turma/
      page.tsx              # Professor: dashboard
      triagem/page.tsx      # Professor: grid SRSS-IE
    alunos/
      page.tsx              # Lista filtrada por tier
      [id]/page.tsx         # Perfil integrado (cruzamento)
    intervencoes/
      page.tsx              # Lista
      nova/page.tsx         # Criar
    relatorios/page.tsx
    gestao/
      turmas/page.tsx
      usuarios/page.tsx
```

### Middleware RBAC

```typescript
const ROUTE_ACCESS = {
  '/questionario':    ['STUDENT'],
  '/minhas-forcas':   ['STUDENT'],
  '/turma':           ['TEACHER'],
  '/alunos':          ['PSYCHOLOGIST','COUNSELOR','MANAGER','ADMIN'],
  '/intervencoes':    ['PSYCHOLOGIST','COUNSELOR','MANAGER','ADMIN'],
  '/relatorios':      ['PSYCHOLOGIST','COUNSELOR','MANAGER','ADMIN'],
  '/gestao':          ['MANAGER','ADMIN'],
};
```

### Fluxo de Login

1. Email + senha via Supabase Auth
2. Middleware le role do User (tenantId + supabaseUid)
3. Redirect para pagina inicial do role
4. Primeira vez do aluno -> /questionario se nunca respondeu VIA
5. Sem registro publico (gestor cadastra usuarios)

---

## 7. Design System

### Paleta de Cores

**RTI Tiers:**
- Tier 1 (Verde): #22c55e (green-500)
- Tier 2 (Amarelo): #eab308 (yellow-500)
- Tier 3 (Vermelho): #ef4444 (red-500)

**6 Virtudes:**
- Sabedoria: #3b82f6 (blue-500)
- Coragem: #f97316 (orange-500)
- Humanidade: #ec4899 (pink-500)
- Justica: #8b5cf6 (violet-500)
- Moderacao: #06b6d4 (cyan-500)
- Transcendencia: #a855f7 (purple-500)

**Interface:**
- Background: #f8fafc (slate-50)
- Card: #ffffff
- Sidebar: #0f172a (slate-900)
- Brand/Accent: #6366f1 (indigo-500)

### Componentes shadcn/ui

Essenciais: Button, Card, Badge, Progress, Tabs, Table, Dialog, Sheet, Separator, Avatar, Tooltip, Skeleton, Sonner

Secundarios: Select, Form, Input, DropdownMenu, Command, Chart (recharts)

### Componentes Customizados

- TierBadge
- StrengthBar
- RiskSummaryCard
- VirtueGroup
- CrossoverCard
- SrssGrid
- QuestionnaireStep
- LongitudinalChart

### Responsividade

- Mobile (<768px): sidebar vira Sheet, grid vira form, cards empilham
- Tablet (768-1024): sidebar colapsada, grid funciona, 2 colunas
- Desktop (>1024): sidebar expandida, grid completo, layout dual
