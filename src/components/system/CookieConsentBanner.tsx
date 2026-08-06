import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConsent, setConsent, initConsent } from "@/lib/consent";
import { trackEvent } from "@/lib/analytics";

/**
 * Banner de consentimento (LGPD). Enquanto não houver aceite, nenhuma tag do
 * Google é carregada — apenas a telemetria local, sem PII.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    initConsent();
    setVisible(getConsent() === null);
  }, []);

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
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="container-custom">
        <div className="rounded-2xl border border-border bg-card card-shadow p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
          <Cookie className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
          <p className="text-sm text-card-foreground flex-1">
            Usamos cookies de medição para entender de onde vêm os atendimentos. Só ativamos as
            tags do Google depois do seu aceite. Veja a{" "}
            <Link to="/politica-privacidade" className="text-primary underline font-medium">
              Política de Privacidade e LGPD
            </Link>
            .
          </p>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              className="min-h-[48px] flex-1 md:flex-none"
              onClick={() => decide("denied")}
            >
              Recusar
            </Button>
            <Button className="min-h-[48px] flex-1 md:flex-none" onClick={() => decide("granted")}>
              Aceitar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
