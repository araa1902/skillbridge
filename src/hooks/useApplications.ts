import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types'

// ─── Aliases ─────────────────────────────────────────────────────────────────

export type ApplicationRow = Database['public']['Tables']['applications']['Row']
export type ApplicationStatus = Database['public']['Tables']['applications']['Row']['status']

// ─── Extended row that joins project title + student name ────────────────────

export interface ApplicationWithDetails extends ApplicationRow {
  project_title: string | null
  student_name: string | null
  student_avatar: string | null
  company_name: string | null   // for student-side display
  business_name: string | null  // fallback
  business_id: string | null    // for messaging
}

// ─── Insert a new application (student "Apply" button) ───────────────────────

export async function insertApplication(payload: {
  project_id: string
  student_id: string
  cover_letter: string
}): Promise<{ data: ApplicationRow | null; error: string | null }> {
  const { data, error } = await (supabase
    .from('applications') as any)
    .insert(payload)
    .select()
    .single()

  if (error) return { data: null, error: (error as any).message ?? String(error) }
  return { data: data as ApplicationRow, error: null }
}

// ─── Update application status (employer accept / reject, student withdraw) ──

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<{ error: string | null }> {
  const { error } = await (supabase
    .from('applications') as any)
    .update({ status })
    .eq('id', applicationId)

  if (error) return { error: (error as any).message ?? String(error) }
  return { error: null }
}

// ─── Student: fetch own applications (joined with project + business profile) ─

export function useFetchMyApplications(studentId: string | null) {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!studentId) {
      setApplications([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('applications')
      .select(`
        *,
        projects!applications_project_id_fkey (
          title,
          business_id,
          profiles!projects_business_id_fkey (
            full_name,
            company_name
          )
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setApplications([])
    } else {
      const rows = (data ?? []).map((row: any) => ({
        ...row,
        project_title: row.projects?.title ?? null,
        company_name: row.projects?.profiles?.company_name ?? null,
        business_name: row.projects?.profiles?.full_name ?? null,
        business_id: row.projects?.business_id ?? null,
        student_name: null,
        student_avatar: null,
        projects: undefined,
      })) as ApplicationWithDetails[]
      setApplications(rows)
    }
    setLoading(false)
  }, [studentId])

  useEffect(() => { load() }, [load])

  return { applications, loading, error, refetch: load }
}

// ─── Employer: fetch applications for all their projects ─────────────────────

export function useFetchProjectApplications(businessId: string | null) {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!businessId) {
      setApplications([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    // First, get all project IDs owned by this employer
    const { data: projData, error: projError } = await (supabase
      .from('projects') as any)
      .select('id')
      .eq('business_id', businessId) as unknown as {
        data: { id: string }[] | null
        error: { message: string } | null
      }

    if (projError || !projData || projData.length === 0) {
      if (projError) setError(projError.message)
      setApplications([])
      setLoading(false)
      return
    }

    const projectIds = projData.map((p) => p.id)

    // Then fetch applications joined with student profile + project title
    const { data, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        projects!applications_project_id_fkey ( title ),
        profiles!applications_student_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .in('project_id', projectIds)
      .order('created_at', { ascending: false })

    if (appError) {
      setError(appError.message)
      setApplications([])
    } else {
      const rows = (data ?? []).map((row: any) => ({
        ...row,
        project_title: row.projects?.title ?? null,
        student_name: row.profiles?.full_name ?? null,
        student_avatar: row.profiles?.avatar_url ?? null,
        company_name: null,
        business_name: null,
        projects: undefined,
        profiles: undefined,
      })) as ApplicationWithDetails[]
      setApplications(rows)
    }
    setLoading(false)
  }, [businessId])

  useEffect(() => { load() }, [load])

  return { applications, loading, error, refetch: load }
}
