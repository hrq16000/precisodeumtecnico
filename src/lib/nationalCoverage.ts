// Rodada 22.2.1 — Helpers de cobertura nacional.
// Fonte única: `nationalBairros.ts`. Impede drift entre cidade e bairro.

import { nationalCities, getNationalCityBySlug, type NationalCity } from "@/data/nationalCities";
import {
  nationalBairrosByCity,
  getNationalBairro,
  getBairrosForCity,
  type NationalBairro,
} from "@/data/nationalBairros";

/** Slug seguro: minúsculas, hífens, sem acento. */
export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function hasCity(citySlug: string): boolean {
  return !!getNationalCityBySlug(citySlug);
}

export function hasCityBairro(citySlug: string, bairroSlug: string): boolean {
  return !!getNationalBairro(citySlug, bairroSlug);
}

/** Cidades nacionais com pelo menos 1 bairro publicado. */
export function citiesWithBairros(): NationalCity[] {
  return nationalCities.filter(
    (c) => c.enabled !== false && (nationalBairrosByCity[c.slug]?.length ?? 0) > 0,
  );
}

/** Cidades nacionais habilitadas sem bairros publicados. */
export function citiesWithoutBairros(): NationalCity[] {
  return nationalCities.filter(
    (c) => c.enabled !== false && (nationalBairrosByCity[c.slug]?.length ?? 0) === 0,
  );
}

/** Total de bairros âncora publicados. */
export function totalPublishedBairros(): number {
  return Object.values(nationalBairrosByCity).reduce((n, list) => n + list.length, 0);
}

/** Retorna erros de integridade — [] quando tudo OK. */
export function validateCoverage(): string[] {
  const errs: string[] = [];
  const citySlugs = new Set(nationalCities.map((c) => c.slug));

  for (const [citySlug, list] of Object.entries(nationalBairrosByCity)) {
    if (!citySlugs.has(citySlug)) {
      errs.push(`nationalBairros: cidade "${citySlug}" não existe em nationalCities.ts`);
      continue;
    }
    const seen = new Set<string>();
    for (const b of list) {
      if (seen.has(b.slug)) {
        errs.push(`nationalBairros[${citySlug}]: slug de bairro duplicado "${b.slug}"`);
      }
      seen.add(b.slug);
      if (normalizeSlug(b.slug) !== b.slug) {
        errs.push(`nationalBairros[${citySlug}]: slug "${b.slug}" não normalizado`);
      }
      if (!b.name || !b.name.trim()) {
        errs.push(`nationalBairros[${citySlug}]: bairro "${b.slug}" sem nome`);
      }
    }
  }
  return errs;
}

export {
  getNationalCityBySlug,
  getNationalBairro,
  getBairrosForCity,
  nationalBairrosByCity,
  nationalCities,
};
export type { NationalCity, NationalBairro };
