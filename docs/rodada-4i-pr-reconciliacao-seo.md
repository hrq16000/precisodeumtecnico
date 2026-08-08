# Rodada 4I-P.R — Reconciliação canônica da auditoria SEO

**MODO: SOMENTE LEITURA — ZERO ALTERAÇÃO DE PRODUTO.**
Nenhum arquivo de `src/`, `scripts/`, `public/` ou banco foi tocado. Este documento é o único artefato criado.

---

## 1. Commit auditado

```text
COMMIT AUDITADO = 880e0f2bccd6c61cbef091e57325bbefb40308fb
BRANCH AUDITADA = edit/edt-2f24789c-456b-4fae-a73a-5b0f27e3804a
LOG             = 880e0f2b Auditoria SEO técnico concluída
DATA/HORA       = 2026-08-08 05:3x UTC (02:3x America/Sao_Paulo)
GIT STATUS      = limpo no início da rodada
```

Todas as conclusões abaixo valem **exclusivamente** para este estado.

---

## 2. Scripts disponíveis (fonte: `package.json`)

| Gate citado historicamente | Existe agora? | Resultado |
| -------------------------- | ------------- | --------- |
| `check:seo`                | NÃO           | — (nunca existiu; citado por engano em rodadas anteriores) |
| `check:title-meta`         | NÃO           | — (as "598 violações" vieram de um gate inexistente) |
| `check:canonical`          | SIM           | exit 0 — 145 URLs, 0 divergências |
| `check:thin`               | SIM           | exit 0 — 16 páginas de serviço acima do mínimo |
| `check:claims`             | SIM           | exit 0 — 10 arquivos verificados |
| `check:trust-claims`       | NÃO           | — |
| `check:analytics-parity`   | NÃO           | — |
| `check:internal-links`     | NÃO           | — (existe apenas o E2E `e2e/internal-links-no-404.spec.ts`) |
| `check:orphan-pages`       | NÃO           | — |
| `check:sitemap-source`     | NÃO           | — (equivalentes reais: `validate:sitemap`, `diff:sitemap`, `smoke:sitemap`) |
| `check:editorial-governance` | NÃO         | — |
| `check:meta`               | SIM           | não executado — exige preview em `:4173` |

Nenhum script foi criado.

---

## 3. Sitemap

`public/sitemap.xml` é um índice com 6 shards:

| Shard | `<loc>` |
| ----- | ------: |
| sitemap-main.xml | 116 |
| sitemap-servicos.xml | 20 |
| sitemap-cidades.xml | 351 |
| sitemap-bairros.xml | 391 |
| sitemap-nacional-servicos-piloto.xml | 100 |
| sitemap-images.xml | 842 |

`check:canonical`: canonical == `<loc>` em 145/145 URLs verificadas, 0 divergências.

**CLASSIFICAÇÃO: `SITEMAP CORRETO`.**

---

## 4. Services — verdade de runtime (Fase 3 + Fase 4)

Guarda real em `src/pages/ServicoDetalhe.tsx:224`:
`const hasCuratedEntry = !!(slug && servicesData[slug]); if (!hasCuratedEntry) return <NotFound />;`

Prova em runtime (DOM renderizado, dev server):

| Slug | Renderiza 200 útil | robots | canonical self | sitemap |
| ---- | ------------------ | ------ | -------------- | ------- |
| `/servicos/formatacao-computadores` | SIM (H1 "Formatação de Computadores") | index, follow | SIM | SIM |
| `/servicos/instalacao-cameras` | SIM | index, follow | SIM | SIM |
| `/servicos/instalacao-ar-condicionado` | SIM | index, follow | SIM | SIM |
| `/servicos/pc-gamer` | SIM | index, follow | SIM | SIM |
| `/servicos/informatica` | NÃO — NotFound | noindex, nofollow | SIM | NÃO |
| `/servicos/notebooks` | NÃO — NotFound | noindex, nofollow | SIM | NÃO |
| `/servicos/recuperacao-dados` | NÃO — NotFound | noindex, nofollow | SIM | NÃO |
| `/servicos/limpeza-computador` (e demais do hub) | NÃO — NotFound | noindex, nofollow | SIM | NÃO |

**Não existe página de serviço indexável ausente do sitemap.** O achado histórico "serviços indexáveis fora do sitemap" está **REFUTADO**: as rotas ausentes do sitemap são justamente as que respondem `NotFound` + `noindex,nofollow`.

O que **é** reproduzível agora: o hub `/servicos` publica **77 links `href="/servicos/:slug"`, dos quais 76 caem em `NotFound`** (só `instalacao-cameras` casa com o catálogo curado dessa lista). Isso é perda de link equity e experiência, não problema de sitemap.

---

## 5. Editorial fail-closed

`EDITORIAL_WAVE_SLUGS` **não existe** no repositório (0 ocorrências em `src/`). Os artigos citados historicamente (`como-fazer-manutencao-nobreak`, `notebook-nao-liga-o-que-fazer`, `como-montar-pc-gamer-2026`, `como-fazer-backup-completo-windows-11`) **não existem** em `src/data/blog.ts` nem nos sitemaps.

| Artigo | aprovado | sitemap | HTML inicial | DOM | GSC |
| ------ | -------- | ------- | ------------ | --- | --- |
| todos os 4 citados | inexistentes | ausente | — | — | sem dados |

**CLASSIFICAÇÃO: `NÃO REPRODUZIDO` — não há governança editorial quebrada porque o mecanismo citado não existe neste commit.**

Nota estrutural (não é P0 por si): o app é SPA Vite **sem prerender**. `title/description/robots/canonical` são emitidos por Helmet (`SEOHead`), portanto existem apenas **após execução de JS**. O HTML inicial de `index.html` não contém `meta robots` (fonte única deliberada no Helmet, comentada em `index.html:13`). Googlebot executa JS e lê corretamente; crawlers de preview social não. Isso vale para **todas** as rotas, inclusive as `noindex` de `NotFound`.

---

## 6. `/atendimento/*`

**Não existe** rota `/atendimento/:cidade/:bairro`. As únicas rotas com esse prefixo são:

```text
/atendimento-nacional
/atendimento-nacional/:slug
/atendimento-nacional/:city/:bairro
```

As ~300 "shells" `/atendimento/*` do relatório anterior **não existem neste commit**. Achado **NÃO REPRODUZIDO**.

---

## 7. Title/meta

`check:title-meta` não existe. O gate real é `check:meta` (`scripts/check-meta-uniqueness.ts`), que exige preview em `:4173` e não foi executado nesta rodada (rodada é read-only e não exige build).

Último artefato registrado no repositório, `meta-uniqueness-report.json`:

```json
{ "checked": 120, "dupTitles": [], "dupDescs": [], "failing": [] }
```

As **598 violações** citadas historicamente **não têm gate de origem**. Veredito: **NÃO REPRODUZIDO**.

---

## 8. GSC — janela canônica única

Propriedade: `sc-domain:precisodeumtecnico.com`. Janela **2026-07-08 → 2026-08-04** (28 dias completos; única janela usada em todo este documento).

Totais: **79 cliques · 5.845 impressões · CTR 1,35% · posição média 7,35**.
Home: `Submitted and indexed`, canonical escolhido pelo Google = `https://precisodeumtecnico.com`, último crawl 2026-08-05.

| Query | Cliques | Impressões | CTR | Posição |
| ----- | ------: | ---------: | --: | ------: |
| assistencia tecnica | 2 | 415 | 0,48% | 5,21 |
| assistencia tecnica pinhais | 1 | 9 | 11,1% | 10,67 |
| assistencia tecnica piraquara | 1 | 13 | 7,69% | 3,77 |
| assistência técnica celular 24 horas curitiba | 1 | 20 | 5,0% | 3,20 |
| assistência técnica tv 24 horas | 1 | 1 | 100% | 6,00 |
| eletricista fazenda rio grande | 1 | 8 | 12,5% | 6,13 |
| eletronica sitio cercado | 1 | 1 | 100% | 10,00 |
| manutenção de | 1 | 2 | 50% | 9,50 |

Top páginas (mesma janela): `/regioes/colombo` (5), `/regioes/rio-branco-do-sul` (5), `/regioes/curitiba/alto-da-rua-xv` (4), `/regioes/curitiba/centro` (4), `/` (3), `/regioes/almirante-tamandare` (3), `/regioes/curitiba` (3), `/regioes/pinhais` (3), `/blog/quanto-custa-instalar-cameras-cftv-curitiba` (2), `/regioes/curitiba/boqueirao` (2).

**Nenhuma URL de informática aparece no top-10.** O motor de tráfego atual é 100% geográfico (`/regioes/*`).

---

## 9. Cluster genérico de informática (Fase 10)

Queries alvo (`assistência técnica informática curitiba`, `assistência técnica notebook`, `técnico de computador`, `assistência pc`, `manutenção computador`, `técnico de informática curitiba`, `conserto notebook curitiba`): **nenhuma aparece nas linhas retornadas pelo GSC nesta janela**. A única query próxima é o genérico `assistencia tecnica` (415 impressões, 2 cliques, pos. 5,21).

Mapeamento query → URL: **DADOS INSUFICIENTES**.

---

## 10. Cidades satélite (Fase 11)

`/tecnico-informatica-curitiba`, `/tecnico-informatica-araucaria`, `/tecnico-informatica-colombo` e `/tecnico-informatica-sao-jose-pinhais` **não existem** neste repositório. A única ocorrência do padrão é o post `/blog/tecnico-informatica-pinhais-colombo-araucaria`.

**CLASSIFICAÇÃO: `NÃO COMPROVADO` (as URLs comparadas não existem).**

---

## 11. Página primária do cluster de informática (Fase 12)

| Critério | `/tecnico-informatica-curitiba` | `/servicos/informatica` | `/assistencia-tecnica-curitiba` |
| -------- | ------------------------------- | ----------------------- | ------------------------------- |
| existe | NÃO | rota existe, responde NotFound | SIM |
| intenção | — | — | assistência local (mas metadados de consoles) |
| title | — | "Página Não Encontrada" | "Assistência Técnica de Consoles em Curitiba \| PS5, Xbox e Switch" |
| H1 | — | "Página Não Encontrada" | "Assistência Técnica Especializada em Curitiba" |
| conteúdo | — | nenhum | consoles + placas + PCs/notebooks |
| links internos | 0 | 16 (todos para 404) | 11 |
| GSC | — | — | fora do top-10 |
| local intent | — | — | alto |

Candidatas reais e indexáveis do cluster informática hoje: `/formatacao-de-computador-curitiba` (9 links), `/conserto-de-notebook-curitiba` (5), `/assistencia-tecnica-curitiba` (11), `/servicos/formatacao-computadores`.

**DECISÃO — PÁGINA PRIMÁRIA:** `/assistencia-tecnica-curitiba` (maior link equity interno + intenção local mais ampla + já indexável).
Demais: `/formatacao-de-computador-curitiba` = SERVIÇO · `/conserto-de-notebook-curitiba` = SERVIÇO · `/servicos` = HUB · `/servicos/formatacao-computadores` = SERVIÇO · `/servicos/informatica` = REDUNDANTE (rota morta).

---

## 12. `/assistencia-tecnica-curitiba`

Estado atual verificado em runtime:

```text
title       = Assistência Técnica de Consoles em Curitiba | PS5, Xbox e Switch
description = Reparo de consoles em Curitiba: PlayStation, Xbox, Nintendo Switch, placas de vídeo, PCs e notebooks…
H1          = Assistência Técnica Especializada em Curitiba
canonical   = https://precisodeumtecnico.com/assistencia-tecnica-curitiba (self)
robots      = index, follow
```

> O title/description ainda são de consoles? **SIM.**

Há desalinhamento entre H1 (genérico/local) e title/description/keywords/schema (consoles). **P1 de intenção.** Não corrigido nesta rodada.

---

## 13. B2B (Fase 14)

URLs existentes: `/assistencia-tecnica-empresas-curitiba` (KeywordServicePage), `/empresa-de-ti-curitiba` (GuiaEmpresarial), `/servicos/suporte-tecnico-empresarial` (GuiaEmpresarial). `/suporte-empresas` **não existe**.

| URL | intenção | tipo | links internos | GSC |
| --- | -------- | ---- | -------------: | --- |
| `/assistencia-tecnica-empresas-curitiba` | transacional local B2B | landing keyword | 1+ (hub) | sem dados |
| `/empresa-de-ti-curitiba` | comercial/hub B2B | landing empresarial | 5 | sem dados |
| `/servicos/suporte-tecnico-empresarial` | serviço B2B | página de serviço | — | sem dados |

Todas no `sitemap-servicos.xml`, canonicals self, sem duplicação de metadados detectada por `check:canonical`.

**RESULTADO: `SOBREPOSIÇÃO LEVE`** (intenções vizinhas, sem evidência de dano). Não é canibalização — não há dados de GSC para esse cluster.

---

## 14. Link equity (metodologia única)

Contagem única: ocorrências literais da string `"<url>"` em `src/` (`rg -o`), mesma metodologia para todas as linhas.

| URL | Existe | Links internos |
| --- | ------ | -------------: |
| `/precos` | SIM | 29 |
| `/servicos` | SIM | 24 |
| `/servicos/informatica` | rota 404 | **16 (desperdiçados)** |
| `/servicos/notebooks` | rota 404 | **7 (desperdiçados)** |
| `/servicos/recuperacao-dados` | rota 404 | **2 (desperdiçados)** |
| `/assistencia-tecnica-curitiba` | SIM | 11 |
| `/formatacao-de-computador-curitiba` | SIM | 9 |
| `/conserto-de-notebook-curitiba` | SIM | 5 |
| `/empresa-de-ti-curitiba` | SIM | 5 |
| `/precos-e-politicas` | NÃO existe | — |
| `/servicos/manutencao-de-notebook` | NÃO existe | — |
| `/servicos/manutencao-de-computador` | NÃO existe | — |
| `/manutencao-notebook-pc-curitiba` | NÃO existe | — |

---

## 15. Home

`src/pages/Index.tsx` não contém nenhum `href="/…"` nem `to="/…"` literal — todos os links da home vêm de componentes (`RelatedLinksSection`, cards de serviço, footer) e de dados. Não foi possível, sem alteração de código, provar links contextuais **estáveis e literais** para money pages de informática direto no arquivo da home.

**Veredito: `SEM DADOS CONCLUSIVOS` no nível do arquivo; o equity de informática hoje chega majoritariamente via hub `/servicos` e footer.**

---

## 16. Hub `/servicos`

77 links `href="/servicos/:slug"` únicos. Apenas os slugs curados renderizam. Links permanentes por tema de informática:

| Tema | Link do hub | Destino real |
| ---- | ----------- | ------------ |
| notebook | `/servicos/conserto-notebook`, `/servicos/troca-tela-notebook`, `/servicos/notebook-nao-liga`… | 404 |
| computador | `/servicos/limpeza-computador`, `/servicos/upgrade-hardware` | 404 |
| SSD/RAM | `/servicos/troca-hd-ssd`, `/servicos/upgrade-memoria-ram` | 404 |
| formatação | `/servicos/formatacao-computadores` | **200** |
| vírus | `/servicos/remocao-virus` | 404 |
| dados | `/servicos/recuperacao-dados` | 404 |
| redes | `/servicos/rede-estruturada`, `/servicos/wifi-mesh`, `/servicos/instalacao-roteador` | 404 |

Existem landings equivalentes **vivas e indexáveis** (`/remocao-de-virus-curitiba`, `/upgrade-ssd-curitiba`, `/upgrade-memoria-ram-curitiba`, `/conserto-de-notebook-curitiba`, `/formatacao-de-computador-curitiba`) para as quais o hub **não** aponta.

---

## 17. Canibalização — três níveis separados

- **NÍVEL A — DUPLICAÇÃO TÉCNICA:** não reproduzida. `check:canonical` 145/145 OK; último `meta-uniqueness-report.json` com 0 duplicatas em 120 URLs.
- **NÍVEL B — SOBREPOSIÇÃO SEMÂNTICA:** existe, leve, no cluster B2B e entre `/assistencia-tecnica-curitiba` (title de consoles) e `/assistencia-tecnica`.
- **NÍVEL C — CANIBALIZAÇÃO COMPROVADA POR GSC:** **não existe**. Nenhuma query da janela mostra múltiplas URLs próprias disputando o mesmo cluster.

---

## 18. TV / Placas / Monitor

Congelados. Registro apenas: `/assistencia-tecnica-curitiba` mistura consoles/GPU no metadado (Fase 12), e `/servicos/troca-de-tela-tv-curitiba`, `/servicos/reparo-smart-tv-curitiba` seguem indexáveis e no sitemap. **NÃO PRIORIZAR · NÃO ALTERAR.**

## 19. Map Pack

GBP/Map Pack permanece frente externa prioritária — registrado como contexto. Nenhuma decisão orgânica deste documento se apoia nele.

---

## 20. Matriz de verdades conflitantes

| Achado histórico | Estado atual | Evidência | Veredito |
| ---------------- | ------------ | --------- | -------- |
| editorial noindex quebrado | mecanismo inexistente | 0 ocorrências de `EDITORIAL_WAVE_SLUGS`; artigos citados não existem | **NÃO REPRODUZIDO** |
| services indexáveis fora do sitemap | falso | runtime: slugs fora do sitemap dão `NotFound` + `noindex,nofollow` | **REFUTADO** |
| 598 violações `check:title-meta` | gate inexistente | `package.json` não tem `check:title-meta`; `meta-uniqueness-report.json` = 0 dups | **NÃO REPRODUZIDO** |
| ~300 `/atendimento/*` duplicados | rotas inexistentes | `src/App.tsx` só tem `/atendimento-nacional/*` | **NÃO REPRODUZIDO** |
| satélites canibalizam Curitiba | URLs inexistentes | nenhuma `/tecnico-informatica-*` no repositório | **NÃO COMPROVADO** |
| B2B canibaliza | sobreposição leve | 3 URLs vizinhas, canonicals self, sem dados de GSC | **SEM DADOS** |
| home sem money links | inconclusivo | `Index.tsx` sem links literais; links via componentes | **SEM DADOS** |
| `/assistencia-tecnica-curitiba` com metadados de consoles | reproduzido | title/description/keywords/schema de PS5/Xbox vs H1 genérico | **CONFIRMADO** |
| links internos quebrados no hub `/servicos` | reproduzido | 76 de 77 `href="/servicos/:slug"` caem em `NotFound` | **CONFIRMADO** |

---

## 21. P0 (reproduzidos AGORA)

**Nenhum P0.** Não há rota indexável que a política mande `noindex`, não há canonical incorreto (145/145 OK), não há rota estratégica indexável fora do sitemap, e nenhum gate existente está falhando (`check:canonical`, `check:thin`, `check:claims` = exit 0).

## 22. P1 (máx. 3 — todos reproduzidos)

1. **Hub `/servicos` com 76/77 links internos para `NotFound`** — link equity queimado (16 para `/servicos/informatica`, 7 para `/servicos/notebooks`) enquanto landings vivas equivalentes não recebem link do hub.
2. **`/assistencia-tecnica-curitiba` com title/description/keywords/schema de consoles e H1 genérico** — desalinhamento de intenção na URL de maior equity do cluster.
3. **Ausência de gate de links internos em CI** — o E2E `internal-links-no-404.spec.ts` existe mas não há script npm equivalente, então o item 1 passou despercebido entre rodadas.

## 23. P2 (máx. 5)

1. `check:meta` só roda com preview em `:4173` — não integrado a um comando único, o que gerou relatos de "598 violações" sem gate de origem.
2. SPA sem prerender: metadados só existem pós-JS (afeta previews sociais, não Googlebot).
3. Sobreposição leve no cluster B2B (3 URLs vizinhas sem hierarquia declarada).
4. Home sem links de money pages de informática literais/auditáveis no arquivo da página.
5. Cluster genérico de informática sem impressões relevantes na janela — falta cobertura de conteúdo/consulta.

---

## 24. Gates executados

| Comando | Exit | Saída |
| ------- | ---: | ----- |
| `npm run check:canonical` | 0 | 145 URLs, 0 divergências |
| `npm run check:thin` | 0 | 16 páginas de serviço acima do mínimo |
| `npm run check:claims` | 0 | 10 arquivos verificados |
| `npm run check:meta` | não executado | exige preview `:4173` |
| `npm run build` | não executado | desnecessário — prova feita em runtime |

## 25. Git final

```text
git status --short  → sem alterações em src/, scripts/, public/
git diff -- src/     → vazio
git diff -- scripts/ → vazio
Único arquivo novo: docs/rodada-4i-pr-reconciliacao-seo.md
```

---

# RESPOSTAS OBRIGATÓRIAS

**A — HÁ P0 ATUAL?** `NÃO`

**B — O SITEMAP ESTÁ CORRETO?** `SIM`

**C — O FAIL-CLOSED EDITORIAL ESTÁ CORRETO NO HTML INICIAL?** `NÃO SE APLICA` — o mecanismo citado não existe; e nenhum `robots` (index ou noindex) está no HTML inicial, pois o app é SPA sem prerender e usa Helmet como fonte única.

**D — AS ~300 ROTAS `/ATENDIMENTO/*` TÊM METADADOS DUPLICADOS?** `NÃO` — essas rotas não existem.

**E — EXISTE CANIBALIZAÇÃO COMPROVADA POR GSC?** `NÃO`

**F — URL PRIMÁRIA DO CLUSTER DE INFORMÁTICA =** `/assistencia-tecnica-curitiba`

**G — AJUSTE SEO DE MAIOR IMPACTO CONFIRMADO AGORA:** redirecionar os 76 links quebrados do hub `/servicos` para as landings vivas equivalentes (`/formatacao-de-computador-curitiba`, `/remocao-de-virus-curitiba`, `/upgrade-ssd-curitiba`, `/upgrade-memoria-ram-curitiba`, `/conserto-de-notebook-curitiba`, `/servicos/*` curados), recuperando ~25 links internos hoje perdidos em `NotFound`.

---

# DECISÃO

```text
ESTADO SEO RECONCILIADO — PRONTO PARA 4I-P.1
```

## Próximo passo sugerido (4I-P.1 — máximo 3 alterações)

1. Corrigir os destinos do hub `/servicos` (P1-1).
2. Realinhar title/description/keywords/schema de `/assistencia-tecnica-curitiba` (P1-2).
3. Adicionar script npm de gate de links internos reaproveitando o E2E existente (P1-3).

Nada disso foi implementado nesta rodada.
