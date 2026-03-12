import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Briefcase,
  CheckCircle as CheckCircle2,
  Clock,
  DownloadSimple as Download,
  PencilSimple as Edit,
  Eye,
  MagnifyingGlass as Search,
  TrendUp as TrendingUp,
  Users,
  CalendarBlank,
  CurrencyCircleDollar,
  ArrowRight,
  WarningCircle,
  CheckCircle,
  Circle,
  UsersIcon,
} from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProjects, useEmployerStats } from "@/hooks/useProjects";
import { RotateCcwIcon } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  postedDate: string;
  category: string;
  status: "Active" | "Draft" | "Completed" | "Closed";
  applications: number;
  budget: string;
  hours: string;
  deadline: string;
  talentsNeeded: number;
  priority: "High" | "Medium" | "Low";
  progress: number;
  deliverables: number;
  updatedAt: string;
};

type StatusFilter = "all" | "active" | "draft" | "completed" | "closed";
type SortOption = "recent" | "applications" | "deadline";

const statusBadgeClasses: Record<Project["status"], string> = {
  Active: "border-green-100 bg-green-50 text-green-700",
  Draft: "border-amber-100 bg-amber-50 text-amber-700",
  Completed: "border-blue-100 bg-blue-50 text-blue-700",
  Closed: "border-border bg-muted text-slate-700",
};

const priorityBadgeClasses: Record<Project["priority"], string> = {
  High: "border-red-100 bg-red-50 text-red-600",
  Medium: "border-amber-100 bg-amber-50 text-amber-600",
  Low: "border-emerald-100 bg-emerald-50 text-emerald-600",
};

const priorityDotClasses: Record<Project["priority"], string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-emerald-500",
};

const formatRelativeTime = (dateString: string) => {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffInSeconds = (new Date(dateString).getTime() - Date.now()) / 1000;
  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ];
  let duration = diffInSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return formatter.format(Math.round(duration), "year");
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="rounded-full bg-muted p-2.5 shrink-0">
        <Icon className="h-5 w-5 text-slate-700" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground truncate">{label}</p>
        <p className="text-2xl font-semibold text-foreground leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground truncate">{subtext}</p>
      </div>
    </div>
  );
}

// ─── Project List Item ─────────────────────────────────────────────────────────
function ProjectListItem({
  project,
  isSelected,
  onClick,
}: {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}) {
  const daysUntil = Math.ceil(
    (new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysUntil < 0;
  const isUrgent = daysUntil >= 0 && daysUntil <= 3;

  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left rounded-xl border p-4 transition-all duration-150 hover:border-slate-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected
          ? "bg-slate-100 shadow-sm"
          : "border-border bg-card",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-semibold text-foreground text-sm leading-snug line-clamp-1 flex-1">
          {project.title}
        </p>
        <Badge variant="outline" className={`${statusBadgeClasses[project.status]} shrink-0 text-xs`}>
          {project.status}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {project.description.trim().slice(0, 90)}…
      </p>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`inline-block h-2 w-2 rounded-full shrink-0 ${priorityDotClasses[project.priority]}`}
          />
          <span className="text-xs text-muted-foreground truncate">{project.priority} priority</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {project.applications > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {project.applications}
            </span>
          )}
          {(isOverdue || isUrgent) && (
            <WarningCircle
              className={`h-4 w-4 ${isOverdue ? "text-red-500" : "text-amber-500"}`}
              weight="fill"
            />
          )}
        </div>
      </div>

      <Progress value={project.progress} className="mt-3 h-1.5" />
    </button>
  );
}

// ─── Project Detail Panel ──────────────────────────────────────────────────────
function ProjectDetail({ project }: { project: Project }) {
  const deadlineDate = new Date(project.deadline);
  const daysUntil = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const deadlineLabel =
    daysUntil >= 0 ? `${daysUntil} days left` : `${Math.abs(daysUntil)} days overdue`;
  const isOverdue = daysUntil < 0;

  const statusIcon =
    project.status === "Completed" ? (
      <CheckCircle className="h-5 w-5 text-blue-500" weight="fill" />
    ) : project.status === "Active" ? (
      <Circle className="h-5 w-5 text-green-500" weight="fill" />
    ) : (
      <Circle className="h-5 w-5 text-muted-foreground" />
    );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              {project.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={statusBadgeClasses[project.status]}>
              {project.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Posted {project.postedDate} · Updated {formatRelativeTime(project.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link to={`/employer/projects/${project.id}/applications`}>
            <Button size="sm">
              <Users className="mr-1.5 h-4 w-4" />
              Review applicants
            </Button>
          </Link>
          <Link to={`/employer/projects/${project.id}/edit`}>
            <Button size="sm" variant="outline">
              <Edit className="mr-1.5 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link to={`/project/${project.id}`}>
            <Button size="sm" variant="ghost">
              <Eye className="mr-1.5 h-4 w-4" />
              View brief
            </Button>
          </Link>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{project.description.trim()}</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            icon: CurrencyCircleDollar,
            label: "Budget",
            value: project.budget,
            sub: project.hours,
          },
          {
            icon: CalendarBlank,
            label: "Deadline",
            value: deadlineDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            sub: deadlineLabel,
            subClass: isOverdue ? "text-red-500 font-medium" : "text-muted-foreground",
          },
          {
            icon: Users,
            label: "Talent needed",
            value: `${project.talentsNeeded} hire${project.talentsNeeded !== 1 ? "s" : ""}`,
            sub: `${project.applications} applied`,
          },
          {
            icon: CheckCircle2,
            label: "Deliverables",
            value: `${project.deliverables}`,
            sub: "total",
          },
        ].map(({ icon: Icon, label, value, sub, subClass }) => (
          <div
            key={label}
            className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Icon className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-lg font-semibold text-foreground leading-tight">{value}</p>
            <p className={`text-xs ${subClass ?? "text-muted-foreground"}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Delivery progress</p>
          <span className="text-sm font-semibold text-foreground">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-3 rounded-full" />
        <p className="text-xs text-muted-foreground">
          {project.progress === 100
            ? "All deliverables completed."
            : project.progress > 0
              ? "In progress — keep the momentum going."
              : "Not started yet."}
        </p>
      </div>

      {/* Applications call-to-action */}
      {project.applications > 0 && (
        <Link to={`/employer/projects/${project.id}/applications`} className="group">
          <div className="flex items-center justify-between rounded-xl border border-blue-200/40 bg-blue-50/5 px-5 py-4 transition-all duration-300 hover:bg-blue-50/20 hover:border-blue-300/40 dark:border-blue-900/20 dark:hover:bg-blue-900/10">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100/40 text-blue-600 dark:bg-blue-900/30">
                <UsersIcon className="h-5 w-5" weight="bold" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-blue-700">
                  {project.applications} {project.applications === 1 ? "candidate" : "candidates"} waiting
                </p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                  Review and respond to applicants
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-600/80">
              <span className="text-[11px] font-bold uppercase tracking-widest opacity-0 transition-all duration-300 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0">
                Review
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="rounded-full bg-muted p-4">
        <Briefcase className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-foreground">No projects match your filters</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your search or post a fresh project.
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onReset}>
          Clear filters
        </Button>
        <Link to="/employer/projects/new">
          <Button size="sm" variant="outline">
            Post new project
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ManageProjects() {
  const { user } = useAuth();
  const { projects: dbProjects, loading: projectsLoading } = useMyProjects(user?.id ?? null);
  const stats = useEmployerStats(user?.id ?? null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const projects: Project[] = useMemo(() => {
    return dbProjects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      postedDate: new Date(p.created_at).toLocaleDateString(),
      category: "General",
      status:
        p.status === "open"
          ? "Active"
          : p.status === "draft"
            ? "Draft"
            : p.status === "completed"
              ? "Completed"
              : "Closed",
      applications: p.application_count ?? 0,
      budget: `£${p.budget}`,
      hours: `${p.duration_hours} hrs`,
      deadline: p.created_at,
      talentsNeeded: 1,
      priority: "Medium",
      progress:
        p.status === "completed" ? 100 : p.status === "in_progress" ? 50 : 0,
      deliverables: 1,
      updatedAt: p.created_at,
    }));
  }, [dbProjects]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((p) => {
      const key = p.status.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return [...projects]
      .filter((p) => {
        const matchStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter;
        const matchQuery =
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        return matchStatus && matchQuery;
      })
      .sort((a, b) => {
        if (sortBy === "applications") return b.applications - a.applications;
        if (sortBy === "deadline")
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [projects, statusFilter, searchQuery, sortBy]);

  // Auto-select first project when list changes
  const effectiveSelectedId = useMemo(() => {
    if (selectedId && filteredProjects.some((p) => p.id === selectedId)) return selectedId;
    return filteredProjects[0]?.id ?? null;
  }, [filteredProjects, selectedId]);

  const selectedProject = filteredProjects.find((p) => p.id === effectiveSelectedId) ?? null;

  const completionRate = useMemo(() => {
    if (!projects.length) return 0;
    return Math.round(
      (projects.filter((p) => p.status === "Completed").length / projects.length) * 100
    );
  }, [projects]);

  const averageProgress = useMemo(() => {
    if (!projects.length) return 0;
    return Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length);
  }, [projects]);

  const handleReset = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setSortBy("recent");
    setSelectedId(null);
  };

  const statusFilters = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "closed", label: "Closed" },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-8">
        {/* ── Page header ── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="space-y-1">
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              Manage Projects
            </h1>
            <p className="text-muted-foreground">
              Track live briefs, respond to candidates, and keep hiring momentum.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export report
            </Button>
            <Link to="/employer/projects/new">
              <Button size="sm">Post new project</Button>
            </Link>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            label="Active projects"
            value={`${stats.activeProjects}`}
            subtext="Current briefs open"
            icon={Briefcase}
          />
          <StatCard
            label="Applications"
            value={`${stats.totalApplicants}`}
            subtext="Total received"
            icon={Users}
          />
          <StatCard
            label="Avg turnaround"
            value={
              stats.averageTurnaroundHours !== null
                ? `${stats.averageTurnaroundHours} hrs`
                : "N/A"
            }
            subtext="Response time to applicants"
            icon={Clock}
          />
          <StatCard
            label="Completion rate"
            value={`${completionRate}%`}
            subtext="Past 90 days"
            icon={CheckCircle2}
          />
        </div>

        {/* ── Filter bar ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as StatusFilter);
              setSelectedId(null);
            }}
          >
            <TabsList className="flex h-auto flex-wrap gap-2 rounded-none bg-transparent p-0">
              {statusFilters.map((f) => (
                <TabsTrigger
                  key={f.value}
                  value={f.value}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                >
                  {f.label}
                  <span className="ml-1.5 text-xs font-medium opacity-60">
                    {statusCounts[f.value] ?? 0}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedId(null);
                }}
                placeholder="Search projects…"
                className="pl-9 w-52"
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently updated</SelectItem>
                <SelectItem value="deadline">Upcoming deadlines</SelectItem>
                <SelectItem value="applications">Most applications</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleReset} title="Reset filters">
              <RotateCcwIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── Master / Detail ── */}
        {filteredProjects.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <div className="grid gap-4 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] items-start">
            {/* Left: project list */}
            <div className="flex flex-col gap-2 lg:sticky lg:top-6 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-1">
              {filteredProjects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  isSelected={project.id === effectiveSelectedId}
                  onClick={() => setSelectedId(project.id)}
                />
              ))}
            </div>

            {/* Right: detail panel */}
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6 lg:sticky lg:top-6">
              {selectedProject ? (
                <ProjectDetail project={selectedProject} />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
                  <Briefcase className="h-8 w-8" />
                  <p className="text-sm">Select a project to view its details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
