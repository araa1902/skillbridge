import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import BrowseProjects from "./pages/BrowseProjects";
import ProjectDetails from "./pages/ProjectDetails";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationStatus from "./pages/ApplicationStatus";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentReferences from "./pages/student/StudentReferences";
import CredentialsPage from "./pages/student/CredentialsPage";
import ReferencesPage from "./pages/student/ReferencesPage";
import MessagesPage from "./pages/MessagesPage";
import StudentApplications from "./pages/student/Applications";
import Settings from "./pages/student/Settings";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerReferences from "./pages/employer/EmployerReferences";
import EmployerSettings from "./pages/employer/Settings";
import NewProject from "./pages/employer/NewProject";
import ManageProjects from "./pages/employer/ManageProjects";
import EmployerApplications from "./pages/employer/Applications";
import StudentProfileView from "./pages/StudentProfileView";
import UniversityDashboard from "./pages/university/UniversityDashboard";
import UniversitySettings from "./pages/university/Settings";
import UniversityStudents from "./pages/university/Students";
import UniversityProjects from "./pages/university/Projects";
import UniversityAnalytics from "./pages/university/Analytics";
import AllPages from "./pages/AllPages";
import NotFound from "./pages/NotFound";
import { Sidebar } from "@/components/layout/sidebar";

const queryClient = new QueryClient();

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/auth" ||
    location.pathname === "/all-pages" ||
    location.pathname === "/onboarding";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* AuthProvider must live inside BrowserRouter so it can use navigate */}
          <AuthProvider>
            <SidebarLayout>
              <Routes>
                {/* ---------- Public routes ---------- */}
                <Route path="/" element={<Index />} />
                <Route path="/all-pages" element={<AllPages />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute allowedRoles={["student", "business"]}>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />

                {/* ---------- Shared (any authenticated user) ---------- */}
                <Route
                  path="/browse-projects"
                  element={
                    <ProtectedRoute allowedRoles={["student", "business", "university"]}>
                      <BrowseProjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:id"
                  element={
                    <ProtectedRoute allowedRoles={["student", "business", "university"]}>
                      <ProjectDetails />
                    </ProtectedRoute>
                  }
                />

                {/* ---------- Student-only routes ---------- */}
                <Route
                  path="/project/:id/apply"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <ApplicationForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:id/application-status"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <ApplicationStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/references"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <ReferencesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/credentials"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <CredentialsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/applications"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <StudentApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/settings"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:projectId/messages"
                  element={
                    <ProtectedRoute allowedRoles={["student", "business", "university"]}>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student-profile/:id"
                  element={
                    <ProtectedRoute allowedRoles={["student", "business", "university"]}>
                      <StudentProfileView />
                    </ProtectedRoute>
                  }
                />

                {/* ---------- Business/Employer-only routes ---------- */}
                <Route
                  path="/employer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["business"]}>
                      <EmployerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/references"
                  element={
                    <ProtectedRoute allowedRoles={["business"]}>
                      <EmployerReferences />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/settings"
                  element={
                    <ProtectedRoute allowedRoles={["business"]}>
                      <EmployerSettings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/projects/new"
                  element={
                    <ProtectedRoute allowedRoles={["business"]}>
                      <NewProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/projects/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={["business"]}>
                      <NewProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/projects/manage"
                  element={
                    <ProtectedRoute allowedRoles={["business"]}>
                      <ManageProjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/projects/:projectId/applications"
                  element={
                    <ProtectedRoute allowedRoles={["business"]}>
                      <EmployerApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employer/applications"
                  element={
                    <ProtectedRoute allowedRoles={["business"]}>
                      <EmployerApplications />
                    </ProtectedRoute>
                  }
                />

                {/* ---------- University-only routes ---------- */}
                <Route
                  path="/university/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["university"]}>
                      <UniversityDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/students"
                  element={
                    <ProtectedRoute allowedRoles={["university"]}>
                      <UniversityStudents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/projects"
                  element={
                    <ProtectedRoute allowedRoles={["university"]}>
                      <UniversityProjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/analytics"
                  element={
                    <ProtectedRoute allowedRoles={["university"]}>
                      <UniversityAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/settings"
                  element={
                    <ProtectedRoute allowedRoles={["university"]}>
                      <UniversitySettings />
                    </ProtectedRoute>
                  }
                />

                {/* ---------- Catch-all ---------- */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarLayout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

