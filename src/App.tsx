import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GlobalReveal } from "@/components/GlobalReveal";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Servicos from "./pages/Servicos";
import ServicoDetalhe from "./pages/ServicoDetalhe";
import Regioes from "./pages/Regioes";
import RegiaoDetalhe from "./pages/RegiaoDetalhe";
import BairroDetalhe from "./pages/BairroDetalhe";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import TermosOrcamento from "./pages/TermosOrcamento";
import ServicoCidade from "./pages/ServicoCidade";
import Precos from "./pages/Precos";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import Diagnostics from "./pages/Diagnostics";
import NotFound from "./pages/NotFound";
import AssistenciaTecnicaCuritiba from "./pages/AssistenciaTecnicaCuritiba";

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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/servicos/:slug" element={<ServicoDetalhe />} />
              <Route path="/regioes" element={<Regioes />} />
              <Route path="/regioes/:city" element={<RegiaoDetalhe />} />
              <Route path="/regioes/:city/:neighborhood" element={<BairroDetalhe />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/termos-orcamento-pre-aprovado" element={<TermosOrcamento />} />
              <Route path="/servico-em/:city/:service" element={<ServicoCidade />} />
              <Route path="/precos" element={<Precos />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/categoria/:slug" element={<BlogCategory />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/diagnostico" element={<Diagnostics />} />
              <Route path="/assistencia-tecnica-curitiba" element={<AssistenciaTecnicaCuritiba />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
