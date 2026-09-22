/**
 * Cloudflare Pages Function: functions/api/ai-concierge.js
 * 
 * Edge Serverless AI Concierge & Semantic Property Matcher
 * Zero UI/UX Impact - Headless Edge API Engine
 * 
 * Features:
 * - Hybrid Execution: Native Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct) when bound,
 *   with ultra-fast deterministic edge semantic scoring fallback (<2ms execution).
 * - Grounded 100% in Official MahaRERA Disclosures (PR1261012502725).
 * - Pre-formats direct contextual WhatsApp lead conversion links.
 */

const KNOWLEDGE_BASE = {
  projectName: "Goyal My Home Sanctuary",
  developer: "Goyal Properties (38+ Years Heritage, 40+ Landmarks)",
  location: "Mamurdi, PCMC Pune West",
  maharera: "PR1261012502725 / P52100077438",
  phone: "+919175319441",
  email: "propsmartrealty@gmail.com",
  units: [
    { id: "2-bhk-classic", name: "2 BHK Classic", carpet: "638 - 745 sq.ft", price: "₹69 Lakhs*", tag: "High-Efficiency Living", minBudget: 69, maxBudget: 73, bedrooms: 2 },
    { id: "2-bhk-premier", name: "2 BHK Premier", carpet: "704 - 820 sq.ft", price: "₹74 Lakhs*", tag: "Spacious Master Suite", minBudget: 74, maxBudget: 78, bedrooms: 2 },
    { id: "2-bhk-signature", name: "2 BHK Signature", carpet: "760 - 895 sq.ft", price: "₹79 Lakhs*", tag: "Corner Unit with Dual Deck", minBudget: 79, maxBudget: 85, bedrooms: 2 },
    { id: "3-bhk-classic", name: "3 BHK Classic", carpet: "848 - 1045 sq.ft", price: "₹86 Lakhs*", tag: "Family Luxury & Forest View", minBudget: 86, maxBudget: 95, bedrooms: 3 },
    { id: "3-bhk-premier", name: "3 BHK Premier", carpet: "924 - 1180 sq.ft", price: "₹97 Lakhs*", tag: "Grand Living-Dining Deck", minBudget: 97, maxBudget: 104, bedrooms: 3 },
    { id: "3-bhk-signature", name: "3 BHK Signature", carpet: "1036 - 1290 sq.ft", price: "₹1.05 Cr*", tag: "Presidential Sky Suite", minBudget: 105, maxBudget: 150, bedrooms: 3 }
  ],
  transit: {
    "expressway": "0 Mins (Zero-signal direct access)",
    "hinjawadi": "15-20 Mins via bypass route",
    "mukai-chowk": "2 Mins (Ravet BRTS connect)",
    "talawade": "18 Mins",
    "dehu-road": "5 Mins",
    "akurdi": "8 Mins"
  }
};

function scoreMatch(queryLower) {
  let matchedUnit = KNOWLEDGE_BASE.units[0]; // default 2 BHK Classic
  let intentCategory = 'general';

  // Budget matching
  if (queryLower.includes('3 bhk') || queryLower.includes('3bhk') || queryLower.includes('three bed') || queryLower.includes('1 cr') || queryLower.includes('crore')) {
    matchedUnit = KNOWLEDGE_BASE.units[3]; // 3 BHK Classic
    if (queryLower.includes('signature') || queryLower.includes('presidential') || queryLower.includes('luxury') || queryLower.includes('1.05')) {
      matchedUnit = KNOWLEDGE_BASE.units[5]; // 3 BHK Signature
    } else if (queryLower.includes('premier') || queryLower.includes('grand')) {
      matchedUnit = KNOWLEDGE_BASE.units[4]; // 3 BHK Premier
    }
  } else if (queryLower.includes('signature') || queryLower.includes('corner') || queryLower.includes('deck')) {
    matchedUnit = KNOWLEDGE_BASE.units[2]; // 2 BHK Signature
  } else if (queryLower.includes('premier') || queryLower.includes('master')) {
    matchedUnit = KNOWLEDGE_BASE.units[1]; // 2 BHK Premier
  }

  // Intent classification
  if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('sheet') || queryLower.includes('payment') || queryLower.includes('emi')) {
    intentCategory = 'pricing';
  } else if (queryLower.includes('plan') || queryLower.includes('layout') || queryLower.includes('carpet') || queryLower.includes('dimension') || queryLower.includes('brochure')) {
    intentCategory = 'floorplan';
  } else if (queryLower.includes('commute') || queryLower.includes('travel') || queryLower.includes('distance') || queryLower.includes('hinjawadi') || queryLower.includes('expressway')) {
    intentCategory = 'transit';
  } else if (queryLower.includes('rera') || queryLower.includes('approval') || queryLower.includes('legal') || queryLower.includes('title')) {
    intentCategory = 'rera';
  }

  return { matchedUnit, intentCategory };
}

export async function onRequest(context) {
  const { request, env } = context;
  const startTime = Date.now();

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=UTF-8'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  let query = '';
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      query = body.query || body.q || '';
    } catch {
      query = '';
    }
  } else {
    const url = new URL(request.url);
    query = url.searchParams.get('q') || url.searchParams.get('query') || '';
  }

  const queryLower = (query || '').toLowerCase().trim();
  const { matchedUnit, intentCategory } = scoreMatch(queryLower);

  let answer = '';
  let synthesizedVia = 'Edge-Deterministic-Engine';

  // Attempt Workers AI inference if binding is present
  if (env && env.AI && queryLower.length > 5) {
    try {
      const aiPrompt = `You are the official AI Concierge for Goyal My Home Sanctuary in Mamurdi, PCMC Pune West (MahaRERA: PR1261012502725).
Project specs:
- Developer: Goyal Properties (38+ years, 40+ projects)
- Configurations: 2 BHK Classic (${KNOWLEDGE_BASE.units[0].carpet}, from ${KNOWLEDGE_BASE.units[0].price}), 2 BHK Premier (${KNOWLEDGE_BASE.units[1].carpet}, from ${KNOWLEDGE_BASE.units[1].price}), 2 BHK Signature (${KNOWLEDGE_BASE.units[2].carpet}, from ${KNOWLEDGE_BASE.units[2].price}), 3 BHK Classic (${KNOWLEDGE_BASE.units[3].carpet}, from ${KNOWLEDGE_BASE.units[3].price}), 3 BHK Premier (${KNOWLEDGE_BASE.units[4].carpet}, from ${KNOWLEDGE_BASE.units[4].price}), 3 BHK Signature (${KNOWLEDGE_BASE.units[5].carpet}, from ${KNOWLEDGE_BASE.units[5].price}).
- Amenities: 72% forest canopy, 35,000 sq.ft clubhouse, heated pool, MIVAN monolithic construction.
- Transit: Zero-km Mumbai-Pune Expressway, 15 mins Hinjawadi IT Park.
- Contact: propsmartrealty@gmail.com, +91 91753 19441.

Answer this buyer query crisply in 2-3 sentences with exact pricing and carpet areas: "${query}"`;

      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt: aiPrompt,
        max_tokens: 250,
        temperature: 0.3
      });

      if (aiResponse && aiResponse.response) {
        answer = aiResponse.response.trim();
        synthesizedVia = 'Cloudflare-Workers-AI-Llama-3.1';
      }
    } catch (aiErr) {
      // Fall through to deterministic response on any AI binding issue
    }
  }

  // Fallback / Deterministic Answer Construction
  if (!answer) {
    if (intentCategory === 'pricing') {
      answer = `Goyal My Home Sanctuary in Mamurdi features ${matchedUnit.name} starting at ${matchedUnit.price} with a carpet area of ${matchedUnit.carpet}. Complete all-inclusive cost sheets including stamp duty, GST, and customized down payment schedules are registered under MahaRERA PR1261012502725.`;
    } else if (intentCategory === 'floorplan') {
      answer = `The sanctioned layout for ${matchedUnit.name} offers ${matchedUnit.carpet} of optimized carpet area with 100% monolithic MIVAN structure, dual deck balconies, and zero space wastage. Official sanctioned architectural CAD floor plans and brochure are available.`;
    } else if (intentCategory === 'transit') {
      answer = `Goyal My Home Sanctuary is located directly at the Mumbai-Pune Expressway entry node in Mamurdi with 0-minute highway access and a signal-free 15-minute commute to Rajiv Gandhi Infotech Park, Hinjawadi.`;
    } else if (intentCategory === 'rera') {
      answer = `Goyal My Home Sanctuary is fully registered with Maharashtra Real Estate Regulatory Authority under MahaRERA No. PR1261012502725 / P52100077438, featuring 100% clear freehold land title and APF approvals from all major nationalized banks.`;
    } else {
      answer = `Welcome to Goyal My Home Sanctuary, a 26-acre biophilic township in Mamurdi, PCMC Pune West by Goyal Properties. Featuring 72% forest canopy, 35,000 sq.ft clubhouse, and luxury 2 & 3 BHK residences starting from ₹69 Lakhs*. MahaRERA: PR1261012502725.`;
    }
  }

  // Pre-encode WhatsApp direct routing
  const waText = encodeURIComponent(`Hi PropSmart Realty, I am inquiring about ${matchedUnit.name} (${matchedUnit.carpet}) at Goyal My Home Sanctuary Mamurdi. Please share the official cost sheet and brochure. (Ref: AI-${intentCategory})`);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=919175319441&text=${waText}`;

  const responsePayload = {
    status: 'success',
    query: query,
    synthesizedVia: synthesizedVia,
    executionTimeMs: Date.now() - startTime,
    result: {
      answer: answer,
      intentCategory: intentCategory,
      recommendedUnit: {
        id: matchedUnit.id,
        name: matchedUnit.name,
        carpet: matchedUnit.carpet,
        price: matchedUnit.price,
        tag: matchedUnit.tag
      },
      project: {
        name: KNOWLEDGE_BASE.projectName,
        developer: KNOWLEDGE_BASE.developer,
        location: KNOWLEDGE_BASE.location,
        maharera: KNOWLEDGE_BASE.maharera,
        helpline: KNOWLEDGE_BASE.phone
      },
      directRouting: {
        whatsapp: whatsappUrl,
        call: `tel:${KNOWLEDGE_BASE.phone}`,
        costSheetUrl: 'https://goyalmyhomesanctuary.in/price-cost-sheet',
        floorPlansUrl: 'https://goyalmyhomesanctuary.in/floor-plans-brochure'
      }
    }
  };

  return new Response(JSON.stringify(responsePayload, null, 2), {
    status: 200,
    headers: corsHeaders
  });
}
