import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { homeFaqs } from "../../../data/homeFaqs";

export default defineTool({
  name: "list_faqs",
  title: "Perguntas frequentes",
  description:
    "Retorna as perguntas frequentes públicas do site sobre atendimento, prazos, garantia, orçamento e formas de pagamento.",
  inputSchema: {
    search: z.string().trim().optional().describe("Filtro opcional por texto na pergunta ou resposta."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ search }) => {
    const term = search?.toLowerCase();
    const items = homeFaqs.filter((f) =>
      !term ? true : `${f.question} ${f.answer}`.toLowerCase().includes(term),
    );

    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { count: items.length, faqs: items },
    };
  },
});
