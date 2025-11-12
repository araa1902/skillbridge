import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ProjectCard";
import { Bell, Settings, Award, Briefcase, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "@/lib/data";

const StudentDashboard = () => {
  const recommendedProjects = projects.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <span>SkillBridge</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/student/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
            <Avatar>
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <nav className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start" asChild>
                      <Link to="/student/dashboard">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/browse-projects">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Browse Projects
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/student/credentials">
                        <Award className="mr-2 h-4 w-4" />
                        Credentials
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/student/messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/student/settings">
                        <User className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Welcome Banner */}
              <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <CardContent className="p-8">
                  <h1 className="text-2xl font-bold mb-2">Welcome back, Sarah</h1>
                  <p className="opacity-90 mb-4">
                    3 Projects Completed | 2 Credentials Earned
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" asChild>
                      <Link to="/browse-projects">Browse New Projects</Link>
                    </Button>
                    <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                      <Link to="/student/credentials">View Credentials</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Projects Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Credentials Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2</div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Digital Marketing Campaign Analysis</h3>
                      <p className="text-sm text-muted-foreground">TechStart Solutions</p>
                    </div>
                    <Badge>Under Review</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">Mobile App UX Research & Design</h3>
                      <p className="text-sm text-muted-foreground">HealthFirst App</p>
                    </div>
                    <Badge variant="secondary">Submitted</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Projects */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recommended For You</h2>
                  <Button variant="ghost" asChild>
                    <Link to="/browse-projects">View All</Link>
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedProjects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
