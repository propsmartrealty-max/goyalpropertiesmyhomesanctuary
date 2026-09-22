/**
 * Cloudflare Pages Function: /api/tax-calculator
 * Maharashtra Government Stamp Duty, Registration & GST Calculation API
 * 
 * Jurisdiction: Pimpri Chinchwad Municipal Corporation (PCMC), Pune West
 * Governing Laws: The Maharashtra Stamp Act (Schedule I, Article 25) & Central GST Act
 */

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);

  const rawAmount = url.searchParams.get("amount");
  const agreementValue = rawAmount ? parseFloat(rawAmount) : 6900000; // Default: 2 BHK base (₹69 Lakhs*)
  const isFemaleOwner = url.searchParams.get("female_owner") === "true";

  if (isNaN(agreementValue) || agreementValue <= 0) {
    return new Response(JSON.stringify({ status: "error", message: "Invalid property agreement value." }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=UTF-8" }
    });
  }

  // 1. PCMC Stamp Duty Breakdown:
  // Base Stamp Duty: 5% (or 4% with 1% female concession under Maharashtra State GR)
  // Local Body Tax / Metro Cess: 1%
  const baseRate = isFemaleOwner ? 0.04 : 0.05;
  const metroCessRate = 0.01;
  const totalStampRate = baseRate + metroCessRate;

  const baseStampDuty = Math.round(agreementValue * baseRate);
  const metroCess = Math.round(agreementValue * metroCessRate);
  const totalStampDuty = baseStampDuty + metroCess;

  // 2. Registration Charges:
  // Capped at ₹30,000 for residential properties above ₹30 Lakhs in Maharashtra
  const registrationFee = agreementValue > 3000000 ? 30000 : Math.round(agreementValue * 0.01);

  // 3. GST (Goods & Services Tax):
  // 5% standard rate for non-affordable under-construction residential properties under MahaRERA
  const gstRate = 0.05;
  const gstAmount = Math.round(agreementValue * gstRate);

  // 4. Incidentals & Legal Documentation
  const legalDocumentationEstimate = 15000;

  // Total All-Inclusive Cost
  const totalStatutoryCost = totalStampDuty + registrationFee + gstAmount + legalDocumentationEstimate;
  const grandTotalInvestment = agreementValue + totalStatutoryCost;

  const payload = {
    status: "success",
    timestamp: new Date().toISOString(),
    jurisdiction: "PCMC (Pimpri Chinchwad Municipal Corporation), Maharashtra",
    agreement_value_inr: agreementValue,
    formatted_agreement_value: `₹${(agreementValue / 100000).toFixed(2)} Lakhs*`,
    female_ownership_concession_applied: isFemaleOwner,
    statutory_breakdown: {
      stamp_duty: {
        rate_percentage: isFemaleOwner ? "5.0% (Includes 1.0% Female Concession)" : "6.0% (5% Base + 1% Metro Cess)",
        base_stamp_duty_inr: baseStampDuty,
        metro_cess_inr: metroCess,
        total_stamp_duty_inr: totalStampDuty,
        formatted: `₹${totalStampDuty.toLocaleString()}`
      },
      registration_charges: {
        statutory_cap_applied: agreementValue > 3000000,
        amount_inr: registrationFee,
        formatted: `₹${registrationFee.toLocaleString()}`
      },
      gst: {
        rate_percentage: "5.0%",
        amount_inr: gstAmount,
        formatted: `₹${gstAmount.toLocaleString()}`
      },
      legal_and_documentation: {
        amount_inr: legalDocumentationEstimate,
        formatted: `₹${legalDocumentationEstimate.toLocaleString()}`
      }
    },
    total_statutory_dues_inr: totalStatutoryCost,
    formatted_total_statutory: `₹${(totalStatutoryCost / 100000).toFixed(2)} Lakhs*`,
    grand_total_on_road_inr: grandTotalInvestment,
    formatted_grand_total: `₹${(grandTotalInvestment / 100000).toFixed(2)} Lakhs*`,
    statutory_percentage_of_agreement: `${((totalStatutoryCost / agreementValue) * 100).toFixed(2)}%`
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
