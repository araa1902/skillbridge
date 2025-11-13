import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
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
import NewProject from "./pages/employer/NewProject";
import ManageProjects from "./pages/employer/ManageProjects";
import Applications from "./pages/employer/Applications";
import UniversityDashboard from "./pages/university/UniversityDashboard";
import AllPages from "./pages/AllPages";
import NotFound from "./pages/NotFound";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";

const queryClient = new QueryClient();

const SidebarLayout = ({ children, userType }: { children: React.ReactNode, userType?: 'student' | 'employer' | 'university' }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/auth' || location.pathname === '/all-pages';
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-50/30">
      <Sidebar userType={userType} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Floating Prototype Navigation Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <Link to="/all-pages">
            <Button variant="outline" size="sm" className="shadow-lg">
              📋 All Pages
            </Button>
          </Link>
        </div>
        
        <SidebarLayout userType="student">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/all-pages" element={<AllPages />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse-projects" element={<BrowseProjects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/project/:id/apply" element={<ApplicationForm />} />
            <Route path="/project/:id/application-status" element={<ApplicationStatus />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/credentials" element={<Credentials />} />
            <Route path="/student/applications" element={<Applications />} />
            <Route path="/student/settings" element={<Settings />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/employer/projects/new" element={<NewProject />} />
            <Route path="/employer/projects/manage" element={<ManageProjects />} />
            <Route path="/employer/applications" element={<Applications />} />
            <Route path="/university/dashboard" element={<UniversityDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
