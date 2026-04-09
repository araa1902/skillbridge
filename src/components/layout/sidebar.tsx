import { useState } from "react"
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
import {
  Badge,
  StarReview,
  Settings,
  AddAlt,
  Portfolio,
  UserMultiple,
  Education,
  Enterprise,
  Course,
  ChartBar,
  UserAvatar,
  PiggyBank,
} from "@carbon/icons-react";
import {
  LogOut,
  ChevronUp,
  Zap,
  BookOpen,
  Building2,
  PanelLeft,
  GraduationCap,
  InboxIcon,
  Compass,
  Send,
  LayoutDashboard,
  Search,
  Star,
  Award,
  BriefcaseBusinessIcon,
  NotebookIcon,
  UsersIcon,
  CirclePlusIcon,
  SendIcon,
  ClipboardPlusIcon,
  LucideCompass,
  NotebookPenIcon,
  PoundSterling,
  PiggyBankIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { FeedbackDialog } from "./feedback-dialog"
import { NotificationsPortal } from "../NotificationsPortal"
import { MoneyIcon } from "@phosphor-icons/react"

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
      { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { name: "Discover", href: "/browse-projects", icon: LucideCompass },
      { name: "Applications", href: "/student/applications", icon: SendIcon },
      { name: "Inbox", href: "/student/messages", icon: InboxIcon },
      { name: "Earnings", href: "/student/earnings", icon: MoneyIcon },
    ],
  },
  {
    label: "Profile",
    items: [
      { name: "Credentials", href: "/student/credentials", icon: Award },
      { name: "References", href: "/student/references", icon: Star },
    ],
  },
]

const employerNav: NavGroup[] = [
  {
    items: [
      { name: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
      {
        name: "New Project",
        href: "/employer/projects/new",
        icon: ClipboardPlusIcon,
        highlight: true,
      },
    ],
  },
  {
    label: "Manage",
    items: [
      { name: "Projects", href: "/employer/projects/manage", icon: BriefcaseBusinessIcon },
      { name: "Applications", href: "/employer/applications", icon: UsersIcon, badge: 5 },
      { name: "References", href: "/employer/references", icon: NotebookPenIcon },
      { name: "Inbox", href: "/employer/messages", icon: InboxIcon, badge: 2, disabled: true },
    ],
  },
]

const universityNav: NavGroup[] = [
  {
    items: [
      { name: "Dashboard", href: "/university/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Manage",
    items: [
      { name: "Students", href: "/university/students", icon: Education },
      { name: "Industry Placements", href: "/university/projects", icon: Portfolio },
      { name: "Analytics", href: "/university/analytics", icon: ChartBar },
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

function NavItemRow({ item, isActive, isCollapsed }: { item: NavItem; isActive: boolean; isCollapsed: boolean }) {
  const linkContent = (
    <Link
      to={item.href}
      className={cn(
        "nav-item group relative flex items-center gap-3 overflow-hidden",
        isActive && "active",
        item.highlight && !isActive && "nav-item--highlight",
        isCollapsed && "justify-center px-0 w-10 mx-auto"
      )}
    >
      <item.icon
        className={cn(
          "nav-item__icon transition-transform duration-150 flex-shrink-0",
          isActive ? "scale-110" : "group-hover:scale-105"
        )}
      />
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex-1 truncate whitespace-nowrap"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={14}>{item.name}</TooltipContent>
      </Tooltip>
    )
  }

  return linkContent
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
  const [isCollapsed, setIsCollapsed] = useState(false)

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
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative flex h-screen flex-col",
        "bg-card border-r border-border",
        "overflow-hidden shrink-0 group/sidebar"
      )}
    >
      <SidebarOrb />

      {/* ─── Logo / Brand ─────────────────────────────────────────────── */}
      <div className={cn(
        "relative z-10 flex h-[3.75rem] shrink-0 items-center px-4 border-b border-border/70",
        isCollapsed ? "justify-center px-0" : "justify-between"
      )}>
        <Link to="/" onClick={(e) => { if (isCollapsed) { e.preventDefault(); setIsCollapsed(false); } }} className="flex items-center gap-2.5 group relative outline-none cursor-pointer">
          {/* Logo mark - switches to expand icon on hover when collapsed */}
          <div className={cn(
            "relative w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150",
            isCollapsed ? "group-hover/sidebar:scale-110" : "group-hover:scale-105"
          )}>
            {isCollapsed ? (
              <>
                <div className="absolute inset-0 bg-primary/90 hover:bg-primary rounded-lg flex items-center justify-center shadow-sm opacity-0 group-hover/sidebar:opacity-100 transition-opacity z-10">
                  <PanelLeft className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover/sidebar:opacity-0 transition-opacity">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            )}

          </div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-[0.9375rem] font-800 tracking-tight text-foreground whitespace-nowrap"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
              >
                SkillBridge
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-md transition-colors"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ─── Navigation ───────────────────────────────────────────────── */}
      <ScrollArea className="relative z-10 flex-1 px-3 pt-2 pb-2">
        <nav className="flex flex-col gap-5">
          {groups.map((group, gi) => (
            <div key={gi} className="flex flex-col gap-0.5 min-w-0">
              {group.label && (
                <AnimatePresence initial={false}>
                  {!isCollapsed ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="nav-section-label whitespace-nowrap overflow-hidden"
                    >
                      {group.label}
                    </motion.p>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="h-3"
                    />
                  )}
                </AnimatePresence>
              )}
              {group.items.map((item) => (
                <NavItemRow
                  key={item.href}
                  item={item}
                  isCollapsed={isCollapsed}
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
      <div className={cn(
        "relative z-10 shrink-0 border-t border-border/70 flex flex-col",
        isCollapsed ? "p-2 items-center gap-2" : "p-3 gap-2"
      )}>
        <NotificationsPortal isCollapsed={isCollapsed} />
        <FeedbackDialog isCollapsed={isCollapsed} />
        {loading ? (
          <UserSkeleton />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center rounded-xl",
                  "hover:bg-accent transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "group cursor-pointer",
                  isCollapsed ? "justify-center p-2 w-full" : "w-full gap-2.5 px-2 py-2"
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

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      key="user-details"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex flex-col items-start min-w-0 mr-auto whitespace-nowrap overflow-hidden"
                    >
                      <span
                        className="text-sm font-600 text-foreground truncate w-full leading-tight"
                        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
                      >
                        {profile?.full_name ?? "User"}
                      </span>
                      <span className="text-[0.6875rem] text-muted-foreground mt-0.5 leading-none capitalize">
                        {meta.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isCollapsed && (
                  <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 rounded-xl shadow-xl border border-border"
              align={isCollapsed ? "center" : "end"}
              side={isCollapsed ? "right" : "top"}
              sideOffset={isCollapsed ? 14 : 10}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {/* User info header */}
              <div className="px-3 py-2.5 border-b border-border">
                <p className="text-sm font-600 text-foreground truncate" style={{ fontFamily: "var(--font-display)" }}>
                  {profile?.full_name ?? "User"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{meta.label}</p>
              </div>

              {/* Settings */}
              <div className="p-1">
                <DropdownMenuItem asChild>
                  <Link
                    to={`/${detectedType}/settings`}
                    className="flex items-center gap-2.5 px-2 py-2 text-sm font-500 rounded-lg cursor-pointer text-black"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                {detectedType === 'student' && (
                  <DropdownMenuItem asChild>
                    <Link
                      to={profile?.id ? `/student-profile/${profile.id}` : `/student/profile`}
                      className="flex items-center gap-2.5 px-2 py-2 text-sm font-500 rounded-lg cursor-pointer text-black"
                    >
                      <UserAvatar className="h-4 w-4 text-muted-foreground" />
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                )}
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
    </motion.aside>
  )
}
