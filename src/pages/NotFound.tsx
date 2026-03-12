import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, House as Home, WarningCircle as AlertCircle } from "@phosphor-icons/react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const projectsLink = profile?.role === 'business' ? "/employer/projects/manage" : "/browse-projects";
  const projectsLabel = profile?.role === 'business' ? "Manage Projects" : "Browse Projects";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>

          {/* Content */}
          <div className="space-y-2 mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              404
            </h1>
            <p className="text-xl font-semibold text-gray-900">Page Not Found</p>
            <p className="text-gray-600">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Error Details */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200/50">
            <p className="text-xs text-gray-600 break-all">
              <span className="font-semibold">Requested path:</span> {location.pathname}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate(-1)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full border-gray-300"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-xs text-gray-600 mb-3">Try these pages instead:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(projectsLink)}
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                {projectsLabel}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Sign In
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
