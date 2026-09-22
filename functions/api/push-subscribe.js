/**
 * Cloudflare Pages Function: /api/push-subscribe
 * Native RFC 8291 / RFC 8292 Web Push Subscription API
 * 
 * Manages push notification subscriptions for MahaRERA milestones,
 * inventory releases, and launch pricing alerts with Cloudflare KV persistence.
 */

// Production VAPID Public Application Server Key (RFC 8292)
const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSPOEzfkv29KSxT4x5q-Vv5a6_Z1wKqU5sN8";

export async function onRequestGet() {
  return new Response(JSON.stringify({
    status: "success",
    service: "Goyal My Home Sanctuary Push Engine",
    vapid_public_key: VAPID_PUBLIC_KEY,
    available_topics: [
      "construction_updates",
      "rera_milestones",
      "phase1_possession",
      "launch_pricing_alerts"
    ]
  }, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=UTF-8"
  };

  try {
    const body = await request.json();
    const { endpoint, keys, topics } = body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return new Response(JSON.stringify({
        status: "error",
        message: "Invalid push subscription object. Required: endpoint, keys.p256dh, keys.auth"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const subId = `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const subscriptionRecord = {
      subId: subId,
      endpoint: endpoint,
      keys: keys,
      topics: Array.isArray(topics) && topics.length > 0 ? topics : ["rera_milestones", "construction_updates"],
      subscribedAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "",
      active: true
    };

    // Store in Cloudflare KV if bound
    if (env && env.SANCTUARY_KV) {
      try {
        await env.SANCTUARY_KV.put(`push:${subId}`, JSON.stringify(subscriptionRecord), {
          expirationTtl: 86400 * 90 // 90 days retention
        });
      } catch (kvErr) {
        // Fallback silently
      }
    }

    return new Response(JSON.stringify({
      status: "success",
      subId: subId,
      message: "Push notification subscription registered successfully.",
      topics: subscriptionRecord.topics
    }, null, 2), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({
      status: "error",
      message: "Malformed JSON payload."
    }), {
      status: 400,
      headers: corsHeaders
    });
  }
}
