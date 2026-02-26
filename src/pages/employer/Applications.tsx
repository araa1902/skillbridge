import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MessageCircle, CheckCircle, XCircle, Eye, User } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  useFetchProjectApplications,
  updateApplicationStatus,
  approveApplicationAndIssueCredential,
  type ApplicationWithDetails,
  type ApplicationStatus,
} from "@/hooks/useApplications";
import { Star, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
      return <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">Withdrawn</Badge>;
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
  const { toast } = useToast();
  const { user } = useAuth();

  const { applications, loading, error, refetch } = useFetchProjectApplications(user?.id ?? null);

  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "status">("recent");
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);
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
      const labels: Record<string, string> = {
        accepted: "Accepted",
        rejected: "Rejected",
        reviewing: "Marked as reviewing",
      };
      toast({
        title: `Application ${labels[newStatus] ?? newStatus}`,
        description: `${app.student_name ?? "Student"}'s application has been updated.`,
        variant: newStatus === "rejected" ? "destructive" : "default",
      });
      refetch();
    }
    setAcceptDialogOpen(false);
    setRejectDialogOpen(false);
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications Received</h1>
          <p className="text-gray-600">Review and manage student applications for your projects</p>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <div className="flex flex-wrap gap-2">
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

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Sort by:</span>
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
                <p className="text-gray-500">
                  {selectedFilter === "all" ? "No applications received yet" : `No ${selectedFilter} applications`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-muted">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{app.student_name ?? "Student"}</CardTitle>
                        <CardDescription>Applied for: {app.project_title ?? "—"}</CardDescription>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(app.created_at).toLocaleDateString()}
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
                      <div>
                        <p className="text-gray-600 text-sm line-clamp-2">{app.cover_letter}</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 h-auto text-xs"
                          onClick={() => { setSelectedApp(app); setCoverLetterDialogOpen(true); }}
                        >
                          Read full cover letter
                        </Button>
                      </div>
                    )}

                    {app.deliverable_link && (
                      <div className="bg-blue-50/50 p-3 rounded border border-blue-100">
                        <p className="text-xs font-medium text-blue-900 mb-1 flex items-center">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Student submitted work
                        </p>
                        <a
                          href={app.deliverable_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center bg-white border border-blue-200 py-1.5 px-3 rounded w-max transition-colors"
                        >
                          <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                          View Deliverable
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
                    {app.status === "accepted" && (
                      <div className="flex gap-2 w-full justify-end">
                        {app.deliverable_link && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => { setSelectedApp(app); setCompleteDialogOpen(true); }}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve & Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleNavigateToMessages(app.project_id, app.student_id, app.student_name)}>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/student-profile/${app.student_id}`)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
                    )}

                    {(app.status === "pending" || app.status === "reviewing") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => { setSelectedApp(app); setRejectDialogOpen(true); }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => { setSelectedApp(app); setAcceptDialogOpen(true); }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
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

      {/* Accept Dialog */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Accept <strong>{selectedApp?.student_name ?? "this student"}</strong>'s application for{" "}
              <strong>{selectedApp?.project_title}</strong>? The student will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
              onClick={() => selectedApp && handleStatusChange("accepted", selectedApp)}
            >
              Accept Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve & Complete Project</DialogTitle>
            <DialogDescription>
              Review the submitted deliverable and provide feedback to {selectedApp?.student_name}.
              This will mark the project as completed and issue a credential.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Rating (out of 5)</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`focus:outline-none transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                  >
                    <Star className={`h-6 w-6 ${rating >= star ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback for the student</Label>
              <Textarea
                id="feedback"
                placeholder="Great work on this project! The final deliverables were exactly what we needed..."
                className="resize-none"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded text-sm mb-2 border border-yellow-200">
              <p><strong>Note:</strong> Completing this project will release payment to the student.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)} disabled={actionLoading}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleApproveAndComplete} disabled={actionLoading || !feedback.trim()}>
              Complete Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
