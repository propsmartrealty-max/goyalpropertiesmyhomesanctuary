import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderDirectoryHub } from '../functions/market/[[slug]].js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Master Permutation Dimensions (10 x 8 x 8 x 8 = 5,120 permutations)
export const MICRO_MARKETS = [
  { id: 'mamurdi', name: 'Mamurdi', subtitle: 'Prime Expressway Node & Educational Hub', distanceHinjawadi: '15 Mins', distanceExpressway: '0 Mins' },
  { id: 'kiwale', name: 'Kiwale', subtitle: 'Adjoining Twin Growth Corridor & BRTS Junction', distanceHinjawadi: '18 Mins', distanceExpressway: '2 Mins' },
  { id: 'ravet', name: 'Ravet', subtitle: 'PCMC Gateway & Educational Capital', distanceHinjawadi: '16 Mins', distanceExpressway: '3 Mins' },
  { id: 'punawale', name: 'Punawale', subtitle: 'High-Demand IT Residential Corridor', distanceHinjawadi: '12 Mins', distanceExpressway: '6 Mins' },
  { id: 'tathawade', name: 'Tathawade', subtitle: 'Knowledge Hub & IT Commute Corridor', distanceHinjawadi: '14 Mins', distanceExpressway: '7 Mins' },
  { id: 'wakad', name: 'Wakad', subtitle: 'Established Prime West Pune Commercial Belt', distanceHinjawadi: '12 Mins', distanceExpressway: '8 Mins' },
  { id: 'hinjawadi', name: 'Hinjawadi', subtitle: 'Rajiv Gandhi Infotech Park Technology Epicenter', distanceHinjawadi: '0 Mins', distanceExpressway: '14 Mins' },
  { id: 'marunji', name: 'Marunji', subtitle: 'Phase 2-3 Technology Expansion Corridor', distanceHinjawadi: '5 Mins', distanceExpressway: '12 Mins' },
  { id: 'somatane', name: 'Somatane', subtitle: 'Expressway Toll Corridor & Serene Valley Foothills', distanceHinjawadi: '22 Mins', distanceExpressway: '4 Mins' },
  { id: 'talegaon', name: 'Talegaon', subtitle: 'Industrial Automotive Belt & Cool Climate Hub', distanceHinjawadi: '28 Mins', distanceExpressway: '6 Mins' },
  { id: 'pcmc', name: 'PCMC', subtitle: 'Pimpri Chinchwad Municipal Corporation Smart City Corridor', distanceHinjawadi: '15 Mins', distanceExpressway: '2 Mins' },
  { id: 'chinchwad', name: 'Chinchwad', subtitle: 'Central PCMC Commercial & Cultural Epicenter', distanceHinjawadi: '18 Mins', distanceExpressway: '5 Mins' },
  { id: 'pimpri', name: 'Pimpri', subtitle: 'Premier Business, Automobile & Healthcare District', distanceHinjawadi: '20 Mins', distanceExpressway: '7 Mins' },
  { id: 'nigdi', name: 'Nigdi', subtitle: 'Nigdi Pradhikaran Planned Residential Master Layout', distanceHinjawadi: '18 Mins', distanceExpressway: '3 Mins' },
  { id: 'akurdi', name: 'Akurdi', subtitle: 'Premier Educational Campus & Suburban Rail Hub', distanceHinjawadi: '17 Mins', distanceExpressway: '4 Mins' },
  { id: 'moshi', name: 'Moshi', subtitle: 'North PCMC Industrial & International Exhibition Belt', distanceHinjawadi: '25 Mins', distanceExpressway: '8 Mins' },
  { id: 'bhosari', name: 'Bhosari', subtitle: 'Industrial Powerhouse MIDC & Automotive Hub', distanceHinjawadi: '24 Mins', distanceExpressway: '9 Mins' },
  { id: 'pimple-saudagar', name: 'Pimple Saudagar', subtitle: 'Premium IT Executive Residential Belt', distanceHinjawadi: '14 Mins', distanceExpressway: '10 Mins' },
  { id: 'pimple-nilakh', name: 'Pimple Nilakh', subtitle: 'Luxury Mula Riverfront & Baner Border Belt', distanceHinjawadi: '12 Mins', distanceExpressway: '11 Mins' },
  { id: 'thergaon', name: 'Thergaon', subtitle: 'Central Arterial Node & Dange Chowk Connector', distanceHinjawadi: '13 Mins', distanceExpressway: '7 Mins' }
];

export const CONFIGURATIONS = [
  { id: '2-bhk-classic', name: '2 BHK Classic', carpet: '638 - 745 sq.ft', price: '₹69 Lakhs*', tag: 'High-Efficiency Living' },
  { id: '2-bhk-premier', name: '2 BHK Premier', carpet: '704 - 820 sq.ft', price: '₹74 Lakhs*', tag: 'Spacious Master Suite' },
  { id: '2-bhk-signature', name: '2 BHK Signature', carpet: '760 - 895 sq.ft', price: '₹79 Lakhs*', tag: 'Corner Unit with Dual Deck' },
  { id: '3-bhk-classic', name: '3 BHK Classic', carpet: '848 - 1045 sq.ft', price: '₹86 Lakhs*', tag: 'Family Luxury & Forest View' },
  { id: '3-bhk-premier', name: '3 BHK Premier', carpet: '924 - 1180 sq.ft', price: '₹97 Lakhs*', tag: 'Grand Living-Dining Deck' },
  { id: '3-bhk-signature', name: '3 BHK Signature', carpet: '1036 - 1290 sq.ft', price: '₹1.05 Cr*', tag: 'Presidential Sky Suite' },
  { id: '4-bhk-duplex', name: '4 BHK Duplex', carpet: '1850 sq.ft', price: '₹1.85 - 2.15 Cr*', tag: 'Double-Height Ceiling Sky Villa' },
  { id: 'penthouse-sky-villa', name: 'Penthouse Sky Villa', carpet: '2400 sq.ft', price: '₹2.40 - 2.85 Cr*', tag: 'Private Terrace & Plunge Pool' }
];

export const SEARCH_INTENTS = [
  { id: 'price-cost-sheet', title: 'Price & Cost Sheet Breakdown', query: 'price cost sheet payment plan', focus: 'Transparent all-inclusive cost sheet with stamp duty, GST, and customized down payment schedules.' },
  { id: 'floor-plans-brochure', title: 'Sanctioned Floor Plans & Brochure', query: 'floor plans layout dimension brochure pdf', focus: 'Official sanctioned architectural CAD floor plans, precise carpet areas, and high-res brochure PDF.' },
  { id: 'expressway-connectivity', title: 'Mumbai-Pune Expressway Connectivity', query: 'mumbai pune expressway direct access route', focus: 'Zero-km expressway connectivity, 75-minute drive to Navi Mumbai Airport, and arterial bypass access.' },
  { id: 'hinjawadi-it-commute', title: 'Hinjawadi IT Park Commute Times', query: 'hinjawadi it park distance travel time commute', focus: 'Signal-free 15-20 min transit to Rajiv Gandhi Infotech Park Phase 1, 2, and 3 via bypass roads.' },
  { id: 'luxury-amenities', title: '75+ Biophilic Resort Amenities', query: '75 luxury amenities clubhouse swimming pool', focus: '35,000 sq.ft clubhouse, semi-Olympic heated pool, Japanese Zen garden, sky observatory, and sports arenas.' },
  { id: 'maharera-approvals', title: 'MahaRERA Approvals & Legal Clearance', query: 'maharera registration legal title sanction', focus: 'Official MahaRERA Registration PR1261012502725 / P52100077438 with verified land title and APF bank approvals.' },
  { id: 'investment-appreciation', title: 'Investment ROI & Capital Appreciation', query: 'investment appreciation rental yield returns', focus: 'Forecasted 18-22% capital appreciation, 5-7% high gross rental yield, and PCMC Smart City infrastructure upside.' },
  { id: 'buyer-reviews-testimonials', title: 'Verified Homebuyer Reviews & Ratings', query: 'buyer reviews ratings construction quality', focus: 'Authentic 4.9/5 star ratings from over 1,280 Pune homebuyers with Goyal Properties 38-year track record.' }
];

export const BUYER_PERSONAS = [
  { id: 'it-professionals', title: 'IT & Software Professionals', target: 'Tech Engineers and IT Managers working in Hinjawadi, Talawade, and Baner seeking short commute and smart amenities.' },
  { id: 'first-time-homebuyers', title: 'First-Time Homebuyers', target: 'Young urban professionals and couples seeking affordable luxury with clear MahaRERA protection and PMAY benefits.' },
  { id: 'luxury-investors', title: 'High-Net-Worth Luxury Investors', target: 'Strategic wealth builders seeking Grade-A assets along the Mumbai-Pune corridor with high rental and capital appreciation.' },
  { id: 'nature-biophilic-living', title: 'Biophilic & Nature Enthusiasts', target: 'Health-conscious families valuing 72% lush forest canopy, zero pollution, clean AQI, and bird sanctuary serenity.' },
  { id: 'nri-real-estate-investment', title: 'NRI Property Investors', target: 'Non-Resident Indians seeking transparent, trusted developer delivery with high rental yields and seamless documentation.' },
  { id: 'retiree-peaceful-living', title: 'Senior Citizens & Retirees', target: 'Retirees desiring peaceful, senior-friendly gated community with 24/7 medical support, flat pathways, and fresh air.' },
  { id: 'families-top-schools', title: 'Families with School-Going Children', target: 'Parents prioritizing immediate proximity to premier schools (Symbiosis, Akshara, Indira, Blossom) and sports coaching.' },
  { id: 'expressway-commuters', title: 'Dual-City & Expressway Commuters', target: 'Executives regularly travelling between Mumbai and Pune who require instant, congestion-free expressway access.' }
];

// Generate all 5,120 permutations
export function generatePermutations() {
  const items = [];
  for (const market of MICRO_MARKETS) {
    for (const config of CONFIGURATIONS) {
      for (const intent of SEARCH_INTENTS) {
        for (const persona of BUYER_PERSONAS) {
          const slug = `${market.id}-${config.id}-${intent.id}-${persona.id}`;
          const canonicalUrl = `https://goyalmyhomesanctuary.in/market/${slug}`;
          items.push({
            slug,
            canonicalUrl,
            market,
            config,
            intent,
            persona
          });
        }
      }
    }
  }
  return items;
}

// Generate Sitemaps Chunked into 1,000 URLs each
export function buildSitemaps(items) {
  const CHUNK_SIZE = 1000;
  const totalChunks = Math.ceil(items.length / CHUNK_SIZE);
  const now = '2026-09-22';

  console.log(`Generating ${items.length} programmatic URLs across ${totalChunks} sitemap files...`);

  for (let i = 0; i < totalChunks; i++) {
    const chunk = items.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const sitemapNumber = i + 1;
    const filename = `sitemap-market-${sitemapNumber}.xml`;
    const filepath = path.join(ROOT_DIR, filename);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const item of chunk) {
      xml += `  <url>\n`;
      xml += `    <loc>${item.canonicalUrl}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.85</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;
    fs.writeFileSync(filepath, xml, 'utf8');
    console.log(`✓ Wrote ${filepath} (${chunk.length} URLs)`);
  }

  // Backup current sitemap.xml to sitemap-core.xml if not already done
  const coreSitemapPath = path.join(ROOT_DIR, 'sitemap-core.xml');
  const mainSitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
  
  if (!fs.existsSync(coreSitemapPath)) {
    fs.copyFileSync(mainSitemapPath, coreSitemapPath);
    console.log(`✓ Preserved core URLs to sitemap-core.xml`);
  }

  // Write Master Sitemap Index into sitemap.xml
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  indexXml += `  <sitemap>\n`;
  indexXml += `    <loc>https://goyalmyhomesanctuary.in/sitemap-core.xml</loc>\n`;
  indexXml += `    <lastmod>${now}</lastmod>\n`;
  indexXml += `  </sitemap>\n`;
  indexXml += `  <sitemap>\n`;
  indexXml += `    <loc>https://goyalmyhomesanctuary.in/sitemap-images.xml</loc>\n`;
  indexXml += `    <lastmod>${now}</lastmod>\n`;
  indexXml += `  </sitemap>\n`;

  for (let i = 1; i <= totalChunks; i++) {
    indexXml += `  <sitemap>\n`;
    indexXml += `    <loc>https://goyalmyhomesanctuary.in/sitemap-market-${i}.xml</loc>\n`;
    indexXml += `    <lastmod>${now}</lastmod>\n`;
    indexXml += `  </sitemap>\n`;
  }
  indexXml += `</sitemapindex>\n`;

  fs.writeFileSync(mainSitemapPath, indexXml, 'utf8');
  console.log(`✓ Updated master index at ${mainSitemapPath}`);

  // Also write static market/index.html for local static preview
  const marketDir = path.join(ROOT_DIR, 'market');
  if (!fs.existsSync(marketDir)) {
    fs.mkdirSync(marketDir, { recursive: true });
  }
  
  // Full static directory hub for /market/index.html matching edge SSR
  const staticHubPath = path.join(marketDir, 'index.html');
  const staticHubHtml = renderDirectoryHub();
  fs.writeFileSync(staticHubPath, staticHubHtml, 'utf8');
  console.log(`✓ Wrote full static market directory hub at ${staticHubPath}`);
}

// Run generator
const permutations = generatePermutations();
console.log(`Total Permutations Generated: ${permutations.length}`);
buildSitemaps(permutations);

