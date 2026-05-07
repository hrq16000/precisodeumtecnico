import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

const services = [
  { name: "Informática", href: "/servicos/informatica", description: "Manutenção e suporte em computadores" },
  { name: "Notebooks", href: "/servicos/notebooks", description: "Conserto e upgrade de notebooks" },
  { name: "CFTV / Câmeras", href: "/servicos/cftv", description: "Instalação e manutenção de câmeras" },
  { name: "Elétrica", href: "/servicos/eletrica", description: "Serviços elétricos residenciais e comerciais" },
  { name: "Redes", href: "/servicos/redes", description: "Configuração de redes e Wi-Fi" },
  { name: "Ar-Condicionado", href: "/servicos/ar-condicionado", description: "Instalação e manutenção" },
  { name: "Celulares", href: "/servicos/celulares", description: "Reparo de smartphones e tablets" },
  { name: "Games", href: "/servicos/games", description: "Conserto de videogames e consoles" },
];

const regions = [
  { name: "Curitiba", href: "/regioes/curitiba" },
  { name: "São José dos Pinhais", href: "/regioes/sao-jose-dos-pinhais" },
  { name: "Pinhais", href: "/regioes/pinhais" },
  { name: "Todas as Regiões", href: "/regioes" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const whatsappNumber = "5541997452053";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá! Preciso de um técnico.`;

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 30);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary text-primary-foreground py-2">
        <div className="container-custom">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Atendimento 24h via WhatsApp
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Curitiba e Região Metropolitana
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="tel:+5541997452053" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                (41) 9 9745-2053
              </a>
              <a href="mailto:contato@precisodeumtecnico.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                contato@precisodeumtecnico.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container-custom">
          <div
            className={cn(
              "flex items-center justify-between gap-2 transition-[height] duration-500 ease-out",
              scrolled ? "h-16 sm:h-20 md:h-24 lg:h-24" : "h-20 sm:h-24 md:h-28 lg:h-32",
            )}
          >
            {/* Logo */}
            <Logo
              variant="dark"
              size="lg"
              compact={scrolled}
              priority
              className="shrink-0 max-w-[60%] sm:max-w-none"
            />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground focus:outline-none",
                      location.pathname === "/" && "bg-secondary text-foreground"
                    )}>
                      Início
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Serviços</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {services.map((service) => (
                        <li key={service.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={service.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{service.name}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {service.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="col-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/servicos"
                            className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors bg-primary/5 hover:bg-primary/10 text-primary font-medium text-center"
                          >
                            Ver todos os serviços →
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Regiões</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-4">
                      {regions.map((region) => (
                        <li key={region.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={region.href}
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground font-medium"
                            >
                              {region.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/blog">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground focus:outline-none",
                      location.pathname.startsWith("/blog") && "bg-secondary text-foreground"
                    )}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/precos">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground focus:outline-none",
                      location.pathname === "/precos" && "bg-secondary text-foreground"
                    )}>
                      Preços
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/sobre">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground focus:outline-none",
                      location.pathname === "/sobre" && "bg-secondary text-foreground"
                    )}>
                      Sobre
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contato">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground focus:outline-none",
                      location.pathname === "/contato" && "bg-secondary text-foreground"
                    )}>
                      Contato
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+5541997452053" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">(41) 99745-2053</span>
            </a>
            <Button variant="whatsapp" size="sm" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
              <nav className="flex flex-col gap-2">
                <Link to="/" className="px-4 py-2 rounded-md hover:bg-secondary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Início
                </Link>
                <Link to="/servicos" className="px-4 py-2 rounded-md hover:bg-secondary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Serviços
                </Link>
                <Link to="/regioes" className="px-4 py-2 rounded-md hover:bg-secondary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Regiões Atendidas
                </Link>
                <Link to="/precos" className="px-4 py-2 rounded-md hover:bg-secondary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Preços
                </Link>
                <Link to="/blog" className="px-4 py-2 rounded-md hover:bg-secondary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Blog
                </Link>
                <Link to="/sobre" className="px-4 py-2 rounded-md hover:bg-secondary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Sobre
                </Link>
                <Link to="/contato" className="px-4 py-2 rounded-md hover:bg-secondary transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Contato
                </Link>
                <div className="pt-4 mt-2 border-t border-border/50 flex flex-col gap-2">
                  <a href="tel:+5541997452053" className="flex items-center gap-2 px-4 py-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    (41) 9 9745-2053
                  </a>
                  <Button variant="whatsapp" className="mx-4" asChild>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" />
                      Chamar no WhatsApp
                    </a>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
