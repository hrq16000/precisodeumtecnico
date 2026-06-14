
# Plano de melhorias — Portal Preciso de Um Técnico

Auditoria feita na home (1366px e 375px), header e seções principais. Abaixo o que precisa ser corrigido e melhorado, agrupado por prioridade.

---

## 1. Correções urgentes de layout (largura / overflow / sobreposições)

**Logo "estourando" o header** (visível em desktop ≥1024px): o cartão branco da logo (`bg-white shadow-md` + padding) tem altura maior que a barra do header e fica pendurado para fora, sobrepondo o início do conteúdo das seções e dando aparência de "desregulado".
- Reduzir as alturas da logo (`HEIGHTS.lg` de 60→44 e `HEIGHTS.md` em desktop) e diminuir o padding interno.
- No header claro (variante `dark`), remover a sombra/anel que faz a logo "vazar" — manter apenas em hero/footer escuros.
- Garantir que `header h-16/h-20` sempre comporte a logo, evitando o efeito de cartão flutuante.

**Bloco "Orçamento em Minutos" / chip de destaque**
- Em telas pequenas o chip + título podem espremer; reduzir `text-3xl md:text-4xl` para `text-2xl sm:text-3xl md:text-4xl` e adicionar `break-words`.
- Form: trocar `container mx-auto px-4` por `container-custom` e limitar `max-w-2xl` com `w-full` para evitar overflow horizontal em iPhones 320–375px.

**Auditoria global de overflow horizontal**
- Adicionar `overflow-x: clip` no `body` em `index.css` como rede de segurança (não esconde scroll vertical, evita "stourar" largura).
- Revisar todas as seções que usam `container mx-auto px-4` cru e padronizar com `container-custom` (max-w-7xl + padding responsivo).
- Inspecionar tabelas, grids e cards no `/precos`, `/blog`, `/regioes` em 360px.

**WhatsApp flutuante sobreposto**: em mobile o botão "WhatsApp 24h" cobre o CTA verde do hero. Aumentar `bottom` e reduzir tamanho em telas <400px, ou esconder enquanto o hero estiver visível.

---

## 2. Imagens quebradas / faltantes

- Varredura: rodar `scripts/check-page-images.ts` (já existe) e listar quebras reais.
- Substituir placeholders e imagens 404 por:
  - `imagegen` para hero das páginas de serviço (informática, notebooks, CFTV, elétrica, ar-condicionado, celulares, games, redes, impressoras).
  - OG images por página principal (atualmente só existe a sitewide).
- Adicionar `loading="lazy"`, `decoding="async"` e `width/height` em todas as `<img>` para evitar CLS.
- Fallback gracioso: `onError` trocando por placeholder SVG neutro.

---

## 3. Polimento visual e UX

- **Header**: top bar azul só aparece em `xl:`; recuperar em `lg:` ou esconder definitivamente — hoje some entre 1024–1280px deixando o header "vazio".
- **Espaçamentos**: reduzir `section-padding` (`py-16 md:py-24 lg:py-32`) para algo mais compacto em mobile (`py-12 md:py-20 lg:py-24`).
- **Hierarquia tipográfica**: títulos de seção muito grandes em mobile; aplicar `clamp()` ou escala responsiva consistente.
- **Cards de serviços e regiões**: padronizar alturas (`h-full` + `flex flex-col`) para evitar grid irregular.
- **Cores/contraste**: rever texto `text-muted-foreground` sobre fundos coloridos (acessibilidade WCAG AA).
- **Footer**: revisar densidade e quebra de colunas em tablet.
- **Animações**: reduzir intensidade de `animate-fade-up` em listas longas (causa "pulo" de layout).

---

## 4. Performance e Core Web Vitals

- Preload apenas do logo `webp` (já feito) — adicionar `fetchpriority="high"` ao hero image.
- Code-split por rota (lazy import) das páginas pesadas (`Blog`, `BairroDetalhe`, `AssistenciaTecnicaCuritiba`).
- Comprimir imagens existentes em `src/assets` para webp/avif.
- Remover fontes não utilizadas do Google Fonts import (Inter já basta; revisar Plus Jakarta).
- Auditar bundle com `vite build --report` e remover libs duplicadas.

---

## 5. SEO agressivo nacional ("arrumar pc / preciso de técnico" em todo o Brasil)

Hoje o site é fortemente focado em Curitiba/PR. Para captar busca nacional:

**Conteúdo e estrutura**
- Criar hub `/tecnico-de-informatica` com sub-páginas por capital: `/tecnico-de-informatica/sao-paulo`, `/rio-de-janeiro`, `/belo-horizonte`, `/brasilia`, `/porto-alegre`, `/salvador`, `/fortaleza`, `/recife`, `/manaus`, `/florianopolis`, `/goiania`, `/campinas`, etc. (top 30 cidades).
- Conteúdo dinâmico por cidade (gerado por template + dados em `src/data/cidadesBrasil.ts`): bairros, faixa de preço, tempo médio de atendimento, depoimentos locais.
- Palavras-chave alvo (validar com `semrush--keyword_research` antes): "arrumar pc", "técnico de informática perto de mim", "conserto de notebook", "formatação de computador", "técnico em domicílio", "assistência técnica notebook", "remover vírus", "manutenção de computador".
- Blog focado em problemas comuns: "PC lento, o que fazer", "computador não liga", "tela azul Windows 11", "notebook não carrega" — cada post 1500+ palavras com FAQ schema.

**Schema/Structured data**
- Mudar `LocalBusiness` para `Service` + `Organization` no nível sitewide; usar `LocalBusiness` apenas nas páginas regionais.
- Adicionar `areaServed` com todos os estados/cidades atendidas nas páginas nacionais.
- `Service` schema por categoria com `offers`, `provider`, `serviceArea`.
- `BreadcrumbList` em todas as páginas internas.
- `Review` + `AggregateRating` por cidade (com dados reais).

**Técnico**
- `sitemap.xml` dinâmico com todas as cidades + posts (gerador `scripts/build-sitemap.ts` já existe — atualizar com novos slugs).
- `hreflang` pt-BR explícito.
- Canonical correto por página (auditar — algumas podem apontar para home).
- Meta title/description únicos por página (≤60/≤160 chars) com cidade + serviço.
- Internal linking: cada página de cidade linka para serviços + cidades vizinhas + blog relevante.
- Atualizar `robots.txt` e fazer ping no Google após deploy (`scripts/ping-sitemap.ts`).

**Off-site/menções**
- Botão de WhatsApp com `utm_source=organic_<cidade>` para mensurar.
- Sugerir cadastro no Google Business Profile por cidade (orientação textual; não automatizável).

---

## 6. Acessibilidade e qualidade

- `aria-label` em todos os ícones-only (Menu, X, fechar dialog).
- Foco visível (`focus-visible:ring`) em todos os links/buttons.
- Verificar contraste em badges verde-claro (`badge-success`) sobre fundo branco.
- Testes Playwright já existem — adicionar caso para overflow horizontal (`scrollWidth === clientWidth`).

---

## Ordem de execução proposta

1. Correções urgentes de layout (item 1) — entrega visível imediata.
2. Imagens quebradas / OG (item 2).
3. Polimento visual (item 3) + performance (item 4).
4. Expansão SEO nacional (item 5) — maior esforço, dividida em ondas de 10 cidades.
5. Acessibilidade e testes (item 6).

Posso começar imediatamente pelo bloco 1 (correção do header/logo + overflow global + container padronizado) e seguir para os demais. Confirma se quer nesta ordem, ou prefere começar pela expansão SEO nacional?
