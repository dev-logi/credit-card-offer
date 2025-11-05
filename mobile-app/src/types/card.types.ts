// Card-related Type Definitions

export interface AvailableCard {
  id: string;
  name: string;
  issuer: string;
  description: string;
  network?: string;
}

export interface CardSelectorItem {
  id: string;
  name: string;
  issuer: string;
  description: string;
  isSelected: boolean;
}

export interface CardDisplayData {
  id: string;
  card_name: string;
  issuer: string;
  last_four: string;
  base_reward_rate: number;
  network?: string;
  annual_fee?: number;
  reward_type?: string;
  hasOffers?: boolean;
  categoryCount?: number;
}

