export type Package = {
  id: string;
  coins: number | null;
  price: number | null;
  isCustom: boolean;
};

export const PACKAGES: Package[] = [
  { id: '30', coins: 30, price: 0.33, isCustom: false },
  { id: '350', coins: 350, price: 3.79, isCustom: false },
  { id: '700', coins: 700, price: 7.59, isCustom: false },
  { id: '1400', coins: 1400, price: 15.15, isCustom: false },
  { id: '3500', coins: 3500, price: 37.89, isCustom: false },
  { id: '7000', coins: 7000, price: 75.75, isCustom: false },
  { id: '17500', coins: 17500, price: 189.35, isCustom: false },
  { id: 'custom', coins: null, price: null, isCustom: true },
];

export const CUSTOM_COIN_PRICE = 0.011; // Price per coin for custom amounts, derived from packages.
