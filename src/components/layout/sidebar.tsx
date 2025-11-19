import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  Briefcase,
  Award,
  FileText,
  Building,
  GraduationCap,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const studentNavigation = [
  { name: "Dashboard", href: "/student/dashboard", icon: Home },
  { name: "Browse Projects", href: "/browse-projects", icon: Briefcase },
  { name: "My Credentials", href: "/student/credentials", icon: Award },
  { name: "Applications", href: "/student/applications", icon: FileText },
  { name: "Settings", href: "/student/settings", icon: Settings },
]

const employerNavigation = [
  { name: "Dashboard", href: "/employer/dashboard", icon: Home },
  { name: "Post Project", href: "/employer/projects/new", icon: Briefcase },
  { name: "Manage Projects", href: "/employer/projects/manage", icon: BarChart3 },
  { name: "Applications", href: "/employer/applications", icon: FileText },
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
  userType?: 'student' | 'employer' | 'university'
}

export function Sidebar({ userType = 'student' }: SidebarProps) {
  const location = useLocation()

  const navigation = userType === 'employer' ? employerNavigation : 
                    userType === 'university' ? universityNavigation : 
                    studentNavigation

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-gradient-to-b from-gray-50 via-gray-50/30 to-gray-50/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200/60 px-6 bg-white/80 backdrop-blur-sm">
        <Link to="/" className="flex items-center space-x-2 group">
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
        
        <div className="space-y-1">
          <Link to="/notifications">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-200"
            >
              <Bell className="mr-3 h-4 w-4" />
              Notifications
            </Button>
          </Link>
          
          <Button
            variant="ghost"
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
