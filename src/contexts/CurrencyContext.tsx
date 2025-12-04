"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a type for the currency
interface Currency {
  code: string;
  symbol: string;
  rate: number; // Rate against a base currency (e.g., PKR)
}

// Define the available currencies
// TODO: Replace these hardcoded rates with data from your currency API
const currencies: Currency[] = [
  { code: 'PKR', symbol: 'PKR', rate: 1 },
  { code: 'USD', symbol: '$', rate: 1 / 280 }, // Example rate
  { code: 'EUR', symbol: '€', rate: 1 / 300 }, // Example rate
  { code: 'GBP', symbol: '£', rate: 1 / 350 }, // Example rate
  { code: 'AED', symbol: 'AED', rate: 1 / 75 },  // Example rate
  { code: 'SAR', symbol: 'SAR', rate: 1 / 74 },  // Example rate
];

interface CurrencyContextType {
  currency: Currency;
  setCurrencyByCode: (code: string) => void;
  convertPrice: (priceInPkr: number) => string;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(currencies[0]); // Default to PKR

  // In a real application, you would fetch exchange rates from your API here
  // and update the `currencies` array dynamically.
  useEffect(() => {
    // Example of an async function to fetch rates
    const fetchRates = async () => {
      try {
        // const response = await fetch('YOUR_CURRENCY_API_ENDPOINT');
        // const data = await response.json();
        // Here you would update the `currencies` state with the new rates.
        // For demonstration, we are using the hardcoded values.
      } catch (error) {
        console.error("Failed to fetch currency rates:", error);
      }
    };

    // fetchRates();
  }, []);

  const setCurrencyByCode = (code: string) => {
    const newCurrency = currencies.find(c => c.code === code);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  const convertPrice = (priceInPkr: number) => {
    const convertedAmount = priceInPkr * currency.rate;
    return `${currency.symbol} ${convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const value = {
    currency,
    setCurrencyByCode,
    convertPrice,
    availableCurrencies: currencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
