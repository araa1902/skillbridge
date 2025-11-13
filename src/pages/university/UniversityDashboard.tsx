import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Briefcase, Award, Download, TrendingUp } from "lucide-react";

const UniversityDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">University Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor student engagement and employer partnerships
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Active Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">142</div>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Projects Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">87</div>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Credentials Issued
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">65</div>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Partner Employers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23</div>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +3 new this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Student Activity */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student Activity Overview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Recent student participation and achievements
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Active Projects</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Credentials</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Sarah Thompson</TableCell>
                    <TableCell>Business Management</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">James Chen</TableCell>
                    <TableCell>Computer Science</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Emma Wilson</TableCell>
                    <TableCell>Marketing</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Oliver Davis</TableCell>
                    <TableCell>Design</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sophie Anderson</TableCell>
                    <TableCell>Environmental Science</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Partner Employers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Partner Employers</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Companies actively posting projects
                </p>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">TechStart Solutions</h3>
                    <p className="text-sm text-muted-foreground">Digital Marketing & Technology</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">5 Active Projects</p>
                    <p className="text-sm text-muted-foreground">12 Students Engaged</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">HealthFirst App</h3>
                    <p className="text-sm text-muted-foreground">Healthcare Technology</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">3 Active Projects</p>
                    <p className="text-sm text-muted-foreground">8 Students Engaged</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">InvestWise Capital</h3>
                    <p className="text-sm text-muted-foreground">Financial Services</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">4 Active Projects</p>
                    <p className="text-sm text-muted-foreground">15 Students Engaged</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">GreenFuture Enterprises</h3>
                    <p className="text-sm text-muted-foreground">Sustainability & ESG</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">2 Active Projects</p>
                    <p className="text-sm text-muted-foreground">10 Students Engaged</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UniversityDashboard;
