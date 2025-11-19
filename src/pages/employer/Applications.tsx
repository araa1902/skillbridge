import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, MessageCircle, CheckCircle, XCircle, Eye, User } from "lucide-react";
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
  coverLetter: string;
  rating: number;
  projectsCompleted: number;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
  skills: string[];
  portfolio?: string;
}

export default function Applications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      studentName: "John Smith",
      studentAvatar: "/placeholder-avatar.jpg",
      university: "University of Oxford",
      major: "Computer Science",
      year: "3rd Year",
      projectTitle: "Website Redesign Project",
      coverLetter: "I have 2 years of experience in React and modern web development. I've completed similar e-commerce projects and am confident I can deliver excellent results for your website redesign. My experience includes working with Tailwind CSS, TypeScript, and implementing responsive designs that work across all devices.",
      rating: 4.8,
      projectsCompleted: 5,
      status: "pending",
      appliedDate: "2024-01-15",
      skills: ["React", "TypeScript", "Tailwind CSS", "Responsive Design"],
      portfolio: "https://johnsmith.dev"
    },
    {
      id: 2,
      studentName: "Sarah Johnson",
      studentAvatar: "/placeholder-avatar.jpg",
      university: "Cambridge University",
      major: "Software Engineering",
      year: "4th Year",
      projectTitle: "Mobile App Development",
      coverLetter: "As a senior software engineering student with experience in Flutter and React Native, I'm excited about building your mobile application. I've built 3 production apps with over 10,000 downloads combined. My strengths include clean code architecture, API integration, and creating intuitive user interfaces.",
      rating: 4.9,
      projectsCompleted: 8,
      status: "pending",
      appliedDate: "2024-01-14",
      skills: ["Flutter", "React Native", "Firebase", "REST APIs"],
      portfolio: "https://sarahjohnson.dev"
    },
    {
      id: 3,
      studentName: "Michael Chen",
      studentAvatar: "/placeholder-avatar.jpg",
      university: "Imperial College London",
      major: "Data Science",
      year: "2nd Year",
      projectTitle: "Data Analysis Dashboard",
      coverLetter: "I specialize in data visualization and analytics. I've created several dashboards for university research projects using Python, Pandas, and Plotly.",
      rating: 4.6,
      projectsCompleted: 3,
      status: "accepted",
      appliedDate: "2024-01-10",
      skills: ["Python", "Pandas", "Plotly", "Data Visualization"]
    }
  ]);

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

  const filteredApplications = applications.filter(app => {
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
          <p className="text-gray-600">Review and manage student applications for your projects</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
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

        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id}>
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
                      <CardTitle className="text-lg">{application.studentName}</CardTitle>
                      <CardDescription>{application.university} • {application.major} • {application.year}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent>
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
                    {application.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
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
