import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, CheckCircle, XCircle, Buildings as Building2, Calendar, ChatCircle as MessageCircle, FileText, Trash as Trash2, ArrowUUpLeft as Undo2, Eye, HandWithdrawIcon } from "@phosphor-icons/react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  useFetchMyApplications,
  updateApplicationStatus,
  updateDeliverableLink,
  type ApplicationWithDetails,
  type ApplicationStatus,
} from "@/hooks/useApplications";
import {
  createReferenceRequest,
  useFetchStudentReferences,
  useFetchMyReferenceRequests,
  type ReferenceFromDB
} from "@/hooks/useReferences";
import { ReferenceCard } from "@/components/ReferenceCard";
import { Link as LinkIcon, UploadSimple as Upload } from "@phosphor-icons/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubmitDeliverableDialog } from "@/components/SubmitDeliverableDialog";

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

  const { applications, loading: appsLoading, error, refetch: refetchApps } = useFetchMyApplications(user?.id ?? null);
  const { references, loading: refsLoading, refetch: refetchRefs } = useFetchStudentReferences(user?.id ?? null);
  const { requests, loading: reqsLoading, refetch: refetchReqs } = useFetchMyReferenceRequests(user?.id ?? null);

  const refetchAll = () => {
    refetchApps();
    refetchRefs();
    refetchReqs();
  };

  const loading = appsLoading || refsLoading || reqsLoading;

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);
  const [submitApp, setSubmitApp] = useState<ApplicationWithDetails | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [coverLetterApp, setCoverLetterApp] = useState<ApplicationWithDetails | null>(null);
  const [viewReference, setViewReference] = useState<ReferenceFromDB | null>(null);

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
      refetchAll();
    }
    setWithdrawDialogOpen(false);
    setSelectedApp(null);
  };


  const FILTERS = ["all", "pending", "reviewing", "accepted", "completed", "rejected", "withdrawn"] as const;
  type Filter = typeof FILTERS[number];

  const STATUS_STYLES: Record<Filter, string> = {
    all: "bg-slate-100 text-slate-600",
    pending: "bg-amber-100 text-amber-600",
    reviewing: "bg-blue-100 text-blue-600",
    accepted: "bg-emerald-100 text-emerald-600",
    completed: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
    withdrawn: "bg-gray-100 text-gray-600",
  };

  const ACTIVE_BADGE_STYLES: Record<Filter, string> = {
    all: "bg-slate-200 text-slate-700",
    pending: "bg-amber-200 text-amber-700",
    reviewing: "bg-blue-200 text-blue-700",
    accepted: "bg-emerald-200 text-emerald-700",
    completed: "bg-green-200 text-green-700",
    rejected: "bg-red-200 text-red-700",
    withdrawn: "bg-gray-200 text-gray-700",
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
    withdrawn: applications.filter((a) => a.status === "withdrawn").length,
  };

  const displayName = (app: ApplicationWithDetails) =>
    app.company_name ?? app.business_name ?? "Company";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="page-container py-8">
        <div className="mb-8">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            My Applications
          </h1>
          <p className="text-muted-foreground">Track the status of your project applications</p>
        </div>

        {/* Filter tabs */}
        <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
          <TabsList className="inline-flex h-auto bg-slate-50 border border-slate-200 rounded-2xl p-1.5 gap-1 overflow-x-auto">
            {FILTERS.map((f) => {
              const isActive = selectedFilter === f;
              return (
                <TabsTrigger
                  key={f}
                  value={f}
                  className={cn(
                    // Base
                    "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium",
                    "capitalize whitespace-nowrap transition-all duration-200",
                    // Inactive
                    "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
                    // Active
                    "data-[state=active]:bg-white data-[state=active]:shadow-sm",
                    "data-[state=active]:ring-1 data-[state=active]:ring-slate-200/80",
                    isActive && STATUS_STYLES[f].replace("bg-", "data-[state=active]:text-").split(" ")[0],
                  )}
                >
                  {f}
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5",
                      "text-[10px] font-semibold rounded-full transition-colors duration-200",
                      isActive ? ACTIVE_BADGE_STYLES[f] : "bg-slate-200 text-slate-500"
                    )}
                  >
                    {counts[f]}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Application list */}
        <div className="space-y-4 mt-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <AppSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
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
                      <h4 className="font-medium text-sm mb-1 text-foreground">Your Cover Letter</h4>
                      <p className="text-muted-foreground text-sm line-clamp-2">{app.cover_letter}</p>
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

                  <div className="flex flex-wrap justify-between items-center gap-2 mt-2 pt-2 border-t border-border">
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
                        <>
                          {app.project_documents_url && (
                            <a
                              href={app.project_documents_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 px-3 mr-2"
                            >
                              <FileText className="h-4 w-4 mr-1 text-slate-500" />
                              Project Resources
                            </a>
                          )}
                          <Button
                            size="sm"
                            className={app.deliverable_link ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
                            onClick={() => {
                              setSubmitApp(app);
                            }}
                          >
                            {app.deliverable_link ? (
                              <><LinkIcon className="h-4 w-4 mr-1" /> Update Link</>
                            ) : (
                              <><Upload className="h-4 w-4 mr-1" /> Submit Deliverable</>
                            )}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/project/${app.project_id}/messages?to=${app.business_id || ''}`)}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message Employer
                          </Button>
                        </>
                      )}
                      {app.status === "completed" && (() => {
                        const reference = references.find(r => r.project_id === app.project_id);
                        const request = requests.find(r => r.project_id === app.project_id);

                        if (reference) {
                          return (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => setViewReference(reference)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Reference
                            </Button>
                          );
                        }

                        if (request) {
                          return (
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled
                              className="bg-purple-100 text-purple-700 hover:bg-purple-100 opacity-100"
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Reference Requested
                            </Button>
                          );
                        }

                        return (
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
                                refetchAll();
                              }
                            }}
                            disabled={actionLoading}
                          >
                            <Undo2 className="h-4 w-4 mr-1" />
                            Request Reference
                          </Button>
                        );
                      })()}
                      {(app.status === "pending" || app.status === "reviewing") && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => { setSelectedApp(app); setWithdrawDialogOpen(true); }}
                        >
                          <HandWithdrawIcon className="h-4 w-4 mr-1" />
                          Withdraw Application
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
            <p className="text-sm text-foreground whitespace-pre-wrap">{coverLetterApp?.cover_letter}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setCoverLetterApp(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reference Dialog */}
      <Dialog open={!!viewReference} onOpenChange={(o) => { if (!o) setViewReference(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reference for {viewReference?.project_title}</DialogTitle>
          </DialogHeader>
          {viewReference && (
            <div className="mt-4">
              <ReferenceCard reference={viewReference} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <SubmitDeliverableDialog
        applicationId={submitApp?.id ?? null}
        initialLink={submitApp?.deliverable_link || ""}
        onClose={() => setSubmitApp(null)}
        onSuccess={refetchAll}
      />

    </div>
  );
}
