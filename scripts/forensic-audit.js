import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

console.log('=== RUNNING FORENSIC DEEP AUDIT ACROSS ENTIRE PROJECT ===');

const issues = [];

// 1. Check if /market is in sitemap-core.xml
const sitemapCore = fs.readFileSync(path.join(ROOT_DIR, 'sitemap-core.xml'), 'utf8');
if (!sitemapCore.includes('https://goyalmyhomesanctuary.in/market<')) {
  issues.push({
    category: 'Sitemap Discovery',
    severity: 'Medium',
    description: '/market is not explicitly listed as a <loc> in sitemap-core.xml (only /market/slugs are in market sitemaps).'
  });
}

// 2. Check for missing width and height attributes on <img> tags (Google Core Web Vitals - CLS)
const htmlFiles = [];
function findHtml(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!['node_modules', '.git', 'scratch'].includes(f)) findHtml(full);
    } else if (f.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}
findHtml(ROOT_DIR);

let missingDims = 0;
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const imgMatches = [...content.matchAll(/<img\s+([^>]*?)>/gi)];
  for (const m of imgMatches) {
    const attrs = m[1];
    const hasW = /width=["']?\d+/i.test(attrs);
    const hasH = /height=["']?\d+/i.test(attrs);
    const hasClassDims = /w-\d+|h-\d+|w-full|h-auto|w-auto/i.test(attrs);
    if (!hasW && !hasH && !hasClassDims) {
      missingDims++;
    }
  }
}
if (missingDims > 0) {
  issues.push({
    category: 'Core Web Vitals (CLS)',
    severity: 'Low',
    description: `${missingDims} <img> tags do not have explicit width/height attributes or dimensional CSS classes.`
  });
}

// 3. Check JSON-LD Schemas across all files for Google Rich Result standards
for (const file of htmlFiles) {
  const rel = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf8');
  const jsonLdMatches = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];

  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1].trim());
      const graph = data['@graph'] || [data];
      for (const item of graph) {
        // If Product, ensure offers or aggregateRating is valid
        if (item['@type'] === 'Product') {
          if (!item.offers && !item.aggregateRating) {
            issues.push({
              category: 'Schema.org Standards',
              severity: 'High',
              description: `${rel}: Product schema missing 'offers' or 'aggregateRating'`
            });
          }
        }
        // If BreadcrumbList, ensure itemListElement has no # links
        if (item['@type'] === 'BreadcrumbList') {
          const list = item.itemListElement || [];
          for (const el of list) {
            const url = el.item || '';
            if (url.includes('#')) {
              issues.push({
                category: 'Schema.org Standards',
                severity: 'High',
                description: `${rel}: Breadcrumb item contains hash fragment: ${url}`
              });
            }
          }
        }
      }
    } catch (e) {
      issues.push({
        category: 'Schema.org Syntax',
        severity: 'Critical',
        description: `${rel}: Malformed JSON-LD: ${e.message}`
      });
    }
  }
}

// 4. Check Apple Touch Icon and Favicon definitions
for (const file of htmlFiles) {
  const rel = path.relative(ROOT_DIR, file);
  if (['index.html', 'pages/price-cost-sheet.html', 'pages/2-bhk-flats-mamurdi.html'].includes(rel)) {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes('apple-touch-icon')) {
      issues.push({
        category: 'Mobile PWA & Apple Search',
        severity: 'Low',
        description: `${rel} is missing <link rel="apple-touch-icon">`
      });
    }
  }
}

// 5. Check manifest.webmanifest syntax
const manifestPath = path.join(ROOT_DIR, 'manifest.webmanifest');
if (fs.existsSync(manifestPath)) {
  try {
    JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    issues.push({
      category: 'PWA Manifest',
      severity: 'Medium',
      description: `manifest.webmanifest syntax error: ${e.message}`
    });
  }
}

// 6. Check for any leftover old prices in code
for (const file of htmlFiles) {
  const rel = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('62.50 L*') || content.includes('62.50 Lakh')) {
    issues.push({
      category: 'Pricing Consistency',
      severity: 'High',
      description: `${rel} still contains old starting price (₹62.50 L*)`
    });
  }
}

console.log(`\nForensic Audit Complete. Total Potential Gaps Found: ${issues.length}`);
console.table(issues);
