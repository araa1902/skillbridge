import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Briefcase, Award, TrendingUp, Clock, Star, MessageSquare, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/data";
import { studentReferences } from "@/lib/references-data";
import { ReferenceCard } from "@/components/ReferenceCard";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { profile } = useAuth();
  const recommendedProjects = projects.slice(0, 3);
  const recentReferences = studentReferences.slice(0, 2);
  const averageRating = (
    studentReferences.reduce((sum, ref) => sum + ref.rating, 0) /
    studentReferences.length
  ).toFixed(1);

  const displayName = profile?.full_name ?? "Student";
  const firstName = profile?.full_name?.split(' ')[0] ?? "Student";

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Dashboard"
        subtitle="University of Oxford · Computer Science · 2nd Year"
        description={`Welcome back, ${firstName}! Here's your project progress.`}
        userName={displayName}
        userRole="Student"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Active Projects Card */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Active Projects</CardTitle>
              <Briefcase className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">3</div>
                  <p className="text-xs text-gray-600 mt-1">2 in progress</p>
                </div>
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  +1 new
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earned Credits Card */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Earned Credits</CardTitle>
              <Award className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div>
                <div className="text-3xl font-bold text-gray-900">12</div>
                <p className="text-xs text-gray-600 mt-1">4 badges earned</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Earnings Card */}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Total Earnings</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900">£1,240</div>
                  <p className="text-xs text-gray-600 mt-1">+£400 this month</p>
                </div>
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  32%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* References Card */}
          <Link to="/student/references">
            <Card className="hover:shadow-md transition-shadow duration-200 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">References</CardTitle>
                <Star className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="text-3xl font-bold text-gray-900">{studentReferences.length}</div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < Math.round(Number(averageRating))
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{averageRating} avg rating</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Your ongoing work and deliverables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "Website Redesign - TechStart",
                    meta: "UI/UX Design · 20 hours",
                    progress: 65,
                    status: "In Progress",
                    detail: "Due in 5 days"
                  },
                  {
                    title: "Data Analysis Project - FinCorp",
                    meta: "Python · 10 hours",
                    progress: 100,
                    status: "Review",
                    detail: "Submitted 2 days ago"
                  }
                ].map((project, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{project.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{project.meta}</p>
                      </div>
                      <Badge variant={project.status === "In Progress" ? "default" : "outline"} className="ml-2">
                        {project.status}
                      </Badge>
                    </div>
                    <Progress value={project.progress} className="mb-2 h-2" />
                    <div className="flex justify-between text-xs text-gray-600 mb-3">
                      <span>{project.progress}% Complete</span>
                      <span>{project.detail}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="text-xs h-8">Upload</Button>
                      <Button size="sm" variant="ghost" className="text-xs h-8">Message</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>AI-matched projects based on your skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-4">
                  {recommendedProjects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                </div>
                <Link to="/browse-projects">
                  <Button variant="outline" className="w-full">View All Projects</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={85} className="mb-2" />
                <p className="text-sm text-gray-600 mb-4">85% Complete</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>University verified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Skills added</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <span>Add portfolio projects</span>
                  </li>
                </ul>
                <Link to="/student/settings">
                  <Button variant="outline" className="w-full mt-4">Complete Profile</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Credentials</CardTitle>
                <CardDescription>Verifiable micro-credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 border rounded-lg">
                    <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-medium">Web Design</p>
                    <p className="text-xs text-gray-500">EQF Level 5</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs font-medium">Data Analysis</p>
                    <p className="text-xs text-gray-500">EQF Level 5</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-xs font-medium">Marketing</p>
                    <p className="text-xs text-gray-500">EQF Level 4</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-xs font-medium">Research</p>
                    <p className="text-xs text-gray-500">EQF Level 5</p>
                  </div>
                </div>
                <Link to="/student/credentials">
                  <Button variant="outline" className="w-full mt-4">View All Badges</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Dr. Sarah Mitchell</p>
                    <p className="text-sm text-gray-600">Senior UX Designer</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Schedule Meeting</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
