import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, GraduationCap, Home } from "lucide-react";

export default function AllPages() {
  const pages = {
    general: [
      { path: "/", name: "Landing Page", description: "Main homepage" },
      { path: "/auth", name: "Authentication", description: "Login/Signup page" },
      { path: "/browse-projects", name: "Browse Projects", description: "All available projects" },
      { path: "/project/1", name: "Project Details", description: "Single project view" },
      { path: "/project/1/apply", name: "Application Form", description: "Apply to a project" },
      { path: "/project/1/application-status", name: "Application Status", description: "Track application" },
    ],
    student: [
      { path: "/student/dashboard", name: "Student Dashboard", description: "Main student hub" },
      { path: "/student/credentials", name: "Credentials", description: "Badges and certificates" },
      { path: "/student/applications", name: "Applications", description: "View my applications" },
      { path: "/student/settings", name: "Settings", description: "Account settings" },
    ],
    employer: [
      { path: "/employer/dashboard", name: "Dashboard", description: "Business projects hub" },
      { path: "/employer/projects/new", name: "New Project", description: "Post a new project" },
      { path: "/employer/projects/manage", name: "Manage Projects", description: "View and manage posted projects" },
      { path: "/employer/applications", name: "Applications", description: "Review student applications" },
    ],
    university: [
      { path: "/university/dashboard", name: "University Dashboard", description: "University admin panel" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SkillBridge - All Pages
          </h1>
          <p className="text-xl text-gray-600">
            High Fidelity Prototype Navigation
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Click on any page to view its UI design
          </p>
        </div>

        <div className="space-y-8">
          {/* General Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                General Pages
              </CardTitle>
              <CardDescription>Public pages accessible to all users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.general.map((page) => (
                  <Link key={page.path} to={page.path}>
                    <div className="p-4 border rounded-lg hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {page.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono">{page.path}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                Student Pages
              </CardTitle>
              <CardDescription>Pages for university students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.student.map((page) => (
                  <Link key={page.path} to={page.path}>
                    <div className="p-4 border rounded-lg hover:border-purple-600 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">
                          {page.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono">{page.path}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Employer Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Employer Pages
              </CardTitle>
              <CardDescription>Pages for business employers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.employer.map((page) => (
                  <Link key={page.path} to={page.path}>
                    <div className="p-4 border rounded-lg hover:border-green-600 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600">
                          {page.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono">{page.path}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* University Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                University Pages
              </CardTitle>
              <CardDescription>Pages for university administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.university.map((page) => (
                  <Link key={page.path} to={page.path}>
                    <div className="p-4 border rounded-lg hover:border-orange-600 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
                          {page.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono">{page.path}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link to="/">Back to Landing Page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
