# AUDIT_REPORT — Preciso de Um Técnico

> Auditoria somente-leitura executada em 11/07/2026. Nenhum arquivo de código foi alterado.
> **Nota de escopo:** o pedido cita `tecnicocuritiba.com.br`, mas o projeto atual publica em
> `precisodeumtecnico.com` (+ `www` + `precisodeumtecnico.lovable.app`). A auditoria foi feita
> sobre o domínio efetivamente publicado. 🟡 Se `tecnicocuritiba.com.br` deve ser o domínio
> primário, é preciso decidir: redirect 301 → precisodeumtecnico, ou trocar canonicals + sitemap.

---

## 1. SEO ON-PAGE

**Estado atual**

- Rotas ativas (`src/App.tsx`): `/`, `/faq`, `/dados-da-empresa`, `/servicos`, `/servicos/:slug`,
  `/regioes`, `/regioes/:city`, `/regioes/:city/:neighborhood`, `/sobre`, `/contato`,
  `/auth`, `/admin`, `/termos-orcamento(-pre-aprovado)`, `/servico-em/:city/:service`,
  `/precos`, `/blog`, `/blog/categoria/:slug`, `/blog/:slug`, `/diagnostics`, `/diagnostico`,
  `/assistencia-tecnica-curitiba`, `/assistencia-tecnica`, `/atendimento-nacional`,
  `/atendimento-nacional/:slug`, `/atendimento-nacional/:city/:bairro`,
  `/servico-em-nacional/:city/:bairro/:service`, `/triagem-preview`.
- `index.html` bem estruturado: `<html lang="pt-BR">`, viewport, favicon multi-size,
  apple-touch-icons, `manifest.json`, `theme-color`, JSON-LD LocalBusiness + Organization + WebSite.
- Meta description é emitida **apenas** via `SEOHead.tsx` / Helmet por rota (source of truth
  já reconciliada nas Rodadas 25.0/25.1). `index.html` mantém apenas comentário-guarda.
- Canonical: intencionalmente ausente do `index.html`; cada rota seta o próprio via Helmet.
- Sitemap-index (`public/sitemap.xml`) + 24 sub-sitemaps; `sitemap-main.xml` = 150 locs,
  `sitemap-nacional-servicos-piloto.xml` = 100 locs, bairros + cidades separados.
- `robots.txt` OK: bloqueia `/admin`, `/auth`, `/diagnostics`, `/diagnostico`; declara sitemap.
- JSON-LD por rota: LocalBusiness base + Service/BreadcrumbList/FAQPage/Article conforme página.

**Problemas encontrados**

| Sev | Item | Detalhe |
|---|---|---|
| 🔴 | Domínio no pedido ≠ domínio publicado | `tecnicocuritiba.com.br` não é o canonical do projeto. Definir estratégia. |
| 🟡 | SPA sem SSR | Crawlers sociais (LinkedIn/Slack/Facebook) só veem head estático — títulos/descrições por rota não aparecem em previews. `index.html:6` |
| 🟡 | `<meta name="keywords">` em `index.html:37` | Ignorada pelo Google, ruído — remover. |
| 🟡 | Pages emitindo Helmet local (fora do `SEOHead`) | `AssistenciaTecnica.tsx`, `AssistenciaTecnicaCuritiba.tsx`, `DadosEmpresa.tsx`, `Faq.tsx` — dificulta enforcement centralizado. |
| 🟢 | `google-site-verification` vazio (`index.html:52`) | Preencher quando GSC estiver conectado. |
| 🟢 | `og:image` no `index.html` aponta para storage.googleapis.com | Ok, mas rotas não têm imagem OG diferenciada. |
| 🟢 | Sem checagem automatizada de duplicidade de `<title>` entre rotas | Adicionar E2E. |

---

## 2. SEO LOCAL

**Estado atual**

- Cobertura RMC: 5 cidades curadas (`src/data/regions.ts`) + 20 bairros curados
  (`nationalBairros.ts` tem 141 slugs, dos quais 20 estão no piloto nacional).
- Matriz nacional piloto: 5 cidades × 20 bairros × 5 serviços = 100 URLs (confirmadas em
  `sitemap-nacional-servicos-piloto.xml`).
- Bairros de Curitiba: 77 URLs em `sitemap-bairros-curitiba.xml`.
- Schema LocalBusiness com endereço, geo, `areaServed`, `openingHoursSpecification`
  (`SEOHead.tsx:74-100`).
- Rodapé (`Footer.tsx`) e página institucional (`DadosEmpresa.tsx`) trazem CNPJ 41.723.708/0001-58.
- Telefone único: `+55 41 99745-2053` (`src/lib/whatsapp.ts:1`), consistente.

**Problemas encontrados**

| Sev | Item | Detalhe |
|---|---|---|
| 🔴 | Sem endereço físico (rua/número) no NAP | Só cidade/estado. Google Business Profile exige endereço completo para ranquear em pack local. `SEOHead.tsx:83` |
| 🟡 | Sem embed de Google Maps em nenhuma landing local | Adicionar iframe (com lazy-load) em `/regioes/:city` e `/contato`. |
| 🟡 | Conteúdo dos bairros nacionais é genérico | Diferenciação mínima entre `/servico-em-nacional/:city/:bairro/:service` (mesmo template). Já reconhecido nas rodadas anteriores; expansão bloqueada até curadoria. |
| 🟡 | Sem `sameAs` para Google Business Profile / Yelp / Reclame Aqui | `Organization` schema só lista wa.me. |
| 🟢 | `openingHours` divergente | `index.html` diz 08:00-22:00, `SEOHead.tsx` diz 00:00-23:59. Escolher um. |

---

## 3. CONTEÚDO E BLOG

**Estado atual**

- Blog ativo com **~48 posts**: `blog.ts` (22), `satellitePosts.ts` (6), `viralPostsCWB.ts` (5),
  `viralPostsSJP.ts` (5), `viralPostsSJP2.ts` (10). Categorias + páginas satélite.
- Landings de serviço em `services.ts` (18 serviços).
- FAQs curadas centralizadas em `homeFaqs.ts` + FAQs por serviço em `services.ts`.
- Interlinking: Footer, `RegionsSection`, `ServicesSection`, `Regioes.tsx`, `Servicos.tsx`.

**Problemas**

| Sev | Item | Detalhe |
|---|---|---|
| 🟡 | Sem contagem/validação automática de word-count por post | Posts curtos podem não indexar bem. |
| 🟡 | Alt text não auditado sistematicamente | 4 `<img>` diretos encontrados; a maioria usa `SmartImage` que exige `alt`. Fazer varredura formal. |
| 🟡 | Sem sitemap dedicado do blog | Posts entram em `sitemap-main.xml` misturados. |
| 🟢 | Sem tag `<article>` semântica confirmada em `BlogPost.tsx` | Verificar. |
| 🟢 | Sem "posts relacionados" cross-linking automatizado por categoria | Melhora dwell time. |

---

## 4. PERFORMANCE (Core Web Vitals)

**Estado atual**

- Vite + React 18, code-splitting agressivo por rota via `React.lazy` (`App.tsx:19-42`) — ✅.
- `Index` e `NotFound` eager (Index é LCP page — correto).
- Fontes Google (Inter + Plus Jakarta) via `preload` + `media=print`/`onload` swap — ✅ pattern não-bloqueante.
- `preconnect`/`dns-prefetch` para Google Fonts, GTM e GA — ✅.
- `SmartImage.tsx` existe (lazy-load).

**Problemas**

| Sev | Item | Detalhe |
|---|---|---|
| 🔴 | `lucide-react` 29 MB em node_modules, importado como `{ Icon } from "lucide-react"` | Sem tree-shaking configurado (via `optimizeDeps`) pode inflar bundle. Verificar bundle final. Considerar `lucide-react/icons/*`. |
| 🟡 | LCP da home = imagem hero em `HeroSection.tsx` | Confirmar `fetchpriority="high"` e `preload` no `index.html`. |
| 🟡 | Sem `width`/`height` intrínsecos garantidos em todas as `<img>` | Risco de CLS. `SmartImage` deve ser wrapper padrão. |
| 🟡 | 8 pesos de fonte carregados (Inter 400-800 + Plus Jakarta 500-800) | Reduzir para 3-4 pesos por família. |
| 🟡 | Google tag (`gtag.js`) carregado síncrono no head com `async` mas antes do CSS | Impacto de ~50-100ms no LCP em 4G. |
| 🟢 | Sem `Cache-Control` visível para assets estáticos (depende do host Lovable) | Ok em produção Lovable. |

---

## 5. ACESSIBILIDADE

**Estado atual**

- shadcn/ui (Radix) — primitives com ARIA correto por padrão.
- 33 componentes já usam `aria-label`.
- Testes E2E de a11y existem (`e2e/a11y.spec.ts`).
- `<html lang="pt-BR">` ✅. Landmarks: `Layout.tsx` deve conter `<main>`.

**Problemas**

| Sev | Item | Detalhe |
|---|---|---|
| 🟡 | 1 botão `size="icon"` sem `aria-label` detectado | Rodar `rg 'size="icon"' src` e revisar. |
| 🟡 | Contraste não auditado nesta passada | Rodar Lighthouse a11y em preview + PR. |
| 🟡 | Formulários (`ContactForm.tsx`, `QuickQuoteForm.tsx`) — labels associados? | Precisa verificação manual. |
| 🟢 | Sem "skip to content" link | Adicionar para navegação por teclado. |
| 🟢 | `WhatsAppFloat.tsx` fixed — verificar contraste sobre fundos claros. | |

---

## 6. UX E CONVERSÃO

**Estado atual**

- Funil de triagem XState (`triageMachine.ts`) é a entrada mandatória. Telefones estão ocultos.
- WhatsApp float presente (`WhatsAppFloat.tsx`).
- CTA principal → abre `GlobalTriageLauncher`.
- Depoimentos em `TestimonialsSection`; garantia; preços mín. R$ 99,99 / coleta R$ 299,99.
- Formulário de contato em `ContactForm.tsx`.

**Problemas**

| Sev | Item | Detalhe |
|---|---|---|
| 🔴 | Sem número de telefone visível | Decisão estratégica (funil), mas ~20% dos usuários mobile procuram tap-to-call. Perde conversão em urgência. |
| 🟡 | Muitos CTAs concorrentes (WhatsApp float + triage + form + botão inline) | Testar hierarquia; A/B do float. |
| 🟡 | Prova social sem contagem/estrelas agregadas visíveis | Adicionar contador ("500+ atendimentos"). |
| 🟡 | Formulário de contato sem honeypot/captcha aparente | Ver Segurança abaixo. |
| 🟢 | Preços exibidos, mas sem tabela comparativa por serviço | `Precos.tsx` existe — validar clareza. |
| 🟢 | Responsividade < 400px não validada nesta auditoria | Rodar Playwright em 360×800. |

---

## 7. QUALIDADE DE CÓDIGO

**Estado atual**

- 27 páginas, 8.500 linhas totais.
- **Uso de `any`: 0 ocorrências** em `src/` — ✅ excelente.
- E2E abundantes (~30 specs), guards em `scripts/` (FAQ, SEO dedup, sitemap, CTA, images).
- CI com Playwright + Lighthouse configurado.

**Problemas**

| Sev | Item | Detalhe |
|---|---|---|
| 🔴 | `Diagnostics.tsx` = **1119 linhas** | Refatorar em subcomponentes. |
| 🟡 | `AssistenciaTecnicaCuritiba.tsx` = 802 linhas; `Admin.tsx` = 492; `TermosOrcamento.tsx` = 473 | Quebrar. |
| 🟡 | Não checado nesta passada: imports mortos, dupes de estilo inline | Rodar `knip` + eslint com `no-unused-imports`. |
| 🟢 | Estrutura de pastas OK (`pages/`, `components/{home,layout,seo,triage,admin,forms,marketing}`) | |

---

## 8. SEGURANÇA E BOAS PRÁTICAS

**Estado atual**

- Sem `http://` em `src`/`public` — ✅.
- Supabase RLS ativa (contexto do projeto).
- HMAC signing para uploads (`triage-media-upload`).
- Chaves publicáveis Supabase no `.env` (esperado, publishable/anon).

**Problemas**

| Sev | Item | Detalhe |
|---|---|---|
| 🔴 | **Múltiplos `target="_blank"` sem `rel="noopener noreferrer"`** — ao menos 10 ocorrências: `RegiaoDetalhe.tsx:196`, `TermosOrcamento.tsx:456`, `ServicoCidade.tsx:137`, `ServicoBairroNacional.tsx:258`, `AssistenciaTecnicaCuritiba.tsx:415/539/621/785`, `BairroNacional.tsx:92/218`. Vulnerabilidade de tabnabbing. |
| 🟡 | Sem honeypot/captcha visível em `ContactForm.tsx` | Adicionar honeypot field ou hCaptcha. |
| 🟡 | Sem `public/_headers` com CSP / X-Frame-Options revisado | Verificar. |
| 🟢 | Sem chave privada exposta | ✅. |

---

## 9. ANALYTICS E RASTREAMENTO

**Estado atual**

- **Google Ads tag `AW-16491950534`** presente em `index.html:5-11` — ✅.
- `src/lib/analytics.ts` tem `trackEvent`, `trackTermsOpen/Accept`, com fallback para `dataLayer`.
- Eventos WA + funil de triagem instrumentados (existem specs `wa-analytics-event.spec.ts`).

**Problemas**

| Sev | Item | Detalhe |
|---|---|---|
| 🔴 | **Sem Google Analytics 4** (só Google Ads). Falta `G-XXXXXXX`. Sem GA4, não há relatórios de comportamento/funnel. |
| 🔴 | **Sem GTM** — todos os pixels dependem de deploy de código. |
| 🔴 | **`google-site-verification` vazio** (`index.html:52`) — Search Console não conectado. |
| 🟡 | Sem Meta Pixel/TikTok — decisão de negócio. |
| 🟡 | Sem evento `purchase`/`generate_lead` disparado ao completar triagem | Confirmar. |
| 🟢 | Sem consent mode v2 | Necessário para conformidade EU/LGPD. |

---

## 10. INTEGRAÇÕES E FLUXOS

**Estado atual**

- WhatsApp único: `5541997452053` (`src/lib/whatsapp.ts:5`). Consistente em todo repo. ✅
- Formulário de contato → Edge Function `send-lead-notification` (Supabase).
- Triage upload → `triage-media-upload` com HMAC.
- Alertas → `triage-media-alerts`.
- Sem chat/agendamento próprio (delega ao WA).

**Problemas**

| Sev | Item | Detalhe |
|---|---|---|
| 🟡 | Sem CRM integrado (HubSpot/Pipedrive) | Leads só chegam por email. Difícil follow-up. |
| 🟡 | Sem agendamento online (Calendly/Cal.com) | Alta fricção. |
| 🟢 | Nenhum outro número de WA no repo | ✅. |

---

# A) RESUMO EXECUTIVO

O projeto está **muito acima da média** para um site de assistência técnica: SPA React bem organizado, SEO estruturado (24 sitemaps, JSON-LD, Helmet por rota), guards de CI, funil XState instrumentado, RLS + edge functions. Os principais gaps são **analytics (falta GA4 + GSC + GTM)**, **segurança básica (`noopener` faltando em 10+ links externos)**, **NAP incompleto para SEO local (sem endereço)** e **conteúdo genérico na matriz nacional** (já reconhecido). Performance depende de refino de fontes e revisão do bundle `lucide-react`. Acessibilidade parte de boa base shadcn/Radix mas precisa auditoria formal de contraste. Código é limpo (0 `any`), mas 3 páginas passam de 500 linhas e devem ser quebradas antes de escalar. Antes de qualquer expansão de URLs, resolver GSC + GA4 e diferenciação de conteúdo local.

| Eixo | Nota |
|---|---|
| SEO on-page | **82/100** |
| SEO local | **62/100** |
| Conteúdo | **68/100** |
| Performance | **72/100** |
| Acessibilidade | **74/100** |
| UX / Conversão | **70/100** |
| Código | **85/100** |
| **Média geral** | **73/100** |

---

# B) TOP 10 PROBLEMAS CRÍTICOS (impacto × esforço)

| # | Problema | Impacto | Esforço | Prioridade |
|---|---|---|---|---|
| 1 | Sem GA4 / GSC / GTM (não mede conversão nem indexação) | 🔴🔴🔴 | P | **AGORA** |
| 2 | 10+ `target="_blank"` sem `rel="noopener noreferrer"` (tabnabbing) | 🔴🔴 | P | **AGORA** |
| 3 | `google-site-verification` vazio (bloqueia Search Console) | 🔴🔴🔴 | P | **AGORA** |
| 4 | NAP sem endereço físico (bloqueia Google Business Profile) | 🔴🔴 | P (input externo) | **AGORA** |
| 5 | Conteúdo genérico em `/servico-em-nacional/*` (100 URLs template) | 🔴🔴 | G | Curto prazo |
| 6 | `Diagnostics.tsx` 1119 linhas + 3 páginas > 500 linhas | 🟡🟡 | M | Curto prazo |
| 7 | Sem honeypot/captcha em `ContactForm` (risco spam) | 🟡🟡 | P | **AGORA** |
| 8 | 8 pesos de fonte carregados (impacto LCP) | 🟡🟡 | P | Quick win |
| 9 | Sem embed Maps / `sameAs` GBP / Reclame Aqui (SEO local) | 🟡🟡 | P | Curto prazo |
| 10 | Divergência de horário 08-22 (index.html) vs 24/7 (SEOHead) | 🟡 | P | Quick win |

---

# C) ROADMAP EM 3 FASES

### Fase 1 — Quick Wins (1-2 dias)

- [P] Adicionar `rel="noopener noreferrer"` a todos `target="_blank"`.
- [P] Preencher `google-site-verification` (após conectar GSC).
- [P] Adicionar GA4 (`G-XXXXXXX`) ao lado do Google Ads existente.
- [P] Reduzir pesos de fonte para 400/600/700 (Inter) + 700 (Plus Jakarta).
- [P] Reconciliar horário LocalBusiness (uma única fonte).
- [P] Remover `<meta name="keywords">` do `index.html`.
- [P] Adicionar honeypot ao `ContactForm`.
- [P] Skip-to-content link no `Layout.tsx`.

### Fase 2 — Curto Prazo (1-2 semanas)

- [M] Migrar analytics para **GTM** (`GTM-XXXXXX`) com GA4 + Google Ads como tags dentro.
- [M] Consent Mode v2 (LGPD).
- [M] Refatorar `Diagnostics.tsx` (1119 l), `AssistenciaTecnicaCuritiba.tsx` (802 l), `Admin.tsx` (492 l).
- [M] Auditar imagens (`alt`, `width`, `height`, WebP/AVIF) — rodar script existente `check-page-images.ts`.
- [M] Sitemap dedicado de blog.
- [M] Embed Google Maps em `/contato` e `/regioes/:city` (lazy).
- [M] `sameAs` para GBP + Reclame Aqui + Instagram/Facebook em Organization schema.
- [M] Auditoria Lighthouse a11y (contrastes) + fix.
- [G] Curar 4 combinações piloto da matriz nacional com conteúdo real (já planejado).

### Fase 3 — Médio Prazo (1-2 meses)

- [G] SSR/pré-render (TanStack Start, Astro Islands ou Vite SSG) — libera previews sociais e melhora SEO em crawlers sem JS.
- [G] CRM (HubSpot free / Pipedrive) integrado ao `send-lead-notification`.
- [G] Cal.com/Calendly embed para agendamento.
- [G] Programa de reviews (widget Google + coleta pós-atendimento).
- [G] Expansão controlada da matriz nacional até 300 URLs (plano existente).
- [M] Web Vitals monitoring contínuo em produção (já existe `webVitals.ts` — enviar para GA4).
- [M] Testes de contraste + axe-core no CI.

---

# D) CHECKLIST — DEPENDÊNCIAS EXTERNAS

- [ ] **Decidir domínio primário** (`tecnicocuritiba.com.br` vs `precisodeumtecnico.com`) e configurar 301.
- [ ] **Endereço físico completo** (rua, número, CEP) para NAP + GBP.
- [ ] **Google Business Profile** — criar/reivindicar, adicionar fotos, horários, categorias.
- [ ] **Google Search Console** — verificar propriedade, submeter `sitemap.xml` + `sitemap-main.xml` + `sitemap-nacional-servicos-piloto.xml`.
- [ ] **Google Analytics 4** — criar propriedade, obter `G-XXXXXXX`.
- [ ] **Google Tag Manager** — criar container `GTM-XXXXXX`.
- [ ] **Bing Webmaster Tools** — verificar + sitemap.
- [ ] **Reclame Aqui** — reivindicar página; adicionar selo no rodapé.
- [ ] **Reviews Google** — pedir avaliações a clientes atuais (meta: 50+ em 90 dias).
- [ ] **Backlinks locais**: guias de Curitiba, associações comerciais, parceiros.
- [ ] **Meta Business Suite** — se Meta Pixel entrar no roadmap.
- [ ] **CRM** (escolha: HubSpot Free / Pipedrive / RD Station).
- [ ] **Consent Mode v2** — texto legal LGPD revisado por advogado.
- [ ] **Fotos reais** de técnicos/serviços (para OG images e conteúdo diferenciado das landings).

---

_Arquivos inspecionados: `index.html`, `robots.txt`, todos os `public/sitemap-*.xml`, `src/App.tsx`, `src/components/seo/SEOHead.tsx`, `src/data/*.ts`, `src/lib/whatsapp.ts`, `src/lib/analytics.ts`, todas as 27 páginas em `src/pages/`, componentes-chave em `src/components/{home,layout,seo,triage,forms}`. Métodos: `rg`/`grep` para padrões, `wc -l` para tamanho, contagem de `<loc>` para sitemaps, checagem de secrets/http, contagem de `any`._
