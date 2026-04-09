import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types'

// ─── Aliases ───────────────────────────────────────────────────────────────

export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']

// Extended row that joins the business profile name for display
export interface ProjectWithBusiness extends ProjectRow {
  business_name: string | null
  company_name: string | null
  project_documents_url: string | null
  is_verified: boolean
}

// ─── Fetch all OPEN projects (Browse Projects page) ─────────────────────────

export function useFetchOpenProjects() {
  const [projects, setProjects] = useState<ProjectWithBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('projects')
      .select(`
        *,
        profiles!projects_business_id_fkey (
          full_name,
          company_name,
          is_verified
        )
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setProjects([])
    } else {
      // Flatten joined profile into top-level fields
      const rows = (data ?? []).map((row: any) => ({
        ...row,
        business_name: row.profiles?.full_name ?? null,
        company_name: row.profiles?.company_name ?? null,
        is_verified: row.profiles?.is_verified ?? false,
        profiles: undefined,
      })) as ProjectWithBusiness[]
      setProjects(rows)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    load()

    const channel = supabase
      .channel('public_open_projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: 'status=eq.open',
        },
        () => {
          load()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  return { projects, loading, error, refetch: load }
}

// ─── Fetch projects owned by the logged-in business ─────────────────────────

export interface ProjectWithStats extends ProjectRow {
  application_count: number;
}

export function useMyProjects(businessId: string | null) {
  const [projects, setProjects] = useState<ProjectWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!businessId) {
      setProjects([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('projects')
      .select('*, applications(id)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setProjects([])
    } else {
      const rows = (data ?? []).map((row: any) => ({
        ...row,
        application_count: row.applications?.length ?? 0,
        applications: undefined,
      })) as ProjectWithStats[]
      setProjects(rows)
    }

    setLoading(false)
  }, [businessId])

  useEffect(() => {
    load()

    if (!businessId) return

    // Listen for changes to projects owned by this business
    const projectChannel = supabase
      .channel(`my_projects_${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `business_id=eq.${businessId}`,
        },
        () => {
          load()
        }
      )
      .subscribe()

    // Also listen for new applications to update the count
    const applicationChannel = supabase
      .channel(`my_projects_apps_${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
        },
        () => {
          // We can't easily filter applications by business_id in postgres_changes 
          // (since business_id is in the projects table). 
          // So we'll refetch on any application change if it's an employer.
          load()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(projectChannel)
      supabase.removeChannel(applicationChannel)
    }
  }, [load, businessId])

  return { projects, loading, error, refetch: load }
}

// ─── Aggregate stats for an employer dashboard ───────────────────────────────

export interface EmployerStats {
  activeProjects: number
  completedProjects: number
  totalApplicants: number
  averageTurnaroundHours: number | null
  loading: boolean
}

export function useEmployerStats(businessId: string | null): EmployerStats {
  const [stats, setStats] = useState<EmployerStats>({
    activeProjects: 0,
    completedProjects: 0,
    totalApplicants: 0,
    averageTurnaroundHours: null,
    loading: true,
  })

  const load = useCallback(async () => {
    if (!businessId) {
      setStats(s => ({ ...s, loading: false }))
      return
    }

    // 1. Fetch project IDs + status for this employer
    const { data: projData, error: projError } = await supabase
      .from('projects')
      .select('id, status')
      .eq('business_id', businessId) as unknown as {
        data: { id: string; status: string }[] | null
        error: { message: string } | null
      }

    if (projError || !projData) {
      setStats(s => ({ ...s, loading: false }))
      return
    }

    const active = projData.filter(p =>
      p.status === 'open' || p.status === 'in_progress'
    ).length
    const completed = projData.filter(p => p.status === 'completed').length
    const projectIds = projData.map(p => p.id)

    // 2. Count all applications for these projects & compute turnaround
    let totalApplicants = 0
    let avgTurnaround: number | null = null

    if (projectIds.length > 0) {
      const { data: apps, error: appErr } = await supabase
        .from('applications')
        .select('status, created_at, updated_at')
        .in('project_id', projectIds)

      if (!appErr && apps) {
        totalApplicants = apps.length

        const reviewedApps = apps.filter(a =>
          a.status !== 'pending' && a.status !== 'withdrawn' &&
          new Date(a.updated_at).getTime() > new Date(a.created_at).getTime()
        )

        if (reviewedApps.length > 0) {
          const totalHours = reviewedApps.reduce((sum, a) => {
            const diffMs = new Date(a.updated_at).getTime() - new Date(a.created_at).getTime()
            return sum + (diffMs / (1000 * 60 * 60))
          }, 0)
          avgTurnaround = Math.round(totalHours / reviewedApps.length)
        }
      }
    }

    setStats({
      activeProjects: active,
      completedProjects: completed,
      totalApplicants,
      averageTurnaroundHours: avgTurnaround,
      loading: false,
    })
  }, [businessId])

  useEffect(() => {
    load()

    if (!businessId) return

    const projectsChannel = supabase
      .channel(`employer_stats_projects_${businessId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `business_id=eq.${businessId}` },
        () => load()
      )
      .subscribe()

    const appsChannel = supabase
      .channel(`employer_stats_apps_${businessId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        () => load()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(projectsChannel)
      supabase.removeChannel(appsChannel)
    }
  }, [load, businessId])

  return stats
}

// ─── Insert a new project ─────────────────────────────────────────────────────

export async function insertProject(
  payload: ProjectInsert
): Promise<{ data: ProjectRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('projects')
    .insert(payload)
    .select()
    .single()

  if (error) return { data: null, error: (error as any).message ?? String(error) }
  return { data: data as ProjectRow, error: null }
}
// ─── Update an existing project ────────────────────────────────────────────────
export async function updateProject(
  id: string,
  payload: Partial<ProjectInsert>
): Promise<{ data: ProjectRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: (error as any).message ?? String(error) }
  return { data: data as ProjectRow, error: null }
}

// ─── Delete a project ─────────────────────────────────────────────────────────
export async function deleteProject(
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) return { error: (error as any).message ?? String(error) }
  return { error: null }
}

// ─── Aggregate stats for a student dashboard ──────────────────────────────
export interface StudentStats {
  totalEarnings: number
  thisMonthEarnings: number
  loading: boolean
}

export function useStudentStats(studentId: string | null): StudentStats {
  const [stats, setStats] = useState<StudentStats>({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    loading: true,
  })

  const load = useCallback(async () => {
    if (!studentId) {
      setStats(s => ({ ...s, loading: false }))
      return
    }

    // Fetch all completed applications for this student with project budgets
    const { data, error } = await supabase
      .from('applications')
      .select(`
        status,
        updated_at,
        projects!applications_project_id_fkey ( budget )
      `)
      .eq('student_id', studentId)
      .eq('status', 'completed')

    if (error || !data) {
      setStats(s => ({ ...s, loading: false }))
      return
    }

    const total = data.reduce((sum, app: any) => sum + (Number(app.projects?.budget) || 0), 0)

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonth = data
      .filter((app: any) => new Date(app.updated_at) >= startOfMonth)
      .reduce((sum, app: any) => sum + (Number(app.projects?.budget) || 0), 0)

    setStats({
      totalEarnings: total,
      thisMonthEarnings: thisMonth,
      loading: false,
    })
  }, [studentId])

  useEffect(() => {
    load()

    if (!studentId) return

    const channel = supabase
      .channel(`student_stats_${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `student_id=eq.${studentId}`,
        },
        () => load()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load, studentId])

  return stats
}

// ─── Fetch a single project by ID ──────────────────────────────────────────
export function useFetchProject(projectId: string | null) {
  const [project, setProject] = useState<ProjectRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!projectId) {
      setProject(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('projects')
      .select(`
        *,
        profiles!projects_business_id_fkey (
          full_name,
          company_name,
          is_verified
        )
      `)
      .eq('id', projectId)
      .single()

    if (dbError) {
      setError(dbError.message)
      setProject(null)
    } else {
      const row = data as any;
      setProject({
        ...row,
        business_name: row.profiles?.full_name ?? null,
        company_name: row.profiles?.company_name ?? null,
        is_verified: row.profiles?.is_verified ?? false,
      } as any)
    }

    setLoading(false)
  }, [projectId])

  useEffect(() => {
    load()

    if (!projectId) return

    const channel = supabase
      .channel(`project_details_${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`,
        },
        () => load()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load, projectId])

  return { project, loading, error, refetch: load }
}

