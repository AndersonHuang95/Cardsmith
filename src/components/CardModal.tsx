import type { Card } from '../types'

interface Props {
  card: Card | null;
  onClose: () => void;
}

export default function CardModal({ card, onClose }: Props) {
  if (!card) return null
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth:640, width:"100%", background:"#10101a", border:"1px solid rgba(212,175,55,0.2)", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"20px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div className="bd" style={{ fontSize:10, letterSpacing:"0.15em", color:"#6a6258", textTransform:"uppercase", marginBottom:4 }}>{card.issuer} · {card.network}</div>
            <div className="hl" style={{ fontSize:24 }}>{card.name}</div>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#6a6258", cursor:"pointer", fontSize:22, lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:28 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
            {[
              { label:"Signup Bonus", val:card.signupBonus },
              { label:"Bonus Value", val:card.signupBonusValue },
              { label:"Spend Req.", val:card.spendRequirement },
              { label:"Annual Fee", val:card.annualFeeDisplay },
            ].map(({ label, val }) => (
              <div key={label} className="stat-box">
                <div className="bd" style={{ fontSize:10, letterSpacing:"0.12em", color:"#6a6258", textTransform:"uppercase", marginBottom:6 }}>{label}</div>
                <div className="hl" style={{ fontSize:16, color: label === "Signup Bonus" || label === "Bonus Value" ? (card.color || "#d4af37") : "#e8e0d0" }}>{val}</div>
              </div>
            ))}
          </div>
          <div className="stat-box" style={{ marginBottom:12 }}>
            <div className="bd" style={{ fontSize:10, letterSpacing:"0.12em", color:"#6a6258", textTransform:"uppercase", marginBottom:8 }}>Reward Rates</div>
            <div className="bd" style={{ fontSize:14, color:"#c0b8a8", lineHeight:1.5 }}>{card.rewardRate}</div>
          </div>
          <div className="stat-box" style={{ marginBottom:24 }}>
            <div className="bd" style={{ fontSize:10, letterSpacing:"0.12em", color:"#6a6258", textTransform:"uppercase", marginBottom:10 }}>Top Perks</div>
            {card.topPerks.map((p, i) => (
              <div key={i} className="bd" style={{ fontSize:13, color:"#9a9288", lineHeight:1.5, marginBottom:6, paddingLeft:16, position:"relative" }}>
                <span style={{ position:"absolute", left:0, color:"#d4af37" }}>—</span>{p}
              </div>
            ))}
          </div>
          <div style={{ padding:"16px 20px", background:"rgba(212,175,55,0.05)", borderLeft:"2px solid #d4af37" }}>
            <div className="bd" style={{ fontSize:10, letterSpacing:"0.12em", color:"#d4af37", textTransform:"uppercase", marginBottom:6 }}>Churner Take</div>
            <p className="bd" style={{ fontSize:13, color:"#9a9288", lineHeight:1.6, fontStyle:"italic" }}>"{card.churnerNote}"</p>
          </div>
          <div style={{ marginTop:16, display:"flex", gap:8, flexWrap:"wrap" }}>
            {card.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          {card.applyUrl && (
            <div style={{ marginTop:20 }}>
              <a href={card.applyUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-gold"
                style={{ display:"inline-block", textDecoration:"none", fontSize:11, letterSpacing:"0.1em" }}>
                Apply Now →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
