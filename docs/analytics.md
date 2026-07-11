# Analytics — Rodada 25.1 Bloco B (Modo Desativado / Opção C)

## Status atual

- **Infraestrutura:** camada local em `src/lib/dataLayer.ts` + hook `src/hooks/useRoutePageview.ts`.
- **GTM:** desativado. `analyticsConfig.gtmEnabled = false`, `gtmId = undefined`. Nenhum loader externo é injetado.
- **GA4:** não configurado. Nenhum stream, nenhum measurement ID.
- **Consentimento:** não aplicado — nenhuma CMP nem banner nesta rodada.
- **Google Ads (`AW-16491950534`):** preservado, permanece no `index.html` sem alterações. É independente desta camada.
- **Transmissão externa dos NOVOS eventos:** zero. `pushDataLayerEvent` grava apenas em `window.dataLayer` do navegador. Não chama `gtag("event", …)`, não faz fetch/XHR, não conecta a `googletagmanager.com` / `google-analytics.com`.
- **Presença de `window.dataLayer`** não implica coleta GA4/GTM. É apenas o buffer local usado pela tag Ads preexistente e por esta camada de desenvolvimento.

## Eventos canônicos

| Evento              | Emissor                                        | Quando dispara                                       |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `virtual_page_view` | `useRoutePageview`                             | Refresh inicial + cada mudança de pathname SPA       |
| `cta_click`         | (legado `trackCtaClick`; contrato reservado)   | Cliques em CTAs                                      |
| `whatsapp_click`    | (legado `trackWhatsAppClick`; contrato reservado) | Cliques em CTAs WhatsApp                          |
| `triage_open`       | `GlobalTriageLauncher`                         | Abertura do wizard de triagem                        |
| `triage_step`       | `TriageWizard`                                 | Cada mudança de passo (exclui `submitting`/`error`)  |
| `triage_complete`   | `TriageWizard`                                 | Passo `done` após envio bem-sucedido                 |

## Allowlist de campos (`src/lib/dataLayer.ts`)

`event`, `page_path`, `page_title`, `route_type`, `surface`, `cta_id`, `source`, `service`, `city`, `neighborhood`, `step_id`, `step_index`, `completion_status`, `destination`.

Qualquer chave fora dessa lista é descartada pelo sanitizador. Chaves em `FORBIDDEN_FIELDS` (nome, telefone, e-mail, endereço, CEP, coordenadas, marca/modelo digitados, mensagens, mídia, `lead_id`, `user_agent`, `referrer` etc.) são explicitamente bloqueadas mesmo se aparecerem por engano.

Sempre usar `neighborhood` — nunca `bairro`, `district`, `neighbourhood`.

## Route types

`home`, `service`, `service_city`, `matrix_nacional`, `matrix_fallback`, `national_city`, `national_neighborhood`, `region`, `institutional`, `internal`, `not_found`.

O resolver (`resolveRouteContext`) reconhece o formato do pathname. A validação de cobertura real da matriz permanece na página correspondente (fonte de verdade). Se a página julgar a combinação inválida, o `route_type` continuará `matrix_nacional` no evento — mas o próprio `SEOHead` da página emitirá `noindex` e canônica não-self, de modo que o comportamento de indexação é preservado.

## Rotas internas excluídas

`/admin`, `/auth`, `/diagnostics`, `/diagnostico`, `/triagem-preview` — não geram `virtual_page_view`.

## Prevenção de duplicidade

- Dedupe interno (400ms) em `pushDataLayerEvent` por chave estável (evento + params ordenados).
- `useRoutePageview` guarda `lastPathRef` para não repetir por mudança de query/hash.
- StrictMode-safe: montagem dupla em dev não gera evento extra (dedupe + guarda).

## PII — proibido incluir

Nome, telefone, e-mail, CPF/CNPJ, endereço, número, complemento, CEP, latitude, longitude, precisão GPS, mensagem WhatsApp, URL completa do WhatsApp, texto livre, problema descrito, marca/modelo digitados, fotos, anexos, `lead_id`, conteúdo de formulário. A sanitização por allowlist é a barreira final — o caller nunca deve confiar apenas em si mesmo.

## Pré-requisitos para ativação futura (fora do escopo desta rodada)

1. GTM Container ID real (`GTM-XXXXXXX`) fornecido pelo dono do projeto.
2. Decisão formal sobre consentimento (CMP/banner se aplicável).
3. Revisão da política de privacidade e atualização do texto de cookies.
4. Definição de fonte única de pageview (SPA vs. GTM auto-pageview) para evitar duplicidade.
5. Configuração das tags no GTM (GA4, conversões etc.).
6. Validação via **Tag Assistant** e **GA4 DebugView**.
7. Publicação explícita do container.
8. Aprovação nova antes de qualquer alteração no `index.html` ou variável de build.

Esta rodada **não declara conformidade automática com LGPD/GDPR**. Ativação exigirá revisão jurídica.

## Comportamento em Strict Mode

Todos os efeitos que emitem eventos são idempotentes por chave (`lastPathRef`, `lastStepRef`, dedupe do dataLayer). Montagem dupla em desenvolvimento não gera evento extra.
