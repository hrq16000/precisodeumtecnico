import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { 
  FileText, Truck, Clock, Wrench, XCircle, CheckCircle, 
  AlertTriangle, Shield, Calendar, Package, MapPin, Phone
} from "lucide-react";
import { Link } from "react-router-dom";

const TermosOrcamento = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Termos de Orçamento Pré-Aprovado – Serviços Técnicos",
    "description": "Conheça os termos de diagnóstico, orçamento pré-aprovado, prazos de reparo, logística de coleta e política de cancelamento dos serviços técnicos.",
    "url": "https://precisodeumtecnico.com/termos-orcamento-pre-aprovado",
    "publisher": {
      "@type": "Organization",
      "name": "Preciso de Um Técnico"
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Termos de Orçamento Pré-Aprovado – Serviços Técnicos"
        description="Conheça os termos de diagnóstico, orçamento pré-aprovado, prazos de reparo, logística de coleta e política de cancelamento dos serviços técnicos."
        canonical="https://precisodeumtecnico.com/termos-orcamento-pre-aprovado"
        schema={schema}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield className="h-4 w-4" />
            Transparência e Segurança
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Termos e Condições
          </h1>
          <h2 className="text-xl md:text-2xl text-primary font-semibold mb-4">
            Orçamentos Pré-Aprovados
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Política de diagnóstico, reparo, prazos e logística de serviços técnicos
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl space-y-12 md:space-y-16">

          {/* 1 – Orçamento Pré-Aprovado */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                1 – Política de Orçamento Pré-Aprovado
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Para agilizar o atendimento e evitar atrasos no processo de diagnóstico técnico, os equipamentos 
                enviados para análise são cadastrados com orçamento pré-aprovado mínimo no valor de:
              </p>

              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 text-center my-6">
                <p className="text-sm text-muted-foreground mb-1">Orçamento pré-aprovado mínimo</p>
                <p className="text-4xl md:text-5xl font-bold text-primary">R$ 300,00</p>
              </div>

              <p>
                Esse valor representa uma <strong className="text-foreground">autorização inicial</strong> para diagnóstico técnico 
                e possível reparo do equipamento.
              </p>
              <p>
                Caso o valor final do reparo seja superior ao orçamento pré-aprovado mínimo, o cliente será 
                <strong className="text-foreground"> informado previamente</strong> para aprovação antes da execução do serviço.
              </p>

              <div className="flex items-start gap-3 bg-accent/50 rounded-lg p-4 mt-4">
                <AlertTriangle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">
                  <strong>Nenhum reparo adicional será realizado sem confirmação do cliente.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* 2 – Logística */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                2 – Logística de Coleta e Entrega
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Para garantir organização e eficiência operacional, os atendimentos seguem um sistema de 
                <strong className="text-foreground"> logística programada</strong>.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-accent/50 rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Coleta de Equipamentos</h3>
                  </div>
                  <p className="text-sm">Realizada mediante <strong className="text-foreground">agendamento prévio</strong></p>
                </div>
                <div className="bg-accent/50 rounded-xl p-5 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Entrega de Equipamentos</h3>
                  </div>
                  <p className="text-sm">Realizada mediante <strong className="text-foreground">agendamento após conclusão</strong> do serviço</p>
                </div>
              </div>

              <p>Essa logística permite:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Melhor organização das rotas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Maior segurança no transporte
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Controle de fluxo de equipamentos no laboratório técnico
                </li>
              </ul>
            </div>
          </div>

          {/* 3 – Prazos */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                3 – Prazos de Serviço
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Os prazos podem variar conforme:</p>
              <ul className="space-y-2 ml-1 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Complexidade do equipamento
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Disponibilidade de peças
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Fila de atendimento técnico
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Necessidade de importação de componentes
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mb-4">Prazos médios:</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-accent/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">Diagnóstico técnico</span>
                  </div>
                  <span className="font-bold text-primary text-sm md:text-base">7 a 15 dias</span>
                </div>
                <div className="flex items-center justify-between bg-accent/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">Reparo ou manutenção</span>
                  </div>
                  <span className="font-bold text-primary text-sm md:text-base">20 a 60 dias úteis</span>
                </div>
                <div className="flex items-center justify-between bg-accent/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">Entrega após conclusão</span>
                  </div>
                  <span className="font-bold text-primary text-sm md:text-base">5 a 7 dias úteis</span>
                </div>
              </div>

              <p className="text-sm mt-4 italic">
                Os prazos informados são estimativas médias e podem sofrer variações dependendo do tipo de equipamento 
                ou complexidade do reparo.
              </p>
            </div>
          </div>

          {/* 4 – Compromisso */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                4 – Compromisso com o Serviço
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Os equipamentos enviados para análise devem ser encaminhados com 
                <strong className="text-foreground"> real intenção de reparo</strong>.
              </p>
              <p>Durante o diagnóstico podem ser realizados:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Testes técnicos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Desmontagem parcial
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Análise de componentes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Procedimentos de verificação elétrica ou eletrônica
                </li>
              </ul>
              <p>
                Esses procedimentos fazem parte do processo técnico necessário para identificar a solução adequada.
              </p>
            </div>
          </div>

          {/* 5 – Cancelamento */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-destructive/10 p-3 rounded-xl">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                5 – Cancelamento ou Desistência
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Caso o cliente opte por cancelar o serviço ou desistir do reparo após a realização do diagnóstico, 
                será cobrada uma taxa de diagnóstico no valor de:
              </p>

              <div className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-6 text-center my-6">
                <p className="text-sm text-muted-foreground mb-1">Taxa de diagnóstico</p>
                <p className="text-4xl md:text-5xl font-bold text-destructive">R$ 90,00</p>
              </div>

              <p>Essa taxa cobre os custos técnicos envolvidos em:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Análise técnica
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Testes realizados
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Tempo de diagnóstico
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Manipulação e avaliação do equipamento
                </li>
              </ul>
            </div>
          </div>

          {/* 6 – Aceitação */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                6 – Aceitação dos Termos
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Ao solicitar:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Coleta de equipamento
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Diagnóstico técnico
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Envio para análise
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  Orçamento ou reparo
                </li>
              </ul>
              <p>
                O cliente declara estar <strong className="text-foreground">ciente e de acordo</strong> com estes 
                Termos e Condições de Serviço.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Tem dúvidas sobre nossos termos?</p>
            <a
              href="https://wa.me/5541997452053?text=Olá! Tenho dúvidas sobre os termos de orçamento pré-aprovado."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Phone className="h-5 w-5" />
              Fale Conosco via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermosOrcamento;
