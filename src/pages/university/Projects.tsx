import { useAuth } from '@/contexts/AuthContext'
import { useUniversityProjects } from '@/hooks/useUniversityData'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Briefcase } from "@phosphor-icons/react"
import { DataNotice } from '@/components/university/DataNotice'

interface ProjectRecord {
  id: string
  title: string
  business_name: string
  status: string
  applications_count: number
  created_at: string
}

const getStatusBadgeStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return {
        label: 'Active',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
      }
    case 'in_progress':
      return {
        label: 'In Progress',
        className: 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
      }
    case 'completed':
      return {
        label: 'Completed',
        className: 'border-primary/20 bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary-light dark:border-primary/20'
      }
    case 'cancelled':
    case 'closed':
      return {
        label: 'Closed',
        className: 'border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
      }
    default:
      return {
        label: (status || 'Unknown').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        className: 'border-gray-200 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
      }
  }
}

export default function UniversityProjects() {
  const { profile } = useAuth()
  const { projects, loading, error } = useUniversityProjects(profile?.id, profile?.company_name)

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
        <Briefcase className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Industry Placements</h1>
          <p className="text-gray-600">Placements your students are participating in or have applied to</p>
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
        ) : projects.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No projects yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.business_name}</TableCell>
                    <TableCell>
                      {(() => {
                        const { label, className } = getStatusBadgeStyles(project.status)
                        return (
                          <Badge variant="outline" className={`${className} font-medium`}>
                            {label}
                          </Badge>
                        )
                      })()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.applications_count}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="p-4 border-t">
          <DataNotice message="This list is filtered to display only industry placements associated with students from your institution." />
        </div>
      </Card>
    </div>
  )
}
