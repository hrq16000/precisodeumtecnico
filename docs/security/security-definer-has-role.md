# Exceção documentada: `SECURITY DEFINER` em `public.has_role(uuid, app_role)`

## Warn reportado

O linter de segurança do backend emite um aviso (`warn`, não crítico) para funções
declaradas com `SECURITY DEFINER`. No repositório, a única função de autorização
nessa condição é:

```sql
public.has_role(_user_id uuid, _role app_role) returns boolean
  language sql stable security definer set search_path = public
```

## Por que a exceção é necessária

1. Os papéis ficam na tabela dedicada `public.user_roles` (nunca em `profiles`/`users`),
   exatamente para evitar escalonamento de privilégio.
2. `public.user_roles` tem RLS habilitada. Se `has_role` rodasse como `SECURITY INVOKER`,
   as políticas de outras tabelas que chamam `has_role` entrariam em **recursão de RLS**
   (política lê `user_roles`, que por sua vez avalia política, e assim por diante).
3. `SECURITY DEFINER` quebra essa recursão de forma controlada: a função só executa um
   `select exists(...)` parametrizado, não recebe SQL dinâmico e não expõe linhas.

## Controles que tornam a exceção segura

- `set search_path = public` fixo — impede sequestro de schema.
- Função `stable`, sem efeito colateral e sem `dynamic SQL`.
- Retorno booleano: não vaza nenhum dado de `user_roles`.
- Parâmetros tipados (`uuid`, `app_role`), sem concatenação de strings.
- `GRANT EXECUTE` restrito aos papéis necessários (`authenticated`, `service_role`);
  permissões sensíveis a `anon`/`public` foram revogadas em rodada anterior.

## Onde a exceção é aplicada no schema de permissões

- Definição da função e da tabela: migrações do backend em `supabase/migrations/`
  (busca por `has_role` e `user_roles`).
- Uso: cláusulas `using (public.has_role(auth.uid(), 'admin'))` nas políticas RLS de
  tabelas administrativas.
- Este documento é a justificativa oficial referenciada quando o scanner de segurança
  reporta o warn de `SECURITY DEFINER` para `public.has_role`.

## Revisão

Reavaliar esta exceção se:
- a função passar a aceitar SQL dinâmico ou retornar linhas;
- o `search_path` fixo for removido;
- `EXECUTE` for concedido a `anon` ou `public`.
