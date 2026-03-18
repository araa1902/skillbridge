import { useAuth } from '@/contexts/AuthContext'
import { useUniversityStudents } from '@/hooks/useUniversityData'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StudentRosterTable } from '@/components/university/StudentRosterTable'
import { Users } from "@phosphor-icons/react"

interface StudentRecord {
  id: string
  full_name: string
  applications_count: number
  credentials_earned: number
  joined_at: string
  active_placements: number
}


export default function UniversityStudents() {
  const { profile } = useAuth()
  const { students, loading, error } = useUniversityStudents(profile?.id, profile?.company_name)

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
          <h1 className="text-3xl font-bold">Institutional Roster</h1>
          <p className="text-gray-600">Manage and oversee all students enrolled through your institution</p>
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
          <StudentRosterTable students={students} />
        )}
      </Card>
    </div>
  )
}
