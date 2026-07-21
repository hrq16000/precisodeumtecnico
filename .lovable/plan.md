# Rodada 27.3/27.4 — Plano de Execução

Escopo grande; proponho fatiar em 4 sub-rodadas sequenciais para manter cada entrega auditável e evitar regressão dos guardrails (Rodada 23 sem reviews fabricados, Rodada 26 triagem como porta única, política de bairros com textos exclusivos).

## Sub-rodada 27.3 — Replicação regional (SJP, Pinhais, Colombo)
- Criar dataset `src/data/cidadesRegiao.ts` com metadados exclusivos por cidade (perfil demográfico, logística, bairros âncora, prazo de deslocamento).
- Criar componente unificado `src/pages/ServicoCidadeRegiao.tsx` que consome cidade + serviço (reparo-smart-tv, troca-de-tela-tv, configuracao-wifi) e gera:
  - SEO local (title, description, canonical)
  - JSON-LD `Service` (com `areaServed` = cidade) + `BreadcrumbList` + `FAQPage` (herdando catálogo de sintomas correspondente).
  - CTA principal = triagem pré-classificada com `category` + `symptomSlug` corretos (TV → `tv-tela-quebrada`/`tv-smart-travando-apps`; Wi-Fi → `wifi-lento-instavel`).
- Registrar 9 rotas em `App.tsx`: `/servicos/<serviço>/<cidade>` para SJP, Pinhais, Colombo.
- Atualizar `scripts/build-sitemap.ts` e links internos das páginas-mãe Curitiba (bloco "Atendemos também na região").
- E2E: estender `e2e/triage-preclassification.spec.ts` para varrer as 9 páginas garantindo `data-triage-*` corretos.

## Sub-rodada 27.4 — Bairros restantes de Curitiba
- Estender `src/data/bairrosCuritibaServico.ts` com os bairros restantes de segunda camada (~15 adicionais: Cristo Rei, Juvevê, Alto da Glória, Alto da XV, Mercês, Bacacheri, Hugo Lange, Jardim Social, São Francisco, Vila Izabel, Seminário, Santa Felicidade, Cajuru, Novo Mundo, Xaxim). Textos exclusivos por bairro (características do bairro + desafios técnicos locais).
- Reaproveitar `ServicoBairroCuritiba.tsx` (já unificado) — apenas registrar as 30 novas rotas (15 bairros × 2 serviços).
- Adicionar em `ServicoBairroCuritiba.tsx` bloco "Bairros vizinhos" (agrupamento por região: central, sul, norte, leste, oeste) + link para páginas-mãe do serviço.
- Atualizar sitemap.

## Sub-rodada 27.5 — Contratos automatizados e JSON-LD
- Novo `e2e/bairro-pages.spec.ts` iterando os 10 bairros principais em ambos serviços, validando:
  - HTTP 200 e H1 correto
  - Presença do bloco FAQ/triagem (accordion + botão `data-triage-open`)
  - JSON-LD válido: `Service.areaServed.name === bairro`, `BreadcrumbList` com 4 níveis, `FAQPage.mainEntity` com IDs presentes no catálogo de sintomas.
- Helper `e2e/utils/jsonld.ts` para parse/asserção reutilizável.
- Reforço no `ServicoBairroCuritiba.tsx` para garantir `symptomSlug`, `neighborhood` e Q&A alinhados com `symptoms.ts`.

## Sub-rodada 27.6 — Performance de imagens
- Reprocessar `public/gallery/*.webp` com `sharp` (qualidade 70, dimensões max 1280×720 e variante 640×360 para mobile) via `scripts/optimize-gallery.ts` executado sob demanda; commitar binários otimizados.
- Ajustar `ServiceGallery.tsx`:
  - `loading="lazy"` + `decoding="async"` (já ok) + `sizes` explícito e `srcset` com variante mobile.
  - `content-visibility: auto` no container para adiar layout offscreen.
- Rodar Lighthouse CI local (`bunx @lhci/cli autorun` ou script equivalente já existente) na Home + página de serviço + página de bairro; anexar delta no relatório final.

## Detalhes técnicos
- Nenhum WhatsApp direto: CTA continua abrindo triagem (`window.dispatchEvent(new CustomEvent('triage:open', { detail: { category, symptomSlug, cityHint, neighborhoodHint } }))`).
- Sem reviews fabricados / sem AggregateRating.
- Todas as strings de bairro/cidade centralizadas em dataset — nenhum literal em componente.
- Cada PR de sub-rodada roda: typecheck + suíte E2E impactada + build (com guards de OG manifest e sitemap).

## Ordem e checkpoints
1. 27.3 → smoke + review preview
2. 27.4 → sitemap + smoke
3. 27.5 → E2E + JSON-LD gate
4. 27.6 → Lighthouse report

Confirma essa fatiação e a ordem, ou prefere que eu comece direto por outra sub-rodada?
