"use client";

import { Badge } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/badge";
import { Button } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/card";
import { Avatar, AvatarFallback } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/avatar";
import { Bell, Plus, Users, Briefcase, PoundSterling, Clock } from "lucide-react";
import Link from "next/link";

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SkillBridge Business</h1>
          <div className="flex items-center gap-4">
            <Link href="/business/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post Project
              </Button>
            </Link>
            <Avatar>
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, TechStart!</h2>
          <p className="text-gray-600">Technology · Scale-up · London</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-gray-600">3 in progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-gray-600">12 pending review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Escrow</CardTitle>
              <PoundSterling className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£2,450</div>
              <p className="text-xs text-gray-600">Secured funds</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Response</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4h</div>
              <p className="text-xs text-gray-600">Response time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Active Projects */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Monitor progress and deliverables</CardDescription>
                  </div>
                  <Link href="/business/projects">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">Website Redesign</h4>
                      <p className="text-sm text-gray-600">UI/UX Design · £650</p>
                    </div>
                    <Badge>In Progress</Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-600">Oxford · Computer Science</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Progress</Button>
                    <Button size="sm" variant="outline">Message Student</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">Market Research Analysis</h4>
                      <p className="text-sm text-gray-600">Research · £400</p>
                    </div>
                    <Badge variant="outline">Review Required</Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>ES</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Emma Smith</p>
                      <p className="text-xs text-gray-600">Cambridge · Economics</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Review Deliverable</Button>
                    <Button size="sm" variant="outline">Request Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Review student proposals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>MJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Michael Johnson</p>
                        <p className="text-sm text-gray-600">Imperial College · Data Science</p>
                      </div>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Applied for: Social Media Campaign Manager
                  </p>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline">Marketing</Badge>
                    <Badge variant="outline">Social Media</Badge>
                    <Badge variant="outline">4.8★</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">View Application</Button>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>SL</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Sophie Lee</p>
                        <p className="text-sm text-gray-600">UCL · Business Management</p>
                      </div>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    Applied for: Social Media Campaign Manager
                  </p>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline">Marketing</Badge>
                    <Badge variant="outline">Content</Badge>
                    <Badge variant="outline">4.9★</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">View Application</Button>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/business/projects/new">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Browse Students
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <PoundSterling className="h-4 w-4 mr-2" />
                  Payment History
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Templates</CardTitle>
                <CardDescription>Quick start guides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  Web Development Project
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  Marketing Campaign
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  Research & Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  Design Sprint
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Link href="/help" className="block text-blue-600 hover:underline">
                  How to write effective project briefs
                </Link>
                <Link href="/help" className="block text-blue-600 hover:underline">
                  Understanding escrow payments
                </Link>
                <Link href="/help" className="block text-blue-600 hover:underline">
                  Best practices for student projects
                </Link>
                <Button variant="outline" className="w-full mt-4">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
