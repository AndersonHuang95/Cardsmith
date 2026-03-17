import type { SpendingCategory, Goal, CreditScore } from '../types'

// ─── DATA FRESHNESS ───────────────────────────────────────────────────────────
export const DATA_LAST_UPDATED = "2026-03-09"
export const DATA_SOURCES = "GitHub credit-card-bonuses-api + manual curation"

// ─── ISSUER / NETWORK MAPS ────────────────────────────────────────────────────
export const ISSUER_DISPLAY: Record<string, string> = {
  AMERICAN_EXPRESS: "American Express", CHASE: "Chase", CAPITAL_ONE: "Capital One",
  CITI: "Citi", BANK_OF_AMERICA: "Bank of America", WELLS_FARGO: "Wells Fargo",
  BARCLAYS: "Barclays", US_BANK: "U.S. Bank", DISCOVER: "Discover",
  SYNCHRONY: "Synchrony", BREAD: "Bread Financial", FIRST_TECH: "First Tech FCU",
}

export const ISSUER_COLOR: Record<string, string> = {
  AMERICAN_EXPRESS: "#b8960c", CHASE: "#003087", CAPITAL_ONE: "#c41e3a",
  CITI: "#003f7f", BANK_OF_AMERICA: "#c8102e", WELLS_FARGO: "#d03027",
  BARCLAYS: "#00aeef", US_BANK: "#d4382a", DISCOVER: "#ff6600",
}

export const NETWORK_DISPLAY: Record<string, string> = {
  AMERICAN_EXPRESS: "Amex", VISA: "Visa", MASTERCARD: "Mastercard", DISCOVER: "Discover",
}

export const CURRENCY_PROGRAM: Record<string, string> = {
  AMERICAN_EXPRESS: "Membership Rewards", CHASE: "Ultimate Rewards",
  CAPITAL_ONE: "Capital One Miles", CITI: "ThankYou", DELTA: "SkyMiles",
  UNITED: "MileagePlus", SOUTHWEST: "Rapid Rewards", MARRIOTT: "Marriott Bonvoy",
  HILTON: "Hilton Honors", HYATT: "World of Hyatt", WELLS_FARGO: "Rewards Points",
  ALASKA: "Mileage Plan", JETBLUE: "TrueBlue", BRITISH_AIRWAYS: "Avios",
  USD: "cash back",
}

/** Cents-per-point valuations for each loyalty currency */
export const CPP: Record<string, number> = {
  AMERICAN_EXPRESS: 0.02, CHASE: 0.0175, CAPITAL_ONE: 0.015, CITI: 0.016,
  DELTA: 0.012, UNITED: 0.013, SOUTHWEST: 0.014, MARRIOTT: 0.008,
  HILTON: 0.005, HYATT: 0.02, WELLS_FARGO: 0.01, ALASKA: 0.016,
  JETBLUE: 0.013, BRITISH_AIRWAYS: 0.014,
}

// ─── WIZARD CONSTANTS ─────────────────────────────────────────────────────────
export const SPENDING_CATEGORIES: SpendingCategory[] = [
  { id: "dining", label: "Dining & Restaurants", icon: "🍽️" },
  { id: "travel", label: "Travel & Hotels", icon: "✈️" },
  { id: "groceries", label: "Groceries", icon: "🛒" },
  { id: "gas", label: "Gas & Transit", icon: "⛽" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "online", label: "Online Shopping", icon: "📦" },
  { id: "business", label: "Business Expenses", icon: "💼" },
]

export const GOALS: Goal[] = [
  { id: "travel_points", label: "Maximize Travel Points", desc: "Chase flights, hotels, upgrades" },
  { id: "cashback", label: "Pure Cash Back", desc: "Simple, no-nonsense rewards" },
  { id: "signup_bonus", label: "Signup Bonus Hunting", desc: "Churning for big welcome offers" },
  { id: "lounge_perks", label: "Airport Lounge Access", desc: "Priority Pass, Centurion, etc." },
]

export const CREDIT_SCORES: CreditScore[] = [
  { id: "excellent", label: "Excellent (750+)" },
  { id: "good", label: "Good (700–749)" },
  { id: "fair", label: "Fair (650–699)" },
  { id: "building", label: "Building Credit (<650)" },
]

/** Annual fee comfort → max fee in dollars */
export const FEE_COMFORT_MAX: Record<string, number> = {
  none: 0,
  moderate: 100,
  high: 300,
  premium: 9999,
}
