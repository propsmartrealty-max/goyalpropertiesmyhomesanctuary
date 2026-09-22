/**
 * Cloudflare Pages Function: /api/inventory
 * Live Unit Inventory & Phase Status API with Cloudflare KV Edge State
 * 
 * Provides real-time sanctioned unit availability, phase delivery milestones,
 * and edge-persisted booking inquiries for Goyal My Home Sanctuary, Mamurdi.
 * 
 * MahaRERA Registration: PR1261012502725 | Phase 1 Completion: Dec 2028
 */

const BASE_INVENTORY = {
  project: "Goyal My Home Sanctuary",
  developer: "Goyal Properties & PropSmart Realty",
  location: "Mamurdi, PCMC, Pune West, Maharashtra, India",
  maharera_id: "PR1261012502725",
  total_acres: 26,
  total_towers_phase1: 2, // Towers A & B
  possession_target: "December 2028",
  currency: "INR",
  last_updated: "2026-09-22T18:00:00Z",
  units: [
    {
      code: "2BHK-CLS",
      name: "2 BHK Classic",
      typology: "2 BHK",
      carpet_sqft: 638,
      carpet_sqm: 59.27,
      base_price_inr: 6900000,
      price_display: "₹69 Lakhs*",
      status: "Fast Filling",
      total_phase1_inventory: 64,
      available_units: 14,
      floor_availability: "Floors 2 to 18",
      facing: ["East (Morning Sun)", "North-East (Vastu Compliant)"]
    },
    {
      code: "2BHK-PRM",
      name: "2 BHK Premier",
      typology: "2 BHK",
      carpet_sqft: 704,
      carpet_sqm: 65.40,
      base_price_inr: 7600000,
      price_display: "₹76 Lakhs*",
      status: "Available",
      total_phase1_inventory: 64,
      available_units: 19,
      floor_availability: "Floors 1 to 21",
      facing: ["East", "Garden View", "Podium Facing"]
    },
    {
      code: "2BHK-SIG",
      name: "2 BHK Signature",
      typology: "2 BHK",
      carpet_sqft: 760,
      carpet_sqm: 70.61,
      base_price_inr: 8200000,
      price_display: "₹82 Lakhs*",
      status: "Limited Units",
      total_phase1_inventory: 32,
      available_units: 7,
      floor_availability: "Floors 4 to 20",
      facing: ["Corner Unit", "Dual Balcony", "Forest Ridge View"]
    },
    {
      code: "3BHK-CLS",
      name: "3 BHK Classic",
      typology: "3 BHK",
      carpet_sqft: 848,
      carpet_sqm: 78.78,
      base_price_inr: 8600000,
      price_display: "₹86 Lakhs*",
      status: "Available",
      total_phase1_inventory: 48,
      available_units: 16,
      floor_availability: "Floors 1 to 21",
      facing: ["East Facing", "Clubhouse Promenade"]
    },
    {
      code: "3BHK-PRM",
      name: "3 BHK Premier",
      typology: "3 BHK",
      carpet_sqft: 924,
      carpet_sqm: 85.84,
      base_price_inr: 9400000,
      price_display: "₹94 Lakhs*",
      status: "Fast Filling",
      total_phase1_inventory: 48,
      available_units: 9,
      floor_availability: "Floors 3 to 19",
      facing: ["North-East Corner", "Canopy View"]
    },
    {
      code: "3BHK-SIG",
      name: "3 BHK Signature",
      typology: "3 BHK",
      carpet_sqft: 1036,
      carpet_sqm: 96.25,
      base_price_inr: 10500000,
      price_display: "₹1.05 Cr*",
      status: "Exclusive Inventory",
      total_phase1_inventory: 24,
      available_units: 4,
      floor_availability: "High Rise Floors 14 to 22",
      facing: ["Panoramic 270° Sahyadri View", "Private Foyer", "East-West Cross-Ventilation"]
    }
  ]
};

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const typologyFilter = url.searchParams.get("type"); // e.g. "2bhk" or "3bhk"
  const unitFilter = url.searchParams.get("unit"); // e.g. "2BHK-CLS"

  let inventoryData = BASE_INVENTORY;

  // Read from Cloudflare KV if bound
  if (env && env.SANCTUARY_KV) {
    try {
      const kvData = await env.SANCTUARY_KV.get("live_inventory", { type: "json" });
      if (kvData) {
        inventoryData = { ...BASE_INVENTORY, ...kvData };
      }
    } catch (err) {
      // Fallback silently to deterministic baseline
    }
  }

  let units = inventoryData.units;

  if (typologyFilter) {
    const cleanType = typologyFilter.toLowerCase().replace(/[^a-z0-9]/g, "");
    units = units.filter(u => u.typology.toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanType));
  }

  if (unitFilter) {
    const cleanUnit = unitFilter.toUpperCase();
    units = units.filter(u => u.code === cleanUnit);
  }

  const totalAvailable = units.reduce((acc, curr) => acc + curr.available_units, 0);

  const responsePayload = {
    status: "success",
    timestamp: new Date().toISOString(),
    project: inventoryData.project,
    maharera_id: inventoryData.maharera_id,
    possession_target: inventoryData.possession_target,
    total_matching_units: units.length,
    total_available_units: totalAvailable,
    units: units
  };

  return new Response(JSON.stringify(responsePayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
  });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const body = await request.json();
    const { unit_code, customer_name, customer_phone, customer_email } = body;

    if (!unit_code || (!customer_phone && !customer_email)) {
      return new Response(
        JSON.stringify({ status: "error", message: "Unit code and contact details (phone or email) are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const matchedUnit = BASE_INVENTORY.units.find(u => u.code === unit_code.toUpperCase());
    if (!matchedUnit) {
      return new Response(
        JSON.stringify({ status: "error", message: `Unit code ${unit_code} not found in sanctioned inventory.` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const reservationHoldId = `HOLD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Write to KV if bound
    if (env && env.SANCTUARY_KV) {
      try {
        await env.SANCTUARY_KV.put(`hold:${reservationHoldId}`, JSON.stringify({
          hold_id: reservationHoldId,
          unit_code: matchedUnit.code,
          customer_name: customer_name || "Valued Buyer",
          customer_phone: customer_phone || null,
          customer_email: customer_email || null,
          created_at: new Date().toISOString(),
          status: "pending_verification"
        }), { expirationTtl: 86400 * 2 }); // 48-hour hold window
      } catch (kvErr) {
        // Fallback gracefully
      }
    }

    return new Response(JSON.stringify({
      status: "success",
      hold_id: reservationHoldId,
      unit: matchedUnit,
      hold_window_hours: 48,
      message: `Priority inventory hold registered for ${matchedUnit.name}. An executive will connect within 15 minutes.`,
      official_helpline: "+919175319441"
    }, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: "Invalid JSON payload." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
