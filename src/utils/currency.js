import { useEffect, useState, useCallback } from "react";

// SAR to USD conversion: 1 SAR ≈ 0.267 USD
export const SAR_TO_USD_RATE = 0.267;

// Fixed SAR display prices (per user's request — do not change)
export const COURSE_PRICES_SAR = {
  "SHRM-CP": { main: 1300, simulation: 371 },
  "SHRM-SCP": { main: 1800, simulation: 484 },
};

let cachedCountry = null;

async function detectCountry() {
  if (cachedCountry !== null) return cachedCountry;
  // Try multiple providers; default to Saudi (Asia/Riyadh timezone) if all fail
  const providers = [
    "https://ipapi.co/country/",
    "https://ipapi.co/json/",
    "https://ip.useragentinfo.com/json?json=true",
  ];
  for (const url of providers) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const data = text.startsWith("{") ? JSON.parse(text) : null;
      const code = data?.country_code || data?.country || text;
      if (code && /^[A-Z]{2}$/.test(String(code).toUpperCase().trim())) {
        cachedCountry = String(code).toUpperCase().trim();
        return cachedCountry;
      }
    } catch {}
  }
  cachedCountry = "SA";
  return cachedCountry;
}

/**
 * Hook returning the user's display currency based on their detected location.
 * - Saudi Arabia → "SAR" (keep original riyal price)
 * - Other countries → "USD" (show equivalent USD value)
 */
export function useLocalizedPrice() {
  const [currency, setCurrency] = useState("SAR");
  const [country, setCountry] = useState("SA");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectCountry().then((c) => {
      setCountry(c);
      setCurrency(c === "SA" ? "SAR" : "USD");
      setLoading(false);
    });
  }, []);

  return { currency, country, loading };
}

/**
 * Format a SAR amount into the localized display string.
 */
export function formatLocalizedPrice(sarAmount, currency) {
  if (currency === "SAR") {
    return {
      amount: Math.round(sarAmount).toLocaleString(),
      symbol: "ر.س",
      currency: "SAR",
      full: `${Math.round(sarAmount).toLocaleString()} ر.س`,
    };
  }
  const usd = Math.round(sarAmount * SAR_TO_USD_RATE);
  return {
    amount: usd.toLocaleString(),
    symbol: "$",
    currency: "USD",
    full: `$${usd.toLocaleString()}`,
  };
}