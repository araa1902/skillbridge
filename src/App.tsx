import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import BrowseProjects from "./pages/BrowseProjects";
import ProjectDetails from "./pages/ProjectDetails";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationStatus from "./pages/ApplicationStatus";
import StudentDashboard from "./pages/student/StudentDashboard";
import CredentialsPage from "./pages/student/CredentialsPage";
import ReferencesPage from "./pages/student/ReferencesPage";
import MessagesPage from "./pages/MessagesPage";
import StudentApplications from "./pages/student/Applications";
import EarningsDashboard from "./pages/student/Earnings";
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
import StudentMessages from "./pages/student/Messages";
import EmployerMessages from "./pages/employer/Messages";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PageTransition from "@/components/layout/PageTransition";
import { AnimatePresence, motion } from "framer-motion";

const queryClient = new QueryClient();

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/auth" ||
    location.pathname === "/terms-of-service" ||
    location.pathname === "/privacy-policy" ||
    location.pathname === "/all-pages" ||
    location.pathname === "/onboarding";

  if (isAuthPage) {
    return <PageTransition key={location.pathname}>{children}</PageTransition>;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <PageTransition key={location.pathname} className="h-full">
          {children}
        </PageTransition>
      </main>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const { loading } = useAuth();

  // If we are globally loading the session, don't even mount the Routes
  // to prevent standard React Router redirects or components from firing
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
    {/* Background Decorative Haze - subtle liveliness */}
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px] -z-10" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[120px] -z-10" />

    <div className="flex flex-col items-center gap-8">
      {/* Branded Logo Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="relative"
      >

        {/* Subtle pulse ring around logo */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-blue-100 -z-0"
        />
      </motion.div>

      {/* Minimal Progress Track */}
      <div className="w-48 space-y-3">
        <div className="h-[3px] w-full bg-slate-100 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: ["0%", "30%", "70%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="flex justify-center items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">
            Securing Connection
          </span>
        </div>
      </div>
    </div>

    {/* Footer Branding */}
    <div className="absolute bottom-10 flex flex-col items-center gap-1">
      <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">
        Verified Micro-Credentials
      </p>
    </div>
  </div>

  return (
    <SidebarLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ---------- Public routes ---------- */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/all-pages" element={<AllPages />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={["student", "business", "university"]}>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* ---------- Shared (any authenticated user) ---------- */}
          <Route
            path="/browse-projects"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
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
            path="/student/messages"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/earnings"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <EarningsDashboard />
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
            path="/employer/messages"
            element={
              <ProtectedRoute allowedRoles={["business"]}>
                <EmployerMessages />
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
      </AnimatePresence>
    </SidebarLayout>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" expand={true} richColors />
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;

