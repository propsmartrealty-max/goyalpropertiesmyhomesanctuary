import { onRequest } from '../functions/market/[[slug]].js';

async function testRoute(name, urlStr, params) {
  console.log(`\n--- Testing ${name} [${urlStr}] ---`);
  const req = new Request(urlStr, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Googlebot/2.1)' }
  });

  const t0 = performance.now();
  const res = await onRequest({ request: req, params });
  const t1 = performance.now();

  const body = await res.text();

  console.log(`Status: ${res.status}`);
  console.log(`Content-Type: ${res.headers.get('content-type')}`);
  console.log(`Execution Time: ${(t1 - t0).toFixed(2)}ms`);
  console.log(`HTML Size: ${(body.length / 1024).toFixed(2)} KB`);

  // Assertions
  const checks = [
    { label: 'Has DOCTYPE html', pass: body.includes('<!DOCTYPE html>') },
    { label: 'Has Schema.org JSON-LD', pass: body.includes('application/ld+json') },
    { label: 'Routes leads to propsmartrealty@gmail.com', pass: body.includes('propsmartrealty@gmail.com') },
    { label: 'Includes MahaRERA PR1261012502725', pass: body.includes('PR1261012502725') },
    { label: 'No hash fragments in breadcrumbs', pass: !body.match(/<ol[^>]*>.*?href="[^"]*#[^"]*".*?<\/ol>/s) }
  ];

  for (const c of checks) {
    console.log(`  ${c.pass ? '✓' : '✗'} ${c.label}`);
    if (!c.pass) throw new Error(`Assertion failed: ${c.label}`);
  }
}

async function run() {
  await testRoute('Directory Hub', 'https://goyalmyhomesanctuary.in/market', { slug: [] });
  await testRoute('Mamurdi 2 BHK Price', 'https://goyalmyhomesanctuary.in/market/mamurdi-2-bhk-classic-price-cost-sheet-it-professionals', { slug: ['mamurdi-2-bhk-classic-price-cost-sheet-it-professionals'] });
  await testRoute('Kiwale 3 BHK Plans', 'https://goyalmyhomesanctuary.in/market/kiwale-3-bhk-signature-floor-plans-brochure-families-top-schools', { slug: ['kiwale-3-bhk-signature-floor-plans-brochure-families-top-schools'] });
  await testRoute('PCMC 2 BHK Price', 'https://goyalmyhomesanctuary.in/market/pcmc-2-bhk-classic-price-cost-sheet-it-professionals', { slug: ['pcmc-2-bhk-classic-price-cost-sheet-it-professionals'] });
  await testRoute('Chinchwad 3 BHK Plans', 'https://goyalmyhomesanctuary.in/market/chinchwad-3-bhk-premier-floor-plans-brochure-families-top-schools', { slug: ['chinchwad-3-bhk-premier-floor-plans-brochure-families-top-schools'] });
  await testRoute('Nigdi 2 BHK Signature', 'https://goyalmyhomesanctuary.in/market/nigdi-2-bhk-signature-expressway-connectivity-expressway-commuters', { slug: ['nigdi-2-bhk-signature-expressway-connectivity-expressway-commuters'] });
  await testRoute('Akurdi 3 BHK Classic', 'https://goyalmyhomesanctuary.in/market/akurdi-3-bhk-classic-investment-appreciation-luxury-investors', { slug: ['akurdi-3-bhk-classic-investment-appreciation-luxury-investors'] });
  console.log('\n✓ ALL TESTS PASSED SUCCESSFULLY!\n');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
