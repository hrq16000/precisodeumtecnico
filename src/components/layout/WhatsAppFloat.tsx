import { MessageCircle } from "lucide-react";
import { isTriageEnabled, openTriage } from "@/lib/triageFlag";
import { buildWhatsAppUrl, readStoredLocation, currentSourcePage } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const triageOn = isTriageEnabled();

  if (triageOn) {
    return (
      <button
        type="button"
        onClick={() => openTriage({ source: "float" })}
        className="whatsapp-float"
        aria-label="Iniciar triagem técnica"
        data-wa-source="float"
        data-service="assistência técnica"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline font-semibold">Falar com técnico</span>
      </button>
    );
  }

  const loc = readStoredLocation();
  const whatsappLink = buildWhatsAppUrl({ ...loc, sourcePage: currentSourcePage() });
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chamar no WhatsApp (botão flutuante)"
      data-wa-source="float"
      data-service="assistência técnica"
      {...(loc.city ? { "data-city": loc.city } : {})}
      {...(loc.neighborhood ? { "data-neighborhood": loc.neighborhood } : {})}
      data-wa-keep="footer"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:inline font-semibold">WhatsApp 24h</span>
    </a>
  );
}
