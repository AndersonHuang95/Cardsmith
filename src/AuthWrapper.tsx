import { useState, useEffect, type ReactNode } from 'react'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface RenderProps {
  session: Session | null;
  supabase: SupabaseClient;
}

interface Props {
  children: (props: RenderProps) => ReactNode;
}

/**
 * Manages the Supabase session lifecycle and passes it to children.
 * Does not gate any routes — routing logic lives in App.tsx.
 * The Auth UI is in SignInPage (lazy-loaded) to keep auth-ui-react
 * out of the main bundle.
 */
export default function AuthWrapper({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex',
        alignItems:'center', justifyContent:'center', color:'#d4af37',
        fontFamily:'serif', fontSize:18, letterSpacing:'0.1em' }}>
        Loading…
      </div>
    )
  }

  return <>{children({ session, supabase })}</>
}
