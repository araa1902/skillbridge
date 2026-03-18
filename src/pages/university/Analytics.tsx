import { useAuth } from '@/contexts/AuthContext'
import { useUniversityStats } from '@/hooks/useUniversityData'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendUp as TrendingUp, Medal as Award, Briefcase, Users, ChatCircle as MessageSquare } from "@phosphor-icons/react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { DataNotice } from '@/components/university/DataNotice'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function UniversityAnalytics() {
  const { profile } = useAuth()
  const { stats, loading, error } = useUniversityStats(profile?.id, profile?.company_name)

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
        <h1 className="text-3xl font-bold">Strategic Analytics</h1>
        <p className="text-gray-600">Institutional performance and work-integrated learning outcomes</p>
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
              <p className="text-sm text-gray-600">Enrolled Students</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{stats.totalStudents}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Verified students
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
              <p className="text-sm text-gray-600">Active Placements</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{stats.activePlacements}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Ongoing Industry Placements
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
              <p className="text-sm text-gray-600">Total Credentials Earned</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{stats.totalCredentials}</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Verified achievements
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
              <p className="text-sm text-gray-600">Credential Validity Avg.</p>
              {loading ? (
                <Skeleton className="mt-2 h-8 w-16" />
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">
                    {stats.averageCompetency.toFixed(1)} / 5.0
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Standardised competency
                  </div>
                </>
              )}
            </div>
            <MessageSquare className="h-12 w-12 text-orange-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold">Credentials Earned Over Time</h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : stats.credentialsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.credentialsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No credential data available yet
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-6 text-lg font-semibold">Placement Outcomes</h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : stats.placementsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.placementsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.placementsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No placement data available yet
              </div>
            )}
          </div>
        </Card>
      </div>
      
      <DataNotice 
        message="Institutional metrics are synthesized from verified industry partner evaluations and historical achievement data. Ratings are calculated as a mathematical mean across all completed industry placements." 
      />
    </div>
  )
}
