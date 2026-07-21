// Performance budgets compartilhados entre Lighthouse desktop e mobile.
// Objetivo: garantir que a otimização da galeria WebP (rodada 27.6) não seja
// revertida por adição involuntária de assets pesados em builds futuros.
//
// Todos os limites são por rota (evaluada no lighthouserc.*).
module.exports = [
  {
    path: "/*",
    resourceSizes: [
      { resourceType: "document", budget: 60 },     // KB — HTML shell
      { resourceType: "script", budget: 350 },      // KB — JS total
      { resourceType: "stylesheet", budget: 90 },   // KB — CSS total
      { resourceType: "image", budget: 500 },       // KB — imagens somadas (galeria WebP + hero)
      { resourceType: "font", budget: 150 },        // KB — fontes
      { resourceType: "total", budget: 1400 },      // KB — teto geral por rota
    ],
    resourceCounts: [
      { resourceType: "third-party", budget: 10 },
      { resourceType: "image", budget: 25 },
    ],
  },
];
