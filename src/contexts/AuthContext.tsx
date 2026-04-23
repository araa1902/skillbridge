import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'

// --------------------------------------------------------------------------
// Constants for session security
// --------------------------------------------------------------------------
const SESSION_TIMEOUT_KEY = 'sb_last_active'
const INACTIVITY_THRESHOLD = 30 * 60 * 1000 // 30 minutes in milliseconds

// --------------------------------------------------------------------------
// Shape of a fetched profile row
// --------------------------------------------------------------------------
interface Profile {
  id: string
  full_name: string
  role: UserRole
  company_name: string | null
  website: string | null
  university_id: string | null
  bio: string | null
  skills: string[] | null
  cv_url: string | null
  cv_name: string | null
}

// --------------------------------------------------------------------------
// Context value
// --------------------------------------------------------------------------
interface AuthContextValue {
  userMetadata: User['user_metadata'] | null
  id: string | null
  /** Raw Supabase session – null when logged-out */
  session: Session | null
  /** Shortcut to session.user */
  user: User | null
  /** Profile row fetched from public.profiles */
  profile: Profile | null
  /** Role shortcut – null while loading or logged-out */
  role: UserRole | null
  /** True while the initial session + profile are being resolved */
  loading: boolean
  /** Sign out the current user */
  signOut: () => Promise<void>
  /** Refresh the profile from the DB (useful after profile edits) */
  refreshProfile: () => Promise<void>
}

// --------------------------------------------------------------------------
// Context + hook
// --------------------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}

// --------------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------------
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Track session existence without triggering hook dependency updates
  const hasSessionRef = useRef<boolean>(false)
  useEffect(() => {
    hasSessionRef.current = !!session
  }, [session])

  // Fetch the profiles row for a given user ID
  const fetchProfile = useCallback(async (userId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, company_name, website, university_id, bio, skills, cv_url, cv_name')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.error('[AuthContext] Profile missing for user in database:', userId)
          setProfile(null)
          return
        }
        console.error('[AuthContext] Failed to fetch profile:', error.message)
        setProfile(null)
      } else {
        setProfile(data as Profile)
      }
    } catch (err) {
      console.error('[AuthContext] Profile fetch error:', err)
      setProfile(null)
    }
  }, [])

  // Public refresh so components can trigger a re-fetch after edits
  const refreshProfile = useCallback(async (): Promise<void> => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id)
      }
    } catch (err) {
      console.error('[AuthContext] Refresh profile error:', err)
    }
  }, [fetchProfile])

  // Session security: last active timestamp update
  const lastActivityUpdateRef = useRef<number>(0)
  const updateActivity = useCallback(() => {
    // Only track activity if we have a session
    if (hasSessionRef.current) {
      const now = Date.now()
      // Debounce: max once every 10 seconds
      if (now - lastActivityUpdateRef.current > 10000) {
        localStorage.setItem(SESSION_TIMEOUT_KEY, now.toString())
        lastActivityUpdateRef.current = now
      }
    }
  }, [])

  // Session security: check if session has timed out
  const checkSessionTimeout = useCallback(async (): Promise<boolean> => {
    const lastActive = localStorage.getItem(SESSION_TIMEOUT_KEY)
    if (lastActive) {
      const lastActiveTime = parseInt(lastActive, 10)
      const currentTime = Date.now()
      
      if (currentTime - lastActiveTime > INACTIVITY_THRESHOLD) {
        console.log('[AuthContext] Session timed out due to inactivity')
        // Clear timestamp first to avoid loop
        localStorage.removeItem(SESSION_TIMEOUT_KEY)
        await supabase.auth.signOut()
        setSession(null)
        setProfile(null)
        return true // Timed out
      }
    }
    // Update timestamp as we're active now
    updateActivity()
    return false // Not timed out
  }, [updateActivity])

  // Sign-out helper
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('[AuthContext] Sign out error:', err)
    }
    setSession(null)
    setProfile(null)
  }, [])

  // Bootstrap: restore session and subscribe to auth changes
  useEffect(() => {
    let mounted = true
    let authInitialized = false

    const initAuth = async () => {
      try {
        // Check for session timeout before doing anything else
        const timedOut = await checkSessionTimeout()
        if (timedOut) {
          if (mounted) setLoading(false)
          return
        }

        // Use getUser() to force a server-side verification of the session token
        // instead of just trusting the locally stored session.
        const { data: { user: verifiedUser }, error } = await supabase.auth.getUser()

        if (!mounted) return

        if (error) {
          console.log('[AuthContext] Session verification failed or expired:', error.message)
          setSession(null)
          setProfile(null)
          return
        }

        if (verifiedUser) {
          // Get the current session object to keep the state consistent
          const { data: { session: currentSession } } = await supabase.auth.getSession()
          setSession(currentSession)
          
          // Wait for profile to be fetched before clearing loading state
          // to prevent ProtectedRoute from flashing/redirecting incorrectly
          await fetchProfile(verifiedUser.id)
        }
      } catch (err) {
        console.error('[AuthContext] Session restore error:', err)
      } finally {
        if (mounted) {
          authInitialized = true
          setLoading(false)
        }
      }
    }

    // Initialize session on mount
    initAuth()

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return

      setSession(newSession)

      if (newSession?.user) {
        // Fire and forget - don't await
        fetchProfile(newSession.user.id).catch(err =>
          console.error('[AuthContext] Profile fetch on auth change error:', err)
        )
      } else {
        setProfile(null)
      }

      // Mark as initialized and stop loading when auth state changes
      if (!authInitialized) {
        authInitialized = true
        // If we just got a session but hadn't finished init, we might still be loading
        // but normally onAuthStateChange follows the initial getUser/getSession.
        setLoading(false)
      }
    })

    // Activity tracking listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']
    const handleActivity = () => updateActivity()

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [fetchProfile, checkSessionTimeout, updateActivity])

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    loading,
    signOut,
    refreshProfile,
    userMetadata: session?.user?.user_metadata ?? null,
    id: session?.user?.id ?? null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
