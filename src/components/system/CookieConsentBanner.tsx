import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConsent, setConsent, initConsent } from "@/lib/consent";
import { trackEvent } from "@/lib/analytics";

/**
 * Banner de consentimento (LGPD). Enquanto não houver aceite, nenhuma tag do
 * Google é carregada — apenas a telemetria local, sem PII.
 *
 * Rodada 3P — versão compacta e não bloqueante:
 *  - largura limitada (não vira faixa cheia no desktop);
 *  - respeita safe-area-inset-bottom no mobile;
 *  - marca `data-cookie-banner="open"` no <body> para que o botão flutuante
 *    suba enquanto o banner estiver visível (regra em index.css);
 *  - persistência, chave e eventos inalterados.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    initConsent();
    setVisible(getConsent() === null);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (visible) document.body.setAttribute("data-cookie-banner", "open");
    else document.body.removeAttribute("data-cookie-banner");
    return () => document.body.removeAttribute("data-cookie-banner");
  }, [visible]);

  if (!visible) return null;

  function decide(value: "granted" | "denied") {
    setConsent(value);
    setVisible(false);
    trackEvent("cookie_consent", { consent: value });
  }

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      data-cookie-consent
      className="fixed bottom-0 left-0 right-0 z-[60] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:right-auto sm:max-w-sm"
    >
      <div className="rounded-xl border border-border bg-card card-shadow p-3">
        <p className="flex items-start gap-2 text-xs leading-snug text-card-foreground">
          <Cookie className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            Usamos cookies de medição. As tags do Google só são ativadas após o aceite.{" "}
            <Link to="/politica-privacidade" className="font-medium text-primary underline">
              Política de Privacidade
            </Link>
            .
          </span>
        </p>
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 flex-1"
            onClick={() => decide("denied")}
          >
            Recusar
          </Button>
          <Button size="sm" className="min-h-11 flex-1" onClick={() => decide("granted")}>
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
