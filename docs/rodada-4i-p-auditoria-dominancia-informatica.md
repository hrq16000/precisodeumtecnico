# Rodada 4I-P — Auditoria de Dominância SEO em Informática

**Modo:** somente leitura. Zero alteração de código, copy, SEO, rotas, redirects, schema, sitemap ou canonical.
**Data:** 2026-08-08 · **Baseline git:** `git status --short` e `git diff --stat` vazios no início e no fim.

---

## 1. Resumo executivo

A arquitetura de informática é **rica em conteúdo e correta em canonical**, mas apresenta **uma falha estrutural comprovada**: as páginas `/servicos/:slug` com conteúdo curado (informática, notebooks, redes, recuperação de dados etc.) **renderizam normalmente, são indexáveis e recebem forte linkagem interna, porém não constam em nenhum shard do sitemap**. Apenas 4 dos 16 slugs entram no `sitemap-servicos.xml`.

Fora isso, há **1 dívida de intenção** já conhecida: `/assistencia-tecnica-curitiba` tem `<title>` e `description` sobre **consoles (PS5/Xbox/Switch)**, enquanto a URL sinaliza a intenção mais valiosa do projeto ("assistência técnica Curitiba").

Não há canibalização comprovada por dados: o GSC ainda não mostra múltiplas URLs de informática disputando o mesmo cluster — o tráfego está concentrado em `/regioes/*`.

---

## 2. Metodologia

- Inventário por `src/App.tsx`, `src/data/services.ts`, `src/data/keywordServices.ts`, `src/data/enterpriseLandings.ts`, `src/data/enterpriseGuides.ts`.
- Contagem de links internos por `rg` sobre `src/`.
- Cobertura de indexação por `public/sitemap-*.xml`.
- Dados reais do Google Search Console (propriedade `sc-domain:precisodeumtecnico.com`, 2026-07-08 → 2026-08-04).
- Gates executados: `check:canonical` (OK, 145 URLs), `check:claims` (OK), `check:thin` (OK, 16 páginas de serviço acima do mínimo).
- Gates pedidos que **não existem** no `package.json`: `check:seo`, `check:trust-claims`, `check:analytics-parity`. Registrado, não criado.
- `check:meta` exige o preview em `127.0.0.1:4173` (não estava no ar) — não executado.
- Propriedade pedida no briefing (`sc-domain:tecnico.curitiba.br`) **não existe**; a propriedade real e verificada é `sc-domain:precisodeumtecnico.com`.

---

## 3. Inventário de informática (rotas reais)

| URL | Tipo | Fonte | Indexável | No sitemap |
| --- | --- | --- | --- | --- |
| `/servicos` | hub | `Servicos.tsx` | sim | sim |
| `/servicos/informatica` | serviço | `services.ts` | sim | **não** |
| `/servicos/notebooks` | serviço | `services.ts` | sim | **não** |
| `/servicos/redes` | serviço | `services.ts` | sim | **não** |
| `/servicos/recuperacao-dados` | serviço | `services.ts` | sim | **não** |
| `/servicos/servidores`, `/servicos/macbook`, `/servicos/impressoras`, `/servicos/games` | serviço | `services.ts` | sim | **não** |
| `/servicos/pc-gamer` | serviço | curado | sim | sim |
| `/servicos/formatacao-computadores` | serviço | curado | sim | sim |
| `/formatacao-de-computador-curitiba` | keyword LP | `keywordServices.ts` | sim | sim |
| `/remocao-de-virus-curitiba` | keyword LP | idem | sim | sim |
| `/upgrade-ssd-curitiba` | keyword LP | idem | sim | sim |
| `/upgrade-memoria-ram-curitiba` | keyword LP | idem | sim | sim |
| `/conserto-de-notebook-curitiba` | keyword LP | idem | sim | sim |
| `/suporte-tecnico-remoto` | keyword LP | idem | sim | sim |
| `/assistencia-tecnica-empresas-curitiba` | keyword LP B2B | idem | sim | sim |
| `/empresa-de-ti-curitiba` | B2B | `enterpriseLandings.ts` | sim | sim |
| `/servicos/suporte-tecnico-empresarial` | B2B | idem | sim | sim |
| `/servicos/backup-para-empresas` | B2B | idem | sim | sim |
| `/servicos/redes-e-wifi` | B2B | idem | sim | sim |
| `/servicos/manutencao-preventiva-empresas` | B2B | idem | sim | sim |
| `/seguranca-dos-dados` | B2B | idem | sim | sim |
| `/guias/organizacao-de-ti-para-pequenos-escritorios` | guia | `enterpriseGuides.ts` | sim | sim |
| `/guias/como-escolher-uma-workstation` | guia | idem | sim | sim |
| `/assistencia-tecnica-curitiba` | LP ampla | página própria | sim | sim |
| `/assistencia-tecnica` | LP ampla | página própria | sim | sim |
| `/blog/*` informática/redes (satélites e guias) | editorial | `blog.ts`, `satellitePosts.ts` | sim | sim |

---

## 4. Intenções por URL (primária)

| URL | Intenção primária | Secundárias |
| --- | --- | --- |
| `/assistencia-tecnica-curitiba` | LOCAL + TRANSACTIONAL | multi-equipamento |
| `/servicos/informatica` | TRANSACTIONAL (categoria) | LOCAL |
| `/servicos/notebooks` | TRANSACTIONAL (equipamento) | PROBLEM |
| `/conserto-de-notebook-curitiba` | TRANSACTIONAL + LOCAL | BRAND/EQUIPMENT |
| `/formatacao-de-computador-curitiba` | TRANSACTIONAL + LOCAL | INFORMATIONAL |
| `/remocao-de-virus-curitiba` | PROBLEM + LOCAL | — |
| `/upgrade-ssd-curitiba`, `/upgrade-memoria-ram-curitiba` | TRANSACTIONAL (peça) | PROBLEM (lentidão) |
| `/suporte-tecnico-remoto` | TRANSACTIONAL (modalidade) | B2B |
| `/assistencia-tecnica-empresas-curitiba`, `/empresa-de-ti-curitiba` | B2B + LOCAL | — |
| guias e blog | INFORMATIONAL | apoio às money pages |

---

## 5. Mapa query → URL

| Cluster | URL mais adequada | Outra competindo? |
| --- | --- | --- |
| técnico/assistência técnica informática Curitiba | `/servicos/informatica` | `/assistencia-tecnica-curitiba`, `/assistencia-tecnica` (sobreposição leve) |
| manutenção/conserto computador Curitiba | `/servicos/informatica` | `/formatacao-de-computador-curitiba` (parcial) |
| conserto/manutenção notebook Curitiba | `/conserto-de-notebook-curitiba` | `/servicos/notebooks` (sobreposição leve) |
| formatação notebook/computador | `/formatacao-de-computador-curitiba` | `/servicos/formatacao-computadores` (sobreposição leve) |
| upgrade SSD / memória | `/upgrade-ssd-curitiba` · `/upgrade-memoria-ram-curitiba` | não |
| computador/notebook lento | `/upgrade-ssd-curitiba` + blog | blog satélite (informacional) |
| não liga | `/conserto-de-notebook-curitiba` / `/servicos/informatica` | sem landing dedicada (correto) |
| remoção de vírus | `/remocao-de-virus-curitiba` | blog protocolo (informacional) |
| backup / recuperação de dados | `/servicos/backup-para-empresas` (B2B) · `/servicos/recuperacao-dados` (B2C) | não |
| suporte TI empresas / TI para empresas | `/assistencia-tecnica-empresas-curitiba` | `/empresa-de-ti-curitiba`, `/servicos/suporte-tecnico-empresarial` (**3 URLs, risco**) |
| rede/Wi-Fi empresa | `/servicos/redes-e-wifi` | `/servicos/redes`, `/servicos/configuracao-wifi-curitiba` |
| PC gamer manutenção | `/servicos/pc-gamer` | não |

---

## 6. GSC (28 dias: 2026-07-08 → 2026-08-04)

- Home indexada, canônica escolhida pelo Google = `https://precisodeumtecnico.com`, `page_fetch_state: SUCCESSFUL`.
- Totais: **79 cliques · 5.845 impressões · CTR 1,35% · posição média 7,35**.
- Top pages: dominadas por `/regioes/*` (Colombo, Rio Branco do Sul, Alto da Rua XV, Centro, Almirante Tamandaré, Pinhais, Boqueirão) e um post de CFTV.
- **Nenhuma URL de informática aparece no top-10 de páginas.**
- Top query: `assistencia tecnica` — 415 impressões, 2 cliques, posição 5,2.

Leitura: o cluster de informática ainda **não tem dado suficiente** no GSC. Isso não é P0.

---

## 7. Semrush

Não consultado nesta rodada — sem dado próprio de informática no GSC, uma estimativa de terceiro não mudaria nenhuma decisão desta auditoria. Fica registrado como pendência opcional da 4I-P.1.

---

## 8. Canibalização

| Caso | Classificação |
| --- | --- |
| `/servicos/informatica` × `/assistencia-tecnica-curitiba` × `/assistencia-tecnica` | SOBREPOSIÇÃO LEVE (title de `/assistencia-tecnica-curitiba` fala de consoles, o que hoje separa a intenção por acidente) |
| `/conserto-de-notebook-curitiba` × `/servicos/notebooks` | SOBREPOSIÇÃO LEVE |
| B2B: `/assistencia-tecnica-empresas-curitiba` × `/empresa-de-ti-curitiba` × `/servicos/suporte-tecnico-empresarial` | CANIBALIZAÇÃO PROVÁVEL (3 URLs, mesma promessa, sem hierarquia declarada) |
| Redes: `/servicos/redes` × `/servicos/redes-e-wifi` × `/servicos/configuracao-wifi-curitiba` | SOBREPOSIÇÃO LEVE (B2C × B2B × local) |

**Nenhum caso é canibalização comprovada por dados** — o GSC não mostra múltiplas URLs de informática recebendo impressões no mesmo cluster.

---

## 9. Home

A home usa componentes de cartão/CTA em vez de `<Link to>` literais, então a distribuição é indireta: os serviços saem de blocos de catálogo e do bloco de links relacionados (`RelatedLinksSection`). Registro: nenhuma âncora exact-match para informática na home.

## 10. Hub `/servicos`

Distribui para o catálogo completo e traz dois links diretos para B2B (`/assistencia-tecnica-empresas-curitiba`, `/suporte-tecnico-remoto`). Âncoras descritivas, sem excesso de links. **Não há página órfã de serviço** — o problema é de sitemap, não de linkagem.

## 11. Profundidade de clique

| Landing | Cliques desde a home |
| --- | --- |
| `/servicos/informatica`, `/servicos/notebooks`, `/servicos/redes` | 2 |
| keyword LPs (`/upgrade-ssd-curitiba` etc.) | 2 |
| B2B (`/assistencia-tecnica-empresas-curitiba`) | 2 |
| `/servicos/recuperacao-dados` | 2–3 (apenas 2 links internos) |

Nenhuma landing comercial prioritária a 3+ cliques de forma crítica.

## 12. Órfãs

Nenhuma órfã real. A mais fraca é `/servicos/recuperacao-dados` (2 links internos).

## 13. Link equity interno (contagem de referências em `src/`)

`/precos` 27 · `/servicos` 24 · `/servicos/informatica` 14 · `/servicos/redes` 12 · `/upgrade-ssd-curitiba` 11 · `/assistencia-tecnica-curitiba` 11 · `/suporte-tecnico-remoto` 9 · `/servicos/suporte-tecnico-empresarial` 9 · `/servicos/pc-gamer` 9 · `/seguranca-dos-dados` 9 · `/formatacao-de-computador-curitiba` 9 · `/areas-atendidas` 9 · `/upgrade-memoria-ram-curitiba` 7 · `/servicos/notebooks` 7 · `/assistencia-tecnica-empresas-curitiba` 7 · `/remocao-de-virus-curitiba` 6 · `/empresa-de-ti-curitiba` 5 · `/conserto-de-notebook-curitiba` 5 · `/servicos/backup-para-empresas` 4 · `/servicos/redes-e-wifi` 3 · `/assistencia-tecnica` 3 · `/servicos/recuperacao-dados` 2.

Resposta: **a distribuição interna é proporcional ao valor estratégico** — exceto por `/conserto-de-notebook-curitiba` (5) e `/servicos/recuperacao-dados` (2), abaixo do que a intenção comercial justifica.

## 14. Âncoras

Predominantemente **DESCRITIVAS**. Ocorrências de âncora genérica são pontuais (Termos, Sobre, Região/Bairro) e em contexto legal/institucional. Nenhum caso de âncora excessivamente otimizada.

## 15. Breadcrumbs

Hierarquia coerente e `BreadcrumbList` presente nas páginas de serviço e keyword LPs. Sem breadcrumb artificial detectado.

## 16. Canonical

`check:canonical`: **145 URLs verificadas, 0 divergências**, canonical idêntico ao `<loc>`. Nada a corrigir.

## 17. Titles

Sem duplicação entre keyword LPs (cada uma carrega serviço + cidade + faixa de preço). **Achado:** `/assistencia-tecnica-curitiba` usa title de consoles — desalinhado com a URL e com a query de maior impressão do site.

## 18. H1

| URL | H1 |
| --- | --- |
| `/formatacao-de-computador-curitiba` | Formatação de computador em Curitiba com backup e garantia |
| `/remocao-de-virus-curitiba` | Remoção de vírus em Curitiba sem perder seus arquivos |
| `/upgrade-ssd-curitiba` | Upgrade de SSD em Curitiba: o computador rápido de novo |
| `/upgrade-memoria-ram-curitiba` | Upgrade de memória RAM em Curitiba para acabar com o travamento |
| `/conserto-de-notebook-curitiba` | Conserto de notebook em Curitiba com diagnóstico antes do orçamento |
| `/suporte-tecnico-remoto` | Suporte técnico remoto com atendimento no mesmo dia |
| `/assistencia-tecnica-empresas-curitiba` | Suporte de TI para empresas em Curitiba com SLA definido |
| `/servicos/informatica` | Assistência Técnica em Informática |

Nenhum H1 semanticamente indistinguível. O único genérico é o de `/servicos/informatica` (sem cidade) — dívida P2, não erro.

## 19. Meta descriptions

`/servicos/informatica` e as keyword LPs têm description única e factual. Dívida registrada: **`AssistenciaTecnicaCuritiba.tsx:335`** — description sobre consoles em uma URL de intenção ampla. Classificada como dívida separada (P1), não corrigida nesta rodada.

## 20. Local intent

Presença factual e natural de Curitiba nas LPs comerciais; São José dos Pinhais concentrado nos satélites de blog e nas rotas de cidade. Sem stuffing.

## 21. Cidades

`/regioes/:city` é hoje **a frente com melhor desempenho real** (todos os top-pages do GSC). Conteúdo distinto, links internos e impressões confirmadas. Não mexer.

## 22. Bairros

`/regioes/:city/:neighborhood` — **ÚTIL** para Curitiba (Centro, Alto da Rua XV, Boqueirão com cliques reais). Demais bairros: SEM DADOS ainda. Política antidoorway preservada.

## 23. Residencial × B2B

A intenção empresarial **tem URL clara demais — três delas**. `/assistencia-tecnica-empresas-curitiba` (LP comercial), `/empresa-de-ti-curitiba` e `/servicos/suporte-tecnico-empresarial` cobrem a mesma promessa. Falta hierarquia declarada (qual é a canônica comercial e quais são apoio).

## 24. Notebook × computador

**SIM, devem permanecer independentes.** Sintomas, ticket e peças diferem, e as duas LPs têm H1/conteúdo distintos. Não fundir.

## 25. Sintomas

Cobertura por blocos dentro das LPs e por satélites de blog (`notebook lento`, `remover vírus sem formatar`). **Sem micro-landings por sintoma** — correto. Nenhum thin content (`check:thin` OK).

## 26. Serviços específicos

| Serviço | Cobertura |
| --- | --- |
| SSD | LANDING PRÓPRIA |
| RAM | LANDING PRÓPRIA |
| Formatação | LANDING PRÓPRIA + serviço curado |
| Vírus | LANDING PRÓPRIA + artigo |
| Backup | LANDING PRÓPRIA (B2B) |
| Recuperação de dados | BLOCO/serviço (`/servicos/recuperacao-dados`), pouco linkado |
| Redes/Wi-Fi | LANDING PRÓPRIA (B2B + local) |

## 27. Conteúdo editorial

Satélites por bairro (`/blog/informatica-em-*`, `/blog/redes-em-*`) e guias (`tecnico-de-informatica-curitiba-guia-definitivo`, `notebook-lento-*`, `remocao-de-virus-*`). Apontam para as money pages correspondentes; nenhum artigo transformado em página de vendas.

## 28. Clusters (arquitetura atual real)

```text
HOME
└── /servicos (hub)
    ├── COMPUTADOR   → /servicos/informatica · /formatacao-de-computador-curitiba
    │                  /remocao-de-virus-curitiba · /upgrade-ssd-curitiba
    │                  /upgrade-memoria-ram-curitiba
    ├── NOTEBOOK     → /servicos/notebooks · /conserto-de-notebook-curitiba
    ├── REDES        → /servicos/redes · /servicos/redes-e-wifi
    │                  /servicos/configuracao-wifi-curitiba
    ├── DADOS        → /servicos/recuperacao-dados · /servicos/backup-para-empresas
    ├── EMPRESAS     → /assistencia-tecnica-empresas-curitiba · /empresa-de-ti-curitiba
    │                  /servicos/suporte-tecnico-empresarial · /seguranca-dos-dados
    │                  /servicos/manutencao-preventiva-empresas
    ├── MODALIDADE   → /suporte-tecnico-remoto
    ├── LOCAL        → /regioes/* · /areas-atendidas
    └── CONTEÚDO     → /blog/* · /guias/*
```

## 29. Gap real

| Possível gap | Classificação |
| --- | --- |
| "assistência técnica de informática em Curitiba" com URL forte e title alinhado | **GAP REAL** (a URL existe; o title não sustenta a intenção) |
| Recuperação de dados B2C | GAP REAL LEVE (pouca autoridade interna) |
| Landing por sintoma ("não liga", "tela azul") | VOLUME/INTENÇÃO INSUFICIENTE |
| Novos bairros / novas cidades | DEPENDE DE DADOS |
| Cluster B2B | JÁ COBERTO (excesso, não falta) |

## 30. Keyword gap

Não executado — sem base própria no GSC para o cluster, um gap de terceiro não seria acionável nesta rodada. Registrado como opcional.

## 31. SERP features

`assistencia tecnica` (415 impressões, posição 5,2, CTR 0,48%) é uma query com forte captura por **Map Pack**. Isso reforça a 4I-M (autoridade local externa/GBP) como caminho de clique, e não uma reescrita de title por CTR.

## 32. Score de arquitetura SEO — **77/100**

| Dimensão | Nota | Justificativa |
| --- | --- | --- |
| Intenção por URL | 15/20 | Uma URL estratégica com title de outra intenção; B2B com três URLs sem hierarquia |
| Canibalização | 12/15 | Sobreposições leves, nenhuma comprovada por dados |
| Interlinking | 17/20 | Distribuição proporcional; recuperação de dados e conserto de notebook subatendidos |
| Profundidade de clique | 9/10 | Tudo a 2 cliques |
| Local relevance | 8/10 | Curitiba forte; RMC concentrada em `/regioes` |
| Query-page alignment | 8/15 | Sem dado GSC no cluster + title desalinhado na URL âncora |
| Cobertura comercial | 8/10 | Cobertura ampla; recuperação de dados fraca |

## 33. Top 5 achados

1. **Páginas de serviço indexáveis fora do sitemap** — `/servicos/informatica`, `/servicos/notebooks`, `/servicos/redes`, `/servicos/recuperacao-dados` (e demais slugs de `services.ts`) renderizam conteúdo curado, passam no `check:thin` e recebem até 14 links internos, mas **nenhum shard do sitemap os contém**. O `build-sitemap.ts` só publica `CURATED_SERVICE_SLUGS` (4 slugs), com base num comentário desatualizado que afirma que os demais respondem NotFound — `ServicoDetalhe.tsx:224` mostra que qualquer slug de `services.ts` renderiza. **P0.**
2. **`/assistencia-tecnica-curitiba` com title/description de consoles** (`AssistenciaTecnicaCuritiba.tsx:335`) na URL que deveria ancorar "assistência técnica em Curitiba" — a query de maior impressão do site (415). **P1.**
3. **Três URLs B2B com a mesma promessa**, sem hierarquia declarada. Risco de diluição. **P1.**
4. **`/servicos/recuperacao-dados` com 2 links internos** — menor autoridade interna do cluster para um serviço de ticket alto. **P2.**
5. **Cluster de informática sem sinal no GSC** enquanto `/regioes/*` captura 100% do top-10 — não é defeito, é maturidade. **Não é P0.**

## 34. P0

- Achado 1 (serviços curados ausentes do sitemap).

## 35. P1

- Achado 2 (title/description desalinhados em `/assistencia-tecnica-curitiba`).
- Achado 3 (hierarquia B2B).

## 36. P2

- Achado 4 (reforço de links para `/servicos/recuperacao-dados`).
- H1 sem cidade em `/servicos/informatica`.

## 37. O que NÃO fazer

- Não criar landing por sintoma ("não liga", "tela azul") sem demanda comprovada.
- Não fundir notebook × computador.
- Não criar novos bairros ou cidades.
- Não alterar title por CTR com n baixo (a query líder está em disputa de Map Pack, não de title).
- Não podar página apenas porque o GSC ainda não tem dado.
- Não mexer em `/servicos/conserto-tv`, `/servicos/conserto-placa`, `/servicos/conserto-monitor`.
- Não criar gates novos (`check:seo`, `check:trust-claims`, `check:analytics-parity` não existem).

## 38. Git final

`git status --short` → vazio. `git diff --stat`, `git diff -- src/`, `git diff -- scripts/` → **zero alterações**. Único arquivo produzido: este relatório em `docs/`.

---

## Perguntas obrigatórias

1. **URL principal para "assistência técnica em informática em Curitiba":** `/servicos/informatica` — é a mais linkada do cluster (14) e a de conteúdo mais completo. `/assistencia-tecnica-curitiba` deveria ser a âncora local ampla e hoje não sustenta essa intenção.
2. **Existe canibalização real?** Não comprovada por dados. Provável apenas no cluster B2B (3 URLs).
3. **Página com autoridade interna abaixo do que merece:** `/servicos/recuperacao-dados` (2 links) e, em segundo lugar, `/conserto-de-notebook-curitiba` (5).
4. **Maior gap comercial real:** a ancoragem local ampla de informática — a URL existe, mas os metadados apontam para consoles.
5. **Páginas demais, de menos ou o número certo?** Número certo. O problema é de **indexação e hierarquia**, não de quantidade.

## Decisão final

```text
ARQUITETURA SEO DE INFORMÁTICA TEM OPORTUNIDADES CIRÚRGICAS
```

## Próximo passo

Abrir **4I-P.1** com diff mínimo e gates completos, limitado a: (1) incluir no sitemap os slugs de serviço que efetivamente renderizam, (2) alinhar title/description de `/assistencia-tecnica-curitiba`, (3) declarar a hierarquia B2B. Nada disso foi executado nesta rodada. A 4I-M segue como prioridade externa.
