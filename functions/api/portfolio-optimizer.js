/**
 * Cloudflare Pages Function: /api/portfolio-optimizer
 * Multi-Unit Portfolio Optimization & Investment Comparison Engine
 * 
 * Evaluates real estate acquisition strategies comparing single large residences
 * (e.g. 3 BHK Signature at ₹1.05 Cr*) vs dual-unit portfolios (e.g. two 2 BHK Classics at ₹69 L* each).
 */

const PRICING_CATALOG = {
  "2bhk-classic": { name: "2 BHK Classic", price: 6900000, carpet_sqft: 638, monthly_rent: 24500 },
  "2bhk-premier": { name: "2 BHK Premier", price: 7600000, carpet_sqft: 704, monthly_rent: 27000 },
  "2bhk-signature": { name: "2 BHK Signature", price: 8200000, carpet_sqft: 760, monthly_rent: 29500 },
  "3bhk-classic": { name: "3 BHK Classic", price: 8600000, carpet_sqft: 848, monthly_rent: 32000 },
  "3bhk-premier": { name: "3 BHK Premier", price: 9400000, carpet_sqft: 924, monthly_rent: 36000 },
  "3bhk-signature": { name: "3 BHK Signature", price: 10500000, carpet_sqft: 1036, monthly_rent: 42000 }
};

const MAMURDI_CAGR = 0.128; // 12.8% historical CAGR 2019-2026

function computeStrategyMetrics(units) {
  let totalCost = 0;
  let totalCarpet = 0;
  let annualRentalIncome = 0;

  for (const u of units) {
    totalCost += u.price;
    totalCarpet += u.carpet_sqft;
    annualRentalIncome += u.monthly_rent * 12;
  }

  const grossYieldPct = (annualRentalIncome / totalCost) * 100;
  const stampDutyAndReg = totalCost * 0.07 + (units.length * 30000);
  const totalOutlay = totalCost + stampDutyAndReg;

  // 5-year and 10-year future values at 12.8% CAGR
  const value5Yr = totalCost * Math.pow(1 + MAMURDI_CAGR, 5);
  const value10Yr = totalCost * Math.pow(1 + MAMURDI_CAGR, 10);
  const capitalGain10Yr = value10Yr - totalCost;

  return {
    units_count: units.length,
    units_summary: units.map(u => u.name),
    base_cost_inr: totalCost,
    formatted_base_cost: `₹${(totalCost / 100000).toFixed(2)} Lakhs*`,
    statutory_outlay_inr: Math.round(stampDutyAndReg),
    total_acquisition_outlay_inr: Math.round(totalOutlay),
    total_carpet_sqft: totalCarpet,
    gross_annual_rent_inr: annualRentalIncome,
    gross_rental_yield_pct: Math.round(grossYieldPct * 100) / 100,
    ten_year_appreciation: {
      projected_value_5yr_inr: Math.round(value5Yr),
      projected_value_10yr_inr: Math.round(value10Yr),
      projected_capital_gain_10yr_inr: Math.round(capitalGain10Yr),
      wealth_multiple_10yr: `${(value10Yr / totalCost).toFixed(2)}x`
    }
  };
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "compare_default";

  // Strategy A: Single 3 BHK Signature (Luxury End-User / Executive Living)
  const single3Bhk = [PRICING_CATALOG["3bhk-signature"]];
  const metricsA = computeStrategyMetrics(single3Bhk);

  // Strategy B: Dual 2 BHK Classic Portfolio (Maximum Cashflow & Risk Diversification)
  const dual2Bhk = [PRICING_CATALOG["2bhk-classic"], PRICING_CATALOG["2bhk-classic"]];
  const metricsB = computeStrategyMetrics(dual2Bhk);

  const comparison = {
    status: "success",
    timestamp: new Date().toISOString(),
    benchmark_cagr_pune_west: "12.8%",
    possession_milestone: "December 2028",
    strategy_a_single_luxury: {
      strategy_name: "Flagship Sky Residence (1x 3 BHK Signature)",
      thesis: "Ultra-luxury living for senior IT directors with maximum undivided share of land",
      metrics: metricsA
    },
    strategy_b_dual_portfolio: {
      strategy_name: "Dual Cashflow Engine (2x 2 BHK Classic)",
      thesis: "High liquidity, dual independent rental income streams, low vacancy correlation",
      metrics: metricsB
    },
    comparative_analysis: {
      cashflow_differential_annual_inr: metricsB.gross_annual_rent_inr - metricsA.gross_annual_rent_inr,
      rental_yield_advantage: `${(metricsB.gross_rental_yield_pct - metricsA.gross_rental_yield_pct).toFixed(2)}% higher yield on dual-unit model`,
      recommendation: "Dual-unit strategy recommended for pure rental investors; Single 3 BHK Signature recommended for self-use capital preservation."
    }
  };

  return new Response(JSON.stringify(comparison, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
