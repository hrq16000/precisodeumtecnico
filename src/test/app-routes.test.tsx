import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

/**
 * Guarda de regressão para a classe de erro "X is not defined" no roteador:
 * garante que todo componente usado nos elements das rotas do App está
 * importado/declarado, e que os helpers do react-router usados (Navigate,
 * Route, Routes, BrowserRouter) vêm de fato do import.
 */
const source = readFileSync("src/App.tsx", "utf8");

function importedNames(code: string): Set<string> {
  const names = new Set<string>();
  const importRe = /import\s+([^;]+?)\s+from\s+["'][^"']+["']/g;
  let m: RegExpExecArray | null;
  while ((m = importRe.exec(code))) {
    const clause = m[1];
    const braced = clause.match(/\{([\s\S]*?)\}/);
    if (braced) {
      for (const part of braced[1].split(",")) {
        const name = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (name) names.add(name);
      }
    }
    const head = clause.replace(/\{[\s\S]*?\}/g, "");
    for (const piece of head.split(",")) {
      const cleaned = piece.trim().replace(/^\*\s+as\s+/, "");
      if (/^[A-Za-z_$][\w$]*$/.test(cleaned)) names.add(cleaned);
    }
  }
  return names;
}

function declaredNames(code: string): Set<string> {
  const names = new Set<string>();
  const declRe = /(?:^|\n)\s*(?:export\s+)?(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g;
  let m: RegExpExecArray | null;
  while ((m = declRe.exec(code))) names.add(m[1]);
  return names;
}

const known = new Set([...importedNames(source), ...declaredNames(source)]);

describe("App routing integrity", () => {
  it("importa os primitivos do react-router usados", () => {
    for (const name of ["BrowserRouter", "Routes", "Route", "Navigate"]) {
      expect(known.has(name), `${name} deve estar importado em App.tsx`).toBe(true);
    }
  });

  it("declara todos os componentes usados nas rotas", () => {
    const missing: string[] = [];
    const jsxRe = /<\s*([A-Z][\w$]*)[\s/>]/g;
    let m: RegExpExecArray | null;
    while ((m = jsxRe.exec(source))) {
      if (!known.has(m[1])) missing.push(m[1]);
    }
    expect(missing, `componentes sem definição: ${missing.join(", ")}`).toEqual([]);
  });

  it("registra ao menos uma rota para cada política exigida pelo AdSense", () => {
    for (const path of [
      "/politica-de-cookies",
      "/politica-privacidade",
      "/politica-de-anuncios",
      "/termos-uso",
      "/contato",
      "/sobre",
      "/status-anuncios",
    ]) {
      expect(source.includes(`"${path}"`), `rota ${path} deve existir`).toBe(true);
    }
  });
});
