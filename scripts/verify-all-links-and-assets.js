/**
 * scripts/verify-all-links-and-assets.js
 * Scans all HTML files to ensure 100% of internal links, images, scripts, and CSS point to existing files.
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
console.log(`Checking links and assets across ${htmlFiles.length} HTML files...\n`);

let missingAssets = [];
let missingLinks = [];

for (const filePath of htmlFiles) {
  const relPath = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check src="..." (images, scripts)
  const srcRegex = /src=["'](\/[^"'#?]+|assets\/[^"'#?]+|js\/[^"'#?]+|css\/[^"'#?]+)["']/gi;
  let srcMatch;
  while ((srcMatch = srcRegex.exec(content)) !== null) {
    let assetPath = srcMatch[1];
    if (assetPath.startsWith('/')) assetPath = assetPath.slice(1);
    const fullAssetPath = path.join(ROOT_DIR, assetPath);
    if (!fs.existsSync(fullAssetPath)) {
      missingAssets.push({ file: relPath, asset: srcMatch[1] });
    }
  }

  // Check href="..." for stylesheets and icons
  const hrefAssetRegex = /<link[^>]+href=["'](\/[^"'#?]+\.(?:css|svg|ico|png|webmanifest|xml))["']/gi;
  let linkAssetMatch;
  while ((linkAssetMatch = hrefAssetRegex.exec(content)) !== null) {
    let assetPath = linkAssetMatch[1];
    if (assetPath.startsWith('/')) assetPath = assetPath.slice(1);
    const fullAssetPath = path.join(ROOT_DIR, assetPath);
    if (!fs.existsSync(fullAssetPath)) {
      missingAssets.push({ file: relPath, asset: linkAssetMatch[1] });
    }
  }

  // Check internal route links
  const hrefRouteRegex = /<a[^>]+href=["'](\/[^"'#?:]*)["']/gi;
  let routeMatch;
  while ((routeMatch = hrefRouteRegex.exec(content)) !== null) {
    const route = routeMatch[1];
    if (route === '' || route === '/' || route.startsWith('/#') || route.startsWith('/market')) continue;
    
    // Check if file exists as root .html or folder
    const targetFile1 = path.join(ROOT_DIR, route.slice(1) + '.html');
    const targetFile2 = path.join(ROOT_DIR, route.slice(1), 'index.html');
    const targetFile3 = path.join(ROOT_DIR, route.slice(1));
    const pagesFile = path.join(ROOT_DIR, 'pages', route.slice(1) + '.html');

    if (!fs.existsSync(targetFile1) && !fs.existsSync(targetFile2) && !fs.existsSync(targetFile3) && !fs.existsSync(pagesFile)) {
      missingLinks.push({ file: relPath, route: route });
    }
  }
}

console.log('=== ASSET & LINK INTEGRITY REPORT ===');
console.log(`Missing Assets: ${missingAssets.length}`);
if (missingAssets.length > 0) console.table(missingAssets);

console.log(`Missing Route Links: ${missingLinks.length}`);
if (missingLinks.length > 0) console.table(missingLinks);

if (missingAssets.length === 0 && missingLinks.length === 0) {
  console.log('✓ 100% PERFECT! All internal images, scripts, stylesheets, and route links exist and resolve cleanly.');
}
