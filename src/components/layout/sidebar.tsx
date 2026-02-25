import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Home,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  Briefcase,
  Award,
  FileText,
  GraduationCap,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

const studentNavigation = [
  { name: "Dashboard", href: "/student/dashboard", icon: Home },
  { name: "Browse Projects", href: "/browse-projects", icon: Briefcase },
  { name: "My Applications", href: "/student/applications", icon: FileText },
  { name: "My Portfolio", href: "/student/credentials", icon: Award },
  { name: "References", href: "/student/references", icon: Award },
  { name: "Settings", href: "/student/settings", icon: Settings },
]

const employerNavigation = [
  { name: "Dashboard", href: "/employer/dashboard", icon: Home },
  { name: "Post Project", href: "/employer/projects/new", icon: Briefcase },
  { name: "My Projects", href: "/employer/projects/manage", icon: BarChart3 },
  { name: "Applications", href: "/employer/applications", icon: FileText },
  { name: "References", href: "/employer/references", icon: Award },
  { name: "Settings", href: "/employer/settings", icon: Settings },
]

const universityNavigation = [
  { name: "Dashboard", href: "/university/dashboard", icon: Home },
  { name: "Students", href: "/university/students", icon: GraduationCap },
  { name: "Projects", href: "/university/projects", icon: Briefcase },
  { name: "Analytics", href: "/university/analytics", icon: BarChart3 },
  { name: "Settings", href: "/university/settings", icon: Settings },
]

interface SidebarProps {
  /** Kept for backward-compat; role from AuthContext takes priority when logged in */
  userType?: 'student' | 'employer' | 'university'
}

export function Sidebar({ userType }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, role, loading, signOut } = useAuth()

  // Derive display type: prefer live role, fall back to prop, then URL detection
  const detectedUserType = (() => {
    if (role === 'business') return 'employer'
    if (role === 'university') return 'university'
    if (role === 'student') return 'student'

    if (userType) return userType

    const path = location.pathname
    if (path.startsWith('/employer')) return 'employer'
    if (path.startsWith('/university')) return 'university'
    return 'student'
  })()

  const navigation =
    detectedUserType === 'employer' ? employerNavigation
    : detectedUserType === 'university' ? universityNavigation
    : studentNavigation

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth', { replace: true })
  }

  // Derive initials for the avatar fallback
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const displayName = profile?.full_name ?? 'Loading…'
  const displaySub =
    detectedUserType === 'employer'
      ? profile?.company_name ?? 'Business'
      : detectedUserType === 'university'
      ? 'University'
      : 'Student'

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gradient-to-b from-gray-50 via-gray-50/30 to-gray-50/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200/60 px-6 bg-white/80 backdrop-blur-sm">
        <Link to="/" className="flex flex-col group">
          <span className="text-xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent group-hover:from-gray-800 group-hover:via-gray-900 group-hover:to-black transition-all duration-300">
            SkillBridge
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "outline" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200 hover:scale-[1.02]",
                    isActive
                      ? "bg-gradient-to-r from-gray-100 via-gray-100 to-gray-100 text-gray-800 border border-gray-200/50"
                      : "text-gray-700 hover:bg-white/70 hover:text-gray-900 hover:shadow-sm"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Profile & Actions */}
      <div className="border-t border-gray-200/60 p-3 space-y-3 bg-white/60 backdrop-blur-sm">
        {/* User info row */}
        <div className="flex items-center gap-3 px-2 py-1">
          {loading ? (
            <>
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={displayName} />
                <AvatarFallback className="text-xs font-semibold bg-gray-200 text-gray-700">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">{displayName}</span>
                <span className="text-xs text-gray-500 truncate">{displaySub}</span>
              </div>
            </>
          )}
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
