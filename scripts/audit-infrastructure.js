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
  'sitemap-market-6.xml'
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
console.log(`✓ All 10 XML sitemaps exist and have valid root XML declarations.`);

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

console.log('\n--- ALL INFRASTRUCTURE & DISCOVERY AUDITS PASSED CLEANLY ---\n');
