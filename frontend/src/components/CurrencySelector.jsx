import React, { useState, useEffect } from "react";
import { Select, SelectItem, Button } from "@nextui-org/react";
import { toast } from "react-toastify";

const CurrencySelector = ({ selectedCurrency = "USD", onCurrencyChange }) => {
  const [localSelectedCurrency, setLocalSelectedCurrency] =
    useState(selectedCurrency);

  const currencies = [
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

  useEffect(() => {
    setLocalSelectedCurrency(selectedCurrency);
  }, [selectedCurrency]);

  const handleCurrencyUpdate = async () => {
    if (localSelectedCurrency === selectedCurrency) {
      toast.info("No changes detected");
      return;
    }

    const selectedCurrencyInfo = currencies.find(
      (c) => c.code === localSelectedCurrency
    );
    console.log("Selected currency info:", selectedCurrencyInfo);

    if (selectedCurrencyInfo && onCurrencyChange) {
      console.log("Calling onCurrencyChange with:", selectedCurrencyInfo);
      onCurrencyChange(selectedCurrencyInfo);
    } else {
      console.error("Currency info not found or onCurrencyChange not provided");
      toast.error("Error updating currency");
    }
  };

  const selectedCurrencyInfo = currencies.find(
    (c) => c.code === localSelectedCurrency
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Select Your Currency
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose how amounts will be displayed across your account
            </p>

            <div className="space-y-4">
              <Select
                label="Currency"
                placeholder="Choose your preferred currency"
                selectedKeys={[localSelectedCurrency]}
                onSelectionChange={(keys) =>
                  setLocalSelectedCurrency(Array.from(keys)[0])
                }
                className="max-w-md"
                size="lg"
                startContent={
                  selectedCurrencyInfo && (
                    <span className="text-lg">{selectedCurrencyInfo.flag}</span>
                  )
                }
                classNames={{
                  trigger:
                    "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600",
                  value: "font-medium",
                }}
              >
                {currencies.map((currency) => (
                  <SelectItem
                    key={currency.code}
                    value={currency.code}
                    textValue={`${currency.code} - ${currency.name}`}
                    startContent={
                      <span className="text-lg">{currency.flag}</span>
                    }
                    classNames={{
                      base: "hover:bg-gray-50 dark:hover:bg-gray-700",
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {currency.code} - {currency.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {currency.symbol} • {currency.country}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </Select>

              {selectedCurrencyInfo && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {selectedCurrencyInfo.flag}
                    </span>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedCurrencyInfo.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Symbol:{" "}
                        <span className="font-mono font-semibold">
                          {selectedCurrencyInfo.symbol}
                        </span>{" "}
                        • {selectedCurrencyInfo.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {localSelectedCurrency !== selectedCurrency && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    color="primary"
                    onPress={handleCurrencyUpdate}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 font-medium"
                    startContent={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    }
                  >
                    Update Currency
                  </Button>
                  <Button
                    variant="bordered"
                    onPress={() => setLocalSelectedCurrency(selectedCurrency)}
                    size="lg"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencySelector;
