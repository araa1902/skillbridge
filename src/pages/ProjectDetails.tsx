import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Buildings as Building2, Calendar, Medal as Award, CheckCircle as CheckCircle2, Clock, Money as Banknote, ArrowLeft, Briefcase, CaretRight as ChevronRight } from "@phosphor-icons/react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectData {
  id: string;
  title: string;
  description?: string;
  company_name?: string;
  company_bio?: string;
  duration_hours?: number;
  required_skills?: string[];
  deliverables?: string;
  budget?: number;
  status?: string;
  payment_status?: string;
  created_at?: string;
  [key: string]: any;
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
const HeaderSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-40" />
    <div className="flex items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

const ContentSkeleton = () => (
  <div className="grid lg:grid-cols-3 gap-8 mt-8">
    <div className="lg:col-span-2 space-y-4">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-48 w-full" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const StatPill = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
    <Icon className="h-3.5 w-3.5 shrink-0" />
    <span>{label}</span>
  </div>
);

// ─── Checklist ────────────────────────────────────────────────────────────────
const Checklist = ({ items, accent = false }: { items: string[]; accent?: boolean }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <CheckCircle2
          className={`h-4 w-4 shrink-0 mt-0.5 ${accent ? "text-primary" : "text-emerald-500"}`}
        />
        <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

// ─── Quick Fact Row ───────────────────────────────────────────────────────────
const FactRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-2.5">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusVariant: Record<string, string> = {
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  draft: "bg-yellow-50 text-yellow-700 border-yellow-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusVariant[status] ?? "bg-muted text-muted-foreground border-border"
      }`}
  >
    {status.replace("_", " ")}
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ProjectDetails = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [activeApplicationCount, setActiveApplicationCount] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("projects")
          .select(
            `*, profiles:projects_business_id_fkey (full_name, company_name, bio, is_verified)`
          )
          .eq("id", id)
          .maybeSingle();

        if (fetchError) {
          setError(fetchError.message);
        } else if (!data) {
          setError("Project not found");
        } else {
          const raw = data as any;
          const profile = raw.profiles;
          setProject({
            ...raw,
            company_name:
              profile?.company_name ?? profile?.full_name ?? null,
            company_bio: profile?.bio ?? null,
            is_verified: profile?.is_verified ?? false,
            profiles: undefined,
          });
        }
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user?.id || !id) return;

      setCheckingApplication(true);
      try {
        const { data, error: appError } = await supabase
          .from('applications')
          .select('id')
          .eq('project_id', id)
          .eq('student_id', user.id)
          .maybeSingle();

        if (data) {
          setHasApplied(true);
        }

        // Also check total active applications for the limit check
        const { count } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("student_id", user.id)
          .in("status", ["pending", "reviewing"]);

        if (count !== null) {
          setActiveApplicationCount(count);
        }
      } catch (err) {
        console.error("Error checking application status:", err);
      } finally {
        setCheckingApplication(false);
      }
    };

    if (profile?.role === 'student') {
      checkExistingApplication();
    }
  }, [id, user?.id, profile?.role]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="page-container py-10 space-y-6">
          <HeaderSkeleton />
          <ContentSkeleton />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (!project || error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">Project not found</h2>
          <p className="text-sm text-muted-foreground">
            {error || "This project doesn't exist or has been removed."}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to={profile?.role === 'business' ? "/employer/projects/manage" : "/browse-projects"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {profile?.role === 'business' ? "Manage Projects" : "Projects"}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const skills = Array.isArray(project.required_skills)
    ? project.required_skills
    : [];

  // Deliverables stored as a text block — split into list items if newline-separated
  const deliverableLines =
    typeof project.deliverables === "string"
      ? project.deliverables
        .split(/\r?\n|\\n/)
        .map((l) => l.trim().replace(/^\d+\.\s*|^[-•*]\s*/, ""))
        .filter(Boolean)
      : Array.isArray(project.deliverables)
        ? project.deliverables
        : [];

  const postedDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : null;

  // ── Render ──
  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link 
            to={profile?.role === 'business' ? "/employer/projects/manage" : "/browse-projects"} 
            className="hover:underline"
          >
            {profile?.role === 'business' ? "Manage Projects" : "Projects"}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate max-w-xs">
            {project.title}
          </span>
        </nav>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left: identity */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className="h-14 w-14 flex items-center justify-center shrink-0 rounded-xl border bg-muted">
                <span className="text-base font-semibold">
                  {project.company_name?.substring(0, 2).toUpperCase() ?? "NA"}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold tracking-tight leading-tight">
                    {project.title}
                  </h1>
                  {project.status && <StatusBadge status={project.status} />}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 items-center">
                  {project.company_name && (
                    <>
                      <StatPill icon={Building2} label={project.company_name} />
                      <VerifiedBadge verified={project.is_verified} />
                    </>
                  )}
                  {project.duration_hours != null && project.duration_hours > 0 && (
                    <StatPill
                      icon={Clock}
                      label={`${project.duration_hours} hrs`}
                    />
                  )}
                  {project.budget != null && project.budget > 0 && (
                    <StatPill
                      icon={Banknote}
                      label={`£${Number(project.budget).toLocaleString()}`}
                    />
                  )}
                  {postedDate && (
                    <StatPill icon={Calendar} label={`Posted ${postedDate}`} />
                  )}
                  <StatPill icon={Award} label="Micro-credential included" />
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 lg:shrink-0">
              {profile?.role !== 'business' && (
                hasApplied ? (
                  <Button size="lg" disabled className="bg-emerald-500 hover:bg-emerald-500 text-white opacity-100">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Applied
                  </Button>
                ) : (
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div className="inline-block">
                          <Button 
                            size="lg" 
                            asChild={activeApplicationCount < 5} 
                            disabled={activeApplicationCount >= 5}
                            className={activeApplicationCount >= 5 ? "cursor-not-allowed opacity-60" : ""}
                          >
                            {activeApplicationCount < 5 ? (
                              <Link to={`/project/${project.id}/apply`}>Apply Now</Link>
                            ) : (
                              <span>Apply Now</span>
                            )}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {activeApplicationCount >= 5 && (
                        <TooltipContent side="bottom" className="max-w-[280px] p-3 text-xs leading-relaxed">
                          <p className="font-bold mb-1">Priority Slot Limit</p>
                          <p>You've used all 5 active application slots. Withdraw an inactive application to apply for this project.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                )
              )}
            </div>
          </div>
        </motion.div>

        <Separator className="mb-10" />

        {/* Body */}
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6 h-9 bg-muted/60">
                <TabsTrigger value="overview" className="text-sm">
                  Overview
                </TabsTrigger>
                {deliverableLines.length > 0 && (
                  <TabsTrigger value="deliverables" className="text-sm">
                    Deliverables
                  </TabsTrigger>
                )}
                <TabsTrigger value="about-us" className="text-sm">About Us</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-border/60 shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">
                        About this project
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-7 whitespace-pre-line">
                        {project.description || "No description provided."}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Deliverables */}
              {deliverableLines.length > 0 && (
                <TabsContent value="deliverables">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-border/60 shadow-none">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">
                          Expected Deliverables
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Checklist items={deliverableLines} />
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              )}

              <TabsContent value="about-us">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-border/60 shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">
                        About Us
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-7 whitespace-pre-line">
                        {project.company_bio || "No description provided."}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>



          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Company card */}
            <Card className="border-border/60 shadow-none">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg border bg-muted">
                    <span className="text-sm font-semibold">
                      {project.company_name?.substring(0, 2).toUpperCase() ?? "NA"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {project.company_name ?? "Company"}
                    </p>
                    <p className="text-xs text-muted-foreground">Business</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project details card */}
            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/60">
                {project.status && (
                  <FactRow
                    label="Status"
                    value={<StatusBadge status={project.status} />}
                  />
                )}
                {project.duration_hours != null && project.duration_hours > 0 && (
                  <FactRow
                    label="Duration"
                    value={`${project.duration_hours} hours`}
                  />
                )}
                {project.budget != null && project.budget > 0 && (
                  <FactRow
                    label="Budget"
                    value={`£${Number(project.budget).toLocaleString()}`}
                  />
                )}
                {postedDate && (
                  <FactRow label="Posted" value={postedDate} />
                )}
                <FactRow
                  label="Credential"
                  value={
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Included
                    </span>
                  }
                />
              </CardContent>
            </Card>

            {/* Apply CTA (sticky nudge on mobile) */}
            {profile?.role !== 'business' && (
              <Card className={`shadow-none ${hasApplied ? "border-emerald-200 bg-emerald-50" : "border-primary/20 bg-primary/5"}`}>
                <CardContent className="pt-5 space-y-3">
                  <p className="text-sm font-medium">{hasApplied ? "Application Submitted" : "Ready to apply?"}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {hasApplied
                      ? "Your application has been received. You can track its status in your applications dashboard."
                      : "Submit your application and earn a verified micro-credential on completion."}
                  </p>
                  {hasApplied ? (
                    <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 bg-white" asChild>
                      <Link to="/student/applications">View Applications</Link>
                    </Button>
                  ) : (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <div className="w-full">
                            <Button 
                              className="w-full" 
                              asChild={activeApplicationCount < 5}
                              disabled={activeApplicationCount >= 5}
                            >
                              {activeApplicationCount < 5 ? (
                                <Link to={`/project/${project.id}/apply`}>Apply Now</Link>
                              ) : (
                                <span>Apply Now</span>
                              )}
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {activeApplicationCount >= 5 && (
                          <TooltipContent side="top" className="max-w-[240px] p-3 text-xs">
                            <p>You've used all 5 active application slots. Withdraw an inactive application to apply.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
