import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Buildings as Building2, GraduationCap, House as Home, Play, Target, Lightbulb, ArrowSquareOut as ExternalLink } from "@phosphor-icons/react";

export default function AllPages() {
  const walkthroughPath = [
    {
      step: 1,
      path: "/",
      name: "Landing Page",
      scriptPointer: "Introduce the skill gap problem and SkillBridge's unique solution",
      duration: "30s"
    },
    {
      step: 2,
      path: "/browse-projects",
      name: "Browse Projects",
      scriptPointer: "Show real-world projects with AI-powered matching scores. Demonstrate how the intelligent matching engine pairs students with opportunities based on their skills, interests, and career goals - helping them discover relevant projects and explore new fields risk-free.",
      duration: "45s"
    },
    {
      step: 3,
      path: "/project/1",
      name: "Project Details",
      scriptPointer: "Demonstrate detailed project view with clear requirements and learning outcomes",
      duration: "30s"
    },
    {
      step: 4,
      path: "/project/1/apply",
      name: "Application Process",
      scriptPointer: "Show streamlined application that matches student skills to project needs",
      duration: "20s"
    },
    {
      step: 5,
      path: "/student/dashboard",
      name: "Student Dashboard",
      scriptPointer: "Display personalized learning journey and skill development tracking",
      duration: "40s"
    },
    {
      step: 6,
      path: "/student/applications",
      name: "Student Applications Tracking",
      scriptPointer: "Show how students track their application statuses and manage submissions",
      duration: "30s"
    },
    {
      step: 7,
      path: "/student/references",
      name: "References & Validation",
      scriptPointer: "Highlight employer feedback system that validates real-world skills",
      duration: "25s"
    },
    {
      step: 8,
      path: "/employer/dashboard",
      name: "Employer Dashboard",
      scriptPointer: "Show how employers access pre-skilled talent and contribute to education",
      duration: "35s"
    },
    {
      step: 9,
      path: "/employer/applications",
      name: "Employer Applications Review",
      scriptPointer: "Demonstrate how employers review and accept student applications",
      duration: "30s"
    },
    {
      step: 10,
      path: "/employer/projects/new",
      name: "New Project",
      scriptPointer: "Demonstrate how industry creates relevant learning opportunities",
      duration: "25s"
    },
  ];

  const pages = {
    general: [
      { path: "/", name: "Landing Page", description: "Main homepage" },
      { path: "/auth", name: "Authentication", description: "Login/Signup page" },
      { path: "/browse-projects", name: "Browse Projects", description: "All available projects" },
      { path: "/project/1", name: "Project Details", description: "Single project view" },
      { path: "/project/1/apply", name: "Application Form", description: "Apply to a project" },
      { path: "/project/1/application-status", name: "Application Status", description: "Track application" },
    ],
    student: [
      { path: "/student/dashboard", name: "Student Dashboard", description: "Main student hub" },
      { path: "/student/applications", name: "My Applications", description: "Track my project application statuses" },
      { path: "/student/references", name: "References", description: "Professional references and feedback" },
      { path: "/student/credentials", name: "Credentials", description: "Badges and certificates" },
      { path: "/student/settings", name: "Settings", description: "Account settings" },
    ],
    employer: [
      { path: "/employer/dashboard", name: "Dashboard", description: "Business projects hub" },
      { path: "/employer/applications", name: "Review Applications", description: "Review and manage student applications" },
      { path: "/employer/references", name: "References", description: "Write student references" },
      { path: "/employer/projects/new", name: "New Project", description: "Post a new project - Create industry-relevant learning opportunities" },
      { path: "/employer/projects/manage", name: "Manage Projects", description: "View and manage posted projects" },
    ],
    university: [
      { path: "/university/dashboard", name: "University Dashboard", description: "University admin panel" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="page-container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SkillBridge - High Fidelity Prototype
          </h1>
          <p className="text-xl text-gray-600">
            Bridging the Gap Between Academic Learning and Industry Needs
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Problem-Solution Focused</span>
            </div>
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
              <Lightbulb className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Industry-Academia Bridge</span>
            </div>
          </div>
        </div>

        {/* Video Walkthrough Path */}
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              Recommended Video Walkthrough Path
            </CardTitle>
            <CardDescription>
              Follow this sequence to demonstrate how SkillBridge addresses the skill gap problem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {walkthroughPath.map((item) => (
                <Link key={item.path} to={item.path} className="block">
                  <div className="p-4 border rounded-lg hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 flex items-center gap-2">
                            {item.name}
                            <ExternalLink className="h-3 w-3 opacity-50" />
                          </h3>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {item.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{item.scriptPointer}</p>
                        <p className="text-xs text-gray-500 font-mono">{item.path}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Script Key Points:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Emphasize the disconnect between theoretical education and practical skills</li>
                <li>• Highlight how the AI matching engine personalizes learning paths and career exploration</li>
                <li>• Show the validation system that proves student capabilities to employers</li>
                <li>• Demonstrate the circular ecosystem: students learn, employers get talent, universities stay relevant</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* General Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Foundation Pages
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">Core Problem Introduction</span>
              </CardTitle>
              <CardDescription>
                Pages that introduce the skill gap problem and SkillBridge's solution approach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.general.map((page) => (
                  <Link key={page.path} to={page.path} className="block">
                    <div className="p-4 border rounded-lg hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {page.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono">{page.path}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                Student Journey
                <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded ml-2">Skill Development Focus</span>
              </CardTitle>
              <CardDescription>
                How students discover, apply to, and complete real-world projects for skill validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.student.map((page) => (
                  <Link key={page.path} to={page.path} className="block">
                    <div className="p-4 border rounded-lg hover:border-purple-600 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">
                          {page.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono">{page.path}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Employer Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Employer Ecosystem
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded ml-2">Industry Integration</span>
              </CardTitle>
              <CardDescription>
                How employers create meaningful projects and access skilled talent while contributing to education
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.employer.map((page) => (
                  <Link key={page.path} to={page.path} className="block">
                    <div className="p-4 border rounded-lg hover:border-green-600 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 flex items-center gap-2">
                          {page.name}
                          {page.path === "/employer/projects/new" && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Key Flow</span>
                          )}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono">{page.path}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* University Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Academic Partnership
                <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded ml-2">Institution Integration</span>
              </CardTitle>
              <CardDescription>
                How universities integrate industry projects into curricula and track student progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.university.map((page) => (
                  <Link key={page.path} to={page.path} className="block">
                    <div className="p-4 border rounded-lg hover:border-orange-600 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
                          {page.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-600">{page.description}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono">{page.path}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center space-y-4">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prototype Justification</h3>
            <p className="text-gray-700 mb-4">
              This high-fidelity prototype addresses the critical skill gap between academic education and industry requirements by creating a structured ecosystem where:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong className="text-blue-600">Students</strong> gain practical experience through real projects
              </div>
              <div className="bg-white p-3 rounded border">
                <strong className="text-green-600">Employers</strong> access pre-skilled talent and shape education
              </div>
              <div className="bg-white p-3 rounded border">
                <strong className="text-orange-600">Universities</strong> stay relevant with industry-aligned curricula
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> If the "New Project" button isn't working, ensure the route <code>/employer/projects/new</code> is defined in your router configuration.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">Start Video Walkthrough from Landing Page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
