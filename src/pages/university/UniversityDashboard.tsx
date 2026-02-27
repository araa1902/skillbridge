import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
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
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalProjects: 0,
    totalCredentialsIssued: 0,
    activeConnections: 0,
  })
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1. Fetch all student IDs for this university
        const { data: allUnivStudents, error: univStudentsError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'student')
          .eq('university_id', user!.id)

        if (univStudentsError) throw univStudentsError

        const studentIds = allUnivStudents?.map(s => s.id) || []
        const studentCount = studentIds.length

        let projectCount = 0
        let credentialCount = 0
        let activeConnections = 0

        if (studentIds.length > 0) {
          // Get total credentials issued to these students
          const { count: cCount, error: credentialError } = await supabase
            .from('credentials')
            .select('*', { count: 'exact', head: true })
            .in('student_id', studentIds)

          if (credentialError) throw credentialError
          credentialCount = cCount ?? 0

          // Get projects students have applied to
          const { data: appsData, error: appError } = await supabase
            .from('applications')
            .select('project_id, status')
            .in('student_id', studentIds)

          if (appError) throw appError

          projectCount = new Set((appsData ?? []).map(a => a.project_id)).size

          // Get active connections (unique project-based conversations involving these students)
          const { data: messageData, error: messageError } = await supabase
            .from('messages')
            .select('project_id, sender_id, receiver_id')

          if (messageError) throw messageError

          const relevantMessages = (messageData ?? []).filter((m: any) =>
            studentIds.includes(m.sender_id) || studentIds.includes(m.receiver_id)
          )
          activeConnections = new Set(relevantMessages.map(m => m.project_id)).size
        }

        setStats({
          totalStudents: studentCount,
          totalProjects: projectCount,
          totalCredentialsIssued: credentialCount,
          activeConnections: activeConnections,
        })

        // Get student list with stats
        const { data: studentList, error: studentListError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            email,
            created_at
          `)
          .eq('role', 'student')
          .eq('university_id', user!.id)
          .order('created_at', { ascending: false })
          .limit(20)

        if (studentListError) throw studentListError

        // Fetch applications and credentials for each student
        const studentsWithStats = await Promise.all(
          (studentList ?? []).map(async (student: any) => {
            const [appData, credData] = await Promise.all([
              supabase
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('student_id', student.id),
              supabase
                .from('credentials')
                .select('*', { count: 'exact', head: true })
                .eq('student_id', student.id),
            ])

            return {
              id: student.id,
              full_name: student.full_name,
              email: student.email,
              applications_count: appData.count ?? 0,
              credentials_earned: credData.count ?? 0,
              joined_at: student.created_at,
            }
          })
        )

        setStudents(studentsWithStats)
      } catch (err) {
        console.error('Dashboard error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user?.id])

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
    <div className="space-y-6 p-6">
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
              <p className="text-sm text-gray-600">Total Projects</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <p className="mt-2 text-3xl font-bold">{stats.totalProjects}</p>
              )}
            </div>
            <Briefcase className="h-12 w-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Credentials Issued</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <p className="mt-2 text-3xl font-bold">{stats.totalCredentialsIssued}</p>
              )}
            </div>
            <Award className="h-12 w-12 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Connections</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <p className="mt-2 text-3xl font-bold">{stats.activeConnections}</p>
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
                  <TableHead>Applications</TableHead>
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
                      <Badge variant="outline">{student.applications_count}</Badge>
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
