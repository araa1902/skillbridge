import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { ProjectCard } from "@/components/ProjectCard"
import { useAuth } from "@/contexts/AuthContext"
import { useFetchMyApplications } from "@/hooks/useApplications"
import { useStudentStats } from "@/hooks/useProjects"
import { useFetchStudentReferences } from "@/hooks/useReferences"
import { useFetchStudentCredentials } from "@/hooks/useCredentials"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Briefcase, Medal as Award, TrendUp as TrendingUp, Star, ArrowUpRight as ArrowUpRight, CheckCircle as CheckCircle2, ChatCircle as MessageSquare, UploadSimple as Upload, CaretRight as ChevronRight, Sparkle as Sparkles, Target as CircleDot } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, YAxis } from "recharts"
import { DashboardGreeting } from "@/components/DashboardGreeting"
import { SubmitDeliverableDialog } from "@/components/SubmitDeliverableDialog"
import { FeedbackDialog } from "@/components/layout/feedback-dialog"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileItem {
  label: string
  done: boolean
}



// ─── Constants ────────────────────────────────────────────────────────────────

const PROFILE_ITEMS: ProfileItem[] = [
  { label: "University verified", done: true },
  { label: "Skills added", done: true },
  { label: "Bio written", done: true },
  { label: "Portfolio projects", done: false },
  { label: "Profile photo", done: false },
]

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  sub,
  icon: Icon,
  iconClass,
  trend,
  href,
  delay = 0,
}: {
  label: string
  value: React.ReactNode
  sub?: string
  icon: React.ElementType
  iconClass: string
  trend?: string
  href?: string
  delay?: number
}) => {
  const inner = (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3, delay }}
    >
      <Card className="relative overflow-hidden hover:ring-1 hover:ring-primary/20 transition-all duration-300 border-border/40 shadow-sm bg-card">
        <CardContent className="pt-6 pb-5 px-6">
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-2.5 rounded-xl", iconClass.replace("text-", "bg-").replace("-600", "-50").replace("-500", "-50").replace("-400", "-50"))}>
              <Icon className={cn("h-5 w-5", iconClass)} />
            </div>
            {trend && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                <ArrowUpRight className="h-3 w-3" />
                {trend}
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-700 text-foreground/70 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-800 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
            {sub && <p className="text-[11px] text-foreground/60 mt-2 font-500">{sub}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return href ? <Link to={href} className="block h-full">{inner}</Link> : inner
}

const ActiveProjectRow = ({
  app,
  onSubmit,
}: {
  app: any
  onSubmit: (id: string) => void
}) => (
  <div className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
    {/* Status indicator */}
    <div className="mt-0.5 shrink-0">
      {app.deliverable_link ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      ) : (
        <CircleDot className="h-4 w-4 text-blue-500" />
      )}
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <p className="text-sm font-semibold truncate">{app.project_title}</p>
        <Badge
          variant="secondary"
          className={cn(
            "text-[10px] shrink-0",
            app.deliverable_link
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          )}
        >
          {app.deliverable_link ? "Submitted" : "In Progress"}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {app.company_name ?? app.business_name ?? "Company"}
      </p>

      <div className="flex items-center gap-2">
        {!app.deliverable_link && (
          <Button
            size="sm"
            className="h-7 text-xs gap-1.5 rounded-full border"
            onClick={() => onSubmit(app.id)}
          >
            <Upload className="h-3 w-3" />
            Submit Work
          </Button>
        )}
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" asChild>
          <Link to={`/project/${app.project_id}/messages?to=${app.business_id}`}>
            <MessageSquare className="h-3 w-3" />
            Message
          </Link>
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto gap-1" asChild>
          <Link to={`/project/${app.project_id}`}>
            View
            <ChevronRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
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

const StudentDashboard = () => {
  const { profile, user } = useAuth()
  const { toast } = useToast()
  const { applications, refetch } = useFetchMyApplications(user?.id ?? null)
  const { totalEarnings, thisMonthEarnings } = useStudentStats(user?.id ?? null)
  const { averageRating, totalCount: refCount } = useFetchStudentReferences(user?.id ?? null)
  const { credentials } = useFetchStudentCredentials(user?.id ?? null)

  const activeProjects = applications.filter((a) => a.status === "accepted")

  const [deliverableDialog, setDeliverableDialog] = useState<string | null>(null)

  const recommendedProjects: any[] = []
  const firstName = profile?.full_name?.split(" ")[0] ?? "there"

  const profileComplete = Math.round(
    (PROFILE_ITEMS.filter((i) => i.done).length / PROFILE_ITEMS.length) * 100
  )

  // Mock data for the earnings chart
  const earningsData = [
    { name: 'Nov', total: Math.max(0, totalEarnings - 600) },
    { name: 'Dec', total: Math.max(0, totalEarnings - 450) },
    { name: 'Jan', total: Math.max(0, totalEarnings - 300) },
    { name: 'Feb', total: Math.max(0, totalEarnings - 100) },
    { name: 'Mar', total: totalEarnings - thisMonthEarnings },
    { name: 'Apr', total: totalEarnings },
  ]

  // Mock success rate data if no real data exists
  const hasHistory = applications.length > 0;
  const completedCount = applications.filter(a => a.status === 'completed').length;
  const successRate = applications.length > 0 ? Math.round((completedCount / applications.length) * 100) : 0;

  const successData = [
    { name: 'Applied', value: applications.length, color: '#6366f1' }, // Indigo
    { name: 'Accepted', value: applications.filter(a => ['accepted', 'in_progress', 'completed'].includes(a.status as string)).length, color: '#8b5cf6' }, // Violet
    { name: 'Completed', value: completedCount, color: '#10b981' }, // Emerald
  ]


  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-8 space-y-8">

        {/* ── Welcome Greeting ── */}
        <DashboardGreeting
          firstName={firstName}
          subtext="Track your active projects, earnings, and verified credentials all in one place."
        />

        {/* ── Dashboard Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Engagements"
            value={activeProjects.length}
            sub={activeProjects.length === 1 ? "1 project in progress" : `${activeProjects.length} projects in progress`}
            icon={Briefcase}
            iconClass="text-indigo-600"
            delay={0.05}
          />
          <StatCard
            label="Credits Verified"
            value={credentials.length}
            sub={`${credentials.length === 1 ? '1 validated badge' : `${credentials.length} validated badges`}`}
            icon={Award}
            iconClass="text-violet-600"
            delay={0.1}
          />
          <StatCard
            label="Total Revenue"
            value={`£${totalEarnings.toLocaleString()}`}
            sub={thisMonthEarnings > 0 ? `+£${thisMonthEarnings.toLocaleString()} this month` : 'All time savings'}
            icon={TrendingUp}
            iconClass="text-emerald-600"
            trend={thisMonthEarnings > 0 ? "Growth" : undefined}
            delay={0.15}
          />
          <StatCard
            label="Peer Feedback"
            value={
              <span className="flex items-center gap-1.5">
                {averageRating.toFixed(1)}
                <span className="flex items-center">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </span>
              </span>
            }
            sub={`From ${refCount} reviews`}
            icon={Star}
            iconClass="text-amber-500"
            href="/student/references"
            delay={0.2}
          />
        </div>

        {/* ── Main Layout Split ── */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* ── Primary Activity Feed (Left Column 8/12) ── */}
          <div className="lg:col-span-8 space-y-8">

            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-700 tracking-tight flex items-center gap-2 text-foreground">
                  <CircleDot className="h-5 w-5 text-indigo-500" />
                  Active Deliverables
                </h2>
                {activeProjects.length > 0 && (
                  <Link to="/student/applications" className="text-xs font-600 text-primary hover:underline">
                    Manage all
                  </Link>
                )}
              </div>

              <div className="space-y-3">
                {activeProjects.length === 0 ? (
                  <Card className="border-dashed bg-muted/20 border-border/60">
                    <CardContent className="py-12">
                      <EmptyState
                        icon={Briefcase}
                        title="No active work right now"
                        description="Browse open projects to find your next opportunity and build your portfolio."
                        action={
                          <Button size="sm" asChild className="rounded-full px-6">
                            <Link to="/browse-projects">Discover Projects</Link>
                          </Button>
                        }
                      />
                    </CardContent>
                  </Card>
                ) : (
                  activeProjects.map((app) => (
                    <ActiveProjectRow
                      key={app.id}
                      app={app}
                      onSubmit={setDeliverableDialog}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Performance Hub (Recharts Analytics) */}
            <section className="space-y-4">
              <h2 className="text-lg font-700 tracking-tight flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Performance Insights
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="shadow-none border-border/40 hover:border-border/80 transition-colors bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-700">Financial Trajectory</CardTitle>
                    <CardDescription className="text-[11px]">Monthly earnings across all projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {totalEarnings > 0 ? (
                      <div className="h-[200px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={earningsData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888888' }} dy={10} />
                            <Tooltip
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              itemStyle={{ color: '#4f46e5', fontWeight: 600, fontSize: '12px' }}
                              formatter={(value: number) => [`£${value}`, 'Revenue']}
                            />
                            <Area
                              type="monotone"
                              dataKey="total"
                              stroke="#6366f1"
                              strokeWidth={2.5}
                              fillOpacity={1}
                              fill="url(#colorEarnings)"
                              animationDuration={1000}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
                        <TrendingUp className="h-8 w-8 mb-2" />
                        <p className="text-xs">No transaction history yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-none border-border/40 hover:border-border/80 transition-colors bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-700">Application Funnel</CardTitle>
                    <CardDescription className="text-[11px]">Success rate and metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hasHistory ? (
                      <div className="h-[200px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={successData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888888' }} dy={10} />
                            <Tooltip
                              cursor={{ fill: 'transparent' }}
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              itemStyle={{ fontSize: '12px' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32} animationDuration={1000}>
                              {successData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
                        <Award className="h-8 w-8 mb-2" />
                        <p className="text-xs">History builds as you apply</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Smart Matches */}

          </div>

          {/* ── Profile & Secondary Sidebar (Right Column 4/12) ── */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Portfolio Grid */}
            <Card className="shadow-none border-border/40 bg-card">
              <CardHeader className="pb-3 border-b border-border/40 mb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-700">Digital Portfolio</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 border-indigo-200 text-indigo-700">
                    {credentials.length} Badges
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {credentials.length === 0 ? (
                    <div className="col-span-2 text-center py-6 opacity-40">
                      <Award className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-[10px]">No credentials yet</p>
                    </div>
                  ) : (
                    credentials.slice(0, 4).map((cred) => (
                      <div
                        key={cred.id}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-center bg-muted/30 border border-border/40 hover:border-primary/30 transition-all"
                      >
                        <Award className="h-5 w-5 text-violet-600" />
                        <p className="text-[10px] font-700 leading-tight line-clamp-2">{cred.project_title || 'Skill'}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <SubmitDeliverableDialog
        applicationId={deliverableDialog}
        onClose={() => setDeliverableDialog(null)}
        onSuccess={refetch}
      />
    </div>
  )
}

export default StudentDashboard
