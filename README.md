# Goyal My Home Sanctuary - Production-Grade Architecture

An avant-garde, ultra-luxurious, responsive real estate web application built for **Goyal My Home Sanctuary, Mamurdi, Pune West**. Optimized for **Cloudflare Advanced Pages**, **Google Search (Rich Results & Knowledge Graph)**, **Google Ecosystem (PWA, GA4, GTM)**, and **Core Web Vitals**.

---

## 🌟 Project Identifiers & Verified Specifications

- **Project:** Goyal My Home Sanctuary
- **Developer:** Goyal Properties (35+ Years of Built Trust, 50+ Projects)
- **Location:** Survey No. 8(P), Near Mukai Chowk, Kiwale-Mamurdi Road, Pune - 412101
- **GPS Coordinates:** `18.6638° N, 73.7138° E` ([Google Maps Location](https://www.google.com/maps/place/My+Home+Sanctuary/@18.66376,73.7112087,879m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bc2b1002632e9cb:0x85357e0bc6be7a2!8m2!3d18.66376!4d73.7137836!16s%2Fg%2F11yfq11z0t))
- **MahaRERA Registration:** `PR1261012502725`
- **Official MahaRERA Portal:** [maharera.mahaonline.gov.in](https://maharera.mahaonline.gov.in)
- **Land Parcel:** 26-Acre Integrated Biophilic Township
- **Green Cover:** 72% Dedicated Open Forest Canopy & Native Avian Reserve
- **Structure:** G+28 High-Rise Monolithic Towers (100% MIVAN Technology)
- **Amenities:** 75+ Curated Lifestyle Experiences across 2+ Acres
- **Residences:**
  - **2 BHK Luxe:** 638 to 760 sq.ft. (Starting ₹62.50 Lakhs*)
  - **2 BHK Grande:** 760 to 840 sq.ft. (Starting ₹74.80 Lakhs*)
  - **3 BHK Grande:** 848 to 945 sq.ft. (Starting ₹82.50 Lakhs*)
  - **3 BHK Signature:** 1,036 to 1,165 sq.ft. (Starting ₹1.02 Crore*)

---

## ⚡ Cloudflare Advanced Pages Optimizations

1. **`_headers` Configuration:**
   - **HTTP/3 & Strict Security:** `Strict-Transport-Security (HSTS)`, `Content-Security-Policy (CSP)`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
   - **Edge Caching Matrix:**
     - Static assets (`/css/*`, `/js/*`, `/assets/*`, `favicon.svg`): `public, max-age=31536000, immutable`.
     - HTML documents: `public, max-age=0, must-revalidate` (instant cache purging & stale-while-revalidate).
     - XML & Manifest: `max-age=86400`.
2. **`_redirects` Configuration:**
   - Canonical 301 redirects from `/index.html`, `/home`, and `/index` to root `/`.
3. **Cloudflare Serverless Edge Function (`functions/api/lead.js`):**
   - Handles `POST /api/lead` at Cloudflare's edge network with CORS support and CRM webhook forwarding (`CRM_WEBHOOK_URL`).

---

## 🔍 Google Search & SEO Infrastructure

1. **Comprehensive Schema.org Structured Data (JSON-LD):**
   - `ApartmentComplex` & `RealEstateListing`: Detailed geocodes (`18.66376, 73.7137836`), verified Google Maps place entity, price range, postal address, amenities, and MahaRERA `PR1261012502725`.
   - `RealEstateAgent` & `Organization`: Goyal Properties brand entity for Google Knowledge Graph.
   - `FAQPage` Schema: 5 rich-result Q&As targeting high-intent buyer searches (MahaRERA, configurations, starting prices, Hinjawadi connectivity, MIVAN engineering).
   - `BreadcrumbList`: Navigation hierarchy (`Home > Pune Real Estate > Mamurdi > Goyal My Home Sanctuary`).
2. **XML Sitemap (`sitemap.xml`):**
   - Google Image Sitemap extensions indexing high-resolution architectural visuals.
3. **Robots Directives (`robots.txt`):**
   - Specialized rules for `Googlebot`, `Googlebot-Image`, `Bingbot`, and general crawlers.
4. **Social & Sharing Optimization:**
   - Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:locale`).
   - Twitter Cards (`summary_large_image`).
   - Canonical tag enforcement.

---

## 📱 Google Ecosystem & Core Web Vitals

1. **Progressive Web App (`manifest.webmanifest`):**
   - Installable on Android and Google Chrome with theme color `#06070a`, maskable SVG icons, and quick app shortcuts (View Residences, Schedule Visit, EMI Calculator).
2. **Core Web Vitals Preloading:**
   - `dns-prefetch` and `preconnect` for Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) and image CDNs.
   - `fetchpriority="high"` on hero images to minimize Largest Contentful Paint (LCP).
3. **Google Analytics 4 (GA4) / GTM Telemetry:**
   - Pre-configured `gtag` dataLayer with custom conversion event dispatches:
     - `generate_lead`
     - `download_brochure`
     - `open_visit_modal`
     - `whatsapp_dispatch`

---

## 📁 Repository Structure

```
goyalmyhomesanctuary/
├── _headers                 # Cloudflare Pages edge security & cache headers
├── _redirects               # Cloudflare Pages canonical 301 redirects
├── functions/
│   └── api/
│       └── lead.js          # Cloudflare Pages serverless edge lead handler
├── sitemap.xml              # Google XML sitemap with image extensions
├── robots.txt               # Googlebot crawl rules
├── manifest.webmanifest     # Google PWA web app manifest
├── favicon.svg              # Luxury gold monogram SVG icon
├── index.html               # Haute architectural single-page application
├── css/
│   └── style.css            # "The Obsidian Sanctuary" custom design system
├── js/
│   ├── floorplans.js        # CAD blueprints & Sq.Ft/Sq.M metric switcher
│   ├── calculator.js        # Fintech EMI terminal & rental yield calculator
│   ├── amenities.js         # 75+ amenity Bento grid & modal viewer
│   ├── scheduler.js         # VIP site visit, free cab, GA4 events, confetti
│   └── main.js              # Day/Sunset/Night lighting, HUD nav, master plan
└── README.md                # Technical documentation
```

---

## 🚀 Running Locally

```bash
python3 -m http.server 3000
# or
npx serve -l 3000
```
Open `http://localhost:3000` in any modern web browser.
