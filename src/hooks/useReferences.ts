import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Reference, ReferenceRequestFromDB } from '../types/index'
import type { Database } from '@/types'

export interface ReferenceFromDB {
  id: string
  student_id: string
  student_name: string
  employer_id: string
  employer_name: string
  employer_title: string
  company_name: string
  company_logo?: string
  project_id: string
  project_title: string
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
  const [averageRating, setAverageRating] = useState(0)

  const load = useCallback(async () => {
    if (!studentId) {
      setReferences([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('employer_references')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setReferences([])
      setAverageRating(0)
    } else {
      const refs = (data ?? []) as ReferenceFromDB[]
      setReferences(refs)
      if (refs.length > 0) {
        const avg = refs.reduce((sum, r) => sum + r.rating, 0) / refs.length
        setAverageRating(avg)
      } else {
        setAverageRating(0)
      }
    }

    setLoading(false)
  }, [studentId])

  useEffect(() => {
    load()
  }, [load])

  return { references, loading, error, averageRating, totalCount: references.length, refetch: load }
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
      .from('employer_references')
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
  project_id: string
  project_title: string
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
  request_id?: string
}): Promise<{ data: ReferenceFromDB | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('employer_references')
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

    if (payload.request_id) {
      const { error: reqError } = await supabase
        .from('reference_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', payload.request_id)

      if (reqError) {
        console.error('Failed to update reference request status:', reqError)
      }
    }

    // Notify Student
    await supabase.from('notifications' as any).insert({
      user_id: payload.student_id,
      type: 'reference',
      title: 'New Reference Received',
      content: `${payload.employer_name} from ${payload.company_name} has provided a reference for you!`,
      action_url: `/student/references`
    })

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
    const { data, error } = await supabase
      .from('employer_references')
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
      .from('employer_references')
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
  const [requests, setRequests] = useState<ReferenceRequestFromDB[]>([])
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

    // Fetch pending reference requests for the employer
    const { data, error: dbError } = await supabase
      .from('reference_requests')
      .select('*')
      .eq('employer_id', employerId)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setRequests([])
    } else {
      setRequests(data ?? [])
    }

    setLoading(false)
  }, [employerId])

  useEffect(() => {
    load()

    if (!employerId) return

    const channel = supabase
      .channel(`pending_requests_${employerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reference_requests',
          filter: `employer_id=eq.${employerId}`,
        },
        () => load()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load, employerId])

  return { requests, loading, error, refetch: load }
}

// ─── Fetch reference requests for a student ──────────────────────────────

export function useFetchMyReferenceRequests(studentId: string | null) {
  const [requests, setRequests] = useState<ReferenceRequestFromDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!studentId) {
      setRequests([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('reference_requests')
      .select('*')
      .eq('student_id', studentId)
      .order('requested_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setRequests([])
    } else {
      setRequests(data ?? [])
    }

    setLoading(false)
  }, [studentId])

  useEffect(() => {
    load()

    if (!studentId) return

    const channel = supabase
      .channel(`my_reference_requests_${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reference_requests',
          filter: `student_id=eq.${studentId}`,
        },
        () => load()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load, studentId])

  return { requests, loading, error, refetch: load }
}

// ─── Create a reference request ────────────────────────────────────────────

export async function createReferenceRequest(payload: {
  student_id: string
  employer_id: string
  project_id: string
  student_name: string
  project_title: string
}): Promise<{ data: ReferenceRequestFromDB | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('reference_requests')
      .insert([
        {
          student_id: payload.student_id,
          employer_id: payload.employer_id,
          project_id: payload.project_id,
          student_name: payload.student_name,
          project_title: payload.project_title,
          status: 'pending'
        },
      ])
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    await supabase.from('notifications' as any).insert({
      user_id: payload.employer_id,
      type: 'reference',
      title: 'Reference Request',
      content: `${payload.student_name} has requested a reference for ${payload.project_title}`,
      action_url: `/employer/references`
    })

    return { data, error: null }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
