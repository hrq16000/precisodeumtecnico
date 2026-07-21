import type { Page } from "@playwright/test";

/**
 * Coleta todos os blocos JSON-LD injetados na página (via <script type="application/ld+json">).
 * Faz parse individual e ignora blocos inválidos silenciosamente (retorna apenas o array parseado).
 */
export async function getJsonLdBlocks(page: Page): Promise<unknown[]> {
  const raw = await page.$$eval(
    'script[type="application/ld+json"]',
    (nodes) => nodes.map((n) => n.textContent ?? ""),
  );
  const out: unknown[] = [];
  for (const s of raw) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) out.push(...parsed);
      else out.push(parsed);
    } catch {
      // ignora blocos inválidos — outros specs cobrem a validação sintática
    }
  }
  return out;
}

export function findByType<T = Record<string, unknown>>(
  blocks: unknown[],
  type: string,
): T | undefined {
  return blocks.find((b) => {
    if (!b || typeof b !== "object") return false;
    const t = (b as { "@type"?: string })["@type"];
    return t === type;
  }) as T | undefined;
}
