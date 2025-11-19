import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Clock, CheckCircle, XCircle, Building2, Calendar, MessageCircle, FileText, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: number;
  projectTitle: string;
  companyName: string;
  companyLogo: string;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
  respondedDate?: string;
  budget: string;
  description: string;
  coverLetter: string;
  projectId: number;
}

export default function StudentApplications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      projectTitle: "Website Redesign Project",
      companyName: "TechCorp Solutions",
      companyLogo: "/placeholder-company.jpg",
      status: "pending",
      appliedDate: "2024-01-15",
      budget: "£500-£1000",
      description: "We need a modern, responsive website redesign for our e-commerce platform. The ideal candidate should have experience with React, Tailwind CSS, and responsive design principles.",
      coverLetter: "I have 2 years of experience in React and modern web development. I've completed similar e-commerce projects and am confident I can deliver excellent results for your website redesign.",
      projectId: 101
    },
    {
      id: 2,
      projectTitle: "Mobile App Development",
      companyName: "StartupXYZ",
      companyLogo: "/placeholder-company.jpg",
      status: "accepted",
      appliedDate: "2024-01-10",
      respondedDate: "2024-01-12",
      budget: "£1500-£2000",
      description: "Looking for a Flutter developer to build a fitness tracking mobile app with social features and data visualization.",
      coverLetter: "As a senior software engineering student with experience in Flutter and React Native, I'm excited about building your mobile application. I've built 3 production apps with similar features.",
      projectId: 102
    },
    {
      id: 3,
      projectTitle: "Data Analysis Dashboard",
      companyName: "Analytics Inc",
      companyLogo: "/placeholder-company.jpg",
      status: "rejected",
      appliedDate: "2024-01-08",
      respondedDate: "2024-01-09",
      budget: "£800-£1200",
      description: "Create an interactive dashboard for visualizing sales data using Python, Plotly, and Streamlit.",
      coverLetter: "I specialize in Python and data visualization tools. I have experience building interactive dashboards for business analytics.",
      projectId: 103
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (selectedFilter === "all") return true;
    return app.status === selectedFilter;
  });

  const handleWithdrawApplication = () => {
    if (selectedApplicationId) {
      setApplications(prev => prev.filter(app => app.id !== selectedApplicationId));
      toast({
        title: "Application Withdrawn",
        description: "Your application has been successfully withdrawn.",
      });
      setWithdrawDialogOpen(false);
      setSelectedApplicationId(null);
    }
  };

  const handleViewProjectDetails = (projectId: number) => {
    navigate(`/student/projects/${projectId}`);
  };

  const handleMessageEmployer = (companyName: string) => {
    toast({
      title: "Opening Messages",
      description: `Starting conversation with ${companyName}...`,
    });
    // Navigate to messages page
    navigate("/student/messages");
  };

  const handleViewCoverLetter = (application: Application) => {
    toast({
      title: "Cover Letter",
      description: application.coverLetter,
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/student/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of your project applications</p>
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
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={application.companyLogo} />
                      <AvatarFallback>
                        {application.companyName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{application.projectTitle}</CardTitle>
                        {getStatusBadge(application.status)}
                      </div>
                      <CardDescription className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {application.companyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied {new Date(application.appliedDate).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold text-lg text-green-600">{application.budget}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-gray-700">Project Description</h4>
                    <p className="text-gray-600 text-sm">
                      {application.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-gray-700">Your Application</h4>
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
                  {application.respondedDate && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Responded on {new Date(application.respondedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewProjectDetails(application.projectId)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Project Details
                  </Button>
                  <div className="flex gap-2">
                    {application.status === "accepted" && (
                      <Button 
                        size="sm"
                        onClick={() => handleMessageEmployer(application.companyName)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message Employer
                      </Button>
                    )}
                    {application.status === "pending" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setSelectedApplicationId(application.id);
                          setWithdrawDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Withdraw Application
                      </Button>
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
                  ? "You haven't applied to any projects yet" 
                  : `No ${selectedFilter} applications`}
              </p>
              <Link to="/student/browse-projects">
                <Button>Browse Projects</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw this application? This action cannot be undone.
              You will need to reapply if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleWithdrawApplication}
              className="bg-red-600 hover:bg-red-700"
            >
              Withdraw Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
