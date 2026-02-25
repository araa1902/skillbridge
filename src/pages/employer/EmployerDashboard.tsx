import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Briefcase, CheckCircle2, TrendingUp, ArrowUpRight, Star } from "lucide-react";
import { pendingReferenceRequests } from "@/lib/references-data";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProjects, useEmployerStats } from "@/hooks/useProjects";

const EmployerDashboard = () => {
  const { user, profile } = useAuth();
  const { projects: myProjects, loading: projectsLoading } = useMyProjects(user?.id ?? null);
  const stats = useEmployerStats(user?.id ?? null);

  const pendingReferences = pendingReferenceRequests.filter(
    (req) => req.employerId === "emp-1"
  );

  const displayName = profile?.company_name ?? profile?.full_name ?? "Your Company";

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${displayName}`}
        description="Manage your projects and connect with talented students"
        userName={displayName}
        userRole="Employer"
      />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-600">Quick actions</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link to="/employer/projects/new">
                <Plus className="mr-2 h-5 w-5" />
                Post New Project
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  <span>Active Projects</span>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.loading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold text-gray-900">{stats.activeProjects}</div>
                    <div className="flex items-center text-green-600 text-xs font-medium">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      live
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  <span>Total Applicants</span>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.loading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900">{stats.totalApplicants}</div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  <span>Completed Projects</span>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.loading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900">{stats.completedProjects}</div>
                )}
              </CardContent>
            </Card>

            <Card className={`hover:shadow-md transition-shadow duration-200 ${pendingReferences.length > 0 ? "border-yellow-200 bg-yellow-50/50" : ""}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  <span>Pending References</span>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-gray-900">{pendingReferences.length}</div>
                </div>
                {pendingReferences.length > 0 && (
                  <Link to="/employer/references">
                    <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-yellow-700 hover:text-yellow-800">
                      Write references →
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pending References Alert */}
          {pendingReferences.length > 0 && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      {pendingReferences.length} student{pendingReferences.length !== 1 ? "s" : ""} waiting for your reference
                    </h3>
                    <p className="text-sm text-yellow-800 mb-3">
                      Help students showcase their work by providing professional feedback
                    </p>
                    <Link to="/employer/references">
                      <Button size="sm" variant="outline" className="border-yellow-300">
                        Write References
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Projects */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>My Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-8 w-28" />
                    </div>
                  ))}
                </div>
              ) : myProjects.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Briefcase className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No projects yet</p>
                  <p className="text-sm mt-1">Post your first project to start receiving applications.</p>
                  <Button className="mt-4" asChild>
                    <Link to="/employer/projects/new">Post a Project</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myProjects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {project.duration_hours} hrs
                          </span>
                          <Badge variant={project.status === "open" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                          <span>£{project.budget.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/employer/applications">View Applicants</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {myProjects.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" asChild>
                        <Link to="/employer/projects/manage">
                          View all {myProjects.length} projects →
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick link to full applications page */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Applications
                <Button variant="outline" size="sm" asChild>
                  <Link to="/employer/applications">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Manage All Applications
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Review and respond to student applications from the Applications page.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
