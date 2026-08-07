import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getAllCities } from "../../../data/regions";
import { getEnabledNationalCities, getCityBairroSlugs } from "../../../data/nationalCities";

export default defineTool({
  name: "list_coverage",
  title: "Cobertura de atendimento",
  description:
    "Lista as áreas atendidas: cidades de atendimento direto em Curitiba e Região Metropolitana (com bairros) e as cidades da rede nacional de prestadores parceiros.",
  inputSchema: {
    scope: z
      .enum(["curitiba", "nacional", "todos"])
      .optional()
      .describe("Escopo da cobertura. Padrão: 'todos'."),
    city: z
      .string()
      .trim()
      .optional()
      .describe("Filtro opcional por nome ou slug de cidade."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ scope = "todos", city }) => {
    const term = city?.toLowerCase();
    const matches = (name: string, slug: string) =>
      !term || name.toLowerCase().includes(term) || slug.toLowerCase().includes(term);

    const regional =
      scope === "nacional"
        ? []
        : getAllCities()
            .filter((c) => matches(c.name, c.slug))
            .map((c) => ({
              name: c.name,
              slug: c.slug,
              isMainCity: c.isMainCity,
              neighborhoods: c.neighborhoods,
              url: `https://precisodeumtecnico.com/regioes/${c.slug}`,
            }));

    const national =
      scope === "curitiba"
        ? []
        : getEnabledNationalCities()
            .filter((c) => matches(c.name, c.slug))
            .map((c) => ({
              name: c.name,
              slug: c.slug,
              uf: c.uf,
              region: c.region,
              type: c.type,
              neighborhoodSlugs: getCityBairroSlugs(c.slug),
              url: `https://precisodeumtecnico.com/atendimento-nacional/${c.slug}`,
            }));

    const payload = {
      directService: {
        label: "Atendimento direto — Curitiba e Região Metropolitana",
        cities: regional,
      },
      partnerNetwork: {
        label: "Rede nacional de prestadores parceiros",
        disclaimer:
          "Parceiros podem praticar termos, condições, valores e prazos diferentes.",
        cities: national,
      },
    };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
