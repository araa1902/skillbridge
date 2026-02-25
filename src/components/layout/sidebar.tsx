import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuGroup, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Home,
  Settings,
  LogOut,
  BarChart3,
  Briefcase,
  Award,
  FileText,
  GraduationCap,
  Star,
  ChevronRight,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

// ─── Navigation config ────────────────────────────────────────────────────────

const studentNavigation = [
  { name: "Dashboard", href: "/student/dashboard", icon: Home },
  { name: "Browse Projects", href: "/browse-projects", icon: Briefcase },
  { name: "My Applications", href: "/student/applications", icon: FileText },
  { name: "Portfolio", href: "/student/credentials", icon: Award },
  { name: "References", href: "/student/references", icon: Star },
  { name: "Settings", href: "/student/settings", icon: Settings },
]

const employerNavigation = [
  { name: "Dashboard", href: "/employer/dashboard", icon: Home },
  { name: "Post Project", href: "/employer/projects/new", icon: Briefcase },
  { name: "My Projects", href: "/employer/projects/manage", icon: BarChart3 },
  { name: "Applications", href: "/employer/applications", icon: FileText },
  { name: "References", href: "/employer/references", icon: Star },
  { name: "Settings", href: "/employer/settings", icon: Settings },
]

const universityNavigation = [
  { name: "Dashboard", href: "/university/dashboard", icon: Home },
  { name: "Students", href: "/university/students", icon: GraduationCap },
  { name: "Projects", href: "/university/projects", icon: Briefcase },
  { name: "Analytics", href: "/university/analytics", icon: BarChart3 },
  { name: "Settings", href: "/university/settings", icon: Settings },
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  userType?: "student" | "employer" | "university"
}

type NavItem = { name: string; href: string; icon: React.ElementType }

// ─── Sub-components ───────────────────────────────────────────────────────────

const NavLink = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
  <Link to={item.href} className="block">
    <span
      className={cn(
        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-accent/30 text-foreground"
          : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
      )}
    >
      <span className="flex items-center gap-3">
        <item.icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        {item.name}
      </span>
    </span>
  </Link>
)

const UserSkeleton = () => (
  <div className="flex items-center gap-3 px-1">
    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
    <div className="flex flex-col gap-1.5 flex-1">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-2.5 w-16" />
    </div>
  </div>
)

const RolePip = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    employer: "bg-violet-100 text-violet-700",
    university: "bg-blue-100   text-blue-700",
    student: "bg-emerald-100 text-emerald-700",
  }
  const labels: Record<string, string> = {
    employer: "Business",
    university: "University",
    student: "Student",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        styles[role] ?? "bg-muted text-muted-foreground"
      )}
    >
      {labels[role] ?? role}
    </span>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar({ userType }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, role, loading, signOut } = useAuth()

  // Resolve display role: live auth role → prop → URL heuristic
  const detectedType = (() => {
    if (role === "business") return "employer"
    if (role === "university") return "university"
    if (role === "student") return "student"
    if (userType) return userType
    const p = location.pathname
    if (p.startsWith("/employer")) return "employer"
    if (p.startsWith("/university")) return "university"
    return "student"
  })()

  const navigation =
    detectedType === "employer" ? employerNavigation
      : detectedType === "university" ? universityNavigation
        : studentNavigation

  const handleSignOut = async () => {
    await signOut()
    navigate("/auth", { replace: true })
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  // Split nav: all items except Settings / last item goes into main, Settings pinned
  const mainNav = navigation.filter((i) => i.name !== "Settings")
  const settingsNav = navigation.filter((i) => i.name === "Settings")

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-background">

      {/* ── Logo ── */}
      <div className="flex h-14 shrink-0 items-center px-5 border-b">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-sm font-bold tracking-tight text-foreground">
            SkillBridge
          </span>
        </Link>
      </div>

      {/* ── Main nav ── */}
      <ScrollArea className="flex-1 px-3 pt-4">
        <nav className="space-y-0.5">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* ── Bottom section ── */}
      <div className="mt-auto border-t p-4">
        {loading ? (
          <UserSkeleton />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-2"
              >
                <Avatar className="h-8 w-8 rounded-full border">
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                  <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start overflow-hidden text-left">
                  <span className="w-full truncate text-sm font-semibold">
                    {profile?.full_name || "User"}
                  </span>
                  <RolePip role={detectedType} />
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={12}>
              <DropdownMenuGroup>
                {settingsNav.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href} className="flex items-center gap-2 cursor-pointer">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  )
}
