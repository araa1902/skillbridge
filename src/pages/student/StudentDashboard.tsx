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
import { DashboardGreeting } from "@/components/DashboardGreeting"
import { SubmitDeliverableDialog } from "@/components/SubmitDeliverableDialog"

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
      <Card className="relative overflow-hidden hover:shadow-sm transition-shadow duration-200 h-full">
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div className={cn("p-1.5 rounded-lg", iconClass.replace("text-", "bg-").replace("-600", "-50").replace("-500", "-50"))}>
              <Icon className={cn("h-3.5 w-3.5", iconClass)} />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
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


  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-8 space-y-8">

        <DashboardGreeting
          firstName={firstName}
          subtext={
            activeProjects.length > 0
              ? `You have ${activeProjects.length} active project${activeProjects.length > 1 ? "s" : ""} ongoing. Keep it up!`
              : "Here's what's happening with your projects today."
          }
        />

        {/* ── Stat row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Active Projects"
            value={activeProjects.length}
            sub={activeProjects.length === 1 ? "project ongoing" : "projects ongoing"}
            icon={Briefcase}
            iconClass="text-blue-600"
            delay={0.05}
          />
          <StatCard
            label="Credits Earned"
            value={credentials.length}
            sub={`${credentials.length === 1 ? '1 badge' : `${credentials.length} badges`}`}
            icon={Award}
            iconClass="text-violet-600"
            delay={0.1}
          />
          <StatCard
            label="Total Earnings"
            value={`£${totalEarnings.toLocaleString()}`}
            sub={thisMonthEarnings > 0 ? `+£${thisMonthEarnings.toLocaleString()} this month` : 'No earnings this month'}
            icon={TrendingUp}
            iconClass="text-emerald-600"
            delay={0.15}
          />
          <StatCard
            label="References"
            value={
              <span className="flex items-center gap-2">
                {refCount}
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < Math.round(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </span>
              </span>
            }
            sub={`${averageRating.toFixed(1)} avg rating`}
            icon={Star}
            iconClass="text-yellow-500"
            href="/student/references"
            delay={0.2}
          />
        </div>

        {/* ── Body ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left: main content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Active Projects */}
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
                      <CardTitle className="text-base">Active Projects</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Your ongoing work and deliverables
                      </CardDescription>
                    </div>
                    {activeProjects.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {activeProjects.length} active
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeProjects.length === 0 ? (
                    <EmptyState
                      icon={Briefcase}
                      title="No active projects yet"
                      description="Apply to open projects to start working and building your portfolio."
                      action={
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/browse-projects">Browse Projects</Link>
                        </Button>
                      }
                    />
                  ) : (
                    activeProjects.map((app) => (
                      <ActiveProjectRow
                        key={app.id}
                        app={app}
                        onSubmit={setDeliverableDialog}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommended Projects */}
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <Card className="shadow-none border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-violet-500" />
                        Recommended for You
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Matched to your skills and profile
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                      <Link to="/browse-projects">
                        View all
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recommendedProjects.length === 0 ? (
                    <EmptyState
                      icon={Sparkles}
                      title="No recommendations yet"
                      description="Complete your profile so we can surface the best-matched projects for you."
                      action={
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/browse-projects">Browse All Projects</Link>
                        </Button>
                      }
                    />
                  ) : (
                    <div className="grid gap-3">
                      {recommendedProjects.map((p) => (
                        <ProjectCard key={p.id} {...p} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Right: sidebar ── */}
          <div className="space-y-4">
            {/* Credentials */}
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <Card className="shadow-none border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Credentials</CardTitle>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                      <Link to="/student/credentials">
                        View all
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <CardDescription className="text-xs">Verifiable micro-credentials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {credentials.length === 0 ? (
                      <p className="text-[10px] text-muted-foreground col-span-2 text-center py-2">No credentials earned yet.</p>
                    ) : (
                      credentials.slice(0, 4).map((cred) => (
                        <div
                          key={cred.id}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 text-center bg-violet-50"
                          )}
                        >
                          <Award className={cn("h-5 w-5 text-violet-600")} />
                          <p className="text-xs font-semibold leading-tight">{cred.project_title || 'Skill'}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick links */}
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="shadow-none border-border/60">
                <CardContent className="pt-4 pb-3 space-y-1">
                  {[
                    { label: "My Applications", href: "/student/applications", icon: Briefcase },
                    { label: "My Portfolio", href: "/student/credentials", icon: Award },
                    { label: "References", href: "/student/references", icon: Star },
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

      <SubmitDeliverableDialog
        applicationId={deliverableDialog}
        onClose={() => setDeliverableDialog(null)}
        onSuccess={refetch}
      />
    </div>
  )
}

export default StudentDashboard
