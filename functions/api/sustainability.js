/**
 * Cloudflare Pages Function: /api/sustainability
 * IGBC Green Building & Carbon Footprint Telemetry Engine
 * 
 * Provides live biophilic, hydrological, solar, and carbon sequestration
 * benchmarks for Goyal My Home Sanctuary, Mamurdi, PCMC, Pune.
 */

const GREEN_SPECIFICATIONS = {
  project: "Goyal My Home Sanctuary",
  rating_target: "IGBC Green Homes Gold / Platinum Net-Zero Readiness",
  location: {
    locality: "Mamurdi, PCMC, Pune West",
    coordinates: { latitude: 18.66376, longitude: 73.7137836 }
  },
  landscaping: {
    total_open_space_percentage: 72,
    micro_forest_trees_planted: 1250,
    native_species_ratio: 0.94, // 94% indigenous drought-tolerant trees
    urban_heat_island_reduction_celsius: 2.8,
    biophilic_zones: [
      "Native Flora Miyawaki Canopy",
      "Perennial Fragrance Garden",
      "Acupressure Reflexology Trail",
      "Zen Meditation Pavilion",
      "Butterfly & Pollinator Pathway"
    ]
  },
  carbon_sequestration: {
    annual_co2_sequestered_metric_tons: 18.4,
    twenty_five_year_cumulative_co2_offset_tons: 460.0,
    equivalent_cars_removed_per_year: 4.1,
    carbon_intensity_kg_per_sqm: 14.2 // 38% lower than regional PCMC conventional baseline of 22.9
  },
  water_conservation: {
    annual_rainwater_harvesting_liters: 2400000, // 2.4 Million Liters
    groundwater_recharge_pits: 8,
    on_site_stp_capacity_kld: 180, // Kiloliters per Day
    recycled_water_utilization: "100% dual flush + landscape irrigation",
    freshwater_consumption_reduction_percentage: 42.5
  },
  clean_energy: {
    rooftop_solar_photovoltaic_capacity_kwp: 65,
    annual_solar_generation_kwh: 85000,
    common_area_power_offset_percentage: 58.0,
    common_area_led_efficiency_savings_kwh: 22000,
    ev_charging_bays: 24,
    ev_charger_types: ["Type 2 AC Fast Chargers (7.4 kW)", "16A Smart Domestic Sockets"]
  },
  waste_management: {
    on_site_organic_waste_converter: true,
    composting_capacity_kg_per_day: 450,
    landfill_diversion_percentage: 82.0
  }
};

const TYPOLOGY_ESG_FACTORS = {
  "2bhk-classic": { name: "2 BHK Classic", carpet_sqft: 638, allocated_green_sqft: 446, annual_co2_offset_kg: 520, annual_water_saved_liters: 28000 },
  "2bhk-premier": { name: "2 BHK Premier", carpet_sqft: 704, allocated_green_sqft: 492, annual_co2_offset_kg: 574, annual_water_saved_liters: 31000 },
  "2bhk-signature": { name: "2 BHK Signature", carpet_sqft: 760, allocated_green_sqft: 531, annual_co2_offset_kg: 620, annual_water_saved_liters: 33500 },
  "3bhk-classic": { name: "3 BHK Classic", carpet_sqft: 848, allocated_green_sqft: 593, annual_co2_offset_kg: 692, annual_water_saved_liters: 37400 },
  "3bhk-premier": { name: "3 BHK Premier", carpet_sqft: 924, allocated_green_sqft: 646, annual_co2_offset_kg: 754, annual_water_saved_liters: 40700 },
  "3bhk-signature": { name: "3 BHK Signature", carpet_sqft: 1036, allocated_green_sqft: 724, annual_co2_offset_kg: 845, annual_water_saved_liters: 45600 }
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const typologyKey = (url.searchParams.get("typology") || "").toLowerCase().trim();

  let typologyData = null;
  if (typologyKey && TYPOLOGY_ESG_FACTORS[typologyKey]) {
    typologyData = TYPOLOGY_ESG_FACTORS[typologyKey];
  }

  const responsePayload = {
    status: "success",
    timestamp: new Date().toISOString(),
    project: GREEN_SPECIFICATIONS.project,
    igbc_rating: GREEN_SPECIFICATIONS.rating_target,
    community_metrics: GREEN_SPECIFICATIONS,
    typology_esg_assessment: typologyData ? {
      selected_typology: typologyData.name,
      carpet_area_sqft: typologyData.carpet_sqft,
      allocated_forest_canopy_sqft: typologyData.allocated_green_sqft,
      household_annual_co2_offset_kg: typologyData.annual_co2_offset_kg,
      annual_freshwater_saved_liters: typologyData.annual_water_saved_liters,
      esg_sustainability_grade: "A+ IGBC Net-Zero Ready"
    } : {
      available_typologies: Object.keys(TYPOLOGY_ESG_FACTORS)
    }
  };

  return new Response(JSON.stringify(responsePayload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
