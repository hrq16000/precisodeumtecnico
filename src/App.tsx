import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GlobalReveal } from "@/components/GlobalReveal";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
// Keep Index and NotFound eager: Index is the LCP page; NotFound is trivial.
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { GlobalTriageLauncher } from "@/components/triage/GlobalTriageLauncher";
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
const ServicoCidade = lazy(() => import("./pages/ServicoCidade"));
const Precos = lazy(() => import("./pages/Precos"));
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

const TriagemPreview = lazy(() => import("./pages/TriagemPreview"));
const Faq = lazy(() => import("./pages/Faq"));
const DadosEmpresa = lazy(() => import("./pages/DadosEmpresa"));

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
            <SmartLocationPrompt />
            <RoutePageviewTracker />

            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/dados-da-empresa" element={<DadosEmpresa />} />

                <Route path="/servicos" element={<Servicos />} />
                <Route path="/servicos/troca-de-tela-tv-curitiba" element={<TrocaDeTelaTVCuritiba />} />
                <Route path="/servicos/reparo-smart-tv-curitiba" element={<ReparoSmartTVCuritiba />} />
                <Route path="/servicos/configuracao-wifi-curitiba" element={<ConfiguracaoWifiCuritiba />} />
                <Route path="/servicos/reparo-smart-tv/curitiba/:bairro" element={<ServicoBairroCuritiba service="reparo-smart-tv" />} />
                <Route path="/servicos/configuracao-wifi/curitiba/:bairro" element={<ServicoBairroCuritiba service="configuracao-wifi" />} />
                <Route path="/servicos/reparo-smart-tv/:cidade" element={<ServicoCidadeRegiao service="reparo-smart-tv" />} />
                <Route path="/servicos/troca-de-tela-tv/:cidade" element={<ServicoCidadeRegiao service="troca-de-tela-tv" />} />
                <Route path="/servicos/configuracao-wifi/:cidade" element={<ServicoCidadeRegiao service="configuracao-wifi" />} />
                <Route path="/servicos/:slug" element={<ServicoDetalhe />} />
                <Route path="/regioes" element={<Regioes />} />
                <Route path="/regioes/:city" element={<RegiaoDetalhe />} />
                <Route path="/regioes/:city/:neighborhood" element={<BairroDetalhe />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/termos-orcamento-pre-aprovado" element={<TermosOrcamento />} />
                <Route path="/termos-orcamento" element={<TermosOrcamento />} />
                <Route path="/servico-em/:city/:service" element={<ServicoCidade />} />
                <Route path="/precos" element={<Precos />} />
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
