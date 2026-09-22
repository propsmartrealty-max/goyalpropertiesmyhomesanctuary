/**
 * scripts/upgrade-subpages-and-entities.js
 * Comprehensive upgrade script for:
 * 1. Subpage Hardening: OpenSearch 1.1, Geo coordinates, Speculation Rules, Service Worker, and <noscript> fallbacks.
 * 2. Knowledge Graph Entity Disambiguation: Injects Wikidata and Wikipedia entity references (about and mentions) into JSON-LD.
 * 3. SpeakableSpecification Schema for Voice Search.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Entity definitions for Knowledge Graph Disambiguation
const ENTITY_ABOUT = [
  {
    "@type": "Place",
    "name": "Mamurdi, Pune West",
    "sameAs": "https://en.wikipedia.org/wiki/Pimpri-Chinchwad"
  },
  {
    "@type": "City",
    "name": "Pimpri-Chinchwad",
    "sameAs": [
      "https://en.wikipedia.org/wiki/Pimpri-Chinchwad",
      "https://www.wikidata.org/wiki/Q11854492"
    ]
  },
  {
    "@type": "City",
    "name": "Pune",
    "sameAs": [
      "https://en.wikipedia.org/wiki/Pune",
      "https://www.wikidata.org/wiki/Q892"
    ]
  }
];

const ENTITY_MENTIONS = [
  {
    "@type": "Thing",
    "name": "Mumbai–Pune Expressway",
    "sameAs": [
      "https://en.wikipedia.org/wiki/Mumbai%E2%80%93Pune_Expressway",
      "https://www.wikidata.org/wiki/Q3525167"
    ]
  },
  {
    "@type": "Thing",
    "name": "Hinjawadi IT Park Rajiv Gandhi Infotech Park",
    "sameAs": [
      "https://en.wikipedia.org/wiki/Hinjawadi",
      "https://www.wikidata.org/wiki/Q5767221"
    ]
  },
  {
    "@type": "GovernmentOrganization",
    "name": "Maharashtra Real Estate Regulatory Authority (MahaRERA)",
    "sameAs": "https://maharera.mahaonline.gov.in"
  }
];

// OpenSearch tag
const OPENSEARCH_TAG = '  <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Search Goyal My Home Sanctuary" />';

// Geo Meta Tags
const GEO_META_TAGS = `  <!-- Hyper-Local Geotagging (PCMC / Pune West / Mamurdi) -->
  <meta name="geo.position" content="18.66376;73.7137836" />
  <meta name="geo.placename" content="Mamurdi, PCMC, Pune West, Maharashtra" />
  <meta name="geo.region" content="IN-MH" />
  <meta name="ICBM" content="18.66376, 73.7137836" />`;

// Speculation Rules
const SPECULATION_RULES = `  <!-- Next-Gen Speculation Rules API for Instantaneous 0ms Page Transitions (Chromium / Google Chrome) -->
  <script type="speculationrules">
  {
    "prerender": [
      {
        "source": "list",
        "urls": [
          "/",
          "/price-cost-sheet",
          "/2-bhk-flats-mamurdi",
          "/3-bhk-flats-mamurdi",
          "/floor-plans-brochure",
          "/mumbai-pune-expressway-connectivity",
          "/hinjawadi-it-park-commute",
          "/maharera-pr1261012502725-approvals",
          "/mamurdi-vs-ravet-kiwale-comparison",
          "/pcmc-real-estate-market-guide",
          "/kiwale-real-estate-properties",
          "/blog"
        ]
      }
    ]
  }
  </script>`;

// Service Worker Registration
const SW_REGISTRATION = `  <!-- PWA Progressive Resiliency & Instant Caching -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  </script>`;

// Crawlable <noscript> Fallback
const NOSCRIPT_FALLBACK = `  <!-- Crawlable Noscript Fallback for Standard Search Bots -->
  <noscript>
    <div style="padding: 12px 16px; background-color: #14110e; color: #f5f1e8; text-align: center; font-size: 13px; font-family: sans-serif; line-height: 1.5; border-bottom: 2px solid #b88628;">
      Explore Goyal My Home Sanctuary: 
      <a href="/" style="color: #eccf94; text-decoration: underline; margin: 0 6px;">Township Home</a> |
      <a href="/price-cost-sheet" style="color: #eccf94; text-decoration: underline; margin: 0 6px;">Price Cost Sheet</a> |
      <a href="/floor-plans-brochure" style="color: #eccf94; text-decoration: underline; margin: 0 6px;">Floor Plans &amp; Brochure</a> |
      <a href="/2-bhk-flats-mamurdi" style="color: #eccf94; text-decoration: underline; margin: 0 6px;">2 BHK Residences</a> |
      <a href="/3-bhk-flats-mamurdi" style="color: #eccf94; text-decoration: underline; margin: 0 6px;">3 BHK Residences</a> |
      <a href="/maharera-pr1261012502725-approvals" style="color: #eccf94; text-decoration: underline; margin: 0 6px;">MahaRERA Approvals</a> |
      <a href="tel:+919175319441" style="color: #eccf94; font-weight: bold; margin: 0 6px;">Direct Inquiry: +91 91753 19441</a>
    </div>
  </noscript>`;

// Find all HTML files
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
console.log(`Discovered ${htmlFiles.length} HTML files to inspect and upgrade.`);

let upgradedCount = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const relPath = path.relative(ROOT_DIR, filePath);

  // 1. Inject OpenSearch if missing
  if (!content.includes('opensearch.xml')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${OPENSEARCH_TAG}\n</head>`);
      modified = true;
    }
  }

  // 2. Inject Geo Meta Tags if missing
  if (!content.includes('name="geo.position"')) {
    if (content.includes('<meta name="robots"')) {
      content = content.replace('<meta name="robots"', `${GEO_META_TAGS}\n  <meta name="robots"`);
      modified = true;
    } else if (content.includes('</head>')) {
      content = content.replace('</head>', `${GEO_META_TAGS}\n</head>`);
      modified = true;
    }
  }

  // 3. Inject Speculation Rules if missing
  if (!content.includes('type="speculationrules"')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${SPECULATION_RULES}\n</head>`);
      modified = true;
    }
  }

  // 4. Inject Service Worker Registration if missing
  if (!content.includes("navigator.serviceWorker.register('/sw.js')")) {
    if (content.includes('</body>')) {
      content = content.replace('</body>', `${SW_REGISTRATION}\n</body>`);
      modified = true;
    }
  }

  // 5. Inject <noscript> Fallback if missing
  if (!content.includes('<!-- Crawlable Noscript Fallback') && !content.includes('Explore Goyal My Home Sanctuary:')) {
    const bodyMatch = content.match(/<body[^>]*>/i);
    if (bodyMatch) {
      content = content.replace(bodyMatch[0], `${bodyMatch[0]}\n${NOSCRIPT_FALLBACK}`);
      modified = true;
    }
  }

  // 6. Enrich JSON-LD Schema with Entity Disambiguation (about, mentions, speakable)
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let newContent = content;

  while ((match = jsonLdRegex.exec(content)) !== null) {
    const originalJson = match[1];
    try {
      let schemaObj = JSON.parse(originalJson);
      let schemaModified = false;

      const items = Array.isArray(schemaObj)
        ? schemaObj
        : schemaObj['@graph']
        ? schemaObj['@graph']
        : [schemaObj];

      for (const item of items) {
        const targetTypes = ['RealEstateListing', 'ApartmentComplex', 'Residence', 'Product', 'Article', 'WebPage', 'Place'];
        if (targetTypes.includes(item['@type'])) {
          if (!item.about) {
            item.about = ENTITY_ABOUT;
            schemaModified = true;
          }
          if (!item.mentions) {
            item.mentions = ENTITY_MENTIONS;
            schemaModified = true;
          }
          if ((item['@type'] === 'WebPage' || item['@type'] === 'Article') && !item.speakable) {
            item.speakable = {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", "header p", "main p", ".ai-key-facts"]
            };
            schemaModified = true;
          }
        }
      }

      if (schemaModified) {
        const updatedJson = JSON.stringify(schemaObj, null, 2);
        newContent = newContent.replace(originalJson, `\n${updatedJson}\n  `);
        modified = true;
      }
    } catch (e) {
      // Ignore parse errors on complex multi-script templates
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    upgradedCount++;
    console.log(`✓ Upgraded: ${relPath}`);
  }
}

console.log(`\nCompleted! Successfully upgraded ${upgradedCount} HTML files with full hardening & entity disambiguation.`);
