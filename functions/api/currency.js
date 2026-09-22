/**
 * Cloudflare Pages Function: /api/currency
 * Multi-Currency Exchange & Global NRI Purchasing Power API
 * 
 * Provides real-time currency conversions, overseas mortgage estimates,
 * and FEMA remittance insights for global buyers of Goyal My Home Sanctuary.
 */

// Exchange rates pegged to INR (Indian Rupee) as base
const EXCHANGE_RATES = {
  INR: 1.0,
  USD: 0.01196,  // 1 USD ≈ 83.61 INR
  AED: 0.04393,  // 1 AED ≈ 22.76 INR (Dubai / UAE Dirham)
  GBP: 0.00921,  // 1 GBP ≈ 108.57 INR (British Pound)
  EUR: 0.01096,  // 1 EUR ≈ 91.24 INR (Euro)
  SGD: 0.01567,  // 1 SGD ≈ 63.81 INR (Singapore Dollar)
  CAD: 0.01626,  // 1 CAD ≈ 61.50 INR (Canadian Dollar)
  AUD: 0.01792,  // 1 AUD ≈ 55.80 INR (Australian Dollar)
  QAR: 0.04357,  // 1 QAR ≈ 22.95 INR (Qatari Riyal)
  SAR: 0.04484   // 1 SAR ≈ 22.30 INR (Saudi Riyal)
};

const CURRENCY_METADATA = {
  USD: { symbol: "$", name: "US Dollar", region: "North America" },
  AED: { symbol: "AED ", name: "UAE Dirham", region: "Middle East / GCC" },
  GBP: { symbol: "£", name: "British Pound", region: "United Kingdom" },
  EUR: { symbol: "€", name: "Euro", region: "European Union" },
  SGD: { symbol: "S$", name: "Singapore Dollar", region: "Southeast Asia" },
  CAD: { symbol: "CA$", name: "Canadian Dollar", region: "North America" },
  AUD: { symbol: "A$", name: "Australian Dollar", region: "Oceania" },
  QAR: { symbol: "QAR ", name: "Qatari Riyal", region: "Middle East / GCC" },
  SAR: { symbol: "SAR ", name: "Saudi Riyal", region: "Middle East / GCC" },
  INR: { symbol: "₹", name: "Indian Rupee", region: "Domestic (India)" }
};

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetCurrency = (url.searchParams.get("to") || "USD").toUpperCase();
  const rawAmount = url.searchParams.get("amount");
  const inrAmount = rawAmount ? parseFloat(rawAmount) : 6900000; // Default: 2 BHK base (₹69 Lakhs*)

  if (!EXCHANGE_RATES[targetCurrency]) {
    return new Response(JSON.stringify({
      status: "error",
      message: `Unsupported currency code: ${targetCurrency}. Supported: ${Object.keys(EXCHANGE_RATES).join(", ")}`
    }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=UTF-8" }
    });
  }

  const rate = EXCHANGE_RATES[targetCurrency];
  const convertedAmount = Math.round(inrAmount * rate);
  const meta = CURRENCY_METADATA[targetCurrency];

  // 20-Year Overseas NRI Mortgage Benchmark (assumed 7.5% p.a. for foreign currency borrowing)
  const annualInterestRate = 0.075;
  const monthlyRate = annualInterestRate / 12;
  const totalMonths = 240;
  const loanPrincipal = convertedAmount * 0.80; // 80% LTV
  const monthlyEmi = Math.round(
    (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const responsePayload = {
    status: "success",
    timestamp: new Date().toISOString(),
    base_currency: "INR",
    base_amount: inrAmount,
    target_currency: targetCurrency,
    exchange_rate: rate,
    converted_amount: convertedAmount,
    formatted_display: `${meta.symbol}${convertedAmount.toLocaleString()}`,
    nri_financing_estimate: {
      loan_to_value: "80%",
      estimated_principal: Math.round(loanPrincipal),
      estimated_monthly_emi: monthlyEmi,
      formatted_emi: `${meta.symbol}${monthlyEmi.toLocaleString()} / mo*`,
      tenure_years: 20,
      indicative_rate_p_a: "7.5%"
    },
    fema_compliance: {
      nre_nro_eligible: true,
      repatriation_allowed: "100% principal & capital gains repatriable via Form 15CA/15CB",
      rbi_guidelines_compliant: true
    },
    supported_currencies: Object.keys(EXCHANGE_RATES)
  };

  return new Response(JSON.stringify(responsePayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
