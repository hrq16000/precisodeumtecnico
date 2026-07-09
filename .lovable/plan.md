# Plano de Melhorias — Execução por Etapas

Cada etapa é isolada, sem regressão. Execução sequencial.

## Etapa 1 — Localização inteligente (5s + endereço completo)

- Novo hook `useSmartLocation` (envolve `useUserRegion`):
  - Após **5s** de navegação, abre modal solicitando **endereço completo** (rua, número, complemento, bairro, cidade, UF), já pré-preenchido com cidade/bairro do IP.
  - Se o usuário permitir, usa `navigator.geolocation` para reverse-geocode (via `ipwho.is` fallback / Nominatim OSM) e sugerir bairro/rua.
  - Se negar, mantém cidade/bairro do IP.
  - Persiste em `localStorage` (`user_location_full_v1`).
- Novo helper `buildWhatsAppMessage({ service, city, address })` — usado por **todos** os CTAs WhatsApp (`GlobalTriageLauncher`, `WhatsAppFloat`) para injetar localização na mensagem inicial.
- Mensagem por tipo de serviço + cidade (ex.: "Olá! Preciso de assistência técnica em [notebook] — [Bairro, Cidade, UF]. Endereço: [rua, nº]").

## Etapa 2 — Correção crítica do TriageWizard (mobile-first)

- Bug: quiz reabrindo no passo final. Causa: estado persistido em `sessionStorage` sem reset. Fix:
  - `openTriage()` sempre chama `machine.reset()` antes de exibir.
  - `TriageWizard`: `useEffect` no `open` → scroll para topo do modal + autoFocus no primeiro input da questão atual.
- Mobile-first refinado:
  - `Dialog` em tela cheia no mobile (`h-[100dvh]`, `max-w-full`, `rounded-none sm:rounded-lg`).
  - Cada questão em `overflow-y-auto` com `scroll-margin-top`, sem overflow horizontal.
  - Auto-scroll suave para o campo ativo (`scrollIntoView({ behavior: "smooth", block: "center" })`).
  - Animações leves: `fade + slide-up` por questão via `data-state` + Tailwind transitions.
  - Botões sticky no rodapé em mobile (`sticky bottom-0`), sem cobrir input.

## Etapa 3 — Imagens: AVIF/WebP + srcset + lazy + cache

- Instalar `vite-imagetools`.
- Componente `<SmartImage>` que emite `<picture>` com `<source type="image/avif">`, `<source type="image/webp">`, fallback JPG/PNG, `loading="lazy"`, `decoding="async"`, `sizes` responsivo.
- Substituir imagens críticas (Hero, cidade/bairro, blog) por `SmartImage`.
- `public/_headers`: cache-control agressivo (`immutable, max-age=31536000`) para `/assets/*`, `/og-preview/*`, `/images/*`.
- Script `scripts/build-city-images.py` já gera responsivos — adicionar geração AVIF.

## Etapa 4 — SEO estruturado consistente

- `SEOHead` já injeta Organization/LocalBusiness. Adicionar:
  - Prop `breadcrumbs?: {name, url}[]` → emite `BreadcrumbList` schema.
  - Prop `service?: {name, price, area}` → emite `Service` + `Offer`.
  - Padronizar `og:title` = `<title>`, `og:description` = `<meta description>`, `og:image` global (`/og-preview/index.html` → imagem gerada), `og:url` = canonical.
- Aplicar em `ServicoDetalhe`, `ServicoCidade`, `RegiaoDetalhe`, `BairroDetalhe`, `CidadeNacional`.

## Etapa 5 — Sitemap/robots automáticos

- Já existe `scripts/build-sitemap.ts` + `predev`/`prebuild`. Adicionar:
  - `postinstall` que roda o script (garante freshness em CI).
  - `robots.txt` valida `Sitemap: https://precisodeumtecnico.com/sitemap.xml`.
  - Log de auditoria: `scripts/validate-sitemap.ts` já existe — adicionar ao `prebuild`.

## Etapa 6 — WhatsApp: consistência + tracking + mensagens personalizadas

- Botão WhatsApp: mesmo texto ("Falar com técnico"), mesma posição (float bottom-right em todo site).
- Remover **todos** os `tel:` remanescentes (audit via `rg 'tel:'`).
- Tracking `analytics.track('whatsapp_click', { page, service, city })` em cada clique.
- Mensagem inicial personalizada por rota (usa `buildWhatsAppMessage`).

## Etapa 7 — Validação global dos pisos R$ 99,99 / R$ 299,99

- Já validado no backend (trigger). Reforçar frontend:
  - `TriageWizard.handleSubmit` já valida — adicionar teste unit.
  - Piso de **visita** é por bloco de 30min até 2h: ajustar copy em `pricingPolicy.ts` (`"R$ 99,99 por bloco de até 30 min, limitado a 2h"`).
- E2E `triage-funnel.spec.ts`: adicionar caso "não abre 2 quizzes ao clicar em CTAs consecutivos".

## Etapa 8 — FAQ + CNPJ + Dados da Empresa

- Nova página `/faq` (`src/pages/Faq.tsx`) com 15+ Q&A (serviços, garantia, prazos, agendamento WhatsApp), `FAQPage` JSON-LD.
- Nova página `/dados-da-empresa` (`src/pages/DadosEmpresa.tsx`): CNPJ `41.723.708/0001-58`, atendimento desde 1998, endereço, responsáveis.
- Atualizar `Contato.tsx` e `Sobre.tsx` com CNPJ + "atendendo desde 1998".
- `Footer.tsx`: adicionar links "FAQ" e "Dados da Empresa".
- `SEOHead` Organization schema: `taxID: "41.723.708/0001-58"`, `foundingDate: "1998"`.
- Adicionar rotas em `App.tsx` + sitemap.

## Etapa 9 — Testes E2E adicionais

- `e2e/sitemap-robots.spec.ts`: valida 200, `Sitemap:` em robots, canonical presente após navegação SPA.
- `e2e/seo-persistence.spec.ts`: H1 único, H2 presente, canonical estável em navegação client-side.

## Detalhes técnicos

- Sem quebra: todos os componentes novos são opt-in; edits em componentes existentes preservam props atuais.
- Sem backend novo (exceto reforço da trigger existente já feita).
- Sem novos secrets.
- Typecheck e build rodam automaticamente após cada etapa.

## Ordem de execução

1. Etapa 2 (bug crítico do quiz) — **primeiro**.
2. Etapa 1 (localização) → depende de mensagem WhatsApp comum → integra com Etapa 6.
3. Etapa 8 (FAQ + Dados) — rápido, alto valor SEO.
4. Etapa 4 + 5 (SEO/sitemap).
5. Etapa 3 (imagens) — maior risco visual, isolada.
6. Etapa 6 (WhatsApp consistência + tracking).
7. Etapa 7 + 9 (validação + testes).

@Modo agente — Prompt complementar de alinhamento e blindagem do plano

&nbsp;

Antes de executar o plano proposto, aplique as observações abaixo como camada complementar obrigatória. O objetivo é evoluir o portal Preciso de um Técnico com SEO, conversão, localização, WhatsApp, imagens e quiz mobile-first, sem duplicar lógica existente, sem criar conflito de valores e sem regressão.

&nbsp;

IMPORTANTE:

&nbsp;

- Não interpretar “ignore regressão” como autorização para quebrar o que funciona.

- Interprete como: prossiga com melhorias, mas rode validações e corrija regressões detectadas.

- Toda etapa deve preservar rotas, CTAs, funil, WhatsApp, SEO e build atual.

- Antes de criar arquivo novo, audite se já existe helper, hook, constante, schema, componente ou teste equivalente.

- Não criar duplicidade de fonte de verdade.

- Não inventar endereço, ano histórico, responsáveis ou dados institucionais que não estejam confirmados.

&nbsp;

1. Etapa 0 — Auditoria curta antes de codar

&nbsp;

Antes da Etapa 1, faça uma auditoria read-only rápida e liste:

&nbsp;

- Onde hoje ficam os valores de visita, diagnóstico, bancada, coleta e entrega.

- Todos os lugares onde aparecem R$ 90, R$ 99, R$ 99,99, R$ 299,99, R$ 300 ou variações.

- Todos os CTAs de WhatsApp.

- Todos os links "tel:".

- Todos os pontos que montam mensagem de WhatsApp.

- Onde o quiz persiste estado.

- Onde imagens são renderizadas diretamente via "<img>".

- Onde SEOHead/schema/canonical/OG/sitemap são gerados.

- Quais páginas já têm FAQ, contato, sobre, institucional ou dados da empresa.

&nbsp;

Depois disso, execute alterações somente nos pontos necessários.

&nbsp;

2. Corrigir conflito de valores antes de qualquer copy

&nbsp;

O novo piso oficial deve ser:

&nbsp;

- Visita técnica: R$ 99,99 por bloco de até 30 minutos.

- Limite de visita no endereço: até 2 horas, salvo aprovação específica.

- Diagnóstico/bancada/superficial/sem compromisso: mínimo R$ 99,99.

- Coleta e entrega / atendimento personalizado com triagem completa: a partir de R$ 299,99.

- Parcelamento: até 12x sem juros, quando aplicável.

- Prazos: mínimo 72 horas úteis, podendo chegar a até 3 semanas conforme equipamento, fila, peça, logística, complexidade ou parceiro.

&nbsp;

Atenção:

&nbsp;

- O plano anterior ainda citava bancada/diagnóstico R$ 90,00. Isso deve ser substituído globalmente se estiver em conflito com o piso oficial.

- Se houver “taxa de desistência” antiga de R$ 90,00, não manter sem validação. O padrão oficial agora é R$ 99,99.

- Criar uma única fonte canônica, preferencialmente "pricingPolicy.ts", e importar dela.

- Não deixar valores hardcoded espalhados em páginas, componentes, schema, FAQ, quiz ou WhatsApp.

&nbsp;

3. Resolver conflito de “desde 1998” versus “desde 2006”

&nbsp;

Existe conflito entre:

&nbsp;

- “atendimento desde 1998”

- “histórico desde 2006”

&nbsp;

Não publicar os dois como fatos diferentes.

&nbsp;

Criar uma fonte única institucional, por exemplo "companyPolicy.ts" ou "companyInfo.ts", com:

&nbsp;

- CNPJ: 41.723.708/0001-58

- Frase pública preferencial: “mais de 25 anos de experiência”

- Ano canônico somente se confirmado.

&nbsp;

Se for usar 1998:

&nbsp;

- Usar “atendimento desde 1998” em Contato, Sobre, Dados da Empresa e Organization schema.

&nbsp;

Se houver dúvida:

&nbsp;

- Não inventar.

- Usar “mais de 25 anos de experiência” até confirmação.

&nbsp;

4. Localização inteligente com LGPD e sem atrito

&nbsp;

A localização deve ajudar a conversão, não bloquear o usuário.

&nbsp;

Implementar assim:

&nbsp;

- Após 5 segundos de navegação, exibir um modal leve, não agressivo, solicitando confirmação de cidade/bairro e oferecendo complemento de endereço.

- Não abrir esse modal em páginas admin, durante o quiz aberto, durante carregamento crítico, ou repetidamente na mesma sessão.

- Não solicitar permissão GPS automaticamente. Primeiro mostrar botão claro: “Usar minha localização”.

- Se o usuário aceitar GPS, usar "navigator.geolocation".

- Se negar GPS, manter cidade/bairro aproximados por IP ou fallback já existente.

- Se negar endereço completo, não insistir. Persistir apenas cidade/bairro aproximados.

- Permitir edição manual de cidade, bairro, rua, número e complemento.

- Persistir em localStorage com versão e timestamp, exemplo: "user_location_full_v1".

- Prever botão “alterar localização” no quiz ou próximo ao CTA WhatsApp.

- Não enviar endereço completo para analytics.

- Não gravar endereço completo no backend antes de consentimento/lead/triagem.

- Não expor endereço completo em OpenGraph, Facebook preview, URL pública, sitemap ou metadados.

&nbsp;

Mensagem de WhatsApp deve incluir localização conforme disponibilidade:

&nbsp;

Com endereço completo:

“Olá! Preciso de assistência técnica em [serviço]. Local: [rua, número, bairro, cidade/UF]. Página: [URL da rota].”

&nbsp;

Sem endereço completo:

“Olá! Preciso de assistência técnica em [serviço]. Região aproximada: [bairro, cidade/UF]. Página: [URL da rota].”

&nbsp;

Sem localização:

“Olá! Preciso de assistência técnica em [serviço]. Vim pela página: [URL da rota].”

&nbsp;

5. Cuidado com geocoding externo

&nbsp;

Não chamar Nominatim/OSM diretamente em massa no client se isso gerar risco de limite, bloqueio ou exposição indevida.

&nbsp;

Preferência:

&nbsp;

- Usar provider já existente no projeto.

- Se não houver provider confiável, manter apenas IP/cidade/bairro e entrada manual.

- Se reverse geocode for realmente necessário, criar abstração para trocar provider depois.

- Não adicionar secret no frontend.

- Não criar dependência frágil para etapa de conversão.

&nbsp;

6. Quiz mobile-first — corrigir bug sem destruir experiência

&nbsp;

O problema informado:

&nbsp;

- Quiz às vezes abre no final ou fora do ponto correto.

- Usuário precisa voltar manualmente.

- Em mobile, o foco/scroll deve ir para a pergunta atual.

&nbsp;

Implementação esperada:

&nbsp;

- Criar controle explícito de abertura do quiz:

  - CTA novo deve abrir no início.

  - Reabertura dentro da mesma sessão só deve continuar se for intenção clara de continuar.

  - Estado persistido antigo não pode forçar abertura no último passo.

- Criar função única: "openTriage({ reset: true, source, service, city })".

- Ao abrir por CTA, usar "reset: true" por padrão.

- Ao voltar dentro do wizard, manter navegação interna normal.

- Ao fechar e clicar novamente em CTA principal, abrir do começo, salvo se houver botão específico “continuar atendimento”.

- Implementar guard global para impedir dois quizzes simultâneos.

- Testar cliques rápidos em múltiplos CTAs.

&nbsp;

UX mobile:

&nbsp;

- Modal full-screen em mobile com "100dvh".

- Respeitar safe-area de iPhone/Android.

- Sem overflow horizontal.

- Rodapé com botões sticky sem cobrir input.

- Campo atual deve receber foco com suavidade.

- Scroll automático com "scrollIntoView", mas sem saltos bruscos.

- Foco acessível: focus trap, ESC/voltar, labels, aria.

- Evitar autoFocus agressivo que cause zoom indesejado no iOS.

- Inputs com "inputMode" correto para telefone, CEP, número e texto.

- Animações leves somente se não afetarem performance.

&nbsp;

7. WhatsApp: helper único e rastreável

&nbsp;

Criar ou consolidar um único helper:

&nbsp;

"buildWhatsAppMessage({ service, city, neighborhood, address, sourcePage, utm, pricePolicy })"

&nbsp;

Regras:

&nbsp;

- Usar "encodeURIComponent".

- Incluir serviço, cidade/bairro e endereço quando disponível.

- Incluir rota/página de origem.

- Incluir texto personalizado por serviço.

- Não duplicar mensagem entre componentes.

- Todos os CTAs devem usar o mesmo helper.

- Todos os cliques devem passar por um handler único de tracking.

&nbsp;

Evento sugerido:

"whatsapp_click"

&nbsp;

Parâmetros:

&nbsp;

- page

- pathname

- service

- city

- neighborhood

- has_full_address

- source_component

- cta_label

&nbsp;

Não enviar:

&nbsp;

- rua

- número

- complemento

- dados pessoais

- telefone digitado

- conteúdo completo da mensagem

&nbsp;

8. Padronizar CTA de WhatsApp sem apagar contexto

&nbsp;

Texto padrão recomendado:

&nbsp;

- Primário: “Falar com técnico”

- Alternativo contextual: “Agendar pelo WhatsApp”

- Em páginas de serviço: “Falar com técnico sobre [serviço]”

&nbsp;

Regras:

&nbsp;

- Mesma posição do botão flutuante.

- Mesmo estilo visual.

- Mesmo tracking.

- Mesmo helper de mensagem.

- Não criar vários floats na mesma página.

- Remover "tel:" remanescente, mas manter telefone exibido como texto quando útil.

- Links patrocinados, externos ou de parceiros não devem ser confundidos com CTA oficial.

&nbsp;

9. Imagens AVIF/WebP com segurança de cache

&nbsp;

Implementar "SmartImage", mas com cuidado:

&nbsp;

- Não aplicar cache immutable em URLs sem hash/versionamento.

- Para assets com hash do build: "max-age=31536000, immutable".

- Para "/images/*" com nomes estáveis: usar cache forte com ETag ou cache menor, a menos que gere nomes versionados.

- Não quebrar imagens remotas/dinâmicas vindas de CMS/Supabase.

- Preservar "alt".

- Garantir "width" e "height" ou aspect-ratio para reduzir CLS.

- Hero/LCP não deve usar lazy.

- Imagens abaixo da dobra devem usar lazy.

- Usar "srcset" e "sizes".

- Gerar thumbnails para páginas longas de SEO.

- Validar visual em mobile e desktop.

&nbsp;

Prioridade:

&nbsp;

1. Hero e imagens acima da dobra.

&nbsp;

2. Páginas de serviço/cidade/bairro.

&nbsp;

3. Blog/FAQ/institucional.

&nbsp;

4. Imagens decorativas.

&nbsp;

5. SEO estruturado sem spam e sem dados falsos

&nbsp;

Aplicar schema.org consistente, mas sem inflar artificialmente.

&nbsp;

Obrigatório:

&nbsp;

- Organization/LocalBusiness com CNPJ/taxID se fonte canônica confirmar.

- "name", "url", "telephone", "areaServed", "priceRange".

- "foundingDate" somente se o ano canônico estiver confirmado.

- Service schema nas páginas de serviço.

- Offer/price quando houver preço mínimo real.

- BreadcrumbList em todas as páginas profundas.

- FAQPage somente quando as perguntas e respostas estiverem visíveis na página.

- OpenGraph consistente com canonical.

&nbsp;

Não fazer:

&nbsp;

- Não inventar reviews.

- Não criar AggregateRating falso.

- Não repetir cidade/bairro em blocos artificiais.

- Não criar páginas finas só para manipular SEO.

- Não expor endereço do cliente em OG/meta/schema.

- Não misturar endereço da empresa com localização do visitante.

&nbsp;

11. Sitemap e robots

&nbsp;

Não depender de "postinstall" como única garantia de sitemap atualizado.

&nbsp;

Preferência:

&nbsp;

- Gerar sitemap no "prebuild".

- Validar no "prebuild".

- Se conteúdo vem de base dinâmica, considerar rota dinâmica ou script de build que busca os dados.

- Garantir que "robots.txt" aponte para o domínio correto:

  "https://precisodeumtecnico.com.br/sitemap.xml"

  ou o domínio oficial confirmado do projeto.

- Validar canonical absoluto.

- Incluir FAQ e Dados da Empresa no sitemap.

- Não indexar páginas internas, admin, testes, QA ou rotas utilitárias.

&nbsp;

12. FAQ e Dados da Empresa

&nbsp;

Criar "/faq" com perguntas úteis e comerciais:

&nbsp;

- Como funciona o atendimento?

- Como enviar fotos e vídeos?

- Por que precisa de triagem?

- Qual o valor mínimo da visita?

- Qual o valor mínimo de diagnóstico?

- Qual o prazo mínimo?

- Quando pode levar até 3 semanas?

- O que está incluso na coleta e entrega?

- O que é atendimento pré-aprovado?

- Atendem notebook, PC, impressora, monitor, eletrônicos?

- Fazem recuperação de dados?

- Atendem empresas?

- Tem garantia?

- Aceitam 12x sem juros?

- Como agendar pelo WhatsApp?

- O que muda quando o atendimento é por parceiro?

&nbsp;

Criar "/dados-da-empresa" com:

&nbsp;

- CNPJ.

- Nome empresarial/marca, se já existir confirmado.

- Histórico institucional.

- Região de atendimento.

- Responsáveis somente se já estiverem confirmados.

- Endereço somente se for endereço público oficial.

- Link para termos, privacidade e FAQ.

&nbsp;

Adicionar links no rodapé:

&nbsp;

- FAQ

- Dados da Empresa

- Termos e Condições

- Política de Privacidade

&nbsp;

13. Privacidade e termos

&nbsp;

Atualizar Política de Privacidade e Termos para explicar:

&nbsp;

- Uso de localização aproximada por IP/GPS.

- Finalidade: facilitar orçamento, triagem e envio para WhatsApp.

- Possibilidade de negar localização.

- Armazenamento local no navegador.

- Envio de endereço completo apenas quando informado pelo usuário.

- Compartilhamento com parceiros somente quando necessário para atendimento.

- Parceiros podem ter condições, prazos e valores próprios.

- A central não se responsabiliza por negociação direta fora da triagem oficial.

&nbsp;

14. Testes obrigatórios

&nbsp;

Adicionar testes mínimos:

&nbsp;

Quiz:

&nbsp;

- CTA abre quiz no primeiro passo.

- Clique duplo em CTA não abre dois quizzes.

- Fechar e reabrir CTA principal não abre no final.

- Mobile não tem overflow horizontal.

- Campo atual recebe foco.

- Botão sticky não cobre input.

&nbsp;

WhatsApp:

&nbsp;

- Link contém serviço.

- Link contém cidade/bairro quando disponível.

- Link contém endereço quando informado.

- Link não contém endereço quando negado.

- Tracking é disparado uma única vez por clique.

&nbsp;

Preços:

&nbsp;

- Não existe R$ 90,00 remanescente em copy pública, schema ou quiz.

- Visita exibe R$ 99,99 por bloco de até 30 min.

- Coleta/entrega exibe a partir de R$ 299,99.

- Até 12x sem juros aparece onde fizer sentido.

&nbsp;

SEO:

&nbsp;

- robots retorna 200.

- sitemap retorna 200.

- canonical persiste após navegação SPA.

- H1 único.

- H2 presente em páginas de serviço.

- Breadcrumb schema válido.

- FAQ schema só existe quando FAQ está visível.

&nbsp;

Imagens:

&nbsp;

- Hero não usa lazy.

- Imagens abaixo da dobra usam lazy.

- Imagens têm alt.

- Imagens têm width/height ou aspect-ratio.

- Não há quebra visual em mobile.

&nbsp;

15. Ordem recomendada ajustada

&nbsp;

Executar nesta ordem:

&nbsp;

1. Etapa 0 — auditoria curta e mapa de pontos existentes.

&nbsp;

2. Bug crítico do quiz + teste de não duplicidade.

&nbsp;

3. Fonte única de preços + remoção de divergências R$ 90/R$ 99/R$ 299.

&nbsp;

4. Helper único de WhatsApp + tracking + remoção de tel.

&nbsp;

5. Localização inteligente com LGPD, persistência local e mensagem WhatsApp.

&nbsp;

6. FAQ + Dados da Empresa + links no rodapé.

&nbsp;

7. SEOHead/schema/canonical/OG/breadcrumbs.

&nbsp;

8. Sitemap/robots/prebuild/validação.

&nbsp;

9. SmartImage + AVIF/WebP/srcset/cache responsivo.

&nbsp;

10. Testes E2E finais + typecheck + build.

&nbsp;

11. Critério de aceite final

&nbsp;

Ao final, entregar relatório com:

&nbsp;

- Arquivos alterados.

- Valores encontrados antes/depois.

- CTAs WhatsApp padronizados.

- Links "tel:" removidos.

- Rotas novas criadas.

- Schemas aplicados.

- Testes criados.

- Resultado de typecheck/build/E2E.

- Pendências ou riscos, se houver.

&nbsp;

Não avance criando funcionalidades paralelas se já existir solução compatível no projeto. Consolidar, padronizar e melhorar.