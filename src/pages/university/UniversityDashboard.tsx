import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Briefcase, Award, Download, TrendingUp, LineChart } from "lucide-react";

const UniversityDashboard = () => {
  const skillDemand = [
    { skill: "Python", projects: 48, change: "+18% spike in AI projects" },
    { skill: "React", projects: 42, change: "+12% demand for front-end buildouts" },
    { skill: "Data Analysis", projects: 34, change: "+9% across consulting briefs" },
    { skill: "UX Research", projects: 27, change: "+5% usability engagements" },
    { skill: "Cloud Architecture", projects: 19, change: "+3% infra refresh work" },
  ];
  const topSkillRequests = Math.max(...skillDemand.map((item) => item.projects));

  const studentActivity = [
    { name: "Sarah Thompson", program: "Business Management", status: "Active", credits: 42, focus: "Market Validation Playbook" },
    { name: "James Chen", program: "Computer Science", status: "Placed", credits: 60, focus: "React Product Dashboard" },
    { name: "Emma Wilson", program: "Marketing", status: "Active", credits: 38, focus: "Full-funnel GTM Audit" },
    { name: "Oliver Davis", program: "Design", status: "Placed", credits: 55, focus: "UX Research Sprint" },
    { name: "Sophie Anderson", program: "Environmental Science", status: "Active", credits: 47, focus: "Sustainability Impact Model" },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">University Dashboard</h1>
            <p className="text-muted-foreground">
              Finally, we close the loop with the university by turning intuition into data-backed visibility across partners, projects, and students.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
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

            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Employer Partners
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
          </div>

          {/* Skill Demand */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Skill Demand Trends
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time visibility into skills being requested in live employer projects
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Python & React lead this week</p>
                <p className="text-xs text-muted-foreground">Use these signals to align curriculum instantly.</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {skillDemand.map((item) => (
                  <div key={item.skill}>
                    <div className="flex items-center justify-between text-sm font-medium mb-1">
                      <span>{item.skill}</span>
                      <span>{item.projects} active requests</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/60"
                        style={{ width: `${(item.projects / topSkillRequests) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.change}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Activity */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student Activity Overview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Track who is currently active, recently placed, and how many credits they have earned.
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
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Credits Earned</TableHead>
                    <TableHead>Current Focus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentActivity.map((student) => (
                    <TableRow key={student.name}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.program}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === "Placed" ? "default" : "outline"}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.credits}</TableCell>
                      <TableCell>{student.focus}</TableCell>
                    </TableRow>
                  ))}
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
