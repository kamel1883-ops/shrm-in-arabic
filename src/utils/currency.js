import { useEffect, useState } from "react";

// الأسعار الأساسية بالريال السعودي (محددة من المالك — ثابتة)
export const COURSE_PRICES_SAR = {
  "SHRM-CP": { main: 1300, simulation: 371 },
  "SHRM-SCP": { main: 1800, simulation: 484 },
};

/**
 * جدول العملات المدعومة:
 * - rate: معدل التحويل من الريال إلى هذه العملة (1 SAR = rate × عملة)
 * - decimals: عدد الكسور العشرية حسب ISO 4217 (لـ Stripe unit_amount)
 * - symbol: الرمز المعروض
 * المعدلات مرنة وقابلة للتعديل؛ القيم مقربة قابلة للتحديث لاحقاً.
 */
export const CURRENCIES = {
  SAR: { symbol: "ر.س", rate: 1, decimals: 2 },
  USD: { symbol: "$", rate: 0.267, decimals: 2 },
  EGP: { symbol: "ج.م", rate: 13.2, decimals: 2 },
  JOD: { symbol: "د.أ", rate: 0.189, decimals: 3 },
  OMR: { symbol: "ر.ع", rate: 0.103, decimals: 3 },
  AED: { symbol: "د.إ", rate: 0.98, decimals: 2 },
  KWD: { symbol: "د.ك", rate: 0.082, decimals: 3 },
  BHD: { symbol: "د.ب", rate: 0.1, decimals: 3 },
  QAR: { symbol: "ر.ق", rate: 0.97, decimals: 2 },
  TRY: { symbol: "₺", rate: 9.6, decimals: 2 },
  GBP: { symbol: "£", rate: 0.21, decimals: 2 },
  CAD: { symbol: "C$", rate: 0.37, decimals: 2 },
  EUR: { symbol: "€", rate: 0.25, decimals: 2 },
  AUD: { symbol: "A$", rate: 0.41, decimals: 2 },
  INR: { symbol: "₹", rate: 22.4, decimals: 2 },
  PKR: { symbol: "₨", rate: 78, decimals: 2 },
};

// خريطة الدولة (ISO 3166) → عملتها
const COUNTRY_TO_CURRENCY = {
  SA: "SAR",
  EG: "EGP",
  JO: "JOD",
  OM: "OMR",
  AE: "AED",
  KW: "KWD",
  BH: "BHD",
  QA: "QAR",
  TR: "TRY",
  GB: "GBP",
  US: "USD",
  CA: "CAD",
  AU: "AUD",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  IN: "INR",
  PK: "PKR",
};

let cachedCountry = null;

async function detectCountry() {
  if (cachedCountry !== null) return cachedCountry;
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

export function currencyForCountry(country) {
  return COUNTRY_TO_CURRENCY[country] || "USD";
}

/**
 * هوك يُرجع عملة عرض الزائر حسب موقعه الجغرافي.
 */
export function useLocalizedPrice() {
  const [currency, setCurrency] = useState("SAR");
  const [country, setCountry] = useState("SA");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectCountry().then((c) => {
      setCountry(c);
      setCurrency(currencyForCountry(c));
      setLoading(false);
    });
  }, []);

  return { currency, country, loading };
}

/** يحوّل مبلغاً بالريال إلى العملة المحددة (قيمة رقمية). */
export function convertFromSAR(sarAmount, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  return Number(sarAmount) * c.rate;
}

/** عدد الكسور العشرية لعملة (لاستخدامها في unit_amount لـ Stripe). */
export function currencyDecimals(currency) {
  return CURRENCIES[currency]?.decimals ?? 2;
}

/** ينسّق مبلغاً (بأي عملة) كسلسلة عرض كاملة برمز العملة. */
export function formatAmount(localAmount, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  const decimals = c.decimals;
  const rounded = decimals === 0 ? Math.round(localAmount) : Number(localAmount.toFixed(decimals));
  const formatted = rounded.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${formatted} ${c.symbol}`;
}

/** ينسّق مبلغاً بالريال إلى عرض بعملة الزائر (متوافق مع الاستخدام القديم). */
export function formatLocalizedPrice(sarAmount, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.USD;
  const decimals = c.decimals;
  const value = convertFromSAR(sarAmount, currency);
  const rounded = decimals === 0 ? Math.round(value) : Number(value.toFixed(decimals));
  const formatted = rounded.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return {
    amount: formatted,
    symbol: c.symbol,
    currency,
    full: `${formatted} ${c.symbol}`,
    value: rounded,
    decimals,
  };
}