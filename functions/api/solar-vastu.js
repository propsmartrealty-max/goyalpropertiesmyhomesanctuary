/**
 * Cloudflare Pages Function: /api/solar-vastu
 * Solar Sunlight Trajectory & Vedic Vastu Shastra Compliance Engine
 * 
 * Geographic Datum: Mamurdi, PCMC, Pune West, Maharashtra
 * Coordinates: 18.66376° N, 73.7137836° E | Elevation: 580m ASL
 */

// Astronomical solar calculation for latitude 18.66376, longitude 73.7137836
function calculateSolarPosition(date = new Date()) {
  const LAT_RAD = (18.66376 * Math.PI) / 180;
  const LON_DEG = 73.7137836;

  // Day of the year
  const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diffTime = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Fractional year in radians
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);

  // Equation of time in minutes
  const eqtime = 229.18 * (
    0.000075 +
    0.001868 * Math.cos(gamma) -
    0.032077 * Math.sin(gamma) -
    0.014615 * Math.cos(2 * gamma) -
    0.040849 * Math.sin(2 * gamma)
  );

  // Solar declination angle in radians
  const decl = 0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Time calculations (IST = UTC + 5.5 hours)
  const istOffsetMinutes = 330;
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const istHours = (utcHours + 5.5) % 24;

  const timeOffset = eqtime + 4 * LON_DEG - 60 * 5.5;
  const trueSolarTime = (istHours * 60 + timeOffset + 1440) % 1440; // in minutes
  const hourAngleDeg = (trueSolarTime / 4) - 180;
  const hourAngleRad = (hourAngleDeg * Math.PI) / 180;

  // Solar zenith & elevation
  const sinElevation = Math.sin(LAT_RAD) * Math.sin(decl) + Math.cos(LAT_RAD) * Math.cos(decl) * Math.cos(hourAngleRad);
  const elevationRad = Math.asin(Math.max(-1, Math.min(1, sinElevation)));
  const elevationDeg = (elevationRad * 180) / Math.PI;

  // Solar azimuth (degrees from North clockwise)
  const cosAzimuth = (Math.sin(decl) - Math.sin(LAT_RAD) * sinElevation) / (Math.cos(LAT_RAD) * Math.cos(elevationRad));
  let azimuthDeg = (Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * 180) / Math.PI;
  if (hourAngleDeg > 0) {
    azimuthDeg = 360 - azimuthDeg;
  }

  // Sunrise, solar noon, sunset in IST
  const cosHourAngleSunrise = -Math.tan(LAT_RAD) * Math.tan(decl);
  let sunriseHoursIST = 6.25;
  let sunsetHoursIST = 18.5;
  if (cosHourAngleSunrise >= -1 && cosHourAngleSunrise <= 1) {
    const sunriseHA = (Math.acos(cosHourAngleSunrise) * 180) / Math.PI;
    const noonSolarIST = (720 - timeOffset) / 60;
    sunriseHoursIST = noonSolarIST - (sunriseHA * 4) / 60;
    sunsetHoursIST = noonSolarIST + (sunriseHA * 4) / 60;
  }

  const formatTime = (decHours) => {
    const h = Math.floor(decHours);
    const m = Math.floor((decHours - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} IST`;
  };

  return {
    timestamp_utc: date.toISOString(),
    ist_time: `${String(Math.floor(istHours)).padStart(2, '0')}:${String(Math.floor((istHours % 1) * 60)).padStart(2, '0')} IST`,
    elevation_deg: Math.round(elevationDeg * 100) / 100,
    azimuth_deg: Math.round(azimuthDeg * 100) / 100,
    is_daylight: elevationDeg > 0,
    sunrise: formatTime(sunriseHoursIST),
    solar_noon: formatTime((720 - timeOffset) / 60),
    sunset: formatTime(sunsetHoursIST),
    daylight_hours: Math.round((sunsetHoursIST - sunriseHoursIST) * 10) / 10
  };
}

const VASTU_BENCHMARKS = {
  project_rating: "98.7% High Authentic Vedic Compliance",
  principles: [
    {
      domain: "Master Entrance & Orientation",
      orientation: "East & North-East (Ishanya Quadrant)",
      score: 100,
      significance: "Invites invigorating morning solar energy (Prana) and positive geomagnetic flow."
    },
    {
      domain: "Master Bedroom Placement",
      orientation: "South-West (Nairutya Quadrant)",
      score: 98.2,
      significance: "Anchors stability, emotional balance, prosperity, and restorative deep sleep."
    },
    {
      domain: "Kitchen & Hearth (Agni)",
      orientation: "South-East (Agneya) & North-West (Vayavya)",
      score: 96.5,
      significance: "Harmonizes fire energy with cross-directional airflow for culinary vitality."
    },
    {
      domain: "Water Bodies & 35,000 sq.ft Clubhouse",
      orientation: "North & North-East Promenade",
      score: 100,
      significance: "Water features placed in the North/North-East attract enduring abundance and tranquility."
    },
    {
      domain: "Natural Canopy & Cross-Ventilation",
      orientation: "East-West Wind Corridor (Katraj-Dehu Ridge)",
      score: 99.0,
      significance: "Breeze flowing off 72% forest canopy delivers continuous fresh oxygen and temperature moderation."
    }
  ],
  unit_facings: {
    "east_facing": {
      name: "East Facing Units (Towers A & B)",
      daylight_exposure: "Direct soothing sunlight from 06:30 AM to 11:30 AM",
      thermal_profile: "Zero afternoon heat build-up; naturally cool during peak summer 01:00 PM - 05:00 PM",
      vastu_alignment: "100% Auspicious (Surya Devta & Indra Pada)"
    },
    "west_facing": {
      name: "West Facing Units (Towers A & B)",
      daylight_exposure: "Soft indirect morning illumination with golden hour sunset panorama (04:30 PM - 06:45 PM)",
      thermal_profile: "Equipped with MIVAN monolithic heat-sink thermal mass and deep recessed balconies",
      vastu_alignment: "97.4% Auspicious (Varuna Pada & Sahyadri Ridge View)"
    }
  }
};

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const requestedDateStr = url.searchParams.get("date");
  const unitFacing = url.searchParams.get("facing"); // "east" or "west"

  let date = new Date();
  if (requestedDateStr) {
    const parsed = new Date(requestedDateStr);
    if (!isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  const solar = calculateSolarPosition(date);

  let facingData = VASTU_BENCHMARKS.unit_facings;
  if (unitFacing) {
    const fKey = unitFacing.toLowerCase().includes("east") ? "east_facing" : "west_facing";
    facingData = { [fKey]: VASTU_BENCHMARKS.unit_facings[fKey] };
  }

  return new Response(JSON.stringify({
    status: "success",
    project: "Goyal My Home Sanctuary",
    location: "Mamurdi, PCMC, Pune West, Maharashtra",
    coordinates: {
      latitude: 18.66376,
      longitude: 73.7137836,
      elevation_m: 580
    },
    solar_metrics: solar,
    vastu_analysis: {
      composite_score: VASTU_BENCHMARKS.project_rating,
      principles: VASTU_BENCHMARKS.principles,
      unit_orientation_profiles: facingData
    }
  }, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "public, max-age=300, s-maxage=1800",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
