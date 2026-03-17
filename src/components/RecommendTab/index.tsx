import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Card, UserProfile } from '../../types'
import { useSession } from '../../context/SessionContext'
import { SPENDING_CATEGORIES, GOALS, CREDIT_SCORES, FEE_COMFORT_MAX } from '../../data/constants'
import CardModal from '../CardModal'

interface Props {
  cardDB: Card[];
  saveRecommendation: (cardIds: string[], reasoning: string, profileSnapshot: UserProfile) => Promise<unknown>;
}

const DEFAULT_PROFILE: UserProfile = {
  spending: [], goal: "", creditScore: "", annualFeeComfort: "moderate", existing: "",
}

export default function RecommendTab({ cardDB, saveRecommendation }: Props) {
  const { session } = useSession()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Card[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const toggleSpending = (id: string) => setProfile((p) => ({
    ...p,
    spending: p.spending.includes(id) ? p.spending.filter((s) => s !== id) : [...p.spending, id],
  }))

  /**
   * Pre-filter the card database before sending to Claude.
   * This reduces prompt tokens and focuses Claude on relevant candidates.
   */
  function getRelevantCards(): Card[] {
    const maxFee = FEE_COMFORT_MAX[profile.annualFeeComfort] ?? 9999
    const goalId = profile.goal
    const creditTier = profile.creditScore

    let candidates = cardDB.filter((c) => {
      // Respect annual fee preference
      if (c.annualFee > maxFee) return false
      // Respect credit score
      const cardReq = c.creditRequired
      if (creditTier === "building" && !["fair", "building"].includes(cardReq)) return false
      if (creditTier === "fair" && cardReq === "excellent") return false
      return true
    })

    // Boost cards matching the stated goal
    const goalMatches = candidates.filter(c => c.bestFor.includes(goalId))
    const rest = candidates.filter(c => !c.bestFor.includes(goalId))

    // Boost cards matching spending categories
    const spendingMatches = goalMatches.filter(c =>
      profile.spending.some(s => c.categories.includes(s) || c.tags.some(t => t.includes(s)))
    )
    const goalOnly = goalMatches.filter(c =>
      !profile.spending.some(s => c.categories.includes(s) || c.tags.some(t => t.includes(s)))
    )

    // Return: spending+goal matches first, then goal-only, then rest — capped at 30 total
    return [...spendingMatches, ...goalOnly, ...rest].slice(0, 30)
  }

  function buildPrompt(): string {
    const spendingLabels = profile.spending
      .map((id) => SPENDING_CATEGORIES.find((c) => c.id === id)?.label)
      .join(", ")
    const goalLabel = GOALS.find((g) => g.id === profile.goal)?.label
    const scoreLabel = CREDIT_SCORES.find((s) => s.id === profile.creditScore)?.label

    const relevantCards = getRelevantCards()
    const cardList = relevantCards
      .map(c => `${c.id}: ${c.name} | ${c.issuer} | Fee: ${c.annualFeeDisplay} | Bonus: ${c.signupBonusValue} | Rate: ${c.rewardRate} | Score: ${c.churnerRating}/10`)
      .join("\n")

    return `You are a credit card expert helping a user find their ideal cards.

User profile:
- Spending categories: ${spendingLabels || "not specified"}
- Primary goal: ${goalLabel || "not specified"}
- Credit score: ${scoreLabel || "not specified"}
- Annual fee comfort: ${profile.annualFeeComfort}
- Cards already owned: ${profile.existing || "none"}

Available card database (choose from these ONLY):
${cardList}

Return ONLY a JSON array of exactly 4 card IDs from the database that best match this user, ranked best to worst. You MUST use the exact id strings shown above (e.g. "csp", "amex-gold", "ink-preferred"). Format:
[
  { "id": "card-id", "personalReason": "1-2 sentences on why this specific card fits this specific user's profile", "highlight": "The single most compelling stat or perk for this user" },
  ...
]

Only recommend cards appropriate for their credit score. Prioritize their stated goal and spending categories.`
  }

  const getRecommendations = async () => {
    if (!session) {
      navigate('/recommend')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 25000)
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        signal: controller.signal,
        body: JSON.stringify({ prompt: buildPrompt() }),
      })
      clearTimeout(timeout)
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error((err as { error?: { message?: string } })?.error?.message || `API error ${response.status}`)
      }
      const data = await response.json()
      const text = (data.content as Array<{ text?: string }>)?.map((b) => b.text || "").join("")
      const clean = text.replace(/```json|```/g, "").trim()
      const picks = JSON.parse(clean) as Array<{ id: string; personalReason: string; highlight: string }>
      const enriched: Card[] = picks.flatMap((p) => {
        let dbCard = cardDB.find((c) => c.id === p.id)
        if (!dbCard) {
          const needle = (p.id || "").toLowerCase().replace(/-/g, " ")
          dbCard = cardDB.find((c) =>
            c.id.replace(/-/g, " ").includes(needle) ||
            needle.includes(c.id.replace(/-/g, " ")) ||
            c.name.toLowerCase().includes(needle) ||
            needle.includes(c.name.toLowerCase().split(" ").slice(0,3).join(" "))
          )
        }
        if (!dbCard) return []
        const enrichedCard: Card = {
          ...dbCard,
          personalReason: p.personalReason,
          highlight: p.highlight,
        }
        return [enrichedCard]
      })
      setRecommendations(enriched)
      setSaved(false)
      setStep(3)
    } catch (e) {
      const err = e as Error
      setError(err.name === "AbortError" ? "Request timed out — please try again." : `Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!recommendations) return
    setSaving(true)
    await saveRecommendation(
      recommendations.map(c => c.id),
      recommendations.map(c => c.personalReason || "").join(" | "),
      profile
    )
    setSaved(true)
    setSaving(false)
  }

  const reset = () => {
    setStep(1)
    setRecommendations(null)
    setError(null)
    setSaved(false)
    setProfile(DEFAULT_PROFILE)
  }

  return (
    <div>
      {selectedCard && <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />}
      {loading && (
        <div style={{ position:"fixed", inset:0, background:"rgba(10,10,15,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:18, zIndex:50 }}>
          <div className="spinner" />
          <p className="bd" style={{ fontSize:12, letterSpacing:"0.18em", color:"#5a5248", textTransform:"uppercase" }}>Analyzing your profile…</p>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="fade-up">
          <p className="bd" style={{ fontSize:11, letterSpacing:"0.2em", color:"#d4af37", textTransform:"uppercase", marginBottom:10 }}>Step 1 of 2</p>
          <h1 className="hl" style={{ fontSize:40, lineHeight:1.15, marginBottom:6 }}>Where do you<br /><em>spend the most?</em></h1>
          <p className="bd" style={{ color:"#5a5248", fontSize:13, marginBottom:40 }}>Select all that apply.</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:40 }}>
            {SPENDING_CATEGORIES.map((c) => (
              <button key={c.id} className={`pill ${profile.spending.includes(c.id) ? "active" : ""}`} onClick={() => toggleSpending(c.id)}>
                <span style={{ marginRight:10 }}>{c.icon}</span>{c.label}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button className="btn btn-gold" onClick={() => setStep(2)} disabled={profile.spending.length === 0}>Continue →</button>
            <span className="bd" style={{ fontSize:12, color:"#4a4840" }}>{profile.spending.length} selected</span>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="fade-up">
          <p className="bd" style={{ fontSize:11, letterSpacing:"0.2em", color:"#d4af37", textTransform:"uppercase", marginBottom:10 }}>Step 2 of 2</p>
          <h1 className="hl" style={{ fontSize:40, lineHeight:1.15, marginBottom:6 }}>What matters<br /><em>most to you?</em></h1>
          <p className="bd" style={{ color:"#5a5248", fontSize:13, marginBottom:36 }}>One goal shapes everything.</p>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:28 }}>
            {GOALS.map((g) => (
              <button key={g.id} className={`pill ${profile.goal === g.id ? "active" : ""}`}
                onClick={() => setProfile((p) => ({ ...p, goal: g.id }))}
                style={{ padding:"14px 16px" }}>
                <div style={{ fontWeight:500, marginBottom:3 }}>{g.label}</div>
                <div style={{ fontSize:11, opacity:0.55 }}>{g.desc}</div>
              </button>
            ))}
          </div>

          <hr className="divider" style={{ margin:"24px 0" }} />

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
            <div>
              <label className="bd" style={{ fontSize:10, letterSpacing:"0.14em", color:"#5a5248", textTransform:"uppercase", display:"block", marginBottom:8 }}>Credit Score Range</label>
              <select value={profile.creditScore} onChange={(e) => setProfile((p) => ({ ...p, creditScore: e.target.value }))} style={{ width:"100%" }}>
                <option value="">Select…</option>
                {CREDIT_SCORES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="bd" style={{ fontSize:10, letterSpacing:"0.14em", color:"#5a5248", textTransform:"uppercase", display:"block", marginBottom:8 }}>Annual Fee Comfort</label>
              <select value={profile.annualFeeComfort} onChange={(e) => setProfile((p) => ({ ...p, annualFeeComfort: e.target.value }))} style={{ width:"100%" }}>
                <option value="none">No annual fee</option>
                <option value="moderate">Up to $100/yr</option>
                <option value="high">$100–$300/yr</option>
                <option value="premium">$300+ (premium)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom:32 }}>
            <label className="bd" style={{ fontSize:10, letterSpacing:"0.14em", color:"#5a5248", textTransform:"uppercase", display:"block", marginBottom:8 }}>Cards You Already Have <span style={{ opacity:0.45 }}>(optional)</span></label>
            <input placeholder="e.g. Chase Sapphire Preferred, Amex Gold…" value={profile.existing} onChange={(e) => setProfile((p) => ({ ...p, existing: e.target.value }))} style={{ width:"100%" }} />
          </div>

          {error && <p className="bd" style={{ color:"#c05050", fontSize:13, marginBottom:16 }}>{error}</p>}

          <div style={{ display:"flex", gap:12 }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-gold" onClick={getRecommendations} disabled={!profile.goal || !profile.creditScore || loading}>
              Get My Picks →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — RESULTS */}
      {step === 3 && recommendations && (
        <div className="fade-up">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40, flexWrap:"wrap", gap:16 }}>
            <div>
              <p className="bd" style={{ fontSize:11, letterSpacing:"0.2em", color:"#d4af37", textTransform:"uppercase", marginBottom:10 }}>Your Results</p>
              <h1 className="hl" style={{ fontSize:40, lineHeight:1.15 }}>Top Picks<br /><em>for You</em></h1>
            </div>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
              {session && (
                <button
                  className="btn btn-ghost"
                  onClick={handleSave}
                  disabled={saving || saved}
                  style={{ fontSize:11 }}>
                  {saved ? "✓ Saved" : saving ? "Saving…" : "Save Results"}
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setStep(2)}>Adjust Preferences</button>
              <button className="btn btn-ghost" onClick={reset}>Start Over</button>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {recommendations.map((card, i) => (
              <div key={card.id} className="card-shell fade-up"
                style={{ "--accent": card.color || "#d4af37", animationDelay:`${i*0.1}s` } as React.CSSProperties}>
                {/* Rank badge */}
                <div style={{ position:"absolute", top:16, right:20, display:"flex", alignItems:"center", gap:6 }}>
                  <span className="bd" style={{ fontSize:10, letterSpacing:"0.12em", color:"#5a5248", textTransform:"uppercase" }}>#{i+1} Pick</span>
                </div>

                <div style={{ padding:"24px 28px" }}>
                  <div style={{ display:"flex", gap:20, alignItems:"flex-start", marginBottom:16 }}>
                    {/* Score */}
                    <div style={{ flexShrink:0 }}>
                      <div className="hl" style={{ fontSize:40, color: card.color || "#d4af37", lineHeight:1 }}>{card.churnerRating}</div>
                      <div className="bd" style={{ fontSize:9, letterSpacing:"0.12em", color:"#5a5248", textTransform:"uppercase" }}>Churner Score</div>
                      <div style={{ width:44, marginTop:6 }}>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width:`${card.churnerRating*10}%`, background: card.color || "#d4af37" }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ flex:1 }}>
                      <div className="bd" style={{ fontSize:11, color:"#5a5248", letterSpacing:"0.1em", marginBottom:4 }}>{card.issuer}</div>
                      <div className="hl" style={{ fontSize:24, marginBottom:8 }}>{card.name}</div>
                      <div style={{ padding:"10px 14px", background:"rgba(212,175,55,0.04)", borderLeft:"2px solid rgba(212,175,55,0.3)", marginBottom:8 }}>
                        <p className="bd" style={{ fontSize:13, color:"#a09888", lineHeight:1.5 }}>{card.personalReason}</p>
                      </div>
                      {card.highlight && (
                        <div className="bd" style={{ fontSize:12, color: card.color || "#d4af37" }}>✦ {card.highlight}</div>
                      )}
                    </div>
                  </div>

                  <hr className="divider" style={{ margin:"16px 0" }} />

                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
                    {[
                      { label:"Signup Bonus", val:card.signupBonus, sub:card.signupBonusValue },
                      { label:"Spend Req.", val:card.spendRequirement, sub:"to unlock bonus" },
                      { label:"Annual Fee", val:card.annualFeeDisplay, sub:card.rewardRate },
                    ].map(({ label, val, sub }) => (
                      <div key={label} className="stat-box">
                        <div className="bd" style={{ fontSize:9, letterSpacing:"0.12em", color:"#5a5248", textTransform:"uppercase", marginBottom:5 }}>{label}</div>
                        <div className="hl" style={{ fontSize:15, marginBottom:3 }}>{val}</div>
                        <div className="bd" style={{ fontSize:11, color:"#5a5248" }}>{sub}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <div>
                      <div className="bd" style={{ fontSize:9, letterSpacing:"0.12em", color:"#5a5248", textTransform:"uppercase", marginBottom:8 }}>Top Perks</div>
                      {card.topPerks?.map((p, j) => (
                        <div key={j} className="bd" style={{ fontSize:12, color:"#7a7268", marginBottom:5, paddingLeft:14, position:"relative", lineHeight:1.4 }}>
                          <span style={{ position:"absolute", left:0, color:"#d4af37", fontSize:11 }}>—</span>{p}
                        </div>
                      ))}
                    </div>
                    <div style={{ borderLeft:"1px solid rgba(255,255,255,0.06)", paddingLeft:16 }}>
                      <div className="bd" style={{ fontSize:9, letterSpacing:"0.12em", color:"#5a5248", textTransform:"uppercase", marginBottom:8 }}>Churner Take</div>
                      <p className="bd" style={{ fontSize:12, color:"#7a7268", lineHeight:1.6, fontStyle:"italic" }}>"{card.churnerNote}"</p>
                      <button onClick={() => setSelectedCard(card)} className="bd"
                        style={{ marginTop:12, background:"transparent", border:"none", color: card.color || "#d4af37", fontSize:11, letterSpacing:"0.1em", cursor:"pointer", padding:0, textTransform:"uppercase" }}>
                        Full Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
