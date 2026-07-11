# Analytics — Rodada 25.1 Bloco B.1 (Modo Desativado / Opção C)

## Status atual

- **GTM:** desativado. Nenhum loader carregado, nenhum ID configurado.
- **GA4:** não configurado. Nenhum stream, nenhum measurement ID.
- **Google Ads (`AW-16491950534`):** preservado, permanece no `index.html`. É o único consumidor legítimo de `window.dataLayer` neste projeto.
- **Fila local nova:** `window.__PDT_ANALYTICS_QUEUE__` — **isolada** de `window.dataLayer`. Somente memória do tab; reiniciada em cada reload; capacidade máxima de 200 eventos (descarta os mais antigos).
- **Consentimento / CMP:** não implementado nesta rodada.
- **Transmissão externa dos eventos NOVOS:** zero. `pushLocalAnalyticsEvent` não chama `gtag`, não faz fetch/XHR, não conecta a `googletagmanager.com` / `google-analytics.com` / `analytics.google.com`.

> **Aviso importante:** a presença de `window.dataLayer` no site é uma consequência do script gtag.js do Google Ads. **Nossos eventos locais não vivem lá.** A fila local vive em `window.__PDT_ANALYTICS_QUEUE__`.

## Eventos locais canônicos

| Evento              | Emissor                                                       | Quando dispara                                       |
| ------------------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| `virtual_page_view` | `useRoutePageview`                                            | Refresh inicial + cada mudança de pathname SPA       |
| `cta_click`         | `trackCtaClick` (bridge local) + delegator                    | Cliques em CTAs (surface + cta_id)                   |
| `whatsapp_click`    | Delegator em `src/main.tsx`                                   | Cliques em `[data-wa-source]`                        |
| `triage_open`       | `GlobalTriageLauncher`                                        | Cada abertura do wizard                              |
| `triage_step`       | `TriageWizard`                                                | Cada mudança de passo (exceto `submitting`/`error`)  |
| `triage_complete`   | `TriageWizard`                                                | Passo `done` após envio bem-sucedido                 |

## Eventos legados (Google Ads / `window.dataLayer`)

Preservados nesta rodada, sem migração:

- `whatsapp_click`, `cta_click`, `quiz_complete`, `quiz_reset`, `terms_open`,
  `terms_accept`, `terms_full_page_click`, `web_vital`, `location_flow`.

Estes fluem via `trackEvent` (`analytics.ts`) → `window.dataLayer.push` + `gtag('event', …)`. **Não** consome nem alimenta a fila local nova.

## `trackQuizComplete` saneado (B.1)

Antes: enviava `problema` (identificador de problema livre) como parâmetro.
Depois: campo `problema` **removido** do payload. Somente `service`, `urgencia`, `city`, `bairro` (categóricos). Nome, telefone, e-mail, descrição, marca, modelo, mensagem — nunca entraram e continuam fora. Regressão coberta por `e2e/local-analytics.spec.ts` (teste "não transmite 'problema'").

## Allowlist (arquivo `src/lib/localAnalytics.ts`)

Chaves aceitas: `event`, `page_path`, `page_title`, `route_type`, `surface`, `cta_id`, `source`, `service`, `city`, `neighborhood`, `step_id`, `step_index`, `completion_status`, `destination`.

Sempre usar `neighborhood` — nunca `bairro` na fila local.

Chaves explicitamente bloqueadas (mesmo se o caller enviar): `problema`/`problem`, `descricao`/`description`, `message`/`mensagem`, `text`/`texto`, `phone`/`telefone`, `email`, `address`/`endereco`, `cep`, `latitude`/`longitude`/`accuracy`, `brand`/`marca`, `model`/`modelo`, `name`/`nome`, `cpf`, `cnpj`, `lead_id`, `user_id`, `photo`/`foto`, `attachment`, `media`, `whatsapp_url`/`wa_url`, `user_agent`, `referrer`.

## Route types

`home`, `service`, `service_city`, `matrix_nacional`, `matrix_fallback`, `national_city`, `national_neighborhood`, `region`, `institutional`, `internal`, `not_found`.

Resolver leve (`resolveRouteContext`) baseado em `matchPath`. Não importa dataset nacional. Validação real de cobertura permanece na página (`SEOHead` emite `noindex` para combinações inválidas).

## Rotas internas excluídas do pageview

`/admin`, `/auth`, `/diagnostics`, `/diagnostico`, `/triagem-preview`.

## Política de dedupe

Dedupe primário é **semântico**, não puramente temporal:

- `virtual_page_view`: `pv|<page_path>`.
- `triage_step`: `ts|<step_id>|<step_index>|<source>` — voltar a passo anterior emite novo evento legítimo.
- `triage_open`/`triage_complete`: `<event>|<page_path>|<source>` — segunda abertura real após ~400 ms fecha ok.
- `cta_click`/`whatsapp_click`: `<event>|<page_path>|<cta_id>|<surface>|<source>|<destination>` — bloqueia delegator + handler dupliando no mesmo tick, mas permite cliques distintos.

Um limite temporal de **400 ms** age apenas como proteção secundária contra re-render/StrictMode.

## Contrato CTA / WhatsApp

- Contextual (com `service`/`city`/`neighborhood`): valores factuais, nunca inferidos por GPS ou localStorage.
- Global (sem contexto factual): contexto ausente. Não inventar.
- WhatsApp: `destination=whatsapp` quando o alvo é `wa.me`. Nunca registra número, `?text=`, URL completa ou texto da mensagem.

## Contrato Triagem

- `triage_open` no launcher, ao (re)abrir o wizard.
- `triage_step` no `TriageWizard` via `useEffect(state.step)` — `submitting`/`error` não emitem.
- `triage_complete` uma vez em `done`.
- Nenhuma resposta do usuário (marca, modelo, texto, endereço, telefone, e-mail, mídias) entra em qualquer evento local.

## Comportamento em Strict Mode

Efeitos são idempotentes por chave semântica + dedupe temporal. Montagem dupla em dev não gera evento extra. Não há `<StrictMode>` no `main.tsx` atualmente; ativação futura permanecerá segura.

## Persistência

Nenhuma. Fila somente em memória do tab. Sem `localStorage`, `sessionStorage`, `cookie` ou backend. Reload zera o buffer.

## Bridge futuro (não implementado)

Ativação de coleta externa exigirá uma rodada dedicada:

`fila local` → **consentimento (CMP/banner)** → `window.dataLayer` / GTM tags.

Pré-requisitos formais:

1. GTM Container ID real (`GTM-XXXXXXX`) fornecido pelo dono do projeto.
2. Decisão formal sobre consentimento e escopo LGPD/GDPR.
3. Revisão da política de privacidade e atualização de texto de cookies.
4. Definição de fonte única de pageview (SPA vs. auto-pageview do GTM).
5. Configuração de tags GA4 no GTM.
6. Validação via **Tag Assistant** e **GA4 DebugView**.
7. Publicação explícita do container.

Esta rodada **não declara conformidade automática com LGPD/GDPR**, **não afirma** GA4 ou GTM ativos, **não** garante conversão mensurável em painel externo.
