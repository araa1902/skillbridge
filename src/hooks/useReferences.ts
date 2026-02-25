import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Reference } from '@/types/reference'

export interface ReferenceFromDB {
  id: string
  student_id: string
  student_name: string
  employer_id: string
  employer_name: string
  employer_title: string
  company_name: string
  company_logo?: string
  project_id: string | null
  project_title: string | null
  rating: number
  skills: string[]
  strengths: string[]
  areas_for_improvement: string[]
  overall_feedback: string
  work_quality: number
  communication: number
  professionalism: number
  technical_skills: number
  would_work_again: boolean
  is_public: boolean
  verified_by_platform: boolean
  created_at: string
  updated_at?: string
}

// ─── Fetch references for a student ────────────────────────────────────────

export function useFetchStudentReferences(studentId: string | null) {
  const [references, setReferences] = useState<ReferenceFromDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!studentId) {
      setReferences([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('references')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setReferences([])
    } else {
      setReferences((data ?? []) as ReferenceFromDB[])
    }

    setLoading(false)
  }, [studentId])

  useEffect(() => {
    load()
  }, [load])

  return { references, loading, error, refetch: load }
}

// ─── Fetch references written by a user ────────────────────────────────────

export function useFetchWrittenReferences(employerId: string | null) {
  const [references, setReferences] = useState<ReferenceFromDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!employerId) {
      setReferences([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('references')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setReferences([])
    } else {
      setReferences((data ?? []) as ReferenceFromDB[])
    }

    setLoading(false)
  }, [employerId])

  useEffect(() => {
    load()
  }, [load])

  return { references, loading, error, refetch: load }
}

// ─── Write a reference ─────────────────────────────────────────────────────

export async function writeReference(payload: {
  student_id: string
  student_name: string
  employer_id: string
  employer_name: string
  employer_title: string
  company_name: string
  company_logo?: string
  project_id: string | null
  project_title: string | null
  rating: number
  skills: string[]
  strengths: string[]
  areas_for_improvement: string[]
  overall_feedback: string
  work_quality: number
  communication: number
  professionalism: number
  technical_skills: number
  would_work_again: boolean
  is_public: boolean
}): Promise<{ data: ReferenceFromDB | null; error: string | null }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase
      .from('references') as any)
      .insert([
        {
          student_id: payload.student_id,
          student_name: payload.student_name,
          employer_id: payload.employer_id,
          employer_name: payload.employer_name,
          employer_title: payload.employer_title,
          company_name: payload.company_name,
          company_logo: payload.company_logo || null,
          project_id: payload.project_id,
          project_title: payload.project_title,
          rating: payload.rating,
          skills: payload.skills,
          strengths: payload.strengths,
          areas_for_improvement: payload.areas_for_improvement,
          overall_feedback: payload.overall_feedback,
          work_quality: payload.work_quality,
          communication: payload.communication,
          professionalism: payload.professionalism,
          technical_skills: payload.technical_skills,
          would_work_again: payload.would_work_again,
          is_public: payload.is_public,
          verified_by_platform: false,
        },
      ])
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data as ReferenceFromDB, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ─── Update reference ─────────────────────────────────────────────────────

export async function updateReference(
  referenceId: string,
  updates: {
    overall_feedback?: string
    rating?: number
    work_quality?: number
    communication?: number
    professionalism?: number
    technical_skills?: number
    strengths?: string[]
    areas_for_improvement?: string[]
    is_public?: boolean
  }
): Promise<{ data: ReferenceFromDB | null; error: string | null }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase
      .from('references') as any)
      .update(updates)
      .eq('id', referenceId)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data as ReferenceFromDB, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ─── Delete reference ─────────────────────────────────────────────────────

export async function deleteReference(
  referenceId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('references')
      .delete()
      .eq('id', referenceId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ─── Fetch pending reference requests for an employer ──────────────────────

export function useFetchPendingRequests(employerId: string | null) {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!employerId) {
      setRequests([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Fetch applications where employer wrote the offer and no reference exists yet
    const { data, error: dbError } = await supabase
      .from('applications')
      .select(`
        id,
        project:projects (id, title),
        student:profiles!student_id (id, full_name)
      `)
      .eq('projects.employer_id', employerId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setRequests([])
    } else {
      // Filter out applications that already have references
      const applicationsData = (data ?? []) as any[]

      // Transform the data to a flatter structure for the UI
      const formattedRequests = applicationsData.map(app => ({
        id: app.id,
        project_id: app.project?.id || null,
        project_title: app.project?.title || "Unknown Project",
        student_id: app.student?.id,
        student_name: app.student?.full_name || "Unknown Student"
      }))

      setRequests(formattedRequests)
    }

    setLoading(false)
  }, [employerId])

  useEffect(() => {
    load()
  }, [load])

  return { requests, loading, error, refetch: load }
}
