export type CurrencyCode = "PHP" | "USD" | "EUR" | "JPY" | "AUD" | "SGD" | "GBP";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromPHP: number; // 1 PHP = X Foreign Currency
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  PHP: { code: "PHP", symbol: "₱", name: "Philippine Peso (PHP)", rateFromPHP: 1 },
  USD: { code: "USD", symbol: "$", name: "US Dollar (USD)", rateFromPHP: 0.0175 },
  EUR: { code: "EUR", symbol: "€", name: "Euro (EUR)", rateFromPHP: 0.0162 },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen (JPY)", rateFromPHP: 2.70 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar (AUD)", rateFromPHP: 0.027 },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar (SGD)", rateFromPHP: 0.0238 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound (GBP)", rateFromPHP: 0.0138 },
};

export function formatPrice(amountInPHP: number, currencyCode: CurrencyCode = "PHP"): string {
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.PHP;
  const converted = amountInPHP * config.rateFromPHP;

  if (currencyCode === "JPY") {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }
  if (currencyCode === "PHP") {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function convertAmount(amountInPHP: number, currencyCode: CurrencyCode): number {
  const config = CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.PHP;
  return Number((amountInPHP * config.rateFromPHP).toFixed(2));
}
