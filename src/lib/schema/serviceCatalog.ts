/**
 * Catálogo canônico de serviços para JSON-LD.
 *
 * Regra fail-closed: só entra em `Service[]` o que é efetivamente oferecido.
 * Verticais recusadas (decisão comercial das rodadas 3Z / 4I-P) NÃO podem
 * aparecer em dados estruturados — anunciar serviço que não é executado gera
 * lead impossível de atender e risco de inconsistência para o buscador.
 *
 * Este módulo é a fonte única dessa lista. Páginas montam seus schemas e
 * passam por `sanitizeServiceSchemas` antes de emitir.
 */

/** Termos que caracterizam verticais recusadas (não atendidas). */
const REFUSED_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bmonitor(es)?\b/i, reason: "vertical de monitores não é atendida" },
  { pattern: /\bprojetor(es)?\b/i, reason: "vertical de projetores não é atendida" },
  { pattern: /\b(caixa de som|som automotivo|home theater|amplificador)\b/i, reason: "vertical de áudio não é atendida" },
  { pattern: /\b(eletrodom[eé]stico|geladeira|m[aá]quina de lavar|micro-?ondas)\b/i, reason: "linha branca não é atendida" },
];

export interface ServiceSchemaLike {
  "@type"?: string;
  name?: string;
  serviceType?: string;
  [key: string]: unknown;
}

/** Retorna o motivo da recusa, ou null quando o serviço é oferecido. */
export function refusalReason(service: ServiceSchemaLike): string | null {
  const haystack = `${service.name ?? ""} ${service.serviceType ?? ""}`;
  for (const { pattern, reason } of REFUSED_PATTERNS) {
    if (pattern.test(haystack)) return reason;
  }
  return null;
}

/**
 * Remove de uma lista de schemas qualquer `Service` de vertical recusada.
 * Itens que não são `Service` passam intactos.
 */
export function sanitizeServiceSchemas<T extends ServiceSchemaLike>(schemas: T[]): T[] {
  return schemas.filter((s) => {
    if (s["@type"] !== "Service") return true;
    const reason = refusalReason(s);
    if (reason && import.meta.env?.DEV) {
      console.warn(`[schema] Service removido do JSON-LD: "${s.name}" — ${reason}`);
    }
    return !reason;
  });
}
