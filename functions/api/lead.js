/**
 * Cloudflare Pages Function: /api/lead
 * Edge handler for VIP inquiries, site visit bookings, and brochure requests
 */

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const contentType = request.headers.get("content-type") || "";

    let body = {};
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Unsupported Content-Type" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const { name, phone, config, type, date, time, cab, address } = body;

    // Validate required fields
    if (!name || !phone) {
      return new Response(
        JSON.stringify({ success: false, error: "Name and phone are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Structured lead payload for CRM or Webhook integration
    const leadRecord = {
      projectId: "goyal-my-home-sanctuary",
      timestamp: new Date().toISOString(),
      leadType: type || "site-visit",
      leadName: name,
      phoneNumber: phone,
      configuration: config || "2 BHK Luxe",
      preferredDate: date || null,
      preferredTime: time || null,
      cabRequested: Boolean(cab),
      pickupAddress: address || null,
      source: "cloudflare-pages-edge",
      ipCountry: request.headers.get("cf-ipcountry") || "IN"
    };

    // If an external webhook is configured via Cloudflare Environment Variable (e.g. CRM_WEBHOOK_URL)
    if (env && env.CRM_WEBHOOK_URL) {
      await fetch(env.CRM_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadRecord)
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "VIP inquiry registered successfully at Cloudflare edge.",
        data: {
          leadId: "SANCTUARY-" + Date.now().toString(36).toUpperCase(),
          leadName: name
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Internal Edge Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

// Preflight CORS handler for Cloudflare Edge
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
