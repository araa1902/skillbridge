import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Briefcase, CheckCircle as CheckCircle2, Clock, DownloadSimple as Download, PencilSimple as Edit, Eye, Faders as Filter, MagnifyingGlass as Search, TrendUp as TrendingUp, Users } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProjects, useEmployerStats, ProjectRow } from "@/hooks/useProjects";

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

export default function ManageProjects() {
  const { user } = useAuth();
  const { projects: dbProjects, loading: projectsLoading } = useMyProjects(user?.id ?? null);
  const stats = useEmployerStats(user?.id ?? null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const projects: Project[] = useMemo(() => {
    return dbProjects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      postedDate: new Date(p.created_at).toLocaleDateString(),
      category: "General", // To store category in db later
      status: p.status === 'open' ? 'Active' :
        p.status === 'draft' ? 'Draft' :
          p.status === 'completed' ? 'Completed' : 'Closed',
      applications: p.application_count ?? 0,
      budget: `£${p.budget}`,
      hours: `${p.duration_hours} hrs`,
      deadline: p.created_at, // Add actual deadline later if needed
      talentsNeeded: 1,
      priority: "Medium",
      progress: p.status === 'completed' ? 100 : (p.status === 'in_progress' ? 50 : 0),
      deliverables: 1, // Fallback
      updatedAt: p.created_at,
    }));
  }, [dbProjects]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((project) => {
      const key = project.status.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [projects]);

  const statusFilters = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Drafts" },
    { value: "completed", label: "Completed" },
    { value: "closed", label: "Closed" },
  ] as const;

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return [...projects]
      .filter((project) => {
        const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter;
        const matchesQuery =
          project.title.toLowerCase().includes(normalizedQuery) ||
          project.description.toLowerCase().includes(normalizedQuery) ||
          project.category.toLowerCase().includes(normalizedQuery);

        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "applications") {
          return b.applications - a.applications;
        }

        if (sortBy === "deadline") {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }

        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [projects, statusFilter, searchQuery, sortBy]);

  const totalApplications = useMemo(
    () => projects.reduce((sum, project) => sum + project.applications, 0),
    [projects],
  );

  const completionRate = useMemo(() => {
    if (!projects.length) {
      return 0;
    }
    const completed = projects.filter((project) => project.status === "Completed").length;
    return Math.round((completed / projects.length) * 100);
  }, [projects]);

  const averageProgress = useMemo(() => {
    if (!projects.length) {
      return 0;
    }
    const total = projects.reduce((sum, project) => sum + project.progress, 0);
    return Math.round(total / projects.length);
  }, [projects]);

  const upcomingDeadlines = useMemo(() => {
    return [...projects]
      .filter((project) => project.status !== "Closed")
      .map((project) => {
        const daysUntil = Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return { ...project, daysUntil };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3);
  }, [projects]);

  const highPriorityProjects = projects.filter((project) => project.priority === "High").length;

  const handleResetFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setSortBy("recent");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
            <p className="text-muted-foreground">Track live briefs, respond to candidates, and keep hiring momentum.</p>
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

        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Active projects",
                value: `${stats.activeProjects}`,
                subtext: "Current briefs open",
                icon: Briefcase,
              },
              {
                label: "Applications",
                value: `${stats.totalApplicants}`,
                subtext: "Total received",
                icon: Users,
              },
              {
                label: "Avg turnaround",
                value: stats.averageTurnaroundHours !== null ? `${stats.averageTurnaroundHours} hrs` : "N/A",
                subtext: "Response time to applicants",
                icon: Clock,
              },
              {
                label: "Completion rate",
                value: `${completionRate}%`,
                subtext: "Past 90 days",
                icon: CheckCircle2,
              },
            ].map((stat) => (
              <Card key={stat.label} className="border border-border shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-full bg-muted p-2.5">
                    <stat.icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Filter pipeline</CardTitle>
              <CardDescription>Zero-in on the briefs that need your attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <TabsList className="flex h-auto flex-wrap gap-2 rounded-none bg-transparent p-0">
                  {statusFilters.map((filter) => (
                    <TabsTrigger
                      key={filter.value}
                      value={filter.value}
                      className="rounded-full border border-border bg-card px-4 py-2 text-sm data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <span>{filter.label}</span>
                        <span className="text-xs font-medium text-muted-foreground data-[state=active]:text-white">
                          {statusCounts[filter.value] ?? 0}
                        </span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by title, keyword, or category"
                      className="pl-9"
                    />
                  </div>

                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="sm:w-[220px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recently updated</SelectItem>
                      <SelectItem value="deadline">Upcoming deadlines</SelectItem>
                      <SelectItem value="applications">Most applications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-border text-slate-700">
                    <Filter className="mr-2 h-4 w-4" />
                    Advanced filters
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
            <div className="space-y-4">
              {filteredProjects.length === 0 ? (
                <Card className="border-dashed border-slate-300">
                  <CardHeader>
                    <CardTitle>No projects match your filters</CardTitle>
                    <CardDescription>
                      Try adjusting your search or post a fresh project to keep talent engaged.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    <Button size="sm" onClick={handleResetFilters}>
                      Clear filters
                    </Button>
                    <Link to="/employer/projects/new">
                      <Button size="sm" variant="outline">
                        Post new project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                filteredProjects.map((project) => {
                  const deadlineDate = new Date(project.deadline);
                  const daysUntilDeadline = Math.ceil(
                    (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                  );
                  const deadlineLabel =
                    daysUntilDeadline >= 0 ? `${daysUntilDeadline} days left` : `${Math.abs(daysUntilDeadline)} days ago`;

                  return (
                    <Card key={project.id} className="border border-border shadow-sm">
                      <CardHeader className="space-y-3 pb-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <CardTitle className="text-xl">{project.title}</CardTitle>
                              <Badge variant="outline" className="border-border text-muted-foreground">
                                {project.category}
                              </Badge>
                            </div>
                            <CardDescription>Posted {project.postedDate}</CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className={statusBadgeClasses[project.status]}>
                              {project.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">Updated {formatRelativeTime(project.updatedAt)}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{project.description.trim().slice(0, 100) + "..."}</p>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Budget</p>
                            <p className="text-lg font-semibold text-foreground">{project.budget}</p>
                            <p className="text-sm text-muted-foreground">{project.hours}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Deadline</p>
                            <p className="text-lg font-semibold text-foreground">
                              {deadlineDate.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">{deadlineLabel}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Talent needs</p>
                            <p className="text-lg font-semibold text-foreground">{project.talentsNeeded} hires</p>
                            <p className="text-sm text-muted-foreground">{project.deliverables} deliverables</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <p>Delivery progress</p>
                            <p className="font-medium text-foreground">{project.progress}%</p>
                          </div>
                          <Progress value={project.progress} />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <Badge variant="outline" className={priorityBadgeClasses[project.priority]}>
                            {project.priority} priority
                          </Badge>
                          {project.applications > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {project.applications} {project.applications === 1 ? "application" : "applications"}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span>Last touched {formatRelativeTime(project.updatedAt)}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Link to={`/employer/projects/${project.id}/applications`}>
                              <Button size="sm">
                                <Users className="mr-1.5 h-4 w-4" />
                                Review applicants
                              </Button>
                            </Link>
                            <Link to={`/project/${project.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="mr-1.5 h-4 w-4" />
                                View brief
                              </Button>
                            </Link>
                            <Link to={`/employer/projects/${project.id}/edit`}>
                              <Button size="sm" variant="secondary">
                                <Edit className="mr-1.5 h-4 w-4" />
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            <div className="space-y-4">
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Upcoming deadlines</CardTitle>
                      <CardDescription>Review briefs going live soon.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingDeadlines.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No deadlines on the horizon.</p>
                  ) : (
                    upcomingDeadlines.map((project) => (
                      <div key={project.id} className="rounded-lg border border-border bg-background/50 p-3">
                        <div className="flex items-center justify-between text-sm font-medium text-foreground">
                          <span className="line-clamp-1">{project.title}</span>
                          <Badge variant="outline" className={statusBadgeClasses[project.status]}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Due{" "}
                          {new Date(project.deadline).toLocaleDateString("en-GB", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          · {project.daysUntil >= 0 ? `${project.daysUntil} days` : "Overdue"}
                        </p>
                        <Progress value={project.progress} className="mt-2 h-2" />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">Pipeline insights</CardTitle>
                      <CardDescription>Stay ahead of bottlenecks.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Average progress</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-semibold text-foreground">{averageProgress}%</p>
                    </div>
                    <Progress value={averageProgress} className="mt-2 h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>High-priority briefs</span>
                      <span className="font-medium text-foreground">{highPriorityProjects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Open roles to fill</span>
                      <span className="font-medium text-foreground">
                        {projects.reduce((sum, project) => sum + project.talentsNeeded, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Drafts ready to launch</span>
                      <span className="font-medium text-foreground">
                        {statusCounts.draft ?? 0} brief{(statusCounts.draft ?? 0) === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Reply to candidates within 24h to stay featured.</li>
                    <li>Group similar roles under one brief to boost reach.</li>
                    <li>Share final deliverables with stakeholders weekly.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
