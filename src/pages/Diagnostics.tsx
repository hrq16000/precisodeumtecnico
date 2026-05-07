import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

interface SchemaEntry {
  raw: string;
  parsed: unknown;
  type: string;
  errors: string[];
  warnings: string[];
}

const REQUIRED_BY_TYPE: Record<string, string[]> = {
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
  Article: ["headline", "datePublished"],
  BlogPosting: ["headline", "datePublished"],
  Service: ["name", "provider"],
  LocalBusiness: ["name", "address"],
  Review: ["author", "reviewRating"],
  AggregateRating: ["ratingValue", "reviewCount"],
};

function validate(parsed: unknown): { type: string; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!parsed || typeof parsed !== "object") {
    return { type: "unknown", errors: ["Não é um objeto JSON válido."], warnings };
  }
  const obj = parsed as Record<string, unknown>;
  const type = String(obj["@type"] ?? "unknown");
  if (!obj["@context"]) errors.push("Faltando @context");
  if (!obj["@type"]) errors.push("Faltando @type");
  const required = REQUIRED_BY_TYPE[type];
  if (required) {
    for (const k of required) {
      if (obj[k] === undefined) errors.push(`Faltando "${k}" para @type=${type}`);
    }
  }
  if (type === "FAQPage" && Array.isArray(obj.mainEntity)) {
    obj.mainEntity.forEach((q, i) => {
      const qq = q as Record<string, unknown>;
      if (!qq.name) errors.push(`mainEntity[${i}].name ausente`);
      if (!qq.acceptedAnswer) errors.push(`mainEntity[${i}].acceptedAnswer ausente`);
    });
  }
  if (type === "BreadcrumbList" && Array.isArray(obj.itemListElement)) {
    obj.itemListElement.forEach((it, i) => {
      const e = it as Record<string, unknown>;
      if (!e.position) warnings.push(`itemListElement[${i}].position ausente`);
      if (!e.name) warnings.push(`itemListElement[${i}].name ausente`);
    });
  }
  return { type, errors, warnings };
}

function readSchemasFromDoc(doc: Document): SchemaEntry[] {
  const nodes = Array.from(doc.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'));
  return nodes.map((n) => {
    const raw = n.textContent ?? "";
    try {
      const parsed = JSON.parse(raw);
      const v = validate(parsed);
      return { raw, parsed, ...v };
    } catch (e) {
      return { raw, parsed: null, type: "invalid", errors: [`JSON inválido: ${(e as Error).message}`], warnings: [] };
    }
  });
}

function readMetaFromDoc(doc: Document, name: string) {
  const el =
    doc.querySelector(`meta[property="${name}"]`) ||
    doc.querySelector(`meta[name="${name}"]`);
  return el?.getAttribute("content") ?? null;
}

export default function Diagnostics() {
  const [schemas, setSchemas] = useState<SchemaEntry[]>([]);
  const [target, setTarget] = useState<string>(() => {
    const p = new URLSearchParams(window.location.search).get("path");
    return p ?? "/";
  });
  const [loadedFor, setLoadedFor] = useState<string>("/diagnostics");
  const [meta, setMeta] = useState<Record<string, string | null>>({});
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const collect = (doc: Document, path: string) => {
    setSchemas(readSchemasFromDoc(doc));
    setMeta({
      title: doc.title,
      description: readMetaFromDoc(doc, "description"),
      canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      "og:title": readMetaFromDoc(doc, "og:title"),
      "og:description": readMetaFromDoc(doc, "og:description"),
      "og:image": readMetaFromDoc(doc, "og:image"),
      "og:type": readMetaFromDoc(doc, "og:type"),
      "twitter:card": readMetaFromDoc(doc, "twitter:card"),
      "twitter:image": readMetaFromDoc(doc, "twitter:image"),
    });
    setLoadedFor(path);
  };

  const refresh = () => collect(document, window.location.pathname + window.location.search);

  const auditPath = (path: string) => {
    if (!path || path === "/diagnostics" || path.startsWith("/diagnostico")) {
      refresh();
      setIframeUrl(null);
      return;
    }
    setLoading(true);
    setIframeUrl(path);
  };

  const onIframeLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) {
      setLoading(false);
      return;
    }
    // Helmet populates head async — wait one tick.
    setTimeout(() => {
      collect(doc, iframeUrl ?? "");
      setLoading(false);
    }, 250);
  };

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("path");
    const t = setTimeout(() => {
      if (initial && initial !== "/" && !initial.startsWith("/diagnostic")) {
        setTarget(initial);
        auditPath(initial);
      } else {
        refresh();
      }
    }, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalErrors = schemas.reduce((a, s) => a + s.errors.length, 0);
  const totalWarnings = schemas.reduce((a, s) => a + s.warnings.length, 0);

  return (
    <Layout>
      <Helmet>
        <title>Diagnóstico SEO | Schemas & Open Graph</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Diagnóstico SEO</h1>
          <p className="text-muted-foreground mb-6">
            Lista todos os JSON-LD e meta-tags renderizados. Informe um caminho (por exemplo
            <code> /blog/algum-post</code>) e clique em "Auditar URL" — a rota é carregada num
            iframe oculto e as tags são extraídas automaticamente.
          </p>

          <Card className="p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="/blog/algum-post"
                className="flex-1 px-3 py-2 rounded border border-border bg-background"
              />
              <Button onClick={() => auditPath(target)} disabled={loading}>
                {loading ? "Carregando..." : "Auditar URL"}
              </Button>
              <Button variant="outline" onClick={refresh}>Reescanear esta aba</Button>
              <Button variant="ghost" onClick={() => window.open(target, "_blank", "noopener,noreferrer")}>
                Abrir
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Auditando: <code>{loadedFor}</code>
            </p>
            {iframeUrl && (
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                onLoad={onIframeLoad}
                title="audit-frame"
                className="sr-only"
                aria-hidden
                style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
              />
            )}
          </Card>

          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Schemas encontrados</p>
              <p className="text-3xl font-bold">{schemas.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Erros</p>
              <p className={`text-3xl font-bold ${totalErrors ? "text-destructive" : ""}`}>{totalErrors}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Avisos</p>
              <p className="text-3xl font-bold">{totalWarnings}</p>
            </Card>
          </div>

          <h2 className="font-display text-xl font-bold mb-3">Open Graph & Meta</h2>
          <Card className="p-4 mb-8">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(meta).map(([k, v]) => (
                  <tr key={k} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs text-muted-foreground align-top">{k}</td>
                    <td className="py-2 break-all">
                      {v ? v : <span className="text-destructive">— ausente —</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <h2 className="font-display text-xl font-bold mb-3">Schemas JSON-LD</h2>
          <div className="space-y-4">
            {schemas.map((s, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge>{s.type}</Badge>
                  {s.errors.length === 0 ? (
                    <Badge variant="secondary">válido</Badge>
                  ) : (
                    <Badge variant="destructive">{s.errors.length} erro(s)</Badge>
                  )}
                  {s.warnings.length > 0 && <Badge variant="outline">{s.warnings.length} aviso(s)</Badge>}
                </div>
                {s.errors.length > 0 && (
                  <ul className="text-sm text-destructive list-disc pl-5 mb-2">
                    {s.errors.map((er, j) => <li key={j}>{er}</li>)}
                  </ul>
                )}
                {s.warnings.length > 0 && (
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mb-2">
                    {s.warnings.map((w, j) => <li key={j}>{w}</li>)}
                  </ul>
                )}
                <details>
                  <summary className="cursor-pointer text-xs text-muted-foreground">Ver JSON</summary>
                  <pre className="mt-2 text-xs bg-secondary/40 p-3 rounded overflow-auto max-h-96">
{JSON.stringify(s.parsed, null, 2)}
                  </pre>
                </details>
              </Card>
            ))}
            {schemas.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhum schema encontrado nesta aba.</p>
            )}
          </div>

          <div className="mt-8 text-xs text-muted-foreground">
            Dica: também é possível validar externamente em
            {" "}
            <a className="underline" href="https://validator.schema.org/" target="_blank" rel="noopener noreferrer">validator.schema.org</a>
            {" "}e{" "}
            <a className="underline" href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer">Rich Results Test</a>.
          </div>
        </div>
      </section>
    </Layout>
  );
}
