# Gate operacional — Montagem de PC / PC Gamer (Rodada 3L)

status: PARCIAL
rota_aprovada: false
rota_avaliada: /servicos/montagem-de-pc

> Este arquivo é a fonte documental do gate `check:pc-assembly-service`.
> Enquanto `rota_aprovada` for `false`, a rota `/servicos/montagem-de-pc`
> NÃO pode existir no roteador, no menu, no sitemap ou em cards de serviço.
> Para liberar, o proprietário precisa confirmar por escrito os itens
> marcados como NÃO COMPROVADO abaixo e alterar `status`/`rota_aprovada`.

## Fontes consultadas (somente internas)

- `src/data/services.ts` → entrada `pc-gamer` (configuração oficial do serviço, já publicada em `/servicos/pc-gamer`)
- `src/data/services.ts` → entradas `informatica` e `redes`
- `src/data/keywordServices.ts` → `upgrade-ssd-curitiba`, `upgrade-memoria-ram-curitiba`
- `src/data/commercialTerms.ts` e `src/data/pricingPolicy.ts` (termos vigentes)
- `src/data/manager.ts` (escopo declarado do gestor responsável)

Nenhum concorrente foi usado como prova de capacidade.

## Tabela de capacidades

| Capacidade | Confirmada | Fonte | Limite | Decisão |
| --- | --- | --- | --- | --- |
| Montagem física completa | Sim | services.ts `pc-gamer.includedServices` | — | OK |
| Avaliação de compatibilidade | Parcial | "Consultoria para escolha de componentes" | Não há checklist técnico documentado | Precisa formalizar |
| Processador e placa-mãe | Sim | includedServices (upgrade de processador) | — | OK |
| Memória RAM | Sim | includedServices + keywordServices RAM | — | OK |
| SSD e armazenamento | Sim | keywordServices `upgrade-ssd-curitiba` | — | OK |
| Placa de vídeo | Sim | includedServices (upgrade de GPU) | — | OK |
| Fonte e consumo estimado | NÃO COMPROVADO | apenas "troca de fonte" | Sem método de cálculo de consumo documentado | Bloqueia |
| Gabinete e dimensões | Parcial | "troca de gabinete" | Sem verificação dimensional documentada | Precisa formalizar |
| Refrigeração a ar | Sim | includedServices (air cooler, pasta térmica) | — | OK |
| Water cooler selado (AIO) | Sim | includedServices + FAQ (AIO sim, loop custom caso a caso) | Loop aberto fora do padrão | OK com limite |
| Organização de cabos | Sim | includedServices | — | OK |
| Configuração de BIOS/UEFI | Sim | includedServices | — | OK |
| Atualização de BIOS | Sim | `src/data/pcAssemblyPolicy.ts` → finalChecklist (somente com autorização escrita e arquivo oficial) | Não é executada por padrão | OK com limite |
| Instalação legítima do sistema | Parcial | "Instalação de Windows 10/11" | Sem política de licenciamento documentada | Precisa formalizar |
| Drivers oficiais | Sim | includedServices | — | OK |
| Testes de temperatura | Sim | "Monitoramento de temperaturas" | — | OK |
| Testes de memória | Sim | `src/data/pcAssemblyPolicy.ts` → finalChecklist (varredura completa sem erros) | — | OK |
| Testes de estabilidade | Sim | "Teste de stress" | — | OK |
| Validação de armazenamento | Sim | `src/data/pcAssemblyPolicy.ts` → finalChecklist (leitura S.M.A.R.T. por unidade) | — | OK |
| Diagnóstico de montagem do cliente | Sim | FAQ "manutenção em PC de outras lojas" | — | OK |
| Upgrade de computador existente | Sim | includedServices + keywordServices | — | OK |
| Registro das peças | Sim | `src/data/pcAssemblyPolicy.ts` → customerParts (termo de recebimento com série e fotos) | — | OK |
| Garantia da mão de obra | Sim | `src/data/pcAssemblyPolicy.ts` → warranty.labor/configuration/exclusions | Prazo registrado por escrito na entrega | OK com limite |
| Política para peças do cliente | Sim | `src/data/pcAssemblyPolicy.ts` → customerParts (compatibilidade, procedência, integridade, defeito, prazo de 5 dias úteis, peça usada) | Sem troca de peça de terceiros | OK com limite |
| Autorização comercial para nova rota | NÃO COMPROVADO | nenhuma | — | Bloqueia |

## Decisão

**CAPACIDADE PARCIAL — NÃO CRIAR PÁGINA.**

Seis capacidades centrais exigidas pela regra de aprovação estão sem fonte
interna: fonte/consumo, atualização de BIOS, validação de armazenamento,
registro de peças, política de peças do cliente e garantia da mão de obra
delimitada. Some-se a isso a ausência de autorização comercial registrada.

## Observação de canibalização

Já existe conteúdo comercial de montagem publicado em `/servicos/pc-gamer`
(gerado por `src/data/services.ts` via a rota `/servicos/:slug`). Criar
`/servicos/montagem-de-pc` duplicaria a mesma intenção ("construir e validar
um conjunto") e violaria o critério de canibalização desta própria rodada.
Se a capacidade for aprovada no futuro, a decisão correta é **reescrever
`/servicos/pc-gamer`** dentro do contrato semântico da rodada, não abrir rota
nova.

## Pendências de conteúdo em `/servicos/pc-gamer` (não alteradas nesta rodada)

Registradas para a próxima rodada, pois a página está fora do escopo editável:

- promessas de desempenho ("máquina dos sonhos", "máxima performance",
  ganho de "5-15%" com overclock);
- faixas de preço de máquina completa (R$ 3.500 a R$ 15.000+) sem fonte;
- incentivo a overclock;
- indicação nominal de marcas de pasta térmica e componentes.


## Atualização — 2026-08-06 (confirmação operacional do proprietário)

Confirmado por escrito pelo proprietário e formalizado em `src/data/pcAssemblyPolicy.ts`:

- Montagem de desktops e PC Gamer do zero: **SIM**.
- Aceite de peças fornecidas pelo cliente: **SIM**, com comprovante de compra e termo de recebimento.
- Teste final antes da entrega: memória, saúde do armazenamento (S.M.A.R.T.), temperatura em repouso e sob carga, estabilidade sob carga contínua e conferência de portas — registrado em laudo.
- Garantia separada em mão de obra, configuração e peça, com exclusões explícitas (overclock por terceiros, danos elétricos, abertura por terceiros, desempenho em jogos).
- Overclock: **NÃO executado**.

Permanecem NÃO COMPROVADOS: método documentado de cálculo de consumo/fonte,
verificação dimensional formal de gabinete, política de licenciamento do sistema
e autorização comercial para nova rota. Por isso `rota_aprovada` continua `false`
e `/servicos/montagem-de-pc` segue bloqueada pelo gate `check:pc-assembly-service`.
O conteúdo aprovado foi publicado na rota já existente `/servicos/pc-gamer`.
