import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChatCircle as MessageCircle, CheckCircle, XCircle, Eye, User, WarningCircle, FileText, WarningCircleIcon } from "@phosphor-icons/react";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  useFetchProjectApplications,
  updateApplicationStatus,
  approveApplicationAndIssueCredential,
  cancelAcceptedApplication,
  type ApplicationWithDetails,
  type ApplicationStatus,
} from "@/hooks/useApplications";
import { useFetchProject } from "@/hooks/useProjects";
import { Star, Link as LinkIcon, AlertTriangle, TicketCheckIcon, XCircleIcon, MessageCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EscrowPaymentModal } from "@/components/EscrowPaymentModal";
import { AlertCircle } from "lucide-react";

// ─── Status badge helper ──────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ApplicationStatus }) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case "reviewing":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reviewing</Badge>;
    case "accepted":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    case "withdrawn":
      return <Badge variant="outline" className="bg-gray-100 text-muted-foreground border-border">Withdrawn</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Completed</Badge>;
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
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Applications() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const { applications, loading, error, refetch } = useFetchProjectApplications(user?.id ?? null, projectId);
  const { project, loading: projectLoading } = useFetchProject(projectId ?? null);

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "status">("recent");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>("");

  // Show error toast if data fetch fails
  useEffect(() => {
    if (error) {
      toast({ title: "Failed to load applications", description: error, variant: "destructive" });
    }
  }, [error, toast]);

  // ── Action handlers ───────────────────────────────────────────────────────

  const handleStatusChange = async (newStatus: ApplicationStatus, app: ApplicationWithDetails) => {
    setActionLoading(true);
    const { error: updateError } = await updateApplicationStatus(app.id, newStatus, app.project_id);
    setActionLoading(false);

    if (updateError) {
      toast({ title: "Action failed", description: updateError, variant: "destructive" });
    } else {
      if (newStatus === "accepted") {
        toast({
          title: "Funds securely held in Escrow",
          description: "Project started!",
          variant: "default",
        });
      } else {
        const labels: Record<string, string> = {
          rejected: "Rejected",
          reviewing: "Marked as reviewing",
        };
        toast({
          title: `Application ${labels[newStatus] ?? newStatus}`,
          description: `${app.student_name ?? "Student"}'s application has been updated.`,
          variant: newStatus === "rejected" ? "destructive" : "default",
        });
      }
      refetch();
    }
    setRejectDialogOpen(false);
    setIsEscrowModalOpen(false);
    setSelectedApp(null);
  };

  const handleCancelAccepted = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    const { error: cancelError } = await cancelAcceptedApplication(selectedApp.id, selectedApp.project_id);
    setActionLoading(false);

    if (cancelError) {
      toast({ title: "Cancellation failed", description: cancelError, variant: "destructive" });
    } else {
      toast({
        title: "Project Cancelled",
        description: `Escrow has been refunded and the project is open again.`,
      });
      refetch();
    }
    setCancelDialogOpen(false);
    setSelectedApp(null);
  };

  const handleApproveAndComplete = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    const { error: completeErr } = await approveApplicationAndIssueCredential({
      application_id: selectedApp.id,
      project_id: selectedApp.project_id,
      student_id: selectedApp.student_id,
      business_id: selectedApp.business_id!,
      rating,
      feedback,
      skills_verified: [] // Could add a skill selector here, leaving empty default for now
    });
    setActionLoading(false);

    if (completeErr) {
      toast({ title: "Action failed", description: completeErr, variant: "destructive" });
    } else {
      toast({
        title: "Project Completed",
        description: `You have approved ${selectedApp.student_name}'s work and issued a credential.`,
      });
      refetch();
    }
    setCompleteDialogOpen(false);
    setSelectedApp(null);
    setRating(5);
    setFeedback("");
  };

  const handleNavigateToMessages = (projectId: string, studentId: string, name: string | null) => {
    navigate(`/project/${projectId}/messages?to=${studentId}`);
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
  const [confirmText, setConfirmText] = useState("");
  const isConfirmed = confirmText.trim().toLowerCase() === "confirm";

  const [cancelConfirmText, setCancelConfirmText] = useState("");
  const isCancelConfirmed = cancelConfirmText.trim().toLowerCase() === "cancel";

  // Reset when dialog closes
  const handleDialogClose = (open: boolean) => {
    if (!open) setConfirmText("");
    setCompleteDialogOpen(open);
  };

  const handleCancelDialogClose = (open: boolean) => {
    if (!open) setCancelConfirmText("");
    setCancelDialogOpen(open);
  };


  // ── Filter & sort ─────────────────────────────────────────────────────────

  const filtered = applications
    .filter((a) => selectedFilter === "all" || a.status === selectedFilter)
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return a.status.localeCompare(b.status);
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

  return (
    <div className="min-h-screen bg-background">
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
            {projectId
              ? (project?.title ? `Applications for ${project.title}` : "Applications")
              : "Applications Received"}
          </h1>
          <p className="text-muted-foreground">
            {projectId
              ? "Review and manage applications for this specific project"
              : "Review and manage student applications for your projects"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full md:w-auto">
            <TabsList className="flex h-auto bg-slate-50 border border-slate-200 rounded-2xl p-1.5 gap-1 overflow-x-auto">
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


          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Application list */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <AppSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">
                  {selectedFilter === "all" ? "No applications received yet" : `No ${selectedFilter} applications`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((app) => (
              <Card key={app.id} className="transition-all duration-200 hover:shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    {/* Clickable Profile Area */}
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => navigate(`/student-profile/${app.student_id}`)}
                    >
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                        <User className="h-6 w-6 text-slate-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {app.student_name ?? "Student"}
                        </CardTitle>
                        <CardDescription>Applied for: {app.project_title ?? "—"}</CardDescription>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(app.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Cover letter & Deliverable preview */}
                  <div className="mb-4 space-y-3">
                    {app.cover_letter && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-slate-600 text-sm line-clamp-2 italic">"{app.cover_letter}"</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 h-auto text-xs text-blue-600 hover:text-blue-700 mt-1"
                          onClick={() => { setSelectedApp(app); setCoverLetterDialogOpen(true); }}
                        >
                          Read full cover letter &rarr;
                        </Button>
                      </div>
                    )}

                    {app.cv_url && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-slate-500 mr-2" />
                          <span className="text-sm font-medium text-slate-700">Student CV / Portfolio</span>
                        </div>
                        <a
                          href={app.cv_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center bg-white border border-slate-200 py-1.5 px-3 rounded-md shadow-sm transition-all hover:shadow"
                        >
                          <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                          View Attachment
                        </a>
                      </div>
                    )}

                    {app.deliverable_link && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-900">Student submitted deliverable</span>
                        </div>
                        <a
                          href={app.deliverable_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center bg-white border border-blue-200 py-1.5 px-3 rounded-md shadow-sm transition-all hover:shadow"
                        >
                          <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                          View Work
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">

                    {/* View Profile is useful regardless of status */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/student-profile/${app.student_id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      View Profile
                    </Button>

                    {/* ACCEPTED STATE */}
                    {app.status === "accepted" && (
                      <>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => { setSelectedApp(app); handleCancelDialogClose(true); }}
                        >
                          <XCircleIcon className="h-4 w-4 mr-1.5" />
                          Cancel Project
                        </Button>

                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleNavigateToMessages(app.project_id, app.student_id, app.student_name)}
                        >
                          <MessageCircleIcon className="h-4 w-4 mr-1.5" />
                          Message
                        </Button>

                        {app.deliverable_link && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => { setSelectedApp(app); setCompleteDialogOpen(true); }}
                          >
                            <CheckCircle2Icon className="h-4 w-4 mr-1.5" />
                            Approve & Complete
                          </Button>
                        )}
                      </>
                    )}

                    {/* PENDING / REVIEWING STATE */}
                    {(app.status === "pending" || app.status === "reviewing") && (
                      <>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => { setSelectedApp(app); setRejectDialogOpen(true); }}
                        >
                          <XCircle className="h-4 w-4 mr-1.5" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => { setSelectedApp(app); setIsEscrowModalOpen(true); }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1.5" />
                          Accept
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Escrow Modal replacing old Accept AlertDialog */}
      {selectedApp && (
        <EscrowPaymentModal
          isOpen={isEscrowModalOpen}
          onClose={() => { setIsEscrowModalOpen(false); setSelectedApp(null); }}
          project={{
            title: selectedApp.project_title ?? "Project",
            budget: selectedApp.project_budget ?? 0
          }}
          application={{
            student_name: selectedApp.student_name ?? "Student",
            student_id: selectedApp.student_id
          }}
          onSuccess={() => handleStatusChange("accepted", selectedApp)}
        />
      )}

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Reject <strong>{selectedApp?.student_name ?? "this student"}</strong>'s application? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedApp && handleStatusChange("rejected", selectedApp)}
            >
              Reject Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Accepted App Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={handleCancelDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" /> Cancel Accepted Project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the project with <strong>{selectedApp?.student_name ?? "this student"}</strong>?
              <br /><br />
              This will <strong>refund the escrowed payment</strong> and make the project open for other applications again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Type to confirm */}
          <div className="space-y-2 py-4">
            <label className="text-xs font-medium text-slate-600">
              Type{" "}
              <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px]">
                cancel
              </kbd>{" "}
              to enable cancellation
            </label>
            <div className="relative">
              <input
                type="text"
                value={cancelConfirmText}
                onChange={(e) => setCancelConfirmText(e.target.value)}
                placeholder="Type cancel..."
                className={`w-full h-9 px-3 rounded-lg border text-sm transition-all outline-none
            ${isCancelConfirmed
                    ? "border-red-400 bg-red-50 text-red-800 placeholder:text-red-300"
                    : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 focus:border-red-400 focus:ring-2 focus:ring-red-50"
                  }`}
              />
              {isCancelConfirmed && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                </div>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Go Back</AlertDialogCancel>
            <AlertDialogAction
              disabled={actionLoading || !isCancelConfirmed}
              className={cn(
                "transition-all",
                isCancelConfirmed ? "bg-red-600 hover:bg-red-700" : "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200 shadow-none hover:bg-slate-100"
              )}
              onClick={handleCancelAccepted}
            >
              Cancel Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cover Letter Dialog */}
      <Dialog open={coverLetterDialogOpen} onOpenChange={setCoverLetterDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cover Letter — {selectedApp?.student_name ?? "Student"}</DialogTitle>
            <DialogDescription>Applied for: {selectedApp?.project_title}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700 whitespace-pre-wrap">{selectedApp?.cover_letter}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Project Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xl bg-white">

          {/* Header */}
          <div className="px-6 pt-6 pb-5">
            <div className="flex items-start gap-4">
              <div className="pt-0.5">
                <DialogTitle className="text-base font-semibold text-slate-900 leading-snug">
                  Release Payment & Complete Project
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-0.5 leading-snug">
                  Review the details below before finalizing.
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-4">
            <div className="border-t border-slate-100" />

            {/* Project Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Project</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 -mt-1">
                {selectedApp?.project_title}
              </p>
            </div>

            {/* Student + Amount Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Student</p>
                <p className="text-sm font-medium text-slate-800 truncate">{selectedApp?.student_name}</p>
              </div>
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Escrow Release</p>
                <p className="text-sm font-bold text-slate-900">£{selectedApp?.project_budget || "0.00"}</p>
              </div>
            </div>

            {/* Warning Box */}
            <div className="flex gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <WarningCircleIcon className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800 leading-relaxed">
                By completing this project, you confirm the deliverables meet your requirements.{" "}
                <span className="font-semibold">This action cannot be undone.</span>
              </p>
            </div>

            {/* ── Confirmation Input ── */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">
                Type{" "}
                <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px]">
                  confirm
                </kbd>{" "}
                to enable payment release
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type confirm..."
                  className={`w-full h-9 px-3 rounded-lg border text-sm transition-all outline-none
              ${isConfirmed
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800 placeholder:text-emerald-300"
                      : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                    }`}
                />
                {isConfirmed && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Actions */}
            <div className="flex items-center justify-between pt-1 gap-3">
              <Button
                variant="destructive"
                onClick={() => handleDialogClose(false)}
                disabled={actionLoading}
                className="text-white hover:text-white hover:bg-red-700 text-sm font-medium h-9 px-4 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApproveAndComplete}
                disabled={actionLoading || !isConfirmed}
                className={`text-sm font-semibold h-9 px-5 rounded-lg shadow-sm transition-all
            ${isConfirmed
                    ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
              >
                {actionLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Release Payment"
                )}
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}
