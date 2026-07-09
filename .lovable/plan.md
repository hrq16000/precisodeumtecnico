# Feature 2 — Cobertura nacional profunda com SEO otimizado

O escopo pedido (todas as capitais + bairros IBGE + serviço×cidade×bairro + mapa + trilhas + sitemap + smoke) gera milhares de rotas. Fazer tudo em uma rodada explode bundle, sitemap e CI. Proponho quebrar em **4 sub-rodadas** enviáveis em sequência, cada uma testável e reversível.

## Sub-rodada 22.1 — Dataset nacional + rotas de cidade nacional expandidas

**O que faço**

- Amplio `src/data/nationalCities.ts` de 30 → 27 capitais + top 3 cidades da região metropolitana de cada capital (100 cidades). Base: IBGE 2022, população ≥ 150k.
- Cada cidade ganha: nome, slug, UF, região, população, 3–5 bairros âncora (não IBGE completo — só os mais populosos/comerciais por capital, ~10 por cidade = ~270 bairros totais nesta fase).
- Cria `src/data/nationalBairros.ts` como fonte única, tipada.
- Reaproveita `CidadeNacional.tsx` (já existe) — só adiciono a variação de bairro via nova rota `/atendimento-nacional/:city/:bairro` reutilizando o layout de `BairroDetalhe`.

**Copy tone** (respeitando "premium, rede nacional, não preço baixo"):

- Headline padrão: "Assistência técnica premium em {Bairro}, {Cidade} — {UF}"
- Sub-headline: "Rede nacional de técnicos certificados. Do reparo emergencial ao projeto corporativo — sem improviso, sem desvalorização."
- CTA único: Triage funnel (mantém contrato `source=triage`).

**Não faço nesta rodada**: mapa, combinação serviço×cidade×bairro, sitemap expandido.

## Sub-rodada 22.2 — Rotas serviço × cidade × bairro

**O que faço**

- Nova rota `/servico-em/:city/:bairro/:service` reutilizando `ServicoCidade` com wrapper adicional para bairro.
- Geração é **lazy on demand** via matcher: React Router entrega a página se `city + bairro + service` existem no dataset; senão → NotFound com sugestões.
- **Não renderiza estaticamente** todas as combinações (seria bundle absurdo). O HTML é gerado no runtime; sitemap.xml lista as combinações mais buscadas (top serviços × top bairros por cidade, cap de 5.000 URLs no sitemap principal).
- H1 padrão: "{Serviço} em {Bairro}, {Cidade}"; JSON-LD Service + BreadcrumbList + LocalBusiness + FAQPage (reaproveita `buildOfferSchema` + `buildSymptomFAQ`).

## Sub-rodada 22.3 — Mapa visual + trilhas internas (Breadcrumbs + blocos)

**O que faço**

- Mapa: componente `<CoverageMap>` com Google Maps JS API via connector `google_maps` (já disponível, browser key referrer-restricted). Aparece em `/atendimento-nacional`, `/regioes/:city`, `/regioes/:city/:bairro` mostrando marcadores dos bairros/cidades atendidos. Lazy-loaded, não bloqueia CWV.
- Breadcrumbs em todas as páginas geográficas com JSON-LD `BreadcrumbList`.
- Bloco de trilha padronizado no fim de cada página geográfica:
  - "Cidades próximas" (mesma UF ou RMC)
  - "Bairros vizinhos" (mesma cidade)
  - "Outros serviços neste bairro"
- Zero mudança de hero/nav/footer.

## Sub-rodada 22.4 — Sitemap + smoke SEO + guards

**O que faço**

- Gera sitemap segmentado: `sitemap-nacional-cidades.xml`, `sitemap-nacional-bairros.xml`, `sitemap-servico-cidade-bairro.xml`. Todos indexados em `sitemap.xml`.
- Cada URL: canonical absoluto `https://precisodeumtecnico.com/...`, lastmod ISO, `changefreq=weekly`, `priority` decrescente por profundidade.
- Novo E2E `e2e/national-coverage-seo.spec.ts` valida em amostra estratificada (10 cidades × 3 bairros × 2 serviços = 60 rotas): H1 único, canonical self-referente, og:image=1, og:title=1, JSON-LD válido, sem `noindex`.
- Novo guard `scripts/check-sitemap-routes.ts` no postbuild: cada URL do sitemap resolve para uma rota React Router válida.
- Lighthouse mobile em 3 rotas âncora (cidade capital, bairro capital, serviço-cidade-bairro) com budget LCP<2.5s, CLS<0.1, TBT<200ms.

## Fora de escopo desta Feature 2

- Novas tabelas no backend, RLS, edge functions.
- SSR/pré-render de HTML (SPA continua).
- Alteração de preços, termos comerciais, GPS/Nominatim.
- Alteração de layout público (hero, nav, footer).
- Novas categorias de serviço.
- Blog de cidade.

## Detalhes técnicos

**Dependências novas**: nenhuma nova biblioteca — Google Maps via connector existente.

**Sitemap size**: ~30 cidades diretas + 100 nacionais + 270 bairros + top 5.000 serviço×cidade×bairro ≈ 5.400 URLs. Dentro do limite de 50k por sitemap; segmentação evita arquivo único gigante.

**Bundle risk**: mitigado — dataset em chunks separados via dynamic import por região, mapa lazy, páginas continuam lazy via React Router.

**Rollback**: cada sub-rodada é um commit isolado — reversível sem afetar as outras.

## O que peço agora

Aprove o plano ou peça ajuste. Se aprovar, começo pela **Sub-rodada 22.1** (dataset + rotas de cidade nacional expandidas) sem tocar em nada além de `src/data/` e uma nova rota. As outras 3 rodadas eu abro em mensagens separadas para permitir smoke incremental entre elas.       

&nbsp;

&nbsp;

Aprovo a direção, mas NÃO aprovo o plano completo como “Feature 2”.

Isso deve ser tratado como Rodada 22 — Expansão SEO Nacional Programática, separada da Feature 2 original do Admin.

Antes de mapa, sitemap massivo ou serviço×cidade×bairro, execute somente uma 22.1 bem controlada.

Rodada 22.1 — Dataset nacional controlado + rotas por cidade/bairro âncora

Objetivo:

Criar a base nacional inicial sem explodir bundle, sitemap, rotas ou CI.

Escopo permitido nesta rodada:

1. Dataset nacional tipado

Criar/ajustar:

- `src/data/nationalCities.ts`

- `src/data/nationalBairros.ts`

Regras:

- Incluir 27 capitais.

- Incluir no máximo 3 cidades metropolitanas por capital, quando houver segurança nos dados.

- Incluir bairros âncora curados, não chamar de “bairros IBGE”.

- Não inventar população, bairro, ranking ou dado estatístico sem fonte clara.

- Se a origem do dado não estiver comprovada no repo, deixar `population` opcional ou omitir.

- Cada item deve ter:

  - name;

  - slug;

  - uf;

  - state;

  - region;

  - type: capital | metro | anchor;

  - bairros: array curto;

  - enabled: boolean.

2. Rota bairro nacional

Adicionar rota controlada:

- `/atendimento-nacional/:city/:bairro`

Regras:

- Só renderizar se `city` e `bairro` existirem no dataset.

- Caso contrário, ir para NotFound ou página com sugestões reais.

- Reutilizar layout existente quando possível.

- Não criar rota serviço×cidade×bairro ainda.

- Não criar sitemap novo nesta rodada.

3. Copy/posicionamento

Usar tom premium, técnico e nacional.

Headline sugerida:

“Assistência técnica premium em {Bairro}, {Cidade} — {UF}”

Subheadline:

“Rede nacional de técnicos certificados. Do reparo emergencial ao atendimento corporativo — sem improviso e sem desvalorização da mão de obra.”

CTA:

- Triagem técnica;

- WhatsApp com contexto;

- `source=triage`;

- `service=assistencia-tecnica`;

- cidade/bairro quando disponíveis.

4. SEO básico da rota nova

Cada página nova deve ter:

- title específico;

- description específica;

- canonical self;

- og:title;

- og:description;

- og:url;

- BreadcrumbList;

- Service schema sem aggregateRating fabricado;

- sem reviewCount/ratingValue fake;

- H1 único.

Não mexer em sitemap ainda.

Não mexer em robots.

Não criar 5.000 URLs ainda.

5. Performance/bundle

- Não importar dataset gigante no bundle inicial da home.

- Se o dataset crescer muito, separar por região ou usar dynamic import.

- Não adicionar nova biblioteca.

- Não reintroduzir `manualChunks`.

- Não mexer no Vite chunking.

6. Fora de escopo nesta rodada

Não fazer:

- mapa visual;

- Google Maps;

- Leaflet;

- Mapbox;

- serviço×cidade×bairro;

- sitemap nacional expandido;

- submissão GSC/Bing;

- Lighthouse novo;

- blog de cidade;

- nova tabela;

- nova edge function;

- mudança em GPS/Nominatim;

- mudança em RLS;

- mudança em termos comerciais;

- mudança em preços;

- mudança no layout global.

7. Testes obrigatórios

Criar ou ampliar E2E:

- `e2e/national-coverage-basic.spec.ts`

Cobrir amostra:

- 3 capitais;

- 3 cidades metropolitanas;

- 3 bairros âncora.

Validar:

- rota HTTP/renderiza;

- H1 único;

- canonical único;

- og:title/description/url únicos;

- og:image = 1;

- BreadcrumbList presente;

- CTA de triagem/WhatsApp com `data-wa-source`, `data-service`, `aria-label`;

- texto WhatsApp contém cidade/bairro quando disponível;

- rota inválida cai em NotFound/sugestões;

- sem tela branca;

- sem pageerror.

8. Validações obrigatórias

Rodar:

- `bunx tsgo --noEmit`

- `bun run build`

- `E2E_BASE_URL=http://localhost:8080 bunx playwright test e2e/national-coverage-basic.spec.ts --workers=1`

Rodar regressão mínima:

- `E2E_BASE_URL=http://localhost:8080 bunx playwright test e2e/public-routes-smoke.spec.ts e2e/global-cta-wa.spec.ts e2e/commercial-terms.spec.ts --workers=1`

9. Smoke rg obrigatório

Rodar e reportar:

- `rg "manualChunks" vite.config.ts`

- `rg "aggregateRating|reviewCount|ratingValue" src`

- `rg "523|15000|15\\.000|4[\\.,]9/5|4[\\.,]9★|★★★★★" src index.html`

- `rg "payload de teste|Ver payload|__DEBUG__" src dist`

- `rg "Bancada R\\$ ?90|R\\$ 90|bancada.*90" src e2e`

- `rg "data-wa-source|data-service|data-city|data-neighborhood" src/pages src/components`

- `rg "buildWhatsAppUrl\\(\\)" src/`

10. Critérios de aceite

- Dataset tipado e sem dados inventados sensíveis.

- Rotas novas por cidade/bairro funcionando.

- Nenhuma explosão de sitemap.

- Nenhuma nova biblioteca.

- Nenhum mapa real ainda.

- Nenhum schema fake.

- Typecheck limpo.

- Build limpo com guards postbuild.

- E2E novo verde.

- Regressão mínima verde.

- Relatório final com:

  - arquivos alterados;

  - quantidade de cidades/bairros adicionados;

  - origem/critério dos dados;

  - exemplos de rotas criadas;

  - comandos rodados;

  - resultado typecheck/build/E2E;

  - evidências dos rg;

  - riscos reais restantes;

  - recomendação: publicar ou não.