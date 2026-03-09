import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from './supabase'

export default function AuthWrapper({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0a0f', display:'flex',
        alignItems:'center', justifyContent:'center', color:'#d4af37',
        fontFamily:'serif', fontSize:18, letterSpacing:'0.1em' }}>
        Loading...
      </div>
    )
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
                  }
                }
              }
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

  // Pass session and supabase client down to the app
  return children({ session, supabase })
}