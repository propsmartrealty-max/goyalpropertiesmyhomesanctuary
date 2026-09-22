/**
 * Cloudflare Pages Function: functions/api/commute-calculator.js
 * 
 * Headless Dynamic Commute & Fuel Savings Intelligence API
 * Zero UI/UX Impact - Serverless Edge Calculation Engine
 */

const HUBS = {
  'hinjawadi-phase-1': {
    name: 'Hinjawadi Phase 1 (Infosys / Wipro / Cognizant)',
    distanceKm: 12.8,
    mamurdiMinutes: 15,
    wakadMinutes: 28,
    signalsAvoided: 6,
    route: 'Direct via Punawale / Marunji Bypass'
  },
  'hinjawadi-phase-2': {
    name: 'Hinjawadi Phase 2 (Tech Mahindra / TCS)',
    distanceKm: 14.5,
    mamurdiMinutes: 18,
    wakadMinutes: 32,
    signalsAvoided: 8,
    route: 'Expressway Bypass via Marunji Link Road'
  },
  'hinjawadi-phase-3': {
    name: 'Hinjawadi Phase 3 (Megapolis / KPIT)',
    distanceKm: 16.0,
    mamurdiMinutes: 20,
    wakadMinutes: 38,
    signalsAvoided: 9,
    route: 'Godrej Circle Link Route'
  },
  'talawade-it-park': {
    name: 'Talawade Mindspace IT Park',
    distanceKm: 13.2,
    mamurdiMinutes: 18,
    wakadMinutes: 35,
    signalsAvoided: 7,
    route: 'Nigdi Pradhikaran Arterial Corridor'
  },
  'bhosari-midc': {
    name: 'Bhosari MIDC & Automobile Cluster',
    distanceKm: 16.5,
    mamurdiMinutes: 22,
    wakadMinutes: 42,
    signalsAvoided: 8,
    route: 'Bhakti Shakti Flyover & Spine Road'
  },
  'chakan-midc': {
    name: 'Chakan Industrial Zone (Mercedes-Benz / Volkswagen)',
    distanceKm: 24.0,
    mamurdiMinutes: 30,
    wakadMinutes: 55,
    signalsAvoided: 11,
    route: 'Talegaon-Chakan Expressway Connector'
  },
  'talegaon-industrial': {
    name: 'Talegaon MIDC (General Motors / JCB)',
    distanceKm: 14.0,
    mamurdiMinutes: 12,
    wakadMinutes: 35,
    signalsAvoided: 5,
    route: 'Old Mumbai-Pune Highway / Expressway'
  },
  'balewadi-high-street': {
    name: 'Balewadi High Street & Cummins India Office',
    distanceKm: 16.2,
    mamurdiMinutes: 20,
    wakadMinutes: 25,
    signalsAvoided: 4,
    route: 'NH 48 Bengaluru-Mumbai Bypass'
  },
  'baner-tech-park': {
    name: 'Baner Tech Hub & Panchshil Business Park',
    distanceKm: 18.0,
    mamurdiMinutes: 22,
    wakadMinutes: 26,
    signalsAvoided: 5,
    route: 'NH 48 Bypass Direct Flyover'
  },
  'symbiosis-skill-university': {
    name: 'Symbiosis Skills & Professional University',
    distanceKm: 2.8,
    mamurdiMinutes: 5,
    wakadMinutes: 22,
    signalsAvoided: 4,
    route: 'Immediate Mamurdi Knowledge Corridor'
  }
};

export async function onRequest(context) {
  const { request } = context;
  const startTime = Date.now();

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=UTF-8'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const hubId = (url.searchParams.get('hub') || '').toLowerCase().trim();

  let selectedHubs = [];
  if (hubId && HUBS[hubId]) {
    selectedHubs = [{ id: hubId, ...HUBS[hubId] }];
  } else {
    selectedHubs = Object.entries(HUBS).map(([id, data]) => ({ id, ...data }));
  }

  // Calculate annual savings assuming 240 working days
  const enrichedResults = selectedHubs.map(hub => {
    const dailyMinutesSaved = (hub.wakadMinutes - hub.mamurdiMinutes) * 2; // round trip
    const annualHoursSaved = Math.round((dailyMinutesSaved * 240) / 60);
    const dailyFuelSavedLiters = (hub.signalsAvoided * 0.08) + 0.5; // idling + stop-go wear
    const annualFuelSavingsInr = Math.round(dailyFuelSavedLiters * 105 * 240); // ₹105/L petrol

    return {
      ...hub,
      metrics: {
        dailyMinutesSavedRoundTrip: dailyMinutesSaved,
        annualHoursSavedProductivity: annualHoursSaved,
        annualFuelSavingsInr: `₹${annualFuelSavingsInr.toLocaleString('en-IN')}`,
        stressReductionRating: 'Significantly Lower (Zero Expressway Traffic Chokepoints)'
      }
    };
  });

  return new Response(JSON.stringify({
    status: 'success',
    project: 'Goyal My Home Sanctuary, Mamurdi',
    totalDestinationsCalculated: enrichedResults.length,
    executionTimeMs: Date.now() - startTime,
    destinations: enrichedResults
  }, null, 2), {
    status: 200,
    headers: corsHeaders
  });
}
