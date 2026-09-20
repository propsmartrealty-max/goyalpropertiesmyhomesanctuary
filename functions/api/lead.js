/**
 * Cloudflare Pages Function: /api/lead
 * Hardened Edge Worker for VIP lead intake, honeypot anti-spam, 
 * input sanitization, origin validation, and secure CRM dispatch
 */

// Helper: Sanitize text strings (strip HTML tags, control chars, normalize whitespace)
function sanitizeText(str, maxLength = 100) {
  if (typeof str !== "string") return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags and inner scripts
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")   // Remove style tags and inner CSS
    .replace(/<[^>]*>?/gm, "") // Strip all other HTML tags
    .replace(/[\r\n\t]+/g, " ") // Normalize whitespace
    .replace(/[^\w\s\-\.\,\@\(\)\'\/\+]/gi, "") // Remove unusual/malicious special chars
    .trim()
    .slice(0, maxLength);
}

// Helper: Validate Indian and International Phone Formats
function isValidPhone(phone) {
  if (typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  const indianRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  const intlRegex = /^\+?[1-9]\d{7,14}$/;
  return indianRegex.test(cleaned) || intlRegex.test(cleaned);
}

// Helper: Dynamic Allowed Origins Check
function getAllowedOrigin(request) {
  const origin = request.headers.get("origin") || "";
  const host = request.headers.get("host") || "";
  
  const allowedExact = [
    "https://goyalmyhomesanctuary.com",
    "https://www.goyalmyhomesanctuary.com"
  ];
  
  if (allowedExact.includes(origin)) return origin;
  // Allow Cloudflare Pages preview deployments (*.pages.dev)
  if (/^https:\/\/[a-z0-9\-]+\.pages\.dev$/.test(origin)) return origin;
  // Allow local dev environments
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  
  // Default to same host if origin matches
  if (host && origin === `https://${host}`) return origin;
  return null;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  const ipCountry = request.headers.get("cf-ipcountry") || "IN";
  const rayId = request.headers.get("cf-ray") || "local";
  const allowedOrigin = getAllowedOrigin(request);

  // Security Headers for API Response
  const responseHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
  };

  if (allowedOrigin) {
    responseHeaders["Access-Control-Allow-Origin"] = allowedOrigin;
    responseHeaders["Access-Control-Allow-Credentials"] = "true";
    responseHeaders["Vary"] = "Origin";
  }

  try {
    // 1. Check content-length (Reject payloads > 16KB to prevent DoS)
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 16384) {
      return new Response(
        JSON.stringify({ success: false, error: "Payload too large" }),
        { status: 413, headers: responseHeaders }
      );
    }

    // 2. Parse Body safely
    const contentType = request.headers.get("content-type") || "";
    let rawBody = {};

    if (contentType.includes("application/json")) {
      rawBody = await request.json().catch(() => null);
      if (!rawBody || typeof rawBody !== "object") {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid JSON format" }),
          { status: 400, headers: responseHeaders }
        );
      }
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData().catch(() => null);
      if (!formData) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid form data" }),
          { status: 400, headers: responseHeaders }
        );
      }
      rawBody = Object.fromEntries(formData);
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Unsupported Content-Type" }),
        { status: 415, headers: responseHeaders }
      );
    }

    // 3. Honeypot Anti-Bot Shield (Drop automated spambots silently with 200 OK)
    if (rawBody.website || rawBody.hp_check || rawBody.company_field) {
      console.warn(`[Bot Shield Triggered] Honeypot field filled from IP: ${clientIp}, Country: ${ipCountry}`);
      return new Response(
        JSON.stringify({ success: true, message: "Inquiry received." }),
        { status: 200, headers: responseHeaders }
      );
    }

    // 4. Cloudflare Bot Management Verification (if enabled)
    const botScore = request.cf?.botManagement?.score;
    if (typeof botScore === "number" && botScore < 15) {
      console.warn(`[Threat Shield] Dropped suspicious bot score (${botScore}) from IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ success: false, error: "Access denied by automated threat intelligence" }),
        { status: 403, headers: responseHeaders }
      );
    }

    // 5. Input Sanitization & Normalization
    const name = sanitizeText(rawBody.name || rawBody.leadName, 80);
    const phoneRaw = String(rawBody.phone || rawBody.phoneNumber || "").trim().slice(0, 20);
    const phoneClean = phoneRaw.replace(/[\s\-\(\)]/g, "");
    const type = sanitizeText(rawBody.type || rawBody.leadType || "site-visit", 30);
    const config = sanitizeText(rawBody.config || rawBody.configuration || "2 BHK Classic", 50);
    const date = sanitizeText(rawBody.date || rawBody.preferredDate || "", 20);
    const time = sanitizeText(rawBody.time || rawBody.preferredTime || "", 20);
    const cab = Boolean(rawBody.cab || rawBody.cabRequested);
    const address = sanitizeText(rawBody.address || rawBody.pickupAddress || "", 150);

    // 6. Strict Field Validation
    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: "Please enter a valid full name." }),
        { status: 422, headers: responseHeaders }
      );
    }

    if (!isValidPhone(phoneClean)) {
      return new Response(
        JSON.stringify({ success: false, error: "Please provide a valid 10-digit mobile number." }),
        { status: 422, headers: responseHeaders }
      );
    }

    // 7. Structured Lead Record
    const leadId = "SANCTUARY-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const leadRecord = {
      leadId,
      projectId: "goyal-my-home-sanctuary",
      timestamp: new Date().toISOString(),
      leadType: type,
      leadName: name,
      phoneNumber: phoneClean,
      configuration: config,
      preferredDate: date || null,
      preferredTime: time || null,
      cabRequested: cab,
      pickupAddress: cab ? address : null,
      source: "cloudflare-pages-edge",
      telemetry: {
        ipCountry,
        rayId,
        userAgent: sanitizeText(request.headers.get("user-agent") || "unknown", 150)
      }
    };

    // 8. CRM / Webhook Dispatch (Secure Timeout Protected)
    if (env && env.CRM_WEBHOOK_URL) {
      try {
        await fetch(env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Sanctuary-Key": env.CRM_API_KEY || "internal-edge",
            "X-Cloudflare-Ray": rayId
          },
          body: JSON.stringify(leadRecord),
          signal: AbortSignal.timeout(4000) // 4-second timeout guarantee
        });
      } catch (crmErr) {
        console.error(`[CRM Dispatch Warning] Webhook delivery failed: ${crmErr.message}`);
        // Do not fail user request if downstream CRM is temporarily slow
      }
    }

    // 9. Return Sanitized Success Payload
    return new Response(
      JSON.stringify({
        success: true,
        message: "VIP inquiry registered successfully at Cloudflare edge.",
        data: {
          leadId,
          leadName: name,
          timestamp: leadRecord.timestamp
        }
      }),
      { status: 200, headers: responseHeaders }
    );

  } catch (err) {
    console.error(`[Edge Worker Error] Ray: ${rayId} - ${err.message}`);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An error occurred while processing your request. Please try again or call concierge directly."
      }),
      { status: 500, headers: responseHeaders }
    );
  }
}

// Preflight CORS handler for Cloudflare Edge
export async function onRequestOptions(context) {
  const { request } = context;
  const allowedOrigin = getAllowedOrigin(request);

  const corsHeaders = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };

  if (allowedOrigin) {
    corsHeaders["Access-Control-Allow-Origin"] = allowedOrigin;
    corsHeaders["Access-Control-Allow-Credentials"] = "true";
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}
