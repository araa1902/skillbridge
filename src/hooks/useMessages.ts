import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface Message {
  id: string
  project_id: string
  sender_id: string
  receiver_id: string
  sender_name?: string
  receiver_name?: string
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
        sender:profiles!messages_sender_id_fkey (full_name),
        receiver:profiles!messages_receiver_id_fkey (full_name)
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
        receiver_name: row.receiver?.full_name ?? 'Unknown',
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

            // Find names from previous messages in the thread to avoid refetching
            const existingSenderMsg = prev.find(m => m.sender_id === newRow.sender_id)
            const existingReceiverMsg = prev.find(m => m.receiver_id === newRow.receiver_id)

            const newMessage: Message = {
              ...newRow,
              sender_name: existingSenderMsg?.sender_name || '...', 
              receiver_name: existingReceiverMsg?.receiver_name || '...',
              sender_avatar: null,
            }
            return [...prev, newMessage]
          })
          
          // Note: Removed load() here to prevent fetching the entire message history
          // on every single incoming message.
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
        sender_id,
        receiver_id,
        project:projects!messages_project_id_fkey (id, title),
        sender:profiles!messages_sender_id_fkey (full_name),
        receiver:profiles!messages_receiver_id_fkey (full_name)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (msgError) {
      setError(msgError.message)
      setThreads([])
      setLoading(false)
      return
    }

    // Group by project_id and pick the latest message
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

    // Get all unread message counts for this user in one query
    const { data: unreadData } = await supabase
      .from('messages')
      .select('project_id')
      .eq('read', false)
      .eq('receiver_id', userId)

    const unreadCountsMap = new Map<string, number>()
    if (unreadData) {
      for (const row of unreadData) {
        unreadCountsMap.set(row.project_id, (unreadCountsMap.get(row.project_id) || 0) + 1)
      }
    }

    const threadList: MessageThread[] = []

    for (const projId of projectIds) {
      const msg = threadMap.get(projId)

      // Determine other user's name
      const otherUserName = msg.sender_id === userId
        ? msg.receiver?.full_name
        : msg.sender?.full_name

      threadList.push({
        id: projId,
        updated_at: msg.created_at,
        project_id: projId,
        project_title: msg.project?.title ?? 'Unknown Project',
        other_user_name: otherUserName ?? 'User',
        last_message: msg.content,
        last_message_at: msg.created_at,
        unread_count: unreadCountsMap.get(projId) || 0,
      })
    }

    setThreads(threadList)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    load()

    if (!userId) return

    // We need to listen for any new messages where this user is either sender or receiver
    // to update the thread list/last message/unread count.
    const channelSent = supabase
      .channel(`user_messages_sent_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId}`,
        },
        () => load()
      )
      .subscribe()

    const channelReceived = supabase
      .channel(`user_messages_received_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        () => load()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channelSent)
      supabase.removeChannel(channelReceived)
    }
  }, [load, userId])

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

    // Drop an invisible notification
    await supabase.from('notifications' as any).insert({
      user_id: payload.receiver_id,
      type: 'message',
      title: 'New Message Received',
      content: 'You have a new unread message.',
      action_url: `/project/${payload.project_id}/messages`
    })

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
