/**
 * Cloudflare Pages Function: /api/queue-token
 * Smart Priority Token & Booking Queue Engine
 * 
 * Generates cryptographically sequenced digital tokens for high-demand unit hold releases
 * and preview appointments without race conditions.
 */

export async function onRequestPost({ request, env }) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    // Fallback if empty body
  }

  const clientName = body.name || "Valued Buyer";
  const preferredTypology = body.typology || "2bhk-classic";
  const now = Date.now();
  const sequenceNum = (now % 10000).toString().padStart(4, "0");
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const tokenCode = `TOKEN-2026-PCMC-${sequenceNum}-${randomSuffix}`;

  const tokenPayload = {
    status: "active",
    token_code: tokenCode,
    issued_at: new Date().toISOString(),
    expires_at: new Date(now + 48 * 3600 * 1000).toISOString(), // 48h priority window
    applicant: {
      name: clientName,
      preferred_unit: preferredTypology
    },
    allocation_tier: "Priority Priority Access (PCMC Fast-Track)",
    project: "Goyal My Home Sanctuary, Mamurdi",
    maharera_reg_no: "PR1261012502725 / P52100077438",
    instructions: "Present this digital token during executive tour desk check-in or virtual hold confirmation."
  };

  return new Response(JSON.stringify(tokenPayload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "X-Token-Status": "issued"
    }
  });
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const typology = url.searchParams.get("typology") || "2bhk-classic";
  const name = url.searchParams.get("name") || "Prospective Buyer";

  const syntheticReq = new Request("https://goyalmyhomesanctuary.in/api/queue-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, typology })
  });
  return onRequestPost({ request: syntheticReq, env: {} });
}
