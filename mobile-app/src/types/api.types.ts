// API Type Definitions

export interface Customer {
  id: string;
  name: string;
  email: string;
  cards?: CreditCard[];
}

export interface CustomerCreate {
  id: string;
  name: string;
  email: string;
}

export interface CreditCard {
  id: string;
  customer_id: string;
  card_name: string;
  issuer: string;
  last_four: string;
  base_reward_rate: number;
  network?: string;
  annual_fee?: number;
  reward_type?: string;
  points_value?: number;
  category_bonuses?: CategoryBonus[];
  offers?: Offer[];
}

export interface CardCreate {
  id: string;
  card_name: string;
  issuer: string;
  last_four: string;
  base_reward_rate: number;
}

export interface CategoryBonus {
  id: number;
  card_id: string;
  category: string;
  reward_rate: number;
  start_date?: string;
  end_date?: string;
  cap_per_year?: number;
  cap_per_quarter?: number;
  cap_per_month?: number;
  activation_required?: boolean;
  notes?: string;
  source_url?: string;
  last_verified?: string;
}

export interface Offer {
  id: number;
  card_id: string;
  description: string;
  merchant_name?: string;
  category?: string;
  bonus_rate: number;
  expiry_date?: string;
}

export interface RecommendationRequest {
  customer_id: string;
  merchant_name: string;
  purchase_amount?: number;
  top_n?: number;
}

export interface CardRecommendation {
  card_id: string;
  card_name: string;
  issuer: string;
  reward_rate: number;
  estimated_reward?: number;
  reward_details: string;
  categories_matched: string[];
  comparison?: string;
}

export interface RecommendationResponse {
  recommendations: CardRecommendation[];
  merchant_name: string;
  purchase_amount?: number;
  categories_identified: string[];
}

export interface HealthCheckResponse {
  status: string;
}

export interface ApiError {
  detail: string;
}

export interface NearbyMerchant {
  name: string;
  category: string;
  icon: string;
  distance: number; // in meters
  address?: string;
}

export interface NearbyMerchantsResponse {
  merchants: NearbyMerchant[];
  location?: {
    lat: number;
    lng: number;
  };
}

