# Rodada 25.1 — Correções bloqueantes + evidência + pilotos curados + plano de expansão

Executa em 5 blocos, um por vez, com gate no fim de cada. Nenhuma expansão de matriz antes do Bloco 5. Nada é publicado até o usuário autorizar bloco a bloco.

---

## Bloco A — Fonte única de `meta description` (bloqueante)

**Problema:** `index.html` emite `<meta name="description">` estática e o Helmet emite outra por rota. Google usa a estática, gerando duplicação sitewide (crítico apontado no Bloco 25.0).

**Ação:**

- Remover `<meta name="description">` de `index.html`.
- Estender `scripts/check-seo-dedup.ts` com regra dedicada (Rodada 25.1): description é fonte única no `SEOHead` (Helmet). `index.html` NÃO pode conter description; `SEOHead` deve conter ao menos uma.
- Adicionar contagem de `description` = 1 no `e2e/seo-tag-counts.spec.ts`.
- Rodar build + guard + E2E local seletivo do spec.

**Gate A:** build OK, `check-seo-dedup` passa nova regra, spec de contagem passa, `tsgo` limpo.

---

## Bloco B — GA4 via GTM + page_view SPA + eventos qualificados

**Problema:** só há tag do Google Ads. Sem GA4/GTM não há como medir a matriz.

**Ação:**

- Adicionar loader do GTM em `index.html` (`<head>` + `<noscript>` no `<body>`, respeitando a regra HTML5 já listada nas instruções). Container ID via `VITE_GTM_ID`.
- Se `VITE_GTM_ID` ausente, loader é no-op (sem quebrar preview).
- Emitir `page_view` em cada mudança de rota: novo hook `useRoutePageview()` montado no `App.tsx`, empurrando `{ event: "page_view", page_path, page_title, service?, city?, bairro? }` com base em `useParams`/pathname.
- Padronizar payload de `trackWhatsAppClick` e `trackEvent("triage_*")` para incluir `service`, `city`, `bairro` sempre que houver contexto — ampliar delegação global em `src/main.tsx` para preencher `data-service/city/neighborhood` já presentes.
- Documentar em `docs/analytics.md` os eventos e filtros disponíveis (para o usuário criar variáveis no GTM).
- Solicitar `VITE_GTM_ID` como secret via `add_secret` **apenas após confirmação do usuário** (é config, não segredo cripto; será exposto no bundle mesmo assim — vai como variável de build).

**Gate B:** build OK; `page_view` observável no `dataLayer` via Playwright em `/` e em `/servico-em-nacional/sao-paulo/pinheiros/informatica`; specs existentes de WhatsApp continuam passando.

---

## Bloco C — Google Search Console + submissão de sitemaps + evidência

**Ação:**

- Via conector `google_search_console` (usa curl no gateway — sem código no app):
  1. `GET /sites` para checar propriedades verificadas do usuário.
  2. Se `https://precisodeumtecnico.com/` não estiver verificada: obter token META (`/siteVerification/v1/token`), adicionar `<meta name="google-site-verification" ...>` em `index.html`, pedir publish, e após publish rodar `POST /siteVerification/v1/webResource` e `PUT /webmasters/v3/sites/...`.
  3. Submeter sitemaps: `PUT /webmasters/v3/sites/{site}/sitemaps/{feedpath}` para `sitemap.xml`, `sitemap-main.xml`, `sitemap-nacional-servicos-piloto.xml`.
  4. Capturar `urlInspection` de 3 URLs piloto (1 home, 1 cidade nacional, 1 bairro nacional) e salvar em `docs/gsc-baseline-YYYYMMDD.md` como baseline de indexação.

**Gate C:** propriedade verificada, sitemaps aceitos (sem erro), baseline salvo. Se o conector Google Search Console não estiver conectado, parar aqui e pedir ao usuário para conectá-lo (não pedir credenciais manuais).

---

## Bloco D — 4 combinações piloto com conteúdo realmente único

**Escopo (uma por cidade, 1 serviço variando):**

1. `/servico-em-nacional/sao-paulo/pinheiros/informatica`
2. `/servico-em-nacional/rio-de-janeiro/copacabana/recuperacao-dados`
3. `/servico-em-nacional/brasilia/asa-sul/redes`
4. `/servico-em-nacional/salvador/pituba/notebooks`

**Ação:**

- Criar `src/data/nationalCuratedContent.ts` com, por combinação: intro curada (2 parágrafos), 3 casos típicos locais reais e verificáveis (ex.: cabeamento em prédios antigos de Copacabana, umidade salina em Pituba), lista de bairros vizinhos atendidos, referência ao tempo de deslocamento típico, FAQ dedicada (4–6 perguntas exclusivas, sem template), preço reforçando invariantes (R$ 99,99 / R$ 299,99).
- Em `ServicoBairroNacional.tsx`: se combinação existir em `nationalCuratedContent`, renderiza bloco curado + FAQ curada (via `FAQSection` + `SEOHead.faq`); caso contrário, mantém fluxo atual.
- Similaridade alvo entre as 4: Jaccard médio < 0.35 (sem tokens de cidade/bairro/serviço). Adicionar `scripts/check-curated-uniqueness.ts` que roda no `postbuild` e falha se > 0.45.
- `BreadcrumbList`, `Service`, `LocalBusiness`, `FAQPage` continuam via `SEOHead` (sem duplicidade).
- CTAs mantêm `data-wa-source`, `data-service`, `data-city`, `data-neighborhood`.

**Gate D:** build OK, `check-national-service-matrix` ainda 100/100 (matriz não expande), `check-curated-uniqueness` passa, `check-seo-dedup` passa, E2E `national-service-neighborhood.spec.ts` verde. Playwright screenshot de 1 das 4 páginas para conferência visual.

---

## Bloco E — Publicar + smoke + plano de expansão a 300 URLs

**Ação:**

- Publicar apenas após A+B+C+D aprovados pelo usuário.
- Smoke pós-deploy nas 4 pilotos + 2 sanity (`/`, `/assistencia-tecnica`):
  - `description` = 1
  - `canonical` = 1, self-referente
  - `og:*` / `twitter:*` = 1 cada
  - `FAQPage`, `BreadcrumbList`, `Service` presentes
  - `dataLayer` recebe `page_view` com `service`/`city`/`bairro`
  - CTAs WhatsApp preservados
- Entregar `docs/plano-expansao-300.md` com:
  - Critérios de aprovação por combinação: densidade textual > 350 palavras únicas, FAQ curada 4+, similaridade Jaccard < 0.45 vs. qualquer irmã, evidência mínima de demanda (busca real ou pedido).
  - Novo teto: 300 URLs. Sub-caps: máx. 3 serviços por bairro, máx. 6 bairros por cidade, máx. 10 cidades. Guard `check-national-service-matrix` atualizado com esses limites.
  - Requisitos de interlinking: cada nova URL recebe ≥ 5 inbound de irmãs de mesma cidade e ≥ 2 de mesmo serviço.
  - Testes de regressão obrigatórios antes de cada lote: E2E de contagem de metatags, uniqueness curada, sitemap válido, GSC coverage sem picos de "Descoberto — não indexado".
  - Gate quantitativo: só ampliar após 4 semanas de dados no GSC mostrando ≥ 40% das URLs piloto indexadas e CTR > 0 em ao menos 10.
  - Rollback: reverter para 100 se índice de "Duplicado" > 10% ou se CWV LCP p75 > 2.5s subir 20%.

**Gate E:** publicado; smoke verde; plano entregue; usuário decide manter ou rollback.

---

## Detalhes técnicos

- Nenhum `service_role` no frontend. Nenhuma nova secret exceto `VITE_GTM_ID` (opcional).
- Preservar invariantes de preço R$ 99,99 / R$ 299,99 em qualquer FAQ nova.
- Matriz nacional permanece exatamente 100 URLs até Bloco E.
- Não migrar sitemap.xml existente; apenas garantir submissão no GSC.
- Não desativar tag do Google Ads.
- `react-helmet-async` já provê deduplicação de metas — a correção do Bloco A é remover a source concorrente estática, não migrar mecanismo.

---

## Perguntas antes de iniciar o Bloco A

1. Você já tem um GTM container criado (ex.: `GTM-XXXX`) ou prefere GA4 direto via `gtag.js` com `G-XXXX`? (recomendo GTM: cobre GA4 + Ads + futuras tags sem redeploy)
2. Se GTM: pode fornecer o `GTM-ID` quando chegarmos ao Bloco B? Enquanto isso o loader fica em no-op.
3. O conector "Google Search Console" já está conectado no seu workspace Lovable? Se não, você autoriza conectar quando chegarmos ao Bloco C?
4. Confirmo as 4 combinações piloto listadas no Bloco D ou prefere trocar alguma cidade/serviço?

Aguardando aprovação para iniciar pelo **Bloco A**.

&nbsp;

&nbsp;

&nbsp;

Rodada 25.1 — Reconciliação, correções bloqueantes, mensuração e piloto curado

MODO DE EXECUÇÃO

Executar um bloco por vez.

Ao final de cada bloco:

- rodar o gate específico;

- entregar relatório;

- parar;

- aguardar autorização expressa;

- não iniciar automaticamente o bloco seguinte;

- não publicar sem autorização.

A matriz nacional deve permanecer em exatamente 100 URLs durante toda esta rodada.

O arquivo:

`public/sitemap-nacional-servicos-piloto.xml`

deve continuar com exatamente 100 URLs.

Não ampliar cidades, bairros, serviços, combinações, teto do guard ou sitemap.

────────────────────────────────────

BLOCO 0 — RECONCILIAÇÃO DO ESTADO REAL

────────────────────────────────────

Antes das correções propostas, reconciliar as alterações do “Bloco 1 preview” que entraram antes do fluxo aprovado.

Executar:

- `git status --short`;

- `git diff --stat`;

- `git diff`;

- identificar commit atual;

- identificar baseline correspondente à Rodada 24.4 aprovada.

Inventariar especificamente:

- `src/lib/faqBuilders.ts`;

- `src/components/seo/FAQSection.tsx`;

- prop `faq` de `SEOHead`;

- alterações em `ServicoDetalhe`;

- alterações em `ServicoBairroNacional`;

- alterações em `BairroNacional`;

- alterações em `RegiaoDetalhe`;

- qualquer alteração relacionada a FAQ/schema feita antes da especificação atual.

Entregar tabela:

| Arquivo | Mudança encontrada | Origem | Publicada | KEEP | REWORK | REVERT | Motivo |

Regras:

- não executar `git reset --hard`;

- não reverter arquivos inteiros que também contenham correções aprovadas;

- fazer reversão seletiva por trecho;

- preservar rota nacional;

- preservar matriz de 100 URLs;

- preservar sitemap;

- preservar CTAs;

- preservar Service schema;

- preservar BreadcrumbList;

- preservar robots, canonical, OG e Twitter deduplicados.

Corrigir no mesmo bloco os resíduos já comprovados:

1. `AssistenciaTecnicaCuritiba.tsx`

   - remover FAQPage duplicado;

   - manter exatamente um FAQPage;

   - remover `console.log("FAQPage", ...)`;

   - garantir FAQ visível e schema usando o mesmo array.

2. Home

   - confirmar divergência entre FAQ visual e schema;

   - unificar em uma única fonte de dados;

   - não manter arrays paralelos.

3. `ServicoDetalhe`

   - não usar FAQ genérica de fallback em múltiplos serviços;

   - usar FAQs curadas de `src/data/services.ts`;

   - se não houver FAQ específica, não emitir FAQPage artificial.

4. `ServicoCidade`

   - revisar perguntas que apenas inserem o nome da cidade;

   - remover perguntas sem variação factual;

   - preservar somente perguntas úteis e específicas do serviço.

5. `ServicoBairroNacional`

   - remover FAQ preview quando ela apenas troca serviço/cidade/bairro;

   - remover o FAQPage correspondente;

   - preservar Service, BreadcrumbList, CTAs e conteúdo principal.

6. `BairroNacional`

   - remover FAQ preview baseada somente em tokens;

   - manter FAQ apenas quando houver conteúdo local factual.

7. `RegiaoDetalhe`

   - remover FAQ repetida em dezenas de bairros;

   - eliminar `R$ 99,90`;

   - usar a constante oficial de `COMMERCIAL_TERMS`;

   - não hardcodar R$ 99,99.

8. Componente visual de FAQ

   - evitar colisão entre dois arquivos chamados `FAQSection`;

   - caso o componente novo seja mantido, renomear para `FaqAccordion`;

   - permitir no máximo um CTA contextual ao final;

   - nunca inserir um CTA por pergunta.

9. `faqBuilders.ts`

   - classificar builders como:

     - curado;

     - parcialmente parametrizado;

     - template puro;

   - remover builders template puro sem fonte factual;

   - não criar nova arquitetura `src/data/faqs/*` nesta etapa.

Criar:

`scripts/check-faq-consistency.ts`

O guard não deve exigir FAQPage em toda página.

Validar:

- no máximo um FAQPage por página;

- nenhum FAQPage manual duplicado;

- nenhum `console.log` de schema;

- nenhuma FAQ genérica compartilhada por múltiplos serviços;

- nenhuma FAQ preview ligada às 100 URLs;

- nenhuma ocorrência de R$ 99,90;

- uso da fonte oficial para valores comerciais.

Gate do Bloco 0:

- typecheck verde;

- build verde;

- guard FAQ verde;

- E2E de FAQ/schema verde;

- matriz ainda 100;

- sitemap ainda 100.

Parar e entregar relatório.

────────────────────────────────────

BLOCO A — META DESCRIPTION COMO FONTE ÚNICA

────────────────────────────────────

Problema confirmado:

- `index.html` emite meta description estática;

- Helmet/SEOHead emite description contextual;

- as 100 páginas ficam com duas tags.

Ação:

1. Remover:

`<meta name="description" ...>`

de `index.html`.

2. Substituir por comentário-guarda, seguindo o padrão de:

- robots;

- twitter:card.

3. Manter `SEOHead` como fonte oficial.

4. Ampliar:

`scripts/check-seo-dedup.ts`

Validar:

- `index.html` não emite description;

- `SEOHead` contém a emissão oficial;

- nenhuma página pública emite uma segunda description manual;

- páginas indexáveis terminam com exatamente uma description.

5. Atualizar:

`e2e/seo-tag-counts.spec.ts`

Cobrir:

- `/`;

- `/servico-em/curitiba/informatica`;

- `/servico-em-nacional/sao-paulo/pinheiros/informatica`;

- `/servico-em-nacional/brasilia/asa-norte/cftv`;

- uma combinação inválida;

- `/assistencia-tecnica`;

- `/auth`.

Critérios:

- indexáveis: description exatamente 1;

- description coerente com a rota;

- páginas nacionais sem description genérica de Curitiba;

- inválidas sem description concorrente;

- robots, canonical, OG e Twitter preservados.

Gate A:

- `bunx tsgo --noEmit`;

- `bun run build`;

- `check-seo-dedup` verde;

- E2E seletivo verde;

- nenhuma alteração na matriz ou sitemap.

Parar e entregar relatório.

────────────────────────────────────

BLOCO B — PROJETO DE MENSURAÇÃO VIA GTM

────────────────────────────────────

Este bloco só pode começar após o usuário fornecer um Container ID real.

`GTM-XXXXXXX` é configuração pública, não segredo.

Não usar `add_secret` apenas para esconder o ID.

Antes de implementar, registrar:

- Container ID fornecido;

- decisão de consentimento;

- quais tags já existem;

- se Google Ads permanecerá direto no código ou será futuramente administrado pelo GTM.

Não duplicar a tag Google Ads existente.

1. Loader GTM

Adicionar loader oficial:

- script no head;

- noscript no início do body;

- carregamento somente quando o ID for válido;

- sem placeholders públicos;

- sem quebrar preview quando ausente.

Não inserir script por interpolação insegura.

Validar o formato:

`/^GTM-[A-Z0-9]+$/`

2. Consentimento

Antes de disparar analytics não essencial:

- auditar o mecanismo de consentimento já existente;

- não inventar banner novo sem aprovação;

- documentar se GTM ficará bloqueado até consentimento;

- preservar política atual;

- não alegar conformidade jurídica sem revisão.

Se não houver decisão de consentimento:

- implementar infraestrutura em modo desativado;

- não disparar tags em produção;

- parar e reportar.

3. Pageview SPA

Evitar contagem dupla.

Não usar automaticamente:

`event: "page_view"`

sem confirmar a configuração de histórico do GA4 dentro do GTM.

Preferência:

- disparar evento de dataLayer chamado `virtual_page_view`;

- configurar no GTM uma tag GA4 correspondente;

- desabilitar uma das fontes de history pageview para impedir duplicidade.

Payload:

- `page_path`;

- `page_location`;

- `page_title`;

- `route_type`;

- `service`, quando aplicável;

- `city`, quando aplicável;

- `neighborhood`, quando aplicável.

Usar `neighborhood` como nome canônico, não misturar `bairro` e `neighborhood`.

Não enviar:

- telefone;

- e-mail;

- endereço completo;

- CEP;

- latitude;

- longitude;

- texto livre da triagem;

- descrição do problema.

4. Momento do pageview

Garantir que:

- `page_title` já esteja atualizado pelo Helmet;

- navegação SPA não dispare o título da rota anterior;

- refresh inicial gere somente um evento;

- mudança de querystring irrelevante não gere evento duplicado;

- React Strict Mode não gere eventos duplicados.

5. Eventos

Padronizar:

- `cta_click`;

- `whatsapp_click`;

- `triage_open`;

- `triage_step`;

- `triage_complete`.

Payload mínimo:

- `surface`;

- `cta_id`;

- `service`;

- `city`;

- `neighborhood`;

- `page_path`;

- `source`.

Eventos devem falhar silenciosamente quando `dataLayer` não existir.

6. Delegação global

Auditar antes de ampliar `main.tsx`.

Não inferir contexto errado de elementos globais.

Regra:

- CTA contextual envia serviço/cidade/bairro;

- CTA global pode continuar genérico;

- não preencher cidade ou bairro quando o elemento não possui contexto real.

7. Documentação

Criar:

`docs/analytics.md`

Incluir:

- eventos;

- parâmetros;

- nomes canônicos;

- PII proibida;

- configuração necessária no GTM;

- prevenção de pageview duplicado;

- processo de teste;

- DebugView;

- Tag Assistant;

- rollback.

8. Testes

Playwright deve interceptar `window.dataLayer`.

Validar:

- home: 1 `virtual_page_view`;

- rota da matriz: 1 `virtual_page_view`;

- navegação SPA entre duas rotas: 1 evento adicional;

- serviço/cidade/bairro corretos;

- zero telefone/endereço/coordenada;

- CTA WhatsApp gera um evento;

- abertura de triagem gera um evento;

- ausência de GTM ID não quebra o site;

- Google Ads atual não dispara duplicado.

Gate B:

- build verde;

- E2E de analytics verde;

- WhatsApp E2E verde;

- nenhuma PII;

- nenhuma duplicidade;

- relatório indicando se GTM está:

  - ativo;

  - configurado mas desativado;

  - ou pendente de consentimento.

Parar e entregar relatório.

────────────────────────────────────

BLOCO C — GOOGLE SEARCH CONSOLE

────────────────────────────────────

Não presumir que existe um conector chamado `google_search_console`.

Primeiro:

1. listar integrações/conectores disponíveis;

2. confirmar se existe ação oficial para:

   - listar propriedades;

   - verificar propriedade;

   - submeter sitemap;

   - inspecionar URL.

Se não existir conector compatível:

- parar;

- informar que o usuário precisa conectar uma integração adequada;

- não pedir senha;

- não pedir token OAuth manual;

- não simular acesso com curl;

- não inventar resultado.

Se o conector existir:

1. Listar propriedades verificadas.

2. Procurar:

   - propriedade de prefixo `https://precisodeumtecnico.com/`;

   - propriedade de domínio, se existente.

3. Preferir propriedade já verificada.

4. Não inserir meta de verificação se a propriedade já estiver verificada.

5. Se verificação for necessária:

   - apresentar métodos suportados;

   - preferir método que o usuário realmente consiga concluir;

   - pedir autorização antes de alterar DNS ou `index.html`.

Sitemaps:

- submeter prioritariamente `/sitemap.xml`;

- confirmar que o sitemap index referencia o shard piloto;

- não submeter todos os shards sem necessidade;

- submeter o piloto separadamente somente se houver justificativa de monitoramento;

- não duplicar submissões existentes.

Baseline:

Inspecionar:

- `/`;

- uma página de cidade nacional;

- uma página de bairro nacional;

- uma página da matriz piloto.

Criar:

`docs/gsc-baseline-YYYYMMDD.md`

Registrar apenas dados reais:

- propriedade;

- sitemap;

- status;

- última leitura;

- cobertura;

- canonical declarada;

- canonical selecionada;

- estado de indexação;

- último crawl;

- bloqueios.

Não tratar “sitemap aceito” como “URL indexada”.

Gate C:

- propriedade confirmada;

- sitemap index submetido ou já presente;

- baseline real registrada;

- ausência de números inventados.

Parar e entregar relatório.

────────────────────────────────────

BLOCO D — QUATRO COMBINAÇÕES CURADAS

────────────────────────────────────

Escopo:

1. `/servico-em-nacional/sao-paulo/pinheiros/informatica`

2. `/servico-em-nacional/rio-de-janeiro/copacabana/recuperacao-dados`

3. `/servico-em-nacional/brasilia/asa-sul/redes`

4. `/servico-em-nacional/salvador/pituba/notebooks`

Não alterar as outras 96 páginas.

Criar:

`src/data/nationalCuratedContent.ts`

Cada entrada pode conter:

- introdução exclusiva;

- problemas técnicos típicos do serviço;

- contexto do tipo de imóvel ou uso;

- critérios de diagnóstico;

- processo de atendimento;

- cuidados preventivos;

- FAQ curada, somente se houver perguntas realmente exclusivas;

- links para páginas existentes;

- referências verificadas.

Proibido inventar:

- idade dos prédios;

- maresia ou umidade específica;

- qualidade de cabeamento local;

- tempo médio de deslocamento;

- distância;

- bairros vizinhos;

- cobertura local garantida;

- volume de demanda;

- quantidade de técnicos;

- presença física;

- equipe própria;

- prazo de chegada;

- preço local;

- perfil econômico do bairro.

Referências locais só podem ser usadas quando:

- estiverem em fonte existente do projeto;

- forem verificadas;

- forem relevantes para o serviço;

- não implicarem capacidade operacional inexistente.

Quando não houver dado local real:

- escrever conteúdo específico do serviço;

- contextualizar de forma neutra;

- não fabricar diferenciação geográfica.

FAQ:

- não é obrigatória;

- 4 a 6 perguntas somente quando houver conteúdo legítimo;

- UI e FAQPage devem usar o mesmo array;

- no máximo um FAQPage;

- nenhuma keyword forçada.

Valores:

- sempre consumir `COMMERCIAL_TERMS`;

- nunca hardcodar R$ 99,99 ou R$ 299,99;

- deixar claro o que está incluído e excluído.

Similaridade:

Criar:

`scripts/check-curated-uniqueness.ts`

O Jaccard serve apenas como alerta técnico.

Regras:

- falhar acima de 0,45 entre as quatro páginas após normalização;

- não considerar resultado abaixo de 0,45 prova automática de qualidade;

- exigir revisão textual manual;

- detectar parágrafos idênticos;

- detectar FAQs idênticas;

- detectar troca exclusiva de tokens.

Não usar quantidade de palavras como critério único.

Meta recomendada:

- conteúdo principal substancial;

- sem enchimento;

- sem keyword stuffing;

- sem blocos repetidos apenas para alcançar 350 palavras.

Em `ServicoBairroNacional.tsx`:

- renderizar conteúdo curado somente quando a combinação existir;

- demais 96 páginas permanecem no estado saneado;

- não reintroduzir FAQ preview genérica.

E2E:

- quatro pilotos;

- uma página não curada como controle;

- exactly one description;

- canonical self;

- Service e BreadcrumbList;

- FAQPage somente quando houver FAQ visível;

- CTAs contextuais;

- ausência de claims proibidos;

- zero página branca;

- zero erro.

Gerar screenshot de uma página somente para revisão visual.

Gate D:

- matriz 100/100;

- sitemap 100;

- uniqueness guard verde;

- FAQ consistency verde;

- SEO dedup verde;

- E2E verde;

- relatório com conteúdo e fontes utilizadas.

Parar e entregar relatório.

────────────────────────────────────

BLOCO E — PUBLICAÇÃO, OBSERVAÇÃO E PLANO FUTURO

────────────────────────────────────

Publicar somente após aprovação explícita dos Blocos 0, A, B, C e D.

Smoke:

- home;

- assistência técnica;

- quatro pilotos curados;

- uma página não curada;

- uma combinação inválida;

- auth.

Validar:

- description = 1;

- canonical = 1;

- robots = 1;

- twitter:card = 1;

- OG únicos;

- Service = 1 nas páginas de serviço;

- BreadcrumbList = 1;

- FAQPage no máximo 1;

- UI/schema equivalentes;

- pageview SPA sem duplicidade;

- CTAs preservados;

- zero PII;

- zero pageerror;

- zero console error;

- zero asset 404.

Security scan:

- zero crítico/error;

- warn conhecido documentado;

- ausência de `service_role`.

Criar:

`docs/plano-expansao-300.md`

Este documento é apenas um plano.

Não alterar:

- `NATIONAL_MATRIX_MAX`;

- `nationalServiceCoverage.ts`;

- guard atual de 100;

- sitemap;

- quantidade de URLs.

O plano deve prever:

1. Expansão futura em lotes pequenos.

2. Allowlist explícita.

3. Conteúdo curado antes da ativação da URL.

4. Nenhuma página órfã.

5. Sitemap shard separado.

6. Gate técnico.

7. Gate de conteúdo.

8. Gate de mensuração.

9. Gate de indexação.

10. Rollback.

Critérios sugeridos, não absolutos:

- ausência de meta/schema duplicado;

- nenhuma URL órfã;

- nenhuma soft 404;

- conteúdo não baseado apenas em tokens;

- similaridade dentro do limite técnico;

- dados reais de GSC;

- eventos de conversão mensuráveis;

- ausência de picos relevantes em:

  - duplicada;

  - rastreada, não indexada;

  - descoberta, não indexada;

  - soft 404.

Não fixar expansão automaticamente em 300.

A decisão após observação pode ser:

- manter 100;

- ampliar para 150;

- ampliar para 200;

- ou autorizar teto futuro de 300.

Não usar apenas:

- “40% indexadas”;

- “CTR maior que zero em 10 páginas”;

- “350 palavras”;

- “Jaccard abaixo de 0,45”.

Esses indicadores devem ser analisados em conjunto.

Performance:

- Lighthouse é dado de laboratório;

- LCP p75 exige dado de campo, quando disponível;

- não tratar um Lighthouse isolado como CWV p75;

- não executar rollback por variação de laboratório isolada.

Gate E:

- publicação verde;

- smoke verde;

- plano entregue;

- matriz ainda 100;

- usuário decide o próximo teto.

────────────────────────────────────

PERGUNTAS E ORDEM

────────────────────────────────────

Não faça as quatro perguntas agora.

O Bloco 0 e o Bloco A independem de GTM, GSC e conteúdo piloto.

Comece exclusivamente pelo BLOCO 0.

Pare ao final do relatório.

Somente antes do Bloco B, solicitar:

- GTM Container ID real;

- decisão de consentimento.

Somente antes do Bloco C:

- confirmar disponibilidade do conector GSC.

Somente antes do Bloco D:

- confirmar as quatro combinações piloto.

Não publicar durante o Bloco 0.