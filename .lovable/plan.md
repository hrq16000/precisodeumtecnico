
# Reestruturação do Funil de Triagem — Rodada 26

## Diagnóstico atual (análise dos arquivos)

- **`src/components/triage/triageMachine.ts`** — FSM linear (`category → device → symptom → branch → contact → accept → submitting`). Só 6 categorias (falta Surface, Tablet, Outro), passos fixos, sem perguntas contextuais por sintoma, sem cálculo de modalidade explicado, sem "resetDependentAnswers", sem versionamento de estado.
- **`src/components/triage/TriageWizard.tsx`** (682 linhas) — JSX gigante com muita lógica condicional espalhada, aceites genéricos, sem foco automático progressivo, avanço via botão único.
- **`src/data/symptoms.ts`** — tem `ServiceMode` mas não separa remoto/visita/coleta com as regras finais da rodada 26.
- **`src/lib/whatsapp.ts`** — monta mensagem simples; falta o formato humano completo pedido.
- **`GlobalTriageLauncher.tsx`** — abre dialog; ok, mas WhatsAppFloat precisa ficar atrás do overlay.
- **Causa raiz da tela de erro relatada**: `SET_SYMPTOM` sobrescreve `symptomSlug` sem revalidar dependentes; ao trocar `category` depois, `getSymptom` continua com slug incompatível → `sym.triage.mode` retorna algo incoerente → `nextOf`/`canAdvance` divergem → botão "Continuar" tenta ir para `branch` mas `sym` já não pertence à categoria → renderização de `branch` acessa `sym.triage.mediaRequired` de um sintoma removido. Também há avanço duplo possível (botão + Enter). Não há Error Boundary específico.

## Nova arquitetura (dados-primeiro)

### 1. Configuração central `src/data/triage/config.ts`
Objeto único com:
- `EQUIPMENTS` (7 itens: PC/Notebook, TV, Celular/Tablet, Surface, Som/Receiver/Áudio, Videogame, Outro)
- `PRICING` (visita R$ 99,99/30min, coleta R$ 299,99, cancelamento R$ 99,99, faixas de referência TV/Som/Videogame/Celular)
- `SLA` (3–60 dias úteis, aviso >60)
- `TERMS_VERSION`, `COMPANY_NAME`, `WHATSAPP_ENV_KEY` (documentado onde alterar)

### 2. Catálogo `src/data/triage/questions.ts`
Perguntas contextuais por equipamento e por sintoma, seguindo literalmente as rotas do briefing (PC, TV, Celular/Tablet, Surface, Som, Videogame, Outro), incluindo perguntas condicionais (molhou → "quando aconteceu", "tentou ligar", etc.).

### 3. Motor `src/lib/triage/engine.ts` (puro, testável)
Funções sem React:
```
getQuestionsForEquipment(eq)
getQuestionsForSymptom(eq, symptom)
determineServiceRoute(state) → 'remoto' | 'visita' | 'coleta'
getPricingRules(route, equipment, symptom)
validateCurrentStep(state)
getFirstIncompleteField(state)
buildTriageSummary(state)
buildWhatsAppMessage(state)
resetDependentAnswers(state, changedField)
```
Regras exatas do briefing para `determineServiceRoute` (remoto só se PC/Notebook ligando + intenção software; visita só PC/Notebook em serviços leves; tudo o mais → coleta).

### 4. FSM `src/components/triage/triageMachine.ts` reescrita
Estados: `equipment → deviceDetails → symptom → contextualAnswers → serviceRoute → termsAccepted → review`. Cada `SET_*` chama `resetDependentAnswers`. Migração: `TRIAGE_STATE_VERSION = 2`; estado antigo em localStorage é descartado.

### 5. UI `TriageWizard.tsx` refatorado em componentes menores
- `TriageModal` (Radix Dialog, `max-h-[100dvh]`, header/footer fixos, scroll interno, focus trap nativo do Radix).
- `StepEquipment`, `StepDeviceDetails`, `StepSymptom`, `StepContextual`, `StepServiceRoute`, `StepTerms`, `StepReview`.
- Auto-advance com trava `isTransitioning` (350–600ms), respeitando `prefers-reduced-motion`.
- Foco progressivo via `getFirstIncompleteField`.
- Pulse no ProgressBar ao completar etapa.

### 6. Error Boundary `TriageErrorBoundary`
Envolve o wizard, oferece "Reiniciar triagem" e preserva estado quando possível.

### 7. WhatsApp
- Botão final renomeado para **"Agendar agora"**.
- `buildWhatsAppMessage` gera texto humano (não JSON), pulando campos vazios.
- Fallback: se `window.open` bloquear, mostra sheet com mensagem copiável e link `wa.me`.
- `WhatsAppFloat` e CTAs flutuantes recebem `data-triage-open` para ficarem `pointer-events:none` e `z-index` menor enquanto modal aberto (via CSS `body[data-triage-open="true"]`).

### 8. Textos e conteúdo
- Remover "Outro / Só orçamento" → "Outro".
- Remover "Hoje" → "Próximas 72 horas úteis — até 3 dias úteis".
- Aceites separados por modalidade (coleta tem 3 checkboxes distintos: valor mínimo, cancelamento R$ 99,99, prazo).
- Nenhum checkbox pré-marcado.
- Texto contextual calculado por rota (nunca "remoto ou visita" genérico).

## Testes

- **Unitários** (Vitest) `src/lib/triage/engine.test.ts` — cobre os 22 cenários listados no briefing.
- **E2E** novo `e2e/triage-funnel-v2.spec.ts` cobrindo: PC funcionando+software→remoto; PC não liga→coleta; TV tela quebrada→coleta+display; Celular molhou→perguntas condicionais; Surface→coleta; troca de equipamento no meio→limpa dependentes; aceite não marcado→WhatsApp bloqueado; teclado mobile→campo visível.
- **Ajuste** dos E2E existentes (`triage-funnel.spec.ts`, `triage-handoff-origins.spec.ts`, `triage-whatsapp-flow.spec.ts`) para o novo contrato — sem remover cobertura.

## Preservação explícita

- Nenhuma alteração em rotas, SEO, sitemap, blog, `SEOHead`, analytics local, Google Ads, componentes institucionais, número WhatsApp (lido de env como hoje).
- Identidade visual mantida (tokens semânticos, mesmas cores primárias).
- `GlobalTriageLauncher` continua sendo o único ponto de abertura (já reforçado na rodada 25.1).

## Arquivos a criar

- `src/data/triage/config.ts`
- `src/data/triage/questions.ts`
- `src/lib/triage/engine.ts` (+ `.test.ts`)
- `src/lib/triage/state.ts` (versionamento + migração)
- `src/components/triage/TriageErrorBoundary.tsx`
- `src/components/triage/steps/StepEquipment.tsx`
- `src/components/triage/steps/StepDeviceDetails.tsx`
- `src/components/triage/steps/StepSymptom.tsx`
- `src/components/triage/steps/StepContextual.tsx`
- `src/components/triage/steps/StepServiceRoute.tsx`
- `src/components/triage/steps/StepTerms.tsx`
- `src/components/triage/steps/StepReview.tsx`
- `src/components/triage/ProgressBar.tsx`
- `e2e/triage-funnel-v2.spec.ts`

## Arquivos a alterar

- `src/components/triage/TriageWizard.tsx` — orquestrador enxuto (~250 linhas).
- `src/components/triage/triageMachine.ts` — reducer novo, `Step` estendido, `RESET_DEPENDENT`.
- `src/lib/whatsapp.ts` — novo `buildTriageWhatsAppMessage`.
- `src/index.css` — regras `body[data-triage-open]` para esconder floats.
- `src/components/layout/WhatsAppFloat.tsx` — respeita atributo.
- E2E existentes de triagem — sincronizar com o novo contrato.

## Estimativa e escopo

Trabalho grande (~1500 LOC líquidos, ~15 arquivos novos, ~6 alterados). Não altera nada fora da triagem. Publicação **não** será feita — entregarei relatório de arquivos alterados, cenários testados e configurações globais no final.

## Perguntas antes de começar

1. **Persistência do estado**: manter em localStorage entre sessões (com versionamento e migração) ou zerar sempre ao fechar o modal? O briefing diz "seguir estratégia definida sem estado incompatível" — preciso confirmar a estratégia.
2. **MediaUploader atual** (upload seguro HMAC para bucket `triage-media`): manter como opcional na etapa de coleta ou remover do novo fluxo? Ele é usado hoje em sintomas com `mediaRequired`.
3. **Integração backend atual** (`send-lead-notification`, tabela `leads`): continua sendo chamada antes de abrir o WhatsApp, ou o WhatsApp passa a ser o único canal e a persistência vira opcional?
