"use client";

import { Badge } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/badge";
import { Button } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/card";
import { Progress } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/avatar";
import { Bell, Briefcase, Award, TrendingUp, Clock, Star } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SkillBridge</h1>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
          <p className="text-gray-600">University of Oxford · Computer Science · 2nd Year</p>
        </div>

        {/* Stats Cards */}
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9</div>
              <p className="text-xs text-gray-600">From 8 reviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Projects */}
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

            {/* Recommended Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>AI-matched projects based on your skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 hover:border-blue-600 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">Social Media Campaign Manager</h4>
                      <p className="text-sm text-gray-600">EcoRetail Ltd · Marketing</p>
                    </div>
                    <Badge variant="outline">£450</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Create and manage a 2-week social media campaign for sustainable fashion launch...
                  </p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <Badge variant="outline">Social Media</Badge>
                    <Badge variant="outline">Content Creation</Badge>
                    <Badge variant="outline">20 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Posted 2 hours ago
                    </span>
                    <Button size="sm">Apply Now</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:border-blue-600 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">User Research Sprint</h4>
                      <p className="text-sm text-gray-600">HealthTech Innovations · Research</p>
                    </div>
                    <Badge variant="outline">£300</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Conduct user interviews and create insights report for mobile health app...
                  </p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <Badge variant="outline">User Research</Badge>
                    <Badge variant="outline">Analysis</Badge>
                    <Badge variant="outline">10 hours</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Posted 1 day ago
                    </span>
                    <Button size="sm">Apply Now</Button>
                  </div>
                </div>

                <Link href="/student/projects">
                  <Button variant="outline" className="w-full">Browse All Projects</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
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
                <Link href="/student/profile">
                  <Button variant="outline" className="w-full mt-4">Complete Profile</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Earned Badges */}
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
                <Button variant="outline" className="w-full mt-4">View All Badges</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
