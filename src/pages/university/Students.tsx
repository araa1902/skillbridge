import { useState, useEffect } from 'react'
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
import { Users } from "@phosphor-icons/react"

interface StudentRecord {
  id: string
  full_name: string
  applications_count: number
  credentials_earned: number
  joined_at: string
  active_placements: number
  total_earnings: number
}

export default function UniversityStudents() {
  const { profile } = useAuth()
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get all students
        let query = supabase
          .from('profiles')
          .select('id, full_name, created_at')
          .eq('role', 'student')

        if (profile?.company_name) {
          query = query.or(`university_id.eq.${profile.id},company_name.eq."${profile.company_name.replace(/"/g, '')}"`)
        } else {
          query = query.eq('university_id', profile?.id || '')
        }

        const { data: studentList, error: studentError } = await query
          .order('created_at', { ascending: false })

        if (studentError) throw studentError

        // Fetch stats for each student
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

            // Calculate total earnings
            const acceptedApps = (appData.data || []).filter((a: any) => a.status === 'accepted')
            let totalEarnings = 0

            if (acceptedApps.length > 0) {
              const projectIds = acceptedApps.map((a: any) => a.project_id)
              const { data: projectsData } = await supabase
                .from('projects')
                .select('budget')
                .in('id', projectIds)

              totalEarnings = (projectsData || []).reduce((sum: number, p: any) => sum + (Number(p.budget) || 0), 0)
            }

            return {
              id: student.id,
              full_name: student.full_name,
              applications_count: appData.count ?? 0,
              credentials_earned: credData.count ?? 0,
              joined_at: student.created_at,
              active_placements: acceptedApps.length,
              total_earnings: totalEarnings,
            }
          })
        )

        setStudents(studentsWithStats)
      } catch (err) {
        console.error('Error loading students:', err)
        setError(err instanceof Error ? err.message : 'Failed to load students')
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

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
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-gray-600">Track all registered students and their progress</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <Card>
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
                  <TableHead>Active Placements</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Credentials Earned</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.full_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.active_placements}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-green-700">
                      ${student.total_earnings.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
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
