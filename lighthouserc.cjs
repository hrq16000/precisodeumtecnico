module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:4173/assistencia-tecnica-curitiba"],
      startServerCommand: "bun run preview --port 4173",
      startServerReadyPattern: "Local:",
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
        "interactive": ["warn", { maxNumericValue: 3500 }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
};
