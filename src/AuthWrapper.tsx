import { useState, useEffect, type ReactNode } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface RenderProps {
  session: Session | null;
  supabase: SupabaseClient;
}

interface Props {
  children: (props: RenderProps) => ReactNode;
  /** When true the component renders children even without an active session */
  allowGuest?: boolean;
}

export default function AuthWrapper({ children, allowGuest = false }: Props) {
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

  // Guest mode: render the app with session=null so public routes work
  if (allowGuest && !session) {
    return <>{children({ session: null, supabase })}</>
  }

  if (!session) {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex',
        flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40 }}>
        <div style={{ color:'#d4af37', fontSize:28, fontFamily:'serif',
          letterSpacing:'0.06em', marginBottom:8 }}>CARDSMITH</div>
        <div style={{ color:'#4a4840', fontSize:11, letterSpacing:'0.16em',
          textTransform:'uppercase', marginBottom:48 }}>Credit Card Intelligence</div>
        <div style={{ width:'100%', maxWidth:380 }}>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#d4af37',
                    brandAccent: '#b8960c',
                    inputBackground: '#12121a',
                    inputText: '#e8e0d0',
                    inputBorder: 'rgba(212,175,55,0.2)',
                    inputBorderFocus: '#d4af37',
                    messageText: '#e8e0d0',
                    anchorTextColor: '#d4af37',
                    dividerBackground: 'rgba(212,175,55,0.12)',
                    defaultButtonBackground: '#1a1a28',
                    defaultButtonBorder: 'rgba(212,175,55,0.2)',
                    defaultButtonText: '#e8e0d0',
                  },
                },
              },
            }}
            providers={['google']}
            onlyThirdPartyProviders={true}
            redirectTo={window.location.origin}
          />
        </div>
        <div style={{ color:'#2a2a38', fontSize:10, letterSpacing:'0.1em',
          textTransform:'uppercase', marginTop:40 }}>
          Your data is saved privately to your account
        </div>
      </div>
    )
  }

  return <>{children({ session, supabase })}</>
}
