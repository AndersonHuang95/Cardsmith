import { useMemo } from 'react'
import type { Card } from '../types'
import { normalize } from '../data/cardUtils'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – large JS data files, typed via assertion below
import { API_CARDS } from '../data/apiCards'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CURATED_CARDS } from '../data/curatedCards'

export function useCardDatabase() {
  const cardDB = useMemo<Card[]>(() => {
    const curatedByName: Record<string, Card> = {}
    for (const c of CURATED_CARDS as Card[]) curatedByName[normalize(c.name)] = c

    const merged: Card[] = []
    const seenNames = new Set<string>()

    for (const apiCard of API_CARDS as Card[]) {
      const key = normalize(apiCard.name)
      if (seenNames.has(key)) continue
      seenNames.add(key)

      let curated = curatedByName[key]
      if (!curated) {
        const words = key.split(" ").filter((w: string) => w.length > 3)
        const matchKey = Object.keys(curatedByName).find(k => words.every((w: string) => k.includes(w)))
        curated = matchKey ? curatedByName[matchKey] : undefined as unknown as Card
      }

      if (curated) {
        merged.push({
          ...curated,
          annualFee: apiCard.annualFee,
          annualFeeDisplay: apiCard.annualFeeDisplay,
          signupBonus: apiCard.signupBonus !== "No current offer" ? apiCard.signupBonus : curated.signupBonus,
          signupBonusValue: apiCard.signupBonusValue !== "N/A" ? apiCard.signupBonusValue : curated.signupBonusValue,
          spendRequirement: apiCard.spendRequirement !== "N/A" ? apiCard.spendRequirement : curated.spendRequirement,
          applyUrl: apiCard.applyUrl || null,
          isLive: true,
          isCurated: true,
        })
      } else {
        merged.push({ ...apiCard, isLive: true })
      }
    }

    for (const c of CURATED_CARDS as Card[]) {
      if (!seenNames.has(normalize(c.name))) {
        merged.push({ ...c, isCurated: true, isLive: true })
      }
    }

    merged.sort((a, b) => {
      if (a.isCurated && !b.isCurated) return -1
      if (!a.isCurated && b.isCurated) return 1
      return b.churnerRating - a.churnerRating
    })

    return merged
  }, [])

  return { cardDB, liveStatus: "ok", totalLive: cardDB.length }
}
