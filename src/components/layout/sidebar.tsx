import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, AddAlt, Roadmap, StarReview, Chat, Settings, Binoculars, LicenseThirdParty, Badge, UserAvatar } from "@carbon/icons-react"
import {
  LogOut,
  BarChart3,
  Briefcase,
  Award,
  GraduationCap,
  ChevronUp,
  Zap,
  BookOpen,
  Building2,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

/* ─────────────────────────────────────────────────────────────────────────────
   NAV CONFIG
───────────────────────────────────────────────────────────────────────────── */

type NavItem = {
  name: string
  href: string
  icon: React.ElementType
  badge?: string | number
  highlight?: boolean   // renders with accent treatment (e.g. "Post Project")  
  disabled?: boolean
}

type NavGroup = {
  label?: string
  items: NavItem[]
}

const studentNav: NavGroup[] = [
  {
    items: [
      { name: "Dashboard", href: "/student/dashboard", icon: Home },
      { name: "Browse", href: "/browse-projects", icon: Binoculars },
      { name: "My Applications", href: "/student/applications", icon: LicenseThirdParty },
    ],
  },
  {
    label: "Profile",
    items: [
      { name: "Portfolio", href: "/student/credentials", icon: Badge },
      { name: "References", href: "/student/references", icon: StarReview },
      { name: "Messages", href: "/student/messages", icon: Chat, badge: 3, disabled: true },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", href: "/student/settings", icon: Settings },
    ],
  },
]

const employerNav: NavGroup[] = [
  {
    items: [
      { name: "Dashboard", href: "/employer/dashboard", icon: Home },
      {
        name: "Post a Project",
        href: "/employer/projects/new",
        icon: AddAlt,
        highlight: true,
      },
    ],
  },
  {
    label: "Manage",
    items: [
      { name: "My Projects", href: "/employer/projects/manage", icon: Roadmap },
      { name: "Applications", href: "/employer/applications", icon: LicenseThirdParty, badge: 5 },
      { name: "References", href: "/employer/references", icon: StarReview },
      { name: "Messages", href: "/employer/messages", icon: Chat, badge: 2, disabled: true },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", href: "/employer/settings", icon: Settings },
    ],
  },
]

const universityNav: NavGroup[] = [
  {
    items: [
      { name: "Dashboard", href: "/university/dashboard", icon: Home },
    ],
  },
  {
    label: "Manage",
    items: [
      { name: "Students", href: "/university/students", icon: GraduationCap },
      { name: "Projects", href: "/university/projects", icon: Briefcase },
      { name: "Employers", href: "/university/employers", icon: Building2 },
      { name: "Courses", href: "/university/courses", icon: BookOpen },
    ],
  },
  {
    label: "Data",
    items: [
      { name: "Analytics", href: "/university/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Settings", href: "/university/settings", icon: Settings },
    ],
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
   ROLE META
───────────────────────────────────────────────────────────────────────────── */

const ROLE_META: Record<string, {
  label: string
  badgeClass: string
  avatarClass: string
  icon: React.ElementType
}> = {
  student: {
    label: "Student",
    badgeClass: "badge badge--student",
    avatarClass: "bg-blue-50 text-blue-600",
    icon: GraduationCap,
  },
  employer: {
    label: "Business",
    badgeClass: "badge badge--sme",
    avatarClass: "bg-violet-50 text-violet-600",
    icon: Building2,
  },
  university: {
    label: "University",
    badgeClass: "badge badge--info",
    avatarClass: "bg-sky-50 text-sky-600",
    icon: BookOpen,
  },
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

function NavItemRow({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      to={item.href}
      className={cn(
        "nav-item group relative",
        isActive && "active",
        item.highlight && !isActive && "nav-item--highlight"
      )}
    >
      <item.icon
        className={cn(
          "nav-item__icon transition-transform duration-150",
          isActive ? "scale-110" : "group-hover:scale-105"
        )}
      />
      <span className="flex-1 truncate">{item.name}</span>
    </Link>
  )
}

function UserSkeleton() {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-2.5 w-16" />
      </div>
    </div>
  )
}

/* Ambient gradient orb — decorative, top of sidebar */
function SidebarOrb() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 right-0 h-48 overflow-hidden rounded-t-[inherit] z-0"
    >
      <div
        className="absolute -top-12 -left-8 w-40 h-40 rounded-full opacity-[0.07] blur-3xl animate-blob"
        style={{ background: "hsl(var(--primary))" }}
      />
      <div
        className="absolute -top-8 right-0 w-28 h-28 rounded-full opacity-[0.05] blur-2xl animate-blob"
        style={{ background: "hsl(var(--role-sme))", animationDelay: "3s" }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN SIDEBAR
───────────────────────────────────────────────────────────────────────────── */

interface SidebarProps {
  userType?: "student" | "employer" | "university"
}

export function Sidebar({ userType }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, role, loading, signOut } = useAuth()

  /* Resolve which persona we're rendering for */
  const detectedType = ((): "student" | "employer" | "university" => {
    if (role === "business") return "employer"
    if (role === "university") return "university"
    if (role === "student") return "student"
    if (userType) return userType
    const p = location.pathname
    if (p.startsWith("/employer")) return "employer"
    if (p.startsWith("/university")) return "university"
    return "student"
  })()

  const groups = detectedType === "employer" ? employerNav
    : detectedType === "university" ? universityNav
      : studentNav

  const meta = ROLE_META[detectedType]
  const RoleIcon = meta.icon

  const handleSignOut = async () => {
    await signOut()
    navigate("/auth", { replace: true })
  }

  /* Flatten all items for active-check */
  const allItems = groups.flatMap((g) => g.items)

  return (
    <aside
      className={cn(
        "relative flex h-screen w-[15rem] flex-col",
        "bg-card border-r border-border",
        "overflow-hidden"
      )}
    >
      <SidebarOrb />

      {/* ─── Logo / Brand ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex h-[3.75rem] shrink-0 items-center justify-between px-4 border-b border-border/70">
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* Logo mark */}
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-150">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span
            className="text-[0.9375rem] font-800 tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
          >
            SkillBridge
          </span>
        </Link>
      </div>
      {/* ─── Navigation ───────────────────────────────────────────────── */}
      <ScrollArea className="relative z-10 flex-1 px-3 pt-2 pb-2">
        <nav className="flex flex-col gap-5">
          {groups.map((group, gi) => (
            <div key={gi} className="flex flex-col gap-0.5">
              {group.label && (
                <p className="nav-section-label">{group.label}</p>
              )}
              {group.items.map((item) => (
                <NavItemRow
                  key={item.href}
                  item={item}
                  isActive={
                    location.pathname === item.href ||
                    (item.href !== "/" && location.pathname.startsWith(item.href))
                  }
                />
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* ─── User profile / footer ────────────────────────────────────── */}
      <div className="relative z-10 shrink-0 border-t border-border/70 p-3">
        {loading ? (
          <UserSkeleton />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center gap-2.5 px-2 py-2 rounded-xl",
                  "hover:bg-accent transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "group cursor-pointer"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "avatar avatar--sm flex-shrink-0 font-700",
                    meta.avatarClass
                  )}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>

                {/* Name + role */}
                <div className="flex flex-col items-start min-w-0 mr-auto">
                  <span
                    className="text-sm font-600 text-foreground truncate w-full leading-tight"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
                  >
                    {profile?.full_name ?? "User"}
                  </span>
                  <span className="text-[0.6875rem] text-muted-foreground mt-0.5 leading-none capitalize">
                    {meta.label}
                  </span>
                </div>
                {/* Chevron */}
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 rounded-xl shadow-xl border border-border"
              align="end"
              side="top"
              sideOffset={10}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {/* User info header */}
              <div className="px-3 py-2.5 border-b border-border">
                <p className="text-sm font-600 text-foreground truncate" style={{ fontFamily: "var(--font-display)" }}>
                  {profile?.full_name ?? "User"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{meta.label} account</p>
              </div>

              {/* Settings */}
              <div className="p-1">
                {allItems.filter((i) => i.name === "Settings").map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      to={item.href}
                      className="flex items-center gap-2.5 px-2 py-2 text-sm font-500 rounded-lg cursor-pointer"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuItem asChild>
                  <Link
                    to={`/${detectedType}/profile`}
                    className="flex items-center gap-2.5 px-2 py-2 text-sm font-500 rounded-lg cursor-pointer"
                  >
                    <UserAvatar className="h-4 w-4 text-muted-foreground" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <div className="p-1">
                <DropdownMenuItem
                  className="flex items-center gap-2.5 px-2 py-2 text-sm font-500 rounded-lg text-destructive focus:bg-destructive/8 focus:text-destructive cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </aside>
  )
}
