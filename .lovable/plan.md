# Rodada 27 — Observabilidade, ativos visuais e expansão regional

Cinco solicitações, dois conflitos com regras vigentes e volume alto. Proponho fatiar em 3 sub-rodadas e resolver os conflitos antes de escrever qualquer código.

## Conflitos de política a decidir agora

### 1. Botão WhatsApp com mensagem pré-preenchida em página pública
Regra atual (memória do projeto + guardrail Rodada 26): **a triagem é a porta única**, telefone/WhatsApp ficam ocultos até o handoff pós-classificação. Adicionar `wa.me` direto quebra:
- O funil V2 (perde categoria, sintoma, urgência, mídia obrigatória).
- O contrato analytics `triage_open` que sustenta o dashboard.
- O spec `e2e/whatsapp-context.spec.ts` e a lógica de `GlobalTriageLauncher`.

Três caminhos possíveis:
- **A. Manter regra (recomendado)**: nenhum botão WhatsApp em página pública. Mantemos só o CTA de triagem — que já entrega WhatsApp no fim do fluxo com contexto correto.
- **B. Exceção controlada**: liberar `wa.me` **apenas nas 3 páginas de serviço Curitiba** (TV Smart, Troca de Tela, Wi-Fi), com mensagem pré-preenchida por serviço, evento `wa_bypass` registrado na tabela `wa_bypass_events` e guardrail atualizado para permitir só nessas rotas.
- **C. Abandonar regra**: expor WhatsApp em todas as páginas de serviço (não recomendo — perde qualificação).

### 2. Galeria de "exemplos do que está incluso"
Não temos fotos reais de atendimentos. Opções:
- **A. Fotos reais** que você fornece (WebP + alt + legenda) — melhor para SEO e confiança, respeita a Rodada 23 (nada fabricado).
- **B. Ilustrações genéricas** geradas por IA, claramente rotuladas como ilustrativas nas legendas.
- **C. Adiar galeria** até haver material real.

## Escopo proposto — 3 sub-rodadas

### 27.1 — Sentry + validação de contratos de triagem (baixo risco)
- Instrumentação de erros via `@sentry/react` com `ErrorBoundary` global e `BrowserTracing`. DSN vem de `VITE_SENTRY_DSN` (secret publicável — pode ficar no bundle).
- Captura de falha de hidratação, erros de rota lazy e exceções não tratadas. Sampling 10% em produção, 100% em dev.
- Log local sanitizado (sem PII) mantido como fallback quando DSN não existir.
- Novo spec `e2e/triage-preclassification.spec.ts` valida que cada botão das 3 páginas Curitiba dispara `triage:open` com `category` e `symptomSlug` corretos (sem mapeamento incorreto). Cobre também o hero card de sintomas em `/assistencia-tecnica-curitiba`.

### 27.2 — Ativos visuais + decisão WhatsApp
- Galeria WebP com alt text e legenda nas páginas de TV Smart, Troca de Tela e Wi-Fi (fonte definida no conflito 2).
- Se aprovada opção B do conflito 1: componente `<WhatsAppQuickCTA/>` com mensagem por serviço, evento `wa_bypass` gravado, guardrail atualizado.

### 27.3 — Replicação regional (grande, precisa de duas passadas)
- **Passo 1** (mesma rodada): 9 páginas cidade (3 serviços × SJP, Pinhais, Colombo) via template compartilhado orientado a dados. Preços, prazos e JSON-LD idênticos por serviço, apenas cidade varia.
- **Passo 2** (rodada seguinte): páginas por bairro top 5 de cada cidade (5 bairros × 3 serviços × 4 cidades = 60 páginas). Precisamos definir a lista dos top 5 bairros de cada cidade antes; posso propor lista baseada nos dados de `regioes.ts`.

## Detalhes técnicos

- **Sentry**: pacote `@sentry/react`. Init em `src/main.tsx`. `VITE_SENTRY_DSN` opcional — se ausente, sentry fica inerte (não quebra build). Sem `beforeSend` custom que possa vazar; enviamos apenas erro, breadcrumb técnico e URL sem query.
- **Template regional**: novo `src/data/serviceCities.ts` com `{ city, slug, service, symptomSlug, ... }`. Uma página React genérica `src/pages/ServicoCidadeRegional.tsx` renderiza a partir da entrada. Uma rota `/servicos/:serviceSlug-:citySlug` ou 9 rotas explícitas — prefiro explícitas para evitar colisão com `/servicos/:slug`.
- **Guardrails**: atualizar `e2e/public-routes-smoke.spec.ts` a cada nova rota. Manifesto OG precisa cobrir novos títulos se gerarmos imagens.
- **Testes**: novo spec de pré-classificação, atualização do smoke e (se WhatsApp for aprovado) spec de dedupe/analytics do bypass.

## Decisões que preciso de você antes de executar 27.1

1. Conflito WhatsApp: **A**, **B** ou **C**?
2. Galeria: **A** (fotos reais que você envia), **B** (ilustrações IA rotuladas) ou **C** (adiar)?
3. Autorizo iniciar já pela **27.1 (Sentry + validação de contratos)**, que não depende das decisões acima?
