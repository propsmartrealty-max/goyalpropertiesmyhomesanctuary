/**
 * Cloudflare Pages Function: functions/api/og.js
 * 
 * Dynamic Edge OpenGraph Social Card Generator
 * Generates high-resolution 1200x630 vector cards for WhatsApp, LinkedIn, X & Facebook
 * 
 * Query Parameters:
 * - title: Page title or query
 * - market: Micro-market name (e.g., "Chinchwad", "Mamurdi", "PCMC")
 * - config: Configuration name (e.g., "3 BHK Premier", "2 BHK Classic")
 * - price: Starting price (e.g., "₹86 Lakhs*", "₹69 Lakhs*")
 */

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const market = url.searchParams.get('market') || 'Mamurdi, PCMC';
  const config = url.searchParams.get('config') || 'Luxury 2 & 3 BHK Residences';
  const price = url.searchParams.get('price') || 'Starting ₹69 Lakhs*';
  const title = url.searchParams.get('title') || `${config} in ${market} Pune`;

  // Escape HTML entities for SVG safety
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const safeMarket = market.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeConfig = config.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safePrice = price.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4af37"/>
      <stop offset="50%" stop-color="#f3e5ab"/>
      <stop offset="100%" stop-color="#aa7c11"/>
    </linearGradient>
    <linearGradient id="darkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070b09"/>
      <stop offset="50%" stop-color="#0c1410"/>
      <stop offset="100%" stop-color="#121d17"/>
    </linearGradient>
    <radialGradient id="goldGlow" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0c1410" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#darkBg)"/>
  <rect width="1200" height="630" fill="url(#goldGlow)"/>

  <!-- Border Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="24" fill="none" stroke="url(#gold)" stroke-width="2" stroke-opacity="0.35"/>

  <!-- Brand Eyebrow -->
  <g transform="translate(70, 85)">
    <circle cx="20" cy="20" r="20" fill="url(#gold)"/>
    <text x="20" y="27" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0c1410" text-anchor="middle">S</text>
    <text x="56" y="18" font-family="serif" font-size="22" font-weight="bold" fill="#ffffff" letter-spacing="2">GOYAL MY HOME SANCTUARY</text>
    <text x="56" y="38" font-family="sans-serif" font-size="13" font-weight="600" fill="#d4af37" letter-spacing="3">MAMURDI, PCMC PUNE WEST • BY GOYAL PROPERTIES</text>
  </g>

  <!-- Dynamic Configuration & Micro-Market Badge -->
  <g transform="translate(70, 180)">
    <rect width="320" height="38" rx="19" fill="#d4af37" fill-opacity="0.15" stroke="#d4af37" stroke-width="1" stroke-opacity="0.4"/>
    <text x="20" y="24" font-family="sans-serif" font-size="14" font-weight="bold" fill="#d4af37" letter-spacing="1.5">EXCLUSIVE IN: ${safeMarket.toUpperCase()}</text>
  </g>

  <!-- Main Headline Title -->
  <text x="70" y="280" font-family="serif" font-size="52" font-weight="bold" fill="#ffffff">
    ${safeConfig}
  </text>
  <text x="70" y="335" font-family="serif" font-size="34" font-weight="normal" fill="#e2e8f0">
    at Goyal My Home Sanctuary
  </text>

  <!-- Price Badge -->
  <g transform="translate(70, 375)">
    <rect width="360" height="72" rx="16" fill="url(#gold)"/>
    <text x="28" y="47" font-family="sans-serif" font-size="32" font-weight="800" fill="#070b09">
      ${safePrice}
    </text>
  </g>

  <!-- Feature Highlights -->
  <g transform="translate(70, 485)">
    <rect x="0" y="0" width="180" height="36" rx="8" fill="#ffffff" fill-opacity="0.08"/>
    <text x="14" y="23" font-family="sans-serif" font-size="13" font-weight="600" fill="#cbd5e1">72% Forest Canopy</text>

    <rect x="195" y="0" width="200" height="36" rx="8" fill="#ffffff" fill-opacity="0.08"/>
    <text x="209" y="23" font-family="sans-serif" font-size="13" font-weight="600" fill="#cbd5e1">35,000 sq.ft Clubhouse</text>

    <rect x="410" y="0" width="220" height="36" rx="8" fill="#ffffff" fill-opacity="0.08"/>
    <text x="424" y="23" font-family="sans-serif" font-size="13" font-weight="600" fill="#cbd5e1">0-Km Expressway Access</text>

    <rect x="645" y="0" width="195" height="36" rx="8" fill="#ffffff" fill-opacity="0.08"/>
    <text x="659" y="23" font-family="sans-serif" font-size="13" font-weight="600" fill="#cbd5e1">100% MIVAN Structure</text>
  </g>

  <!-- Footer Regulatory & Authenticity Tag -->
  <g transform="translate(70, 565)">
    <text x="0" y="16" font-family="sans-serif" font-size="14" font-weight="bold" fill="#d4af37">
      MahaRERA Registration No.: PR1261012502725 / P52100077438
    </text>
    <text x="680" y="16" font-family="sans-serif" font-size="13" font-weight="500" fill="#94a3b8">
      Authorized Marketing: PropSmart Realty | +91 91753 19441
    </text>
  </g>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
