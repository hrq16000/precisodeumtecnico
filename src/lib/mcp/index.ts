import { defineMcp } from "@lovable.dev/mcp-js";
import listServicesTool from "./tools/list-services";
import getServiceTool from "./tools/get-service";
import getPricingAndTermsTool from "./tools/get-pricing-and-terms";
import listCoverageTool from "./tools/list-coverage";
import listFaqsTool from "./tools/list-faqs";

export default defineMcp({
  name: "preciso-de-um-tecnico",
  title: "Preciso de um técnico",
  version: "0.1.0",
  instructions:
    "Ferramentas de consulta ao catálogo público da assistência técnica Preciso de um Técnico (Curitiba/PR e rede nacional de parceiros). Use `list_services` e `get_service` para serviços, `get_pricing_and_terms` para preços e condições oficiais, `list_coverage` para cidades e bairros atendidos e `list_faqs` para dúvidas frequentes. Todos os dados são públicos e de leitura; nenhuma ferramenta cria ou altera atendimentos.",
  tools: [
    listServicesTool,
    getServiceTool,
    getPricingAndTermsTool,
    listCoverageTool,
    listFaqsTool,
  ],
});
