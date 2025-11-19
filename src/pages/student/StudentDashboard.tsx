import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Briefcase, Award, TrendingUp, Clock, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/data";
import { studentReferences } from "@/lib/references-data";
import { ReferenceCard } from "@/components/ReferenceCard";

const StudentDashboard = () => {
  const recommendedProjects = projects.slice(0, 3);
  const recentReferences = studentReferences.slice(0, 2);
  const averageRating = (
    studentReferences.reduce((sum, ref) => sum + ref.rating, 0) / 
    studentReferences.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Sarah</h2>
          <p className="text-gray-600">University of Oxford · Computer Science · 2nd Year</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-600">2 in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Earned Credits</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-600">4 badges earned</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£1,240</div>
              <p className="text-xs text-gray-600">+£400 this month</p>
            </CardContent>
          </Card>
            <Link to="/student/references">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">References</CardTitle>
              <Star className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{studentReferences.length}</div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
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
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">Website Redesign - TechStart</h4>
                      <p className="text-sm text-gray-600">UI/UX Design · 20 hours</p>
                    </div>
                    <Badge>In Progress</Badge>
                  </div>
                  <Progress value={65} className="mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>65% Complete</span>
                    <span>Due in 5 days</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">Upload Deliverable</Button>
                    <Button size="sm" variant="outline">Message Client</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">Data Analysis Project - FinCorp</h4>
                      <p className="text-sm text-gray-600">Python · 10 hours</p>
                    </div>
                    <Badge variant="outline">Review</Badge>
                  </div>
                  <Progress value={100} className="mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Awaiting client review</span>
                    <span>Submitted 2 days ago</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">View Submission</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>AI-matched projects based on your skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedProjects.map((project) => (
                    <ProjectCard key={project.id} {...project} />
                  ))}
                </div>
                <Link to="/browse-projects">
                  <Button variant="outline" className="w-full">Browse All Projects</Button>
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
