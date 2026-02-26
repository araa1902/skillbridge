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
          company_name
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
        profiles: undefined,
      })) as ProjectWithBusiness[]
      setProjects(rows)
    }

    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { projects, loading, error, refetch: load }
}

// ─── Fetch projects owned by the logged-in business ─────────────────────────

export function useMyProjects(businessId: string | null) {
  const [projects, setProjects] = useState<ProjectRow[]>([])
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
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setProjects([])
    } else {
      setProjects(data ?? [])
    }

    setLoading(false)
  }, [businessId])

  useEffect(() => { load() }, [load])

  return { projects, loading, error, refetch: load }
}

// ─── Aggregate stats for an employer dashboard ───────────────────────────────

export interface EmployerStats {
  activeProjects: number
  completedProjects: number
  totalApplicants: number
  loading: boolean
}

export function useEmployerStats(businessId: string | null): EmployerStats {
  const [stats, setStats] = useState<EmployerStats>({
    activeProjects: 0,
    completedProjects: 0,
    totalApplicants: 0,
    loading: true,
  })

  useEffect(() => {
    if (!businessId) {
      setStats(s => ({ ...s, loading: false }))
      return
    }

    const run = async () => {
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

      // 2. Count all applications for these projects
      let totalApplicants = 0
      if (projectIds.length > 0) {
        const { count } = await supabase
          .from('applications')
          .select('id', { count: 'exact', head: true })
          .in('project_id', projectIds)

        totalApplicants = count ?? 0
      }

      setStats({
        activeProjects: active,
        completedProjects: completed,
        totalApplicants,
        loading: false,
      })
    }

    run()
  }, [businessId])

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
