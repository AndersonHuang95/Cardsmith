import { useState, useMemo, useEffect } from "react";
import { useUserData } from './useUserData'

// ─── DATA FRESHNESS ───────────────────────────────────────────────────────────
// Update this date string every time card data is refreshed.
// Format: "YYYY-MM-DD" — shown in the header so staleness is always visible.
const DATA_LAST_UPDATED = "2026-03-09";
const DATA_SOURCES = "GitHub credit-card-bonuses-api + manual curation";

// ─── ISSUER / NETWORK MAPS ────────────────────────────────────────────────────
const ISSUER_DISPLAY = {
  AMERICAN_EXPRESS: "American Express", CHASE: "Chase", CAPITAL_ONE: "Capital One",
  CITI: "Citi", BANK_OF_AMERICA: "Bank of America", WELLS_FARGO: "Wells Fargo",
  BARCLAYS: "Barclays", US_BANK: "U.S. Bank", DISCOVER: "Discover",
  SYNCHRONY: "Synchrony", BREAD: "Bread Financial", FIRST_TECH: "First Tech FCU",
};
const ISSUER_COLOR = {
  AMERICAN_EXPRESS: "#b8960c", CHASE: "#003087", CAPITAL_ONE: "#c41e3a",
  CITI: "#003f7f", BANK_OF_AMERICA: "#c8102e", WELLS_FARGO: "#d03027",
  BARCLAYS: "#00aeef", US_BANK: "#d4382a", DISCOVER: "#ff6600",
};
const NETWORK_DISPLAY = {
  AMERICAN_EXPRESS: "Amex", VISA: "Visa", MASTERCARD: "Mastercard", DISCOVER: "Discover",
};
const CURRENCY_PROGRAM = {
  AMERICAN_EXPRESS: "Membership Rewards", CHASE: "Ultimate Rewards",
  CAPITAL_ONE: "Capital One Miles", CITI: "ThankYou", DELTA: "SkyMiles",
  UNITED: "MileagePlus", SOUTHWEST: "Rapid Rewards", MARRIOTT: "Marriott Bonvoy",
  HILTON: "Hilton Honors", HYATT: "World of Hyatt", WELLS_FARGO: "Rewards Points",
  ALASKA: "Mileage Plan", JETBLUE: "TrueBlue", BRITISH_AIRWAYS: "Avios",
  USD: "cash back",
};
const CPP = {
  AMERICAN_EXPRESS: 0.02, CHASE: 0.0175, CAPITAL_ONE: 0.015, CITI: 0.016,
  DELTA: 0.012, UNITED: 0.013, SOUTHWEST: 0.014, MARRIOTT: 0.008,
  HILTON: 0.005, HYATT: 0.02, WELLS_FARGO: 0.01, ALASKA: 0.016,
  JETBLUE: 0.013, BRITISH_AIRWAYS: 0.014,
};

function normalize(name = "") {
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}
function fmtFee(fee, waived) {
  if (fee === 0) return "$0";
  return `$${fee}${waived ? " (waived first year)" : ""}`;
}
function fmtBonus(apiCard) {
  const offer = apiCard.offers?.[0];
  if (!offer) return null;
  const amt = offer.amount?.[0]?.amount;
  if (!amt) return null;
  const isCash = apiCard.currency === "USD";
  const prog = CURRENCY_PROGRAM[apiCard.currency] || apiCard.currency;
  return isCash ? `$${amt.toLocaleString()} ${prog}` : `${amt.toLocaleString()} ${prog} points`;
}
function fmtBonusValue(apiCard) {
  const offer = apiCard.offers?.[0];
  if (!offer) return "N/A";
  const amt = offer.amount?.[0]?.amount;
  if (!amt) return "N/A";
  if (apiCard.currency === "USD") return `$${amt.toLocaleString()}`;
  const rate = CPP[apiCard.currency] || 0.01;
  const val = Math.round((amt * rate) / 50) * 50;
  return `~$${val.toLocaleString()} in travel`;
}
function fmtSpend(apiCard) {
  const offer = apiCard.offers?.[0];
  if (!offer) return "N/A";
  const months = Math.round((offer.days || 90) / 30);
  return `$${(offer.spend || 0).toLocaleString()} in ${months} month${months !== 1 ? "s" : ""}`;
}
function historicalNote(apiCard) {
  const offer = apiCard.offers?.[0];
  if (!offer) return "";
  const cur = offer.amount?.[0]?.amount || 0;
  const all = [...(apiCard.historicalOffers || []), ...(apiCard.offers || [])];
  const high = Math.max(...all.map(o => o.amount?.[0]?.amount || 0));
  return high > cur ? ` (all-time high: ${high.toLocaleString()})` : "";
}

// Infer tags from API card data
function inferTags(apiCard) {
  const tags = [];
  const name = apiCard.name.toLowerCase();
  const cur = apiCard.currency;
  if (apiCard.annualFee === 0) tags.push("no annual fee");
  if (apiCard.isBusiness) tags.push("business");
  if (["DELTA","UNITED","SOUTHWEST","ALASKA","JETBLUE","BRITISH_AIRWAYS"].includes(cur)) tags.push("airline co-brand");
  if (["MARRIOTT","HILTON","HYATT"].includes(cur)) tags.push("hotel co-brand");
  if (["AMERICAN_EXPRESS","CHASE","CAPITAL_ONE","CITI","WELLS_FARGO"].includes(cur)) tags.push("transferable points");
  if (cur === "USD") tags.push("cashback");
  if (name.includes("travel") || name.includes("venture") || name.includes("sapphire")) tags.push("travel");
  if (name.includes("platinum") || name.includes("reserve") || name.includes("aspire") || apiCard.annualFee >= 400) tags.push("premium");
  if (name.includes("dining") || name.includes("restaurant") || name.includes("gold")) tags.push("dining");
  if ((apiCard.universalCashbackPercent || 0) >= 2 && cur === "USD") tags.push("flat-rate");
  return [...new Set(tags)];
}

// Infer categories from API card data
function inferCategories(apiCard) {
  const cats = [];
  const cur = apiCard.currency;
  const name = apiCard.name.toLowerCase();
  if (["DELTA","UNITED","SOUTHWEST","ALASKA","JETBLUE","MARRIOTT","HILTON","HYATT"].includes(cur)) cats.push("travel");
  if (name.includes("cash") || name.includes("grocery") || cur === "USD") cats.push("groceries");
  if (name.includes("gold") || name.includes("dining")) cats.push("dining");
  if (!cats.length) cats.push("travel");
  return cats;
}

// Infer bestFor from API card
function inferBestFor(apiCard) {
  const goals = [];
  const offer = apiCard.offers?.[0];
  const bonusAmt = offer?.amount?.[0]?.amount || 0;
  const isCash = apiCard.currency === "USD";
  if (isCash) goals.push("cashback");
  else goals.push("travel_points");
  if (bonusAmt >= 60000 || (isCash && bonusAmt >= 200)) goals.push("signup_bonus");
  const hasLounge = apiCard.credits?.some(c => c.description?.toLowerCase().includes("lounge"));
  if (hasLounge) goals.push("lounge_perks");
  return goals;
}

// Calculate a churner rating from the API data
function calcChurnerRating(apiCard) {
  let score = 5;
  const offer = apiCard.offers?.[0];
  const bonus = offer?.amount?.[0]?.amount || 0;
  const isCash = apiCard.currency === "USD";
  const effectiveBonus = isCash ? bonus : bonus * (CPP[apiCard.currency] || 0.01);
  if (effectiveBonus >= 1200) score += 3;
  else if (effectiveBonus >= 800) score += 2;
  else if (effectiveBonus >= 400) score += 1;
  if (apiCard.annualFee === 0) score += 1;
  else if (apiCard.annualFee >= 500) score -= 1;
  const totalCreditValue = (apiCard.credits || []).reduce((s, c) => s + c.value * c.weight, 0);
  if (totalCreditValue > 300) score += 1;
  return Math.min(10, Math.max(1, score));
}

// Build perks list from credits array
function buildPerks(apiCard) {
  const perks = (apiCard.credits || [])
    .filter(c => c.value > 20)
    .sort((a, b) => b.value * b.weight - a.value * a.weight)
    .slice(0, 3)
    .map(c => `${c.description} (value: ~$${Math.round(c.value * c.weight)})`);
  if (!perks.length) {
    const prog = CURRENCY_PROGRAM[apiCard.currency] || "";
    if (prog && apiCard.currency !== "USD") perks.push(`Earns ${prog} points`);
    if (apiCard.universalCashbackPercent) perks.push(`${apiCard.universalCashbackPercent}x on all purchases`);
    if (!apiCard.annualFee) perks.push("No annual fee");
  }
  return perks;
}

// Build a full card entry from raw API data (no curated info)
function buildCardFromAPI(apiCard) {
  const issuer = ISSUER_DISPLAY[apiCard.issuer] || apiCard.issuer;
  const network = NETWORK_DISPLAY[apiCard.network] || apiCard.network;
  const bonus = fmtBonus(apiCard);
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
  };
}

// ─── STATIC API CARD DATA (fetched at build time) ───────────────────────────
// The artifact sandbox blocks external requests, so data is embedded directly.
// Source: github.com/andenacitelli/credit-card-bonuses-api (fetched March 2026)
const API_CARDS = [
  {
    "id": "api-0",
    "name": "Delta SkyMiles Blue",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "10,000 SkyMiles",
    "signupBonusValue": "~$100 in travel",
    "spendRequirement": "$1,000 in 6 months",
    "rewardRate": "1x on all purchases",
    "topPerks": [
      "Earns SkyMiles",
      "1x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns SkyMiles. Annual fee: $0.",
    "color": "#b8960c",
    "tags": [
      "no annual fee",
      "airline co-brand"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-blue-american-express-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-1",
    "name": "Delta SkyMiles Gold",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 150,
    "annualFeeDisplay": "$150 (waived first year)",
    "signupBonus": "50,000 SkyMiles (all-time high: 80,000)",
    "signupBonusValue": "~$600 in travel",
    "spendRequirement": "$2,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "First checked bag free (value: ~$25)"
    ],
    "categories": [
      "travel",
      "dining"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns SkyMiles. Annual fee: $150.",
    "color": "#b8960c",
    "tags": [
      "airline co-brand",
      "dining"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-gold-american-express-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-2",
    "name": "Delta SkyMiles Gold Business",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 150,
    "annualFeeDisplay": "$150 (waived first year)",
    "signupBonus": "60,000 SkyMiles (all-time high: 90,000)",
    "signupBonusValue": "~$700 in travel",
    "spendRequirement": "$4,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns SkyMiles"
    ],
    "categories": [
      "travel",
      "dining"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns SkyMiles. Annual fee: $150.",
    "color": "#b8960c",
    "tags": [
      "business",
      "airline co-brand",
      "dining"
    ],
    "applyUrl": "https://www.americanexpress.com/en-us/business/credit-cards/delta-skymiles-gold/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-3",
    "name": "Delta SkyMiles Platinum",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 350,
    "annualFeeDisplay": "$350",
    "signupBonus": "60,000 SkyMiles (all-time high: 90,000)",
    "signupBonusValue": "~$700 in travel",
    "spendRequirement": "$3,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Companion Pass (value: ~$350)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 7,
    "churnerNote": "Earns SkyMiles. Annual fee: $350.",
    "color": "#b8960c",
    "tags": [
      "airline co-brand",
      "premium"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-platinum-american-express-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-4",
    "name": "Delta SkyMiles Platinum Business",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 350,
    "annualFeeDisplay": "$350",
    "signupBonus": "70,000 SkyMiles (all-time high: 100,000)",
    "signupBonusValue": "~$850 in travel",
    "spendRequirement": "$6,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Companion Pass (value: ~$350)",
      "PreCheck Credit (value: ~$40)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 8,
    "churnerNote": "Earns SkyMiles. Annual fee: $350.",
    "color": "#b8960c",
    "tags": [
      "business",
      "airline co-brand",
      "premium"
    ],
    "applyUrl": "https://www.americanexpress.com/en-us/business/credit-cards/delta-skymiles-platinum/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-5",
    "name": "Delta SkyMiles Reserve",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 650,
    "annualFeeDisplay": "$650",
    "signupBonus": "70,000 SkyMiles (all-time high: 125,000)",
    "signupBonusValue": "~$850 in travel",
    "spendRequirement": "$5,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Resy Credit (value: ~$192)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "excellent",
    "churnerRating": 6,
    "churnerNote": "Earns SkyMiles. Annual fee: $650.",
    "color": "#b8960c",
    "tags": [
      "airline co-brand",
      "premium"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-reserve-american-express-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-6",
    "name": "Delta SkyMiles Reserve Business",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 550,
    "annualFeeDisplay": "$550",
    "signupBonus": "80,000 SkyMiles (all-time high: 110,000)",
    "signupBonusValue": "~$950 in travel",
    "spendRequirement": "$10,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns SkyMiles"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "excellent",
    "churnerRating": 6,
    "churnerNote": "Earns SkyMiles. Annual fee: $550.",
    "color": "#b8960c",
    "tags": [
      "business",
      "airline co-brand",
      "premium"
    ],
    "applyUrl": "https://www.americanexpress.com/en-us/business/credit-cards/delta-skymiles-reserve/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-7",
    "name": "Blue Business Cash",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "$250 cash back (all-time high: 500)",
    "signupBonusValue": "$250",
    "spendRequirement": "$3,000 in 3 months",
    "rewardRate": "2x on all purchases",
    "topPerks": [
      "2x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#b8960c",
    "tags": [
      "no annual fee",
      "business",
      "cashback",
      "flat-rate"
    ],
    "applyUrl": "https://www.americanexpress.com/en-us/business/credit-cards/blue-business-cash/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-8",
    "name": "Blue Business Plus",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "15,000 Membership Rewards (all-time high: 50,000)",
    "signupBonusValue": "~$300 in travel",
    "spendRequirement": "$3,000 in 3 months",
    "rewardRate": "2x on all purchases",
    "topPerks": [
      "Earns Membership Rewards",
      "2x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Membership Rewards. Annual fee: $0.",
    "color": "#b8960c",
    "tags": [
      "no annual fee",
      "business",
      "transferable points"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-blue-business-plus-credit-card-amex/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-9",
    "name": "Blue Cash Everyday",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "$200 cash back",
    "signupBonusValue": "$200",
    "spendRequirement": "$2,000 in 6 months",
    "rewardRate": "2x on all purchases",
    "topPerks": [
      "2x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#b8960c",
    "tags": [
      "no annual fee",
      "cashback",
      "flat-rate"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-10",
    "name": "Blue Cash Preferred",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 95,
    "annualFeeDisplay": "$95 (waived first year)",
    "signupBonus": "$250 cash back (all-time high: 300)",
    "signupBonusValue": "$250",
    "spendRequirement": "$3,000 in 6 months",
    "rewardRate": "2x on all purchases",
    "topPerks": [
      "$7/mo Disney Bundle Credit (value: ~$21)"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 5,
    "churnerNote": "Earns cash back. Annual fee: $95.",
    "color": "#b8960c",
    "tags": [
      "cashback",
      "flat-rate"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-11",
    "name": "Business Gold",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 375,
    "annualFeeDisplay": "$375",
    "signupBonus": "100,000 Membership Rewards (all-time high: 200,000)",
    "signupBonusValue": "~$2,000 in travel",
    "spendRequirement": "$15,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Membership Rewards"
    ],
    "categories": [
      "dining"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 8,
    "churnerNote": "Earns Membership Rewards. Annual fee: $375.",
    "color": "#b8960c",
    "tags": [
      "business",
      "transferable points",
      "dining"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card-amex/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-12",
    "name": "Business Green",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "15,000 Membership Rewards (all-time high: 25,000)",
    "signupBonusValue": "~$300 in travel",
    "spendRequirement": "$3,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Membership Rewards"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 5,
    "churnerNote": "Earns Membership Rewards. Annual fee: $95.",
    "color": "#b8960c",
    "tags": [
      "business",
      "transferable points"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-green-card-amex/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-13",
    "name": "Business Platinum",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 695,
    "annualFeeDisplay": "$695",
    "signupBonus": "200,000 Membership Rewards (all-time high: 250,000)",
    "signupBonusValue": "~$4,000 in travel",
    "spendRequirement": "$20,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Hotel Credit (value: ~$540)",
      "Lounge Access (value: ~$213)",
      "Airline Fee Credit (value: ~$50)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus",
      "lounge_perks"
    ],
    "creditRequired": "excellent",
    "churnerRating": 8,
    "churnerNote": "Earns Membership Rewards. Annual fee: $695.",
    "color": "#b8960c",
    "tags": [
      "business",
      "transferable points",
      "premium"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-14",
    "name": "Gold",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 350,
    "annualFeeDisplay": "$350",
    "signupBonus": "60,000 Membership Rewards (all-time high: 90,000)",
    "signupBonusValue": "~$1,200 in travel",
    "spendRequirement": "$6,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Semi-annual $50 Resy credit (value: ~$80)",
      "$10/mo Uber credit (value: ~$60)",
      "$10/mo dining credit (value: ~$60)"
    ],
    "categories": [
      "dining"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 8,
    "churnerNote": "Earns Membership Rewards. Annual fee: $350.",
    "color": "#b8960c",
    "tags": [
      "transferable points",
      "dining"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-15",
    "name": "Green",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 150,
    "annualFeeDisplay": "$150",
    "signupBonus": "40,000 Membership Rewards (all-time high: 60,000)",
    "signupBonusValue": "~$800 in travel",
    "spendRequirement": "$3,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "PreCheck Credit (value: ~$40)",
      "Lounge Access Credit (value: ~$25)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "lounge_perks"
    ],
    "creditRequired": "good",
    "churnerRating": 7,
    "churnerNote": "Earns Membership Rewards. Annual fee: $150.",
    "color": "#b8960c",
    "tags": [
      "transferable points"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/green/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-16",
    "name": "Hilton Honors",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "100,000 Hilton Honors",
    "signupBonusValue": "~$500 in travel",
    "spendRequirement": "$2,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Hilton Honors",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 7,
    "churnerNote": "Earns Hilton Honors. Annual fee: $0.",
    "color": "#b8960c",
    "tags": [
      "no annual fee",
      "hotel co-brand"
    ],
    "applyUrl": "https://www.hilton.com/en/hilton-honors/credit-cards/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-17",
    "name": "Hilton Honors Aspire",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 550,
    "annualFeeDisplay": "$550",
    "signupBonus": "175,000 Hilton Honors (all-time high: 180,000)",
    "signupBonusValue": "~$900 in travel",
    "spendRequirement": "$6,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Hilton Resort Credit (value: ~$200)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "excellent",
    "churnerRating": 6,
    "churnerNote": "Earns Hilton Honors. Annual fee: $550.",
    "color": "#b8960c",
    "tags": [
      "hotel co-brand",
      "premium"
    ],
    "applyUrl": "https://www.hilton.com/en/hilton-honors/credit-cards/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-18",
    "name": "Hilton Honors Business",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 175,
    "annualFeeDisplay": "$175",
    "signupBonus": "175,000 Hilton Honors",
    "signupBonusValue": "~$900 in travel",
    "spendRequirement": "$6,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$60 Hilton credit per quarter (value: ~$120)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 7,
    "churnerNote": "Earns Hilton Honors. Annual fee: $175.",
    "color": "#b8960c",
    "tags": [
      "business",
      "hotel co-brand"
    ],
    "applyUrl": "https://www.hilton.com/en/hilton-honors/credit-cards/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-19",
    "name": "Hilton Honors Surpass",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "155,000 Hilton Honors (all-time high: 170,000)",
    "signupBonusValue": "~$800 in travel",
    "spendRequirement": "$3,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Hilton Honors"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Hilton Honors. Annual fee: $95.",
    "color": "#b8960c",
    "tags": [
      "hotel co-brand"
    ],
    "applyUrl": "https://www.hilton.com/en/hilton-honors/credit-cards/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-20",
    "name": "Marriott Bonvoy Brilliant",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 650,
    "annualFeeDisplay": "$650",
    "signupBonus": "100,000 Marriott Bonvoy (all-time high: 200,000)",
    "signupBonusValue": "~$800 in travel",
    "spendRequirement": "$6,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$25/mo Dining Credit (value: ~$240)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "excellent",
    "churnerRating": 6,
    "churnerNote": "Earns Marriott Bonvoy. Annual fee: $650.",
    "color": "#b8960c",
    "tags": [
      "hotel co-brand",
      "premium"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-brilliant/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-21",
    "name": "Marriott Bonvoy Business",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 125,
    "annualFeeDisplay": "$125",
    "signupBonus": "75,000 Marriott Bonvoy (all-time high: 125,000)",
    "signupBonusValue": "~$600 in travel",
    "spendRequirement": "$6,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Marriott Bonvoy"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Marriott Bonvoy. Annual fee: $125.",
    "color": "#b8960c",
    "tags": [
      "business",
      "hotel co-brand"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/amex-marriott-bonvoy-business-credit-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-22",
    "name": "Platinum",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 895,
    "annualFeeDisplay": "$895",
    "signupBonus": "100,000 Membership Rewards (all-time high: 175,000)",
    "signupBonusValue": "~$2,000 in travel",
    "spendRequirement": "$8,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Hotel Credit (value: ~$540)",
      "Resy Credit (value: ~$320)",
      "Lounge Access (value: ~$213)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus",
      "lounge_perks"
    ],
    "creditRequired": "excellent",
    "churnerRating": 8,
    "churnerNote": "Earns Membership Rewards. Annual fee: $895.",
    "color": "#b8960c",
    "tags": [
      "transferable points",
      "premium"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/platinum/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-23",
    "name": "Marriott Bonvoy Bevy",
    "issuer": "American Express",
    "network": "Amex",
    "annualFee": 250,
    "annualFeeDisplay": "$250",
    "signupBonus": "85,000 Marriott Bonvoy (all-time high: 175,000)",
    "signupBonusValue": "~$700 in travel",
    "spendRequirement": "$7,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Marriott Bonvoy"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Marriott Bonvoy. Annual fee: $250.",
    "color": "#b8960c",
    "tags": [
      "hotel co-brand"
    ],
    "applyUrl": "https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-bevy/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-24",
    "name": "Air France KLM",
    "issuer": "Bank of America",
    "network": "Mastercard",
    "annualFee": 89,
    "annualFeeDisplay": "$89",
    "signupBonus": "50,000 Flying Blue (all-time high: 70,000)",
    "signupBonusValue": "~$700 in travel",
    "spendRequirement": "$2,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Flying Blue"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Flying Blue. Annual fee: $89.",
    "color": "#c8102e",
    "tags": [
      "airline co-brand"
    ],
    "applyUrl": "https://wwws.airfrance.us/information/flyingblue/carte-bancaire-partenaire",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-25",
    "name": "Customized Cash Rewards",
    "issuer": "Bank of America",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "$200 cash back (all-time high: 300)",
    "signupBonusValue": "$200",
    "spendRequirement": "$1,000 in 3 months",
    "rewardRate": "1x on all purchases",
    "topPerks": [
      "1x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#c8102e",
    "tags": [
      "no annual fee",
      "cashback"
    ],
    "applyUrl": "https://www.bankofamerica.com/credit-cards/products/cash-back-credit-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-26",
    "name": "Premium Rewards",
    "issuer": "Bank of America",
    "network": "Visa",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "60,000 BofA Points",
    "signupBonusValue": "~$600 in travel",
    "spendRequirement": "$4,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns BofA Points"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns BofA Points. Annual fee: $95.",
    "color": "#c8102e",
    "tags": [],
    "applyUrl": "https://www.bankofamerica.com/credit-cards/products/premium-rewards-credit-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-27",
    "name": "Premium Rewards Elite",
    "issuer": "Bank of America",
    "network": "Visa",
    "annualFee": 550,
    "annualFeeDisplay": "$550",
    "signupBonus": "75,000 BofA Points",
    "signupBonusValue": "~$750 in travel",
    "spendRequirement": "$5,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Annual $150 lifestyle credit (value: ~$120)",
      "Airline Statement Credits (value: ~$90)",
      "PreCheck Credit (value: ~$40)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "excellent",
    "churnerRating": 5,
    "churnerNote": "Earns BofA Points. Annual fee: $550.",
    "color": "#c8102e",
    "tags": [
      "premium"
    ],
    "applyUrl": "https://www.bankofamerica.com/credit-cards/products/premium-rewards-elite-credit-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-28",
    "name": "Travel Rewards",
    "issuer": "Bank of America",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "25,000 BofA Points",
    "signupBonusValue": "~$250 in travel",
    "spendRequirement": "$1,000 in 3 months",
    "rewardRate": "1.5x on all purchases",
    "topPerks": [
      "Earns BofA Points",
      "1.5x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns BofA Points. Annual fee: $0.",
    "color": "#c8102e",
    "tags": [
      "no annual fee",
      "travel"
    ],
    "applyUrl": "https://www.bankofamerica.com/credit-cards/products/travel-rewards-credit-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-29",
    "name": "AAdvantage Aviator Red World Elite",
    "issuer": "Barclays",
    "network": "Mastercard",
    "annualFee": 99,
    "annualFeeDisplay": "$99",
    "signupBonus": "50,000 AAdvantage (all-time high: 75,000)",
    "signupBonusValue": "~$700 in travel",
    "spendRequirement": "$99 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns AAdvantage"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns AAdvantage. Annual fee: $99.",
    "color": "#00aeef",
    "tags": [
      "airline co-brand"
    ],
    "applyUrl": "https://cards.barclaycardus.com/banking/cards/aadvantage-aviator-red-world-elite-mastercard/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-30",
    "name": "AAdvantage Aviator World Elite Business",
    "issuer": "Barclays",
    "network": "Mastercard",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "No current offer",
    "signupBonusValue": "N/A",
    "spendRequirement": "N/A",
    "rewardRate": "Varies by category",
    "topPerks": [
      "First checked bag free (value: ~$25)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 5,
    "churnerNote": "Earns AAdvantage. Annual fee: $95.",
    "color": "#00aeef",
    "tags": [
      "business",
      "airline co-brand"
    ],
    "applyUrl": "https://creditcards.aa.com/barclay-credit-card-aviator-business-american-airlines-aadvantage/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-31",
    "name": "Emirates Skywards Rewards World Elite",
    "issuer": "Barclays",
    "network": "Mastercard",
    "annualFee": 99,
    "annualFeeDisplay": "$99",
    "signupBonus": "40,000 Skywards Miles (all-time high: 60,000)",
    "signupBonusValue": "~$500 in travel",
    "spendRequirement": "$3,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Skywards Miles"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Skywards Miles. Annual fee: $99.",
    "color": "#00aeef",
    "tags": [
      "airline co-brand"
    ],
    "applyUrl": "https://cards.barclaycardus.com/banking/cards/emirates-skywards-rewards-world-elite-mastercard/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-32",
    "name": "JetBlue Card",
    "issuer": "Barclays",
    "network": "Mastercard",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "15,000 TrueBlue (all-time high: 20,000)",
    "signupBonusValue": "~$200 in travel",
    "spendRequirement": "$1,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns TrueBlue",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns TrueBlue. Annual fee: $0.",
    "color": "#00aeef",
    "tags": [
      "no annual fee",
      "airline co-brand"
    ],
    "applyUrl": "https://cards.barclaycardus.com/banking/cards/jetblue-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-33",
    "name": "JetBlue Plus",
    "issuer": "Barclays",
    "network": "Mastercard",
    "annualFee": 99,
    "annualFeeDisplay": "$99",
    "signupBonus": "60,000 TrueBlue (all-time high: 80,000)",
    "signupBonusValue": "~$800 in travel",
    "spendRequirement": "$1,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$100 annual JetBlue credit (value: ~$80)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns TrueBlue. Annual fee: $99.",
    "color": "#00aeef",
    "tags": [
      "airline co-brand"
    ],
    "applyUrl": "https://cards.barclaycardus.com/banking/cards/jetblue-plus-card/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-34",
    "name": "Active Cash",
    "issuer": "Wells Fargo",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "$200 cash back",
    "signupBonusValue": "$200",
    "spendRequirement": "$500 in 3 months",
    "rewardRate": "2x on all purchases",
    "topPerks": [
      "2x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#d03027",
    "tags": [
      "no annual fee",
      "cashback",
      "flat-rate"
    ],
    "applyUrl": "https://www.wellsfargo.com/credit-cards/active-cash/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-35",
    "name": "Autograph",
    "issuer": "Wells Fargo",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "20,000 Rewards Points (all-time high: 30,000)",
    "signupBonusValue": "~$200 in travel",
    "spendRequirement": "$1,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Rewards Points",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Rewards Points. Annual fee: $0.",
    "color": "#d03027",
    "tags": [
      "no annual fee",
      "transferable points"
    ],
    "applyUrl": "https://www.wellsfargo.com/credit-cards/autograph/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-36",
    "name": "Autograph Journey",
    "issuer": "Wells Fargo",
    "network": "Visa",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "60,000 Rewards Points",
    "signupBonusValue": "~$600 in travel",
    "spendRequirement": "$1,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$50 annual hotel credit (value: ~$45)",
      "$50 annual airline credit (value: ~$25)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Rewards Points. Annual fee: $95.",
    "color": "#d03027",
    "tags": [
      "transferable points"
    ],
    "applyUrl": "https://www.wellsfargo.com/credit-cards/autograph-journey/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-37",
    "name": "Double Cash",
    "issuer": "Citi",
    "network": "Mastercard",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "$200 cash back",
    "signupBonusValue": "$200",
    "spendRequirement": "$1,500 in 6 months",
    "rewardRate": "2x on all purchases",
    "topPerks": [
      "2x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#003f7f",
    "tags": [
      "no annual fee",
      "cashback",
      "flat-rate"
    ],
    "applyUrl": "https://www.citi.com/credit-cards/citi-double-cash-credit-card",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-38",
    "name": "Strata Premier",
    "issuer": "Citi",
    "network": "Mastercard",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "75,000 ThankYou Points",
    "signupBonusValue": "~$1,200 in travel",
    "spendRequirement": "$4,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns ThankYou Points"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 8,
    "churnerNote": "Earns ThankYou Points. Annual fee: $95.",
    "color": "#003f7f",
    "tags": [
      "transferable points"
    ],
    "applyUrl": "https://www.citi.com/credit-cards/citi-strata-premier-credit-card",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-39",
    "name": "AAdvantage Platinum Select",
    "issuer": "Citi",
    "network": "Mastercard",
    "annualFee": 99,
    "annualFeeDisplay": "$99 (waived first year)",
    "signupBonus": "50,000 AAdvantage (all-time high: 75,000)",
    "signupBonusValue": "~$700 in travel",
    "spendRequirement": "$2,500 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "First checked bag free (value: ~$25)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns AAdvantage. Annual fee: $99.",
    "color": "#003f7f",
    "tags": [
      "airline co-brand",
      "premium"
    ],
    "applyUrl": "https://www.citi.com/credit-cards/citi-aadvantage-platinum-select-credit-card",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-40",
    "name": "AAdvantage Executive World Elite",
    "issuer": "Citi",
    "network": "Mastercard",
    "annualFee": 595,
    "annualFeeDisplay": "$595",
    "signupBonus": "70,000 AAdvantage (all-time high: 100,000)",
    "signupBonusValue": "~$1,000 in travel",
    "spendRequirement": "$10,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Admirals Club membership (value: ~$585)",
      "First checked bag free (value: ~$25)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "excellent",
    "churnerRating": 7,
    "churnerNote": "Earns AAdvantage. Annual fee: $595.",
    "color": "#003f7f",
    "tags": [
      "airline co-brand",
      "premium"
    ],
    "applyUrl": "https://www.citi.com/credit-cards/citi-aadvantage-executive-world-elite-credit-card",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-41",
    "name": "Custom Cash",
    "issuer": "Citi",
    "network": "Mastercard",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "$200 cash back",
    "signupBonusValue": "$200",
    "spendRequirement": "$1,500 in 6 months",
    "rewardRate": "1x on all purchases",
    "topPerks": [
      "1x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#003f7f",
    "tags": [
      "no annual fee",
      "cashback"
    ],
    "applyUrl": "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-42",
    "name": "Sapphire Preferred",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "60,000 Ultimate Rewards (all-time high: 80,000)",
    "signupBonusValue": "~$1,050 in travel",
    "spendRequirement": "$4,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$50 annual hotel credit (value: ~$45)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 7,
    "churnerNote": "Earns Ultimate Rewards. Annual fee: $95.",
    "color": "#003087",
    "tags": [
      "transferable points",
      "travel"
    ],
    "applyUrl": "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-43",
    "name": "Sapphire Reserve",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 550,
    "annualFeeDisplay": "$550",
    "signupBonus": "60,000 Ultimate Rewards (all-time high: 80,000)",
    "signupBonusValue": "~$1,050 in travel",
    "spendRequirement": "$4,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$300 annual travel credit (value: ~$285)",
      "Priority Pass lounge access (value: ~$120)",
      "Global Entry/TSA PreCheck credit (value: ~$40)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus",
      "lounge_perks"
    ],
    "creditRequired": "excellent",
    "churnerRating": 7,
    "churnerNote": "Earns Ultimate Rewards. Annual fee: $550.",
    "color": "#003087",
    "tags": [
      "transferable points",
      "travel",
      "premium"
    ],
    "applyUrl": "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-44",
    "name": "Ink Business Preferred",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "100,000 Ultimate Rewards (all-time high: 120,000)",
    "signupBonusValue": "~$1,600 in travel",
    "spendRequirement": "$8,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Ultimate Rewards"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 8,
    "churnerNote": "Earns Ultimate Rewards. Annual fee: $95.",
    "color": "#003087",
    "tags": [
      "business",
      "transferable points"
    ],
    "applyUrl": "https://creditcards.chase.com/business-credit-cards/ink/preferred",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-45",
    "name": "Ink Business Cash",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "90,000 Ultimate Rewards",
    "signupBonusValue": "~$1,600 in travel",
    "spendRequirement": "$6,000 in 6 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Ultimate Rewards",
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 9,
    "churnerNote": "Earns Ultimate Rewards. Annual fee: $0.",
    "color": "#003087",
    "tags": [
      "no annual fee",
      "business",
      "transferable points"
    ],
    "applyUrl": "https://creditcards.chase.com/business-credit-cards/ink/cash",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-46",
    "name": "Ink Business Unlimited",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "90,000 Ultimate Rewards",
    "signupBonusValue": "~$1,600 in travel",
    "spendRequirement": "$6,000 in 6 months",
    "rewardRate": "1.5x on all purchases",
    "topPerks": [
      "Earns Ultimate Rewards",
      "1.5x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 9,
    "churnerNote": "Earns Ultimate Rewards. Annual fee: $0.",
    "color": "#003087",
    "tags": [
      "no annual fee",
      "business",
      "transferable points"
    ],
    "applyUrl": "https://creditcards.chase.com/business-credit-cards/ink/unlimited",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-47",
    "name": "Freedom Flex",
    "issuer": "Chase",
    "network": "Mastercard",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "20,000 Ultimate Rewards",
    "signupBonusValue": "~$350 in travel",
    "spendRequirement": "$500 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Ultimate Rewards",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Ultimate Rewards. Annual fee: $0.",
    "color": "#003087",
    "tags": [
      "no annual fee",
      "transferable points"
    ],
    "applyUrl": "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-48",
    "name": "Freedom Unlimited",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "20,000 Ultimate Rewards",
    "signupBonusValue": "~$350 in travel",
    "spendRequirement": "$500 in 3 months",
    "rewardRate": "1.5x on all purchases",
    "topPerks": [
      "Earns Ultimate Rewards",
      "1.5x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Ultimate Rewards. Annual fee: $0.",
    "color": "#003087",
    "tags": [
      "no annual fee",
      "transferable points"
    ],
    "applyUrl": "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-49",
    "name": "United Explorer",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 95,
    "annualFeeDisplay": "$95 (waived first year)",
    "signupBonus": "50,000 MileagePlus (all-time high: 70,000)",
    "signupBonusValue": "~$650 in travel",
    "spendRequirement": "$3,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "2 United Club passes/year (value: ~$70)",
      "First checked bag free (value: ~$25)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns MileagePlus. Annual fee: $95.",
    "color": "#003087",
    "tags": [
      "airline co-brand"
    ],
    "applyUrl": "https://creditcards.chase.com/travel-credit-cards/united/explorer",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-50",
    "name": "United Quest",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 250,
    "annualFeeDisplay": "$250",
    "signupBonus": "70,000 MileagePlus (all-time high: 90,000)",
    "signupBonusValue": "~$900 in travel",
    "spendRequirement": "$4,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$125 annual United credit (value: ~$113)",
      "First and second checked bag free (value: ~$50)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 7,
    "churnerNote": "Earns MileagePlus. Annual fee: $250.",
    "color": "#003087",
    "tags": [
      "airline co-brand"
    ],
    "applyUrl": "https://creditcards.chase.com/travel-credit-cards/united/quest",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-51",
    "name": "United Club Infinite",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 525,
    "annualFeeDisplay": "$525",
    "signupBonus": "80,000 MileagePlus (all-time high: 100,000)",
    "signupBonusValue": "~$1,050 in travel",
    "spendRequirement": "$5,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "United Club membership (value: ~$585)",
      "First and second checked bag free (value: ~$50)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "excellent",
    "churnerRating": 7,
    "churnerNote": "Earns MileagePlus. Annual fee: $525.",
    "color": "#003087",
    "tags": [
      "airline co-brand",
      "premium"
    ],
    "applyUrl": "https://creditcards.chase.com/travel-credit-cards/united/club-infinite",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-52",
    "name": "Southwest Rapid Rewards Plus",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 69,
    "annualFeeDisplay": "$69",
    "signupBonus": "50,000 Rapid Rewards",
    "signupBonusValue": "~$700 in travel",
    "spendRequirement": "$1,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "3,000 anniversary bonus points (value: ~$42)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Rapid Rewards. Annual fee: $69.",
    "color": "#003087",
    "tags": [
      "airline co-brand"
    ],
    "applyUrl": "https://creditcards.chase.com/travel-credit-cards/southwest-rapid-rewards/plus",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-53",
    "name": "Southwest Rapid Rewards Priority",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 149,
    "annualFeeDisplay": "$149",
    "signupBonus": "50,000 Rapid Rewards",
    "signupBonusValue": "~$700 in travel",
    "spendRequirement": "$1,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "7,500 anniversary bonus points (value: ~$105)",
      "$75 annual Southwest travel credit (value: ~$68)",
      "4 upgraded boardings/year (value: ~$40)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Rapid Rewards. Annual fee: $149.",
    "color": "#003087",
    "tags": [
      "airline co-brand"
    ],
    "applyUrl": "https://creditcards.chase.com/travel-credit-cards/southwest-rapid-rewards/priority",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-54",
    "name": "Southwest Rapid Rewards Premier",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 99,
    "annualFeeDisplay": "$99",
    "signupBonus": "50,000 Rapid Rewards",
    "signupBonusValue": "~$700 in travel",
    "spendRequirement": "$1,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "6,000 anniversary bonus points (value: ~$84)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Rapid Rewards. Annual fee: $99.",
    "color": "#003087",
    "tags": [
      "airline co-brand"
    ],
    "applyUrl": "https://creditcards.chase.com/travel-credit-cards/southwest-rapid-rewards/premier",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-55",
    "name": "Marriott Bonvoy Boundless",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "100,000 Marriott Bonvoy (all-time high: 125,000)",
    "signupBonusValue": "~$800 in travel",
    "spendRequirement": "$3,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "1 free night award annually (value: ~$120)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 7,
    "churnerNote": "Earns Marriott Bonvoy. Annual fee: $95.",
    "color": "#003087",
    "tags": [
      "hotel co-brand"
    ],
    "applyUrl": "https://creditcards.chase.com/travel-credit-cards/marriott-bonvoy/boundless",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-56",
    "name": "Marriott Bonvoy Bold",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "60,000 Marriott Bonvoy",
    "signupBonusValue": "~$500 in travel",
    "spendRequirement": "$2,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Marriott Bonvoy",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 7,
    "churnerNote": "Earns Marriott Bonvoy. Annual fee: $0.",
    "color": "#003087",
    "tags": [
      "no annual fee",
      "hotel co-brand"
    ],
    "applyUrl": "https://creditcards.chase.com/travel-credit-cards/marriott-bonvoy/bold",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-57",
    "name": "World of Hyatt",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "30,000 World of Hyatt (all-time high: 60,000)",
    "signupBonusValue": "~$600 in travel",
    "spendRequirement": "$3,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "1 free night Cat 1-4 annually (value: ~$120)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns World of Hyatt. Annual fee: $95.",
    "color": "#003087",
    "tags": [
      "hotel co-brand"
    ],
    "applyUrl": "https://creditcards.chase.com/travel-credit-cards/world-of-hyatt",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-58",
    "name": "Amazon Prime Rewards Visa",
    "issuer": "Chase",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "$100 cash back (all-time high: 200)",
    "signupBonusValue": "$100",
    "spendRequirement": "$0 in 3 months",
    "rewardRate": "1x on all purchases",
    "topPerks": [
      "1x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#003087",
    "tags": [
      "no annual fee",
      "cashback"
    ],
    "applyUrl": "https://www.amazon.com/Amazon-Prime-Rewards-Visa-Signature-Card/dp/BT00LN946S",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-59",
    "name": "Venture Rewards",
    "issuer": "Capital One",
    "network": "Visa",
    "annualFee": 95,
    "annualFeeDisplay": "$95",
    "signupBonus": "75,000 Capital One Miles",
    "signupBonusValue": "~$1,150 in travel",
    "spendRequirement": "$4,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Global Entry/TSA PreCheck credit (value: ~$40)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 7,
    "churnerNote": "Earns Capital One Miles. Annual fee: $95.",
    "color": "#c41e3a",
    "tags": [
      "transferable points",
      "travel"
    ],
    "applyUrl": "https://www.capitalone.com/credit-cards/venture/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-60",
    "name": "Venture X",
    "issuer": "Capital One",
    "network": "Visa",
    "annualFee": 395,
    "annualFeeDisplay": "$395",
    "signupBonus": "75,000 Capital One Miles",
    "signupBonusValue": "~$1,150 in travel",
    "spendRequirement": "$4,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$300 annual travel credit (value: ~$270)",
      "Priority Pass + Capital One Lounges (value: ~$120)",
      "10,000 anniversary bonus miles (value: ~$100)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus",
      "lounge_perks"
    ],
    "creditRequired": "good",
    "churnerRating": 8,
    "churnerNote": "Earns Capital One Miles. Annual fee: $395.",
    "color": "#c41e3a",
    "tags": [
      "transferable points",
      "travel"
    ],
    "applyUrl": "https://www.capitalone.com/credit-cards/venture-x/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-61",
    "name": "Venture X Business",
    "issuer": "Capital One",
    "network": "Visa",
    "annualFee": 395,
    "annualFeeDisplay": "$395",
    "signupBonus": "150,000 Capital One Miles",
    "signupBonusValue": "~$2,250 in travel",
    "spendRequirement": "$30,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$300 annual travel credit (value: ~$270)",
      "Priority Pass lounge access (value: ~$120)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus",
      "lounge_perks"
    ],
    "creditRequired": "good",
    "churnerRating": 9,
    "churnerNote": "Earns Capital One Miles. Annual fee: $395.",
    "color": "#c41e3a",
    "tags": [
      "business",
      "transferable points",
      "travel"
    ],
    "applyUrl": "https://www.capitalone.com/small-business/credit-cards/venture-x/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-62",
    "name": "Spark Cash Plus",
    "issuer": "Capital One",
    "network": "Mastercard",
    "annualFee": 150,
    "annualFeeDisplay": "$150",
    "signupBonus": "$1,200 cash back",
    "signupBonusValue": "$1,200",
    "spendRequirement": "$30,000 in 3 months",
    "rewardRate": "2x on all purchases",
    "topPerks": [
      "2x on all purchases"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 8,
    "churnerNote": "Earns cash back. Annual fee: $150.",
    "color": "#c41e3a",
    "tags": [
      "business",
      "cashback",
      "flat-rate"
    ],
    "applyUrl": "https://www.capitalone.com/small-business/credit-cards/spark-cash-plus/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": true
  },
  {
    "id": "api-63",
    "name": "Quicksilver",
    "issuer": "Capital One",
    "network": "Mastercard",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "$200 cash back",
    "signupBonusValue": "$200",
    "spendRequirement": "$500 in 3 months",
    "rewardRate": "1.5x on all purchases",
    "topPerks": [
      "1.5x on all purchases",
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#c41e3a",
    "tags": [
      "no annual fee",
      "cashback"
    ],
    "applyUrl": "https://www.capitalone.com/credit-cards/quicksilver/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-64",
    "name": "Savor Rewards",
    "issuer": "Capital One",
    "network": "Mastercard",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "$200 cash back",
    "signupBonusValue": "$200",
    "spendRequirement": "$500 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "No annual fee"
    ],
    "categories": [
      "dining",
      "groceries"
    ],
    "bestFor": [
      "cashback",
      "signup_bonus"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#c41e3a",
    "tags": [
      "no annual fee",
      "cashback",
      "dining"
    ],
    "applyUrl": "https://www.capitalone.com/credit-cards/savor-dining-entertainment/",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-65",
    "name": "Altitude Reserve",
    "issuer": "U.S. Bank",
    "network": "Visa",
    "annualFee": 400,
    "annualFeeDisplay": "$400",
    "signupBonus": "50,000 Altitude Points",
    "signupBonusValue": "~$750 in travel",
    "spendRequirement": "$4,500 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "$325 annual travel/mobile wallet credit (value: ~$293)",
      "Priority Pass lounge access (value: ~$100)"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points",
      "signup_bonus",
      "lounge_perks"
    ],
    "creditRequired": "excellent",
    "churnerRating": 7,
    "churnerNote": "Earns Altitude Points. Annual fee: $400.",
    "color": "#d4382a",
    "tags": [
      "travel",
      "premium"
    ],
    "applyUrl": "https://www.usbank.com/credit-cards/altitude-reserve-visa-infinite-credit-card.html",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-66",
    "name": "Altitude Connect",
    "issuer": "U.S. Bank",
    "network": "Visa",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "20,000 Altitude Points",
    "signupBonusValue": "~$300 in travel",
    "spendRequirement": "$2,000 in 3 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Altitude Points",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Altitude Points. Annual fee: $0.",
    "color": "#d4382a",
    "tags": [
      "no annual fee",
      "travel"
    ],
    "applyUrl": "https://www.usbank.com/credit-cards/altitude-connect-visa-signature-credit-card.html",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-67",
    "name": "Discover it Cash Back",
    "issuer": "Discover",
    "network": "Discover",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "No current offer",
    "signupBonusValue": "N/A",
    "spendRequirement": "$0 in 12 months",
    "rewardRate": "Varies by category",
    "topPerks": [
      "No annual fee"
    ],
    "categories": [
      "groceries"
    ],
    "bestFor": [
      "cashback"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns cash back. Annual fee: $0.",
    "color": "#ff6600",
    "tags": [
      "no annual fee",
      "cashback"
    ],
    "applyUrl": "https://www.discover.com/credit-cards/cash-back/it-card.html",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  },
  {
    "id": "api-68",
    "name": "Bilt Mastercard",
    "issuer": "Wells Fargo",
    "network": "Mastercard",
    "annualFee": 0,
    "annualFeeDisplay": "$0",
    "signupBonus": "No current offer",
    "signupBonusValue": "N/A",
    "spendRequirement": "N/A",
    "rewardRate": "Varies by category",
    "topPerks": [
      "Earns Rewards Points",
      "No annual fee"
    ],
    "categories": [
      "travel"
    ],
    "bestFor": [
      "travel_points"
    ],
    "creditRequired": "good",
    "churnerRating": 6,
    "churnerNote": "Earns Rewards Points. Annual fee: $0.",
    "color": "#d03027",
    "tags": [
      "no annual fee",
      "transferable points"
    ],
    "applyUrl": "https://www.biltrewards.com/card",
    "isLive": true,
    "isCurated": false,
    "isBusiness": false
  }
];

// ─── CARD DATABASE BUILDER ────────────────────────────────────────────────────
function useCardDatabase() {
  const cardDB = useMemo(() => {
    const curatedByName = {};
    for (const c of CURATED_CARDS) curatedByName[normalize(c.name)] = c;
    const merged = [];
    const seenNames = new Set();
    for (const apiCard of API_CARDS) {
      const key = normalize(apiCard.name);
      if (seenNames.has(key)) continue;
      seenNames.add(key);
      let curated = curatedByName[key];
      if (!curated) {
        const words = key.split(" ").filter(w => w.length > 3);
        const matchKey = Object.keys(curatedByName).find(k => words.every(w => k.includes(w)));
        curated = matchKey ? curatedByName[matchKey] : null;
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
        });
      } else {
        merged.push({ ...apiCard, isLive: true });
      }
    }
    for (const c of CURATED_CARDS) {
      if (!seenNames.has(normalize(c.name))) {
        merged.push({ ...c, isCurated: true, isLive: true });
      }
    }
    merged.sort((a, b) => {
      if (a.isCurated && !b.isCurated) return -1;
      if (!a.isCurated && b.isCurated) return 1;
      return b.churnerRating - a.churnerRating;
    });
    return merged;
  }, []);
  return { cardDB, liveStatus: "ok", totalLive: cardDB.length };
}

// ─── CURATED CARD DATABASE (rich metadata) ───────────────────────────────────
// These 20 cards have hand-written reward rates, perks, and churner notes.
// All other cards are auto-built from the live API.
const CURATED_CARDS = [
  {
    id: "csp",
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    annualFeeDisplay: "$95",
    signupBonus: "60,000 points",
    signupBonusValue: "~$750 in travel",
    spendRequirement: "$4,000 in 3 months",
    rewardRate: "3x dining, 2x travel, 1x other",
    topPerks: ["$50 annual hotel credit", "Point transfers to 14 airline/hotel partners", "Primary rental car insurance"],
    categories: ["dining", "travel"],
    bestFor: ["travel_points", "signup_bonus"],
    creditRequired: "excellent",
    churnerRating: 9,
    churnerNote: "The gold standard starter travel card. Often has elevated offers. Great transfer partners.",
    color: "#003087",
    tags: ["travel", "dining", "transferable points"],
  },
  {
    id: "csr",
    name: "Chase Sapphire Reserve",
    issuer: "Chase",
    network: "Visa",
    annualFee: 550,
    annualFeeDisplay: "$550",
    signupBonus: "60,000 points",
    signupBonusValue: "~$900 in travel",
    spendRequirement: "$4,000 in 3 months",
    rewardRate: "10x hotels & car rentals, 3x dining & travel",
    topPerks: ["$300 annual travel credit", "Priority Pass lounge access", "TSA PreCheck/Global Entry credit"],
    categories: ["travel", "dining"],
    bestFor: ["travel_points", "lounge_perks"],
    creditRequired: "excellent",
    churnerRating: 8,
    churnerNote: "High fee but $300 travel credit makes effective fee $250. Best for frequent travelers.",
    color: "#1a1a2e",
    tags: ["travel", "dining", "lounge access", "premium"],
  },
  {
    id: "amex-gold",
    name: "American Express Gold Card",
    issuer: "American Express",
    network: "Amex",
    annualFee: 250,
    annualFeeDisplay: "$250",
    signupBonus: "60,000 Membership Rewards",
    signupBonusValue: "~$900–$1,200 in travel",
    spendRequirement: "$6,000 in 6 months",
    rewardRate: "4x US restaurants, 4x US groceries (up to $25k/yr), 3x flights",
    topPerks: ["$120 dining credit (Grubhub/Cheesecake Factory)", "$120 Uber Cash annually", "No foreign transaction fees"],
    categories: ["dining", "groceries", "travel"],
    bestFor: ["travel_points", "signup_bonus"],
    creditRequired: "excellent",
    churnerRating: 9,
    churnerNote: "4x on dining and groceries is unmatched. MR points are extremely flexible with 20+ transfer partners.",
    color: "#b8960c",
    tags: ["dining", "groceries", "travel", "transferable points"],
  },
  {
    id: "amex-plat",
    name: "American Express Platinum",
    issuer: "American Express",
    network: "Amex",
    annualFee: 695,
    annualFeeDisplay: "$695",
    signupBonus: "80,000 Membership Rewards",
    signupBonusValue: "~$1,200–$1,600 in travel",
    spendRequirement: "$8,000 in 6 months",
    rewardRate: "5x flights booked direct, 5x prepaid hotels via Amex Travel",
    topPerks: ["Centurion Lounge + Priority Pass access", "$200 airline fee credit", "$200 hotel credit", "$189 CLEAR credit", "Global Entry/TSA PreCheck credit"],
    categories: ["travel"],
    bestFor: ["travel_points", "lounge_perks", "signup_bonus"],
    creditRequired: "excellent",
    churnerRating: 8,
    churnerNote: "Credit-heavy card — requires using all the credits to justify $695 fee. Lounge access alone can be worth it for frequent flyers.",
    color: "#9a9a9a",
    tags: ["travel", "lounge access", "premium", "transferable points"],
  },
  {
    id: "venture-x",
    name: "Capital One Venture X",
    issuer: "Capital One",
    network: "Visa",
    annualFee: 395,
    annualFeeDisplay: "$395",
    signupBonus: "75,000 miles",
    signupBonusValue: "~$750–$1,125",
    spendRequirement: "$4,000 in 3 months",
    rewardRate: "10x hotels & car rentals, 5x flights via C1 Travel, 2x everything else",
    topPerks: ["$300 Capital One Travel credit", "10,000 bonus miles each anniversary", "Priority Pass + Capital One lounges"],
    categories: ["travel"],
    bestFor: ["travel_points", "lounge_perks"],
    creditRequired: "excellent",
    churnerRating: 8,
    churnerNote: "Effectively a $95/yr card after $300 travel credit + 10k anniversary miles. Excellent value for the fee.",
    color: "#c41e3a",
    tags: ["travel", "lounge access", "premium", "transferable points"],
  },
  {
    id: "venture",
    name: "Capital One Venture Rewards",
    issuer: "Capital One",
    network: "Visa",
    annualFee: 95,
    annualFeeDisplay: "$95",
    signupBonus: "75,000 miles",
    signupBonusValue: "~$750",
    spendRequirement: "$4,000 in 3 months",
    rewardRate: "5x hotels/car rentals via C1 Travel, 2x everything else",
    topPerks: ["Transfer to 15+ airline/hotel partners", "Global Entry/TSA PreCheck credit", "No foreign transaction fees"],
    categories: ["travel", "dining", "groceries", "gas", "online"],
    bestFor: ["travel_points", "cashback", "signup_bonus"],
    creditRequired: "good",
    churnerRating: 7,
    churnerNote: "Simple 2x everywhere is underrated. Good for people who don't want to think about category bonuses.",
    color: "#8b0000",
    tags: ["travel", "flat-rate", "transferable points"],
  },
  {
    id: "citi-premier",
    name: "Citi Strata Premier Card",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 95,
    annualFeeDisplay: "$95",
    signupBonus: "75,000 ThankYou points",
    signupBonusValue: "~$750–$1,125",
    spendRequirement: "$4,000 in 3 months",
    rewardRate: "3x restaurants, supermarkets, gas, air travel, hotels",
    topPerks: ["$100 annual hotel benefit", "Transfer to 17+ airline partners including TrueBlue", "No foreign transaction fees"],
    categories: ["dining", "groceries", "gas", "travel"],
    bestFor: ["travel_points", "signup_bonus"],
    creditRequired: "good",
    churnerRating: 8,
    churnerNote: "Criminally underrated. 3x on 5 categories at $95 fee, plus access to Turkish Airlines Miles&Smiles via transfer.",
    color: "#003f7f",
    tags: ["travel", "dining", "groceries", "gas", "transferable points"],
  },
  {
    id: "double-cash",
    name: "Citi Double Cash Card",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 0,
    annualFeeDisplay: "$0",
    signupBonus: "$200 cash back",
    signupBonusValue: "$200",
    spendRequirement: "$1,500 in 6 months",
    rewardRate: "2% on everything (1% on purchase + 1% on payment)",
    topPerks: ["No annual fee", "Flat 2% everywhere — no categories to track", "Can be combined with ThankYou ecosystem"],
    categories: ["dining", "groceries", "gas", "online", "entertainment"],
    bestFor: ["cashback"],
    creditRequired: "good",
    churnerRating: 6,
    churnerNote: "Best no-fee cashback card if you don't want to optimize. Useful as a catch-all paired with Citi Premier.",
    color: "#2b6cb0",
    tags: ["cashback", "no annual fee", "flat-rate"],
  },
  {
    id: "bilt",
    name: "Bilt Mastercard",
    issuer: "Wells Fargo",
    network: "Mastercard",
    annualFee: 0,
    annualFeeDisplay: "$0",
    signupBonus: "None (earns 2x points on Rent Day — 1st of month)",
    signupBonusValue: "N/A",
    spendRequirement: "N/A",
    rewardRate: "1x on rent (no fee), 3x dining, 2x travel, 1x other",
    topPerks: ["Earn points on rent without fees (up to 100k/yr)", "Transfer to 14+ airline/hotel partners", "Must use 5x transactions/month to earn points"],
    categories: ["dining", "travel"],
    bestFor: ["travel_points"],
    creditRequired: "good",
    churnerRating: 7,
    churnerNote: "Unique value prop if you rent — earning transferable points on rent is essentially free money. No signup bonus though.",
    color: "#1a1a1a",
    tags: ["travel", "dining", "no annual fee", "transferable points", "rent"],
  },
  {
    id: "ink-preferred",
    name: "Ink Business Preferred",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    annualFeeDisplay: "$95",
    signupBonus: "100,000 Ultimate Rewards (all-time high: 120,000)",
    signupBonusValue: "~$1,750 in travel",
    spendRequirement: "$8,000 in 3 months",
    rewardRate: "3x travel, shipping, advertising, internet/cable/phone (up to $150k combined)",
    topPerks: ["Cell phone protection up to $1,000", "Primary rental car insurance", "Access to all Chase transfer partners"],
    categories: ["business", "travel", "online"],
    bestFor: ["travel_points", "signup_bonus"],
    creditRequired: "good",
    churnerRating: 10,
    churnerNote: "Arguably the best business card for churners. Current 100k offer is elevated — standard is 80-90k, all-time high was 120k. Very achievable spend requirement.",
    color: "#1a3a5c",
    tags: ["business", "travel", "transferable points", "high bonus"],
  },
  {
    id: "ink-cash",
    name: "Ink Business Cash",
    issuer: "Chase",
    network: "Visa",
    annualFee: 0,
    annualFeeDisplay: "$0",
    signupBonus: "90,000 Ultimate Rewards",
    signupBonusValue: "~$900 cash or $1,125 via transfer",
    spendRequirement: "$6,000 in 6 months",
    rewardRate: "5x office supplies & internet/cable/phone, 2x gas & dining",
    topPerks: ["No annual fee", "Points transfer to CSP/CSR for better value", "Extended warranty & purchase protection"],
    categories: ["business", "dining", "gas"],
    bestFor: ["cashback", "signup_bonus", "travel_points"],
    creditRequired: "good",
    churnerRating: 9,
    churnerNote: "No-fee card with 90k bonus — incredible deal. Stack with CSR/CSP to transfer points at full value.",
    color: "#2a5298",
    tags: ["business", "no annual fee", "cashback", "transferable points"],
  },
  {
    id: "us-bank-altitude-reserve",
    name: "U.S. Bank Altitude Reserve",
    issuer: "U.S. Bank",
    network: "Visa",
    annualFee: 400,
    annualFeeDisplay: "$400",
    signupBonus: "50,000 points",
    signupBonusValue: "~$750 in travel",
    spendRequirement: "$4,500 in 90 days",
    rewardRate: "5x prepaid hotels/car rentals, 3x travel & mobile wallet",
    topPerks: ["$325 annual travel credit (very broad definition)", "Priority Pass lounge access", "Real-time mobile rewards (3x on Apple/Google Pay)"],
    categories: ["travel", "dining", "online"],
    bestFor: ["travel_points", "lounge_perks"],
    creditRequired: "excellent",
    churnerRating: 7,
    churnerNote: "$325 travel credit offsets the fee well. 3x on mobile wallet is huge if you pay with phone. Underrated.",
    color: "#d4382a",
    tags: ["travel", "lounge access", "premium", "mobile wallet"],
  },
  {
    id: "amex-bce",
    name: "Blue Cash Everyday",
    issuer: "American Express",
    network: "Amex",
    annualFee: 0,
    annualFeeDisplay: "$0",
    signupBonus: "$200 statement credit",
    signupBonusValue: "$200",
    spendRequirement: "$2,000 in 6 months",
    rewardRate: "3% US supermarkets (up to $6k/yr), 3% US gas, 3% US online retail",
    topPerks: ["No annual fee", "0% intro APR 15 months", "Car rental loss/damage coverage"],
    categories: ["groceries", "gas", "online"],
    bestFor: ["cashback"],
    creditRequired: "good",
    churnerRating: 5,
    churnerNote: "Decent no-fee cashback card. Not exciting for churners but solid for beginners building credit.",
    color: "#007bc2",
    tags: ["cashback", "no annual fee", "groceries", "gas"],
  },
  {
    id: "amex-bcp",
    name: "Blue Cash Preferred",
    issuer: "American Express",
    network: "Amex",
    annualFee: 95,
    annualFeeDisplay: "$95 (waived first year)",
    signupBonus: "$250 statement credit",
    signupBonusValue: "$250",
    spendRequirement: "$3,000 in 6 months",
    rewardRate: "6% US supermarkets (up to $6k/yr), 6% streaming, 3% transit & gas",
    topPerks: ["Best-in-class grocery rewards", "Includes Disney+, Hulu, Netflix for 6%", "Car rental and return protection"],
    categories: ["groceries", "entertainment", "gas"],
    bestFor: ["cashback"],
    creditRequired: "good",
    churnerRating: 6,
    churnerNote: "6% on groceries is unbeatable if you spend heavily there. Good for families. Not a churner card but solid earner.",
    color: "#0066a1",
    tags: ["cashback", "groceries", "streaming"],
  },
  {
    id: "wf-autograph",
    name: "Wells Fargo Autograph",
    issuer: "Wells Fargo",
    network: "Visa",
    annualFee: 0,
    annualFeeDisplay: "$0",
    signupBonus: "20,000 points ($200 value)",
    signupBonusValue: "$200",
    spendRequirement: "$1,000 in 3 months",
    rewardRate: "3x restaurants, travel, gas, transit, streaming, phone plans",
    topPerks: ["No annual fee", "No foreign transaction fees", "Cell phone protection up to $600"],
    categories: ["dining", "travel", "gas", "entertainment"],
    bestFor: ["cashback", "signup_bonus"],
    creditRequired: "good",
    churnerRating: 6,
    churnerNote: "Best no-fee 3x multi-category card on the market. Easy to justify as a daily driver with no cost.",
    color: "#d03027",
    tags: ["no annual fee", "dining", "travel", "gas", "multi-category"],
  },
  {
    id: "boa-premium",
    name: "Bank of America Premium Rewards",
    issuer: "Bank of America",
    network: "Visa",
    annualFee: 95,
    annualFeeDisplay: "$95",
    signupBonus: "60,000 points ($600 value)",
    signupBonusValue: "$600",
    spendRequirement: "$4,000 in 90 days",
    rewardRate: "2x travel & dining, 1.5x everything else",
    topPerks: ["$100 airline incidental credit", "$100 Global Entry/TSA PreCheck credit", "Up to 75% bonus for Preferred Rewards members"],
    categories: ["travel", "dining"],
    bestFor: ["cashback", "travel_points"],
    creditRequired: "good",
    churnerRating: 6,
    churnerNote: "Becomes exceptional with Preferred Rewards Platinum Honors status (3.5% on travel/dining, 2.625% base). Average otherwise.",
    color: "#c8102e",
    tags: ["travel", "dining", "cashback"],
  },
  {
    id: "freedom-flex",
    name: "Chase Freedom Flex",
    issuer: "Chase",
    network: "Mastercard",
    annualFee: 0,
    annualFeeDisplay: "$0",
    signupBonus: "$200 cash back",
    signupBonusValue: "$200",
    spendRequirement: "$500 in 3 months",
    rewardRate: "5% rotating quarterly categories (up to $1,500), 3% dining & drugstores, 1% other",
    topPerks: ["No annual fee", "Pairs with CSP/CSR to convert 5% to 5x UR points", "Cell phone protection"],
    categories: ["dining", "groceries", "gas", "online"],
    bestFor: ["cashback", "travel_points"],
    creditRequired: "good",
    churnerRating: 8,
    churnerNote: "Excellent stacker card paired with CSP/CSR. 5x UR on rotating categories at $0 annual fee is tremendous.",
    color: "#004b87",
    tags: ["no annual fee", "cashback", "transferable points", "rotating categories"],
  },
  {
    id: "discover-it",
    name: "Discover it Cash Back",
    issuer: "Discover",
    network: "Discover",
    annualFee: 0,
    annualFeeDisplay: "$0",
    signupBonus: "Cashback Match™ (first year earnings doubled)",
    signupBonusValue: "Varies — effectively 10% in year 1",
    spendRequirement: "None",
    rewardRate: "5% rotating quarterly categories (up to $1,500), 1% other",
    topPerks: ["Cashback Match doubles first year earnings", "No annual fee or foreign transaction fees", "Free FICO score"],
    categories: ["groceries", "gas", "dining", "online"],
    bestFor: ["cashback"],
    creditRequired: "fair",
    churnerRating: 6,
    churnerNote: "Great first card for beginners. Cashback match can yield $300–$500 effective value in year 1.",
    color: "#ff6600",
    tags: ["no annual fee", "cashback", "rotating categories", "beginner-friendly"],
  },
  {
    id: "chase-freedom-unlimited",
    name: "Chase Freedom Unlimited",
    issuer: "Chase",
    network: "Visa",
    annualFee: 0,
    annualFeeDisplay: "$0",
    signupBonus: "$200 cash back + 5% on gas/groceries in year 1",
    signupBonusValue: "~$300 effective value",
    spendRequirement: "$500 in 3 months",
    rewardRate: "5% travel via Chase, 3% dining & drugstores, 1.5% everything else",
    topPerks: ["No annual fee", "Pairs with CSP/CSR to unlock transfer partners", "Purchase protection & extended warranty"],
    categories: ["dining", "travel", "groceries", "gas"],
    bestFor: ["cashback", "travel_points"],
    creditRequired: "good",
    churnerRating: 8,
    churnerNote: "Best flat-rate Chase card. Crucial catch-all in the Chase ecosystem — 1.5x UR on everything with no fee.",
    color: "#1a5276",
    tags: ["no annual fee", "flat-rate", "cashback", "transferable points"],
  },
  {
    id: "amex-everyday-preferred",
    name: "Amex EveryDay Preferred",
    issuer: "American Express",
    network: "Amex",
    annualFee: 95,
    annualFeeDisplay: "$95",
    signupBonus: "15,000 Membership Rewards",
    signupBonusValue: "~$225 in travel",
    spendRequirement: "$2,000 in 6 months",
    rewardRate: "4.5x US supermarkets (30+ uses/month), 3x gas, 1.5x other",
    topPerks: ["30% bonus for 30+ transactions/month", "Amex Offers access", "Transfer to MR airline partners"],
    categories: ["groceries", "gas"],
    bestFor: ["travel_points"],
    creditRequired: "good",
    churnerRating: 5,
    churnerNote: "Niche card — only worth it if you frequently shop groceries and can hit 30 transactions. Amex Gold is usually better.",
    color: "#2ecc71",
    tags: ["groceries", "gas", "transferable points"],
  },
];

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SPENDING_CATEGORIES = [
  { id: "dining", label: "Dining & Restaurants", icon: "🍽️" },
  { id: "travel", label: "Travel & Hotels", icon: "✈️" },
  { id: "groceries", label: "Groceries", icon: "🛒" },
  { id: "gas", label: "Gas & Transit", icon: "⛽" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "online", label: "Online Shopping", icon: "📦" },
  { id: "business", label: "Business Expenses", icon: "💼" },
];

const GOALS = [
  { id: "travel_points", label: "Maximize Travel Points", desc: "Chase flights, hotels, upgrades" },
  { id: "cashback", label: "Pure Cash Back", desc: "Simple, no-nonsense rewards" },
  { id: "signup_bonus", label: "Signup Bonus Hunting", desc: "Churning for big welcome offers" },
  { id: "lounge_perks", label: "Airport Lounge Access", desc: "Priority Pass, Centurion, etc." },
];

const CREDIT_SCORES = [
  { id: "excellent", label: "Excellent (750+)" },
  { id: "good", label: "Good (700–749)" },
  { id: "fair", label: "Fair (650–699)" },
  { id: "building", label: "Building Credit (<650)" },
];

// ISSUERS now computed inside BrowseTab from cardDB prop


// ─── STYLES ───────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; }
  .hl { font-family: 'Playfair Display', serif; }
  .bd { font-family: 'DM Sans', sans-serif; }
  .pill {
    border: 1px solid rgba(212,175,55,0.25); border-radius: 3px;
    padding: 10px 16px; cursor: pointer; transition: all 0.18s;
    background: transparent; color: #8a8278; font-family: 'DM Sans', sans-serif;
    font-size: 13px; text-align: left; width: 100%;
  }
  .pill:hover { border-color: #d4af37; color: #e8e0d0; background: rgba(212,175,55,0.05); }
  .pill.active { border-color: #d4af37; background: rgba(212,175,55,0.1); color: #d4af37; }
  .btn {
    border: none; padding: 13px 28px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; cursor: pointer; transition: all 0.18s;
  }
  .btn-gold { background: #d4af37; color: #0a0a0f; }
  .btn-gold:hover { background: #e8c84a; transform: translateY(-1px); }
  .btn-gold:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .btn-ghost { background: transparent; border: 1px solid rgba(212,175,55,0.3); color: #d4af37; }
  .btn-ghost:hover { background: rgba(212,175,55,0.07); }
  .card-shell {
    border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.025);
    transition: all 0.25s; position: relative; overflow: hidden;
  }
  .card-shell::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent, #d4af37), transparent);
    opacity: 0.7;
  }
  .card-shell:hover { border-color: rgba(212,175,55,0.3); transform: translateY(-2px); }
  .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); }
  input, textarea, select {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    color: #e8e0d0; padding: 11px 14px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; outline: none; transition: border-color 0.18s;
  }
  input:focus, textarea:focus, select:focus { border-color: rgba(212,175,55,0.45); }
  select option { background: #141418; }
  .tag {
    display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 8px;
    border: 1px solid rgba(255,255,255,0.1); color: #6a6258; border-radius: 2px;
  }
  .tag.active-tag { border-color: rgba(212,175,55,0.5); color: #d4af37; background: rgba(212,175,55,0.07); }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px);} to { opacity:1; transform:translateY(0);} }
  .fade-up { animation: fadeUp 0.45s ease forwards; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width:26px; height:26px; border:2px solid rgba(212,175,55,0.15); border-top-color:#d4af37; border-radius:50%; animation:spin 0.75s linear infinite; }
  .nav-tab {
    padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 12px;
    letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
    background: transparent; border: none; color: #5a5248; transition: all 0.18s;
    border-bottom: 2px solid transparent;
  }
  .nav-tab:hover { color: #a09888; }
  .nav-tab.active { color: #d4af37; border-bottom-color: #d4af37; }
  .stat-box {
    padding: 16px 20px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
  }
  .progress-bar { height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; transition: width 0.8s ease; }
`;

// ─── CARD DETAIL MODAL ────────────────────────────────────────────────────────
function CardModal({ card, onClose }) {
  if (!card) return null;
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
        </div>
      </div>
    </div>
  );
}

// ─── BROWSE / DATABASE TAB ────────────────────────────────────────────────────
function BrowseTab({ cardDB }) {
  const [search, setSearch] = useState("");
  const [issuerFilter, setIssuerFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [maxFee, setMaxFee] = useState("any");
  const [sortBy, setSortBy] = useState("churnerRating");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedCard, setSelectedCard] = useState(null);

  const ISSUERS = ["All", ...new Set(cardDB.map((c) => c.issuer))];

  const FEE_OPTIONS = [
    { val: "0", label: "No Annual Fee" },
    { val: "100", label: "Up to $100" },
    { val: "300", label: "Up to $300" },
    { val: "999", label: "$300+" },
  ];

  const SORT_OPTIONS = [
    { val: "churnerRating", label: "Churner Score" },
    { val: "annualFee", label: "Annual Fee" },
    { val: "name", label: "Card Name" },
    { val: "issuer", label: "Issuer" },
  ];

  const filtered = useMemo(() => {
    let cards = [...cardDB];
    if (search) {
      const q = search.toLowerCase();
      cards = cards.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q)) ||
        c.rewardRate.toLowerCase().includes(q)
      );
    }
    if (issuerFilter !== "All") cards = cards.filter((c) => c.issuer === issuerFilter);
    if (tagFilter !== "All") cards = cards.filter((c) => c.tags.includes(tagFilter));
    if (maxFee === "0") cards = cards.filter((c) => c.annualFee === 0);
    else if (maxFee === "100") cards = cards.filter((c) => c.annualFee <= 100);
    else if (maxFee === "300") cards = cards.filter((c) => c.annualFee <= 300);
    else if (maxFee === "999") cards = cards.filter((c) => c.annualFee > 300);

    cards.sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (typeof av === "string") av = av.toLowerCase(), bv = bv.toLowerCase();
      if (sortDir === "asc") return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
    return cards;
  }, [search, issuerFilter, tagFilter, maxFee, sortBy, sortDir]);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  return (
    <div className="fade-up">
      {selectedCard && <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />}

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
        {["All", "no annual fee", "travel", "cashback", "dining", "groceries", "business", "premium", "transferable points", "lounge access", "flat-rate"].map((t) => (
          <button key={t} onClick={() => setTagFilter(t)} className={`tag ${tagFilter === t ? "active-tag" : ""}`} style={{ cursor:"pointer", background:"transparent", border:"1px solid rgba(255,255,255,0.1)" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Sort bar */}
      <div style={{ display:"flex", gap:6, marginBottom:16, paddingBottom:12, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <span className="bd" style={{ fontSize:10, letterSpacing:"0.12em", color:"#5a5248", textTransform:"uppercase", alignSelf:"center", marginRight:4 }}>Sort:</span>
        {SORT_OPTIONS.map((s) => (
          <button key={s.val} onClick={() => toggleSort(s.val)}
            className="bd"
            style={{ background:"transparent", border:`1px solid ${sortBy===s.val?"rgba(212,175,55,0.4)":"rgba(255,255,255,0.08)"}`, color: sortBy===s.val?"#d4af37":"#6a6258", padding:"5px 12px", fontSize:11, letterSpacing:"0.08em", cursor:"pointer", textTransform:"uppercase" }}>
            {s.label} {sortBy === s.val ? (sortDir === "desc" ? "↓" : "↑") : ""}
          </button>
        ))}
        <span className="bd" style={{ fontSize:11, color:"#5a5248", alignSelf:"center", marginLeft:"auto" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Card grid */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.length === 0 && (
          <div style={{ padding:48, textAlign:"center", color:"#4a4840" }} className="bd">No cards match your filters.</div>
        )}
        {filtered.map((card, i) => (
          <div key={card.id} className="card-shell" style={{ "--accent": card.color || "#d4af37", cursor:"pointer", animationDelay:`${i*0.04}s` }} onClick={() => setSelectedCard(card)}>
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
  );
}

// ─── RECOMMEND TAB ────────────────────────────────────────────────────────────
function RecommendTab({ cardDB }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ spending:[], goal:"", creditScore:"", annualFeeComfort:"moderate", existing:"" });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const toggleSpending = (id) => setProfile((p) => ({
    ...p, spending: p.spending.includes(id) ? p.spending.filter((s) => s !== id) : [...p.spending, id],
  }));

  const buildPrompt = () => {
    const spendingLabels = profile.spending.map((id) => SPENDING_CATEGORIES.find((c) => c.id === id)?.label).join(", ");
    const goalLabel = GOALS.find((g) => g.id === profile.goal)?.label;
    const scoreLabel = CREDIT_SCORES.find((s) => s.id === profile.creditScore)?.label;
    const cardList = cardDB.map((c) => `- id:"${c.id}" | ${c.name} (${c.issuer}): ${c.rewardRate}. Signup: ${c.signupBonus}. Fee: ${c.annualFeeDisplay}. Churner score: ${c.churnerRating}/10`).join("\n");

    return `You are a credit card expert specializing in rewards optimization and churning.

User profile:
- Top spending categories: ${spendingLabels || "General spending"}
- Primary goal: ${goalLabel || "Maximize rewards"}
- Credit score: ${scoreLabel || "Good"}
- Annual fee comfort: ${profile.annualFeeComfort}
- Existing cards / notes: ${profile.existing || "None mentioned"}

Available card database (choose from these ONLY):
${cardList}

Return ONLY a JSON array of exactly 4 card IDs from the database that best match this user, ranked best to worst. You MUST use the exact id strings shown above (e.g. "csp", "amex-gold", "ink-preferred"). Format:
[
  { "id": "card-id", "personalReason": "1-2 sentences on why this specific card fits this specific user's profile", "highlight": "The single most compelling stat or perk for this user" },
  ...
]

Only recommend cards appropriate for their credit score. Prioritize their stated goal and spending categories.`;
  };

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ prompt: buildPrompt() }),
      });
      clearTimeout(timeout);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${response.status}`);
      }
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const picks = JSON.parse(clean);
      const enriched = picks.map((p) => {
        let dbCard = cardDB.find((c) => c.id === p.id);
        if (!dbCard) {
          const needle = (p.id || "").toLowerCase().replace(/-/g, " ");
          dbCard = cardDB.find((c) =>
            c.id.replace(/-/g, " ").includes(needle) ||
            needle.includes(c.id.replace(/-/g, " ")) ||
            c.name.toLowerCase().includes(needle) ||
            needle.includes(c.name.toLowerCase().split(" ").slice(0,3).join(" "))
          );
        }
        if (!dbCard) return null;
        return { ...dbCard, ...p,
          name: dbCard.name, issuer: dbCard.issuer, color: dbCard.color,
          signupBonus: dbCard.signupBonus, signupBonusValue: dbCard.signupBonusValue,
          spendRequirement: dbCard.spendRequirement, annualFeeDisplay: dbCard.annualFeeDisplay,
          annualFee: dbCard.annualFee, rewardRate: dbCard.rewardRate,
          topPerks: dbCard.topPerks, churnerNote: dbCard.churnerNote,
          churnerRating: dbCard.churnerRating, tags: dbCard.tags,
        };
      }).filter(Boolean);
      setRecommendations(enriched);
      setStep(3);
    } catch (e) {
      setError(e.name === "AbortError" ? "Request timed out — please try again." : `Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep(1); setRecommendations(null); setError(null); setProfile({ spending:[], goal:"", creditScore:"", annualFeeComfort:"moderate", existing:"" }); };

  return (
    <div>
      {selectedCard && <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />}
      {loading && (
        <div style={{ position:"fixed", inset:0, background:"rgba(10,10,15,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:18, zIndex:50 }}>
          <div className="spinner" />
          <p className="bd" style={{ fontSize:12, letterSpacing:"0.18em", color:"#5a5248", textTransform:"uppercase" }}>Analyzing your profile...</p>
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
              <button key={g.id} className={`pill ${profile.goal === g.id ? "active" : ""}`} onClick={() => setProfile((p) => ({ ...p, goal: g.id }))} style={{ padding:"14px 16px" }}>
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
                <option value="">Select...</option>
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
            <input placeholder="e.g. Chase Sapphire Preferred, Amex Gold..." value={profile.existing} onChange={(e) => setProfile((p) => ({ ...p, existing: e.target.value }))} style={{ width:"100%" }} />
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
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>Adjust Preferences</button>
              <button className="btn btn-ghost" onClick={reset}>Start Over</button>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {recommendations.map((card, i) => (
              <div key={card.id} className="card-shell fade-up" style={{ "--accent": card.color || "#d4af37", animationDelay:`${i*0.1}s` }}>
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
                      <button onClick={() => setSelectedCard(card)} className="bd" style={{ marginTop:12, background:"transparent", border:"none", color: card.color || "#d4af37", fontSize:11, letterSpacing:"0.1em", cursor:"pointer", padding:0, textTransform:"uppercase" }}>
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
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App({ session, supabase }) {
  const [tab, setTab] = useState("recommend");
  const { cardDB, liveStatus, totalLive } = useCardDatabase();
  const { preferences, savedRecs, savePreferences, saveRecommendation } =
    useUserData(supabase, session.user.id)

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", color:"#e8e0d0" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Header */}
      <header style={{ borderBottom:"1px solid rgba(212,175,55,0.12)", padding:"18px 40px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
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
            <div
              title={`Sources: ${DATA_SOURCES}\nLast refreshed: ${DATA_LAST_UPDATED}`}
              style={{ fontSize:9, letterSpacing:"0.08em", color:"#3a3830", textTransform:"uppercase", cursor:"default" }}
            >
              Updated {DATA_LAST_UPDATED}
            </div>
          </div>
          <nav style={{ display:"flex", gap:4, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <button className={`nav-tab ${tab === "recommend" ? "active" : ""}`} onClick={() => setTab("recommend")}>
              Get Recommendations
            </button>
            <button className={`nav-tab ${tab === "browse" ? "active" : ""}`} onClick={() => setTab("browse")}>
              Browse All Cards
            </button>
          </nav>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:11, color:'#4a4840' }}>
            {session.user.user_metadata?.given_name || session.user.user_metadata?.full_name?.split(' ')[0] || session.user.email}
          </span>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{ fontSize:10, letterSpacing:'0.12em', color:'#4a4840',
              textTransform:'uppercase', background:'none', border:'1px solid rgba(255,255,255,0.06)',
              padding:'4px 12px', cursor:'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth:860, margin:"0 auto", padding:"52px 40px 80px" }}>
        {tab === "recommend" ? <RecommendTab cardDB={cardDB} /> : <BrowseTab cardDB={cardDB} />}
      </main>
    </div>
  );
}