
# Alinhamento do Funil V2 à especificação global

## Diagnóstico (o que já está em conformidade)

A Rodada 26 já implantou a arquitetura descrita no seu texto:

- FSM pura em `src/lib/triage/engine.ts` (`determineServiceRoute`, `validateCurrentStep`, `resetDependentAnswers`, `buildTriageSummary`, `buildWhatsAppMessage`).
- Configuração central em `src/data/triage/config.ts` (equipamentos, `PRICING`, `SLA`, `URGENCY_OPTIONS` sem "Hoje", `TERMS_VERSION`, `routeExplanation`).
- Questionário contextual em `src/data/triage/questions.ts` cobrindo PC, TV, Celular/Tablet, Surface, Som, Videogame, Outro — incluindo "Quando aconteceu?" para queda/molhou/tela quebrada e "frequência" apenas para intermitentes.
- `TriageWizardV2.tsx` mobile-first, focus trap via Radix Dialog, botão final "Agendar agora", trava do WhatsApp externo via `body[data-triage-open]` em `index.css`.
- `TriageErrorBoundary` preserva a página em caso de falha do modal.
- Registro em `terms_acceptances` com `termsVersion`, `route`, `pricing`, respostas e `terms_accepted_at`.
- Regras de rota já bloqueiam remoto/visita para TV, Celular/Tablet, Surface, Som, Videogame e forçam coleta para PC que não liga / defeito de placa.

## Lacunas a corrigir

1. **Erro de banco (bug ativo relatado agora):**
   `estimated_ticket_min/max` estavam como `integer` — inserções com `99.99` / `299.99` retornavam `invalid input syntax for type integer: "299.99"`. Já migrei para `numeric(10,2)` e recriei a policy `Anyone can insert leads`. Precisa ser publicado.

2. **Textos de aceite:** revisar a copy dos checkboxes na etapa `termsAccepted` para usar exatamente a expressão da spec **"registro de ciência e aceite eletrônico"** e não sugerir "assinatura digital certificada".

3. **Faixas informativas visíveis no resumo (opcional-recomendado):**
   Hoje `REFERENCE_RANGES` existe em `config.ts` mas o wizard não mostra a faixa correspondente ao par equipamento+sintoma no resumo. Adicionar bloco *"Referência aproximada, não vinculante"* na etapa `review` quando houver match (TV display, LEDs, placa; som placa; videogame placa/leitor; celular/tablet).

4. **Regra dos R$ 300 (auto-aprovado):**
   `PRICING.coletaAutoApprovedCap = 300` está no config mas não aparece no texto de aceite. Incluir na etapa `termsAccepted` (apenas rota coleta) a frase: *"Até R$ 300,00 o procedimento compatível pode ser executado sem nova autorização; acima disso, aguardamos sua aprovação."*

5. **Bloco de visita — cobrança por 30 min:**
   O texto atual diz "R$ 99,99 por até 30 minutos". Ajustar para explicitar *"cada novo período de até 30 minutos pode gerar nova cobrança de R$ 99,99, limitado a 4 blocos"* na aceitação da rota visita.

6. **E2E:** os specs V1 (`e2e/triage-funnel.spec.ts`, `e2e/triage-handoff-origins.spec.ts`, `e2e/triage-whatsapp-flow.spec.ts`) ainda apontam para seletores do V1. Reescrever um único `e2e/triage-funnel-v2.spec.ts` cobrindo:
   - remoto (PC funcionando + install_config),
   - visita (PC funcionando + printer_periph),
   - coleta forçada (TV screen_broken, Celular wet, Videogame no_power),
   - PC no_power → coleta,
   - troca de equipamento reseta respostas dependentes,
   - aceite obrigatório antes do CTA final,
   - WhatsApp externo bloqueado enquanto modal aberto.

7. **Limpeza:** remover `TriageWizard` (V1) e `triageMachine.ts` (V1) após E2E V2 verdes, para eliminar código morto.

## Fora de escopo

- SEO, sitemap, preços institucionais, blog, analytics, Google Ads, layout de páginas externas ao funil — não serão tocados.
- GSC, Bloco D e nova publicação: bloqueados até sua autorização expressa.

## Detalhes técnicos

Arquivos a editar:
- `src/components/triage/v2/TriageWizardV2.tsx` — copy da etapa `termsAccepted`, bloco de faixas informativas na `review`, texto da regra R$ 300 e blocos de visita.
- `src/data/triage/config.ts` — se necessário, expor helper `getReferenceRangeFor(equipmentId, symptom)`.
- `src/lib/triage/engine.ts` — sem mudanças de contrato; só se helper for adicionado.
- `e2e/triage-funnel-v2.spec.ts` — novo.
- `e2e/triage-funnel.spec.ts`, `e2e/triage-handoff-origins.spec.ts`, `e2e/triage-whatsapp-flow.spec.ts` — remover.

Gates a executar após as edições, sem publicar:
1. `bunx tsgo --noEmit`
2. `bun run build`
3. `bunx vitest run src/lib/triage/engine.test.ts`
4. `bunx playwright test e2e/triage-funnel-v2.spec.ts --workers=1`
5. Smoke visual mobile 375×812 do modal em `/` (home).

## Entregáveis do turno de execução

- Arquivos alterados (lista);
- Regras de modalidade confirmadas via testes;
- Causa raiz do bug de integer (resolvida na migração);
- Como testar cada rota (roteiro passo-a-passo);
- Confirmação de que nada fora do funil foi tocado;
- Recomendação final de publicação (ou não).
