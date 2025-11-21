import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Star, MessageCircle, CheckCircle, XCircle, Eye, User, Sparkles, Target, Brain } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: number;
  studentName: string;
  studentAvatar: string;
  university: string;
  major: string;
  year: string;
  projectTitle: string;
  projectRequiredSkills: string[];
  projectComplexity: "beginner" | "intermediate" | "advanced";
  coverLetter: string;
  rating: number;
  projectsCompleted: number;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
  skills: string[];
  portfolio?: string;
  gpa?: number;
  relevantCourses?: string[];
  previousProjectTypes?: string[];
}

export default function Applications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showMatchingScores, setShowMatchingScores] = useState(true);
  const [sortBy, setSortBy] = useState<"match" | "recent" | "rating" | "experience">("match");

  // Project requirements for matching (in real app, this would come from project data)
  const projectRequirements = {
    "Website Redesign Project": {
      requiredSkills: ["React", "TypeScript", "CSS", "Responsive Design", "UI/UX"],
      preferredSkills: ["Tailwind CSS", "Next.js", "Figma"],
      complexity: "intermediate" as const,
      experienceLevel: "intermediate",
      industryDomain: "e-commerce"
    },
    "Mobile App Development": {
      requiredSkills: ["Flutter", "React Native", "Mobile UI", "API Integration"],
      preferredSkills: ["Firebase", "SQLite", "Push Notifications"],
      complexity: "advanced" as const,
      experienceLevel: "advanced",
      industryDomain: "fintech"
    },
    "Data Analysis Dashboard": {
      requiredSkills: ["Python", "Data Visualization", "Statistics", "SQL"],
      preferredSkills: ["Pandas", "Plotly", "Machine Learning"],
      complexity: "intermediate" as const,
      experienceLevel: "beginner",
      industryDomain: "analytics"
    }
  };

  // Calculate compatibility score for each application
  const calculateCompatibilityScore = (application: Application) => {
    const projectReqs = projectRequirements[application.projectTitle as keyof typeof projectRequirements];
    if (!projectReqs) return 0;

    let score = 0;
    
    // Skill matching (40%)
    const requiredSkillMatches = projectReqs.requiredSkills.filter(skill => 
      application.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()))
    ).length;
    const requiredSkillScore = (requiredSkillMatches / projectReqs.requiredSkills.length) * 40;
    score += requiredSkillScore;

    // Preferred skills bonus (15%)
    const preferredSkillMatches = projectReqs.preferredSkills.filter(skill => 
      application.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()))
    ).length;
    const preferredSkillScore = (preferredSkillMatches / projectReqs.preferredSkills.length) * 15;
    score += preferredSkillScore;

    // Experience level matching (20%)
    const experienceScore = (() => {
      if (application.projectsCompleted >= 5 && projectReqs.experienceLevel === "advanced") return 20;
      if (application.projectsCompleted >= 3 && projectReqs.experienceLevel === "intermediate") return 20;
      if (application.projectsCompleted >= 1 && projectReqs.experienceLevel === "beginner") return 20;
      if (application.projectsCompleted === 0 && projectReqs.experienceLevel === "beginner") return 15;
      return 10; // Partial match
    })();
    score += experienceScore;

    // Academic performance (10%)
    const academicScore = (() => {
      if (application.gpa && application.gpa >= 3.7) return 10;
      if (application.gpa && application.gpa >= 3.3) return 7;
      if (application.gpa && application.gpa >= 3.0) return 5;
      return 3; // No GPA data or lower
    })();
    score += academicScore;

    // Rating and reliability (10%)
    const reliabilityScore = application.rating >= 4.5 ? 10 : (application.rating / 4.5) * 10;
    score += reliabilityScore;

    // Academic alignment (5%)
    const academicAlignment = (() => {
      const relevantMajors = ["Computer Science", "Software Engineering", "Data Science", "Information Technology"];
      if (relevantMajors.some(major => application.major.includes(major))) return 5;
      return 2; // Other majors
    })();
    score += academicAlignment;

    return Math.min(Math.round(score), 100);
  };

  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      studentName: "Priya Sharma",
      studentAvatar: "/placeholder-avatar.jpg",
      university: "University of Oxford",
      major: "Computer Science",
      year: "3rd Year",
      projectTitle: "Website Redesign Project",
      projectRequiredSkills: ["React", "TypeScript", "CSS"],
      projectComplexity: "intermediate",
      coverLetter: "I have 2 years of experience in React and modern web development. I've completed similar e-commerce projects and am confident I can deliver excellent results for your website redesign. My experience includes working with Tailwind CSS, TypeScript, and implementing responsive designs that work across all devices.",
      rating: 4.8,
      projectsCompleted: 5,
      status: "pending",
      appliedDate: "2024-01-15",
      skills: ["React", "TypeScript", "Tailwind CSS", "Responsive Design", "JavaScript", "HTML/CSS"],
      portfolio: "https://johnsmith.dev",
      gpa: 3.8,
      relevantCourses: ["Web Development", "Software Engineering", "Human-Computer Interaction"],
      previousProjectTypes: ["E-commerce", "Portfolio Sites", "Web Applications"]
    },
    {
      id: 2,
      studentName: "Diego Morales",
      studentAvatar: "/placeholder-avatar.jpg",
      university: "Cambridge University",
      major: "Software Engineering",
      year: "4th Year",
      projectTitle: "Mobile App Development",
      projectRequiredSkills: ["Flutter", "Mobile Development", "API Integration"],
      projectComplexity: "advanced",
      coverLetter: "As a senior software engineering student with experience in Flutter and React Native, I'm excited about building your mobile application. I've built 3 production apps with over 10,000 downloads combined. My strengths include clean code architecture, API integration, and creating intuitive user interfaces.",
      rating: 4.9,
      projectsCompleted: 8,
      status: "pending",
      appliedDate: "2024-01-14",
      skills: ["Flutter", "React Native", "Firebase", "REST APIs", "Mobile UI", "Dart", "JavaScript"],
      portfolio: "https://sarahjohnson.dev",
      gpa: 3.9,
      relevantCourses: ["Mobile Development", "Software Architecture", "Database Systems"],
      previousProjectTypes: ["Mobile Apps", "API Development", "Cross-platform Development"]
    },
    {
      id: 3,
      studentName: "Isabella Wong",
      studentAvatar: "/placeholder-avatar.jpg",
      university: "Imperial College London",
      major: "Data Science",
      year: "2nd Year",
      projectTitle: "Data Analysis Dashboard",
      projectRequiredSkills: ["Python", "Data Visualization", "Statistics"],
      projectComplexity: "intermediate",
      coverLetter: "I specialize in data visualization and analytics. I've created several dashboards for university research projects using Python, Pandas, and Plotly.",
      rating: 4.6,
      projectsCompleted: 3,
      status: "accepted",
      appliedDate: "2024-01-10",
      skills: ["Python", "Pandas", "Plotly", "Data Visualization", "SQL", "Statistics"],
      gpa: 3.6,
      relevantCourses: ["Data Analysis", "Statistics", "Machine Learning Fundamentals"],
      previousProjectTypes: ["Research Dashboards", "Data Analysis", "Statistical Reports"]
    }
  ]);

  // Add compatibility scores to applications
  const applicationsWithScores = applications.map(application => ({
    ...application,
    compatibilityScore: calculateCompatibilityScore(application)
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">New</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCompatibilityBadge = (score: number) => {
    if (score >= 85) return <Badge className="bg-green-500 text-white border-0">Excellent Match</Badge>;
    if (score >= 70) return <Badge className="bg-blue-500 text-white border-0">Good Match</Badge>;
    if (score >= 55) return <Badge className="bg-orange-500 text-white border-0">Fair Match</Badge>;
    return <Badge className="bg-gray-500 text-white border-0">Basic Match</Badge>;
  };

  const getMatchInsights = (application: Application & { compatibilityScore: number }) => {
    const projectReqs = projectRequirements[application.projectTitle as keyof typeof projectRequirements];
    if (!projectReqs) return [];

    const insights = [];
    
    const requiredSkillMatches = projectReqs.requiredSkills.filter(skill => 
      application.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
    
    if (requiredSkillMatches.length === projectReqs.requiredSkills.length) {
      insights.push("✓ Has all required skills");
    } else {
      insights.push(`⚠ Missing ${projectReqs.requiredSkills.length - requiredSkillMatches.length} required skills`);
    }

    if (application.projectsCompleted >= 5) {
      insights.push("✓ Experienced with multiple projects");
    } else if (application.projectsCompleted >= 3) {
      insights.push("✓ Good project experience");
    } else {
      insights.push("⚠ Limited project experience");
    }

    if (application.rating >= 4.7) {
      insights.push("✓ Excellent rating from past work");
    }

    if (application.gpa && application.gpa >= 3.7) {
      insights.push("✓ Strong academic performance");
    }

    return insights.slice(0, 3); // Show top 3 insights
  };

  const sortedApplications = [...applicationsWithScores].sort((a, b) => {
    switch (sortBy) {
      case "match":
        return b.compatibilityScore - a.compatibilityScore;
      case "recent":
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return b.projectsCompleted - a.projectsCompleted;
      default:
        return b.compatibilityScore - a.compatibilityScore;
    }
  });

  const filteredApplications = sortedApplications.filter(app => {
    if (selectedFilter === "all") return true;
    return app.status === selectedFilter;
  });

  const handleAcceptApplication = () => {
    if (selectedApplication) {
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id 
            ? { ...app, status: "accepted" as const }
            : app
        )
      );
      toast({
        title: "Application Accepted",
        description: `${selectedApplication.studentName}'s application has been accepted.`,
      });
      setAcceptDialogOpen(false);
      setSelectedApplication(null);
    }
  };

  const handleRejectApplication = () => {
    if (selectedApplication) {
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApplication.id 
            ? { ...app, status: "rejected" as const }
            : app
        )
      );
      toast({
        title: "Application Rejected",
        description: `${selectedApplication.studentName}'s application has been rejected.`,
        variant: "destructive",
      });
      setRejectDialogOpen(false);
      setSelectedApplication(null);
    }
  };

  const handleViewProfile = (studentName: string) => {
    toast({
      title: "Opening Profile",
      description: `Viewing ${studentName}'s full profile...`,
    });
    // Navigate to student profile
    navigate("/employer/student-profile");
  };

  const handleMessage = (studentName: string) => {
    toast({
      title: "Opening Messages",
      description: `Starting conversation with ${studentName}...`,
    });
    navigate("/employer/messages");
  };

  const handleViewCoverLetter = (application: Application) => {
    setSelectedApplication(application);
    setCoverLetterDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/employer/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications Received</h1>
          <p className="text-gray-600">Review and manage student applications with AI-powered compatibility matching</p>
        </div>

        {/* AI Matching Toggle */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">AI Compatibility Matching Active</p>
                  <p className="text-sm text-gray-600">Applications ranked by student-project compatibility</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMatchingScores(!showMatchingScores)}
                className="bg-white"
              >
                {showMatchingScores ? "Hide" : "Show"} Match Scores
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex gap-2">
            <Button 
              variant={selectedFilter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedFilter("all")}
            >
              All ({applications.length})
            </Button>
            <Button 
              variant={selectedFilter === "pending" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedFilter("pending")}
            >
              Pending ({applications.filter(a => a.status === "pending").length})
            </Button>
            <Button 
              variant={selectedFilter === "accepted" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedFilter("accepted")}
            >
              Accepted ({applications.filter(a => a.status === "accepted").length})
            </Button>
            <Button 
              variant={selectedFilter === "rejected" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedFilter("rejected")}
            >
              Rejected ({applications.filter(a => a.status === "rejected").length})
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="relative">
              {showMatchingScores && application.compatibilityScore > 0 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge 
                    className={`${
                      application.compatibilityScore >= 85 ? 'bg-green-500' :
                      application.compatibilityScore >= 70 ? 'bg-blue-500' :
                      application.compatibilityScore >= 55 ? 'bg-orange-500' :
                      'bg-gray-500'
                    } text-white border-0 shadow-lg`}
                  >
                    <Target className="h-3 w-3 mr-1 fill-current" />
                    {application.compatibilityScore}% Match
                  </Badge>
                </div>
              )}
              
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={application.studentAvatar} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {application.studentName}
                          {showMatchingScores && getCompatibilityBadge(application.compatibilityScore)}
                        </CardTitle>
                        <CardDescription>{application.university} • {application.major} • {application.year}</CardDescription>
                        {application.gpa && (
                          <p className="text-xs text-gray-500 mt-1">GPA: {application.gpa}</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Compatibility Insights */}
                  {showMatchingScores && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Compatibility Insights
                      </h4>
                      <div className="space-y-1">
                        {getMatchInsights(application).map((insight, index) => (
                          <p key={index} className="text-xs text-blue-800">{insight}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Applied for: {application.projectTitle}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {application.coverLetter}
                    </p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="px-0 h-auto text-xs"
                      onClick={() => handleViewCoverLetter(application)}
                    >
                      Read full cover letter
                    </Button>
                  </div>
                  
                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, index) => {
                        const isRequired = projectRequirements[application.projectTitle as keyof typeof projectRequirements]?.requiredSkills.some(req => 
                          req.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(req.toLowerCase())
                        );
                        return (
                          <Badge 
                            key={index} 
                            variant={isRequired ? "default" : "secondary"}
                            className={isRequired ? "bg-green-100 text-green-800 border-green-300" : ""}
                          >
                            {skill}
                            {isRequired && " ✓"}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {application.rating} rating
                      </span>
                      <span>{application.projectsCompleted} projects completed</span>
                      <span className="text-gray-400">Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewProfile(application.studentName)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMessage(application.studentName)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      {application.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setSelectedApplication(application);
                              setRejectDialogOpen(true);
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setSelectedApplication(application);
                              setAcceptDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">
                {selectedFilter === "all" 
                  ? "No applications received yet" 
                  : `No ${selectedFilter} applications`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Accept Confirmation Dialog */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept {selectedApplication?.studentName}'s application for {selectedApplication?.projectTitle}? 
              The student will be notified and you can begin working together.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAcceptApplication}
              className="bg-green-600 hover:bg-green-700"
            >
              Accept Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {selectedApplication?.studentName}'s application? 
              This action cannot be undone and the student will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRejectApplication}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cover Letter Dialog */}
      <Dialog open={coverLetterDialogOpen} onOpenChange={setCoverLetterDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cover Letter - {selectedApplication?.studentName}</DialogTitle>
            <DialogDescription>
              Applied for: {selectedApplication?.projectTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-wrap">
              {selectedApplication?.coverLetter}
            </p>
            {selectedApplication?.portfolio && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Portfolio:</p>
                <a 
                  href={selectedApplication.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {selectedApplication.portfolio}
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
