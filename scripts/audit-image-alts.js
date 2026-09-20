import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

function getFiles(dir, exts = ['.html', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        results = results.concat(getFiles(filePath, exts));
      }
    } else if (exts.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  }
  return results;
}

const allFiles = getFiles(ROOT_DIR);
console.log(`Auditing images across ${allFiles.length} files...`);

const report = [];

for (const f of allFiles) {
  const rel = path.relative(ROOT_DIR, f);
  const content = fs.readFileSync(f, 'utf8');

  // Match all <img> tags
  const imgRegex = /<img\s+([^>]*?)>/gi;
  let match;
  let imgIndex = 0;

  while ((match = imgRegex.exec(content)) !== null) {
    imgIndex++;
    const tag = match[0];
    const attrs = match[1];

    // Check src
    const srcMatch = attrs.match(/src=["']([^"']*)["']/i);
    const src = srcMatch ? srcMatch[1] : 'unknown';

    // Check alt
    const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
    if (!altMatch) {
      report.push({ file: rel, imgIndex, src, issue: 'Missing alt attribute entirely' });
    } else if (!altMatch[1].trim()) {
      report.push({ file: rel, imgIndex, src, issue: 'Empty alt attribute (alt="")' });
    } else {
      const altText = altMatch[1].trim();
      if (altText.length < 5 || ['image', 'photo', 'img', 'banner', 'pic'].includes(altText.toLowerCase())) {
        report.push({ file: rel, imgIndex, src, issue: `Low quality/non-descriptive alt: "${altText}"` });
      }
    }
  }

  // Also check JS dynamic img creation (e.g. document.createElement('img'), `<img ...`)
  if (f.endsWith('.js')) {
    const dynamicImgRegex = /<img\s+([^>]*?)>/gi;
    let dMatch;
    while ((dMatch = dynamicImgRegex.exec(content)) !== null) {
      const dAttrs = dMatch[1];
      if (!dAttrs.includes('alt=')) {
        report.push({ file: rel, issue: `Dynamic JS template <img> missing alt attribute: ${dMatch[0].slice(0, 60)}...` });
      }
    }
  }
}

console.log(`\nTotal Image Alt Tag Issues Found: ${report.length}`);
if (report.length > 0) {
  console.table(report);
} else {
  console.log('✓ All images across all files have descriptive, non-empty alt tags!');
}
