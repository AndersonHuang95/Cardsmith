export interface Card {
  id: string;
  name: string;
  issuer: string;
  network: string;
  annualFee: number;
  annualFeeDisplay: string;
  signupBonus: string;
  signupBonusValue: string;
  spendRequirement: string;
  rewardRate: string;
  topPerks: string[];
  categories: string[];
  bestFor: string[];
  creditRequired: string;
  churnerRating: number;
  churnerNote: string;
  color: string;
  tags: string[];
  applyUrl: string | null;
  isLive: boolean;
  isCurated: boolean;
  isBusiness: boolean;
  /** Set by the AI recommendation response */
  personalReason?: string;
  highlight?: string;
}

export interface UserProfile {
  spending: string[];
  goal: string;
  creditScore: string;
  annualFeeComfort: string;
  existing: string;
}

export interface SpendingCategory {
  id: string;
  label: string;
  icon: string;
}

export interface Goal {
  id: string;
  label: string;
  desc: string;
}

export interface CreditScore {
  id: string;
  label: string;
}

export interface SavedRecommendation {
  id: string;
  user_id: string;
  card_ids: string[];
  reasoning: string | null;
  profile_snapshot: UserProfile | null;
  created_at: string;
}
