import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Send, Phone, User, Wrench, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const services = [
  "Informática",
  "Notebooks",
  "CFTV",
  "Elétrica",
  "Redes",
  "Ar-Condicionado",
  "Celulares",
  "Games",
  "Impressoras",
  "Servidores",
  "Manutenção Predial",
  "Serviços Gerais"
];

export function QuickQuoteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.service) {
      toast.error("Por favor, preencha nome, telefone e serviço.");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Você precisa aceitar os Termos de Orçamento Pré-Aprovado.");
      return;
    }

    setIsLoading(true);
    
    // Format message for WhatsApp
    const message = `🔧 *ORÇAMENTO RÁPIDO*%0A%0A👤 *Nome:* ${formData.name}%0A📱 *Telefone:* ${formData.phone}%0A🛠️ *Serviço:* ${formData.service}%0A%0A📝 *Descrição do Problema:*%0A${formData.description || "Não informada"}`;
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/5541997452053?text=${message}`, "_blank");
    
    // Register terms acceptance
    try {
      await supabase.from("terms_acceptances").insert({
        name: formData.name,
        phone: formData.phone,
        service: formData.service,
      });
    } catch (e) {
      // non-blocking
    }

    toast.success("Redirecionando para o WhatsApp...");
    setIsLoading(false);
    setAcceptedTerms(false);
    setFormData({ name: "", phone: "", service: "", description: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <MessageCircle className="h-4 w-4" />
              Orçamento em Minutos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Solicite um <span className="text-primary">Orçamento Rápido</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Preencha o formulário e receba atendimento imediato via WhatsApp
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="grid gap-5">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="pl-10 h-12 bg-background"
                  required
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="(41) 9 9999-9999"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="pl-10 h-12 bg-background"
                  required
                />
              </div>

              {/* Service Select */}
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                  <SelectTrigger className="pl-10 h-12 bg-background">
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Textarea
                  placeholder="Descreva brevemente o problema ou serviço necessário..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="pl-10 min-h-[100px] bg-background resize-none"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms-quick"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  className="mt-0.5"
                />
                <label htmlFor="terms-quick" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                  Li e concordo com os{" "}
                  <a
                    href="/termos-orcamento-pre-aprovado"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline"
                  >
                    Termos de Orçamento Pré-Aprovado
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !acceptedTerms}
                className="w-full h-14 text-lg font-semibold bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2"
              >
                <Send className="h-5 w-5" />
                {isLoading ? "Enviando..." : "Solicitar Orçamento via WhatsApp"}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              💬 Atendimento exclusivo via WhatsApp: <a href={`https://wa.me/5541997452053`} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">(41) 9 9745-2053</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
