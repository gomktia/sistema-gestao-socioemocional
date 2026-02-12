# 🔐 Credenciais de Teste - EduInteligência SaaS

Use estas credenciais para navegar pelas diferentes perspectivas do sistema durante a sua apresentação.

## 🏢 1. Administrador da Escola (Manager)
**Função:** Visão Executiva, Gestão de Impacto e EWS.
- **E-mail:** `admin@escola.com`
- **Senha:** `123456`
- **O que testar:** Dashboard de Gestão de Impacto, Lançamento EWS, Configurações da Escola.

## 🧠 2. Psicólogo Escolar
**Função:** Triagem de Risco, PEI e Intervenções de Camada 3.
- **E-mail:** `psi@escola.com`
- **Senha:** `123456`
- **O que testar:** Student Profile, Criação de PEI (Individual Intervention Plan), Protocolo de Crise (PDF).

## 🍎 3. Professor
**Função:** Triagem SRSS-IE e Mapa de Risco da Turma.
- **E-mail:** `professor@escola.com`
- **Senha:** `123456`
- **O que testar:** Dashboard da Turma, Realização de Triagem SRSS-IE para alunos.

## 🎓 4. Aluno
**Função:** Autoconhecimento e Forças de Caráter (VIA).
- **E-mail:** `aluno@escola.com`
- **Senha:** `123456`
- **O que testar:** Responder questionário VIA, visualizar Radar de Forças e Forças de Assinatura.

---

## 🛠️ Super Admin (Painel SaaS Global)
Acesso restrito para gestão de faturamento e novas escolas.
- **E-mail:** `geisonhoehr@gmail.com` (ou o definido no `.env`)
- **Senha:** `123456`
- **Rota:** `/super-admin`

---

### ⚠️ Notas Importantes
- Todos os usuários pertencem ao tenant `Colégio Educador do Futuro`.
- A senha padrão para todos os usuários de teste foi definida como `123456`.
- Para testar o **Bloqueio de Assinatura**, altere o campo `subscriptionStatus` na tabela `tenants` para `past_due` via Prisma Studio ou SQL.
