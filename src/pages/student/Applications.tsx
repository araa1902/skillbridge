import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, CheckCircle, XCircle, Building2, Calendar, MessageCircle, FileText, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import {
  useFetchMyApplications,
  updateApplicationStatus,
  type ApplicationWithDetails,
  type ApplicationStatus,
} from "@/hooks/useApplications";
import { createReferenceRequest } from "@/hooks/useReferences";

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ApplicationStatus }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="h-3 w-3 mr-1" />Pending
        </Badge>
      );
    case "reviewing":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />Reviewing
        </Badge>
      );
    case "accepted":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />Accepted
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />Rejected
        </Badge>
      );
    case "withdrawn":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
          Withdrawn
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <CheckCircle className="h-3 w-3 mr-1" />Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function AppSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-4/5 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StudentApplications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const { applications, loading, error, refetch } = useFetchMyApplications(user?.id ?? null);

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [coverLetterApp, setCoverLetterApp] = useState<ApplicationWithDetails | null>(null);

  // Show error toast if data fetch fails
  useEffect(() => {
    if (error) {
      toast({ title: "Failed to load applications", description: error, variant: "destructive" });
    }
  }, [error, toast]);

  // ── Action handlers ───────────────────────────────────────────────────────

  const handleWithdraw = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    const { error: updateError } = await updateApplicationStatus(selectedApp.id, "withdrawn");
    setActionLoading(false);

    if (updateError) {
      toast({ title: "Withdraw failed", description: updateError, variant: "destructive" });
    } else {
      toast({ title: "Application Withdrawn", description: "Your application has been withdrawn." });
      refetch();
    }
    setWithdrawDialogOpen(false);
    setSelectedApp(null);
  };

  // ── Filter ────────────────────────────────────────────────────────────────

  const filtered = applications.filter((a) => {
    if (selectedFilter === "all") return true;
    return a.status === selectedFilter;
  });

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    completed: applications.filter((a) => a.status === "completed").length,
  };

  const displayName = (app: ApplicationWithDetails) =>
    app.company_name ?? app.business_name ?? "Company";

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

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "pending", "reviewing", "accepted", "completed", "rejected"] as const).map((f) => (
            <Button
              key={f}
              variant={selectedFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </Button>
          ))}
        </div>

        {/* Application list */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <AppSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 mb-4">
                  {selectedFilter === "all" ? "You haven't applied to any projects yet" : `No ${selectedFilter} applications`}
                </p>
                <Link to="/browse-projects">
                  <Button>Browse Projects</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filtered.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-semibold">
                          {displayName(app).slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <CardTitle className="text-lg">{app.project_title ?? "Project"}</CardTitle>
                          <StatusBadge status={app.status} />
                        </div>
                        <CardDescription className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {displayName(app)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied {new Date(app.created_at).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {app.cover_letter && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-1 text-gray-700">Your Cover Letter</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{app.cover_letter}</p>
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 h-auto text-xs"
                        onClick={() => setCoverLetterApp(app)}
                      >
                        Read full cover letter
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-between items-center gap-2 mt-2 pt-2 border-t">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/project/${app.project_id}`}>
                          <FileText className="h-4 w-4 mr-1" />
                          View Project
                        </Link>
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {app.status === "accepted" && (
                        <Button size="sm" onClick={() => navigate(`/project/${app.project_id}/messages?to=${app.business_id || ''}`)}>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message Employer
                        </Button>
                      )}
                      {app.status === "completed" && (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={async () => {
                            if (!user || (!app.business_id)) return;
                            setActionLoading(true);
                            const { error: reqErr } = await createReferenceRequest({
                              student_id: user.id,
                              employer_id: app.business_id,
                              project_id: app.project_id,
                              student_name: user?.user_metadata?.full_name || "Student",
                              project_title: app.project_title || "Project"
                            });
                            setActionLoading(false);
                            if (reqErr) {
                              toast({ title: "Failed to request", description: reqErr, variant: "destructive" });
                            } else {
                              toast({ title: "Reference Requested", description: "The employer has been notified." });
                            }
                          }}
                          disabled={actionLoading}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Request Reference
                        </Button>
                      )}
                      {(app.status === "pending" || app.status === "reviewing") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => { setSelectedApp(app); setWithdrawDialogOpen(true); }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Withdraw Dialog */}
      <AlertDialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw your application for{" "}
              <strong>{selectedApp?.project_title}</strong>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
              onClick={handleWithdraw}
            >
              Withdraw Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cover Letter Dialog */}
      <AlertDialog open={!!coverLetterApp} onOpenChange={(o) => { if (!o) setCoverLetterApp(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your Cover Letter</AlertDialogTitle>
            <AlertDialogDescription>
              For: {coverLetterApp?.project_title}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2 mb-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{coverLetterApp?.cover_letter}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setCoverLetterApp(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


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
