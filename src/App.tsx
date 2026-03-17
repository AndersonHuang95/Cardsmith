import { useState } from 'react'
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { SessionContext } from './context/SessionContext'
import { useCardDatabase } from './hooks/useCardDatabase'
import { useUserData } from './hooks/useUserData'
import { DATA_LAST_UPDATED, DATA_SOURCES } from './data/constants'
import { GLOBAL_STYLES } from './styles/globalStyles'
import BrowseTab from './components/BrowseTab'
import RecommendTab from './components/RecommendTab'
import HistoryTab from './components/HistoryTab'
import CardModal from './components/CardModal'
import type { Card } from './types'

interface Props {
  session: Session | null;
  supabase: SupabaseClient;
}

export default function App({ session, supabase }: Props) {
  const navigate = useNavigate()
  const { cardDB } = useCardDatabase()
  const { savedRecs, saveRecommendation } = useUserData(supabase, session?.user.id)
  const [historyCard, setHistoryCard] = useState<Card | null>(null)

  const username = session?.user.user_metadata?.given_name
    || session?.user.user_metadata?.full_name?.split(' ')[0]
    || session?.user.email
    || null

  return (
    <SessionContext.Provider value={{ session, supabase }}>
      <div style={{ minHeight:"100vh", background:"#0a0a0f", color:"#e8e0d0" }}>
        <style>{GLOBAL_STYLES}</style>

        {historyCard && <CardModal card={historyCard} onClose={() => setHistoryCard(null)} />}

        {/* Header */}
        <header style={{ borderBottom:"1px solid rgba(212,175,55,0.12)", padding:"18px 40px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ cursor:"pointer" }} onClick={() => navigate('/recommend')}>
            <div className="hl" style={{ fontSize:21, letterSpacing:"0.04em", color:"#d4af37" }}>CARDSMITH</div>
            <div className="bd" style={{ fontSize:10, letterSpacing:"0.16em", color:"#4a4840", textTransform:"uppercase", marginTop:1 }}>Credit Card Intelligence</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            {/* Data freshness indicator */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#4a9a4a", display:"inline-block" }} />
                <span className="bd" style={{ fontSize:10, letterSpacing:"0.12em", color:"#4a4840", textTransform:"uppercase" }}>
                  {cardDB.length} cards
                </span>
              </div>
              <div title={`Sources: ${DATA_SOURCES}\nLast refreshed: ${DATA_LAST_UPDATED}`}
                style={{ fontSize:9, letterSpacing:"0.08em", color:"#3a3830", textTransform:"uppercase", cursor:"default" }}>
                Updated {DATA_LAST_UPDATED}
              </div>
            </div>

            <nav style={{ display:"flex", gap:4, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <NavLink to="/recommend" className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}
                style={{ textDecoration:"none" }}>
                Get Recommendations
              </NavLink>
              <NavLink to="/browse" className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}
                style={{ textDecoration:"none" }}>
                Browse All Cards
              </NavLink>
              {session && (
                <NavLink to="/history" className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}
                  style={{ textDecoration:"none" }}>
                  My History {savedRecs.length > 0 && <span style={{ fontSize:9, color:"#d4af37" }}>({savedRecs.length})</span>}
                </NavLink>
              )}
            </nav>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {session ? (
              <>
                <span style={{ fontSize:11, color:'#4a4840' }}>{username}</span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  style={{ fontSize:10, letterSpacing:'0.12em', color:'#4a4840',
                    textTransform:'uppercase', background:'none', border:'1px solid rgba(255,255,255,0.06)',
                    padding:'4px 12px', cursor:'pointer' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/recommend')}
                style={{ fontSize:10, letterSpacing:'0.12em', color:'#d4af37',
                  textTransform:'uppercase', background:'none', border:'1px solid rgba(212,175,55,0.3)',
                  padding:'4px 12px', cursor:'pointer' }}>
                Sign In
              </button>
            )}
          </div>
        </header>

        <main style={{ maxWidth:860, margin:"0 auto", padding:"52px 40px 80px" }}>
          <Routes>
            <Route path="/browse" element={<BrowseTab cardDB={cardDB} />} />
            <Route path="/recommend" element={
              session
                ? <RecommendTab cardDB={cardDB} saveRecommendation={saveRecommendation} />
                : <SignInPrompt />
            } />
            <Route path="/history" element={
              session
                ? <HistoryTab savedRecs={savedRecs} cardDB={cardDB} onSelectCard={setHistoryCard} />
                : <Navigate to="/recommend" replace />
            } />
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/browse" replace />} />
          </Routes>
        </main>
      </div>
    </SessionContext.Provider>
  )
}

function SignInPrompt() {
  const navigate = useNavigate()
  return (
    <div className="fade-up" style={{ textAlign:"center", padding:"60px 0" }}>
      <p className="bd" style={{ fontSize:11, letterSpacing:"0.2em", color:"#d4af37", textTransform:"uppercase", marginBottom:16 }}>
        Sign In Required
      </p>
      <h1 className="hl" style={{ fontSize:36, lineHeight:1.2, marginBottom:16 }}>
        Get Your <em>Personal Picks</em>
      </h1>
      <p className="bd" style={{ color:"#5a5248", fontSize:14, marginBottom:40, maxWidth:420, margin:"0 auto 40px" }}>
        Sign in to run the AI recommendation wizard and save your results.
        You can <button onClick={() => navigate('/browse')} style={{ background:"none", border:"none", color:"#d4af37", cursor:"pointer", fontSize:14, fontFamily:"inherit", textDecoration:"underline" }}>browse all cards</button> without an account.
      </p>
      <button className="btn btn-gold" onClick={() => navigate('/recommend', { state: { showAuth: true } })}>
        Sign In with Google →
      </button>
    </div>
  )
}
