import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

// --------------------------------------------------------------------------
// Role → default dashboard mapping
// --------------------------------------------------------------------------
const ROLE_HOME: Record<UserRole, string> = {
  student: '/student/dashboard',
  business: '/employer/dashboard',
  university: '/university/dashboard',
}

// --------------------------------------------------------------------------
// Props
// --------------------------------------------------------------------------
interface ProtectedRouteProps {
  /** Roles that are allowed to access this route */
  allowedRoles: UserRole[]
  /** The component to render when access is granted */
  children: React.ReactNode
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------
export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { session, role, loading } = useAuth()
  const location = useLocation()

  // 1. Still resolving the session / profile – show a full-page skeleton
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 w-64">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    )
  }

  // 2. Not authenticated → send to /auth, preserving the intended destination
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // 3. Authenticated but role not yet loaded (edge-case: DB latency)
  //    Render nothing – the onAuthStateChange loop will re-render shortly
  if (!role) {
    return null
  }

  // 4. Wrong role → redirect to the user's own dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role]} replace />
  }

  // 5. All checks pass – render the protected content
  return <>{children}</>
}
