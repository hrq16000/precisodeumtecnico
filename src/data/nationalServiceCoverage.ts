/**
 * Rodada 24.1 — Matriz piloto nacional serviço × cidade × bairro.
 *
 * Fonte ÚNICA da matriz habilitada em produção.
 * - Não duplica nomes de cidade/bairro: resolve tudo via `nationalCities` +
 *   `nationalBairros`.
 * - Segurança: só cidades e serviços listados aqui geram páginas indexáveis.
 * - Volume máximo desta rodada: 5 cidades × até 4 bairros × 5 serviços = 100.
 *   O guard `scripts/check-national-service-matrix.ts` bloqueia qualquer
 *   drift (cidade/bairro/serviço inválido, duplicata, colisão com RMC ou
 *   ultrapassagem do teto).
 */

import { getNationalCityBySlug, getCityBairroSlugs, type NationalCity } from "./nationalCities";
import { getNationalBairro, type NationalBairro } from "./nationalBairros";
import { servicesData } from "./services";

// ---------- Tipos ----------

export interface PilotService {
  /** Slug oficial em `servicesData`. */
  slug: string;
  /** Rótulo público exibido em H1 / breadcrumbs / CTAs. */
  label: string;
  /** Fragmento usado em title/description SEO. */
  seoNoun: string;
  /** Categoria correspondente para pré-selecionar no TriageWizard. */
  triageCategory?: string;
}

export interface PilotCityConfig {
  /** Slug em `nationalCities`. */
  citySlug: string;
  /** Bairros habilitados (subset dos âncora). Máximo 4 por cidade nesta rodada. */
  bairroSlugs: string[];
  /** Prioridade sitemap (0–1). */
  priority: number;
}

export interface PilotCombination {
  citySlug: string;
  bairroSlug: string;
  serviceSlug: string;
}

export interface ResolvedCombination {
  city: NationalCity;
  bairro: NationalBairro;
  service: PilotService;
  path: string;
  url: string;
}

// ---------- Constantes do piloto ----------

/** Rota nacional exclusiva desta matriz. NÃO reutilizar `/servico-em/:city/:service` (RMC). */
export const NATIONAL_MATRIX_ROUTE = "/servico-em-nacional/:city/:bairro/:service";
export const NATIONAL_MATRIX_PREFIX = "/servico-em-nacional";
export const NATIONAL_MATRIX_MAX = 100;
export const BAIRROS_PER_CITY_MAX = 4;

/** Serviços habilitados no piloto (subset dos 17 de `servicesData`). */
export const pilotServices: readonly PilotService[] = [
  { slug: "informatica",       label: "Informática",              seoNoun: "assistência técnica em informática",       triageCategory: "pc" },
  { slug: "notebooks",         label: "Notebooks",                seoNoun: "assistência técnica em notebooks",         triageCategory: "notebook" },
  { slug: "recuperacao-dados", label: "Recuperação de Dados",     seoNoun: "recuperação de dados",                     triageCategory: "pc" },
  { slug: "redes",             label: "Redes / Wi-Fi",            seoNoun: "instalação e manutenção de redes/Wi-Fi" },
  { slug: "cftv",              label: "Câmeras / CFTV",           seoNoun: "instalação e manutenção de câmeras/CFTV" },
] as const;

/** Cidades habilitadas no piloto, com bairros selecionados. */
export const pilotCities: readonly PilotCityConfig[] = [
  { citySlug: "sao-paulo",      bairroSlugs: ["pinheiros", "moema", "tatuape", "itaim-bibi"],        priority: 0.75 },
  { citySlug: "rio-de-janeiro", bairroSlugs: ["copacabana", "ipanema", "botafogo", "barra-da-tijuca"], priority: 0.75 },
  { citySlug: "brasilia",       bairroSlugs: ["asa-sul", "asa-norte", "lago-sul", "lago-norte"],     priority: 0.7 },
  { citySlug: "salvador",       bairroSlugs: ["pituba", "barra", "itaigara", "rio-vermelho"],        priority: 0.7 },
  { citySlug: "campinas",       bairroSlugs: ["cambui", "taquaral", "barao-geraldo", "centro"],      priority: 0.7 },
] as const;

// ---------- Resolvers puros ----------

export function getPilotService(slug: string | undefined): PilotService | null {
  if (!slug) return null;
  return pilotServices.find((s) => s.slug === slug) ?? null;
}

export function getPilotCityConfig(citySlug: string | undefined): PilotCityConfig | null {
  if (!citySlug) return null;
  return pilotCities.find((c) => c.citySlug === citySlug) ?? null;
}

export function isBairroEnabled(citySlug: string, bairroSlug: string): boolean {
  const cfg = getPilotCityConfig(citySlug);
  return !!cfg && cfg.bairroSlugs.includes(bairroSlug);
}

export function resolvePilotCombination(
  citySlug: string | undefined,
  bairroSlug: string | undefined,
  serviceSlug: string | undefined,
): ResolvedCombination | null {
  if (!citySlug || !bairroSlug || !serviceSlug) return null;

  const cityCfg = getPilotCityConfig(citySlug);
  if (!cityCfg) return null;

  const city = getNationalCityBySlug(citySlug);
  if (!city) return null;

  if (!cityCfg.bairroSlugs.includes(bairroSlug)) return null;
  const bairro = getNationalBairro(citySlug, bairroSlug);
  if (!bairro) return null;

  const service = getPilotService(serviceSlug);
  if (!service) return null;
  if (!servicesData[serviceSlug]) return null;

  const path = `${NATIONAL_MATRIX_PREFIX}/${city.slug}/${bairro.slug}/${service.slug}`;
  return {
    city,
    bairro,
    service,
    path,
    url: `https://precisodeumtecnico.com${path}`,
  };
}

/** Enumera todas as combinações habilitadas (validadas contra fontes). */
export function enumeratePilotCombinations(): ResolvedCombination[] {
  const out: ResolvedCombination[] = [];
  for (const city of pilotCities) {
    for (const bairroSlug of city.bairroSlugs) {
      for (const service of pilotServices) {
        const r = resolvePilotCombination(city.citySlug, bairroSlug, service.slug);
        if (r) out.push(r);
      }
    }
  }
  return out;
}

/** Sugestões para páginas de fallback quando combinação não existe. */
export function getPilotBairrosForCity(citySlug: string): NationalBairro[] {
  const cfg = getPilotCityConfig(citySlug);
  if (!cfg) return [];
  return cfg.bairroSlugs
    .map((slug) => getNationalBairro(citySlug, slug))
    .filter((b): b is NationalBairro => !!b);
}

export function getOtherPilotServices(currentSlug: string, limit = 5): PilotService[] {
  return pilotServices.filter((s) => s.slug !== currentSlug).slice(0, limit);
}
