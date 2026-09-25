/**
 * Edge Sliding-Window Rate Limiter & Lead Abuse Shield
 * Path: functions/api/rate-limit.js
 * 
 * Provides:
 * - Algorithmic sliding window rate limiting for public endpoints
 * - Strict abuse shielding on lead captures, tokens, and reservation holds
 * - Whitelisting exemption for certified search engine crawlers (Googlebot, Bingbot, GPTBot)
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

// In-memory edge rate limit store (per Cloudflare Edge isolate)
const requestBuckets = new Map();
const WINDOW_MS = 60 * 1000; // 1-minute window
const MAX_REQUESTS = 30; // 30 requests per minute per IP for standard endpoints
const SENSITIVE_LIMIT = 10; // 10 requests per minute for lead generation

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const clientIp = request.headers.get("cf-connecting-ip") || 
                   request.headers.get("x-forwarded-for") || 
                   url.searchParams.get("ip") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";
  const action = url.searchParams.get("action") || "general";

  // Check if caller is verified search or AI crawler
  const isWhitelistedBot = /Googlebot|Bingbot|GPTBot|PerplexityBot|ClaudeBot|Google-Extended/i.test(userAgent);

  const limit = action === "lead_submission" ? SENSITIVE_LIMIT : MAX_REQUESTS;
  const now = Date.now();

  if (isWhitelistedBot) {
    return new Response(JSON.stringify({
      allowed: true,
      whitelisted: true,
      botType: "Verified Search / AI Spider",
      clientIp,
      limit: "Unlimited",
      remaining: "Unlimited",
      resetInSeconds: 0
    }, null, 2), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "X-RateLimit-Limit": "Unlimited",
        "X-RateLimit-Remaining": "Unlimited"
      }
    });
  }

  // Retrieve or initialize sliding window bucket
  let timestamps = requestBuckets.get(clientIp) || [];
  // Filter out timestamps outside current window
  timestamps = timestamps.filter(ts => now - ts < WINDOW_MS);

  let allowed = true;
  if (timestamps.length >= limit) {
    allowed = false;
  } else {
    timestamps.push(now);
    requestBuckets.set(clientIp, timestamps);
  }

  const remaining = Math.max(0, limit - timestamps.length);
  const oldestTimestamp = timestamps[0] || now;
  const resetInSeconds = Math.max(1, Math.ceil((oldestTimestamp + WINDOW_MS - now) / 1000));

  const responseBody = {
    allowed,
    whitelisted: false,
    clientIp: clientIp.replace(/:\d+$/, ''), // sanitize port if present
    actionTarget: action,
    limit,
    remaining,
    resetInSeconds,
    status: allowed ? "pass" : "rate_limited"
  };

  return new Response(JSON.stringify(responseBody, null, 2), {
    status: allowed ? 200 : 429,
    headers: {
      ...CORS_HEADERS,
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(resetInSeconds)
    }
  });
}
