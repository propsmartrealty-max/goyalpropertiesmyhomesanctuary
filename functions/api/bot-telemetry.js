/**
 * Cloudflare Pages Function: /api/bot-telemetry
 * Edge Bot Attribution & AI Crawler Telemetry Endpoint
 * 
 * Inspects incoming User-Agent headers, classifies AI scrapers & Search Engine crawlers,
 * and returns deterministic attribution telemetry without impacting edge latency.
 */

const KNOWN_AI_CRAWLERS = [
  { pattern: /GPTBot/i, id: "gptbot", name: "OpenAI GPTBot", provider: "OpenAI", type: "llm_training" },
  { pattern: /ChatGPT-User/i, id: "chatgpt-user", name: "ChatGPT User Web Browsing", provider: "OpenAI", type: "browsing_plugin" },
  { pattern: /ClaudeBot/i, id: "claudebot", name: "Anthropic ClaudeBot", provider: "Anthropic", type: "llm_training" },
  { pattern: /anthropic-ai/i, id: "anthropic-ai", name: "Anthropic AI Crawler", provider: "Anthropic", type: "llm_training" },
  { pattern: /Google-Extended/i, id: "google-extended", name: "Google Gemini Extended", provider: "Google", type: "llm_training" },
  { pattern: /PerplexityBot/i, id: "perplexitybot", name: "Perplexity AI Indexer", provider: "Perplexity AI", type: "rag_search" },
  { pattern: /Bytespider/i, id: "bytespider", name: "ByteDance ByteSpider", provider: "ByteDance", type: "llm_training" },
  { pattern: /Applebot-Extended/i, id: "applebot-extended", name: "Apple Intelligence Extended", provider: "Apple", type: "llm_training" },
  { pattern: /Amazonbot/i, id: "amazonbot", name: "Amazon Bot", provider: "Amazon", type: "llm_training" },
  { pattern: /Cohere-ai/i, id: "cohere-ai", name: "Cohere Command Model Crawler", provider: "Cohere", type: "llm_training" },
  { pattern: /CCBot/i, id: "ccbot", name: "Common Crawl Bot", provider: "Common Crawl", type: "open_dataset" },
  { pattern: /Diffbot/i, id: "diffbot", name: "Diffbot Knowledge Graph Extractor", provider: "Diffbot", type: "structured_graph" },
  { pattern: /FacebookBot/i, id: "facebookbot", name: "Meta FacebookBot", provider: "Meta", type: "llm_training" }
];

const KNOWN_SEARCH_CRAWLERS = [
  { pattern: /Googlebot/i, id: "googlebot", name: "Google Search Engine Bot", provider: "Google", type: "search_indexer" },
  { pattern: /bingbot/i, id: "bingbot", name: "Microsoft BingBot", provider: "Microsoft", type: "search_indexer" },
  { pattern: /YandexBot/i, id: "yandexbot", name: "Yandex Search Bot", provider: "Yandex", type: "search_indexer" },
  { pattern: /DuckDuckBot/i, id: "duckduckbot", name: "DuckDuckGo Crawler", provider: "DuckDuckGo", type: "search_indexer" },
  { pattern: /Baiduspider/i, id: "baiduspider", name: "Baidu Search Spider", provider: "Baidu", type: "search_indexer" }
];

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const targetUa = url.searchParams.get("ua") || request.headers.get("user-agent") || "";
  
  let classified = null;
  let category = "human_or_generic_client";

  // 1. Check AI Crawlers
  for (const bot of KNOWN_AI_CRAWLERS) {
    if (bot.pattern.test(targetUa)) {
      classified = bot;
      category = "ai_crawler";
      break;
    }
  }

  // 2. Check Search Crawlers
  if (!classified) {
    for (const bot of KNOWN_SEARCH_CRAWLERS) {
      if (bot.pattern.test(targetUa)) {
        classified = bot;
        category = "search_engine_crawler";
        break;
      }
    }
  }

  const attributionReport = {
    status: "success",
    timestamp: new Date().toISOString(),
    client_user_agent: targetUa,
    category: category,
    is_bot: category !== "human_or_generic_client",
    is_ai_agent: category === "ai_crawler",
    bot_details: classified ? {
      id: classified.id,
      name: classified.name,
      provider: classified.provider,
      functional_purpose: classified.type
    } : null,
    robot_policy: {
      allowed_paths: ["/", "/faqs.jsonld", "/catalog.jsonld", "/ai-facts.json", "/tour.jsonld", "/schools.jsonld", "/loans.jsonld"],
      disallowed_paths: ["/api/vitals", "/api/lead-capture"],
      crawl_delay_seconds: 0
    },
    knowledge_islands_available: [
      { uri: "https://goyalmyhomesanctuary.in/ai-facts.json", type: "canonical_ai_facts" },
      { uri: "https://goyalmyhomesanctuary.in/faqs.jsonld", type: "voice_search_faqs" },
      { uri: "https://goyalmyhomesanctuary.in/catalog.jsonld", type: "inventory_offer_catalog" },
      { uri: "https://goyalmyhomesanctuary.in/tour.jsonld", type: "virtual_3d_tour" },
      { uri: "https://goyalmyhomesanctuary.in/loans.jsonld", type: "approved_bank_apf_loans" },
      { uri: "https://goyalmyhomesanctuary.in/schools.jsonld", type: "educational_transit_graph" },
      { uri: "https://goyalmyhomesanctuary.in/.well-known/ai.txt", type: "ai_crawler_manifest" }
    ]
  };

  return new Response(JSON.stringify(attributionReport, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "Access-Control-Allow-Origin": "*",
      "X-Bot-Class": category
    }
  });
}

export async function onRequestPost({ request, env }) {
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    // Graceful fallback
  }

  const incomingUa = body.userAgent || request.headers.get("user-agent") || "";
  const syntheticReq = new Request(`https://goyalmyhomesanctuary.in/api/bot-telemetry?ua=${encodeURIComponent(incomingUa)}`);
  return onRequestGet({ request: syntheticReq, env });
}
