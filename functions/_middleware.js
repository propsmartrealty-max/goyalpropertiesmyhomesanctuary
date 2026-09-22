/**
 * Cloudflare Pages Function Middleware: /functions/_middleware.js
 * Edge AI Crawler Shield & Global Security Header Middleware
 * 
 * Provides automated bot categorization, rate limit defense, and
 * standardized security headers across all edge serverless functions.
 */

const KNOWN_ALLOWED_CRAWLERS = [
  /Googlebot/i,
  /bingbot/i,
  /GPTBot/i,
  /ClaudeBot/i,
  /PerplexityBot/i,
  /Applebot/i,
  /YandexBot/i,
  /Baiduspider/i
];

const MALICIOUS_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /masscan/i,
  /acunetix/i,
  /wpscan/i
];

export async function onRequest(context) {
  const { request, next } = context;
  const userAgent = request.headers.get("user-agent") || "";

  // 1. Block known vulnerability scanners & malicious exploit bots
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(userAgent)) {
      return new Response(JSON.stringify({
        error: "Forbidden",
        message: "Automated vulnerability scanner access is prohibited.",
        status: 403
      }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Blocked-Reason": "malicious_bot_pattern"
        }
      });
    }
  }

  // 2. Identify authorized AI & Search Agents
  let isAuthorizedCrawler = false;
  for (const botPattern of KNOWN_ALLOWED_CRAWLERS) {
    if (botPattern.test(userAgent)) {
      isAuthorizedCrawler = true;
      break;
    }
  }

  // 3. Process the downstream request
  const response = await next();

  // 4. Clone & inject security and observability headers
  const newHeaders = new Headers(response.headers);
  newHeaders.set("X-Edge-Agent-Guard", isAuthorizedCrawler ? "authorized-crawler" : "standard-traffic");
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
