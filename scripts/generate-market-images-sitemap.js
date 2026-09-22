import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MICRO_MARKETS = [
  { id: 'mamurdi', name: 'Mamurdi' },
  { id: 'pcmc', name: 'PCMC' },
  { id: 'chinchwad', name: 'Chinchwad' },
  { id: 'pimpri', name: 'Pimpri' },
  { id: 'nigdi', name: 'Nigdi' },
  { id: 'akurdi', name: 'Akurdi' },
  { id: 'ravet', name: 'Ravet' },
  { id: 'kiwale', name: 'Kiwale' },
  { id: 'wakad', name: 'Wakad' },
  { id: 'hinjawadi', name: 'Hinjawadi' },
  { id: 'punawale', name: 'Punawale' },
  { id: 'tathawade', name: 'Tathawade' },
  { id: 'moshi', name: 'Moshi' },
  { id: 'bhosari', name: 'Bhosari' },
  { id: 'pimple-saudagar', name: 'Pimple Saudagar' },
  { id: 'pimple-nilakh', name: 'Pimple Nilakh' },
  { id: 'thergaon', name: 'Thergaon' },
  { id: 'marunji', name: 'Marunji' },
  { id: 'somatane', name: 'Somatane' },
  { id: 'talegaon', name: 'Talegaon' }
];

const CONFIGS = [
  { id: '2-bhk-classic', name: '2 BHK Classic', carpet: '638 - 745 sq.ft', image: 'assets/images/scraped/plan-2bhk.webp' },
  { id: '3-bhk-classic', name: '3 BHK Classic', carpet: '848 - 1045 sq.ft', image: 'assets/images/scraped/plan-3bhk.webp' }
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

for (const market of MICRO_MARKETS) {
  for (const config of CONFIGS) {
    const pageUrl = `https://goyalmyhomesanctuary.in/market/${market.id}-${config.id}-price-cost-sheet-it-professionals`;
    xml += `  <url>\n`;
    xml += `    <loc>${pageUrl}</loc>\n`;
    xml += `    <lastmod>2026-09-22</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>https://goyalmyhomesanctuary.in/${config.image}</image:loc>\n`;
    xml += `      <image:title>${config.name} Official CAD Floor Plan Layout in ${market.name} Pune West</image:title>\n`;
    xml += `      <image:caption>Sanctioned ${config.carpet} CAD Architectural Blueprint with Monolithic MIVAN Structure at Goyal My Home Sanctuary near ${market.name}</image:caption>\n`;
    xml += `      <image:geo_location>Mamurdi, PCMC Pune West, Maharashtra, India</image:geo_location>\n`;
    xml += `    </image:image>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>https://goyalmyhomesanctuary.in/assets/images/scraped/elevation-main.jpg</image:loc>\n`;
    xml += `      <image:title>Goyal My Home Sanctuary Elevation View from ${market.name}</image:title>\n`;
    xml += `      <image:caption>G+28 High-Rise Biophilic Towers with 72% Forest Canopy - MahaRERA: PR1261012502725</image:caption>\n`;
    xml += `      <image:geo_location>Mamurdi, PCMC Pune West, Maharashtra, India</image:geo_location>\n`;
    xml += `    </image:image>\n`;
    xml += `  </url>\n`;
  }
}

xml += `</urlset>\n`;

const outPath = path.join(ROOT_DIR, 'sitemap-market-images.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`✓ Wrote ${outPath} (${MICRO_MARKETS.length * CONFIGS.length * 2} image entries across ${MICRO_MARKETS.length * CONFIGS.length} URLs).`);
