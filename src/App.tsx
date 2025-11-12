import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import BrowseProjects from "./pages/BrowseProjects";
import ProjectDetails from "./pages/ProjectDetails";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationStatus from "./pages/ApplicationStatus";
import StudentDashboard from "./pages/student/StudentDashboard";
import Credentials from "./pages/student/Credentials";
import Settings from "./pages/student/Settings";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import UniversityDashboard from "./pages/university/UniversityDashboard";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/browse-projects" element={<BrowseProjects />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/project/:id/apply" element={<ApplicationForm />} />
          <Route path="/project/:id/application-status" element={<ApplicationStatus />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/credentials" element={<Credentials />} />
          <Route path="/student/settings" element={<Settings />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/university/dashboard" element={<UniversityDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
