/**
 * Cloudflare Pages Function: /api/amenity-capacity
 * Smart Co-Working & Clubhouse Amenity Capacity Engine
 * 
 * Provides real-time capacity and booking availability metrics for
 * residents, Hinjawadi tech professionals, and prospective buyers.
 */

const AMENITY_CAPACITY_DATA = {
  project: "Goyal My Home Sanctuary",
  timestamp: new Date().toISOString(),
  amenities: [
    {
      id: "coworking_pods",
      name: "Soundproof Executive Co-Working Pods & Conference Suites",
      location: "Clubhouse Level 2",
      total_pods: 16,
      current_available_pods: 9,
      fiber_bandwidth_mbps: 1000,
      amenity_features: [
        "Acoustic double-glazed isolation (38dB attenuation)",
        "Ergonomic Herman Miller style seating",
        "Dedicated dual-monitor docking stations",
        "Direct fiber-optic redundant internet uplink"
      ],
      peak_hours: "10:00 AM - 04:00 PM IST"
    },
    {
      id: "lap_pool",
      name: "Temperature-Controlled Infinity Lap Pool",
      location: "Podium Deck",
      total_lanes: 4,
      pool_length_meters: 25,
      water_temperature_celsius: 27.5,
      current_occupancy_pct: 35.0,
      open_hours: "06:00 AM - 10:00 PM IST"
    },
    {
      id: "squash_badminton",
      name: "Indoor Air-Conditioned Badminton & Squash Arena",
      location: "Clubhouse Sports Wing",
      badminton_courts: 2,
      squash_courts: 1,
      flooring_type: "BWF-Approved Maple Wood Cushioned Flooring",
      next_available_slot: "07:00 PM - 08:00 PM IST",
      open_hours: "06:00 AM - 11:00 PM IST"
    },
    {
      id: "sky_observatory",
      name: "Rooftop Stargazing Sky Observatory & Telescope Deck",
      location: "Tower B Rooftop (Level 23)",
      instrumentation: "Celestron 8-inch Schmidt-Cassegrain Automated Telescope",
      viewing_conditions_tonight: {
        sky_clarity: "Optimal / Clear PCMC Sky",
        lunar_phase: "First Quarter",
        recommended_viewing_window: "08:30 PM - 11:00 PM IST"
      }
    }
  ]
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const amenityId = url.searchParams.get("amenity");

  let payload = AMENITY_CAPACITY_DATA;
  if (amenityId) {
    const matched = AMENITY_CAPACITY_DATA.amenities.find(
      a => a.id.toLowerCase() === amenityId.toLowerCase()
    );
    if (matched) {
      payload = {
        project: AMENITY_CAPACITY_DATA.project,
        timestamp: new Date().toISOString(),
        amenity: matched
      };
    }
  }

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
