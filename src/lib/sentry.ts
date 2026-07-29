/**
 * Sentry init — opcional.
 * - Ativa somente se `VITE_SENTRY_DSN` estiver definido no build.
 * - Sem DSN, mantém stub inerte (não quebra build/dev).
 * - Sampling: 100% em dev, 10% em produção.
 * - Sem PII: query string removida, breadcrumbs de console filtradas.
 */
import * as Sentry from "@sentry/react";

const DSN = (import.meta.env.VITE_SENTRY_DSN as string | undefined)?.trim();
const ENV = import.meta.env.MODE ?? "development";
const RELEASE =
  (import.meta.env.VITE_APP_VERSION as string | undefined) ?? undefined;

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  if (!DSN) {
    // Sem DSN configurado — Sentry desabilitado por design.
    return;
  }
  try {
    Sentry.init({
      dsn: DSN,
      environment: ENV,
      release: RELEASE,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: ENV === "production" ? 0.1 : 1.0,
      sendDefaultPii: false,
      // Alertas críticos (configurados no dashboard Sentry → Alerts):
      //   1) "Critical error spike" → notifica Slack/Email quando
      //      `event.count():>10 in 5m` com `level:error OR level:fatal`.
      //   2) "Chunk load failure" → filtro `message:*Loading chunk*`
      //      OR `message:*Failed to fetch dynamically imported*`.
      //   Ambos usam as tags `route` e `environment` (env já é nativa)
      //   emitidas abaixo para roteamento por owner/página.
      beforeSend(event) {
        try {
          if (event.request?.url) {
            event.request.url = event.request.url.split("?")[0];
          }
          if (event.user) {
            // Nunca envia dados do usuário.
            delete event.user.email;
            delete event.user.ip_address;
            delete event.user.username;
          }
          // Tag `route` para roteamento de alertas por página.
          if (typeof window !== "undefined") {
            event.tags = {
              ...(event.tags ?? {}),
              route: window.location.pathname,
            };
          }
          // Marca erros de hidratação/chunk como críticos → dispara alerta #2.
          const msg = event.message ?? event.exception?.values?.[0]?.value ?? "";
          if (/Loading chunk|dynamically imported|ChunkLoadError|hydrat/i.test(msg)) {
            event.level = "error";
            event.tags = { ...(event.tags ?? {}), failure_kind: "chunk_or_hydration" };
          }
        } catch {
          /* noop */
        }
        return event;
      },
      beforeBreadcrumb(breadcrumb) {
        // Ignora breadcrumbs de console.log ruidosas
        if (breadcrumb.category === "console" && breadcrumb.level === "log") {
          return null;
        }
        return breadcrumb;
      },
    });
    initialized = true;
  } catch {
    // Nunca deixa o Sentry derrubar o app.
  }
}


export function captureHandledError(err: unknown, context?: Record<string, unknown>): void {
  if (!initialized) return;
  try {
    Sentry.captureException(err, context ? { extra: context } : undefined);
  } catch {
    /* noop */
  }
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;
