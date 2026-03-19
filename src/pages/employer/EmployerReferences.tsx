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
import {
  CheckCircle as CheckCircle2, Clock, Star, PaperPlaneRight as Send,
  WarningCircle as AlertCircle, FileText, TrendUp as TrendingUp,
  CaretRight as ChevronRight, Sparkle as Sparkles, UserCircleCheck as UserCheck,
  Briefcase,
  XCircle
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { SendFilled } from "@carbon/icons-react";
import { Input } from "@/components/ui/input";
import { NotebookPenIcon } from "lucide-react";

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

function scoreLabel(n: number) {
  return ["", "Poor", "Fair", "Good", "Great", "Excellent"][n] ?? n;
}

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
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold tabular-nums",
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
        {icon}
      </div>
      <div className="min-w-0">
        {loading ? (
          <Skeleton className="h-8 w-16 mb-1" />
        ) : (
          <p className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{value}</p>
        )}
        <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ─── main component ────────────────────────────────────────────────────── */

const EmployerReferences = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { references, loading } = useFetchWrittenReferences(user?.id ?? null);
  const { requests, loading: loadingRequests, refetch: refetchRequests } = useFetchPendingRequests(user?.id ?? null);

  // Replaced "selectedRequestId" with the actual request object to trigger the Sheet
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [selectedReference, setSelectedReference] = useState<any | null>(null);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value[0] }));
  };

  const handleOpenForm = (request: any) => {
    setFormData(INITIAL_FORM); // Reset form
    setActiveRequest(request); // Open sheet
  };

  const handleSubmitReference = async () => {
    if (!user || !profile || !activeRequest) return;

    if (!formData.overallFeedback.trim()) {
      toast({ title: "Feedback required", description: "Please write overall feedback before submitting.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await writeReference({
        student_id: activeRequest.student_id,
        student_name: activeRequest.student_name,
        employer_id: user.id,
        employer_name: profile.full_name || "Employer",
        employer_title: "Employer",
        company_name: profile.company_name || "Company",
        company_logo: undefined,
        project_id: activeRequest.project_id,
        project_title: activeRequest.project_title,
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
        request_id: activeRequest.id,
      });

      if (error) {
        toast({ title: "Submission failed", description: error, variant: "destructive" });
      } else {
        setShowSuccessDialog(true);
        setActiveRequest(null); // Close the sheet
        setFormData(INITIAL_FORM); // Reset form
        refetchRequests(); // Clear the queue
      }
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl max-w-sm w-full text-center shadow-sm">
          <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-900">Sign in required</p>
          <p className="text-sm text-slate-500 mt-2">Please sign in to manage references for your students.</p>
        </div>
      </div>
    );
  }

  const avgRating = references.length > 0
    ? (references.reduce((s, r) => s + r.rating, 0) / references.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              Student References
            </h1>
            <p className="text-slate-500 mt-1">Review pending requests and manage the feedback you've provided.</p>
          </div>
          {requests.length > 0 && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 shadow-sm py-1.5 px-3">
              <Clock className="w-4 h-4 mr-1.5" />
              {requests.length} Action{requests.length !== 1 ? 's' : ''} Required
            </Badge>
          )}
        </div>

        {/* ── Stats Row ── */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <StatCard
            label="References Given"
            value={references.length}
            icon={<CheckCircle2 className="w-6 h-6" />}
            loading={loading}
            iconBg="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Pending Requests"
            value={requests.length}
            icon={<Clock className="w-6 h-6" />}
            loading={loadingRequests}
            iconBg="bg-amber-50 text-amber-600"
          />
          <StatCard
            label="Avg Rating Given"
            value={
              <span className="flex items-baseline gap-1.5">
                {avgRating}
                {references.length > 0 && <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />}
              </span>
            }
            icon={<TrendingUp className="w-6 h-6" />}
            loading={loading}
            iconBg="bg-purple-50 text-purple-600"
          />
        </div>

        {/* ── Dashboard Grid ── */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT (Primary Action Queue): Pending Requests ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Action Queue
            </h2>

            {loadingRequests ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg flex-shrink-0">
                        {request.student_name?.charAt(0).toUpperCase() ?? "S"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{request.student_name}</p>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                          <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{request.project_title}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOpenForm(request)}
                      className="bg-primary hover:bg-blue-700 text-white shadow-sm w-full sm:w-auto"
                    >
                      <NotebookPenIcon className="w-4 h-4 mr-2" />
                      Write Reference
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center text-center">
                <CheckCircle2 className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-lg font-semibold text-slate-900">You're all caught up!</p>
                <p className="text-sm text-slate-500 max-w-sm mt-1">
                  When a student finishes a project and requests a reference, it will appear here in your queue.
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT (History): Completed References ── */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Past References
            </h2>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : references.length > 0 ? (
                <div className="space-y-3">
                  {references.map((ref) => (
                    <button
                      key={ref.id}
                      onClick={() => setSelectedReference(ref)}
                      className="w-full group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 border border-slate-200 text-left bg-white"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 flex-shrink-0 text-sm">
                        {ref.student_name?.charAt(0).toUpperCase() ?? "S"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm text-slate-900 truncate">
                            {ref.student_name}
                          </p>
                          <span className="flex items-center gap-0.5 text-sm font-bold text-slate-700 bg-slate-100 px-1.5 rounded flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {ref.rating}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{ref.project_title}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors mt-0.5 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">No references submitted yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Slide-over Form (Sheet) ── */}
      <Sheet open={!!activeRequest} onOpenChange={(open) => !open && setActiveRequest(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white border-l border-slate-200 p-0 flex flex-col shadow-2xl">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
            <SheetHeader>
              <SheetTitle className="text-xl">Submit Reference</SheetTitle>
              <SheetDescription className="text-slate-500 mt-1.5">
                Evaluate <strong className="text-slate-900">{activeRequest?.student_name}</strong> for their work on <strong className="text-slate-900">{activeRequest?.project_title}</strong>.
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="p-6 flex flex-col gap-8">

            {/* ── Section 1: Overall star rating ── */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">1</span>
                <Label className="text-sm font-bold text-slate-900">Overall Rating</Label>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className="p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <Star
                        className={cn(
                          "w-8 h-8 transition-all",
                          star <= formData.rating
                            ? "fill-amber-400 text-amber-400 scale-110"
                            : "text-slate-200 scale-100"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="ml-4 flex flex-col">
                  <span className="text-2xl font-bold text-slate-900 leading-none">
                    {formData.rating}.0
                  </span>
                  <span className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{scoreLabel(formData.rating)}</span>
                </div>
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* ── Section 2: Performance metrics ── */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">2</span>
                <Label className="text-sm font-bold text-slate-900">Performance Metrics</Label>
              </div>

              <div className="grid gap-4">
                {METRICS.map(({ key, label }) => (
                  <div key={key} className="bg-slate-50 p-5 rounded-2xl flex flex-col gap-4 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">{label}</span>
                      <ScorePill value={formData[key as keyof typeof formData] as number} />
                    </div>
                    <Slider
                      value={[formData[key as keyof typeof formData] as number]}
                      onValueChange={(v) => handleSliderChange(key, v)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between px-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className="text-[10px] font-bold text-slate-400 tabular-nums">{n}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* ── Section 3: Written feedback ── */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">3</span>
                <Label className="text-sm font-bold text-slate-900">Detailed Feedback</Label>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="overall-feedback" className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    Overall Review
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="overall-feedback"
                    placeholder="Describe their performance, reliability, and impact..."
                    className="min-h-[120px] border-slate-200  resize-none"
                    value={formData.overallFeedback}
                    onChange={(e) => setFormData((prev) => ({ ...prev, overallFeedback: e.target.value }))}
                  />
                  <p className="text-[11px] text-slate-400">Be specific about projects and outcomes.</p>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="strengths" className="text-sm font-bold text-slate-700">
                      Key Strengths
                    </Label>
                    <div className="space-y-3">
                      {/* The Input Area */}
                      <div className="relative flex items-center">
                        <Input
                          id="strengths-input"
                          placeholder="Type a strength and press Enter"
                          className="rounded-xl border-slate-200 pr-12"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val && !formData.strengths.split('\n').includes(val)) {
                                setFormData(prev => ({
                                  ...prev,
                                  strengths: prev.strengths ? `${prev.strengths}\n${val}` : val
                                }));
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                        <div className="absolute right-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Enter
                        </div>
                      </div>

                      {/* The Visual Pills */}
                      <div className="flex flex-wrap gap-2">
                        {formData.strengths.split('\n').filter(Boolean).map((strength, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1 rounded-full flex items-center gap-1.5 group animate-in fade-in zoom-in duration-200"
                          >
                            {strength}
                            <button
                              type="button"
                              onClick={() => {
                                const newStrengths = formData.strengths
                                  .split('\n')
                                  .filter((_, i) => i !== index)
                                  .join('\n');
                                setFormData(prev => ({ ...prev, strengths: newStrengths }));
                              }}
                              className="hover:text-blue-900 text-blue-300 transition-colors"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </Badge>
                        ))}

                        {/* Empty State hint inside the pill area */}
                        {formData.strengths.split('\n').filter(Boolean).length === 0 && (
                          <p className="text-xs text-slate-400 italic ml-1">
                            No strengths added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="improvements" className="text-sm font-bold text-slate-700">
                      Growth Areas <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                    </Label>
                    <Textarea
                      id="improvements"
                      placeholder="What could they work on for their next project?"
                      className="min-h-[80px] rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      value={formData.areasForImprovement}
                      onChange={(e) => setFormData((prev) => ({ ...prev, areasForImprovement: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* ── Section 4: Recommendation ── */}
            <section className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="work-again" className="text-sm font-bold text-slate-900 cursor-pointer">
                      Would you work with them again?
                    </Label>
                    <p className="text-[12px] text-slate-500 leading-tight">
                      This indicator helps verify reliability for future employers.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-xs font-bold px-2.5 py-1 rounded-full",
                    formData.wouldWorkAgain ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                  )}>
                    {formData.wouldWorkAgain ? "Yes" : "No"}
                  </span>
                  <Switch
                    id="work-again"
                    checked={formData.wouldWorkAgain}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, wouldWorkAgain: checked }))}
                  />
                </div>
              </div>
            </section>

            <div className="flex items-center gap-3 py-4">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 text-base font-bold rounded-xl"
                onClick={handleSubmitReference}
                disabled={isSubmitting || !activeRequest}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <SendFilled className="w-4 h-4 mr-2" />
                    Submit Reference
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                onClick={() => setFormData(INITIAL_FORM)}
                disabled={isSubmitting}
              >
                Reset
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Success Dialog ── */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-sm text-center p-8 rounded-3xl border-none shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">Reference Published!</DialogTitle>
          <DialogDescription className="text-slate-500 mt-2 text-base">
            Your feedback has been successfully added to the student's profile.
          </DialogDescription>
          <Button
            className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 text-base font-bold mt-8 rounded-xl"
            onClick={() => setShowSuccessDialog(false)}
          >
            Back to Dashboard
          </Button>
        </DialogContent>
      </Dialog>

      {/* ── Reference Details Dialog ── */}
      <Dialog open={!!selectedReference} onOpenChange={(open) => !open && setSelectedReference(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 shadow-2xl">
          {selectedReference && (
            <>
              <DialogHeader className="border-b border-slate-200 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl">
                      {selectedReference.student_name?.charAt(0).toUpperCase() ?? "S"}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-slate-900">{selectedReference.student_name}</DialogTitle>
                      <p className="text-sm text-slate-500 mt-1">{selectedReference.project_title}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      <span className="text-2xl font-bold text-slate-900">{selectedReference.rating}.0</span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-6">
                {/* Overall Feedback */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Overall Feedback</h3>
                  <p className="text-slate-700 leading-relaxed">{selectedReference.overall_feedback}</p>
                </div>

                {/* Performance Metrics */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Performance Metrics</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">Work Quality</span>
                        <span className="text-sm font-bold text-primary">{selectedReference.work_quality}/5</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${(selectedReference.work_quality / 5) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">Communication</span>
                        <span className="text-sm font-bold text-primary">{selectedReference.communication}/5</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${(selectedReference.communication / 5) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">Professionalism</span>
                        <span className="text-sm font-bold text-primary">{selectedReference.professionalism}/5</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${(selectedReference.professionalism / 5) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700">Technical Skills</span>
                        <span className="text-sm font-bold text-primary">{selectedReference.technical_skills}/5</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${(selectedReference.technical_skills / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {selectedReference.skills && selectedReference.skills.length > 0 && (
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Skills Verified</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedReference.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-slate-300 text-slate-700 font-semibold">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths & Growth Areas */}
                <div className="border-t border-slate-200 pt-6 grid sm:grid-cols-2 gap-6">
                  {selectedReference.strengths && selectedReference.strengths.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Strengths</h3>
                      <ul className="space-y-2">
                        {selectedReference.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedReference.areas_for_improvement && selectedReference.areas_for_improvement.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Areas for Growth</h3>
                      <ul className="space-y-2">
                        {selectedReference.areas_for_improvement.map((area: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Would Work Again */}
                {selectedReference.would_work_again && (
                  <div className="border-t border-slate-200 pt-6 flex items-center gap-2 bg-emerald-50 p-4 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-bold text-emerald-700">Would work with this student again</span>
                  </div>
                )}
              </div>

              <DialogFooter className="border-t border-slate-200 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReference(null)}
                  className="w-full"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerReferences;