import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, Briefcase, CheckCircle2, XCircle, Star, TrendingUp, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import { pendingReferenceRequests } from "@/lib/references-data";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";

const EmployerDashboard = () => {
  const myProjects = projects.slice(0, 3);
  const pendingReferences = pendingReferenceRequests.filter(req => req.employerId === "emp-1");

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, TechStart Inc."
        description="Manage your projects and connect with talented students"
        userName="Tech Company"
        userRole="Employer"
      />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-gray-600">Quick actions</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link to="/employer/projects/new">
                <Plus className="mr-2 h-5 w-5" />
                Post New Project
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  <span>Active Projects</span>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-gray-900">3</div>
                  <div className="flex items-center text-green-600 text-xs font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    +1 new
                  </div>
                </div>
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
                <div className="text-3xl font-bold text-gray-900">35</div>
                <p className="text-xs text-gray-600 mt-1">8 new this week</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  <span>Students Hired</span>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">8</div>
                <p className="text-xs text-gray-600 mt-1">100% satisfaction</p>
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
                <div className="text-3xl font-bold text-gray-900">5</div>
                <p className="text-xs text-gray-600 mt-1">On budget & on time</p>
              </CardContent>
            </Card>

            <Card className={`hover:shadow-md transition-shadow duration-200 ${pendingReferences.length > 0 ? 'border-yellow-200 bg-yellow-50/50' : ''}`}>
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
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto mt-2 text-yellow-700 hover:text-yellow-800"
                    >
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
                  <Star className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      {pendingReferences.length} student{pendingReferences.length !== 1 ? 's' : ''} waiting for your reference
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
              <div className="space-y-4">
                {myProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-smooth">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{project.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.applicants} applicants
                        </span>
                        <Badge variant={project.status === 'open' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Applicants</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applicants */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Emma Wilson</TableCell>
                    <TableCell>University of Bristol</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      Digital Marketing Campaign
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">Marketing</Badge>
                        <Badge variant="outline" className="text-xs">Analytics</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>Pending</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">James Chen</TableCell>
                    <TableCell>Imperial College London</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      UX Research & Design
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">UX Design</Badge>
                        <Badge variant="outline" className="text-xs">Figma</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>Pending</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sophie Anderson</TableCell>
                    <TableCell>University of Edinburgh</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      Content Strategy Development
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">Content</Badge>
                        <Badge variant="outline" className="text-xs">SEO</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Accepted</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">Message</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
