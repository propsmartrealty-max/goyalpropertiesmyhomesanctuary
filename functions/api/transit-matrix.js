/**
 * Cloudflare Pages Function: /api/transit-matrix
 * Educational, Healthcare & Transit Infrastructure Proximity API
 * 
 * Provides drive-time, distance, and school bus catchment benchmarks
 * from Goyal My Home Sanctuary, Mamurdi (18.66376° N, 73.7137836° E).
 */

const INSTITUTIONS = [
  {
    name: "Symbiosis Skills & Professional University (SSPU)",
    category: "higher_education",
    distance_km: 2.5,
    drive_time_mins: 5,
    walk_time_mins: 25,
    school_bus_available: true,
    location: "Kiwale Expressway Node"
  },
  {
    name: "Akshara International School",
    category: "school",
    distance_km: 6.0,
    drive_time_mins: 12,
    walk_time_mins: 65,
    school_bus_available: true,
    location: "Wakad-Tathawade Belt"
  },
  {
    name: "Indira National School & Campus",
    category: "school",
    distance_km: 5.5,
    drive_time_mins: 10,
    walk_time_mins: 55,
    school_bus_available: true,
    location: "Tathawade Highway Belt"
  },
  {
    name: "D.Y. Patil International University",
    category: "higher_education",
    distance_km: 6.5,
    drive_time_mins: 14,
    walk_time_mins: 70,
    school_bus_available: true,
    location: "Akurdi Campus"
  },
  {
    name: "Blossom Public School",
    category: "school",
    distance_km: 4.2,
    drive_time_mins: 8,
    walk_time_mins: 45,
    school_bus_available: true,
    location: "Tathawade"
  },
  {
    name: "Aditya Birla Memorial Hospital",
    category: "healthcare",
    distance_km: 7.5,
    drive_time_mins: 14,
    emergency_response_mins: 10,
    location: "Chinchwad"
  },
  {
    name: "Ojas Multi-Specialty Hospital",
    category: "healthcare",
    distance_km: 3.8,
    drive_time_mins: 7,
    emergency_response_mins: 5,
    location: "Ravet"
  },
  {
    name: "Pavana Hospital",
    category: "healthcare",
    distance_km: 6.8,
    drive_time_mins: 11,
    emergency_response_mins: 8,
    location: "Somatane Toll Plaza"
  }
];

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const categoryFilter = url.searchParams.get("category"); // "school", "higher_education", "healthcare"

  let results = INSTITUTIONS;
  if (categoryFilter) {
    const cleanCat = categoryFilter.toLowerCase();
    results = results.filter(i => i.category.toLowerCase().includes(cleanCat));
  }

  const payload = {
    status: "success",
    project: "Goyal My Home Sanctuary",
    origin_coordinates: { latitude: 18.66376, longitude: 73.7137836 },
    origin_location: "Mamurdi, PCMC, Pune West",
    total_institutions: results.length,
    institutions: results
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
