
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import Index from "./pages/Index";
import EstimatesPage from "./pages/estimates/index";
import EstimateDetailPage from "./pages/estimates/[id]";
import NewEstimatePage from "./pages/estimates/new";
import EditEstimatePage from "./pages/estimates/edit/[id]";
import ClientsPage from "./pages/clients/index";
import SettingsPage from "./pages/settings/index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/estimates" element={<EstimatesPage />} />
            <Route path="/estimates/new" element={<NewEstimatePage />} />
            <Route path="/estimates/:id" element={<EstimateDetailPage />} />
            <Route path="/estimates/:id/edit" element={<EditEstimatePage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
