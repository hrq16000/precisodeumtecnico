module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:4173/assistencia-tecnica-curitiba",
        "http://localhost:4173/assistencia-tecnica",
      ],
      startServerCommand: "bun run preview --port 4173",
      startServerReadyPattern: "Local:",
      numberOfRuns: 1,
      settings: { preset: "mobile" },
    },
    assert: {
      assertions: {
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 300 }],
        "interactive": ["warn", { maxNumericValue: 4000 }],
      },
    },
    upload: { target: "filesystem", outputDir: "./lighthouse-reports/mobile" },
  },
};
