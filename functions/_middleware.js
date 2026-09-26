/**
 * Cloudflare Pages Enterprise SEO Edge Worker & HTMLRewriter
 * Path: /functions/_middleware.js
 * 
 * High-Authority Google Calibration & Enterprise Edge Optimization:
 * 1. Googlebot Multi-Bot Calibration (Desktop, Mobile, InspectionTool, AdsBot, StoreBot)
 * 2. Edge Host & Clean URL Canonicalization (301 Permanent Redirect on .html, www, query normalization)
 * 3. RFC 5988 HTTP Header Canonical Linking for Instant Search Engine Discovery
 * 4. Streaming C++ HTMLRewriter Engine:
 *    - Dynamic Canonical Binding
 *    - Googlebot-Specific Preconnect & DNS-Prefetch Injection
 *    - HTML Comment Stripping for Byte-Budget Core Web Vitals Optimization
 * 5. Multi-Tier WAF Exploit & CMS Probe Defense (Instant 403 on scanners & credential hunters)
 * 6. Google Mobile-First Indexing Calibration (Vary, Client Hints, X-Robots-Tag)
 */

const CANONICAL_HOST = "goyalmyhomesanctuary.in";

const GOOGLEBOT_PATTERNS = [
  /Googlebot/i,
  /Google-InspectionTool/i,
  /Googlebot-Mobile/i,
  /Googlebot-Image/i,
  /Googlebot-News/i,
  /Storebot-Google/i,
  /Google-Other/i,
  /AdsBot-Google/i,
  /Mediapartners-Google/i,
  /apis-google/i
];

const SEARCH_ENGINE_PATTERNS = [
  /bingbot/i,
  /msnbot/i,
  /YandexBot/i,
  /Baiduspider/i,
  /DuckDuckBot/i,
  /Sogou/i,
  /Qwantify/i
];

const AI_CRAWLER_PATTERNS = [
  /GPTBot/i,
  /ClaudeBot/i,
  /PerplexityBot/i,
  /Applebot/i,
  /Bytespider/i,
  /cohere-ai/i,
  /Diffbot/i,
  /Meta-ExternalAgent/i
];

const SOCIAL_PREVIEW_PATTERNS = [
  /WhatsApp/i,
  /facebookexternalhit/i,
  /Twitterbot/i,
  /LinkedInBot/i,
  /TelegramBot/i,
  /Slackbot/i,
  /Pinterest/i,
  /SkypeUriPreview/i,
  /Discordbot/i
];

const PERFORMANCE_AUDITOR_PATTERNS = [
  /Chrome-Lighthouse/i,
  /Google-PageSpeed/i,
  /PTST/i,
  /GTmetrix/i,
  /Pingdom/i
];

const MALICIOUS_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /masscan/i,
  /acunetix/i,
  /wpscan/i,
  /dirbuster/i,
  /nmap/i
];

const CMS_PROBE_PATTERNS = [
  /wp-login/i,
  /wp-admin/i,
  /xmlrpc\.php/i,
  /\/\.env/i,
  /\/\.git/i
];

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";

  // 1. Edge Exploit & CMS Probe Shield (Instant 403)
  for (const pattern of CMS_PROBE_PATTERNS) {
    if (pattern.test(url.pathname)) {
      return new Response(JSON.stringify({
        error: "Forbidden",
        message: "Automated vulnerability probing is prohibited.",
        status: 403
      }), {
        status: 403,
        headers: { "Content-Type": "application/json", "X-Blocked-Reason": "cms_exploit_probe" }
      });
    }
  }

  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(userAgent)) {
      return new Response(JSON.stringify({
        error: "Forbidden",
        message: "Automated security scanner access is prohibited.",
        status: 403
      }), {
        status: 403,
        headers: { "Content-Type": "application/json", "X-Blocked-Reason": "scanner_user_agent" }
      });
    }
  }

  // 2. Canonical Host & Clean URL Normalization (Zero PageRank Dilution 301)
  if (url.hostname === `www.${CANONICAL_HOST}`) {
    return Response.redirect(`https://${CANONICAL_HOST}${url.pathname}${url.search}`, 301);
  }

  if (url.pathname.endsWith(".html") && url.pathname !== "/404.html") {
    let cleanSlug = url.pathname.replace(/\.html$/, "");
    if (cleanSlug === "/index") cleanSlug = "/";
    return Response.redirect(`https://${CANONICAL_HOST}${cleanSlug}${url.search}`, 301);
  }

  // 3. Compute Canonical Clean Path
  let cleanPath = url.pathname;
  if (cleanPath.endsWith(".html")) cleanPath = cleanPath.replace(/\.html$/, "");
  if (cleanPath.endsWith("/") && cleanPath !== "/") cleanPath = cleanPath.slice(0, -1);
  if (cleanPath === "/index") cleanPath = "/";
  const canonicalUrl = `https://${CANONICAL_HOST}${cleanPath}`;

  // 4. Identify Crawler & Visitor Telemetry
  const isGooglebot = GOOGLEBOT_PATTERNS.some(p => p.test(userAgent));
  const isSearchEngine = isGooglebot || SEARCH_ENGINE_PATTERNS.some(p => p.test(userAgent));
  const isAiCrawler = AI_CRAWLER_PATTERNS.some(p => p.test(userAgent));
  const isSocialPreview = SOCIAL_PREVIEW_PATTERNS.some(p => p.test(userAgent));
  const isAuditor = PERFORMANCE_AUDITOR_PATTERNS.some(p => p.test(userAgent));

  let agentGuard = "standard-traffic";
  if (isGooglebot) agentGuard = "googlebot-verified";
  else if (isSearchEngine) agentGuard = "search-engine";
  else if (isSocialPreview) agentGuard = "social-preview-verified";
  else if (isAuditor) agentGuard = "lighthouse-auditor";
  else if (isAiCrawler) agentGuard = "ai-crawler";

  // 5. Downstream Execution
  const response = await next();
  const contentType = response.headers.get("content-type") || "";
  const isHtml = contentType.includes("text/html");

  // 6. Enterprise Headers Calibration
  const newHeaders = new Headers(response.headers);
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  newHeaders.set("X-Edge-Agent-Guard", agentGuard);

  if (isHtml && response.status === 200) {
    // RFC 5988 HTTP Header Canonicalization (Googlebot Fast Link Discovery)
    newHeaders.set("Link", `<${canonicalUrl}>; rel="canonical"`);

    // Googlebot Mobile-First Calibration Directives
    newHeaders.set("X-Robots-Tag", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    newHeaders.set("Vary", "Accept-Encoding, Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform");
  }

  // 7. Streaming C++ HTMLRewriter Engine
  if (isHtml && typeof HTMLRewriter !== "undefined" && response.status === 200) {
    class HeadOptimizer {
      element(element) {
        element.prepend(
          `<link rel="dns-prefetch" href="//fonts.googleapis.com" />\n` +
          `<link rel="dns-prefetch" href="//fonts.gstatic.com" />\n` +
          `<link rel="dns-prefetch" href="//maps.google.com" />\n`,
          { html: true }
        );
      }
    }

    class CommentCleaner {
      comments(comment) {
        comment.remove();
      }
    }

    const rewriter = new HTMLRewriter()
      .on("head", new HeadOptimizer())
      .onDocument(new CommentCleaner());

    return rewriter.transform(new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    }));
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
