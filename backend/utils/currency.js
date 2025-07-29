// Currency configuration with country mapping
export const currencyConfig = {
  USD: { symbol: "$", name: "US Dollar", country: "US", flag: "🇺🇸" },
  EUR: { symbol: "€", name: "Euro", country: "EU", flag: "🇪🇺" },
  GBP: { symbol: "£", name: "British Pound", country: "GB", flag: "🇬🇧" },
  INR: { symbol: "₹", name: "Indian Rupee", country: "IN", flag: "🇮🇳" },
  JPY: { symbol: "¥", name: "Japanese Yen", country: "JP", flag: "🇯🇵" },
  CAD: { symbol: "C$", name: "Canadian Dollar", country: "CA", flag: "🇨🇦" },
  AUD: { symbol: "A$", name: "Australian Dollar", country: "AU", flag: "🇦🇺" },
  CHF: { symbol: "CHF", name: "Swiss Franc", country: "CH", flag: "🇨🇭" },
  CNY: { symbol: "¥", name: "Chinese Yuan", country: "CN", flag: "🇨🇳" },
  KRW: { symbol: "₩", name: "Korean Won", country: "KR", flag: "🇰🇷" },
  BRL: { symbol: "R$", name: "Brazilian Real", country: "BR", flag: "🇧🇷" },
  MXN: { symbol: "$", name: "Mexican Peso", country: "MX", flag: "🇲🇽" },
  RUB: { symbol: "₽", name: "Russian Ruble", country: "RU", flag: "🇷🇺" },
  ZAR: { symbol: "R", name: "South African Rand", country: "ZA", flag: "🇿🇦" },
  SGD: { symbol: "S$", name: "Singapore Dollar", country: "SG", flag: "🇸🇬" },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar", country: "HK", flag: "🇭🇰" },
  NZD: { symbol: "NZ$", name: "New Zealand Dollar", country: "NZ", flag: "🇳🇿" },
  SEK: { symbol: "kr", name: "Swedish Krona", country: "SE", flag: "🇸🇪" },
  NOK: { symbol: "kr", name: "Norwegian Krone", country: "NO", flag: "🇳🇴" },
  DKK: { symbol: "kr", name: "Danish Krone", country: "DK", flag: "🇩🇰" },
  PLN: { symbol: "zł", name: "Polish Zloty", country: "PL", flag: "🇵🇱" },
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  return currencyConfig[currencyCode]?.symbol || "$";
};

// Get currency info
export const getCurrencyInfo = (currencyCode) => {
  return currencyConfig[currencyCode] || currencyConfig["USD"];
};

// Format amount with currency
export const formatCurrency = (amount, currencyCode) => {
  const currency = currencyConfig[currencyCode] || currencyConfig["USD"];
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  try {
    return formatter.format(amount);
  } catch (error) {
    // Fallback formatting
    return `${currency.symbol}${amount.toLocaleString()}`;
  }
};

// Get all available currencies
export const getAllCurrencies = () => {
  return Object.entries(currencyConfig).map(([code, info]) => ({
    code,
    ...info,
  }));
};

// Auto-detect currency from country (you can expand this)
export const getCurrencyFromCountry = (countryCode) => {
  const countryToCurrency = {
    US: "USD",
    IN: "INR",
    GB: "GBP",
    EU: "EUR",
    DE: "EUR",
    FR: "EUR",
    IT: "EUR",
    ES: "EUR",
    JP: "JPY",
    CA: "CAD",
    AU: "AUD",
    CH: "CHF",
    CN: "CNY",
    KR: "KRW",
    BR: "BRL",
    MX: "MXN",
    RU: "RUB",
    ZA: "ZAR",
    SG: "SGD",
    HK: "HKD",
    NZ: "NZD",
    SE: "SEK",
    NO: "NOK",
    DK: "DKK",
    PL: "PLN",
  };

  return countryToCurrency[countryCode] || "USD";
};
