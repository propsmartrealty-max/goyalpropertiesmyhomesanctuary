/**
 * XML Sitemap Gzip Pre-Compression Pipeline
 * Path: scripts/compress-sitemaps.js
 * 
 * Pre-compresses all 16 XML sitemaps to `.xml.gz` companion files for fast Google Search Console parsing.
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export function compressAllSitemaps() {
  console.log('\n--- Pre-Compressing XML Sitemaps to GZIP (.xml.gz) ---');
  const files = fs.readdirSync(ROOT_DIR).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
  let totalSavedBytes = 0;
  let totalOriginalBytes = 0;

  for (const file of files) {
    const filePath = path.join(ROOT_DIR, file);
    const content = fs.readFileSync(filePath);
    const compressed = zlib.gzipSync(content, { level: 9 });
    
    const gzPath = `${filePath}.gz`;
    fs.writeFileSync(gzPath, compressed);

    totalOriginalBytes += content.length;
    totalSavedBytes += (content.length - compressed.length);

    const ratio = ((1 - (compressed.length / content.length)) * 100).toFixed(1);
    console.log(`  ✓ ${file} -> ${file}.gz (${(content.length / 1024).toFixed(1)} KB -> ${(compressed.length / 1024).toFixed(1)} KB, -${ratio}%)`);
  }

  console.log(`\n✓ Successfully compressed ${files.length} sitemaps! Total saved: ${(totalSavedBytes / 1024).toFixed(1)} KB (-${((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1)}% bandwidth reduction)\n`);
  return files.length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  compressAllSitemaps();
}
