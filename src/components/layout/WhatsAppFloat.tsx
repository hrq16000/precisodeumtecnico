import { MessageCircle } from "lucide-react";
import { isTriageEnabled, openTriage } from "@/lib/triageFlag";

export function WhatsAppFloat() {
  const whatsappNumber = "5541997452053";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;
  const triageOn = isTriageEnabled();

  if (triageOn) {
    return (
      <button
        type="button"
        onClick={() => openTriage({ source: "float" })}
        className="whatsapp-float"
        aria-label="Iniciar triagem técnica"
        data-wa-source="float"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline font-semibold">Falar com técnico</span>
      </button>
    );
  }

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chamar no WhatsApp"
      data-wa-source="float"
      data-wa-keep="footer"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:inline font-semibold">WhatsApp 24h</span>
    </a>
  );
}
