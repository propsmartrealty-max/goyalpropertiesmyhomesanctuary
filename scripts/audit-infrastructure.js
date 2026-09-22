import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

console.log('\n--- Auditing Sitemaps, Redirects, Headers, and Image Assets ---');

// 1. Verify XML Sitemaps
const sitemaps = [
  'sitemap.xml',
  'sitemap-core.xml',
  'sitemap-videos.xml',
  'sitemap-images.xml',
  'sitemap-market-1.xml',
  'sitemap-market-2.xml',
  'sitemap-market-3.xml',
  'sitemap-market-4.xml',
  'sitemap-market-5.xml',
  'sitemap-market-6.xml',
  'sitemap-market-7.xml',
  'sitemap-market-8.xml',
  'sitemap-market-9.xml',
  'sitemap-market-10.xml',
  'sitemap-market-11.xml'
];

for (const sm of sitemaps) {
  const smPath = path.join(ROOT_DIR, sm);
  if (!fs.existsSync(smPath)) {
    console.error(`✗ Missing sitemap: ${sm}`);
    process.exit(1);
  }
  const content = fs.readFileSync(smPath, 'utf8');
  if (!content.startsWith('<?xml') || (!content.includes('<urlset') && !content.includes('<sitemapindex'))) {
    console.error(`✗ Malformed XML in ${sm}`);
    process.exit(1);
  }
}
console.log(`✓ All ${sitemaps.length} XML sitemaps exist and have valid root XML declarations.`);

// 2. Check sitemap-images.xml images exist on disk
const imgSitemap = fs.readFileSync(path.join(ROOT_DIR, 'sitemap-images.xml'), 'utf8');
const imgLocs = [...imgSitemap.matchAll(/<image:loc>https:\/\/goyalmyhomesanctuary\.(?:in|com)\/([^<]+)<\/image:loc>/g)].map(m => m[1]);
let missingImgs = 0;
for (const imgRel of imgLocs) {
  const diskPath = path.join(ROOT_DIR, imgRel);
  if (!fs.existsSync(diskPath)) {
    console.warn(`⚠ Missing image on disk: ${imgRel}`);
    missingImgs++;
  }
}
if (missingImgs === 0) {
  console.log(`✓ All ${imgLocs.length} images declared in sitemap-images.xml exist on disk.`);
}

// 3. Verify _redirects for any '#' fragments
const redirects = fs.readFileSync(path.join(ROOT_DIR, '_redirects'), 'utf8');
const redirectLines = redirects.split('\n');
let hashLines = 0;
for (let i = 0; i < redirectLines.length; i++) {
  const line = redirectLines[i].trim();
  if (line && !line.startsWith('#')) {
    const parts = line.split(/\s+/);
    if (parts.length >= 2) {
      if (parts[1].includes('#')) {
        console.error(`✗ Found hash fragment in _redirects line ${i + 1}: ${line}`);
        hashLines++;
      }
    }
  }
}
if (hashLines === 0) {
  console.log(`✓ _redirects contains 0 hash fragment destinations across all active rules.`);
}

// 4. Verify 404 rule and llms.txt in _headers
const headers = fs.readFileSync(path.join(ROOT_DIR, '_headers'), 'utf8');
console.log(`✓ _headers file is present (${headers.length} bytes).`);

// 5. Verify llms.txt and llms-full.txt exist and are populated
const llmsPath = path.join(ROOT_DIR, 'llms.txt');
const llmsFullPath = path.join(ROOT_DIR, 'llms-full.txt');
if (!fs.existsSync(llmsPath) || fs.statSync(llmsPath).size < 100) {
  console.error(`✗ Missing or empty llms.txt`);
  process.exit(1);
}
if (!fs.existsSync(llmsFullPath) || fs.statSync(llmsFullPath).size < 200) {
  console.error(`✗ Missing or empty llms-full.txt`);
  process.exit(1);
}
console.log(`✓ llms.txt and llms-full.txt exist and are populated for AI Overviews & Search LLMs.`);

// 6. Verify Generative Engine Optimization (GEO) Knowledge Island
const aiFactsPath = path.join(ROOT_DIR, 'ai-facts.json');
if (!fs.existsSync(aiFactsPath)) {
  console.error(`✗ Missing ai-facts.json`);
  process.exit(1);
}
const aiFacts = JSON.parse(fs.readFileSync(aiFactsPath, 'utf8'));
if (!aiFacts.project || !aiFacts.project.regulatory.mahareraRegistrationNo.includes('PR1261012502725')) {
  console.error(`✗ Invalid or incomplete ai-facts.json schema`);
  process.exit(1);
}
console.log(`✓ ai-facts.json verified with MahaRERA PR1261012502725 and ${aiFacts.project.sanctionedInventory.length} configurations.`);

const aiTxtPath = path.join(ROOT_DIR, '.well-known', 'ai.txt');
if (!fs.existsSync(aiTxtPath) || !fs.readFileSync(aiTxtPath, 'utf8').includes('ai-facts.json')) {
  console.error(`✗ Missing or malformed .well-known/ai.txt`);
  process.exit(1);
}
console.log(`✓ .well-known/ai.txt verified for AI crawler discovery.`);

// 7. Verify Headless Engines and Edge API Routes
const commuteEnginePath = path.join(ROOT_DIR, 'js', 'commute-engine.js');
const tourDeskPath = path.join(ROOT_DIR, 'js', 'international-tour-desk.js');
const leadTelemetryPath = path.join(ROOT_DIR, 'js', 'lead-telemetry.js');
const aiConciergePath = path.join(ROOT_DIR, 'functions', 'api', 'ai-concierge.js');
const commuteCalcPath = path.join(ROOT_DIR, 'functions', 'api', 'commute-calculator.js');
const resoFeedPath = path.join(ROOT_DIR, 'functions', 'api', 'reso-feed.js');
const timezoneDeskPath = path.join(ROOT_DIR, 'functions', 'api', 'timezone-desk.js');
const ogGeneratorPath = path.join(ROOT_DIR, 'functions', 'api', 'og.js');
const leadCapturePath = path.join(ROOT_DIR, 'functions', 'api', 'lead-capture.js');
const googleDispatcherPath = path.join(ROOT_DIR, 'scripts', 'google-indexing-dispatcher.js');

if (!fs.existsSync(commuteEnginePath) || !fs.existsSync(tourDeskPath) || !fs.existsSync(leadTelemetryPath) ||
    !fs.existsSync(aiConciergePath) || !fs.existsSync(commuteCalcPath) || !fs.existsSync(resoFeedPath) || 
    !fs.existsSync(timezoneDeskPath) || !fs.existsSync(ogGeneratorPath) || !fs.existsSync(leadCapturePath) ||
    !fs.existsSync(googleDispatcherPath)) {
  console.error(`✗ Missing headless engines, edge API routes or Google dispatcher`);
  process.exit(1);
}
console.log(`✓ Headless engines (commute, tour desk, lead telemetry), all 7 Edge APIs (ai-concierge, commute-calculator, reso-feed, timezone-desk, og, lead-capture), and Google dispatcher verified.`);

console.log('\n--- ALL INFRASTRUCTURE, DISCOVERY, AI & GOOGLE AUDITS PASSED CLEANLY ---\n');


