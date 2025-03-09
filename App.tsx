
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FitnessDashboard from "./pages/FitnessDashboard";
import HealthDashboard from "./pages/HealthDashboard";
import SleepDashboard from "./pages/SleepDashboard";
import WorkoutsDashboard from "./pages/WorkoutsDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fitness" element={<FitnessDashboard />} />
          <Route path="/health" element={<HealthDashboard />} />
          <Route path="/sleep" element={<SleepDashboard />} />
          <Route path="/workouts" element={<WorkoutsDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
