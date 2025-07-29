export const currencies = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    country: "United States",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    country: "European Union",
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    country: "United Kingdom",
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    country: "India",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
    country: "Japan",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    flag: "🇨🇦",
    country: "Canada",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    flag: "🇦🇺",
    country: "Australia",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "CHF",
    flag: "🇨🇭",
    country: "Switzerland",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    symbol: "¥",
    flag: "🇨🇳",
    country: "China",
  },
  {
    code: "KRW",
    name: "Korean Won",
    symbol: "₩",
    flag: "🇰🇷",
    country: "South Korea",
  },
  {
    code: "BRL",
    name: "Brazilian Real",
    symbol: "R$",
    flag: "🇧🇷",
    country: "Brazil",
  },
  {
    code: "MXN",
    name: "Mexican Peso",
    symbol: "$",
    flag: "🇲🇽",
    country: "Mexico",
  },
  {
    code: "RUB",
    name: "Russian Ruble",
    symbol: "₽",
    flag: "🇷🇺",
    country: "Russia",
  },
  {
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
    flag: "🇿🇦",
    country: "South Africa",
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
    flag: "🇸🇬",
    country: "Singapore",
  },
  {
    code: "HKD",
    name: "Hong Kong Dollar",
    symbol: "HK$",
    flag: "🇭🇰",
    country: "Hong Kong",
  },
];

/**
 * Get currency symbol by currency code
 * @param {string} currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns {string} - The currency symbol (e.g., '$', '€')
 */
export const getCurrencySymbol = (currencyCode = "USD") => {
  const currency = currencies.find((c) => c.code === currencyCode);
  return currency ? currency.symbol : "$";
};

/**
 * Get currency info by currency code
 * @param {string} currencyCode - The currency code
 * @returns {object} - The complete currency object
 */
export const getCurrencyInfo = (currencyCode = "USD") => {
  const currency = currencies.find((c) => c.code === currencyCode);
  return currency || currencies[0]; // Default to USD if not found
};

/**
 * Format amount with currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} - Formatted amount with currency symbol
 */
export const formatCurrency = (
  amount,
  currencyCode = "USD",
  showSymbol = true
) => {
  const symbol = getCurrencySymbol(currencyCode);
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? `${symbol}${formattedAmount}` : formattedAmount;
};

/**
 * Format amount for display in components
 * @param {number} amount - The amount to format
 * @param {object} user - User object containing currency preference
 * @returns {string} - Formatted amount string
 */
export const formatAmountForDisplay = (amount, user) => {
  const currencyCode = user?.currency || "USD";
  return formatCurrency(amount, currencyCode);
};
