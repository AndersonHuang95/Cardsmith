import type { Card } from '../types'
import {
  ISSUER_DISPLAY, ISSUER_COLOR, NETWORK_DISPLAY,
  CURRENCY_PROGRAM, CPP,
} from './constants'

// Raw API card shape (subset of what the external API returns)
interface ApiCardRaw {
  cardId: string;
  name: string;
  issuer: string;
  network: string;
  annualFee: number;
  isAnnualFeeWaived?: boolean;
  isBusiness?: boolean;
  universalCashbackPercent?: number;
  currency: string;
  url?: string;
  offers?: Array<{
    amount?: Array<{ amount: number }>;
    days?: number;
    spend?: number;
  }>;
  historicalOffers?: Array<{
    amount?: Array<{ amount: number }>;
  }>;
  credits?: Array<{
    description?: string;
    value: number;
    weight: number;
  }>;
}

export function normalize(name = ""): string {
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim()
}

export function fmtFee(fee: number, waived?: boolean): string {
  if (fee === 0) return "$0"
  return `$${fee}${waived ? " (waived first year)" : ""}`
}

export function fmtBonus(apiCard: ApiCardRaw): string | null {
  const offer = apiCard.offers?.[0]
  if (!offer) return null
  const amt = offer.amount?.[0]?.amount
  if (!amt) return null
  const isCash = apiCard.currency === "USD"
  const prog = CURRENCY_PROGRAM[apiCard.currency] || apiCard.currency
  return isCash ? `$${amt.toLocaleString()} ${prog}` : `${amt.toLocaleString()} ${prog} points`
}

export function fmtBonusValue(apiCard: ApiCardRaw): string {
  const offer = apiCard.offers?.[0]
  if (!offer) return "N/A"
  const amt = offer.amount?.[0]?.amount
  if (!amt) return "N/A"
  if (apiCard.currency === "USD") return `$${amt.toLocaleString()}`
  const rate = CPP[apiCard.currency] || 0.01
  const val = Math.round((amt * rate) / 50) * 50
  return `~$${val.toLocaleString()} in travel`
}

export function fmtSpend(apiCard: ApiCardRaw): string {
  const offer = apiCard.offers?.[0]
  if (!offer) return "N/A"
  const months = Math.round((offer.days || 90) / 30)
  return `$${(offer.spend || 0).toLocaleString()} in ${months} month${months !== 1 ? "s" : ""}`
}

export function historicalNote(apiCard: ApiCardRaw): string {
  const offer = apiCard.offers?.[0]
  if (!offer) return ""
  const cur = offer.amount?.[0]?.amount || 0
  const all = [...(apiCard.historicalOffers || []), ...(apiCard.offers || [])]
  const high = Math.max(...all.map(o => o.amount?.[0]?.amount || 0))
  return high > cur ? ` (all-time high: ${high.toLocaleString()})` : ""
}

export function inferTags(apiCard: ApiCardRaw): string[] {
  const tags: string[] = []
  const name = apiCard.name.toLowerCase()
  const cur = apiCard.currency
  if (apiCard.annualFee === 0) tags.push("no annual fee")
  if (apiCard.isBusiness) tags.push("business")
  if (["DELTA","UNITED","SOUTHWEST","ALASKA","JETBLUE","BRITISH_AIRWAYS"].includes(cur)) tags.push("airline co-brand")
  if (["MARRIOTT","HILTON","HYATT"].includes(cur)) tags.push("hotel co-brand")
  if (["AMERICAN_EXPRESS","CHASE","CAPITAL_ONE","CITI","WELLS_FARGO"].includes(cur)) tags.push("transferable points")
  if (cur === "USD") tags.push("cashback")
  if (name.includes("travel") || name.includes("venture") || name.includes("sapphire")) tags.push("travel")
  if (name.includes("platinum") || name.includes("reserve") || name.includes("aspire") || apiCard.annualFee >= 400) tags.push("premium")
  if (name.includes("dining") || name.includes("restaurant") || name.includes("gold")) tags.push("dining")
  if ((apiCard.universalCashbackPercent || 0) >= 2 && cur === "USD") tags.push("flat-rate")
  return [...new Set(tags)]
}

export function inferCategories(apiCard: ApiCardRaw): string[] {
  const cats: string[] = []
  const cur = apiCard.currency
  const name = apiCard.name.toLowerCase()
  if (["DELTA","UNITED","SOUTHWEST","ALASKA","JETBLUE","MARRIOTT","HILTON","HYATT"].includes(cur)) cats.push("travel")
  if (name.includes("cash") || name.includes("grocery") || cur === "USD") cats.push("groceries")
  if (name.includes("gold") || name.includes("dining")) cats.push("dining")
  if (!cats.length) cats.push("travel")
  return cats
}

export function inferBestFor(apiCard: ApiCardRaw): string[] {
  const goals: string[] = []
  const offer = apiCard.offers?.[0]
  const bonusAmt = offer?.amount?.[0]?.amount || 0
  const isCash = apiCard.currency === "USD"
  if (isCash) goals.push("cashback")
  else goals.push("travel_points")
  if (bonusAmt >= 60000 || (isCash && bonusAmt >= 200)) goals.push("signup_bonus")
  const hasLounge = apiCard.credits?.some(c => c.description?.toLowerCase().includes("lounge"))
  if (hasLounge) goals.push("lounge_perks")
  return goals
}

export function calcChurnerRating(apiCard: ApiCardRaw): number {
  let score = 5
  const offer = apiCard.offers?.[0]
  const bonus = offer?.amount?.[0]?.amount || 0
  const isCash = apiCard.currency === "USD"
  const effectiveBonus = isCash ? bonus : bonus * (CPP[apiCard.currency] || 0.01)
  if (effectiveBonus >= 1200) score += 3
  else if (effectiveBonus >= 800) score += 2
  else if (effectiveBonus >= 400) score += 1
  if (apiCard.annualFee === 0) score += 1
  else if (apiCard.annualFee >= 500) score -= 1
  const totalCreditValue = (apiCard.credits || []).reduce((s, c) => s + c.value * c.weight, 0)
  if (totalCreditValue > 300) score += 1
  return Math.min(10, Math.max(1, score))
}

export function buildPerks(apiCard: ApiCardRaw): string[] {
  const perks = (apiCard.credits || [])
    .filter(c => c.value > 20)
    .sort((a, b) => b.value * b.weight - a.value * a.weight)
    .slice(0, 3)
    .map(c => `${c.description} (value: ~$${Math.round(c.value * c.weight)})`)
  if (!perks.length) {
    const prog = CURRENCY_PROGRAM[apiCard.currency] || ""
    if (prog && apiCard.currency !== "USD") perks.push(`Earns ${prog} points`)
    if (apiCard.universalCashbackPercent) perks.push(`${apiCard.universalCashbackPercent}x on all purchases`)
    if (!apiCard.annualFee) perks.push("No annual fee")
  }
  return perks
}

export function buildCardFromAPI(apiCard: ApiCardRaw): Card {
  const issuer = ISSUER_DISPLAY[apiCard.issuer] || apiCard.issuer
  const network = NETWORK_DISPLAY[apiCard.network] || apiCard.network
  const bonus = fmtBonus(apiCard)
  return {
    id: apiCard.cardId.slice(0, 12),
    name: apiCard.name,
    issuer,
    network,
    annualFee: apiCard.annualFee,
    annualFeeDisplay: fmtFee(apiCard.annualFee, apiCard.isAnnualFeeWaived),
    signupBonus: bonus ? bonus + historicalNote(apiCard) : "No current offer",
    signupBonusValue: fmtBonusValue(apiCard),
    spendRequirement: fmtSpend(apiCard),
    rewardRate: apiCard.universalCashbackPercent
      ? `${apiCard.universalCashbackPercent}x on all purchases`
      : "Varies by category",
    topPerks: buildPerks(apiCard),
    categories: inferCategories(apiCard),
    bestFor: inferBestFor(apiCard),
    creditRequired: apiCard.annualFee >= 400 ? "excellent" : "good",
    churnerRating: calcChurnerRating(apiCard),
    churnerNote: `Earns ${CURRENCY_PROGRAM[apiCard.currency] || apiCard.currency}. Annual fee: $${apiCard.annualFee}.`,
    color: ISSUER_COLOR[apiCard.issuer] || "#d4af37",
    tags: inferTags(apiCard),
    applyUrl: apiCard.url || null,
    isLive: true,
    isCurated: false,
    isBusiness: apiCard.isBusiness || false,
  }
}
