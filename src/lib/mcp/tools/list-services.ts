import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { servicesData } from "@/data/services";

export default defineTool({
  name: "list_services",
  title: "Listar serviços",
  description:
    "Lista o catálogo público de serviços de assistência técnica oferecidos (slug, título, resumo e palavras-chave). Use para descobrir quais serviços existem antes de pedir detalhes.",
  inputSchema: {
    search: z
      .string()
      .trim()
      .optional()
      .describe("Filtro opcional por texto no título, descrição ou palavras-chave."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ search }) => {
    const term = search?.toLowerCase();
    const items = Object.values(servicesData)
      .map((s) => ({
        slug: s.slug,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        keywords: s.keywords,
        url: `https://precisodeumtecnico.com/servicos/${s.slug}`,
      }))
      .filter((s) =>
        !term
          ? true
          : [s.title, s.subtitle, s.description, s.keywords.join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(term),
      );

    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { count: items.length, services: items },
    };
  },
});
