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
export { API_CARDS }
