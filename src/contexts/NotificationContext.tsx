import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from '@/components/ui/sonner'

export interface AppNotification {
  id: string
  user_id: string
  type: string
  title: string
  content: string
  action_url: string | null
  is_read: boolean
  created_at: string
}

interface NotificationContextValue {
  notifications: AppNotification[]
  unreadCount: number
  loading: boolean
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  // Use ref for persistent audio object
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Pre-load audio on mount
  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3')
    audio.crossOrigin = "anonymous"
    audio.volume = 0.2
    audioRef.current = audio

    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            window.removeEventListener('click', unlockAudio)
            window.removeEventListener('keydown', unlockAudio)
            audioRef.current?.pause()
            if (audioRef.current) audioRef.current.currentTime = 0
          })
          .catch(err => console.debug('Audio unlock failed:', err))
      }
    }

    window.addEventListener('click', unlockAudio)
    window.addEventListener('keydown', unlockAudio)

    return () => {
      window.removeEventListener('click', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  const playChime = useCallback(() => {
    if (!audioRef.current) return

    try {
      audioRef.current.currentTime = 0
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Notification chime failed to play.', err)
        })
      }
    } catch (err) {
      console.error('Error playing chime:', err)
    }
  }, [])

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching notifications:', error)
      } else {
        setNotifications((data as any) || [])
      }
    } catch (err) {
      console.error('Unexpected error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as AppNotification
          setNotifications((prev) => [newNotification, ...prev])

          playChime()

          toast.custom((t) => (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-[360px] pointer-events-auto bg-background shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-5"
            >
              <div
                className="cursor-pointer pr-8"
                onClick={() => {
                  toast.dismiss(t);
                  if (newNotification.action_url) {
                    if (newNotification.action_url.startsWith('http')) {
                      window.location.href = newNotification.action_url
                    } else {
                      navigate(newNotification.action_url)
                    }
                  }
                }}
              >
                <h4 className="text-base font-semibold text-foreground tracking-tight mb-1">
                  {newNotification.title}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {newNotification.content}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toast.dismiss(t);
                }}
                className="absolute top-5 right-5 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
                aria-label="Close notification"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ), { duration: 6000 })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, navigate, playChime])

  const markAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    )

    const { error } = await supabase
      .from('notifications' as any)
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: false } : n))
      )
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    if (unreadIds.length === 0) return

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))

    const { error } = await supabase
      .from('notifications' as any)
      .update({ is_read: true })
      .in('id', unreadIds)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      fetchNotifications()
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}