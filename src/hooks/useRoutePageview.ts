import { useEffect, useRef } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { pushDataLayerEvent, type RouteType } from "@/lib/dataLayer";

/**
 * useRoutePageview — Rodada 25.1 Bloco B.
 *
 * Emite exatamente um `virtual_page_view` por pathname (refresh inicial +
 * cada navegação SPA). Não emite em rotas internas. Query/hash não geram
 * novo evento. Título capturado após microtask para pegar Helmet atualizado.
 *
 * StrictMode-safe: dedupe do próprio dataLayer + guarda `lastPathRef`.
 */

const INTERNAL_ROUTES = new Set(["/admin", "/auth", "/diagnostics", "/diagnostico", "/triagem-preview"]);

interface Resolved {
  route_type: RouteType;
  service?: string;
  city?: string;
  neighborhood?: string;
}

/**
 * Resolver leve — reconhece formato do pathname sem importar datasets
 * pesados. Para matrizes válidas vs. fallback, a página em si é a fonte
 * de verdade; aqui marcamos `matrix_nacional` pelo formato e a validação
 * real fica na página (que pode disparar noindex/canonical).
 */
export function resolveRouteContext(pathname: string): Resolved {
  if (pathname === "/") return { route_type: "home" };
  if (pathname === "/404" || pathname === "*") return { route_type: "not_found" };

  const institutional = new Set([
    "/sobre",
    "/contato",
    "/faq",
    "/dados-da-empresa",
    "/termos-orcamento",
    "/termos-orcamento-pre-aprovado",
    "/precos",
    "/blog",
    "/servicos",
    "/regioes",
    "/assistencia-tecnica",
    "/assistencia-tecnica-curitiba",
    "/atendimento-nacional",
  ]);
  if (institutional.has(pathname)) return { route_type: "institutional" };

  // Blog posts / categorias.
  if (pathname.startsWith("/blog/")) return { route_type: "institutional" };

  // Serviço detalhe: /servicos/:slug
  let m = matchPath({ path: "/servicos/:slug", end: true }, pathname);
  if (m) return { route_type: "service", service: m.params.slug };

  // Serviço em cidade: /servico-em/:city/:service
  m = matchPath({ path: "/servico-em/:city/:service", end: true }, pathname);
  if (m) return { route_type: "service_city", city: m.params.city, service: m.params.service };

  // Matriz nacional (serviço em bairro): /servico-em-nacional/:city/:bairro/:service
  m = matchPath({ path: "/servico-em-nacional/:city/:bairro/:service", end: true }, pathname);
  if (m) {
    return {
      route_type: "matrix_nacional",
      city: m.params.city,
      neighborhood: m.params.bairro,
      service: m.params.service,
    };
  }

  // Atendimento nacional cidade/bairro.
  m = matchPath({ path: "/atendimento-nacional/:city/:bairro", end: true }, pathname);
  if (m) return { route_type: "national_neighborhood", city: m.params.city, neighborhood: m.params.bairro };
  m = matchPath({ path: "/atendimento-nacional/:slug", end: true }, pathname);
  if (m) return { route_type: "national_city", city: m.params.slug };

  // Região / bairro Curitiba.
  m = matchPath({ path: "/regioes/:city/:neighborhood", end: true }, pathname);
  if (m) return { route_type: "region", city: m.params.city, neighborhood: m.params.neighborhood };
  m = matchPath({ path: "/regioes/:city", end: true }, pathname);
  if (m) return { route_type: "region", city: m.params.city };

  return { route_type: "not_found" };
}

export function useRoutePageview(): void {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (INTERNAL_ROUTES.has(path)) {
      lastPathRef.current = path;
      return;
    }
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;

    const ctx = resolveRouteContext(path);
    // Aguarda microtask para capturar título atualizado por Helmet.
    const rafId = window.requestAnimationFrame(() => {
      pushDataLayerEvent({
        event: "virtual_page_view",
        page_path: path,
        page_title: typeof document !== "undefined" ? document.title : undefined,
        route_type: ctx.route_type,
        service: ctx.service,
        city: ctx.city,
        neighborhood: ctx.neighborhood,
      });
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [location.pathname]);
}
