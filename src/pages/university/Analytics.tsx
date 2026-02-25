import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, Award, Briefcase, Users } from 'lucide-react'

interface Analytics {
  studentGrowth: number
  projectGrowth: number
  credentialGrowth: number
  applicationGrowth: number
}

export default function UniversityAnalytics() {
  const { profile } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics>({
    studentGrowth: 0,
    projectGrowth: 0,
    credentialGrowth: 0,
    applicationGrowth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current stats
        const [studentCount, projectCount, credentialCount, applicationCount] =
          await Promise.all([
            supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .eq('role', 'student'),
            supabase
              .from('projects')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('credentials')
              .select('*', { count: 'exact', head: true }),
            supabase
              .from('applications')
              .select('*', { count: 'exact', head: true }),
          ])

        // For now, calculate growth as percentage of total
        // In a real app, you'd track historical data
        const totalEntities =
          (studentCount.count ?? 0) +
          (projectCount.count ?? 0) +
          (credentialCount.count ?? 0)

        setAnalytics({
          studentGrowth: totalEntities > 0 ? Math.round(((studentCount.count ?? 0) / totalEntities) * 100) : 0,
          projectGrowth: totalEntities > 0 ? Math.round(((projectCount.count ?? 0) / totalEntities) * 100) : 0,
          credentialGrowth: totalEntities > 0 ? Math.round(((credentialCount.count ?? 0) / totalEntities) * 100) : 0,
          applicationGrowth: applicationCount.count ?? 0,
        })
      } catch (err) {
        console.error('Error loading analytics:', err)
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
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
    <div className="space-y-6 p-6">
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
              <p className="text-sm text-gray-600">Student Activity</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{analytics.studentGrowth}%</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Platform share
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
              <p className="text-sm text-gray-600">Project Activity</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{analytics.projectGrowth}%</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Platform share
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
              <p className="text-sm text-gray-600">Credential Share</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{analytics.credentialGrowth}%</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Platform share
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
              <p className="text-sm text-gray-600">Total Applications</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">
                    {analytics.applicationGrowth}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Active applications
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
