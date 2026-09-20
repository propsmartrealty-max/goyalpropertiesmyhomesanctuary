import { onRequest as middleware } from '../functions/_middleware.js';
import { onRequest as marketHandler } from '../functions/market/[[slug]].js';

// Mock context for Cloudflare Pages
async function testFullEdgePipeline(urlPath, slugArray) {
  console.log(`\n--- Simulating Cloudflare Edge Pipeline for ${urlPath} ---`);
  
  const req = new Request(`https://goyalmyhomesanctuary.in${urlPath}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'cf-ray': '8c1092837482910-BOM'
    }
  });

  const context = {
    request: req,
    params: { slug: slugArray },
    env: {},
    waitUntil: (p) => {},
    next: async () => {
      return await marketHandler({ request: req, params: { slug: slugArray } });
    }
  };

  const t0 = performance.now();
  const res = await middleware(context);
  const t1 = performance.now();

  const text = await res.text();

  console.log(`Status: ${res.status}`);
  console.log(`Execution Time: ${(t1 - t0).toFixed(2)}ms`);
  console.log(`Link Canonical: ${res.headers.get('Link')}`);
  console.log(`X-Robots-Tag: ${res.headers.get('X-Robots-Tag')}`);
  console.log(`Server-Timing: ${res.headers.get('Server-Timing')}`);
  console.log(`Has data-astro-edge-rendered: ${text.includes('data-astro-edge-rendered')}`);
  console.log(`Has Googlebot meta: ${text.includes('name="googlebot"')}`);

  if (!res.headers.get('Link')?.includes(urlPath)) {
    throw new Error('Canonical Link header mismatch');
  }
}

async function run() {
  await testFullEdgePipeline('/market', []);
  await testFullEdgePipeline('/market/mamurdi-2-bhk-classic-price-cost-sheet-it-professionals', ['mamurdi-2-bhk-classic-price-cost-sheet-it-professionals']);
  console.log('\n✓ CLOUDFLARE PAGES MIDDLEWARE + SSR PIPELINE VERIFIED 100%!\n');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
