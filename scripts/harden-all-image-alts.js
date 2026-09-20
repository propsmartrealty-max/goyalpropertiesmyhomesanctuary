import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

console.log('--- Hardening Image Alt Tags across Entire Codebase ---');

// 1. Update js/gallery.js
const galleryJsPath = path.join(ROOT_DIR, 'js/gallery.js');
if (fs.existsSync(galleryJsPath)) {
  let content = fs.readFileSync(galleryJsPath, 'utf8');

  // Card image alt
  content = content.replace(
    'alt="${item.title}"\n            class="w-full h-full object-cover"',
    'alt="${item.title} - Goyal My Home Sanctuary, Mamurdi Pune West"\n            class="w-full h-full object-cover"'
  );

  // Lightbox image alt
  content = content.replace(
    'if (img) img.src = item.image;',
    'if (img) {\n    img.src = item.image;\n    img.alt = `${item.title} - Goyal My Home Sanctuary, Mamurdi Pune West`;\n  }'
  );

  fs.writeFileSync(galleryJsPath, content, 'utf8');
  console.log('✓ Hardened js/gallery.js image alt attributes');
}

// 2. Update js/main.js
const mainJsPath = path.join(ROOT_DIR, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
  let content = fs.readFileSync(mainJsPath, 'utf8');
  content = content.replace(
    'if (img) img.src = src;',
    'if (img) {\n    img.src = src;\n    img.alt = title ? `${title} - Goyal My Home Sanctuary Mamurdi` : "Goyal My Home Sanctuary Authentic Display Suite";\n  }'
  );
  fs.writeFileSync(mainJsPath, content, 'utf8');
  console.log('✓ Hardened js/main.js photo lightbox alt attributes');
}

// 3. Update index.html
const indexPath = path.join(ROOT_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');

  content = content.replaceAll(
    'alt="My Home Sanctuary Logo"',
    'alt="Goyal My Home Sanctuary Architectural Logo - Mamurdi Pune West"'
  );
  content = content.replaceAll(
    'alt="Goyal Properties Logo"',
    'alt="Goyal Properties - 38+ Years Built Trust Real Estate Developer Pune"'
  );
  content = content.replaceAll(
    'alt="Goyal Properties Developer Logo"',
    'alt="Goyal Properties Corporate Developer Logo - PCMC Pune"'
  );
  content = content.replaceAll(
    'alt="MahaRERA Registration Emblem"',
    'alt="MahaRERA Official Registration Seal - PR1261012502725 - Goyal My Home Sanctuary"'
  );
  content = content.replaceAll(
    'alt="MahaRERA Official QR Code PR1261012502725"',
    'alt="MahaRERA Verified QR Code PR1261012502725 - Government Certified Project"'
  );

  // Modals without src initially
  content = content.replace(
    'id="lightbox-img" src="" alt="Enlarged Showcase Photograph"',
    'id="lightbox-img" src="" alt="Goyal My Home Sanctuary Authentic Sample Flat Display Suite Showcase"'
  );
  content = content.replace(
    'id="gallery-lb-img" src="" alt="Enlarged Gallery Photograph"',
    'id="gallery-lb-img" src="" alt="Goyal My Home Sanctuary Architectural Elevation & Lifestyle Gallery Photograph"'
  );
  content = content.replace(
    'id="fullscreen-master-img" src="assets/images/scraped/master-plan.webp" alt="26-Acre Fullscreen Master Layout Plan"',
    'id="fullscreen-master-img" src="assets/images/scraped/master-plan.webp" alt="Sanctioned 26-Acre Biophilic Master Layout Plan - Goyal My Home Sanctuary Mamurdi"'
  );
  content = content.replace(
    'id="fullscreen-plan-img" src="" alt="High Resolution Floor Plan"',
    'id="fullscreen-plan-img" src="" alt="Sanctioned Architectural CAD Floor Plan - Goyal My Home Sanctuary"'
  );

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✓ Hardened index.html image alt attributes');
}

// 4. Update pages/2-bhk-flats-mamurdi.html and pages/3-bhk-flats-mamurdi.html
const twoBhkPath = path.join(ROOT_DIR, 'pages/2-bhk-flats-mamurdi.html');
if (fs.existsSync(twoBhkPath)) {
  let content = fs.readFileSync(twoBhkPath, 'utf8');
  content = content.replace(
    'alt="2 BHK Classic 638 Sq Ft Floor Plan"',
    'alt="2 BHK Classic 638 Sq Ft Sanctioned Architectural Floor Plan - Goyal My Home Sanctuary Mamurdi"'
  );
  content = content.replace(
    'alt="2 BHK Premier 704 Sq Ft Floor Plan"',
    'alt="2 BHK Premier 704 Sq Ft Sanctioned Architectural Floor Plan - Goyal My Home Sanctuary Mamurdi"'
  );
  content = content.replace(
    'alt="2 BHK Signature 760 Sq Ft Floor Plan"',
    'alt="2 BHK Signature 760 Sq Ft Corner Sanctioned Floor Plan - Goyal My Home Sanctuary Mamurdi"'
  );
  fs.writeFileSync(twoBhkPath, content, 'utf8');
  console.log('✓ Hardened pages/2-bhk-flats-mamurdi.html image alt attributes');
}

const threeBhkPath = path.join(ROOT_DIR, 'pages/3-bhk-flats-mamurdi.html');
if (fs.existsSync(threeBhkPath)) {
  let content = fs.readFileSync(threeBhkPath, 'utf8');
  content = content.replace(
    'alt="3 BHK Classic 848 Sq Ft Floor Plan"',
    'alt="3 BHK Classic 848 Sq Ft Sanctioned Architectural Floor Plan - Goyal My Home Sanctuary Mamurdi"'
  );
  content = content.replace(
    'alt="3 BHK Premier 924 Sq Ft Floor Plan"',
    'alt="3 BHK Premier 924 Sq Ft Sanctioned Floor Plan with Dining Alcove - Goyal My Home Sanctuary Mamurdi"'
  );
  content = content.replace(
    'alt="3 BHK Signature 1036 Sq Ft Floor Plan"',
    'alt="3 BHK Signature 1036 Sq Ft Sky Deck Sanctioned Floor Plan - Goyal My Home Sanctuary Mamurdi"'
  );
  fs.writeFileSync(threeBhkPath, content, 'utf8');
  console.log('✓ Hardened pages/3-bhk-flats-mamurdi.html image alt attributes');
}

// 5. Update pages/floor-plans-brochure.html
const floorPlanPath = path.join(ROOT_DIR, 'pages/floor-plans-brochure.html');
if (fs.existsSync(floorPlanPath)) {
  let content = fs.readFileSync(floorPlanPath, 'utf8');
  content = content.replaceAll(
    'CAD Floor Plan',
    'Sanctioned Architectural CAD Floor Plan - Goyal My Home Sanctuary Mamurdi'
  );
  fs.writeFileSync(floorPlanPath, content, 'utf8');
  console.log('✓ Hardened pages/floor-plans-brochure.html image alt attributes');
}

// 6. Update functions/market/[[slug]].js to include rich image in Hero and Hub
const marketPath = path.join(ROOT_DIR, 'functions/market/[[slug]].js');
if (fs.existsSync(marketPath)) {
  let content = fs.readFileSync(marketPath, 'utf8');

  // Insert hero showcase image in programmatic template if not already present
  if (!content.includes('hero-programmatic-img')) {
    const heroImageSnippet = `\n        <!-- Unit & Elevation Architectural Showcase Image -->\n` +
      `        <div class="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl mb-8 group">\n` +
      `          <img\n` +
      `            id="hero-programmatic-img"\n` +
      `            src="/assets/images/scraped/elevation-main.jpg"\n` +
      `            alt="\${config.name} at Goyal My Home Sanctuary in \${market.name}, Pune West - MIVAN High-Rise Tower"\n` +
      `            class="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"\n` +
      `            loading="eager"\n` +
      `            fetchpriority="high"\n` +
      `            decoding="async"\n` +
      `          />\n` +
      `          <div class="absolute inset-0 bg-gradient-to-t from-[#0c1410] via-transparent to-transparent opacity-80"></div>\n` +
      `          <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">\n` +
      `            <span class="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#d4af37] font-semibold border border-[#d4af37]/30">\n` +
      `              \${config.name} • \${config.carpet}\n` +
      `            </span>\n` +
      `            <span class="text-gray-300 font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm">\n` +
      `              MahaRERA: PR1261012502725\n` +
      `            </span>\n` +
      `          </div>\n` +
      `        </div>\n`;

    content = content.replace(
      '<!-- Quick Spec Matrix -->',
      `${heroImageSnippet}\n        <!-- Quick Spec Matrix -->`
    );

    fs.writeFileSync(marketPath, content, 'utf8');
    console.log('✓ Added high-converting showcase image with rich alt tag to functions/market/[[slug]].js');
  }
}

console.log('✓ All image alt tags have been hardened for Google Images SEO.');
