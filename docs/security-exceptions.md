# Security Exceptions

Este documento registra as exceções de segurança **intencionais** do backend.
Toda ocorrência listada aqui foi revisada e aceita — o scanner do Lovable
pode continuar sinalizando como `warn`, mas não é regressão.

Última revisão: **2026-07-10** (Rodada 23).

---

## 1. `public.has_role(uuid, app_role)` — SECURITY DEFINER executável por `authenticated`

- **Função:** `public.has_role(_user_id uuid, _role app_role) RETURNS boolean`
- **Origem:** `supabase/migrations/*` (helper padrão de RBAC recomendado pelo Supabase).
- **Scanner:** `SUPA_authenticated_security_definer_function_executable` (nível `warn`).
- **Status:** ✅ Exceção aceita.

### Motivo técnico

O projeto separa roles em tabela dedicada `public.user_roles` (evita
privilege escalation via `profiles`). Todas as políticas RLS derivam do
resultado desta função. Precisa ser:

- **`SECURITY DEFINER`**, para poder ler `public.user_roles` sem
  disparar a própria política RLS que está avaliando — sem isso,
  o `USING (has_role(auth.uid(), 'admin'))` entra em recursão e
  falha (`stack depth limit exceeded`), quebrando toda a API.
- **`STABLE`** + `SET search_path = public`, para bloquear
  ataques via `search_path` malicioso.
- **Executável por `authenticated`**, porque é o próprio helper
  usado dentro das políticas RLS avaliadas para cada request de
  usuário autenticado. Revogar `EXECUTE` derruba o RBAC inteiro.

### Por que não usar `service_role` no frontend

O `service_role` bypassa RLS globalmente e nunca deve viver no
navegador ou no client Supabase gerado. `has_role` é o único
caminho seguro para o frontend consultar permissões via RLS.

### Quem pode executar

- `authenticated` — via RLS, retorna apenas `true/false` sobre o
  próprio `auth.uid()` que a política envia como parâmetro.
- `service_role` — irrestrito, apenas em edge functions.
- **`anon` NÃO tem `EXECUTE`.**

### Mitigações em vigor

- A função nunca retorna dados sensíveis, apenas `boolean`.
- `SET search_path = public` fixo, sem risco de shadowing.
- Nenhum input textual — apenas `uuid` e `app_role` enum.
- Auditoria: qualquer alteração desta função exige nova revisão
  desta exceção.

### Próxima revisão

Reavaliar em caso de mudança do modelo de roles, migração para
Postgres RLS `SECURITY INVOKER` com bypass explícito, ou upgrade
do padrão recomendado pelo Supabase.
