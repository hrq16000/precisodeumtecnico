/**
 * Zonas de atendimento em Curitiba e Região Metropolitana.
 *
 * IMPORTANTE (política de claims): os tempos abaixo são ESTIMATIVAS de
 * deslocamento do técnico dentro da janela comercial (08h–22h), calculadas
 * por faixa de distância a partir do eixo central de Curitiba. Não são
 * promessa de prazo de atendimento nem SLA — o prazo real é confirmado na
 * triagem, conforme fila técnica e agenda do dia.
 */

export interface ServiceZone {
  id: string;
  name: string;
  /** Descrição curta da zona (usada em UI e em texto indexável). */
  summary: string;
  /** Faixa estimada de deslocamento, em minutos. */
  travelMinMin: number;
  travelMinMax: number;
  /** Bairros/cidades representativos da zona. */
  places: string[];
  /** Posição relativa no diagrama de cobertura (0–100). */
  x: number;
  y: number;
}

export const CURITIBA_ZONES: ServiceZone[] = [
  {
    id: "centro",
    name: "Centro e eixo central",
    summary:
      "Centro, Centro Cívico, Rebouças, Batel e Água Verde. É a zona de menor deslocamento, com rota técnica ativa em todos os dias úteis.",
    travelMinMin: 15,
    travelMinMax: 35,
    places: ["Centro", "Centro Cívico", "Rebouças", "Batel", "Água Verde", "Alto da Glória"],
    x: 50,
    y: 50,
  },
  {
    id: "norte",
    name: "Zona Norte",
    summary:
      "Bacacheri, Boa Vista, Santa Cândida, Cabral, Juvevê e Ahú, com continuidade para Colombo e Pinhais na divisa norte.",
    travelMinMin: 25,
    travelMinMax: 50,
    places: ["Bacacheri", "Boa Vista", "Santa Cândida", "Cabral", "Juvevê", "Ahú", "Atuba"],
    x: 50,
    y: 16,
  },
  {
    id: "sul",
    name: "Zona Sul",
    summary:
      "Boqueirão, Sítio Cercado, Pinheirinho, Xaxim, Capão Raso e Alto Boqueirão — região densa, com rotas concentradas por turno.",
    travelMinMin: 30,
    travelMinMax: 60,
    places: ["Boqueirão", "Sítio Cercado", "Pinheirinho", "Xaxim", "Capão Raso", "Alto Boqueirão"],
    x: 50,
    y: 84,
  },
  {
    id: "leste",
    name: "Zona Leste",
    summary:
      "Cristo Rei, Jardim Botânico, Cajuru, Jardim das Américas, Uberaba e Capão da Imbuia, com ligação direta para Pinhais e São José dos Pinhais.",
    travelMinMin: 25,
    travelMinMax: 55,
    places: ["Cristo Rei", "Jardim Botânico", "Cajuru", "Jardim das Américas", "Uberaba", "Capão da Imbuia"],
    x: 82,
    y: 50,
  },
  {
    id: "oeste",
    name: "Zona Oeste",
    summary:
      "Santa Felicidade, Campo Comprido, Mossunguê, Bigorrilho, Portão e Cidade Industrial — inclui o corredor logístico da CIC.",
    travelMinMin: 30,
    travelMinMax: 60,
    places: ["Santa Felicidade", "Campo Comprido", "Mossunguê", "Bigorrilho", "Portão", "Cidade Industrial"],
    x: 18,
    y: 50,
  },
  {
    id: "rmc",
    name: "Região Metropolitana",
    summary:
      "São José dos Pinhais, Pinhais, Colombo e Araucária. O deslocamento maior costuma ser resolvido com agendamento por janela (manhã ou tarde).",
    travelMinMin: 40,
    travelMinMax: 80,
    places: ["São José dos Pinhais", "Pinhais", "Colombo", "Araucária"],
    x: 84,
    y: 18,
  },
];

export const TRAVEL_DISCLAIMER =
  "Estimativa de deslocamento em condições normais de trânsito, dentro da janela comercial (08h às 22h). Não é prazo de conclusão do reparo nem garantia de horário: a janela real é confirmada na triagem, conforme a agenda do dia.";

export function findZoneByPlace(query: string): ServiceZone | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return (
    CURITIBA_ZONES.find((z) =>
      z.places.some((p) => p.toLowerCase().includes(q) || q.includes(p.toLowerCase())),
    ) ?? null
  );
}
