/**
 * Fotos reais de domínio público / Creative Commons (Wikimedia Commons).
 *
 * Regras (fail-closed):
 *  - Nenhuma foto aqui é apresentada como registro de atendimento próprio.
 *    São imagens reais de terceiros, usadas como referência visual do tema.
 *  - Toda foto carrega autoria, licença e link para a fonte — exigência das
 *    licenças CC BY / CC BY-SA. PD/CC0 mantêm o crédito por transparência.
 *  - Arquivos servidos de /public/photos em WebP (1600/1200/800) + JPG 800.
 *
 * Não editar à mão os campos de licença: eles vieram da API do Commons.
 */

export interface PublicPhoto {
  slug: string;
  /** Larguras realmente geradas em public/photos (AVIF + WebP + JPG). */
  variants: number[];
  alt: string;
  caption: string;
  width: number;
  height: number;
  license: string;
  licenseUrl: string;
  author: string;
  source: string;
}

export const PUBLIC_PHOTOS: Record<string, PublicPhoto> = {
  "informatica-bancada": {
    slug: "informatica-bancada",
    alt: "Técnico realizando reparo em computador sobre bancada de serviço",
    caption: "Reparo de computador em bancada",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 1060,
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    author: "Vintechcomputerservices",
    source: "https://commons.wikimedia.org/wiki/File:Computer_repair_in_progress.jpg",
  },
  "notebook-hardware": {
    slug: "notebook-hardware",
    alt: "Interior de notebook aberto com placa-mãe e componentes à vista",
    caption: "Notebook aberto para manutenção de hardware",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 3200,
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    author: "Rider Adil",
    source: "https://commons.wikimedia.org/wiki/File:Laptop_hardware.jpg",
  },
  "tv-reparo": {
    slug: "tv-reparo",
    alt: "Técnica trabalhando no reparo de uma televisão",
    caption: "Reparo de televisão em oficina",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 1067,
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    author: "Metchyves",
    source: "https://commons.wikimedia.org/wiki/File:Reparatrice_de_television_5.jpg",
  },
  "redes-rack": {
    slug: "redes-rack",
    alt: "Rack de rede com switches e cabeamento estruturado organizado",
    caption: "Rack de rede com switches e cabeamento",
    variants: [400, 800],
    width: 800,
    height: 1200,
    license: "CC BY-SA 3.0",
    licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
    author: "Yann",
    source: "https://commons.wikimedia.org/wiki/File:Computer_rack_with_switches_and_cables.jpg",
  },
  "wifi-roteador": {
    slug: "wifi-roteador",
    alt: "Roteador Wi-Fi doméstico com antenas sobre superfície clara",
    caption: "Roteador Wi-Fi doméstico",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 1067,
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0",
    author: "Hayden Schiff",
    source: "https://commons.wikimedia.org/wiki/File:TP-Link_TL-WR740N_router_HS2.jpg",
  },
  "cftv-camera": {
    slug: "cftv-camera",
    alt: "Câmera de segurança instalada na parede de um edifício",
    caption: "Câmera de CFTV instalada em fachada",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 1200,
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    author: "Ivan Radic",
    source: "https://commons.wikimedia.org/wiki/File:Surveillance_camera_on_a_building_wall_recording_the_activity_in_a_pedestrian_area_(51166574352).jpg",
  },
  "eletrica-quadro": {
    slug: "eletrica-quadro",
    alt: "Quadro de disjuntores aberto com fiação elétrica residencial",
    caption: "Quadro elétrico com disjuntores e fiação",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 2125,
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    author: "Paul The Writer",
    source: "https://commons.wikimedia.org/wiki/File:Wall_Circuit_Breaker_and_Wiring.jpg",
  },
  "eletronica-oficina": {
    slug: "eletronica-oficina",
    alt: "Bancada de oficina de eletrônicos com equipamentos em manutenção",
    caption: "Oficina de reparo de eletrônicos",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 1200,
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0",
    author: "Mohamod  Fasil",
    source: "https://commons.wikimedia.org/wiki/File:Electrical_Repair_Shop_-_Satellite_TV_Receiver_-_Doha.jpg",
  },
  "cidade-curitiba": {
    slug: "cidade-curitiba",
    alt: "Vista dos edifícios de Curitiba, Paraná",
    caption: "Curitiba, Paraná",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 1024,
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    author: "Wilfredor",
    source: "https://commons.wikimedia.org/wiki/File:Curitiba_Skyline,_Parana.jpg",
  },
  "cidade-curitiba-jardim-botanico": {
    slug: "cidade-curitiba-jardim-botanico",
    alt: "Estufa do Jardim Botânico de Curitiba",
    caption: "Jardim Botânico, Curitiba",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 767,
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    author: "Ishiai",
    source: "https://commons.wikimedia.org/wiki/File:Jardim_Bot%C3%A2nico_de_Curitiba_(1).jpg",
  },
  "cidade-sao-jose-dos-pinhais": {
    slug: "cidade-sao-jose-dos-pinhais",
    alt: "Igreja Matriz de São José dos Pinhais, Paraná",
    caption: "São José dos Pinhais, Paraná",
    variants: [400, 800, 1200],
    width: 1200,
    height: 900,
    license: "Public domain",
    licenseUrl: "",
    author: "Deyvid Setti e Eloy Olindo Setti",
    source: "https://commons.wikimedia.org/wiki/File:Igreja_Matriz_S%C3%A3o_Jos%C3%A9_dos_Pinhais_Paran%C3%A1_Brasil.jpg",
  },
  "cidade-colombo": {
    slug: "cidade-colombo",
    alt: "Vista urbana de Colombo, Paraná",
    caption: "Colombo, Paraná",
    variants: [400, 800, 1200],
    width: 1200,
    height: 900,
    license: "Public domain",
    licenseUrl: "",
    author: "Deyvid Setti e Eloy Olindo Setti",
    source: "https://commons.wikimedia.org/wiki/File:Colombo_Paran%C3%A1_Brazil.JPG",
  },
  "cidade-araucaria": {
    slug: "cidade-araucaria",
    alt: "Vista do centro de Araucária, Paraná",
    caption: "Araucária, Paraná",
    variants: [400, 800, 1200, 1600],
    width: 1600,
    height: 1200,
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    author: "dnsilva1",
    source: "https://commons.wikimedia.org/wiki/File:Arauc%C3%A1ria_-_centro_-_panoramio.jpg",
  },
};

/** Fotos temáticas de serviço (sem cidade). */
export const SERVICE_PHOTO_SLUGS = [
  "informatica-bancada",
  "notebook-hardware",
  "redes-rack",
  "wifi-roteador",
  "cftv-camera",
  "eletrica-quadro",
  "tv-reparo",
  "eletronica-oficina",
] as const;

/** Foto de cidade quando existir registro real dela no acervo. */
export const CITY_PHOTO_BY_SLUG: Record<string, string> = {
  curitiba: "cidade-curitiba",
  "sao-jose-dos-pinhais": "cidade-sao-jose-dos-pinhais",
  colombo: "cidade-colombo",
  araucaria: "cidade-araucaria",
};

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Seleção determinística de N fotos de serviço a partir de um slug. */
export function pickServicePhotos(seed: string, count = 2): PublicPhoto[] {
  const start = hash(seed) % SERVICE_PHOTO_SLUGS.length;
  const out: PublicPhoto[] = [];
  for (let i = 0; i < Math.min(count, SERVICE_PHOTO_SLUGS.length); i++) {
    out.push(PUBLIC_PHOTOS[SERVICE_PHOTO_SLUGS[(start + i) % SERVICE_PHOTO_SLUGS.length]]);
  }
  return out;
}

/** Fotos de uma localidade: foto da cidade (se houver) + fotos temáticas. */
export function pickLocalityPhotos(citySlug: string, seed: string, count = 3): PublicPhoto[] {
  const cityPhoto = CITY_PHOTO_BY_SLUG[citySlug]
    ? PUBLIC_PHOTOS[CITY_PHOTO_BY_SLUG[citySlug]]
    : undefined;
  const rest = pickServicePhotos(seed, count - (cityPhoto ? 1 : 0));
  return cityPhoto ? [cityPhoto, ...rest] : rest;
}
