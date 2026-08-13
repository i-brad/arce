"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { APP_URL, supabaseConfigured } from "@/lib/env"

interface AuthContextValue {
  configured: boolean
  loading: boolean
  user: User | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessionChecked, setSessionChecked] = useState(!supabaseConfigured)

  useEffect(() => {
    if (!supabaseConfigured) return
    const client = createClient()
    let mounted = true
    void client.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data.user)
        setSessionChecked(true)
      }
    })
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null)
    })
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const loading = !sessionChecked

  const signInWithGoogle = useCallback(async () => {
    if (!supabaseConfigured) return
    const client = createClient()
    await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${APP_URL}/auth/callback`,
      },
    })
  }, [])

  const signOut = useCallback(async () => {
    if (!supabaseConfigured) return
    await createClient().auth.signOut()
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login"
  }, [])

  const value = useMemo(
    () => ({ configured: supabaseConfigured, loading, user, signInWithGoogle, signOut }),
    [loading, user, signInWithGoogle, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
