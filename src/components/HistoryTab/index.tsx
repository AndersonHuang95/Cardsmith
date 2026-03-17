import type { SavedRecommendation, Card } from '../../types'

interface Props {
  savedRecs: SavedRecommendation[];
  cardDB: Card[];
  onSelectCard: (card: Card) => void;
}

export default function HistoryTab({ savedRecs, cardDB, onSelectCard }: Props) {
  if (savedRecs.length === 0) {
    return (
      <div className="fade-up" style={{ padding:"60px 0", textAlign:"center" }}>
        <p className="hl" style={{ fontSize:28, marginBottom:12, color:"#5a5248" }}>No saved results yet</p>
        <p className="bd" style={{ color:"#3a3830", fontSize:13 }}>
          Run the recommendation wizard and click "Save Results" to see your history here.
        </p>
      </div>
    )
  }

  return (
    <div className="fade-up">
      <div style={{ marginBottom:36 }}>
        <p className="bd" style={{ fontSize:11, letterSpacing:"0.2em", color:"#d4af37", textTransform:"uppercase", marginBottom:10 }}>Your Account</p>
        <h1 className="hl" style={{ fontSize:36, lineHeight:1.15, marginBottom:6 }}>Saved <em>Recommendations</em></h1>
        <p className="bd" style={{ color:"#5a5248", fontSize:13 }}>{savedRecs.length} saved session{savedRecs.length !== 1 ? "s" : ""}</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
        {savedRecs.map((rec) => {
          const cards = rec.card_ids
            .map(id => cardDB.find(c => c.id === id))
            .filter((c): c is Card => c !== null)
          const dateStr = new Date(rec.created_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })
          const profile = rec.profile_snapshot

          return (
            <div key={rec.id} className="card-shell" style={{ "--accent": "#d4af37" } as React.CSSProperties}>
              <div style={{ padding:"20px 24px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <div className="bd" style={{ fontSize:10, letterSpacing:"0.14em", color:"#5a5248", textTransform:"uppercase", marginBottom:4 }}>{dateStr}</div>
                    {profile && (
                      <div className="bd" style={{ fontSize:12, color:"#6a6258" }}>
                        {profile.goal && <span>{profile.goal.replace("_", " ")} · </span>}
                        {profile.creditScore && <span>{profile.creditScore} credit · </span>}
                        {profile.annualFeeComfort && <span>fee: {profile.annualFeeComfort}</span>}
                      </div>
                    )}
                  </div>
                  <span className="bd" style={{ fontSize:10, letterSpacing:"0.12em", color:"#3a3830", textTransform:"uppercase" }}>{cards.length} cards</span>
                </div>

                <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                  {cards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => onSelectCard(card)}
                      style={{
                        background:"rgba(255,255,255,0.03)",
                        border:`1px solid ${card.color || "rgba(212,175,55,0.2)"}30`,
                        padding:"10px 16px",
                        cursor:"pointer",
                        textAlign:"left",
                        minWidth:160,
                      }}>
                      <div className="hl" style={{ fontSize:14, color: card.color || "#d4af37", marginBottom:3 }}>{card.name}</div>
                      <div className="bd" style={{ fontSize:10, color:"#5a5248" }}>{card.issuer} · Score {card.churnerRating}/10</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
