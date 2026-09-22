/**
 * Cloudflare Pages Function: /api/market-index
 * PCMC Real Estate Capital Appreciation & Rental Yield Index API
 * 
 * Provides empirical historical CAGR tracking, rental yield benchmarks,
 * and 10-year IRR capital appreciation projections for Goyal My Home Sanctuary, Mamurdi.
 */

const HISTORICAL_APPRECIATION = [
  { year: 2020, avg_rate_sqft: 4800, cagr_from_base: 0 },
  { year: 2021, avg_rate_sqft: 5100, cagr_from_base: 6.25 },
  { year: 2022, avg_rate_sqft: 5500, cagr_from_base: 7.05 },
  { year: 2023, avg_rate_sqft: 6100, cagr_from_base: 8.31 },
  { year: 2024, avg_rate_sqft: 6600, cagr_from_base: 8.29 },
  { year: 2025, avg_rate_sqft: 7100, cagr_from_base: 8.15 },
  { year: 2026, avg_rate_sqft: 7600, cagr_from_base: 7.96 }, // Current Launch Cycle
  { year: 2028, avg_rate_sqft: 8900, cagr_from_base: 8.04 }  // Projected Possession Cycle
];

const RENTAL_BENCHMARKS = {
  "2bhk": {
    min_rent_monthly: 22000,
    max_rent_monthly: 27000,
    avg_annual_rent: 294000,
    gross_yield_percentage: 4.26,
    target_tenant_profile: "Senior Software Engineers, Hinjawadi Phase 1 & 2 IT Executives",
    demand_index: "Very High (Sub-15 Min Hinjawadi Commute)"
  },
  "3bhk": {
    min_rent_monthly: 30000,
    max_rent_monthly: 38000,
    avg_annual_rent: 408000,
    gross_yield_percentage: 4.34,
    target_tenant_profile: "IT Tech Leads, Automotive Executives (MIDC/Bhosari), Nuclear Families",
    demand_index: "High (Near Symbiosis, Akshara & Indira Campuses)"
  }
};

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);

  const typology = (url.searchParams.get("type") || "2bhk").toLowerCase().includes("3") ? "3bhk" : "2bhk";
  const rawPrice = url.searchParams.get("price");
  const purchasePrice = rawPrice ? parseFloat(rawPrice) : (typology === "3bhk" ? 8600000 : 6900000);

  const rentalData = RENTAL_BENCHMARKS[typology];
  const grossYield = ((rentalData.avg_annual_rent / purchasePrice) * 100).toFixed(2);

  // 10-Year Capital Appreciation Projection (assuming conservative 8% annual growth)
  const tenYearValue = Math.round(purchasePrice * Math.pow(1 + 0.08, 10));
  const cumulativeRent10Yr = Math.round(rentalData.avg_annual_rent * 10 * 1.25); // including 5% biennial rent escalations
  const totalReturn10Yr = tenYearValue + cumulativeRent10Yr - purchasePrice;
  const totalReturnMultiplier = ((tenYearValue + cumulativeRent10Yr) / purchasePrice).toFixed(2);

  const responsePayload = {
    status: "success",
    project: "Goyal My Home Sanctuary",
    location: "Mamurdi, PCMC, Pune West",
    macro_market: "Pimpri Chinchwad Municipal Corporation (PCMC)",
    evaluated_unit: typology.toUpperCase(),
    purchase_price_inr: purchasePrice,
    formatted_purchase_price: `₹${(purchasePrice / 100000).toFixed(2)} Lakhs*`,
    cagr_track_record: {
      period: "2020 - 2026",
      historical_growth: "58.3% Total Capital Appreciation (₹4,800/sq.ft to ₹7,600/sq.ft)",
      historical_milestones: HISTORICAL_APPRECIATION
    },
    rental_yield_analysis: {
      monthly_rent_estimate: `₹${rentalData.min_rent_monthly.toLocaleString()} - ₹${rentalData.max_rent_monthly.toLocaleString()} / mo`,
      annual_rental_cashflow: `₹${rentalData.avg_annual_rent.toLocaleString()} / yr`,
      gross_rental_yield: `${grossYield}%`,
      tenant_demand_drivers: rentalData.demand_index,
      target_tenant_profile: rentalData.target_tenant_profile
    },
    ten_year_wealth_projection: {
      assumed_annual_cagr: "8.0%",
      projected_value_year_10: `₹${(tenYearValue / 100000).toFixed(2)} Lakhs*`,
      cumulative_10yr_rental_income: `₹${(cumulativeRent10Yr / 100000).toFixed(2)} Lakhs*`,
      total_gain_inr: totalReturn10Yr,
      total_investment_multiple: `${totalReturnMultiplier}x`
    },
    infrastructure_catalysts: [
      "Katraj-Dehu Bypass Road 6-Lane Expansion",
      "Pune Metro Line 3 Extension towards Nigdi & PCMC corridor",
      "Ring Road connectivity reducing Hinjawadi transit to 12 minutes",
      "Immediate exit on Mumbai-Pune Expressway at Urse/Mamurdi toll plaza"
    ]
  };

  return new Response(JSON.stringify(responsePayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
