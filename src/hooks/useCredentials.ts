import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types'

export type CredentialRow = Database['public']['Tables']['credentials']['Row']

export interface CredentialWithDetails extends CredentialRow {
  skills: any[]
  company_name: any
  employer_name: any
  student_name?: string
  business_name?: string
  project_title?: string
}

// ─── Fetch credentials for a student ───────────────────────────────────────

export function useFetchStudentCredentials(studentId: string | null) {
  const [credentials, setCredentials] = useState<CredentialWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!studentId) {
      setCredentials([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('credentials')
      .select(`
        *,
        student:profiles!credentials_student_id_fkey (full_name),
        business:profiles!credentials_business_id_fkey (full_name, company_name),
        project:projects!credentials_project_id_fkey (title)
      `)
      .eq('student_id', studentId)
      .order('issued_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setCredentials([])
    } else {
      const rows = (data ?? []).map((row: any) => ({
        ...row,
        student_name: row.student?.full_name ?? null,
        business_name: (row.business?.company_name || row.business?.full_name) ?? null,
        project_title: row.project?.title ?? null,
        student: undefined,
        business: undefined,
        project: undefined,
      })) as CredentialWithDetails[]
      setCredentials(rows)
    }

    setLoading(false)
  }, [studentId])

  useEffect(() => {
    load()

    if (!studentId) return

    const channel = supabase
      .channel(`student_credentials_${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'credentials',
          filter: `student_id=eq.${studentId}`,
        },
        () => load()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load, studentId])

  return { credentials, loading, error, refetch: load }
}

// ─── Fetch credentials issued by an employer ───────────────────────────────

export function useFetchIssuedCredentials(businessId: string | null) {
  const [credentials, setCredentials] = useState<CredentialWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!businessId) {
      setCredentials([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('credentials')
      .select(`
        *,
        student:profiles!credentials_student_id_fkey (full_name),
        project:projects!credentials_project_id_fkey (title)
      `)
      .eq('business_id', businessId)
      .order('issued_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setCredentials([])
    } else {
      const rows = (data ?? []).map((row: any) => ({
        ...row,
        student_name: row.student?.full_name ?? null,
        project_title: row.project?.title ?? null,
        student: undefined,
        project: undefined,
      })) as CredentialWithDetails[]
      setCredentials(rows)
    }

    setLoading(false)
  }, [businessId])

  useEffect(() => {
    load()

    if (!businessId) return

    const channel = supabase
      .channel(`employer_credentials_${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'credentials',
          filter: `business_id=eq.${businessId}`,
        },
        () => load()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load, businessId])

  return { credentials, loading, error, refetch: load }
}

// ─── Issue a credential (employer action) ──────────────────────────────────

export async function issueCredential(payload: {
  student_id: string
  business_id: string
  project_id: string
  skills_verified: string[]
  feedback?: string
  rating?: number
}): Promise<{ data: CredentialRow | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('credentials')
      .insert([
        {
          student_id: payload.student_id,
          business_id: payload.business_id,
          project_id: payload.project_id,
          skills_verified: payload.skills_verified,
          feedback: payload.feedback || null,
          rating: payload.rating || null,
        },
      ])
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ─── Update credential ─────────────────────────────────────────────────────

export async function updateCredential(
  credentialId: string,
  updates: {
    skills_verified?: string[]
    feedback?: string
    rating?: number
  }
): Promise<{ data: CredentialRow | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('credentials')
      .update(updates)
      .eq('id', credentialId)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
