/**
 * Cloudflare Pages Function: functions/api/lead-capture.js
 * 
 * Headless Multi-Channel Lead Webhook & Telemetry Dispatcher
 * Zero UI/UX Impact - Captures intent asynchronously via navigator.sendBeacon
 */

export async function onRequest(context) {
  const { request, env } = context;
  const startTime = Date.now();

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

  let leadData = {};
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      leadData = await request.json();
    } else {
      const text = await request.text();
      try {
        leadData = JSON.parse(text);
      } catch {
        leadData = { raw: text };
      }
    }
  } catch (err) {
    leadData = {};
  }

  const cf = request.cf || {};
  const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  const enrichedLead = {
    leadId: leadId,
    timestamp: timestamp,
    intent: leadData.intent || 'general-inquiry',
    unitInterest: leadData.unitInterest || 'Not Specified',
    sourceUrl: leadData.sourceUrl || request.headers.get('referer') || 'https://goyalmyhomesanctuary.in/',
    userAgent: request.headers.get('user-agent') || '',
    geo: {
      country: cf.country || leadData.country || 'IN',
      city: cf.city || 'Unknown',
      region: cf.region || 'Unknown',
      timezone: leadData.timezone || 'Asia/Kolkata',
      colo: cf.colo || 'PUN'
    },
    contact: {
      name: leadData.name || '',
      phone: leadData.phone || '',
      email: leadData.email || ''
    }
  };

  // Asynchronous downstream dispatch to CRM / Google Sheet webhook if configured
  if (env && env.CRM_WEBHOOK_URL) {
    try {
      context.waitUntil(
        fetch(env.CRM_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enrichedLead)
        })
      );
    } catch {
      // Non-blocking catch
    }
  }

  return new Response(JSON.stringify({
    status: 'success',
    leadId: leadId,
    receivedAt: timestamp,
    executionTimeMs: Date.now() - startTime
  }), {
    status: 200,
    headers: corsHeaders
  });
}
