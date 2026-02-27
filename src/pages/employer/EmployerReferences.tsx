import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useFetchWrittenReferences, writeReference, useFetchPendingRequests } from "@/hooks/useReferences";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle as CheckCircle2, Clock, Star, PaperPlaneRight as Send, WarningCircle as AlertCircle, FileText, TrendUp as TrendingUp, CaretRight as ChevronRight, Sparkle as Sparkles, UserCircleCheck as UserCheck } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ─── helpers ──────────────────────────────────────────────────────────── */

const METRICS = [
  { key: "workQuality", label: "Work Quality", icon: "✦" },
  { key: "communication", label: "Communication", icon: "✦" },
  { key: "professionalism", label: "Professionalism", icon: "✦" },
  { key: "technicalSkills", label: "Technical Skills", icon: "✦" },
] as const;

const INITIAL_FORM = {
  rating: 5,
  workQuality: 5,
  communication: 5,
  professionalism: 5,
  technicalSkills: 5,
  overallFeedback: "",
  strengths: "",
  areasForImprovement: "",
  wouldWorkAgain: true,
};

/** Convert a 1-5 score to a readable label */
function scoreLabel(n: number) {
  return ["", "Poor", "Fair", "Good", "Great", "Excellent"][n] ?? n;
}

/** Compact score pill shown inside metric rows */
function ScorePill({ value }: { value: number }) {
  const colours: Record<number, string> = {
    1: "bg-red-50 text-red-600 border-red-200",
    2: "bg-orange-50 text-orange-600 border-orange-200",
    3: "bg-yellow-50 text-yellow-600 border-yellow-200",
    4: "bg-emerald-50 text-emerald-600 border-emerald-200",
    5: "bg-teal-50 text-teal-700 border-teal-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-700 tabular-nums",
        colours[value] ?? "bg-muted text-muted-foreground border-border"
      )}
    >
      {value}/5 · {scoreLabel(value)}
    </span>
  );
}

/* ─── stat card ─────────────────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  loading?: boolean;
  iconBg?: string;
}

function StatCard({ label, value, icon, loading, iconBg = "bg-teal-50 text-teal-600" }: StatCardProps) {
  return (
    <div className="surface p-5 flex items-center gap-4">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
        {icon}
      </div>
      <div className="min-w-0">
        {loading ? (
          <Skeleton className="h-7 w-16 mb-1" />
        ) : (
          <p className="text-2xl font-800 tracking-tight text-foreground leading-none">{value}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ─── main component ────────────────────────────────────────────────────── */

const EmployerReferences = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { references, loading } = useFetchWrittenReferences(user?.id ?? null);
  const { requests, loading: loadingRequests } = useFetchPendingRequests(user?.id ?? null);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value[0] }));
  };

  const handleSubmitReference = async () => {
    if (!user || !profile) {
      toast({ title: "Authentication required", description: "Please sign in to submit a reference.", variant: "destructive" });
      return;
    }
    if (!formData.overallFeedback.trim()) {
      toast({ title: "Feedback required", description: "Please write overall feedback before submitting.", variant: "destructive" });
      return;
    }
    const selectedRequest = requests.find((r) => r.id === selectedRequestId);
    if (!selectedRequest) {
      toast({ title: "Select a student", description: "Please choose a student and project to review.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await writeReference({
        student_id: selectedRequest.student_id,
        student_name: selectedRequest.student_name,
        employer_id: user.id,
        employer_name: profile.full_name || "Employer",
        employer_title: "Employer",
        company_name: profile.company_name || "Company",
        company_logo: undefined,
        project_id: selectedRequest.project_id,
        project_title: selectedRequest.project_title,
        rating: formData.rating,
        skills: [],
        strengths: formData.strengths.split("\n").map((s) => s.trim()).filter(Boolean),
        areas_for_improvement: formData.areasForImprovement.split("\n").map((a) => a.trim()).filter(Boolean),
        overall_feedback: formData.overallFeedback,
        work_quality: formData.workQuality,
        communication: formData.communication,
        professionalism: formData.professionalism,
        technical_skills: formData.technicalSkills,
        would_work_again: formData.wouldWorkAgain,
        is_public: true,
        request_id: selectedRequestId,
      });

      if (error) {
        toast({ title: "Submission failed", description: error, variant: "destructive" });
      } else {
        setShowSuccessDialog(true);
        setSelectedRequestId(null);
        setFormData(INITIAL_FORM);
      }
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── unauthenticated state ── */
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="empty-state surface max-w-sm w-full">
          <div className="empty-state__icon">
            <UserCheck className="w-6 h-6" />
          </div>
          <p className="empty-state__title">Sign in required</p>
          <p className="empty-state__body">Please sign in to manage references for your students.</p>
        </div>
      </div>
    );
  }

  const avgRating =
    references.length > 0
      ? (references.reduce((s, r) => s + r.rating, 0) / references.length).toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-10">

        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="eyebrow mb-2">References</p>
            <h1 className="text-display" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.75rem,4vw,2.5rem)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              Student References
            </h1>
            <p className="text-muted-foreground mt-2 text-[0.9375rem]">
              Provide feedback for students who completed your projects
            </p>
          </div>
          {requests.length > 0 && (
            <Badge className="badge badge--warning self-start sm:self-auto">
              <Clock className="w-3 h-3" />
              {requests.length} pending {requests.length === 1 ? "request" : "requests"}
            </Badge>
          )}
        </div>

        {/* ── Stats row ── */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="References Given"
            value={references.length}
            icon={<CheckCircle2 className="w-5 h-5" />}
            loading={loading}
            iconBg="bg-teal-50 text-teal-600"
          />
          <StatCard
            label="Pending Requests"
            value={requests.length}
            icon={<Clock className="w-5 h-5" />}
            loading={loadingRequests}
            iconBg="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Avg Rating Given"
            value={
              <span className="flex items-baseline gap-1.5">
                {avgRating}
                {references.length > 0 && (
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
                )}
              </span>
            }
            icon={<TrendingUp className="w-5 h-5" />}
            loading={loading}
            iconBg="bg-violet-50 text-violet-600"
          />
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-5 gap-6 items-start">

          {/* ── LEFT: Completed references ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="surface p-5">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-semibold text-[0.9375rem]" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.018em" }}>
                  Completed References
                </h2>
                {!loading && references.length > 0 && (
                  <span className="ml-auto badge badge--primary">{references.length}</span>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col gap-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-[4.5rem] w-full rounded-xl" />
                  ))}
                </div>
              ) : references.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {references.map((ref) => (
                    <div
                      key={ref.id}
                      className="group flex items-start gap-3 p-3.5 rounded-xl border border-border hover:border-border-strong hover:bg-muted/40 transition-all duration-150"
                    >
                      {/* Avatar initials */}
                      <div className="avatar avatar--sm flex-shrink-0" style={{ background: "hsl(var(--primary-subtle))", color: "hsl(var(--primary))" }}>
                        {ref.student_name?.charAt(0).toUpperCase() ?? "S"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-600 text-sm text-foreground truncate-line">
                            {ref.student_name}
                          </p>
                          <span className="star-rating flex-shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="star-rating__count">{ref.rating}</span>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ref.project_title}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {new Date(ref.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-border-strong flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state py-10">
                  <div className="empty-state__icon">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="empty-state__title">No references yet</p>
                  <p className="empty-state__body">References you write will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Write a reference form ── */}
          <div className="lg:col-span-3">
            <div className="surface p-6 flex flex-col gap-7">

              {/* Form header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-700 text-[1.0625rem]" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                    Write a Reference
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Provide detailed, honest feedback to help this student grow
                  </p>
                </div>
              </div>

              <div className="divider" />

              {/* ── Section 1: Student & project selection ── */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[0.625rem] font-700 flex-shrink-0">1</span>
                  <Label className="form-label">Select Student & Project</Label>
                  <span className="text-destructive text-sm">*</span>
                </div>

                {loadingRequests ? (
                  <div className="flex flex-col gap-2">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                  </div>
                ) : requests.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {requests.map((request) => {
                      const isSelected = selectedRequestId === request.id;
                      return (
                        <button
                          key={request.id}
                          type="button"
                          onClick={() => setSelectedRequestId(request.id)}
                          className={cn(
                            "w-full text-left flex items-center gap-3 p-4 rounded-xl border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected
                              ? "border-primary/40 bg-primary/5 ring-1 ring-primary/25"
                              : "border-border hover:border-border-strong hover:bg-muted/30"
                          )}
                        >
                          {/* Avatar */}
                          <div
                            className="avatar avatar--md flex-shrink-0"
                            style={
                              isSelected
                                ? { background: "hsl(var(--primary-subtle))", color: "hsl(var(--primary))" }
                                : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
                            }
                          >
                            {request.student_name?.charAt(0).toUpperCase() ?? "S"}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={cn("font-600 text-sm truncate-line", isSelected ? "text-foreground" : "text-foreground")}>
                              {request.student_name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate-line">{request.project_title}</p>
                          </div>

                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all",
                            isSelected ? "bg-primary border-primary" : "border-border"
                          )}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border bg-muted/20">
                    <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-500 text-foreground">No pending requests</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Students must request a reference before you can submit one.</p>
                    </div>
                  </div>
                )}
              </section>

              <div className="divider" />

              {/* ── Section 2: Overall star rating ── */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[0.625rem] font-700 flex-shrink-0">2</span>
                  <Label className="form-label">Overall Rating</Label>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className="p-1 rounded-lg hover:bg-amber-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Star
                        className={cn(
                          "w-7 h-7 transition-all",
                          star <= formData.rating
                            ? "fill-amber-400 text-amber-400 scale-110"
                            : "text-muted-foreground/30 scale-100"
                        )}
                      />
                    </button>
                  ))}
                  <div className="ml-3 flex flex-col">
                    <span className="text-xl font-800 text-foreground leading-none" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>
                      {formData.rating}.0
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">{scoreLabel(formData.rating)}</span>
                  </div>
                </div>
              </section>

              <div className="divider" />

              {/* ── Section 3: Performance metrics ── */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[0.625rem] font-700 flex-shrink-0">3</span>
                  <Label className="form-label">Performance Metrics</Label>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {METRICS.map(({ key, label }) => (
                    <div key={key} className="surface-flat p-4 rounded-xl flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-600 text-foreground">{label}</span>
                        <ScorePill value={formData[key as keyof typeof formData] as number} />
                      </div>
                      <Slider
                        value={[formData[key as keyof typeof formData] as number]}
                        onValueChange={(v) => handleSliderChange(key, v)}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                        aria-label={label}
                      />
                      {/* Tick labels */}
                      <div className="flex justify-between px-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span key={n} className="text-[0.625rem] text-muted-foreground/50 tabular-nums">{n}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="divider" />

              {/* ── Section 4: Written feedback ── */}
              <section className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[0.625rem] font-700 flex-shrink-0">4</span>
                  <Label className="form-label">Written Feedback</Label>
                </div>

                <div className="form-group">
                  <Label htmlFor="overall-feedback" className="form-label flex items-center gap-1">
                    Overall Feedback
                    <span className="text-destructive">*</span>
                  </Label>
                  <p className="form-hint">Describe the student's performance and contribution to the project</p>
                  <Textarea
                    id="overall-feedback"
                    placeholder="This student demonstrated excellent problem-solving skills and delivered high-quality work throughout the project..."
                    className="textarea mt-2 min-h-[8rem]"
                    value={formData.overallFeedback}
                    onChange={(e) => setFormData((prev) => ({ ...prev, overallFeedback: e.target.value }))}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="strengths" className="form-label">Key Strengths</Label>
                    <p className="form-hint">One per line</p>
                    <Textarea
                      id="strengths"
                      placeholder={"Strong attention to detail\nExcellent communication\nProactive problem solver"}
                      className="textarea mt-2 min-h-[6rem]"
                      value={formData.strengths}
                      onChange={(e) => setFormData((prev) => ({ ...prev, strengths: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="improvements" className="form-label flex items-center gap-1.5">
                      Areas for Improvement
                      <span className="badge badge--default" style={{ fontSize: "0.6875rem" }}>optional</span>
                    </Label>
                    <p className="form-hint">Constructive growth points</p>
                    <Textarea
                      id="improvements"
                      placeholder="Could explore more advanced techniques in..."
                      className="textarea mt-2 min-h-[6rem]"
                      value={formData.areasForImprovement}
                      onChange={(e) => setFormData((prev) => ({ ...prev, areasForImprovement: e.target.value }))}
                    />
                  </div>
                </div>
              </section>

              <div className="divider" />

              {/* ── Section 5: Would work again toggle ── */}
              <section>
                <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-muted/20">
                  <div className="flex items-start gap-3">
                    <UserCheck className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <Label htmlFor="work-again" className="form-label cursor-pointer">
                        Would you work with this student again?
                      </Label>
                      <p className="form-hint mt-0.5">
                        This helps other employers assess the student's reliability
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {formData.wouldWorkAgain ? (
                      <span className="badge badge--success">Yes</span>
                    ) : (
                      <span className="badge badge--default">No</span>
                    )}
                    <Switch
                      id="work-again"
                      checked={formData.wouldWorkAgain}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, wouldWorkAgain: checked }))}
                    />
                  </div>
                </div>
              </section>

              {/* ── Submit ── */}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  className="btn btn-primary btn-lg flex-1"
                  onClick={handleSubmitReference}
                  disabled={isSubmitting || !selectedRequestId}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin-smooth w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Reference
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="btn btn-secondary btn-lg"
                  onClick={() => { setSelectedRequestId(null); setFormData(INITIAL_FORM); }}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Success dialog ── */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="modal modal--narrow text-center">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center animate-bounce-in">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            </div>
            <DialogTitle className="text-xl font-800" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.025em" }}>
              Reference submitted!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1">
              Your reference has been submitted successfully and is now visible to the student.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button className="btn btn-primary w-full" onClick={() => setShowSuccessDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerReferences;
