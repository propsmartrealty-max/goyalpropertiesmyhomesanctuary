import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        getAllHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(ROOT_DIR);
console.log(`Found ${htmlFiles.length} HTML files to audit.`);

const gaps = [];

for (const file of htmlFiles) {
  const relPath = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, 'utf8');

  // Check H1
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length === 0) {
    gaps.push({ file: relPath, category: 'Headings', issue: 'Missing <h1> tag' });
  } else if (h1Matches.length > 1) {
    gaps.push({ file: relPath, category: 'Headings', issue: `Multiple (${h1Matches.length}) <h1> tags found` });
  }

  // Check Title
  const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    gaps.push({ file: relPath, category: 'Metadata', issue: 'Missing <title> tag' });
  } else {
    const titleText = titleMatch[1].trim();
    if (titleText.length < 30 || titleText.length > 70) {
      // note title length
    }
  }

  // Check Meta Description
  const metaDesc = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                   content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  if (!metaDesc || !metaDesc[1].trim()) {
    gaps.push({ file: relPath, category: 'Metadata', issue: 'Missing meta description' });
  }

  // Check Canonical
  const canonical = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  if (!canonical || !canonical[1].trim()) {
    gaps.push({ file: relPath, category: 'Canonicals', issue: 'Missing canonical link tag' });
  }

  // Check Open Graph Image, Locale, Site Name & Twitter Cards
  const ogImg = content.match(/<meta\s+property=["']og:image["']/i);
  if (!ogImg) {
    gaps.push({ file: relPath, category: 'Social/OpenGraph', issue: 'Missing og:image' });
  }
  if (!content.includes('og:site_name')) {
    gaps.push({ file: relPath, category: 'Social/OpenGraph', issue: 'Missing og:site_name' });
  }
  if (!content.includes('og:locale')) {
    gaps.push({ file: relPath, category: 'Social/OpenGraph', issue: 'Missing og:locale' });
  }
  const twCard = content.match(/<meta\s+name=["']twitter:card["']/i);
  if (!twCard) {
    gaps.push({ file: relPath, category: 'Social/Twitter', issue: 'Missing twitter:card meta' });
  }
  if (!content.includes('twitter:site')) {
    gaps.push({ file: relPath, category: 'Social/Twitter', issue: 'Missing twitter:site meta' });
  }

  // Check Viewport & Theme Color
  if (!content.includes('viewport-fit=cover')) {
    gaps.push({ file: relPath, category: 'Mobile Viewport', issue: 'Missing viewport-fit=cover in viewport meta' });
  }
  if (!content.includes('theme-color')) {
    gaps.push({ file: relPath, category: 'Mobile Viewport', issue: 'Missing theme-color meta tag' });
  }

  // Check Schema JSON-LD
  const hasJsonLd = content.includes('application/ld+json');
  if (!hasJsonLd) {
    gaps.push({ file: relPath, category: 'Structured Data', issue: 'Missing Schema.org JSON-LD' });
  } else {
    // Check if JSON-LD parses cleanly
    const jsonLdMatches = content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
    for (const m of jsonLdMatches) {
      try {
        JSON.parse(m[1].trim());
      } catch (e) {
        gaps.push({ file: relPath, category: 'Structured Data', issue: `Invalid JSON-LD syntax: ${e.message}` });
      }
    }
  }

  // Check Images without alt
  const imgMatches = content.matchAll(/<img\s+([^>]*?)>/gi);
  let imgsWithoutAlt = 0;
  let imgsWithoutDimensions = 0;
  for (const img of imgMatches) {
    const attrs = img[1];
    if (!attrs.includes('alt=') || attrs.includes('alt=""')) {
      imgsWithoutAlt++;
    }
    if (!attrs.includes('width=') || !attrs.includes('height=')) {
      imgsWithoutDimensions++;
    }
  }
  if (imgsWithoutAlt > 0) {
    gaps.push({ file: relPath, category: 'Image SEO', issue: `${imgsWithoutAlt} images missing descriptive alt tags` });
  }

  // Check phone number consistency
  const oldPhone = content.match(/\+91\s*77440\s*09295/g);
  if (oldPhone) {
    gaps.push({ file: relPath, category: 'NAP Consistency', issue: `Contains old phone number (+91 77440 09295) instead of +91 91753 19441 (${oldPhone.length} occurrences)` });
  }
}

console.log(`\nFound ${gaps.length} SEO gaps across files:`);
console.table(gaps);
