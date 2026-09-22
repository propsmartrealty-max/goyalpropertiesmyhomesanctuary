/**
 * Cloudflare Pages Function: /api/whatsapp-router
 * Context-Aware WhatsApp Concierge Deep-Link Router API
 * 
 * Generates structured, pre-filled WhatsApp deep-links targeting official sales desk numbers.
 */

const WHATSAPP_NUMBERS = {
  primary: "919175319441",
  senior_desk: "919822033333"
};

const INTENT_MESSAGES = {
  "cost_sheet": "Hi PropSmart, I would like to receive the official RERA price breakdown & cost sheet for Goyal My Home Sanctuary, Mamurdi.",
  "site_visit": "Hi PropSmart, I would like to schedule a private site visit and sample flat walkthrough at Goyal My Home Sanctuary, Mamurdi this weekend.",
  "2bhk_inquiry": "Hi PropSmart, I am interested in the 2 BHK configurations (Classic/Premier/Signature) starting from ₹69 L* at Goyal My Home Sanctuary.",
  "3bhk_inquiry": "Hi PropSmart, I am interested in the 3 BHK sky residences (Classic/Premier/Signature) starting from ₹86 L* at Goyal My Home Sanctuary.",
  "nri_virtual_tour": "Hi PropSmart, I am an NRI buyer and would like to request an international 4K virtual video walkthrough and APF financing guidance.",
  "default": "Hi PropSmart, I would like more information regarding Goyal My Home Sanctuary, Mamurdi (MahaRERA: PR1261012502725)."
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const intent = url.searchParams.get("intent") || "default";
  const unit = url.searchParams.get("unit") || "";
  const source = url.searchParams.get("source") || "website_edge";

  let baseMessage = INTENT_MESSAGES[intent] || INTENT_MESSAGES["default"];
  if (unit) {
    baseMessage += ` (Specific Unit: ${unit})`;
  }
  baseMessage += ` [Ref: ${source}]`;

  const phone = intent === "nri_virtual_tour" ? WHATSAPP_NUMBERS.senior_desk : WHATSAPP_NUMBERS.primary;
  const encodedText = encodeURIComponent(baseMessage);
  const deepLink = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;

  return new Response(JSON.stringify({
    status: "success",
    intent: intent,
    target_phone: phone,
    prefilled_message: baseMessage,
    whatsapp_url: deepLink
  }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
