
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import KanbanView from "./pages/KanbanView";
import CalendarView from "./pages/CalendarView";
import DashboardView from "./pages/DashboardView";
import ProjectIdeasView from "@/pages/ProjectIdeasView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SearchProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kanban" element={<KanbanView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/project-ideas" element={<ProjectIdeasView />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
