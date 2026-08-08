/**
 * Gera public/ads.txt a partir de vendedores autorizados declarados em variáveis
 * de ambiente. Fail-closed por design:
 *
 * - Sem ADSENSE_PUBLISHER_ID (e sem ADS_TXT_EXTRA_LINES), NENHUM arquivo é criado.
 *   Um ads.txt vazio/só com comentários invalidaria todo o inventário do domínio,
 *   o que é pior do que não ter arquivo.
 * - O publisher ID é validado no formato `pub-` + 16 dígitos antes de ser escrito.
 *
 * Uso:
 *   ADSENSE_PUBLISHER_ID=pub-0000000000000000 npx tsx scripts/write-ads-txt.ts
 *
 * Linhas extras (outras redes/revendedores) em ADS_TXT_EXTRA_LINES, separadas por `;`.
 */
import { writeFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve(process.cwd(), "public/ads.txt");
const PUB_RE = /^pub-\d{16}$/;

function main() {
  const raw = (process.env.ADSENSE_PUBLISHER_ID ?? "").trim();
  const pub = raw.replace(/^ca-/, "");
  const extra = (process.env.ADS_TXT_EXTRA_LINES ?? "")
    .split(";")
    .map((l) => l.trim())
    .filter(Boolean);

  const lines: string[] = [];

  if (pub) {
    if (!PUB_RE.test(pub)) {
      console.error(
        `[ads-txt] ADSENSE_PUBLISHER_ID inválido: "${raw}". Formato esperado: pub-0000000000000000.`,
      );
      process.exit(1);
    }
    lines.push(`google.com, ${pub}, DIRECT, f08c47fec0942fa0`);
  }

  lines.push(...extra);

  if (lines.length === 0) {
    if (existsSync(OUT)) unlinkSync(OUT);
    console.log(
      "[ads-txt] Nenhum vendedor autorizado configurado — ads.txt NÃO foi gerado (fail-closed).",
    );
    return;
  }

  const header = [
    "# ads.txt - vendedores autorizados a comercializar o inventario deste dominio.",
    "# Politica: https://precisodeumtecnico.com/politica-de-anuncios",
    `# Gerado automaticamente em ${new Date().toISOString().slice(0, 10)}.`,
  ];

  writeFileSync(OUT, `${[...header, ...lines].join("\n")}\n`, "utf8");
  console.log(`[ads-txt] public/ads.txt gerado com ${lines.length} vendedor(es) autorizado(s).`);
}

main();
