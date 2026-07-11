# Rodada 25 — SEO agressivo controlado

Executa em 5 blocos independentes, cada um com guard e E2E próprios. Nada quebra as travas de 24.x: matriz nacional continua em 100 URLs, sitemap piloto intocado, preços/termos/GPS/RLS/WhatsApp/layout preservados.

## Bloco 1 — FAQ + FAQPage em todas as rotas de serviço

Adicionar `FAQSectionSEO` (novo componente) + `FAQPage` schema onde faltar, expandir onde existir mas estiver raso.

Cobertura:

- `ServicoDetalhe` (/servicos/:slug) — 6 perguntas por serviço, específicas do serviço.
- `ServicoCidade` (/servico-em/:cidade/:servico) — 6 perguntas com cidade no texto (long-tail local).
- `ServicoBairroNacional` (100 URLs piloto) — 5 perguntas com bairro+cidade+serviço.
- `BairroDetalhe` (CWB) e `BairroNacional` — 4 perguntas por bairro (novas).
- `AssistenciaTecnica*`, `CidadeNacional`, `RegiaoDetalhe` — auditar; completar lacunas se schema existir sem FAQ visível ou vice-versa.

Regras:
- Cada FAQ com CTA WhatsApp contextualizado (`data-wa-source`, `data-service`, `aria-label`).
- Texto único por rota (parametrizado por serviço/cidade/bairro — não string idêntica).
- Schema validado por `safeStringify` já existente em `SEOHead`.
- Guard novo: `scripts/check-faq-coverage.ts` — falha o build se página de serviço não tiver FAQPage.

## Bloco 2 — Malha de links internos + breadcrumbs ricos

- Componente `RelatedLinks` reutilizável: renderiza 4-8 âncoras cruzadas relevantes.
- `ServicoDetalhe`: links para top 5 cidades atendendo o serviço + top 3 serviços relacionados.
- `ServicoCidade`: links para outros serviços na mesma cidade + bairros vizinhos.
- `ServicoBairroNacional`: links para outros bairros da cidade + outros serviços do bairro.
- `BairroDetalhe`/`BairroNacional`: links para serviços no bairro + bairros vizinhos.
- Breadcrumbs visuais em todas as páginas acima (já emitem `BreadcrumbList` schema — expor UI).
- Nenhum link novo entra no sitemap (usa URLs já indexáveis).

## Bloco 3 — 12 bairros piloto com conteúdo único (CWB 8 + SJP 4)

Novo dado em `src/data/bairrosPilotoContent.ts` — 12 entradas com:
- H1 exclusivo, meta description exclusiva, 2 parágrafos de introdução manuais, 4 perguntas FAQ, ancoragem local (referência a ruas/pontos conhecidos), imagem local ou placeholder responsivo.

Bairros CWB (top 8 por demanda existente): Batel, Água Verde, Centro, Bigorrilho, Portão, Cabral, Boa Vista, Champagnat.
Bairros SJP (top 4): Centro, Afonso Pena, São Pedro, Cidade Jardim.

Rotas: já existem em `BairroDetalhe`. Trocamos fallback template pelo conteúdo curado quando o slug bater.

Sitemap regional (`sitemap-bairros-curitiba.xml`, `sitemap-bairros-sao-jose-dos-pinhais.xml`) já existe e cobre esses slugs — apenas atualiza `lastmod`. **Matriz nacional 100 URLs não muda.**

Guard novo: `scripts/check-bairros-piloto.ts` — garante que os 12 bairros têm conteúdo curado (não caem no fallback).

## Bloco 4 — Relatório de performance (Lighthouse + estático)

- Rodar `lighthouserc.mobile.cjs` contra `https://precisodeumtecnico.com` para as rotas do checklist.
- Auditoria estática: peso de bundle por chunk, LCP candidate por rota, verificar `<link rel="preload">` da imagem hero, revisar `manualChunks` (confirmado ausente), verificar `fetchpriority=high` na hero.
- Entregar tabela LCP/CLS/TTFB/Total Blocking Time/Peso por rota + 3-5 recomendações priorizadas (não implementar nesta rodada — só reportar).

## Bloco 5 — Validações + smoke

- `bunx tsgo --noEmit`
- `bun run build` (com todos os postbuild guards + `check-faq-coverage` + `check-bairros-piloto`)
- E2E: `seo-tag-counts`, `robots-meta-dedup`, `national-service-neighborhood`, `public-routes-smoke`, `structured-data`, `schema-integrity` + novo `e2e/faq-schema.spec.ts` validando 1 FAQPage por rota de serviço.
- rg sweep: sem duplicidade de FAQPage, sem `aggregateRating` global, sem debug, `twitter:card` único, robots único.
- Sitemap piloto = 100 URLs (invariante).
- Smoke prod após publicar.

## Contrato final

| Item | Antes | Depois |
|---|---|---|
| Rotas de serviço com FAQ visível+schema | ~parcial | 100% |
| FAQPage duplicado | 0 | 0 (guardado) |
| Bairros CWB curados | 0 | 8 |
| Bairros SJP curados | 0 | 4 |
| Links internos cruzados por página | ad-hoc | 4-8 sistemáticos |
| Breadcrumbs visuais | inconsistente | uniforme |
| Matriz nacional | 100 URLs | 100 URLs |
| `twitter:card`/`robots` únicos | ✅ | ✅ |
| Preços/termos/GPS/RLS/WhatsApp/layout | intactos | intactos |

## Fora de escopo

- Ampliar matriz nacional além de 100.
- Adicionar bairros além dos 12 piloto (SJP tem ~35, CWB ~75; expansão em rodada futura).
- Implementar otimizações de perf (só relatar — implementação em rodada dedicada).
- Refatorar `SEOHead` além do necessário para safeStringify das novas FAQs.
- Adicionar novas cidades ao sitemap nacional.

## Riscos

- FAQ agressivo em 100 URLs do piloto nacional → 100 novos FAQPage schemas. Se textos ficarem muito parecidos entre bairros da mesma cidade, Google pode detectar spam. Mitigação: parametrização real por bairro (nome, ancoragem geográfica, distância aproximada do centro).
- Bairros piloto (12) precisam de texto manual real (não IA-genérico) para não virarem doorway. Vou usar padrão consistente com dados regionais existentes em `src/data/sjpBairroContent.ts` (que já é referência de qualidade).

Aprova rodar em sequência (blocos 1→5) ou prefere que eu execute um bloco por vez?
