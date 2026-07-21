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
