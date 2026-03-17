import { describe, it, expect } from 'vitest'
import {
  normalize,
  fmtFee,
  fmtBonusValue,
  calcChurnerRating,
  inferTags,
  inferBestFor,
} from '../data/cardUtils'

// Minimal API card fixture used across tests
function makeApiCard(overrides: Record<string, unknown> = {}) {
  return {
    cardId: 'test-card-0001',
    name: 'Test Card',
    issuer: 'CHASE',
    network: 'VISA',
    annualFee: 95,
    currency: 'CHASE',
    offers: [{ amount: [{ amount: 60000 }], days: 90, spend: 4000 }],
    credits: [],
    ...overrides,
  }
}

describe('normalize', () => {
  it('lowercases and strips punctuation', () => {
    expect(normalize('Chase Sapphire Preferred®')).toBe('chase sapphire preferred')
  })
  it('trims whitespace', () => {
    expect(normalize('  hello world  ')).toBe('hello world')
  })
  it('handles empty string', () => {
    expect(normalize('')).toBe('')
  })
})

describe('fmtFee', () => {
  it('returns $0 for no-fee cards', () => {
    expect(fmtFee(0)).toBe('$0')
  })
  it('formats paid fee correctly', () => {
    expect(fmtFee(95)).toBe('$95')
  })
  it('appends waived note when relevant', () => {
    expect(fmtFee(150, true)).toBe('$150 (waived first year)')
  })
})

describe('fmtBonusValue', () => {
  it('returns dollar amount for USD cards', () => {
    const card = makeApiCard({ currency: 'USD', offers: [{ amount: [{ amount: 200 }], days: 90, spend: 500 }] })
    expect(fmtBonusValue(card)).toBe('$200')
  })
  it('returns travel value estimate for points cards', () => {
    const card = makeApiCard({ currency: 'CHASE', offers: [{ amount: [{ amount: 60000 }], days: 90, spend: 4000 }] })
    const val = fmtBonusValue(card)
    expect(val).toMatch(/~\$[\d,]+ in travel/)
  })
  it('returns N/A when no offer data', () => {
    const card = makeApiCard({ offers: [] })
    expect(fmtBonusValue(card)).toBe('N/A')
  })
})

describe('calcChurnerRating', () => {
  it('gives base score of 5 for a mediocre card', () => {
    const card = makeApiCard({
      annualFee: 95,
      currency: 'CHASE',
      offers: [{ amount: [{ amount: 10000 }], days: 90, spend: 1000 }],
      credits: [],
    })
    expect(calcChurnerRating(card)).toBe(5)
  })

  it('adds points for high bonus value', () => {
    const card = makeApiCard({
      annualFee: 0,
      currency: 'CHASE',
      offers: [{ amount: [{ amount: 80000 }], days: 90, spend: 4000 }],
    })
    const rating = calcChurnerRating(card)
    expect(rating).toBeGreaterThan(7)
  })

  it('adds +1 for no annual fee', () => {
    const withFee = makeApiCard({ annualFee: 95, offers: [{ amount: [{ amount: 10000 }], days: 90, spend: 1000 }] })
    const noFee = makeApiCard({ annualFee: 0, offers: [{ amount: [{ amount: 10000 }], days: 90, spend: 1000 }] })
    expect(calcChurnerRating(noFee)).toBe(calcChurnerRating(withFee) + 1)
  })

  it('subtracts 1 for premium annual fee >= $500', () => {
    const normalFee = makeApiCard({ annualFee: 95, offers: [{ amount: [{ amount: 10000 }], days: 90, spend: 1000 }] })
    const premiumFee = makeApiCard({ annualFee: 695, offers: [{ amount: [{ amount: 10000 }], days: 90, spend: 1000 }] })
    expect(calcChurnerRating(premiumFee)).toBe(calcChurnerRating(normalFee) - 1)
  })

  it('never exceeds 10 or drops below 1', () => {
    const great = makeApiCard({
      annualFee: 0,
      currency: 'AMERICAN_EXPRESS',
      offers: [{ amount: [{ amount: 200000 }], days: 90, spend: 8000 }],
      credits: [{ description: 'Lounge', value: 500, weight: 0.8 }],
    })
    const terrible = makeApiCard({
      annualFee: 695,
      currency: 'MARRIOTT',
      offers: [],
    })
    expect(calcChurnerRating(great)).toBeLessThanOrEqual(10)
    expect(calcChurnerRating(terrible)).toBeGreaterThanOrEqual(1)
  })
})

describe('inferTags', () => {
  it('tags no-fee cards', () => {
    const card = makeApiCard({ annualFee: 0 })
    expect(inferTags(card)).toContain('no annual fee')
  })
  it('tags cashback for USD currency', () => {
    const card = makeApiCard({ currency: 'USD' })
    expect(inferTags(card)).toContain('cashback')
  })
  it('tags transferable points for Chase', () => {
    const card = makeApiCard({ currency: 'CHASE' })
    expect(inferTags(card)).toContain('transferable points')
  })
  it('tags airline co-brand for Delta', () => {
    const card = makeApiCard({ currency: 'DELTA' })
    expect(inferTags(card)).toContain('airline co-brand')
  })
  it('returns deduplicated tags', () => {
    const card = makeApiCard({ currency: 'USD', annualFee: 0 })
    const tags = inferTags(card)
    expect(tags).toEqual([...new Set(tags)])
  })
})

describe('inferBestFor', () => {
  it('includes cashback for USD cards', () => {
    const card = makeApiCard({ currency: 'USD' })
    expect(inferBestFor(card)).toContain('cashback')
  })
  it('includes travel_points for non-USD', () => {
    const card = makeApiCard({ currency: 'CHASE' })
    expect(inferBestFor(card)).toContain('travel_points')
  })
  it('includes signup_bonus for large bonus', () => {
    const card = makeApiCard({ currency: 'CHASE', offers: [{ amount: [{ amount: 80000 }], days: 90, spend: 4000 }] })
    expect(inferBestFor(card)).toContain('signup_bonus')
  })
})
