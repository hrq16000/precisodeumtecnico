const budgets = require("./lighthouse-budgets.cjs");

module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:4173/assistencia-tecnica-curitiba",
        "http://localhost:4173/assistencia-tecnica",
        "http://localhost:4173/servicos/reparo-smart-tv-curitiba",
        "http://localhost:4173/servicos/configuracao-wifi/sao-jose-dos-pinhais/centro",
        "http://localhost:4173/servicos/manutencao-preventiva-empresas",
        "http://localhost:4173/servicos/backup-para-empresas",
        "http://localhost:4173/servicos/redes-e-wifi",
      ],
      startServerCommand: "bun run preview --port 4173",
      startServerReadyPattern: "Local:",
      numberOfRuns: 1,
      settings: { preset: "desktop", budgets },
    },
    assert: {
      assertions: {
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
        "interactive": ["warn", { maxNumericValue: 3500 }],
        "resource-summary:image:size": ["error", { maxNumericValue: 512000 }],
        "resource-summary:script:size": ["error", { maxNumericValue: 358400 }],
        "resource-summary:total:size": ["error", { maxNumericValue: 1433600 }],
        "performance-budget": "error",
        "uses-optimized-images": ["error", { minScore: 1 }],
        "modern-image-formats": ["error", { minScore: 1 }],
      },
    },
    upload: { target: "filesystem", outputDir: "./lighthouse-reports/desktop" },
  },
};
