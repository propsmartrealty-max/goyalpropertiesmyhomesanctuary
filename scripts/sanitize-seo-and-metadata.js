/**
 * scripts/sanitize-seo-and-metadata.js
 * Sanitizes all HTML files across root, pages/, and blog/:
 * 1. Title tags sanitized to Google-compliant lengths (< 60 chars) focused on brand + location.
 * 2. Meta descriptions optimized to 145-155 chars with high CTR, primary keywords & RERA.
 * 3. Meta keywords sanitized to 3-4 natural brand terms (< 80 chars), cleanly tagged.
 * 4. OpenGraph & Twitter Card tags synchronized.
 * 5. Removes news_keywords meta tags and cleans duplicate/stray HTML bracket artifacts.
 * 6. Sanitizes index.html FAQ and body text (removes Hinglish conversational queries and programmatic SEO jargon).
 * 7. Synchronizes root files with pages/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Authoritative mapping for core page metadata
const pageMetaMap = {
  'index.html': {
    title: 'Goyal My Home Sanctuary Mamurdi | 2 &amp; 3 BHK Luxury Flats',
    ogTitle: 'Goyal My Home Sanctuary Mamurdi | 2 &amp; 3 BHK Luxury Flats',
    description: 'Goyal My Home Sanctuary in Mamurdi, Pune West offers luxury 2 & 3 BHK flats from ₹69 L*. 26-acre biophilic township with 75+ amenities. MahaRERA: PR1261012502725.',
    keywords: 'Goyal My Home Sanctuary, 2 & 3 BHK flats Mamurdi, Goyal Properties Pune'
  },
  '2-bhk-flats-mamurdi.html': {
    title: '2 BHK Flats in Mamurdi | Goyal My Home Sanctuary',
    ogTitle: '2 BHK Flats in Mamurdi | Goyal My Home Sanctuary',
    description: 'Buy luxury 2 BHK flats in Mamurdi at Goyal My Home Sanctuary. 638-760 sq.ft MIVAN homes from ₹69 L* near Expressway & Hinjawadi. MahaRERA: PR1261012502725.',
    keywords: '2 BHK flats Mamurdi, Goyal My Home Sanctuary, luxury 2 BHK Pune, Mamurdi flats'
  },
  '3-bhk-flats-mamurdi.html': {
    title: '3 BHK Flats in Mamurdi | Goyal My Home Sanctuary',
    ogTitle: '3 BHK Flats in Mamurdi | Goyal My Home Sanctuary',
    description: 'Explore luxury 3 BHK flats in Mamurdi at Goyal My Home Sanctuary. 848-1,036 sq.ft sky suites from ₹86 L* near Mukai Chowk. MahaRERA: PR1261012502725.',
    keywords: '3 BHK flats Mamurdi, Goyal My Home Sanctuary, luxury 3 BHK Pune'
  },
  'floor-plans-brochure.html': {
    title: 'Floor Plans &amp; Brochure | Goyal My Home Sanctuary Mamurdi',
    ogTitle: 'Floor Plans &amp; Brochure | Goyal My Home Sanctuary Mamurdi',
    description: 'Download official floor plans & brochure PDF for Goyal My Home Sanctuary Mamurdi. 2 & 3 BHK CAD layouts (638-1,036 sq.ft). MahaRERA: PR1261012502725.',
    keywords: 'Goyal My Home Sanctuary floor plans, brochure PDF, 2 BHK layout, 3 BHK layout'
  },
  'hinjawadi-it-park-commute.html': {
    title: 'Hinjawadi IT Park Commute | Goyal My Home Sanctuary',
    ogTitle: 'Hinjawadi IT Park Commute | Goyal My Home Sanctuary',
    description: 'Live 15 mins from Hinjawadi IT Park Phase 1 at Goyal My Home Sanctuary Mamurdi. Premium 2 & 3 BHK flats with easy daily highway & metro commute.',
    keywords: 'Hinjawadi commute, Goyal My Home Sanctuary, flats near Hinjawadi, Mamurdi Pune'
  },
  'kiwale-real-estate-properties.html': {
    title: 'Kiwale Real Estate &amp; Flats | Goyal My Home Sanctuary',
    ogTitle: 'Kiwale Real Estate &amp; Flats | Goyal My Home Sanctuary',
    description: 'Explore Kiwale & Mamurdi real estate near Mukai Chowk. Luxury 2 & 3 BHK flats at Goyal My Home Sanctuary starting ₹69 L*. MahaRERA: PR1261012502725.',
    keywords: 'Kiwale real estate, flats near Mukai Chowk, Goyal My Home Sanctuary, Kiwale Pune'
  },
  'maharera-pr1261012502725-approvals.html': {
    title: 'MahaRERA Approvals | Goyal My Home Sanctuary Mamurdi',
    ogTitle: 'MahaRERA Approvals | Goyal My Home Sanctuary Mamurdi',
    description: 'Verify MahaRERA PR1261012502725 approvals for Goyal My Home Sanctuary Mamurdi. Review legal title, building sanctions & possession date (Dec 2028).',
    keywords: 'MahaRERA PR1261012502725, Goyal My Home Sanctuary RERA, Mamurdi RERA approvals'
  },
  'mamurdi-real-estate-flats.html': {
    title: 'Mamurdi Real Estate &amp; Flats | Goyal My Home Sanctuary',
    ogTitle: 'Mamurdi Real Estate &amp; Flats | Goyal My Home Sanctuary',
    description: 'Mamurdi real estate guide & luxury flats for sale in Pune West. Discover 2 & 3 BHK township homes at Goyal My Home Sanctuary starting ₹69 Lakhs*.',
    keywords: 'Mamurdi real estate, flats in Mamurdi, Goyal My Home Sanctuary, Pune properties'
  },
  'mamurdi-vs-ravet-kiwale-comparison.html': {
    title: 'Mamurdi vs Ravet vs Kiwale | Goyal My Home Sanctuary',
    ogTitle: 'Mamurdi vs Ravet vs Kiwale | Goyal My Home Sanctuary',
    description: 'Compare real estate in Mamurdi vs Ravet vs Kiwale. Discover why Goyal My Home Sanctuary offers the best pricing and ROI in West Pune for homebuyers.',
    keywords: 'Mamurdi vs Ravet vs Kiwale, Goyal My Home Sanctuary, Pune property comparison'
  },
  'mumbai-pune-expressway-connectivity.html': {
    title: 'Expressway Connectivity | Goyal My Home Sanctuary Mamurdi',
    ogTitle: 'Expressway Connectivity | Goyal My Home Sanctuary Mamurdi',
    description: 'Prime Expressway Touch living at Goyal My Home Sanctuary Mamurdi. 2 mins to Mumbai-Pune Expressway exit & 15 mins to Hinjawadi IT Park, Pune West.',
    keywords: 'Mumbai Pune Expressway flats, Goyal My Home Sanctuary, Mukai Chowk connectivity'
  },
  'pcmc-real-estate-market-guide.html': {
    title: 'PCMC Real Estate Market Guide | Goyal My Home Sanctuary',
    ogTitle: 'PCMC Real Estate Market Guide | Goyal My Home Sanctuary',
    description: 'Comprehensive PCMC real estate guide 2026: Property rates, infrastructure & growth corridors. Explore top township investments in Mamurdi, Pune West.',
    keywords: 'PCMC real estate guide, property in PCMC Pune, Goyal My Home Sanctuary Mamurdi'
  },
  'price-cost-sheet.html': {
    title: 'Price List &amp; Cost Sheet | Goyal My Home Sanctuary',
    ogTitle: 'Price List &amp; Cost Sheet | Goyal My Home Sanctuary',
    description: 'Official price list & cost sheet for Goyal My Home Sanctuary Mamurdi. 2 BHK from ₹69 L*, 3 BHK from ₹86 L*, CLP payment plan. MahaRERA: PR1261012502725.',
    keywords: 'Goyal My Home Sanctuary price list, 2 BHK cost sheet, 3 BHK pricing Mamurdi'
  },
  'blog.html': {
    title: 'Sanctuary Journal | Goyal My Home Sanctuary Insights',
    ogTitle: 'Sanctuary Journal | Goyal My Home Sanctuary Insights',
    description: 'The Sanctuary Journal: Expert Pune real estate market insights, Mamurdi investment trends & engineering analysis by Goyal My Home Sanctuary.',
    keywords: 'Goyal My Home Sanctuary blog, Mamurdi real estate news, Pune property insights'
  },
  'blog/index.html': {
    title: 'Sanctuary Journal | Goyal My Home Sanctuary Insights',
    ogTitle: 'Sanctuary Journal | Goyal My Home Sanctuary Insights',
    description: 'The Sanctuary Journal: Expert Pune real estate market insights, Mamurdi investment trends & engineering analysis by Goyal My Home Sanctuary.',
    keywords: 'Goyal My Home Sanctuary blog, Mamurdi real estate news, Pune property insights'
  },
  'blog/2bhk-3bhk-4bhk-duplex-flats-mamurdi-pune.html': {
    title: '2, 3 &amp; 4 BHK Duplex Flats in Mamurdi | Floor Plan Guide',
    ogTitle: '2, 3 &amp; 4 BHK Duplex Flats in Mamurdi | Floor Plan Guide',
    description: 'Compare 2 BHK, 3 BHK & 4 BHK duplex layouts in Mamurdi Pune. Carpet area breakdown, floor plans & interior space optimization guide for homebuyers.',
    keywords: '2 BHK 3 BHK duplex Mamurdi, Goyal My Home Sanctuary, carpet area Pune'
  },
  'blog/goyal-my-home-sanctuary-complete-buyers-guide.html': {
    title: 'Homebuyer &amp; Investor Guide | Goyal My Home Sanctuary',
    ogTitle: 'Homebuyer &amp; Investor Guide | Goyal My Home Sanctuary',
    description: "Complete buyer's guide to Goyal My Home Sanctuary Mamurdi: 26-acre biophilic master layout, 2 & 3 BHK floor plans, amenities, pricing & MahaRERA.",
    keywords: 'Goyal My Home Sanctuary guide, Mamurdi homebuyer guide, Pune investment'
  },
  'blog/mamurdi-the-next-growth-corridor-pune-west.html': {
    title: 'Mamurdi Growth Corridor | Goyal My Home Sanctuary',
    ogTitle: 'Mamurdi Growth Corridor | Goyal My Home Sanctuary',
    description: 'Why Mamurdi is West Pune premier real estate growth corridor with 25-30% price advantage over Wakad and Baner. Investment analysis & forecasts.',
    keywords: 'Mamurdi growth corridor, West Pune real estate, Goyal My Home Sanctuary'
  },
  'blog/mivan-monolithic-construction-vs-conventional-brickwork.html': {
    title: 'MIVAN vs Brickwork Guide | Goyal My Home Sanctuary',
    ogTitle: 'MIVAN vs Brickwork Guide | Goyal My Home Sanctuary',
    description: 'Engineering comparison: MIVAN monolithic construction vs conventional brickwork. Discover structural advantages at Goyal My Home Sanctuary Mamurdi.',
    keywords: 'MIVAN construction, Goyal My Home Sanctuary engineering, MIVAN vs brickwork'
  },
  'blog/mumbai-pune-expressway-hinjawadi-connectivity-analysis.html': {
    title: 'Expressway &amp; Hinjawadi Commute | Goyal My Home Sanctuary',
    ogTitle: 'Expressway &amp; Hinjawadi Commute | Goyal My Home Sanctuary',
    description: 'Commute telemetry & transit analysis from Goyal My Home Sanctuary Mamurdi: 2 mins to Expressway and 15 mins to Hinjawadi IT Park Phase 1 & 2.',
    keywords: 'Expressway commute, Hinjawadi transit, Goyal My Home Sanctuary Mamurdi'
  },
  'blog/pune-real-estate-market-forecast-2026.html': {
    title: 'Pune Real Estate Forecast 2026 | Goyal My Home Sanctuary',
    ogTitle: 'Pune Real Estate Forecast 2026 | Goyal My Home Sanctuary',
    description: 'Pune real estate market outlook 2026: Why Mamurdi and PCMC lead capital appreciation and rental yield growth in West Pune. Full investor analysis.',
    keywords: 'Pune real estate forecast 2026, PCMC property outlook, Goyal My Home Sanctuary'
  },
  'market/index.html': {
    title: 'Pune Real Estate Market Hub | Goyal My Home Sanctuary',
    ogTitle: 'Pune Real Estate Market Hub | Goyal My Home Sanctuary',
    description: 'Pune real estate market intelligence hub & pricing trends. Track Mamurdi property index, rental yields and analytics for Goyal My Home Sanctuary.',
    keywords: 'Pune real estate market, Mamurdi property trends, Goyal My Home Sanctuary'
  }
};

function sanitizeFile(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  let baseKey = relPath.startsWith('pages/') ? relPath.replace('pages/', '') : relPath;
  const config = pageMetaMap[relPath] || pageMetaMap[baseKey];

  if (config) {
    // 1. Sanitize <title>
    content = content.replace(/<title>([^<]*)<\/title>/i, `<title>${config.title}</title>`);

    // 2. Sanitize og:title
    if (content.includes('property="og:title"')) {
      content = content.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']/i,
        `<meta property="og:title" content="${config.ogTitle.replace(/&amp;/g, '&')}"`);
    }

    // 3. Sanitize twitter:title
    if (content.includes('name="twitter:title"')) {
      content = content.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']/i,
        `<meta name="twitter:title" content="${config.ogTitle.replace(/&amp;/g, '&')}"`);
    }

    // 4. Sanitize meta description
    if (content.includes('name="description"')) {
      content = content.replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["'][^>]*>/i,
        `<meta name="description" content="${config.description.replace(/"/g, '&quot;')}" />`);
    }

    // 5. Sanitize og:description
    if (content.includes('property="og:description"')) {
      content = content.replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']/i,
        `<meta property="og:description" content="${config.description.replace(/"/g, '&quot;')}"`);
    }

    // 6. Sanitize twitter:description
    if (content.includes('name="twitter:description"')) {
      content = content.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']/i,
        `<meta name="twitter:description" content="${config.description.replace(/"/g, '&quot;')}"`);
    }

    // 7. Sanitize meta keywords (clean closing tag, fixing any >> /> artifacts)
    if (content.includes('name="keywords"')) {
      content = content.replace(/<meta\s+name=["']keywords["'][^>]*>/i,
        `<meta name="keywords" content="${config.keywords}" />`);
    }
  }

  // Clean any remaining >> /> artifacts
  content = content.replace(/>>\s*\/>/g, '/>');

  // Remove news_keywords if present
  content = content.replace(/<meta\s+name=["']news_keywords["'][^>]*>\s*/gi, '');

  // Specific sanitization for index.html
  if (relPath === 'index.html' || relPath === 'pages/index.html') {
    // Hinglish question in FAQ schema
    content = content.replace(
      /"name": "My Home Sanctuary Mamurdi me flat ka starting price aur booking kaise kare\?",\s*"acceptedAnswer":\s*\{\s*"@type":\s*"Answer",\s*"text":\s*"Goyal My Home Sanctuary me 2 BHK flats ka starting price [^"]+"/g,
      `"name": "What is the starting price and booking process for flats at Goyal My Home Sanctuary Mamurdi?",\n          "acceptedAnswer": {\n            "@type": "Answer",\n            "text": "At Goyal My Home Sanctuary, 2 BHK luxury flats start from ₹69.00 Lakh* and 3 BHK sky deck residences start from ₹86.00 Lakh*. Booking starts with a standard 10% down payment with home loan approvals from SBI, HDFC, and ICICI. To schedule a guided site visit, contact the official sales gallery at +91 91753 19441."`
    );

    // Hinglish voice search section in body HTML
    content = content.replace(
      /Google Assistant &amp; Voice Search Directory/g,
      'Buyer Quick Reference • At A Glance'
    );
    content = content.replace(
      /Frequently Asked Queries in Hindi \/ Hinglish \(अक्सर पूछे जाने वाले सवाल\)/g,
      'Frequently Asked Questions (Mamurdi Real Estate)'
    );
    content = content.replace(
      /Voice search friendly answers for homebuyers searching Goyal My Home Sanctuary in Pune:/g,
      'Essential questions answered for prospective homebuyers exploring Goyal My Home Sanctuary:'
    );

    content = content.replace(
      /<span class="font-bold text-espresso-950 block">Q: Mamurdi me 2 BHK aur 3 BHK flat ka price kya hai\?<\/span>\s*<p class="text-xs text-espresso-700 leading-relaxed">\s*Goyal My Home Sanctuary me <strong>2 BHK flat ₹69\.00 Lakh\*<\/strong> se aur <strong>3 BHK flat ₹86\.00 Lakh\*<\/strong> se start hota hai\. RERA carpet area 638 sq\.ft se 1,036 sq\.ft tak uplabdh hai\.\s*<\/p>/g,
      `<span class="font-bold text-espresso-950 block">Q: What is the price range for 2 BHK and 3 BHK flats at Goyal My Home Sanctuary?</span>\n              <p class="text-xs text-espresso-700 leading-relaxed">\n                At Goyal My Home Sanctuary, <strong>2 BHK flats start from ₹69.00 Lakh*</strong> and <strong>3 BHK flats start from ₹86.00 Lakh*</strong>. RERA carpet areas range from 638 sq.ft to 1,036 sq.ft across biophilic forest-themed layouts.\n              </p>`
    );

    content = content.replace(
      /<span class="font-bold text-espresso-950 block">Q: My Home Sanctuary ka location aur address kaha par hai\?<\/span>\s*<p class="text-xs text-espresso-700 leading-relaxed">\s*Ye project <strong>Mukai Chowk ke paas, Kiwale-Mamurdi Road, Pune West \(412101\)<\/strong> me sthit hai\. Mumbai-Pune Expressway exit se sirf 2 minute aur Hinjawadi IT Park se 15 minute ki doori par hai\.\s*<\/p>/g,
      `<span class="font-bold text-espresso-950 block">Q: What is the exact location and connectivity of Goyal My Home Sanctuary?</span>\n              <p class="text-xs text-espresso-700 leading-relaxed">\n                The project is located near <strong>Mukai Chowk, Kiwale-Mamurdi Road, Pune West (412101)</strong>. It is positioned just 2 minutes from the Mumbai-Pune Expressway exit and approximately 15 minutes from Hinjawadi IT Park Phase 1.\n              </p>`
    );

    content = content.replace(
      /<span class="font-bold text-espresso-950 block">Q: Kya ye project MahaRERA approved hai aur possession kab milega\?<\/span>\s*<p class="text-xs text-espresso-700 leading-relaxed">\s*Ji haan, project officially MahaRERA approved hai with Registration Number <strong>PR1261012502725<\/strong>\. Phase 1 possession scheduled <strong>December 2028<\/strong> hai\.\s*<\/p>/g,
      `<span class="font-bold text-espresso-950 block">Q: Is the project MahaRERA registered and when is the possession date?</span>\n              <p class="text-xs text-espresso-700 leading-relaxed">\n                Yes, the development is fully approved under MahaRERA registration number <strong>PR1261012502725</strong> (Project: P52100077438). The planned Phase 1 completion and possession date is scheduled for <strong>December 2028</strong>.\n              </p>`
    );

    content = content.replace(
      /<span class="font-bold text-espresso-950 block">Q: Sample flat visit aur brochure kaise download karein\?<\/span>\s*<p class="text-xs text-espresso-700 leading-relaxed">\s*Aap website se official 36-page PDF brochure download kar sakte hain ya direct sales gallery me <a href="tel:\+919175319441" class="text-bronze-600 font-bold hover:underline">\+91 91753 19441<\/a> par call karke complimentary AC cab pickup ke sath site visit book kar sakte hain\.\s*<\/p>/g,
      `<span class="font-bold text-espresso-950 block">Q: How can I schedule a sample flat visit and download the brochure?</span>\n              <p class="text-xs text-espresso-700 leading-relaxed">\n                Homebuyers can download the official 36-page architectural brochure PDF directly from this website or contact the sales experience gallery at <a href="tel:+919175319441" class="text-bronze-600 font-bold hover:underline">+91 91753 19441</a> to reserve a private sample flat tour with complimentary AC cab pickup.\n              </p>`
    );

    // Q18 Hinglish in FAQ section
    content = content.replace(
      /<span>My Home Sanctuary Mamurdi me flat ka starting price, EMI aur booking amount kya hai\?<\/span>\s*<\/h3>\s*<p class="text-xs sm:text-sm text-espresso-700 leading-relaxed pl-8">\s*Goyal My Home Sanctuary me <strong>2 BHK flats starting ₹69\.00 Lakh\*<\/strong> se aur <strong>3 BHK flats starting ₹86\.00 Lakh\*<\/strong> se available hain\. Booking amount 10% down payment se shuru hota hai aur estimated monthly EMI ₹43,500\* se shuru hoti hai\. SBI, HDFC, ICICI aur Axis Bank se approved home loan assistance uplabdh hai\. Site visit aur brochure ke liye <a href="https:\/\/wa\.me\/919175319441" target="_blank" rel="noopener noreferrer" class="text-bronze-600 font-bold hover:underline">\+91 91753 19441<\/a> par sampark karein\.\s*<\/p>/g,
      `<span>What is the starting price, EMI estimate, and booking process for flats at Goyal My Home Sanctuary?</span>\n            </h3>\n            <p class="text-xs sm:text-sm text-espresso-700 leading-relaxed pl-8">\n              At Goyal My Home Sanctuary, <strong>2 BHK residences start from ₹69.00 Lakh*</strong> and <strong>3 BHK sky suites start from ₹86.00 Lakh*</strong>. Booking starts with a standard 10% payment, with estimated monthly EMIs starting at ₹43,500*. Project approvals and preferred mortgage rates are established with SBI, HDFC, ICICI, and Axis Bank. For payment schedules and on-site visits, connect via <a href="https://wa.me/919175319441" target="_blank" rel="noopener noreferrer" class="text-bronze-600 font-bold hover:underline">+91 91753 19441</a>.\n            </p>`
    );

    // Silo wording cleanup
    content = content.replace(
      /Programmatic Silo Architecture • High-Authority Hub/g,
      'Project Knowledge Base • Comprehensive Guides'
    );
    content = content.replace(
      /Dedicated Topical Intelligence &amp; Deep Landing Pages/g,
      'Dedicated Architectural, Commute &amp; Pricing Guides'
    );
    content = content.replace(
      /11 Verified Content Silos/g,
      '11 In-Depth Project Guides'
    );
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Sanitized ${relPath}`);
}

// 1. Sanitize root files
Object.keys(pageMetaMap).forEach(key => {
  sanitizeFile(key);
  // Also check pages/ equivalent if not already in blog/ or market/
  if (!key.startsWith('blog/') && !key.startsWith('market/')) {
    const pageKey = `pages/${key}`;
    if (fs.existsSync(path.join(ROOT_DIR, pageKey))) {
      sanitizeFile(pageKey);
    }
  }
});

console.log('\nAll SEO metadata, descriptions, and content elements successfully sanitized.');
