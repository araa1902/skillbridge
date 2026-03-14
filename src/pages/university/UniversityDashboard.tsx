import { useAuth } from '@/contexts/AuthContext'
import { useUniversityStats, useUniversityStudents } from '@/hooks/useUniversityData'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Briefcase, Medal as Award, ChatCircle as MessageSquare } from "@phosphor-icons/react"

interface Stats {
  totalStudents: number
  totalProjects: number
  totalCredentialsIssued: number
  activeConnections: number
}

interface StudentData {
  id: string
  full_name: string
  email: string
  applications_count: number
  credentials_earned: number
  joined_at: string
}

const UniversityDashboard = () => {
  const { user, profile } = useAuth()

  const { stats, loading: statsLoading } = useUniversityStats(user?.id, profile?.company_name)
  const { students, loading: studentsLoading } = useUniversityStudents(user?.id, profile?.company_name)

  const loading = statsLoading || studentsLoading
  const error = null; // Error handling simplified to fit new hooks

  if (!profile || profile.role !== 'university') {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
          <h3 className="font-semibold">Access Denied</h3>
          <p>This page is only available for university administrators.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">University Dashboard</h1>
        <p className="text-gray-600">Overview of platform activity and student engagement</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <p className="mt-2 text-3xl font-bold">{stats.totalStudents}</p>
              )}
            </div>
            <Users className="h-12 w-12 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Placements</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <p className="mt-2 text-3xl font-bold">{stats.activePlacements}</p>
              )}
            </div>
            <Briefcase className="h-12 w-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Student Earnings</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <p className="mt-2 text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
              )}
            </div>
            <Award className="h-12 w-12 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Competency Score</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <p className="mt-2 text-3xl font-bold">{stats.averageCompetency.toFixed(1)} / 5.0</p>
              )}
            </div>
            <MessageSquare className="h-12 w-12 text-orange-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">Recent Students</h2>
          <p className="text-sm text-gray-600">Latest 20 registered students on the platform</p>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No students registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Active Placements</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Credentials</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.full_name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.active_placements}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-green-700">
                      ${student.total_earnings.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-800">
                        {student.credentials_earned}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(student.joined_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default UniversityDashboard
