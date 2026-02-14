# 🔐 Credenciais de Teste - EduInteligência SaaS

Use estas credenciais para navegar pelas diferentes perspectivas do sistema durante a sua apresentação. Você pode entrar usando tanto o **E-mail** quanto o **CPF**.

## 🏢 1. Administrador da Escola (Manager)
- **E-mail:** `admin@escola.com`
- **CPF:** `222.222.222-22`
- **Senha:** `123456`
- **O que testar:** Dashboard de Gestão de Impacto, Lançamento EWS, Configurações da Escola.

## 🧠 2. Psicólogo Escolar
- **E-mail:** `psi@escola.com`
- **CPF:** `333.333.333-33`
- **Senha:** `123456`
- **O que testar:** Student Profile, Criação de PEI, Protocolo de Crise (PDF).

## 🍎 3. Professor
- **E-mail:** `professor@escola.com`
- **CPF:** `444.444.444-44`
- **Senha:** `123456`
- **O que testar:** Dashboard da Turma, Realização de Triagem SRSS-IE.

## 🎓 4. Aluno
- **E-mail:** `aluno@escola.com`
- **CPF:** `555.555.555-55`
- **Senha:** `123456`
- **O que testar:** Responder questionário VIA, visualizar Radar de Forças.

---

## 🛠️ Super Admin (Global)
Acesso restrito para gestão de faturamento e novas escolas.
- **E-mail:** `geisonhoehr@gmail.com`
- **CPF:** `111.111.111-11`
- **Senha:** `123456`
- **Rota:** `/super-admin`

---

### ⚠️ Notas Importantes
- Todos os usuários pertencem ao tenant `Colégio Educador do Futuro`.
- A senha padrão para todos os usuários de teste foi definida como `123456`.
- Para testar o **Bloqueio de Assinatura**, altere o campo `subscriptionStatus` na tabela `tenants` para `past_due` via Prisma Studio ou SQL.
