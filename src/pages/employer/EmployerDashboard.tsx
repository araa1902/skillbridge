import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, Briefcase, CheckCircle2, XCircle, Star } from "lucide-react";
import { projects } from "@/lib/data";
import { pendingReferenceRequests } from "@/lib/references-data";
import { Link } from "react-router-dom";

const EmployerDashboard = () => {
  const myProjects = projects.slice(0, 3);
  const pendingReferences = pendingReferenceRequests.filter(req => req.employerId === "emp-1");

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your projects and connect with talented students
              </p>
            </div>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Post New Project
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Applicants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">35</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Students Hired
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending References
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{pendingReferences.length}</div>
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                {pendingReferences.length > 0 && (
                  <Link to="/employer/references">
                    <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                      Write references
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
