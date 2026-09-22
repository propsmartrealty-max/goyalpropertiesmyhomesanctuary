/**
 * Subresource Integrity (SRI) Hash Pipeline & Verification Suite
 * Path: scripts/generate-sri-hashes.js
 * 
 * Computes SHA-384 cryptographic integrity hashes for all local CSS stylesheets
 * and JavaScript client engines, generating a reproducible security manifest.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const TARGET_DIRECTORIES = ['css', 'js'];

export function generateSriManifest() {
  console.log('\n--- Computing Subresource Integrity (SRI) SHA-384 Hashes ---');
  const manifest = {};
  let totalFiles = 0;

  for (const dirName of TARGET_DIRECTORIES) {
    const fullDirPath = path.join(ROOT_DIR, dirName);
    if (!fs.existsSync(fullDirPath)) continue;

    const files = fs.readdirSync(fullDirPath).filter(f => f.endsWith('.js') || f.endsWith('.css'));
    for (const file of files) {
      const filePath = path.join(fullDirPath, file);
      const relativePath = path.posix.join(dirName, file);
      const content = fs.readFileSync(filePath);
      
      const hash = crypto.createHash('sha384').update(content).digest('base64');
      const sriString = `sha384-${hash}`;
      
      manifest[relativePath] = {
        sizeBytes: content.length,
        sri: sriString
      };
      totalFiles++;
      console.log(`  ✓ ${relativePath} -> ${sriString.slice(0, 32)}... (${content.length} bytes)`);
    }
  }

  const manifestPath = path.join(ROOT_DIR, 'sri-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n✓ Generated ${totalFiles} cryptographic SRI hashes saved to sri-manifest.json`);
  return manifest;
}

// Direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSriManifest();
}
