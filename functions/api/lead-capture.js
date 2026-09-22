/**
 * Cloudflare Pages Function: functions/api/lead-capture.js
 * 
 * Headless Multi-Channel Lead Webhook & Telemetry Dispatcher
 * Features:
 * - Edge Bot & Honeypot Spam Defense
 * - Multi-Endpoint Dispatcher (CRM Webhook, Slack Webhook, Telegram Bot API)
 * - Cloudflare KV Edge Persistence (env.SANCTUARY_KV)
 * - Zero UI/UX Impact: Non-blocking execution via context.waitUntil & navigator.sendBeacon
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

  // Edge Bot & Honeypot Spam Defense
  const isBotSubmission = Boolean(
    leadData.website_hp || 
    leadData.bot_trap || 
    leadData.phone_confirm_hp ||
    (leadData.elapsedMs && Number(leadData.elapsedMs) < 600)
  );

  if (isBotSubmission) {
    return new Response(JSON.stringify({
      status: 'success',
      leadId: leadId,
      botDefenseFiltered: true,
      executionTimeMs: Date.now() - startTime
    }), {
      status: 200,
      headers: corsHeaders
    });
  }

  const enrichedLead = {
    leadId: leadId,
    timestamp: timestamp,
    intent: leadData.intent || 'general-inquiry',
    unitInterest: leadData.unitInterest || 'Not Specified',
    vastuPreference: leadData.vastuPreference || 'Standard Authentic Vastu',
    commuteDestination: leadData.commuteDestination || 'Not Specified',
    sourceUrl: leadData.sourceUrl || request.headers.get('referer') || 'https://goyalmyhomesanctuary.in/',
    userAgent: request.headers.get('user-agent') || '',
    currency: leadData.currency || 'INR',
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

  const dispatchPromises = [];

  // 1. Cloudflare KV Edge State Persistence
  if (env && env.SANCTUARY_KV) {
    dispatchPromises.push(
      env.SANCTUARY_KV.put(`lead:${leadId}`, JSON.stringify(enrichedLead), {
        expirationTtl: 86400 * 30 // 30-day edge retention
      }).catch(() => {})
    );
  }

  // 2. CRM Webhook (HubSpot, Salesforce, Make, Zapier, Google Sheets)
  if (env && env.CRM_WEBHOOK_URL) {
    dispatchPromises.push(
      fetch(env.CRM_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedLead)
      }).catch(() => {})
    );
  }

  // 3. Slack Channel Dispatcher
  if (env && env.SLACK_WEBHOOK_URL) {
    const slackPayload = {
      text: `🏡 *New Lead Alert - Goyal My Home Sanctuary*\n*ID*: \`${leadId}\`\n*Unit*: ${enrichedLead.unitInterest}\n*Intent*: ${enrichedLead.intent}\n*Location*: ${enrichedLead.geo.city}, ${enrichedLead.geo.country} (${enrichedLead.geo.timezone})`
    };
    dispatchPromises.push(
      fetch(env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackPayload)
      }).catch(() => {})
    );
  }

  // 4. Telegram Sales Alert Bot
  if (env && env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const telegramText = `🏡 *New Lead - Sanctuary Mamurdi*\n` +
      `*ID*: \`${leadId}\`\n` +
      `*Unit*: ${enrichedLead.unitInterest}\n` +
      `*City*: ${enrichedLead.geo.city}, ${enrichedLead.geo.country}\n` +
      `*Timezone*: ${enrichedLead.geo.timezone}`;

    const tgUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    dispatchPromises.push(
      fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: telegramText,
          parse_mode: 'Markdown'
        })
      }).catch(() => {})
    );
  }

  if (dispatchPromises.length > 0 && context.waitUntil) {
    context.waitUntil(Promise.all(dispatchPromises));
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
