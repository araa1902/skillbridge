import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle as CheckCircle2, Clock, PaperPlaneRight as Send, WarningCircle as AlertCircle, CaretDown as ChevronDown, CaretUp as ChevronUp, SpinnerGap as Loader2 } from "@phosphor-icons/react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { updateApplicationStatus } from "@/hooks/useApplications";
import { useToast } from "@/hooks/use-toast";

const ApplicationStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [application, setApplication] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchAppStatus() {
      if (!user?.id || !id) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select(`
          *,
          projects!applications_project_id_fkey (
            id,
            title,
            duration_hours,
            required_skills,
            profiles!projects_business_id_fkey (
              full_name,
              company_name
            )
          )
        `)
        .eq("project_id", id)
        .eq("student_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (appError) {
        if (isMounted) setError(appError.message);
      } else if (!appData) {
        if (isMounted) setError("Application not found.");
      } else {
        if (isMounted) {
          setApplication(appData);
          setProject(appData.projects);
        }
      }
      if (isMounted) setLoading(false);
    }

    fetchAppStatus();
    return () => { isMounted = false; };
  }, [id, user?.id]);

  const [expandedSteps, setExpandedSteps] = useState<{ [key: string]: boolean }>({});
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!application) return;
    setWithdrawing(true);
    const { error: updateErr } = await updateApplicationStatus(application.id, "withdrawn");
    setWithdrawing(false);
    if (updateErr) {
      toast({ title: "Failed to withdraw", description: updateErr, variant: "destructive" });
    } else {
      toast({ title: "Application withdrawn" });
      navigate("/student/applications");
    }
  };

  const handleSendMessage = () => {
    // Messaging is implemented in the dedicated Messages page.
    navigate(`/project/${project.id}/messages?to=${project.profiles?.id || ''}`);
  };

  const toggleExpanded = (step: string) => {
    setExpandedSteps(prev => ({ ...prev, [step]: !prev[step] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-2" />
          <p>Loading application...</p>
        </main>
      </div>
    );
  }

  if (error || !project || !application) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center flex-col space-y-4">
          <p className="text-lg font-medium">{error || "Project not found"}</p>
          <Button variant="outline" onClick={() => navigate("/student/applications")}>
            Back to Applications
          </Button>
        </main>
      </div>
    );
  }

  const companyName = project.profiles?.company_name || project.profiles?.full_name || "Company";
  const isAccepted = application.status === "accepted";
  const isRejected = application.status === "rejected";
  const isWithdrawn = application.status === "withdrawn";
  const isReviewing = application.status === "reviewing";
  const isPending = application.status === "pending";

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 bg-background">
        <div className="page-container py-12">
          <div className="">
            <div className="mb-8">
              <Link to="/student/applications" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
                ← Back to Applications
              </Link>
              <h1 className="text-3xl font-bold mb-2">Application Status</h1>
              <p className="text-muted-foreground">{project.title}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Status Tracker */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-4 cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={() => toggleExpanded('submitted')}>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-success-foreground" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">Submitted</h3>
                              <p className="text-sm text-muted-foreground">Application received</p>
                            </div>
                            <span className="text-sm text-muted-foreground">2 days ago</span>
                            {expandedSteps.submitted ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-12 mt-2">
                          <p className="text-sm">Your application was submitted on {new Date(application.created_at).toLocaleDateString()}.</p>
                        </CollapsibleContent>
                      </Collapsible>

                      <div className="ml-4 border-l-2 h-8"></div>

                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-4 cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={() => toggleExpanded('review')}>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                              <Clock className="h-5 w-5 text-accent-foreground" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">Under Review</h3>
                              <p className="text-sm text-muted-foreground">Being reviewed by employer</p>
                            </div>
                            {(isReviewing || isAccepted || isRejected) ? (
                              <Badge className="bg-blue-100 text-blue-700">Started</Badge>
                            ) : (
                              <Badge variant="outline">Waiting</Badge>
                            )}
                            {expandedSteps.review ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-12 mt-2">
                          <p className="text-sm">
                            {(isReviewing || isAccepted || isRejected)
                              ? "The employer has started reviewing your application."
                              : "The employer has not yet started reviewing applications."}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>

                      <div className="ml-4 border-l-2 border-dashed h-8"></div>

                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-4 cursor-pointer hover:bg-muted/50 p-2 rounded opacity-40" onClick={() => toggleExpanded('decision')}>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">Decision</h3>
                              <p className="text-sm text-muted-foreground">{isPending || isReviewing ? "Awaiting final decision" : "Decision reached"}</p>
                            </div>
                            {isAccepted && <Badge className="bg-green-100 text-green-700">Accepted</Badge>}
                            {isRejected && <Badge className="bg-red-100 text-red-700">Rejected</Badge>}
                            {isWithdrawn && <Badge className="bg-gray-100 text-gray-700">Withdrawn</Badge>}
                            {expandedSteps.decision ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-12 mt-2">
                          <p className="text-sm">
                            {isAccepted ? "Congratulations! Your application was accepted." :
                              isRejected ? "Unfortunately, your application was not selected." :
                                isWithdrawn ? "You withdrew this application." :
                                  "Pending. We'll notify you via email and message once a decision is made."}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </CardContent>
                </Card>

                {/* Communication Panel - redirect to real Messages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Communicate directly with the employer in the dedicated Messages area.
                    </p>
                    <Button onClick={handleSendMessage} variant="outline" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Open Messages
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Company</p>
                      <p className="font-medium">{companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-medium">{project.duration_hours ? `${project.duration_hours} hrs` : "Flexible"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {(project.required_skills || []).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link to={`/project/${project.id}`}>View Project</Link>
                    </Button>
                  </CardContent>
                </Card>

                {(isPending || isReviewing) && (
                  <Card className="border-destructive/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 mb-4">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1">Withdraw Application</h3>
                          <p className="text-sm text-muted-foreground">
                            You can withdraw your application at any time
                          </p>
                        </div>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            Withdraw Application
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. Your application will be permanently withdrawn
                              and you'll need to reapply if you change your mind.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={withdrawing}>Cancel</AlertDialogCancel>
                            <AlertDialogAction disabled={withdrawing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleWithdraw}>
                              Yes, Withdraw
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationStatus;
