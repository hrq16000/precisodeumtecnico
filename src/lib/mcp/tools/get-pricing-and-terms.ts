import { defineTool } from "@lovable.dev/mcp-js";
import { COMMERCIAL, PRICING, SLA } from "../../../data/pricingPolicy";
import { COMMERCIAL_TERMS } from "../../../data/commercialTerms";

export default defineTool({
  name: "get_pricing_and_terms",
  title: "Preços e termos comerciais",
  description:
    "Retorna a política oficial de preços (diagnóstico em bancada, visita técnica, coleta e entrega), prazos/SLA e os termos comerciais públicos (orçamento pré-aprovado, taxa de cancelamento, fila mínima). Fonte única de verdade do site.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const payload = {
      pricing: PRICING,
      sla: SLA,
      commercial: COMMERCIAL,
      terms: COMMERCIAL_TERMS,
      note:
        "Valores e prazos são referência pública e variam conforme fila técnica, peças, complexidade e logística. Não representam orçamento fechado.",
    };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
