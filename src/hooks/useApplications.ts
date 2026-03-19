import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types'

// ─── Aliases ─────────────────────────────────────────────────────────────────

export type ApplicationRow = Database['public']['Tables']['applications']['Row']
export type ApplicationStatus = Database['public']['Tables']['applications']['Row']['status']

// ─── Extended row that joins project title + student name ────────────────────

export interface ApplicationWithDetails extends ApplicationRow {
  project_title: string | null
  project_budget: number | null
  student_name: string | null
  student_avatar: string | null
  company_name: string | null   // for student-side display
  business_name: string | null  // fallback
  business_id: string | null    // for messaging
  project_documents_url: string | null // resources linked for the project
  cv_url: string | null
  cv_name: string | null
}

// ─── Insert a new application (student "Apply" button) ───────────────────────

export async function insertApplication(payload: {
  project_id: string
  student_id: string
  cover_letter: string
  cv_url?: string
  cv_name?: string
}): Promise<{ data: ApplicationRow | null; error: string | null }> {
  // Check if an application already exists for this student and project
  const { data: existingApp, error: checkError } = await supabase
    .from('applications')
    .select('id')
    .eq('project_id', payload.project_id)
    .eq('student_id', payload.student_id)
    .single()

  if (existingApp) {
    return { data: null, error: 'You have already applied for this project.' }
  }

  const { data, error } = await supabase
    .from('applications')
    .insert(payload)
    .select()
    .single()

  if (error) return { data: null, error: (error as any).message ?? String(error) }

  // Notify the employer
  const { data: projectData } = await supabase
    .from('projects')
    .select('business_id, title')
    .eq('id', payload.project_id)
    .single();

  if (projectData && projectData.business_id) {
    await supabase.from('notifications' as any).insert({
      user_id: projectData.business_id,
      type: 'application',
      title: 'New Application',
      content: `A student has applied for your project: ${projectData.title}`,
      action_url: `/employer/applications`
    });
  }

  return { data: data as ApplicationRow, error: null }
}

// ─── Update application status (employer accept / reject, student withdraw) ──

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  projectId?: string
): Promise<{ error: string | null }> {
  // If we are accepting an application, verify the project is still open
  if (status === 'accepted' && projectId) {
    const { data: projectData, error: projCheckErr } = await supabase
      .from('projects')
      .select('status')
      .eq('id', projectId)
      .single()

    if (projCheckErr) return { error: 'Failed to verify project status' }
    if (projectData.status !== 'open') {
      return { error: 'This project is already in progress or closed.' }
    }
  }

  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)

  if (error) return { error: (error as any).message ?? String(error) }

  if (status === 'accepted' && projectId) {
    // 1. Mark project as in_progress and payment as held
    await supabase
      .from('projects')
      .update({ status: 'in_progress', payment_status: 'held_in_escrow' })
      .eq('id', projectId)

    // 2. Reject all other pending and reviewing applications for this project
    await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('project_id', projectId)
      .neq('id', applicationId)
      .in('status', ['pending', 'reviewing'])
  }

  // If a student withdraws an accepted application, we should act as if employer cancelled
  if (status === 'withdrawn' && projectId) {
    await supabase
      .from('projects')
      .update({ status: 'open', payment_status: 'refunded' })
      .eq('id', projectId)
  }

  // Send notification to the student if accepted or rejected
  if (status === 'accepted' || status === 'rejected') {
    const { data: appData } = await supabase
      .from('applications')
      .select('student_id, projects(title)')
      .eq('id', applicationId)
      .single();

    if (appData) {
      const projectTitle = (appData as any).projects?.title || 'a project';
      // Mute the typescript error with 'any' since our types aren't fully regenerated
      await supabase.from('notifications' as any).insert({
        user_id: appData.student_id,
        type: 'application',
        title: `Application ${status === 'accepted' ? 'Accepted 🎉' : 'Update'}`,
        content: `Your application for ${projectTitle} was ${status}.`,
        action_url: `/student/applications`
      });
    }
  }

  return { error: null }
}

// ─── Cancel Accepted Application (Employer side) ──────────────────────────────

export async function cancelAcceptedApplication(
  applicationId: string,
  projectId: string
): Promise<{ error: string | null }> {
  // 1. Mark application as rejected
  const { error: appErr } = await supabase
    .from('applications')
    .update({ status: 'rejected' })
    .eq('id', applicationId)

  if (appErr) return { error: appErr.message }

  // 2. Mark project as open and payment as refunded
  const { error: projErr } = await supabase
    .from('projects')
    .update({ status: 'open', payment_status: 'refunded' })
    .eq('id', projectId)

  if (projErr) return { error: projErr.message }

  return { error: null }
}

// ─── Update deliverable link (student submission) ────────────────────────────

export async function updateDeliverableLink(
  applicationId: string,
  deliverableLink: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('applications')
    .update({ deliverable_link: deliverableLink })
    .eq('id', applicationId)

  if (error) return { error: (error as any).message ?? String(error) }
  return { error: null }
}

// ─── Employer: Approve deliverable & issue credential ──────────────────────

export async function approveApplicationAndIssueCredential(payload: {
  application_id: string
  project_id: string
  student_id: string
  business_id: string
  rating: number
  feedback: string
  skills_verified: string[]
}): Promise<{ error: string | null }> {
  // 1. Mark application as completed
  const { error: appErr } = await supabase
    .from('applications')
    .update({ status: 'completed' })
    .eq('id', payload.application_id)
  if (appErr) return { error: appErr.message }

  // 2. Mark project as completed + payment released
  const { error: projErr } = await supabase
    .from('projects')
    .update({ status: 'completed', payment_status: 'released' })
    .eq('id', payload.project_id)
  if (projErr) return { error: projErr.message }

  // 3. Issue credential
  const { error: credErr } = await supabase
    .from('credentials')
    .insert({
      student_id: payload.student_id,
      business_id: payload.business_id,
      project_id: payload.project_id,
      rating: payload.rating,
      feedback: payload.feedback,
      skills_verified: payload.skills_verified,
    })
  if (credErr) return { error: credErr.message }

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
          project_documents_url,
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
      const rows = (data ?? [])
        .filter((row: any) => row.projects !== null)
        .map((row: any) => ({
          ...row,
          project_title: row.projects?.title ?? null,
          company_name: row.projects?.profiles?.company_name ?? null,
          business_name: row.projects?.profiles?.full_name ?? null,
          business_id: row.projects?.business_id ?? null,
          project_documents_url: row.projects?.project_documents_url ?? null,
          student_name: null,
          student_avatar: null,
          projects: undefined,
        })) as ApplicationWithDetails[]
      setApplications(rows)
    }
    setLoading(false)
  }, [studentId])

  useEffect(() => {
    load()

    if (!studentId) return

    const channel = supabase
      .channel(`my_applications_${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `student_id=eq.${studentId}`,
        },
        () => {
          load()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load, studentId])

  return { applications, loading, error, refetch: load }
}

// ─── Employer: fetch applications for all their projects ─────────────────────

export function useFetchProjectApplications(businessId: string | null, projectId?: string) {
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

    // First, get project IDs owned by this employer
    let projQuery = supabase
      .from('projects')
      .select('id')
      .eq('business_id', businessId)

    if (projectId) {
      projQuery = projQuery.eq('id', projectId)
    }

    const { data: projData, error: projError } = await projQuery

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
        projects!applications_project_id_fkey ( title, budget ),
        profiles!applications_student_id_fkey (
          full_name
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
        project_budget: row.projects?.budget ?? null,
        student_name: row.profiles?.full_name ?? null,
        business_id: businessId,
        company_name: null,
        business_name: null,
        projects: undefined,
        profiles: undefined,
      })) as ApplicationWithDetails[]
      setApplications(rows)
    }
    setLoading(false)
  }, [businessId, projectId])

  useEffect(() => {
    load()

    if (!businessId) return

    const channel = supabase
      .channel(`employer_applications_${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
        },
        () => {
          load()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load, businessId])

  return { applications, loading, error, refetch: load }
}
