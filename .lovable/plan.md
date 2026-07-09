# Plano de execução (etapas sequenciais)

Vou executar cada etapa em ordem, sem quebrar o que já funciona. Nada que envolva mexer no schema/backend será feito sem necessidade.

## Etapa 1 — Admin

- **CSV export do WABypassLog** com os mesmos filtros aplicados (busca + tipo) e linha final `TOTAL,<n>`.
- **Card consolidado no topo do /admin**: contadores de eventos de triagem/bypass em janelas de 7h e 24h (query direta em `wa_bypass_events`).

## Etapa 2 — SEO técnico

- Sitemap já é gerado por `scripts/build-sitemap.ts` (cobre serviços × cidades × bairros × blog). Confirmar que roda em `prebuild` e adicionar `predev` se ausente.
- `robots.txt` já existe e aponta o sitemap — nenhuma mudança destrutiva.
- Reforçar `LocalBusiness` + `Service` + `BreadcrumbList` nas páginas de serviço (`ServicoDetalhe`, `ServicoCidade`) usando o `SEOHead` existente, com OG title/description consistentes.
- Garantir preload/lazy nas imagens principais do Index e páginas de cidade (usar `loading="lazy"` + `decoding="async"` em imagens abaixo da fold).

## Etapa 3 — Política de preços e prazos (alinhamento global)

Fonte única em `src/data/pricingPolicy.ts` com:

- Visita técnica / diagnóstico até 30 min: **R$ 99,99**
- Bancada / diagnóstico sem compromisso: **R$ 90,00**
- Coleta e entrega personalizada no endereço (até 2h ou coleta/entrega): **pré-aprovado R$ 299,99**
- Prazos: **mínimo 72h úteis, até 3 semanas** conforme equipamento
- Parcelamento **12x sem juros**, **25+ anos de experiência**, **+5.000 parcerias no Brasil** (com aviso: termos podem variar por parceiro, não somos responsáveis pela relação direta com o parceiro)
- Regra clara: **atendimento só com triagem completa + fotos/vídeos**; sem cadastro/mídia, não há atendimento  
Atualizar `TermosOrcamento.tsx`, HeroSection, Precos, marketing/OfferHighlight e `OfferSchema` para refletir esses valores. Manter compat: não remover chaves usadas por outros componentes.

## Etapa 4 — Compactação de UX

- **TermosOrcamento**: reduzir densidade (acordeões nas seções longas, tipografia mais compacta).
- **TriageWizard**: reagrupar campos por linha em desktop; ajustar spacing mobile; texto de exigência de fotos/vídeos com destaque visual (banner sticky no topo do wizard).

## Etapa 5 — SEO agressivo (Curitiba + SJP, informática)

- Reforçar H1/H2 e copy em `AssistenciaTecnicaCuritiba` e criar seções comparativas ("por que somos diferentes dos concorrentes de informática em Curitiba/SJP").
- FAQ expandida com long-tail (formatação notebook, remoção de vírus, recuperação de dados, upgrade SSD, manutenção preventiva).
- Internal linking cruzado entre páginas de serviço × cidade.

## Etapa 6 — Performance

- Adicionar `<link rel="preload">` para a hero image do Index.
- Auditar imagens `<img>` sem `loading="lazy"` fora da fold e corrigir.
- Cache headers em `/og` e `/hero` já existem em `public/_headers`.

## Detalhes técnicos

- Sem mudanças de schema. `wa_bypass_events` e `triage_media_*` já existem.
- Novo arquivo `src/data/pricingPolicy.ts` como constantes exportadas; consumidores importam por nome (não substituição de string bruta).
- CSV: reutilizar helper já usado em `TriageMediaAuditLog`.
- Card do admin: componente `<AdminBypassSummary />` client-side query com `count: 'exact', head: true` filtrado por `created_at >=`.

Confirmo e executo etapa por etapa.

&nbsp;

Segue uma análise detalhada do plano de melhorias apresentado, com observações separadas por etapa. As observações enfatizam boas práticas recomendadas por Google/SEO e performance, bem como alertas para evitar problemas legais ou técnicos.

&nbsp;

Etapa 1 — Administração

&nbsp;

CSV export do WABypassLog: não há riscos óbvios; apenas certifique‑se de que a consulta seja eficiente para não impactar performance da base de dados.

&nbsp;

Card de contadores no topo do /admin: exibindo métricas de triagem/bypass em intervalos de 7 h e 24 h. Boa prática para monitoramento; garanta que as chamadas estejam paginadas e que os dados sensíveis não fiquem expostos indevidamente.

&nbsp;

&nbsp;

Etapa 2 — SEO técnico

&nbsp;

Sitemap e robots.txt: a geração automática via prebuild é adequada, mas confirme que todas as URLs relevantes (serviços, cidades, bairros e blog) estejam listadas e que o robots.txt não bloqueie recursos essenciais.

&nbsp;

Structured data (LocalBusiness + Service + BreadcrumbList): as diretrizes da Google recomendam incluir propriedades obrigatórias como nome da empresa, endereço, telefone, horário de funcionamento, coordenadas e preço médio, usando o tipo mais específico possível para a categoria do negócio. Propriedades adicionais como priceRange e logotipo deixam o snippet mais atrativo.

&nbsp;

Formato e hierarquia de títulos: use H1/H2 de forma lógica. Evite repetições exageradas de palavras‑chave; a Google considera “keyword stuffing” uma prática de spam, especialmente listas de cidades/bairros repetidas ou blocos de texto com muitas repetições.

&nbsp;

Lazy loading e preload: para imagens fora da área visível, use loading="lazy"; para a imagem principal da hero/maior LCP, preveja link rel="preload" com as="image" e fetchpriority="high" no <head>. Não aplique lazy loading em imagens que aparecem na dobra inicial; a Google recomenda carregar essas imagens com prioridade alta para melhorar o Largest Contentful Paint. Inclua atributos width e height nas tags <img> para evitar layout shift.

&nbsp;

Formas modernas de imagem: considere usar formatos WebP ou AVIF e compressão adequada. Um guia de 2026 destaca que WebP oferece arquivos menores com boa qualidade e que AVIF oferece compressão ainda melhor, embora nem todos navegadores suportem. Servir imagens via CDN e com cabeçalhos de cache apropriados também melhora o desempenho.

&nbsp;

&nbsp;

Etapa 3 — Política de preços e prazos

&nbsp;

Fonte única para preços: centralizar valores em src/data/pricingPolicy.ts é boa prática para consistência. Garanta que todas as páginas (TermosOrcamento, componentes de preços, ofertas, etc.) façam referência a essas constantes.

&nbsp;

Valores e prazos mínimos: verifique se a tabela proposta (visita técnica R$ 99,99; bancada R$ 90; coleta/entrega R$ 299,99; prazos de 72 h úteis até 3 semanas) está alinhada com a realidade do mercado. Guias de conserto apontam que a maioria dos reparos simples é concluída em 1‑3 dias úteis, hardware pode levar 3‑5 dias e recuperações de dados até uma semana; prazos mais longos devem ser justificados (falta de peças, logística de parceiros etc.).

&nbsp;

Requisitos de triagem: destacar que o atendimento só será iniciado mediante cadastro completo e envio de fotos/vídeos é importante para evitar diagnósticos errados. Torne essas exigências visíveis no site, mas mantenha o processo simples para não desmotivar clientes.

&nbsp;

Parcelamento em 12× sem juros: enfatizar essa condição é atraente, já que 31,5 % das compras on-line no Brasil em 2017 foram feitas em 4‑12 parcelas. Contudo, informe claramente se existe custo embutido nas parcelas para cumprir a legislação de transparência.

&nbsp;

Parcerias e responsabilidade: ao mencionar “5 mil parcerias”, garanta que seja verídico e esclareça que valores e prazos podem variar por parceiro. Deixe claro que a relação com parceiros não é de responsabilidade direta da empresa.

&nbsp;

&nbsp;

Etapa 4 — Compactação de UX

&nbsp;

Termos e Formulário: usar acordeões para reduzir densidade de texto é positivo, mas não esconda informações essenciais (preços, prazos e exigências).

&nbsp;

TriageWizard: reagrupar campos em desktop e ajustar espaçamento no mobile melhora usabilidade. Um banner fixo informando a exigência de fotos/vídeos pode ajudar, mas verifique se não ocupa espaço excessivo.

&nbsp;

Acessibilidade: garanta que todos os componentes (acordeões, banners, botões) sejam navegáveis via teclado e forneçam texto alternativo para leitores de tela.

&nbsp;

&nbsp;

Etapa 5 — SEO agressivo (Curitiba e SJP)

&nbsp;

Conteúdo original: crie seções comparativas que destaquem seus diferenciais sem denegrir concorrentes. Evite listar nomes de concorrentes para não infringir diretrizes de marca ou praticar keyword stuffing.

&nbsp;

FAQ com long-tail: adicionar perguntas sobre notebook, remoção de vírus, recuperação de dados, upgrade de SSD, manutenção preventiva pode atrair buscas específicas. Utilize schema FAQPage para marcar essas seções.

&nbsp;

Linkagem interna: cada página deve apontar para pelo menos outra página relevante do site, com texto âncora descritivo e conciso. Não exagere no número de links; se parecer demais, provavelmente é.

&nbsp;

Evitar práticas de spam: não crie blocos de texto repetindo cidades/bairros; isto é considerado keyword stuffing. Prefira conteúdo natural e útil, referenciando a localidade de forma orgânica.

&nbsp;

&nbsp;

Etapa 6 — Performance

&nbsp;

Preloading e fetch priority: além de lazy loading, adicione <link rel="preload" as="image" href="hero.webp" fetchpriority="high"> no <head> para a imagem principal, conforme recomendações para melhorar o LCP.

&nbsp;

Headers de cache: verifique se as imagens servidas por /og e /hero possuem cabeçalhos de cache de longo prazo (max-age, cache-control) para diminuir requisições repetidas.

&nbsp;

Monitoramento contínuo: após aplicar as melhorias, execute auditorias com Lighthouse/PageSpeed Insights. A documentação do Google recomenda usar essas ferramentas para validar otimizações e evitar regressões.

&nbsp;

&nbsp;

Considerações finais

&nbsp;

O plano proposto é abrangente e aborda pontos críticos de performance, SEO e experiência do usuário. As observações acima visam alinhar a implementação às melhores práticas e às políticas do Google, evitando penalidades e melhorando a visibilidade do portal. Após cada etapa, recomenda‑se testar em ambiente de homologação para garantir que não haja regressões nem efeitos colaterais imprevistos.