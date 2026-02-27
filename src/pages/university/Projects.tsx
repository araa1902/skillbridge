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
import { Briefcase } from "@phosphor-icons/react"

interface ProjectRecord {
  id: string
  title: string
  business_name: string
  status: string
  applications_count: number
  created_at: string
}

export default function UniversityProjects() {
  const { profile } = useAuth()
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get all projects with business info
        const { data: projectList, error: projectError } = await supabase
          .from('projects')
          .select(
            `
            id,
            title,
            status,
            created_at,
            business:profiles!projects_business_id_fkey (full_name, company_name)
          `
          )
          .order('created_at', { ascending: false })

        if (projectError) throw projectError

        // Fetch application count for each project
        const projectsWithStats = await Promise.all(
          (projectList ?? []).map(async (project: any) => {
            const { count, error: appError } = await supabase
              .from('applications')
              .select('*', { count: 'exact', head: true })
              .eq('project_id', project.id)

            if (appError) console.error('Error fetching applications:', appError)

            return {
              id: project.id,
              title: project.title,
              business_name: project.business?.company_name || project.business?.full_name || 'Unknown',
              status: project.status,
              applications_count: count ?? 0,
              created_at: project.created_at,
            }
          })
        )

        setProjects(projectsWithStats)
      } catch (err) {
        console.error('Error loading projects:', err)
        setError(err instanceof Error ? err.message : 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
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
      <div className="flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600">All projects posted on the platform</p>
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
                      <Badge
                        variant={project.status === 'open' ? 'default' : 'secondary'}
                      >
                        {project.status}
                      </Badge>
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
      </Card>
    </div>
  )
}
