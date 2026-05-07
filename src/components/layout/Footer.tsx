import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";

const services = [
  { name: "Informática", href: "/servicos/informatica" },
  { name: "Notebooks", href: "/servicos/notebooks" },
  { name: "CFTV / Câmeras", href: "/servicos/cftv" },
  { name: "Elétrica", href: "/servicos/eletrica" },
  { name: "Redes e Wi-Fi", href: "/servicos/redes" },
  { name: "Ar-Condicionado", href: "/servicos/ar-condicionado" },
  { name: "Manutenção Predial", href: "/servicos/manutencao-predial" },
];

const regions = [
  { name: "Curitiba", href: "/regioes/curitiba" },
  { name: "São José dos Pinhais", href: "/regioes/sao-jose-dos-pinhais" },
  { name: "Pinhais", href: "/regioes/pinhais" },
  { name: "Colombo", href: "/regioes/colombo" },
  { name: "Araucária", href: "/regioes/araucaria" },
  { name: "Campo Largo", href: "/regioes/campo-largo" },
];

export function Footer() {
  const whatsappNumber = "5541997452053";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo variant="light" size="lg" />
            </div>
            <p className="text-background/70 mb-6 text-sm leading-relaxed">
              A maior rede de técnicos especializados do Brasil. Atendimento 24 horas via WhatsApp para Curitiba e Região Metropolitana.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/precisodeumtecnico/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/PrecisoDeUmTecnico" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Serviços</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link to={service.href} className="text-background/70 hover:text-primary transition-colors text-sm">
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/servicos" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                  Ver todos →
                </Link>
              </li>
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Regiões Atendidas</h3>
            <ul className="space-y-3">
              {regions.map((region) => (
                <li key={region.name}>
                  <Link to={region.href} className="text-background/70 hover:text-primary transition-colors text-sm">
                    {region.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/regioes" className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                  Todas as regiões →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-background/70">WhatsApp 24h</span>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary transition-colors">
                    (41) 9 9745-2053
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-background/70">Telefone</span>
                  <a href="tel:+5541997452053" className="font-semibold hover:text-primary transition-colors">
                    (41) 9 9745-2053
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-background/70">Atendimento Presencial</span>
                  <span className="font-semibold">08h às 22h</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-background/70">Área de Atendimento</span>
                  <span className="font-semibold">Curitiba e Região Metropolitana</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm text-center md:text-left">
              © {currentYear} Preciso de Um Técnico. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/politica-privacidade" className="text-background/60 hover:text-background text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos-uso" className="text-background/60 hover:text-background text-sm transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
