import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Card } from '../../types'
import CardModal from '../CardModal'

interface Props {
  cardDB: Card[];
}

const FEE_OPTIONS = [
  { val: "any", label: "Any Annual Fee" },
  { val: "0", label: "No Annual Fee" },
  { val: "100", label: "Up to $100" },
  { val: "300", label: "Up to $300" },
  { val: "999", label: "$300+" },
]

const SORT_OPTIONS = [
  { val: "churnerRating", label: "Churner Score" },
  { val: "annualFee", label: "Annual Fee" },
  { val: "name", label: "Card Name" },
  { val: "issuer", label: "Issuer" },
]

export default function BrowseTab({ cardDB }: Props) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const cardParam = searchParams.get('card')

  const [search, setSearch] = useState("")
  const [issuerFilter, setIssuerFilter] = useState("All")
  const [tagFilter, setTagFilter] = useState("All")
  const [maxFee, setMaxFee] = useState("any")
  const [sortBy, setSortBy] = useState<keyof Card>("churnerRating")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const ISSUERS = ["All", ...new Set(cardDB.map((c) => c.issuer))]

  const selectedCard = cardParam ? (cardDB.find(c => c.id === cardParam) ?? null) : null

  const openCard = (card: Card) => navigate(`/browse?card=${card.id}`, { replace: false })
  const closeCard = () => navigate('/browse', { replace: false })

  const filtered = useMemo(() => {
    let cards = [...cardDB]
    if (search) {
      const q = search.toLowerCase()
      cards = cards.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q)) ||
        c.rewardRate.toLowerCase().includes(q)
      )
    }
    if (issuerFilter !== "All") cards = cards.filter((c) => c.issuer === issuerFilter)
    if (tagFilter !== "All") cards = cards.filter((c) => c.tags.includes(tagFilter))
    if (maxFee === "0") cards = cards.filter((c) => c.annualFee === 0)
    else if (maxFee === "100") cards = cards.filter((c) => c.annualFee <= 100)
    else if (maxFee === "300") cards = cards.filter((c) => c.annualFee <= 300)
    else if (maxFee === "999") cards = cards.filter((c) => c.annualFee > 300)

    cards.sort((a, b) => {
      let av: string | number = a[sortBy] as string | number
      let bv: string | number = b[sortBy] as string | number
      if (typeof av === "string") { av = av.toLowerCase(); bv = (bv as string).toLowerCase() }
      if (sortDir === "asc") return av > bv ? 1 : -1
      return av < bv ? 1 : -1
    })
    return cards
  }, [search, issuerFilter, tagFilter, maxFee, sortBy, sortDir, cardDB])

  const toggleSort = (col: keyof Card) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortBy(col); setSortDir("desc") }
  }

  return (
    <main style={{ maxWidth:860, margin:"0 auto", padding:"52px 40px 80px" }}>
    <div className="fade-up">
      {selectedCard && <CardModal card={selectedCard} onClose={closeCard} />}

      <div style={{ marginBottom:36 }}>
        <p className="bd" style={{ fontSize:11, letterSpacing:"0.2em", color:"#d4af37", textTransform:"uppercase", marginBottom:10 }}>Card Database</p>
        <h1 className="hl" style={{ fontSize:36, lineHeight:1.15, marginBottom:6 }}>Browse <em>All Cards</em></h1>
        <p className="bd" style={{ color:"#5a5248", fontSize:13 }}>{cardDB.length} cards · Click any card for full details</p>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:20 }}>
        <input
          placeholder="Search cards, issuers, categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex:"1 1 200px", minWidth:180 }}
        />
        <select value={issuerFilter} onChange={(e) => setIssuerFilter(e.target.value)} style={{ flex:"0 0 160px" }}>
          {ISSUERS.map((i) => <option key={i}>{i}</option>)}
        </select>
        <select value={maxFee} onChange={(e) => setMaxFee(e.target.value)} style={{ flex:"0 0 140px" }}>
          {FEE_OPTIONS.map((f) => <option key={f.val} value={f.val}>{f.label}</option>)}
        </select>
      </div>

      {/* Tag filters */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:24 }}>
        {["All","no annual fee","travel","cashback","dining","groceries","business","premium","transferable points","lounge access","flat-rate"].map((t) => (
          <button key={t} onClick={() => setTagFilter(t)} className={`tag ${tagFilter === t ? "active-tag" : ""}`}
            style={{ cursor:"pointer", background:"transparent", border:"1px solid rgba(255,255,255,0.1)" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Sort bar */}
      <div style={{ display:"flex", gap:6, marginBottom:16, paddingBottom:12, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <span className="bd" style={{ fontSize:10, letterSpacing:"0.12em", color:"#5a5248", textTransform:"uppercase", alignSelf:"center", marginRight:4 }}>Sort:</span>
        {SORT_OPTIONS.map((s) => (
          <button key={s.val} onClick={() => toggleSort(s.val as keyof Card)}
            className="bd"
            style={{ background:"transparent", border:`1px solid ${sortBy===s.val?"rgba(212,175,55,0.4)":"rgba(255,255,255,0.08)"}`, color: sortBy===s.val?"#d4af37":"#6a6258", padding:"5px 12px", fontSize:11, letterSpacing:"0.08em", cursor:"pointer", textTransform:"uppercase" }}>
            {s.label} {sortBy === s.val ? (sortDir === "desc" ? "↓" : "↑") : ""}
          </button>
        ))}
        <span className="bd" style={{ fontSize:11, color:"#5a5248", alignSelf:"center", marginLeft:"auto" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Card list */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.length === 0 && (
          <div style={{ padding:48, textAlign:"center", color:"#4a4840" }} className="bd">No cards match your filters.</div>
        )}
        {filtered.map((card, i) => (
          <div key={card.id} className="card-shell"
            style={{ "--accent": card.color || "#d4af37", cursor:"pointer", animationDelay:`${i*0.04}s` } as React.CSSProperties}
            onClick={() => openCard(card)}>
            <div style={{ padding:"20px 24px", display:"flex", gap:20, alignItems:"center" }}>
              {/* Score */}
              <div style={{ flexShrink:0, textAlign:"center", width:52 }}>
                <div className="hl" style={{ fontSize:26, color: card.color || "#d4af37", lineHeight:1 }}>{card.churnerRating}</div>
                <div className="bd" style={{ fontSize:9, letterSpacing:"0.1em", color:"#5a5248", textTransform:"uppercase", marginTop:2 }}>Score</div>
              </div>

              <div style={{ width:1, alignSelf:"stretch", background:"rgba(255,255,255,0.06)", flexShrink:0 }} />

              {/* Main info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:4, flexWrap:"wrap" }}>
                  <span className="hl" style={{ fontSize:17 }}>{card.name}</span>
                  <span className="bd" style={{ fontSize:11, color:"#5a5248", letterSpacing:"0.08em" }}>{card.issuer}</span>
                  {card.isLive && <span className="bd" style={{ fontSize:9, letterSpacing:"0.12em", color:"#4a9a4a", textTransform:"uppercase", border:"1px solid rgba(74,154,74,0.3)", padding:"2px 6px" }}>● Live</span>}
                  {card.isCurated && <span className="bd" style={{ fontSize:9, letterSpacing:"0.12em", color:"#d4af37", textTransform:"uppercase", border:"1px solid rgba(212,175,55,0.3)", padding:"2px 6px" }}>★ Curated</span>}
                  {card.isBusiness && <span className="bd" style={{ fontSize:9, letterSpacing:"0.12em", color:"#9a7258", textTransform:"uppercase", border:"1px solid rgba(154,114,88,0.3)", padding:"2px 6px" }}>Biz</span>}
                </div>
                <div className="bd" style={{ fontSize:12, color:"#6a6258", marginBottom:8 }}>{card.rewardRate}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {card.tags.slice(0,4).map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>

              {/* Key stats */}
              <div style={{ display:"flex", gap:24, flexShrink:0 }}>
                <div style={{ textAlign:"right" }}>
                  <div className="bd" style={{ fontSize:9, letterSpacing:"0.12em", color:"#5a5248", textTransform:"uppercase", marginBottom:3 }}>Bonus</div>
                  <div className="bd" style={{ fontSize:13, color:"#c0b098" }}>{card.signupBonus.split(" ").slice(0,2).join(" ")}</div>
                  <div className="bd" style={{ fontSize:11, color:"#5a5248" }}>{card.signupBonusValue}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div className="bd" style={{ fontSize:9, letterSpacing:"0.12em", color:"#5a5248", textTransform:"uppercase", marginBottom:3 }}>Ann. Fee</div>
                  <div className="bd" style={{ fontSize:13, color: card.annualFee === 0 ? "#4a9a4a" : card.annualFee >= 400 ? "#c08040" : "#c0b098" }}>{card.annualFeeDisplay}</div>
                </div>
              </div>
              <div style={{ color:"#3a3830", flexShrink:0 }}>›</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </main>
  )
}
