import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus as Plus, Users, Briefcase, CheckCircle as CheckCircle2, TrendUp as TrendingUp, ArrowUpRight as ArrowUpRight, Star, CaretRight as ChevronRight, Clock, FileText, Target as CircleDot, Eye } from "@phosphor-icons/react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useMyProjects, useEmployerStats } from "@/hooks/useProjects"
import { cn } from "@/lib/utils"
import { DashboardGreeting } from "@/components/DashboardGreeting"

// ─── Constants ────────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}

// ─── Status helpers ───────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  draft: "bg-yellow-50 text-yellow-700 border-yellow-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
}

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border",
      statusStyles[status] ?? "bg-muted text-muted-foreground border-border"
    )}
  >
    {status.replace("_", " ")}
  </span>
)

// ─── Reusable sub-components ──────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  iconClass,
  bgClass,
  trend,
  href,
  loading = false,
  delay = 0,
}: {
  label: string
  value: React.ReactNode
  sub?: string
  icon: React.ElementType
  iconClass: string
  bgClass: string
  trend?: string
  href?: string
  loading?: boolean
  delay?: number
}) => {
  const inner = (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3, delay }}
      className="h-full"
    >
      <Card className="h-full shadow-none border-border/60 hover:shadow-sm transition-shadow duration-200">
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div className={cn("p-1.5 rounded-lg", bgClass)}>
              <Icon className={cn("h-3.5 w-3.5", iconClass)} />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {(sub || trend) && (
                <div className="flex items-center justify-between mt-1.5">
                  {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                  {trend && (
                    <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                      <ArrowUpRight className="h-3 w-3" />
                      {trend}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return href ? <Link to={href} className="block h-full">{inner}</Link> : inner
}

const ProjectRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl border">
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-32" />
    </div>
    <Skeleton className="h-7 w-28" />
  </div>
)

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description: string
  action?: React.ReactNode
}) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium mb-1">{title}</p>
    <p className="text-xs text-muted-foreground max-w-xs mb-4">{description}</p>
    {action}
  </div>
)

// ─── Main component ───────────────────────────────────────────────────────────

const EmployerDashboard = () => {
  const { user, profile } = useAuth()
  const { projects: myProjects, loading: projectsLoading } = useMyProjects(user?.id ?? null)
  const stats = useEmployerStats(user?.id ?? null)

  const pendingReferences: any[] = []
  const firstName = profile?.full_name?.split(" ")[0] ?? "there"
  const companyName = profile?.company_name ?? profile?.full_name ?? "Your Company"

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-8 space-y-8">

        <DashboardGreeting
          firstName={firstName}
          subtext={
            stats.activeProjects > 0
              ? `You have ${stats.activeProjects} active project${stats.activeProjects > 1 ? "s" : ""} and ${stats.totalApplicants} applicant${stats.totalApplicants !== 1 ? "s" : ""} to manage today.`
              : "Manage your projects, review applicants, and find your next contributor."
          }
          action={
            <Button size="sm" className="gap-1.5" asChild>
              <Link to="/employer/projects/new">
                <Plus className="h-3.5 w-3.5" />
                Post Project
              </Link>
            </Button>
          }
        />

        {/* ── Pending references banner ── */}
        {pendingReferences.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div className="flex items-center justify-between gap-4 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-yellow-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900">
                    {pendingReferences.length} student{pendingReferences.length !== 1 ? "s" : ""} waiting for your reference
                  </p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    Help students showcase their work with professional feedback
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 border-yellow-300 text-yellow-800 hover:bg-yellow-100 text-xs"
                asChild
              >
                <Link to="/employer/references">Write References</Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Active Projects"
            value={stats.activeProjects}
            sub="currently live"
            icon={Briefcase}
            iconClass="text-blue-600"
            bgClass="bg-blue-50"
            trend="live"
            loading={stats.loading}
            delay={0.05}
          />
          <StatCard
            label="Total Applicants"
            value={stats.totalApplicants}
            sub="across all projects"
            icon={Users}
            iconClass="text-violet-600"
            bgClass="bg-violet-50"
            loading={stats.loading}
            delay={0.1}
          />
          <StatCard
            label="Completed"
            value={stats.completedProjects}
            sub="projects finished"
            icon={TrendingUp}
            iconClass="text-emerald-600"
            bgClass="bg-emerald-50"
            loading={stats.loading}
            delay={0.15}
          />
          <StatCard
            label="Pending References"
            value={pendingReferences.length}
            sub={pendingReferences.length > 0 ? "need your attention" : "all up to date"}
            icon={Star}
            iconClass="text-yellow-600"
            bgClass="bg-yellow-50"
            href="/employer/references"
            delay={0.2}
          />
        </div>

        {/* ── Body ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left: projects ── */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="shadow-none border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">My Projects</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Your posted projects and their status
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" asChild>
                      <Link to="/employer/projects/manage">
                        View all
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projectsLoading ? (
                    <>
                      <ProjectRowSkeleton />
                      <ProjectRowSkeleton />
                      <ProjectRowSkeleton />
                    </>
                  ) : myProjects.length === 0 ? (
                    <EmptyState
                      icon={Briefcase}
                      title="No projects yet"
                      description="Post your first project to start receiving applications from students."
                      action={
                        <Button size="sm" asChild>
                          <Link to="/employer/projects/new">
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            New Project
                          </Link>
                        </Button>
                      }
                    />
                  ) : (
                    <>
                      {myProjects.slice(0, 5).map((project) => (
                        <div
                          key={project.id}
                          className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                        >
                          {/* Status dot */}
                          <div className="mt-0.5 shrink-0">
                            {project.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : project.status === "open" ? (
                              <CircleDot className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <p className="text-sm font-semibold truncate">{project.title}</p>
                              <StatusBadge status={project.status} />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {project.duration_hours} hrs
                              </span>
                              <span className="flex items-center gap-1">
                                £{Number(project.budget).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" asChild>
                                <Link to={`/employer/projects/${project.id}/applications`}>
                                  <Eye className="h-3 w-3" />
                                  Review Applicants
                                </Link>
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto gap-1" asChild>
                                <Link to={`/project/${project.id}`}>
                                  View
                                  <ChevronRight className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {myProjects.length > 5 && (
                        <Button variant="ghost" size="sm" className="w-full text-xs mt-1" asChild>
                          <Link to="/employer/projects/manage">
                            View all {myProjects.length} projects
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Right: sidebar ── */}
          <div className="space-y-4">

            {/* Applications shortcut */}
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <Card className="shadow-none border-border/60">
                <CardContent className="pt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 shrink-0">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Applications</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Review and respond to student applications across all your projects.
                      </p>
                    </div>
                  </div>
                  <Button className="w-full gap-1.5 text-xs" size="sm" asChild>
                    <Link to="/employer/applications">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Manage Applications
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick links */}
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="shadow-none border-border/60">
                <CardContent className="pt-4 pb-3 space-y-1">
                  {[
                    { label: "New Project", href: "/employer/projects/new", icon: Plus },
                    { label: "Manage Projects", href: "/employer/projects/manage", icon: Briefcase },
                    { label: "All Applications", href: "/employer/applications", icon: FileText },
                    { label: "References", href: "/employer/references", icon: Star },
                  ].map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      to={href}
                      className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <span className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard
