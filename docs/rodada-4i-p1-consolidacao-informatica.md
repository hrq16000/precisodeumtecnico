# Rodada 4I-P.1 / 4I-P.1R — Consolidação do cluster de informática

Estado final reconciliado (documento único, sem versões conflitantes).

## 1. HEAD final auditado
`072bd74b` (branch `edit/edt-3f64bdf0…`), árvore limpa antes da recuperação.
`b9ad475c` = HEAD anterior à 4I-P.1; o diff da 4I-P.1 estava **commitado**, não pendente.

## 2. Diff recebido (4I-P.1, `b9ad475..072bd74`)
`package.json` (+1 script `check:internal-links`), `src/pages/AssistenciaTecnicaCuritiba.tsx` (metadados),
`src/pages/Servicos.tsx` (hub). 146 inserções / 101 remoções.

## 3. Estado antes da recuperação
Gate `check:internal-links` instável, build final não executado, gates SEO não executados, relatório inexistente.

## 4. Propriedade da intenção
**NÃO — INTENÇÕES DISTINTAS (sem concorrente).** Não existe URL competindo pela intenção-mãe.

## 5. `/tecnico-informatica-curitiba`
**NÃO EXISTE** no repositório (nem rota, nem sitemap, nem canonical). Única ocorrência do padrão:
o post `/blog/tecnico-informatica-pinhais-colombo-araucaria`. Logo, a reatribuição de intenção feita
pela 4I-P.1 não retirou propriedade de nenhuma URL existente.

## 6. `/assistencia-tecnica-curitiba`
Title/description/OG/Twitter/H1/lead/WebPage/LocalBusiness migrados de "consoles" para
"assistência técnica em informática em Curitiba". Mantida — não há sobreposição possível.

## 7. Canibalização
`check:cannibalization` **não existe** no `package.json` (nunca existiu neste HEAD); o par
`/ × /tecnico-informatica-curitiba` é inauditável porque a segunda URL não existe.
Gate real equivalente: `check:meta` → **140 URLs com title/description únicos**. Nenhuma
sobreposição criada pela 4I-P.1.

## 8. Hub antes/depois
- HEAD `b9ad475`: 77 hrefs, maioria `/servicos/:slug` fora de `CURATED_SERVICE_SLUGS` → NotFound.
- HEAD `072bd74` (4I-P.1): links de card corrigidos, **mas foram introduzidos 12 links novos
  "Ver categoria"** (`/servicos/informatica`, `/notebooks`, `/cftv`, `/eletrica`, `/redes`,
  `/ar-condicionado`, `/tvs`, `/servidores`, `/celulares`, `/impressoras`, `/manutencao-predial`,
  `/servicos-gerais`) mais `/servicos/conserto-tv`, `/servicos/games` e `/servicos/recuperacao-dados`
  — **todos NotFound**. Regressão criada pela 4I-P.1, reproduzida em preview de produção.
- Após 4I-P.1R: **12 links no hub, 0 quebrados** (verificado navegando cada destino no preview).

## 9. Cards sem href
Item informativo agora é visualmente não clicável (`bg-muted/40`, borda transparente, ícone e texto
em `muted-foreground`, `cursor-default`, sem seta e sem hover). Nenhuma âncora vazia.

## 10–12. Gate internal-links, causa do timeout e correção
Causa real do "timeout esperando `meta[name="robots"]`": o helper `isNotFound` usava
`locator('meta[name="robots"]').first().getAttribute()`, que faz auto-wait por um elemento que
**não é invariante do projeto** — em página válida sem a tag, o locator estoura 30 s.
Correção determinística (sem sleep, sem try/catch silencioso, sem aumentar timeout):
um único `page.evaluate` lê marcador estrutural `[data-testid="not-found"]` (renderizado só pelo
NotFound), com `document.title` como fallback; `robots` passou a evidência complementar.
Segundo defeito real encontrado: `page.goto` em `/midia-kit.pdf` abortava com "Download is starting"
→ `SKIP` agora ignora extensões de asset.

## 13. Build
`npm run build` **exit 0**, com todo o `postbuild` verde: seo-dedup, no-debug, cta-attrs,
national-service-matrix, faq-consistency (280 arquivos), commercial-claims, pc-assembly,
sitemap-dates (7 shards), publication-dates, og-manifest (256), nacional-sitemap,
sitemap-manifest/presence, photo-credits, price-schema, service-standards, image-sitemap (842
páginas), ads-txt, policy-jsonld, thin-content.

## 14. Gates
| Gate | Resultado |
|---|---|
| `npm run build` + `postbuild` | PASS |
| `check:meta` (preview :4173) | PASS — 140 URLs únicas |
| `check:canonical` | PASS — 145/145 |
| `check:claims` | PASS |
| `check:thin` | PASS |
| `check:internal-links` (preview) | FAIL — apenas por links **pré-existentes** (§21) |
| `check:cannibalization`, `check:copy`, `check:sitemap-source`, `check:internal-links:strict` | **não existem** no `package.json` |

## 15. Paridade shell/runtime
`/assistencia-tecnica-curitiba`: title, description, OG, Twitter, canonical, robots e JSON-LD são
emitidos pelo mesmo `Helmet` — sem contradição entre shell e runtime. `/tecnico-informatica-curitiba`
inexistente (nada a comparar).

## 16. JSON-LD
**Regressão factual removida:** `Service` "Reparo de Equipamentos de Som em Curitiba" (áudio é
vertical formalmente recusada). TV e placas de vídeo permanecem exatamente como estavam.

## 17. check:copy
Gate inexistente. A description nova usa vocabulário de orçamento já padronizado; `check:claims` PASS.

## 18. TV / placas / monitor
Zero alteração de conteúdo, intenção ou destino. Nenhuma nova exposição no hub.

## 19. Funil / triagem / tracking / banco / telemetria
Zero alteração.

## 20. Arquivos alterados na 4I-P.1R
- `src/pages/Servicos.tsx` — remoção dos links "Ver categoria" e dos 3 hrefs NotFound; item informativo não clicável.
- `src/pages/AssistenciaTecnicaCuritiba.tsx` — remoção do Service de áudio.
- `src/pages/NotFound.tsx` — `data-testid="not-found"` (marcador de teste).
- `e2e/internal-links-no-404.spec.ts` — helper determinístico + SKIP de assets.

## 21. P0
Links internos **pré-existentes** (fora do diff 4I-P.1) que resolvem em NotFound, emitidos por
Header, Footer, NotFound, `RegiaoDetalhe`, `CidadeNacional`, `BairroNacional`, `ServicoDetalhe`,
`keywordServices`, `viralPostsCWB` e `Faq`:
`/servicos/informatica`, `/servicos/cftv`, `/servicos/eletrica`, `/servicos/ar-condicionado`,
`/servicos/celulares`, `/servicos/impressoras`, `/servicos/manutencao-predial`, `/servicos/games`,
`/servicos/macbook`, `/precos-e-politicas` e a rota `/servicos/:servico/:cidade/:bairro`
(ex.: `/servicos/conserto-de-notebook/curitiba/batel`).
Exige rodada própria — fora do escopo desta recuperação (proibido criar página/redirect).

## 22. P1
Hierarquia entre as três URLs B2B com promessa equivalente (herdado da 4I-P).

## 23. P2
Ausência dos gates `check:cannibalization`, `check:copy`, `check:sitemap-source`.

## 24. Git final
Base `072bd74b`; alterações da 4I-P.1R restritas aos 4 arquivos do §20.

---

# DECISÃO

```text
4I-P.1 EXIGE CORREÇÃO
```

A regressão criada pela 4I-P.1 (links "Ver categoria" e 3 hrefs para NotFound) foi reproduzida e
corrigida nesta recuperação; o hub está com 0 links quebrados e todos os gates existentes verdes.
O `check:internal-links` permanece vermelho **exclusivamente** pelos links pré-existentes do §21,
que não podem ser tratados sem sair do escopo. Fechamento condicionado a essa rodada específica.
