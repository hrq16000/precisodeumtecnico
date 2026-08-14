import { Suspense } from "react";
import { lazyRoute as lazy } from "@/lib/lazyRoute";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GlobalReveal } from "@/components/GlobalReveal";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
// Keep Index and NotFound eager: Index is the LCP page; NotFound is trivial.
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { GlobalTriageLauncher } from "@/components/triage/GlobalTriageLauncher";
import { E2ETriageBridge } from "@/components/triage/E2ETriageBridge";

import { SmartLocationPrompt } from "@/components/layout/SmartLocationPrompt";
import { useRoutePageview } from "@/hooks/useRoutePageview";

function RoutePageviewTracker() {
  useRoutePageview();
  return null;
}

// Lazy-load every non-critical route to shrink the initial bundle.
const Servicos = lazy(() => import("./pages/Servicos"));
const ServicoDetalhe = lazy(() => import("./pages/ServicoDetalhe"));
const Regioes = lazy(() => import("./pages/Regioes"));
const RegiaoDetalhe = lazy(() => import("./pages/RegiaoDetalhe"));
const BairroDetalhe = lazy(() => import("./pages/BairroDetalhe"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Contato = lazy(() => import("./pages/Contato"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const TermosOrcamento = lazy(() => import("./pages/TermosOrcamento"));
const TermosDeUso = lazy(() => import("./pages/TermosDeUso"));
const PoliticaDeAnuncios = lazy(() => import("./pages/PoliticaDeAnuncios"));
const PoliticaDeCookies = lazy(() => import("./pages/PoliticaDeCookies"));
const Anuncie = lazy(() => import("./pages/Anuncie"));
const AreasAtendidas = lazy(() => import("./pages/AreasAtendidas"));
const StatusAnuncios = lazy(() => import("./pages/StatusAnuncios"));
const PoliticaPecasCliente = lazy(() => import("./pages/PoliticaPecasCliente"));
const CreditosDeImagens = lazy(() => import("./pages/CreditosDeImagens"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const ComoAvaliar = lazy(() => import("./pages/ComoAvaliar"));
const Avaliacoes = lazy(() => import("./pages/Avaliacoes"));
const StatusOrdemServico = lazy(() => import("./pages/StatusOrdemServico"));
const ExclusaoDeDados = lazy(() => import("./pages/ExclusaoDeDados"));
const GuiaEmpresarial = lazy(() => import("./pages/GuiaEmpresarial"));

const ComoFuncionaPcGamer = lazy(() => import("./pages/ComoFuncionaPcGamer"));
const AvaliarAtendimento = lazy(() => import("./pages/AvaliarAtendimento"));
const ServicoCidade = lazy(() => import("./pages/ServicoCidade"));
const Precos = lazy(() => import("./pages/Precos"));
const ComoFunciona = lazy(() => import("./pages/ComoFunciona"));
const GuiaTecnicoInformatica = lazy(() => import("./pages/GuiaTecnicoInformatica"));
const ComoEscolherTecnico = lazy(() => import("./pages/ComoEscolherTecnico"));
const Busca = lazy(() => import("./pages/Busca"));
const MensagensProntas = lazy(() => import("./pages/MensagensProntas"));
const ManifestoDeProvas = lazy(() => import("./pages/ManifestoDeProvas"));
const PainelGoogleBusiness = lazy(() => import("./pages/PainelGoogleBusiness"));
const PainelConversao = lazy(() => import("./pages/PainelConversao"));
const AreaAtendimentoCuritiba = lazy(() => import("./pages/AreaAtendimentoCuritiba"));
const AtendimentoUrgente = lazy(() => import("./pages/AtendimentoUrgente"));
const ChecklistsReparo = lazy(() => import("./pages/ChecklistsReparo"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const Diagnostics = lazy(() => import("./pages/Diagnostics"));
const AssistenciaTecnicaCuritiba = lazy(() => import("./pages/AssistenciaTecnicaCuritiba"));
const AssistenciaTecnica = lazy(() => import("./pages/AssistenciaTecnica"));
const AtendimentoNacional = lazy(() => import("./pages/AtendimentoNacional"));
const CidadeNacional = lazy(() => import("./pages/CidadeNacional"));
const BairroNacional = lazy(() => import("./pages/BairroNacional"));
const ServicoBairroNacional = lazy(() => import("./pages/ServicoBairroNacional"));
const TrocaDeTelaTVCuritiba = lazy(() => import("./pages/TrocaDeTelaTVCuritiba"));
const ReparoSmartTVCuritiba = lazy(() => import("./pages/ReparoSmartTVCuritiba"));
const ConfiguracaoWifiCuritiba = lazy(() => import("./pages/ConfiguracaoWifiCuritiba"));
const ServicoBairroCuritiba = lazy(() => import("./pages/ServicoBairroCuritiba"));
const ServicoCidadeRegiao = lazy(() => import("./pages/ServicoCidadeRegiao"));
const ServicoCuritibaContratacao = lazy(() => import("./pages/ServicoCuritibaContratacao"));
const ServicoBairroCidadeRegiao = lazy(() => import("./pages/ServicoBairroCidadeRegiao"));

const TriagemPreview = lazy(() => import("./pages/TriagemPreview"));
const Faq = lazy(() => import("./pages/Faq"));
const DadosEmpresa = lazy(() => import("./pages/DadosEmpresa"));
const GestorResponsavel = lazy(() => import("./pages/GestorResponsavel"));
const KeywordServicePage = lazy(() => import("./pages/KeywordServicePage"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <GlobalReveal />
            <GlobalTriageLauncher />
            <E2ETriageBridge />

            <SmartLocationPrompt />
            <RoutePageviewTracker />

            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/dados-da-empresa" element={<DadosEmpresa />} />
                <Route path="/gestor-responsavel" element={<GestorResponsavel />} />

                <Route path="/servicos" element={<Servicos />} />
                <Route path="/servicos/pc-gamer/como-funciona" element={<ComoFuncionaPcGamer />} />
                <Route path="/servicos/troca-de-tela-tv-curitiba" element={<TrocaDeTelaTVCuritiba />} />
                <Route path="/servicos/reparo-smart-tv-curitiba" element={<ReparoSmartTVCuritiba />} />
                <Route path="/servicos/configuracao-wifi-curitiba" element={<ConfiguracaoWifiCuritiba />} />
                <Route path="/servicos/reparo-smart-tv/curitiba/:bairro" element={<ServicoBairroCuritiba service="reparo-smart-tv" />} />
                <Route path="/servicos/configuracao-wifi/curitiba/:bairro" element={<ServicoBairroCuritiba service="configuracao-wifi" />} />
                {/* RMC — bairros dedicados por serviço (SJP + Pinhais) */}
                <Route path="/servicos/reparo-smart-tv/sao-jose-dos-pinhais/:bairro" element={<ServicoBairroCidadeRegiao cidade="sao-jose-dos-pinhais" service="reparo-smart-tv" />} />
                <Route path="/servicos/configuracao-wifi/sao-jose-dos-pinhais/:bairro" element={<ServicoBairroCidadeRegiao cidade="sao-jose-dos-pinhais" service="configuracao-wifi" />} />
                <Route path="/servicos/reparo-smart-tv/pinhais/:bairro" element={<ServicoBairroCidadeRegiao cidade="pinhais" service="reparo-smart-tv" />} />
                <Route path="/servicos/configuracao-wifi/pinhais/:bairro" element={<ServicoBairroCidadeRegiao cidade="pinhais" service="configuracao-wifi" />} />
                <Route path="/servicos/troca-de-tela-tv/pinhais/:bairro" element={<ServicoBairroCidadeRegiao cidade="pinhais" service="troca-de-tela-tv" />} />
                <Route path="/servicos/reparo-smart-tv/:cidade" element={<ServicoCidadeRegiao service="reparo-smart-tv" />} />
                <Route path="/servicos/troca-de-tela-tv/:cidade" element={<ServicoCidadeRegiao service="troca-de-tela-tv" />} />
                <Route path="/servicos/configuracao-wifi/:cidade" element={<ServicoCidadeRegiao service="configuracao-wifi" />} />
                <Route path="/servicos/suporte-tecnico-empresarial" element={<GuiaEmpresarial slug="suporte-tecnico-empresarial" />} />
                {/* Aliases de busca -> rota canônica de TV (evita 404 e concentra sinal de SEO). */}
                <Route path="/servicos/conserto-tv" element={<Navigate to="/servicos/tvs" replace />} />
                <Route path="/servicos/conserto-de-tv" element={<Navigate to="/servicos/tvs" replace />} />
                <Route path="/servicos/conserto-de-televisao" element={<Navigate to="/servicos/tvs" replace />} />
                <Route path="/servicos/:servico/curitiba" element={<ServicoCuritibaContratacao />} />
                <Route path="/servicos/:slug" element={<ServicoDetalhe />} />

                <Route path="/regioes" element={<Regioes />} />
                <Route path="/regioes/:city" element={<RegiaoDetalhe />} />
                <Route path="/regioes/:city/:neighborhood" element={<BairroDetalhe />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/avaliar" element={<AvaliarAtendimento />} />
                <Route path="/termos-orcamento-pre-aprovado" element={<TermosOrcamento />} />
                <Route path="/termos-orcamento" element={<TermosOrcamento />} />
                <Route path="/politica-de-pecas-do-cliente" element={<PoliticaPecasCliente />} />
                <Route path="/creditos-de-imagens" element={<CreditosDeImagens />} />
                <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
                <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
                <Route path="/como-avaliar" element={<ComoAvaliar />} />
                <Route path="/avaliacoes" element={<Avaliacoes />} />
                <Route path="/status-os" element={<StatusOrdemServico />} />
                <Route path="/status-da-ordem-de-servico" element={<StatusOrdemServico />} />
                <Route path="/exclusao-de-dados" element={<ExclusaoDeDados />} />

                <Route path="/termos-uso" element={<TermosDeUso />} />
                <Route path="/politica-de-anuncios" element={<PoliticaDeAnuncios />} />
                <Route path="/politica-de-cookies" element={<PoliticaDeCookies />} />
                <Route path="/anuncie" element={<Anuncie />} />
                {/* Aliases canônicos do hub comercial (mesma página, sem conteúdo duplicado) */}
                <Route path="/patrocinadores" element={<Navigate to="/anuncie" replace />} />
                <Route path="/publicidade" element={<Navigate to="/anuncie" replace />} />
                <Route path="/seja-patrocinador" element={<Navigate to="/anuncie" replace />} />
                <Route path="/areas-atendidas" element={<AreasAtendidas />} />
                <Route path="/status-anuncios" element={<StatusAnuncios />} />
                <Route path="/servico-em/:city/:service" element={<ServicoCidade />} />
                <Route path="/precos" element={<Precos />} />
                <Route path="/como-funciona" element={<ComoFunciona />} />
                <Route path="/guia-tecnico-informatica" element={<GuiaTecnicoInformatica />} />
                <Route path="/como-escolher-tecnico-preco-prazo" element={<ComoEscolherTecnico />} />

                <Route path="/busca" element={<Busca />} />
                <Route path="/operacao/mensagens-prontas" element={<MensagensProntas />} />
                <Route path="/operacao/manifesto-de-provas" element={<ManifestoDeProvas />} />
                <Route path="/operacao/painel-google-business" element={<PainelGoogleBusiness />} />
                <Route path="/operacao/painel-conversao" element={<PainelConversao />} />
                <Route path="/area-de-atendimento-curitiba" element={<AreaAtendimentoCuritiba />} />
                <Route path="/atendimento-urgente" element={<AtendimentoUrgente />} />
                <Route path="/checklists-de-reparo" element={<ChecklistsReparo />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/categoria/:slug" element={<BlogCategory />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/diagnostics" element={<Diagnostics />} />
                <Route path="/diagnostico" element={<Diagnostics />} />
                <Route path="/assistencia-tecnica-curitiba" element={<AssistenciaTecnicaCuritiba />} />
                <Route path="/assistencia-tecnica" element={<AssistenciaTecnica />} />
                <Route path="/atendimento-nacional" element={<AtendimentoNacional />} />
                <Route path="/atendimento-nacional/:slug" element={<CidadeNacional />} />
                <Route path="/atendimento-nacional/:city/:bairro" element={<BairroNacional />} />
                <Route path="/servico-em-nacional/:city/:bairro/:service" element={<ServicoBairroNacional />} />
                <Route path="/triagem-preview" element={<TriagemPreview />} />
                {/* Landing pages por keyword de serviço (Rodada 28.1) */}
                <Route path="/formatacao-de-computador-curitiba" element={<KeywordServicePage slug="formatacao-de-computador-curitiba" />} />
                <Route path="/remocao-de-virus-curitiba" element={<KeywordServicePage slug="remocao-de-virus-curitiba" />} />
                <Route path="/upgrade-ssd-curitiba" element={<KeywordServicePage slug="upgrade-ssd-curitiba" />} />
                <Route path="/upgrade-memoria-ram-curitiba" element={<KeywordServicePage slug="upgrade-memoria-ram-curitiba" />} />
                <Route path="/conserto-de-notebook-curitiba" element={<KeywordServicePage slug="conserto-de-notebook-curitiba" />} />
                <Route path="/suporte-tecnico-remoto" element={<KeywordServicePage slug="suporte-tecnico-remoto" />} />
                <Route path="/assistencia-tecnica-empresas-curitiba" element={<KeywordServicePage slug="assistencia-tecnica-empresas-curitiba" />} />

                {/* Guias educacionais empresariais (Rodada 31) */}
                <Route path="/guias/organizacao-de-ti-para-pequenos-escritorios" element={<GuiaEmpresarial slug="organizacao-de-ti-para-pequenos-escritorios" />} />
                <Route path="/guias/como-escolher-uma-workstation" element={<GuiaEmpresarial slug="como-escolher-uma-workstation" />} />
                <Route path="/empresa-de-ti-curitiba" element={<GuiaEmpresarial slug="empresa-de-ti-curitiba" />} />
                <Route path="/seguranca-dos-dados" element={<GuiaEmpresarial slug="seguranca-dos-dados" />} />
                <Route path="/servicos/manutencao-preventiva-empresas" element={<GuiaEmpresarial slug="manutencao-preventiva-empresas" />} />
                <Route path="/servicos/backup-para-empresas" element={<GuiaEmpresarial slug="backup-para-empresas" />} />
                <Route path="/servicos/redes-e-wifi" element={<GuiaEmpresarial slug="redes-e-wifi" />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>

          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
