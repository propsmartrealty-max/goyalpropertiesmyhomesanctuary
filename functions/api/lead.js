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

    // 4. Cloudflare Bot Management Verification (with Verified Search Engine Whitelisting)
    const isVerifiedBot = Boolean(request.cf?.botManagement?.verifiedBot);
    const botScore = request.cf?.botManagement?.score;
    if (!isVerifiedBot && typeof botScore === "number" && botScore < 15) {
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

    // 8. Automated Email & Lead Notification Dispatch to propsmartrealty@gmail.com
    const targetLeadEmail = (env && env.LEAD_NOTIFICATION_EMAIL) || "propsmartrealty@gmail.com";
    const senderFromEmail = (env && env.SENDER_EMAIL) || "leads@goyalmyhomesanctuary.com";
    const senderFromName = (env && env.SENDER_NAME) || "Goyal My Home Sanctuary Concierge";

    const emailSubject = `⚡ [NEW LEAD] ${name} (${phoneClean}) - ${config} | Goyal My Home Sanctuary`;
    const emailPlainText = [
      `=== NEW LEAD NOTIFICATION: GOYAL MY HOME SANCTUARY ===`,
      `Lead ID: ${leadId}`,
      `Date/Time: ${leadRecord.timestamp}`,
      `Lead Type: ${type}`,
      `Customer Name: ${name}`,
      `Mobile Number: ${phoneClean}`,
      `Configuration: ${config}`,
      `Preferred Visit Date: ${date || "N/A"}`,
      `Preferred Visit Slot: ${time || "N/A"}`,
      `Chauffeur Cab Pickup: ${cab ? "YES" : "NO"}`,
      `Pickup Address: ${cab ? (address || "To be confirmed") : "Self Drive / N/A"}`,
      ``,
      `--- Network Telemetry ---`,
      `Cloudflare Ray ID: ${rayId}`,
      `Visitor Country: ${ipCountry}`,
      `Client IP: ${clientIp}`,
      `User-Agent: ${leadRecord.telemetry.userAgent}`,
      `======================================================`
    ].join("\n");

    const emailHtmlText = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #FAF8F5; border: 1px solid #E6DEC9; border-radius: 12px; overflow: hidden; color: #1E1711;">
        <div style="background: linear-gradient(135deg, #1E1711 0%, #2A1F17 100%); padding: 24px 28px; color: #F5EFEB; border-bottom: 3px solid #C49A45;">
          <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; color: #E8CA83;">Goyal My Home Sanctuary</h2>
          <p style="margin: 0; font-size: 13px; color: #E6DEC9; font-family: monospace;">VIP Priority Lead Alert &bull; Mamurdi, Pune</p>
        </div>
        <div style="padding: 24px 28px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr style="border-bottom: 1px solid #EFEAE1;">
              <td style="padding: 10px 0; color: #6E5F53; font-weight: 600; width: 38%;">Lead ID</td>
              <td style="padding: 10px 0; font-family: monospace; font-weight: 700; color: #1E1711;">${leadId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EFEAE1;">
              <td style="padding: 10px 0; color: #6E5F53; font-weight: 600;">Customer Name</td>
              <td style="padding: 10px 0; font-weight: 700; font-size: 16px; color: #1E1711;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EFEAE1;">
              <td style="padding: 10px 0; color: #6E5F53; font-weight: 600;">Mobile Number</td>
              <td style="padding: 10px 0;">
                <a href="tel:${phoneClean}" style="color: #A37930; font-weight: 700; text-decoration: none; font-size: 16px;">${phoneClean}</a>
                &nbsp;|&nbsp;
                <a href="https://wa.me/${phoneClean.replace(/[^0-9]/g, "")}" style="color: #059669; font-weight: 600; text-decoration: none; font-size: 13px;">Open WhatsApp</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #EFEAE1;">
              <td style="padding: 10px 0; color: #6E5F53; font-weight: 600;">Configuration</td>
              <td style="padding: 10px 0; font-weight: 600; color: #1E1711;">${config}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EFEAE1;">
              <td style="padding: 10px 0; color: #6E5F53; font-weight: 600;">Lead Category</td>
              <td style="padding: 10px 0; text-transform: uppercase; font-size: 12px; font-weight: 700; color: #78350F;">${type}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EFEAE1;">
              <td style="padding: 10px 0; color: #6E5F53; font-weight: 600;">Preferred Date &amp; Time</td>
              <td style="padding: 10px 0; color: #1E1711;">${date || "Not specified"} ${time ? `(${time})` : ""}</td>
            </tr>
            <tr style="border-bottom: 1px solid #EFEAE1;">
              <td style="padding: 10px 0; color: #6E5F53; font-weight: 600;">Chauffeur Cab Pickup</td>
              <td style="padding: 10px 0; font-weight: 600; color: ${cab ? "#047857" : "#4B5563"};">
                ${cab ? `YES - Pickup: ${address || "Address pending confirmation"}` : "Self-drive / Not requested"}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6E5F53; font-weight: 600;">Timestamp</td>
              <td style="padding: 10px 0; color: #6E5F53; font-size: 12px; font-family: monospace;">${leadRecord.timestamp}</td>
            </tr>
          </table>

          <div style="background: #FFFFFF; border: 1px dashed #D3C5AB; border-radius: 8px; padding: 14px 18px; font-size: 11px; color: #8C7B6D; font-family: monospace;">
            <div>Cloudflare Edge Ray: ${rayId} | Geo: ${ipCountry} | IP: ${clientIp}</div>
            <div style="margin-top: 4px;">Target Dispatch: ${targetLeadEmail}</div>
          </div>
        </div>
      </div>
    `;

    // 8a. Native Cloudflare Workers / Pages MailChannels Edge Dispatch
    try {
      const mailChannelsPayload = {
        personalizations: [
          {
            to: [{ email: targetLeadEmail, name: "Propsmart Realty Desk" }]
          }
        ],
        from: {
          email: senderFromEmail,
          name: senderFromName
        },
        reply_to: {
          email: targetLeadEmail,
          name: name
        },
        subject: emailSubject,
        content: [
          {
            type: "text/plain",
            value: emailPlainText
          },
          {
            type: "text/html",
            value: emailHtmlText
          }
        ]
      };

      await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(mailChannelsPayload),
        signal: AbortSignal.timeout(4000)
      }).catch(err => {
        console.warn(`[MailChannels Warning] Edge email delivery attempt: ${err.message}`);
      });
    } catch (mailErr) {
      console.warn(`[Mail Dispatch Warning] ${mailErr.message}`);
    }

    // 8b. Resend / SendGrid API Dispatch (if configured in env)
    if (env && env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: senderFromEmail,
            to: [targetLeadEmail],
            reply_to: targetLeadEmail,
            subject: emailSubject,
            html: emailHtmlText,
            text: emailPlainText
          }),
          signal: AbortSignal.timeout(4000)
        }).catch(() => {});
      } catch (e) {}
    }

    // 8c. Downstream CRM / Webhook Dispatch (Secure Timeout Protected)
    if (env && env.CRM_WEBHOOK_URL) {
      try {
        await fetch(env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Sanctuary-Key": env.CRM_API_KEY || "internal-edge",
            "X-Cloudflare-Ray": rayId,
            "X-Target-Recipient": targetLeadEmail
          },
          body: JSON.stringify({
            ...leadRecord,
            recipientEmail: targetLeadEmail
          }),
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
