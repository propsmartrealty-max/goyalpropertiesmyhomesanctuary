/**
 * Cryptographic SRI Integrity & Tamper Detection Suite
 * Path: scripts/verify-sri-integrity.js
 * 
 * Asserts that all local stylesheets and client JavaScript engines match their
 * recorded cryptographic SHA-384 hashes in `sri-manifest.json` with 0 drift.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export function verifySriIntegrity() {
  console.log('\n--- Verifying Cryptographic Subresource Integrity (SRI) ---');
  const manifestPath = path.join(ROOT_DIR, 'sri-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('sri-manifest.json does not exist. Run scripts/generate-sri-hashes.js first.');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const entries = Object.entries(manifest);
  let verifiedCount = 0;

  for (const [relPath, info] of entries) {
    const fullPath = path.join(ROOT_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Tracked SRI file missing on disk: ${relPath}`);
    }

    const content = fs.readFileSync(fullPath);
    const currentHash = `sha384-${crypto.createHash('sha384').update(content).digest('base64')}`;

    if (currentHash !== info.sri) {
      throw new Error(`SRI mismatch detected for ${relPath}! Expected: ${info.sri}, Got: ${currentHash}`);
    }
    verifiedCount++;
  }

  console.log(`✓ All ${verifiedCount} local CSS and JS bundles matched their cryptographic SHA-384 signatures perfectly with ZERO tampering!\n`);
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  verifySriIntegrity();
}
