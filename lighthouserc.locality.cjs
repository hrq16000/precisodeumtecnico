const budgets = require("./lighthouse-budgets.cjs");

/**
 * Pipeline de performance dedicado às páginas de BAIRRO e CIDADE — as que
 * mais recebem imagens reais. Serve de base para o alerta de regressão
 * (scripts/check-perf-regression.ts) após mudanças de imagem ou layout.
 *
 * Rodar: bun run lhci:locality
 */
const HOST = process.env.LHCI_BASE_URL || "http://localhost:4173";

const ROUTES = [
  "/regioes/curitiba",
  "/regioes/curitiba/batel",
  "/regioes/sao-jose-dos-pinhais",
  "/regioes/sao-jose-dos-pinhais/centro",
  "/regioes/colombo",
  "/regioes/araucaria",
  "/atendimento-nacional/sao-paulo",
  "/atendimento-nacional/rio-de-janeiro",
  "/servicos/configuracao-wifi/curitiba",
  "/servicos/conserto-de-notebook/curitiba/batel",
];

module.exports = {
  ci: {
    collect: {
      url: ROUTES.map((r) => `${HOST}${r}`),
      startServerCommand: process.env.LHCI_BASE_URL ? undefined : "bun run preview --port 4173",
      startServerReadyPattern: "Local:",
      numberOfRuns: 1,
      settings: { preset: "desktop", budgets },
    },
    assert: {
      assertions: {
        "largest-contentful-paint": ["error", { maxNumericValue: 2800 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "modern-image-formats": ["error", { minScore: 1 }],
        "uses-responsive-images": ["warn", { minScore: 0.9 }],
        "offscreen-images": ["warn", { minScore: 0.9 }],
        "image-size-responsive": ["warn", { minScore: 1 }],
      },
    },
    upload: { target: "filesystem", outputDir: "./lighthouse-reports/locality" },
  },
};
