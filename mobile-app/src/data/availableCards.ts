import { AvailableCard } from '../types';

// List of all available credit cards users can choose from
export const AVAILABLE_CARDS: AvailableCard[] = [
  {
    id: 'amex_blue_cash_preferred',
    name: 'American Express Blue Cash Preferred',
    issuer: 'American Express',
    network: 'amex',
    description: '6% grocery, 6% streaming, 3% gas',
  },
  {
    id: 'amex_blue_cash_everyday',
    name: 'American Express Blue Cash Everyday',
    issuer: 'American Express',
    network: 'amex',
    description: '3% grocery, 3% gas, 3% online',
  },
  {
    id: 'chase_freedom_flex',
    name: 'Chase Freedom Flex',
    issuer: 'Chase',
    network: 'visa',
    description: '5% rotating categories, 3% dining',
  },
  {
    id: 'chase_freedom_unlimited',
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    network: 'visa',
    description: '1.5% on everything, 3% dining',
  },
  {
    id: 'chase_sapphire_preferred',
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    network: 'visa',
    description: '3x travel, 3x dining, 3x streaming',
  },
  {
    id: 'chase_sapphire_reserve',
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    network: 'visa',
    description: '5x travel, 3x dining',
  },
  {
    id: 'citi_double_cash',
    name: 'Citi Double Cash Card',
    issuer: 'Citi',
    network: 'mastercard',
    description: '2% on everything',
  },
  {
    id: 'citi_custom_cash',
    name: 'Citi Custom Cash Card',
    issuer: 'Citi',
    network: 'mastercard',
    description: '5% on top category (up to $500/month)',
  },
  {
    id: 'discover_it_cash_back',
    name: 'Discover it Cash Back',
    issuer: 'Discover',
    network: 'discover',
    description: '5% rotating categories',
  },
  {
    id: 'capital_one_savor',
    name: 'Capital One Savor',
    issuer: 'Capital One',
    network: 'mastercard',
    description: '4% dining, 4% entertainment',
  },
  {
    id: 'capital_one_savor_one',
    name: 'Capital One SavorOne',
    issuer: 'Capital One',
    network: 'mastercard',
    description: '3% dining, 3% entertainment',
  },
  {
    id: 'capital_one_venture',
    name: 'Capital One Venture',
    issuer: 'Capital One',
    network: 'visa',
    description: '2x miles on everything',
  },
  {
    id: 'capital_one_venture_x',
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    network: 'visa',
    description: '10x travel, 2x everything',
  },
  {
    id: 'wells_fargo_active_cash',
    name: 'Wells Fargo Active Cash',
    issuer: 'Wells Fargo',
    network: 'visa',
    description: '2% on everything',
  },
  {
    id: 'amex_gold',
    name: 'American Express Gold Card',
    issuer: 'American Express',
    network: 'amex',
    description: '4x dining, 4x grocery',
  },
  {
    id: 'amex_platinum',
    name: 'American Express Platinum',
    issuer: 'American Express',
    network: 'amex',
    description: '5x flights, 5x hotels',
  },
];

export const getCardById = (id: string): AvailableCard | undefined => {
  return AVAILABLE_CARDS.find(card => card.id === id);
};

export const groupCardsByIssuer = (): Record<string, AvailableCard[]> => {
  return AVAILABLE_CARDS.reduce((acc, card) => {
    if (!acc[card.issuer]) {
      acc[card.issuer] = [];
    }
    acc[card.issuer].push(card);
    return acc;
  }, {} as Record<string, AvailableCard[]>);
};

