/**
 * scripts/cascade-og-and-standards.js
 * 1. Adds og:image:width, og:image:height, og:image:type, and secure_url across all HTML files.
 * 2. Standardizes font preconnects across all HTML files.
 * 3. Adds android-chrome-192x192.png and android-chrome-512x512.png icon links to all HTML files.
 * 4. Adds RealEstateAgent / LocalBusiness entity to index.html JSON-LD.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PWA_ICON_TAGS = `  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />`;

const FONT_PRECONNECT_TAGS = `  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`;

const REAL_ESTATE_AGENT_SCHEMA = {
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": "https://goyalmyhomesanctuary.in/#developer",
  "name": "Goyal My Home Sanctuary Experience Centre & Sales Office",
  "alternateName": [
    "Goyal Properties Sanctuary Mamurdi Sales Office",
    "Goyal My Home Sanctuary Site Office"
  ],
  "image": "https://goyalmyhomesanctuary.in/assets/images/scraped/elevation-main.jpg",
  "telephone": "+919175319441",
  "email": "propsmartrealty@gmail.com",
  "url": "https://goyalmyhomesanctuary.in",
  "priceRange": "₹69.00 Lakhs - ₹1.05 Cr",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, Cheque, Demand Draft, Wire Transfer, Home Loan Net Banking",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Survey No. 8(P), Near Mukai Chowk, Kiwale-Mamurdi Road, Mamurdi",
    "addressLocality": "PCMC, Pune West",
    "addressRegion": "Maharashtra",
    "postalCode": "412101",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 18.66376,
    "longitude": 73.7137836
  },
  "hasMap": "https://www.google.com/maps/place/My+Home+Sanctuary/@18.66376,73.7112087,879m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bc2b1002632e9cb:0x85357e0bc6be7a2!8m2!3d18.66376!4d73.7137836!16s%2Fg%2F11yfq11z0t",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "19:30"
    }
  ],
  "sameAs": [
    "https://www.google.com/maps/place/My+Home+Sanctuary/@18.66376,73.7112087,879m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bc2b1002632e9cb:0x85357e0bc6be7a2!8m2!3d18.66376!4d73.7137836!16s%2Fg%2F11yfq11z0t",
    "https://maharera.mahaonline.gov.in"
  ]
};

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'scratch' || file === 'assets') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = findHtmlFiles(ROOT_DIR);
console.log(`Processing ${htmlFiles.length} HTML files for OpenGraph, Preconnect, PWA Icons, and LocalBusiness Schema...`);

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const relPath = path.relative(ROOT_DIR, filePath);

  // 1. Add OpenGraph Dimensions & MIME Types if missing
  if (!content.includes('property="og:image:width"')) {
    const ogImageMatch = content.match(/<meta property=["']og:image["'][^>]*>/i);
    if (ogImageMatch) {
      const ogExtra = `${ogImageMatch[0]}\n  <meta property="og:image:secure_url" content="https://goyalmyhomesanctuary.in/assets/images/scraped/elevation-main.jpg" />\n  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="675" />\n  <meta property="og:image:type" content="image/jpeg" />`;
      content = content.replace(ogImageMatch[0], ogExtra);
      modified = true;
    }
  }

  // 2. Add Android Chrome PWA Icon links if missing
  if (!content.includes('android-chrome-192x192.png')) {
    const appleTouchMatch = content.match(/<link[^>]*apple-touch-icon[^>]*>/i);
    if (appleTouchMatch) {
      content = content.replace(appleTouchMatch[0], `${appleTouchMatch[0]}\n${PWA_ICON_TAGS}`);
      modified = true;
    }
  }

  // 3. Add Preconnect to Google Fonts if missing
  if (!content.includes('rel="preconnect" href="https://fonts.gstatic.com"')) {
    const fontsMatch = content.match(/<link[^>]*fonts\.googleapis\.com[^>]*>/i);
    if (fontsMatch && !content.includes('rel="preconnect" href="https://fonts.googleapis.com"')) {
      content = content.replace(fontsMatch[0], `${FONT_PRECONNECT_TAGS}\n  ${fontsMatch[0]}`);
      modified = true;
    }
  }

  // 4. Add RealEstateAgent / LocalBusiness Schema into index.html
  if (relPath === 'index.html' && !content.includes('"https://goyalmyhomesanctuary.in/#developer"')) {
    // Inject into @graph array
    const graphMarker = '"@graph": [';
    if (content.includes(graphMarker)) {
      const agentJson = JSON.stringify(REAL_ESTATE_AGENT_SCHEMA, null, 4);
      content = content.replace(graphMarker, `${graphMarker}\n    ${agentJson},`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Upgraded ${relPath}`);
  }
}

console.log('\nFinished cascading OpenGraph, PWA Icons, Preconnect, and Schema standards!');
