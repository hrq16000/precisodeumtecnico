import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { servicesData } from "../../../data/services";

export default defineTool({
  name: "get_service",
  title: "Detalhes de um serviço",
  description:
    "Retorna os detalhes públicos completos de um serviço: descrição longa, benefícios, o que está incluso, etapas do processo, faixas de preço de tabela e FAQ.",
  inputSchema: {
    slug: z
      .string()
      .trim()
      .describe("Slug do serviço, por exemplo 'informatica'. Use list_services para descobrir."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const service = servicesData[slug.toLowerCase()];
    if (!service) {
      return {
        content: [
          {
            type: "text",
            text: `Serviço '${slug}' não encontrado. Slugs válidos: ${Object.keys(servicesData).join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    const payload = {
      slug: service.slug,
      title: service.title,
      subtitle: service.subtitle,
      description: service.description,
      longDescription: service.longDescription,
      benefits: service.benefits,
      includedServices: service.includedServices,
      process: service.process,
      pricing: service.pricing,
      faqs: service.faqs,
      relatedServices: service.relatedServices,
      keywords: service.keywords,
      url: `https://precisodeumtecnico.com/servicos/${service.slug}`,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { service: payload },
    };
  },
});
