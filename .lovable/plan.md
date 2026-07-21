## Sequenciamento acordado (fatiar em rodadas)

Decisões travadas nas respostas:
- **WhatsApp direto**: exceção pós-triagem apenas — nunca em página pública.
- **Sentry**: substituído por logger local + edge function `log-frontend-error` gravando em tabela `frontend_errors`.
- **Bairros**: Top 5 por cidade (5 Curitiba + 5 SJP + 5 Pinhais + 5 Colombo = 20 páginas), na 26.3.

### Rodada 26.1 — Troca de tela TV (Curitiba) + smoke + verificação produção  ← **começar por esta**

**Escopo**
1. Nova página `/servicos/troca-de-tela-tv-curitiba` (rota + entrada em `src/data/services.ts` ou análoga).
   - H1, seção "Como funciona" (coleta obrigatória — regra já existente para TV), preço estimado (R$ 299,99 mínimo coleta), prazo, escopo do serviço, quando NÃO compensa trocar, FAQ local.
   - CTA único → dispara `triage:open` com pré-classificação (equipamento=TV, sintoma=tela quebrada).
   - JSON-LD `Service` + `FAQPage` + `BreadcrumbList` (paridade DOM ↔ schema, política Rodada 23).
   - Sem AggregateRating; usar `getTestimonialsForService` para reviews individuais se houver match.
2. Verificação de produção: fetch de `https://precisodeumtecnico.com/`, checar 200, presença de `<div id="root">` populado, ausência de erros de hidratação no HTML, canonical único.
3. Smoke test automatizado `e2e/smoke-boot.spec.ts`: build → carrega `/`, valida header, H1, canonical, ausência de console.error, root não vazio. Rodar também contra a nova rota.

**Aceite**: typecheck + build + guards verdes; suíte E2E incluindo o novo smoke; fetch de produção OK.

---

### Rodada 26.2 — Replicação SJP / Pinhais / Colombo (3 serviços × 3 cidades = 9 páginas)
Conserto TV Smart, Troca de Tela TV, Configuração Wi-Fi. Reaproveita componentes/data-driven da 26.1. JSON-LD completo.

### Rodada 26.3 — Bairros × Conserto TV Smart (Top 5 por cidade = 20 páginas)
Gerar por template + dados locais (`src/data/neighborhoods.ts`). Links internos cidade↔bairro. Guard anti-thin-content (mínimo de tokens únicos por página).

### Rodada 26.4 — Monitoramento local de erros
- Tabela `public.frontend_errors` (route, message, stack, ua, session_id, created_at) com RLS: insert-only para `anon`, select apenas `service_role`.
- Edge function `log-frontend-error` (rate-limit por IP, sanitização, sem PII).
- `src/lib/errorLogger.ts`: hooks em `window.onerror`, `unhandledrejection`, `React.ErrorBoundary` global; debounce e amostragem.
- Handoff pós-triagem: link `wa.me` gerado apenas no passo final do funil (documentar exceção em memória).

### Rodada 26.5 — Galerias por serviço (TV Smart, troca de tela, Wi-Fi)
Componente `ServiceGallery` com WebP + `<figcaption>` + alt descritivo. Assets via `lovable-assets` (CDN). Sem imagens fabricadas de "antes/depois" — apenas fotos genéricas do escopo.

---

## Detalhes técnicos da 26.1 (a única a executar agora)

- Arquivos novos:
  - `src/pages/TrocaDeTelaTVCuritiba.tsx`
  - Rota em `src/App.tsx` (ou router central)
  - Entrada em `src/data/services.ts` (slug, ticket, mode='coleta', pré-classificação)
  - `e2e/smoke-boot.spec.ts`
- Sem migrations, sem novas dependências.
- Verificação de produção: `curl -sI` + `curl -s | grep` — sem tocar em `index.html` a menos que o fetch mostre root vazio (a mensagem menciona "correção do index.html", mas não há alteração pendente registrada; se o fetch estiver OK, apenas confirmo).

Ao aprovar, executo 26.1 fim-a-fim e volto com resultados antes de iniciar 26.2.