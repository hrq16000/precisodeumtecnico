/**
 * Renders example routes with the real Router and asserts every JSON-LD block
 * passes the same basic validator used by the /diagnostics page. If the build
 * generates broken Article / FAQ / Breadcrumb / Service / BlogPosting schemas,
 * this test fails and the build is blocked.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import BlogCategory from "@/pages/BlogCategory";
import ServicoDetalhe from "@/pages/ServicoDetalhe";
import ServicoCidade from "@/pages/ServicoCidade";
import RegiaoDetalhe from "@/pages/RegiaoDetalhe";
import Precos from "@/pages/Precos";
import { allBlogPosts } from "@/data/blog";
import { servicesData } from "@/data/services";
import { citiesData } from "@/data/regions";

const REQUIRED: Record<string, string[]> = {
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
  Article: ["headline", "datePublished"],
  BlogPosting: ["headline"],
  Service: ["name"],
  LocalBusiness: ["name"],
  Blog: ["name"],
};

function validate(parsed: unknown): string[] {
  const errors: string[] = [];
  if (!parsed || typeof parsed !== "object") return ["not an object"];
  const obj = parsed as Record<string, unknown>;
  if (!obj["@context"]) errors.push("missing @context");
  if (!obj["@type"]) errors.push("missing @type");
  const t = String(obj["@type"]);
  for (const k of REQUIRED[t] ?? []) {
    if (obj[k] === undefined) errors.push(`missing ${k} for @type=${t}`);
  }
  if (t === "FAQPage" && Array.isArray(obj.mainEntity)) {
    obj.mainEntity.forEach((q, i) => {
      const qq = q as Record<string, unknown>;
      if (!qq.name) errors.push(`mainEntity[${i}].name`);
      if (!qq.acceptedAnswer) errors.push(`mainEntity[${i}].acceptedAnswer`);
    });
  }
  return errors;
}

function getSchemas(): { type: string; errors: string[] }[] {
  const nodes = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  return nodes.map((n) => {
    try {
      const parsed = JSON.parse(n.textContent ?? "");
      return { type: String((parsed as Record<string, unknown>)["@type"] ?? "?"), errors: validate(parsed) };
    } catch (e) {
      return { type: "invalid-json", errors: [(e as Error).message] };
    }
  });
}

function renderRoute(initial: string, path: string, element: JSX.Element) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <HelmetProvider>
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={[initial]}>
          <Routes>
            <Route path={path} element={element} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>,
  );
}

async function expectAllSchemasValid() {
  await waitFor(() => {
    const ss = getSchemas();
    expect(ss.length).toBeGreaterThan(0);
  });
  // Helmet may flush in two ticks
  await new Promise((r) => setTimeout(r, 30));
  const ss = getSchemas();
  for (const s of ss) {
    expect(s.errors, `${s.type} -> ${s.errors.join(", ")}`).toEqual([]);
  }
}

describe("JSON-LD validity across key routes", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("/blog (Blog index)", async () => {
    renderRoute("/blog", "/blog", <Blog />);
    await expectAllSchemasValid();
  });

  it("/blog/:slug (BlogPost)", async () => {
    const post = allBlogPosts[0];
    renderRoute(`/blog/${post.slug}`, "/blog/:slug", <BlogPost />);
    await expectAllSchemasValid();
  });

  it("/blog/categoria/:slug (BlogCategory)", async () => {
    renderRoute("/blog/categoria/informatica", "/blog/categoria/:slug", <BlogCategory />);
    await expectAllSchemasValid();
  });

  it("/servicos/:slug (ServicoDetalhe)", async () => {
    const slug = Object.keys(servicesData)[0];
    renderRoute(`/servicos/${slug}`, "/servicos/:slug", <ServicoDetalhe />);
    await expectAllSchemasValid();
  });

  it("/regioes/:slug (RegiaoDetalhe)", async () => {
    const slug = Object.keys(citiesData)[0];
    renderRoute(`/regioes/${slug}`, "/regioes/:slug", <RegiaoDetalhe />);
    await expectAllSchemasValid();
  });

  it("/servico-em/:city/:service (ServicoCidade)", async () => {
    const city = Object.keys(citiesData)[0];
    const service = Object.keys(servicesData)[0];
    renderRoute(`/servico-em/${city}/${service}`, "/servico-em/:city/:service", <ServicoCidade />);
    await expectAllSchemasValid();
  });

  it("/precos (Precos hub)", async () => {
    renderRoute("/precos", "/precos", <Precos />);
    await expectAllSchemasValid();
  });
});
