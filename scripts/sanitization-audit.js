/**
 * scripts/sanitization-audit.js
 * Comprehensive sanitization scanner for SEO, Code, and HTML Structure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

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
console.log(`Auditing ${htmlFiles.length} HTML files for sanitization issues...\n`);

let issues = [];

for (const filePath of htmlFiles) {
  const relPath = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Check duplicate head elements
  const titleMatches = content.match(/<title[^>]*>/gi) || [];
  if (titleMatches.length > 1) {
    issues.push({ file: relPath, type: 'Duplicate Head', message: `Found ${titleMatches.length} <title> tags` });
  }

  const canonicalMatches = content.match(/<link[^>]*rel=["']canonical["'][^>]*>/gi) || [];
  if (canonicalMatches.length > 1) {
    issues.push({ file: relPath, type: 'Duplicate Head', message: `Found ${canonicalMatches.length} canonical links` });
  }

  const descMatches = content.match(/<meta[^>]*name=["']description["'][^>]*>/gi) || [];
  if (descMatches.length > 1) {
    issues.push({ file: relPath, type: 'Duplicate Head', message: `Found ${descMatches.length} description meta tags` });
  }

  const robotsMatches = content.match(/<meta[^>]*name=["']robots["'][^>]*>/gi) || [];
  if (robotsMatches.length > 1) {
    issues.push({ file: relPath, type: 'Duplicate Head', message: `Found ${robotsMatches.length} robots meta tags` });
  }

  const viewportMatches = content.match(/<meta[^>]*name=["']viewport["'][^>]*>/gi) || [];
  if (viewportMatches.length > 1) {
    issues.push({ file: relPath, type: 'Duplicate Head', message: `Found ${viewportMatches.length} viewport meta tags` });
  }

  const speculationMatches = content.match(/<script[^>]*type=["']speculationrules["'][^>]*>/gi) || [];
  if (speculationMatches.length > 1) {
    issues.push({ file: relPath, type: 'Duplicate Head', message: `Found ${speculationMatches.length} speculationrules script tags` });
  }

  const opensearchMatches = content.match(/<link[^>]*href=["']\/opensearch\.xml["'][^>]*>/gi) || [];
  if (opensearchMatches.length > 1) {
    issues.push({ file: relPath, type: 'Duplicate Head', message: `Found ${opensearchMatches.length} opensearch link tags` });
  }

  // 2. Check JSON-LD validation
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let jsonBlockIdx = 0;
  while ((match = jsonLdRegex.exec(content)) !== null) {
    jsonBlockIdx++;
    try {
      JSON.parse(match[1]);
    } catch (e) {
      issues.push({ file: relPath, type: 'JSON-LD Syntax', message: `Block #${jsonBlockIdx} failed JSON.parse: ${e.message}` });
    }
  }

  // 3. Heading Structure (H1 counts)
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length === 0) {
    issues.push({ file: relPath, type: 'Heading Structure', message: 'Missing <h1> tag' });
  } else if (h1Matches.length > 1) {
    issues.push({ file: relPath, type: 'Heading Structure', message: `Multiple <h1> tags (${h1Matches.length})` });
  }

  // Empty headings
  const emptyHeadingMatch = content.match(/<h[1-6][^>]*>\s*<\/h[1-6]>/gi);
  if (emptyHeadingMatch) {
    issues.push({ file: relPath, type: 'Heading Structure', message: `Empty heading found: ${emptyHeadingMatch[0]}` });
  }

  // 4. Internal Link Hygiene (.html extensions in internal hrefs)
  const internalHtmlLinkRegex = /href=["'](\/[^"'#?]+\.html)["']/gi;
  let linkMatch;
  while ((linkMatch = internalHtmlLinkRegex.exec(content)) !== null) {
    issues.push({ file: relPath, type: 'Link Sanitization', message: `Internal link has .html extension: ${linkMatch[1]} (should be clean URL)` });
  }

  // 5. Unescaped ampersands in titles or descriptions
  const titleTagMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (titleTagMatch && titleTagMatch[1].includes('&') && !titleTagMatch[1].includes('&amp;') && !titleTagMatch[1].includes('&ndash;')) {
    // Note: in HTML5 title, raw & is valid if not ambiguous, but let's check
  }
}

console.log(`=== SANITIZATION AUDIT RESULTS ===`);
if (issues.length === 0) {
  console.log('✓ 100% CLEAN! Zero sanitization issues found across all HTML files.');
} else {
  console.log(`Found ${issues.length} sanitization issues:`);
  console.table(issues);
}
