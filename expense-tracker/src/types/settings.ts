export type Language = 'en' | 'tr';
export type Theme = 'light' | 'dark';
export type Currency = 'TRY';
export type ChartType = 'pie' | 'bar' | 'line' | 'doughnut';
export type DateRange = 'today' | '7days' | '15days' | '30days' | 'thisMonth' | 'lastMonth' | 'all';

export interface Settings {
  language: Language;
  theme: Theme;
  currency: Currency;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export interface CurrencyRates {
  USD: number;
  TRY: number;
  USDT: number;
} 