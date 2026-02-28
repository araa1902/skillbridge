import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface Message {
  id: string
  project_id: string
  sender_id: string
  sender_name?: string
  sender_avatar?: string
  content: string
  created_at: string
  read: boolean
}

export interface MessageThread {
  updated_at: string | number | Date
  id: string
  other_user_name?: string
  project_id: string
  project_title?: string
  last_message?: string
  last_message_at?: string
  unread_count: number
}

// ─── Fetch messages for a project ──────────────────────────────────────────

export function useFetchProjectMessages(projectId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useCallback(() => {
    if (!projectId) return null
    return supabase.channel(`project:${projectId}:messages`)
  }, [projectId])

  const load = useCallback(async () => {
    if (!projectId) {
      setMessages([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: dbError } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey (full_name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (dbError) {
      setError(dbError.message)
      setMessages([])
    } else {
      const rows = (data ?? []).map((row: any) => ({
        ...row,
        sender_name: row.sender?.full_name ?? 'Unknown',
      })) as Message[]
      setMessages(rows)
    }

    setLoading(false)
  }, [projectId])

  useEffect(() => {
    load()
  }, [load])

  // Real-time subscription
  useEffect(() => {
    if (!projectId) return

    const channel = supabase
      .channel(`project:${projectId}:messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`,
        },
        (payload: any) => {
          const newRow = payload.new as any
          setMessages((prev) => {
            // Prevent duplicate if message already exists (e.g. from optimistic update or refetch)
            if (prev.some(m => m.id === newRow.id)) return prev

            const newMessage: Message = {
              ...newRow,
              sender_name: '...', // Fallback since real-time payload lacks joined data
              sender_avatar: null,
            }
            return [...prev, newMessage]
          })

          // Trigger a load to fetch the missing joined names/avatars
          load()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [projectId])

  return { messages, loading, error, refetch: load }
}

// ─── Fetch message threads for user ────────────────────────────────────────

export function useFetchMessageThreads(userId: string | null) {
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!userId) {
      setThreads([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // Get all messages where user is involved
    const { data: userMessages, error: msgError } = await supabase
      .from('messages')
      .select(`
        project_id,
        content,
        created_at,
        project:projects!messages_project_id_fkey (id, title)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (msgError) {
      setError(msgError.message)
      setThreads([])
      setLoading(false)
      return
    }

    // Get unique project IDs with their most recent message
    const threadMap = new Map<string, any>()
    for (const msg of (userMessages ?? [])) {
      if (!threadMap.has(msg.project_id)) {
        threadMap.set(msg.project_id, msg)
      }
    }

    const projectIds = Array.from(threadMap.keys())

    if (projectIds.length === 0) {
      setThreads([])
      setLoading(false)
      return
    }

    const threadList: MessageThread[] = []

    for (const projId of projectIds) {
      // Get unread count for each project directed to the user
      const { count, error: countError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projId)
        .eq('read', false)
        .eq('receiver_id', userId)

      const projectData = threadMap.get(projId)

      threadList.push({
        id: projId,
        updated_at: projectData?.created_at ?? new Date(),
        project_id: projId,
        project_title: projectData?.project?.title ?? 'Unknown Project',
        last_message: projectData?.content,
        last_message_at: projectData?.created_at,
        unread_count: !countError && count ? count : 0,
      })
    }

    setThreads(threadList)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  return { threads, loading, error, refetch: load }
}

// ─── Send message ─────────────────────────────────────────────────────────

export async function sendMessage(payload: {
  project_id: string
  sender_id: string
  receiver_id: string
  content: string
}): Promise<{ data: Message | null; error: string | null }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase
      .from('messages') as any)
      .insert([
        {
          project_id: payload.project_id,
          sender_id: payload.sender_id,
          receiver_id: payload.receiver_id,
          content: payload.content,
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

// ─── Mark message as read ──────────────────────────────────────────────────

export async function markMessageAsRead(messageId: string): Promise<{ error: string | null }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase
      .from('messages') as any)
      .update({ read: true })
      .eq('id', messageId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ─── Mark all messages in project as read ──────────────────────────────────

export async function markProjectMessagesAsRead(
  projectId: string,
  userId: string
): Promise<{ error: string | null }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase
      .from('messages') as any)
      .update({ read: true })
      .eq('project_id', projectId)
      .neq('sender_id', userId)
      .eq('read', false)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
