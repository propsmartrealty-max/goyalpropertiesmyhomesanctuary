/**
 * Cloudflare Pages Function: functions/api/vitals.js
 * 
 * Native Real User Metrics (RUM) Core Web Vitals Edge Telemetry Endpoint
 * Receives non-blocking performance beacons measuring real field user experience (LCP, INP, CLS)
 */

export async function onRequest(context) {
  const { request } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=UTF-8'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ status: 'error', message: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders
    });
  }

  let metricData = {};
  try {
    const text = await request.text();
    metricData = JSON.parse(text);
  } catch {
    metricData = {};
  }

  const name = metricData.name || 'UNKNOWN';
  const value = metricData.value || 0;
  let rating = 'good';

  if (name === 'LCP') {
    rating = value <= 2500 ? 'good' : (value <= 4000 ? 'needs-improvement' : 'poor');
  } else if (name === 'CLS') {
    rating = value <= 0.1 ? 'good' : (value <= 0.25 ? 'needs-improvement' : 'poor');
  } else if (name === 'INP' || name === 'FID') {
    rating = value <= 200 ? 'good' : (value <= 500 ? 'needs-improvement' : 'poor');
  } else if (name === 'FCP') {
    rating = value <= 1800 ? 'good' : (value <= 3000 ? 'needs-improvement' : 'poor');
  }

  return new Response(JSON.stringify({
    status: 'success',
    metric: name,
    value: value,
    rating: rating,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: corsHeaders
  });
}
