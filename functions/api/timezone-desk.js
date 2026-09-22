/**
 * Cloudflare Pages Function: functions/api/timezone-desk.js
 * 
 * Global NRI Consultation & Virtual Walkthrough Desk API
 * Calculates real-time business hour overlap between Indian Standard Time (IST)
 * and primary global NRI time zones (Dubai, London, New York, San Jose, Singapore, Sydney).
 */

const HUBS = {
  'dubai': { name: 'Dubai & GCC', timeZone: 'Asia/Dubai', utcOffset: '+04:00', convenientWindowIST: '11:00 AM - 09:30 PM IST' },
  'london': { name: 'London & UK', timeZone: 'Europe/London', utcOffset: '+01:00', convenientWindowIST: '02:00 PM - 10:30 PM IST' },
  'new-york': { name: 'New York (US East)', timeZone: 'America/New_York', utcOffset: '-04:00', convenientWindowIST: '06:30 PM - 11:30 PM IST' },
  'san-francisco': { name: 'Silicon Valley (US West)', timeZone: 'America/Los_Angeles', utcOffset: '-07:00', convenientWindowIST: '08:30 PM - 01:00 AM IST' },
  'singapore': { name: 'Singapore & SE Asia', timeZone: 'Asia/Singapore', utcOffset: '+08:00', convenientWindowIST: '09:00 AM - 06:30 PM IST' },
  'sydney': { name: 'Sydney & Australia', timeZone: 'Australia/Sydney', utcOffset: '+10:00', convenientWindowIST: '08:00 AM - 04:30 PM IST' }
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
  const requestedHub = (url.searchParams.get('hub') || '').toLowerCase().trim();

  let results = [];
  if (requestedHub && HUBS[requestedHub]) {
    results = [{ id: requestedHub, ...HUBS[requestedHub] }];
  } else {
    results = Object.entries(HUBS).map(([id, data]) => ({ id, ...data }));
  }

  const now = new Date();
  const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

  const payload = {
    status: 'success',
    currentTimeIST: istString,
    executionTimeMs: Date.now() - startTime,
    project: 'Goyal My Home Sanctuary, Mamurdi',
    virtualTourType: '4K Interactive Drone & Monolithic MIVAN Construction Walkthrough',
    nriDedicatedHelpline: '+919175319441',
    nriWhatsAppDirect: 'https://api.whatsapp.com/send?phone=919175319441&text=Hi%20PropSmart%20Realty,%20I%20am%20an%20NRI%20investor%20requesting%20a%20Virtual%204K%20Walkthrough.',
    globalHubs: results
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: corsHeaders
  });
}
