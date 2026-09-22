import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

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
console.log(`Processing ${htmlFiles.length} HTML files...`);

let updatedCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Inject ai-facts.json link in <head> if missing
  if (!content.includes('href="/ai-facts.json"')) {
    const targetTag = '<link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Search Goyal My Home Sanctuary" />';
    if (content.includes(targetTag)) {
      content = content.replace(
        targetTag,
        `${targetTag}\n  <link rel="alternate" type="application/json" href="/ai-facts.json" title="Goyal My Home Sanctuary AI Knowledge Graph" />`
      );
      changed = true;
    }
  }

  // 2. Inject headless commute-engine.js before </body> if missing (skip 404)
  if (!file.endsWith('404.html') && !content.includes('/js/commute-engine.js')) {
    if (content.includes('</body>')) {
      content = content.replace(
        '</body>',
        '  <script src="/js/commute-engine.js" defer></script>\n</body>'
      );
      changed = true;
    }
  }

  // 3. Inject headless international-tour-desk.js before </body> if missing (skip 404)
  if (!file.endsWith('404.html') && !content.includes('/js/international-tour-desk.js')) {
    if (content.includes('</body>')) {
      content = content.replace(
        '</body>',
        '  <script src="/js/international-tour-desk.js" defer></script>\n</body>'
      );
      changed = true;
    }
  }

  // 4. Inject headless lead-telemetry.js before </body> if missing (skip 404)
  if (!file.endsWith('404.html') && !content.includes('/js/lead-telemetry.js')) {
    if (content.includes('</body>')) {
      content = content.replace(
        '</body>',
        '  <script src="/js/lead-telemetry.js" defer></script>\n</body>'
      );
      changed = true;
    }
  }

  // 5. Inject headless web-vitals-rum.js before </body> if missing (skip 404)
  if (!file.endsWith('404.html') && !content.includes('/js/web-vitals-rum.js')) {
    if (content.includes('</body>')) {
      content = content.replace(
        '</body>',
        '  <script src="/js/web-vitals-rum.js" defer></script>\n</body>'
      );
      changed = true;
    }
  }

  // 6. Inject headless solar-vastu-engine.js before </body> if missing (skip 404)
  if (!file.endsWith('404.html') && !content.includes('/js/solar-vastu-engine.js')) {
    if (content.includes('</body>')) {
      content = content.replace(
        '</body>',
        '  <script src="/js/solar-vastu-engine.js" defer></script>\n</body>'
      );
      changed = true;
    }
  }

  // 7. Inject catalog.jsonld link in <head> if missing
  if (!content.includes('href="/catalog.jsonld"')) {
    const aiFactsTag = '<link rel="alternate" type="application/json" href="/ai-facts.json" title="Goyal My Home Sanctuary AI Knowledge Graph" />';
    if (content.includes(aiFactsTag)) {
      content = content.replace(
        aiFactsTag,
        `${aiFactsTag}\n  <link rel="alternate" type="application/ld+json" href="/catalog.jsonld" title="Goyal My Home Sanctuary Sanctioned Offer Catalog" />`
      );
      changed = true;
    }
  }

  // 8. Inject headless currency-engine.js before </body> if missing (skip 404)
  if (!file.endsWith('404.html') && !content.includes('/js/currency-engine.js')) {
    if (content.includes('</body>')) {
      content = content.replace(
        '</body>',
        '  <script src="/js/currency-engine.js" defer></script>\n</body>'
      );
      changed = true;
    }
  }

  // 9. Inject headless vector-search.js before </body> if missing (skip 404)
  if (!file.endsWith('404.html') && !content.includes('/js/vector-search.js')) {
    if (content.includes('</body>')) {
      content = content.replace(
        '</body>',
        '  <script src="/js/vector-search.js" defer></script>\n</body>'
      );
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log(`✓ Updated ${path.relative(ROOT_DIR, file)}`);
  }
}

console.log(`Done! Updated ${updatedCount} HTML files.`);
