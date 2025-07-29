// Currency formatting utilities for backend
import { currencyConfig } from "./currency.js";

/**
 * Get currency symbol by currency code
 * @param {string} currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns {string} - The currency symbol (e.g., '$', '€')
 */
export const getCurrencySymbol = (currencyCode = "USD") => {
  const currency = currencyConfig[currencyCode];
  return currency ? currency.symbol : "$";
};

/**
 * Format amount with currency symbol for backend processing
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code
 * @returns {string} - Formatted amount with currency symbol
 */
export const formatCurrency = (amount, currencyCode = "USD") => {
  const symbol = getCurrencySymbol(currencyCode);
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol}${formattedAmount}`;
};

export default {
  getCurrencySymbol,
  formatCurrency,
};
