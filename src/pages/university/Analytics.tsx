import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendUp as TrendingUp, Medal as Award, Briefcase, Users } from "@phosphor-icons/react"

interface Analytics {
  totalStudents: number
  totalApplications: number
  totalCredentials: number
  completionRate: number
}

export default function UniversityAnalytics() {
  const { profile } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics>({
    totalStudents: 0,
    totalApplications: 0,
    totalCredentials: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!profile?.id) {
          setLoading(false)
          return
        }

        // Get university students
        let studentsQuery = supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'student')
          .eq('university_id', profile.id)

        const { count: studentCount, data: studentIds, error: studentError } = await studentsQuery

        if (studentError) throw studentError

        // Get all students for filtering
        const { data: allStudents } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'student')
          .eq('university_id', profile.id)

        const studentIdList = allStudents?.map(s => s.id) || []

        let totalApplications = 0
        let totalCredentials = 0
        let completedApplications = 0

        if (studentIdList.length > 0) {
          // Get total applications
          const { count: appCount } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .in('student_id', studentIdList)

          totalApplications = appCount ?? 0

          // Get completed applications (accepted status)
          const { count: completedCount } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .in('student_id', studentIdList)
            .eq('status', 'accepted')

          completedApplications = completedCount ?? 0

          // Get total credentials issued
          const { count: credCount } = await supabase
            .from('credentials')
            .select('*', { count: 'exact', head: true })
            .in('student_id', studentIdList)

          totalCredentials = credCount ?? 0
        }

        // Calculate completion rate
        const completionRate = totalApplications > 0 
          ? Math.round((completedApplications / totalApplications) * 100)
          : 0

        setAnalytics({
          totalStudents: studentCount ?? 0,
          totalApplications,
          totalCredentials,
          completionRate,
        })
      } catch (err) {
        console.error('Error loading analytics:', err)
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [profile?.id])

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
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600">Platform performance and growth metrics</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{analytics.totalStudents}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Registered students
                  </div>
                </>
              )}
            </div>
            <Users className="h-12 w-12 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{analytics.totalApplications}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Submitted applications
                  </div>
                </>
              )}
            </div>
            <Briefcase className="h-12 w-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Credentials</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{analytics.totalCredentials}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Credentials issued
                  </div>
                </>
              )}
            </div>
            <Award className="h-12 w-12 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">
                    {analytics.completionRate}%
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Applications accepted
                  </div>
                </>
              )}
            </div>
            <TrendingUp className="h-12 w-12 text-orange-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Advanced Metrics</h2>
        <p className="text-gray-600">
          More detailed analytics, historical trends, and custom reports coming soon.
        </p>
      </Card>
    </div>
  )
}
