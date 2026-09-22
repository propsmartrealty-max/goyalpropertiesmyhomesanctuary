import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

// 1. Fix Phone Numbers across all HTML, JS, and documentation files
function fixPhoneNumbers() {
  console.log('\n--- 1. Standardizing Phone Numbers to +91 91753 19441 (NAP Hardening) ---');
  const targetDirs = ['.', 'pages', 'blog', 'js'];
  let totalReplacements = 0;

  for (const relDir of targetDirs) {
    const dir = path.join(ROOT_DIR, relDir);
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith('.html') && !file.endsWith('.js') && file !== '_redirects') continue;
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;

      // Replace formats:
      // +91 77440 09295 -> +91 91753 19441
      // +917744009295 -> +919175319441
      // 917744009295 -> 919175319441
      content = content.replaceAll('+91 77440 09295', '+91 91753 19441');
      content = content.replaceAll('+917744009295', '+919175319441');
      content = content.replaceAll('917744009295', '919175319441');
      content = content.replaceAll('7744009295', '9175319441');

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated phone numbers in ${path.join(relDir, file)}`);
        totalReplacements++;
      }
    }
  }
  console.log(`Updated phone numbers in ${totalReplacements} files.`);
}

// 2. Add Twitter Cards to pages/*.html and blog/*.html where missing
function addMissingTwitterCards() {
  console.log('\n--- 2. Injecting Twitter Card Meta Tags across Pages & Blog Articles ---');
  const targetDirs = ['pages', 'blog'];
  let count = 0;

  for (const relDir of targetDirs) {
    const dir = path.join(ROOT_DIR, relDir);
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith('.html')) continue;
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');

      if (!content.includes('name="twitter:card"')) {
        // Extract og:title, og:description, og:image
        const titleMatch = content.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
        const descMatch = content.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
        const imgMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);

        const pageTitle = titleMatch ? titleMatch[1] : 'Goyal My Home Sanctuary Mamurdi';
        const pageDesc = descMatch ? descMatch[1] : 'Luxury 2 & 3 BHK flats in Mamurdi Pune West near Mumbai-Pune Expressway.';
        const pageImg = imgMatch ? imgMatch[1] : 'https://goyalmyhomesanctuary.in/assets/images/scraped/elevation-main.jpg';

        const twitterBlock = `\n  <!-- Twitter Card -->\n` +
          `  <meta name="twitter:card" content="summary_large_image" />\n` +
          `  <meta name="twitter:title" content="${pageTitle}" />\n` +
          `  <meta name="twitter:description" content="${pageDesc}" />\n` +
          `  <meta name="twitter:image" content="${pageImg}" />\n` +
          `  <meta name="twitter:image:alt" content="${pageTitle}" />\n`;

        // Insert after </meta> or right after Open Graph block
        if (content.includes('<!-- Open Graph -->') || content.includes('property="og:type"')) {
          const anchor = content.includes('property="og:type"')
            ? content.match(/<meta\s+property=["']og:type["'][^>]*\/>|<meta\s+property=["']og:type["'][^>]*>/i)[0]
            : content.match(/<meta\s+property=["']og:image["'][^>]*\/>|<meta\s+property=["']og:image["'][^>]*>/i)[0];
          
          content = content.replace(anchor, `${anchor}${twitterBlock}`);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✓ Added Twitter cards to ${path.join(relDir, file)}`);
          count++;
        }
      }
    }
  }
  console.log(`Injected Twitter cards into ${count} documents.`);
}

// 3. Optimize LCP image preload in index.html & Link /market in Nav and Footer
function optimizeIndexHtml() {
  console.log('\n--- 3. Optimizing index.html (LCP Image Preload & /market Link Equity) ---');
  const indexPath = path.join(ROOT_DIR, 'index.html');
  let content = fs.readFileSync(indexPath, 'utf8');

  // Add LCP image preload in head if missing
  if (!content.includes('as="image"')) {
    const lcpPreload = `\n  <!-- Google Core Web Vitals: High-Priority LCP Image Preload -->\n` +
      `  <link rel="preload" as="image" href="/assets/images/scraped/elevation-main.jpg" fetchpriority="high" />\n`;
    content = content.replace('<link rel="stylesheet" href="css/style.css" />', `${lcpPreload}  <link rel="stylesheet" href="css/style.css" />`);
    console.log(`✓ Injected LCP image preload into index.html`);
  }

  // Add Market Hub link to Desktop Navigation
  if (!content.includes('href="/market"')) {
    // Desktop Nav
    content = content.replace(
      '<a href="/blog" class="hover:text-bronze-600 transition-colors font-bold text-bronze-700">Journal</a>',
      '<a href="/market" class="hover:text-bronze-600 transition-colors font-bold text-bronze-700">Market Hub</a>\n        <a href="/blog" class="hover:text-bronze-600 transition-colors font-bold text-bronze-700">Journal</a>'
    );

    // Mobile Nav
    content = content.replace(
      '<a href="/blog" onclick="toggleMobileMenu()" class="text-espresso-800 hover:text-bronze-600 py-1.5 border-b border-beige-200 font-bold text-bronze-600">The Sanctuary Journal</a>',
      '<a href="/market" onclick="toggleMobileMenu()" class="text-espresso-800 hover:text-bronze-600 py-1.5 border-b border-beige-200 font-bold text-bronze-600">Pune Market Hub (5,000+ Permutations)</a>\n        <a href="/blog" onclick="toggleMobileMenu()" class="text-espresso-800 hover:text-bronze-600 py-1.5 border-b border-beige-200 font-bold text-bronze-600">The Sanctuary Journal</a>'
    );

    // Footer Links
    content = content.replace(
      '<li><a href="/price-cost-sheet" class="hover:text-amber-400">Official Cost Sheet &amp; EMI Matrix</a></li>',
      '<li><a href="/market" class="hover:text-amber-400 font-bold text-amber-300">Pune Real Estate Market Hub (5,000+ Permutations) ↗</a></li>\n              <li><a href="/price-cost-sheet" class="hover:text-amber-400">Official Cost Sheet &amp; EMI Matrix</a></li>'
    );

    console.log(`✓ Added /market link equity connections across desktop nav, mobile nav, and footer in index.html`);
  }

  fs.writeFileSync(indexPath, content, 'utf8');
}

// 4. Create Branded, SEO-Optimized 404.html
function create404Page() {
  console.log('\n--- 4. Creating Branded, Crawl-Equity Retaining 404.html ---');
  const notFoundPath = path.join(ROOT_DIR, '404.html');

  const html = `<!DOCTYPE html>
<html lang="en-IN" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  <title>Page Not Found (404) | Goyal My Home Sanctuary Mamurdi</title>
  <meta name="description" content="The requested page could not be found. Explore luxury 2 & 3 BHK flats, sanctioned floor plans, pricing cost sheets, and Pune market guides at Goyal My Home Sanctuary Mamurdi." />
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="https://goyalmyhomesanctuary.in/404" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            beige: { 50: '#faf8f5', 100: '#f5f1e8', 200: '#eee8dc', 300: '#e2d8c6', 400: '#d4c6af', 500: '#bfaf95' },
            espresso: { 950: '#14110e', 900: '#1e1a16', 800: '#2d2722', 700: '#423b34', 600: '#5c534a', 500: '#7a7065' },
            bronze: { 300: '#eccf94', 400: '#d4a648', 500: '#b88628', 600: '#966917', 700: '#7d5510' }
          },
          fontFamily: {
            display: ['"Cinzel"', 'serif'],
            interface: ['"Outfit"', 'sans-serif'],
            mono: ['"Space Grotesk"', 'monospace']
          }
        }
      }
    };
  </script>
</head>
<body class="bg-beige-100 text-espresso-900 font-interface min-h-screen flex flex-col justify-between">
  <!-- Top Navigation Header -->
  <header class="bg-beige-50/90 backdrop-blur-md border-b border-beige-300 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-bronze-600 text-white flex items-center justify-center font-display font-bold text-xl">S</div>
        <div>
          <span class="font-display text-base sm:text-lg font-bold tracking-wider text-espresso-950 block">GOYAL MY HOME SANCTUARY</span>
          <span class="text-[10px] font-mono text-bronze-600 uppercase font-semibold block">Mamurdi, Pune West</span>
        </div>
      </a>
      <div class="flex items-center gap-3">
        <a href="tel:+919175319441" class="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-bold text-espresso-900 hover:text-bronze-600">
          +91 91753 19441
        </a>
        <a href="/" class="px-4 py-2 rounded-xl bg-bronze-600 hover:bg-bronze-700 text-white font-mono text-xs font-bold transition">
          Return Home
        </a>
      </div>
    </div>
  </header>

  <!-- 404 Main Body -->
  <main class="max-w-4xl mx-auto px-4 py-16 text-center">
    <span class="inline-block px-3 py-1 rounded-full bg-bronze-300/40 text-bronze-700 text-xs font-mono font-bold uppercase tracking-widest mb-4">
      Error 404 • Destination Not Found
    </span>
    <h1 class="font-display text-4xl sm:text-6xl font-bold text-espresso-950 mb-4">
      Let Us Guide You Home
    </h1>
    <p class="text-espresso-700 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
      The address you requested does not exist or may have been updated to a new canonical URL. Explore our verified project guides below:
    </p>

    <!-- Quick Navigation Hub -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left mb-12">
      <a href="/market" class="p-5 rounded-2xl bg-white border border-beige-300 hover:border-bronze-500 shadow-sm hover:shadow-md transition">
        <span class="font-mono text-[10px] uppercase tracking-wider text-bronze-600 font-bold block">Programmatic Hub</span>
        <strong class="font-display text-base text-espresso-950 block mt-1">Pune Market Hub (5,000+ Permutations)</strong>
        <span class="text-xs text-espresso-600 block mt-1">Explore 10 micro-markets &amp; unit comparisons</span>
      </a>

      <a href="/price-cost-sheet" class="p-5 rounded-2xl bg-white border border-beige-300 hover:border-bronze-500 shadow-sm hover:shadow-md transition">
        <span class="font-mono text-[10px] uppercase tracking-wider text-bronze-600 font-bold block">Pricing &amp; Costs</span>
        <strong class="font-display text-base text-espresso-950 block mt-1">Official Price &amp; Cost Sheet</strong>
        <span class="text-xs text-espresso-600 block mt-1">2 &amp; 3 BHK pricing, stamp duty &amp; EMI matrix</span>
      </a>

      <a href="/floor-plans-brochure" class="p-5 rounded-2xl bg-white border border-beige-300 hover:border-bronze-500 shadow-sm hover:shadow-md transition">
        <span class="font-mono text-[10px] uppercase tracking-wider text-bronze-600 font-bold block">Architecture</span>
        <strong class="font-display text-base text-espresso-950 block mt-1">Sanctioned Floor Plans PDF</strong>
        <span class="text-xs text-espresso-600 block mt-1">CAD layouts from 638 to 1,036 sq.ft</span>
      </a>

      <a href="/2-bhk-flats-mamurdi" class="p-5 rounded-2xl bg-white border border-beige-300 hover:border-bronze-500 shadow-sm hover:shadow-md transition">
        <span class="font-mono text-[10px] uppercase tracking-wider text-bronze-600 font-bold block">Residences</span>
        <strong class="font-display text-base text-espresso-950 block mt-1">2 BHK Flats in Mamurdi</strong>
        <span class="text-xs text-espresso-600 block mt-1">Starting ₹62.50 L* with MIVAN engineering</span>
      </a>

      <a href="/3-bhk-flats-mamurdi" class="p-5 rounded-2xl bg-white border border-beige-300 hover:border-bronze-500 shadow-sm hover:shadow-md transition">
        <span class="font-mono text-[10px] uppercase tracking-wider text-bronze-600 font-bold block">Residences</span>
        <strong class="font-display text-base text-espresso-950 block mt-1">3 BHK Flats in Mamurdi</strong>
        <span class="text-xs text-espresso-600 block mt-1">Starting ₹94.00 L* with 270° sky deck</span>
      </a>

      <a href="/mumbai-pune-expressway-connectivity" class="p-5 rounded-2xl bg-white border border-beige-300 hover:border-bronze-500 shadow-sm hover:shadow-md transition">
        <span class="font-mono text-[10px] uppercase tracking-wider text-bronze-600 font-bold block">Transit</span>
        <strong class="font-display text-base text-espresso-950 block mt-1">Expressway Connectivity</strong>
        <span class="text-xs text-espresso-600 block mt-1">Zero-km expressway frontage &amp; bypass routes</span>
      </a>
    </div>

    <!-- Direct Assistance -->
    <div class="p-6 rounded-2xl bg-white border border-beige-300 inline-block text-left max-w-md w-full">
      <span class="text-xs font-mono font-bold text-bronze-600 block uppercase mb-1">Direct Sales Concierge</span>
      <p class="text-sm text-espresso-800 mb-3">Speak directly with our authorized sales advisors for immediate brochure and pricing assistance:</p>
      <div class="flex flex-col sm:flex-row gap-2">
        <a href="tel:+919175319441" class="flex-1 text-center py-2.5 px-4 rounded-xl bg-espresso-950 hover:bg-espresso-900 text-white font-mono text-xs font-bold transition">
          Call +91 91753 19441
        </a>
        <a href="https://wa.me/919175319441?text=Hello%20Goyal%20Properties,%20I%20am%20looking%20for%20information%20on%20Goyal%20My%20Home%20Sanctuary" target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-2.5 px-4 rounded-xl bg-bronze-600 hover:bg-bronze-700 text-white font-mono text-xs font-bold transition">
          WhatsApp Us
        </a>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-espresso-950 text-stone-300 py-8 border-t border-espresso-900 text-xs font-mono text-center">
    <p class="mb-1">Goyal My Home Sanctuary • Opp. Symbiosis Skills University, Mamurdi, PCMC Pune - 412101</p>
    <p>MahaRERA Registration No.: <strong class="text-amber-400">PR1261012502725 / P52100077438</strong> | Authorized Marketing by PropSmart Realty</p>
  </footer>
</body>
</html>`;

  fs.writeFileSync(notFoundPath, html, 'utf8');
  console.log(`✓ Created 404.html at ${notFoundPath}`);
}

// 5. Update Static market/index.html with full Directory Hub content
function updateStaticMarketHub() {
  console.log('\n--- 5. Updating static market/index.html with full Directory Hub HTML ---');
  // Read directory hub HTML directly from functions/market/[[slug]].js by evaluating or copying
  // We will load the generator script's MICRO_MARKETS and CONFIGURATIONS to build a complete static document
  const marketIndexPath = path.join(ROOT_DIR, 'market', 'index.html');
  
  // We can call functions/market/[[slug]].js onRequest with empty slug!
  import('../functions/market/[[slug]].js').then(async (mod) => {
    const req = new Request('https://goyalmyhomesanctuary.in/market');
    const res = await mod.onRequest({ request: req, params: { slug: [] } });
    const fullHtml = await res.text();
    fs.writeFileSync(marketIndexPath, fullHtml, 'utf8');
    console.log(`✓ Replaced market/index.html with full rich directory hub HTML (${(fullHtml.length / 1024).toFixed(2)} KB)`);
  }).catch(err => {
    console.error('Error updating market/index.html:', err);
  });
}

// Execute all hardening tasks
fixPhoneNumbers();
addMissingTwitterCards();
optimizeIndexHtml();
create404Page();
updateStaticMarketHub();
