import { onRequest as aiConcierge } from '../functions/api/ai-concierge.js';
import { onRequest as commuteCalc } from '../functions/api/commute-calculator.js';
import { onRequest as resoFeed } from '../functions/api/reso-feed.js';
import { onRequest as timezoneDesk } from '../functions/api/timezone-desk.js';

console.log('\n--- Testing Edge API Functions ---');

// Test 1: AI Concierge GET request
const req1 = new Request('https://goyalmyhomesanctuary.in/api/ai-concierge?q=2+bhk+classic+price', {
  method: 'GET'
});
const res1 = await aiConcierge({ request: req1, env: {} });
const data1 = await res1.json();

console.log(`[AI Concierge GET]: Status ${res1.status}, Time: ${data1.executionTimeMs}ms`);
console.log(`  Recommended Unit: ${data1.result.recommendedUnit.name} (${data1.result.recommendedUnit.price})`);
console.log(`  Answer preview: ${data1.result.answer.slice(0, 80)}...`);
console.log(`  WhatsApp Link: ${data1.result.directRouting.whatsapp.slice(0, 70)}...`);

if (res1.status !== 200 || !data1.result.recommendedUnit.name.includes('2 BHK Classic')) {
  console.error('✗ AI Concierge test 1 failed');
  process.exit(1);
}
console.log('  ✓ AI Concierge GET passed cleanly.');

// Test 2: AI Concierge POST request with 3 BHK Signature query
const req2 = new Request('https://goyalmyhomesanctuary.in/api/ai-concierge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Need presidential 3 bhk sky suite with valley views' })
});
const res2 = await aiConcierge({ request: req2, env: {} });
const data2 = await res2.json();

console.log(`[AI Concierge POST]: Status ${res2.status}, Time: ${data2.executionTimeMs}ms`);
console.log(`  Recommended Unit: ${data2.result.recommendedUnit.name} (${data2.result.recommendedUnit.price})`);

if (res2.status !== 200 || !data2.result.recommendedUnit.name.includes('3 BHK Signature')) {
  console.error('✗ AI Concierge test 2 failed');
  process.exit(1);
}
console.log('  ✓ AI Concierge POST passed cleanly.');

// Test 3: Commute Calculator GET request
const req3 = new Request('https://goyalmyhomesanctuary.in/api/commute-calculator', {
  method: 'GET'
});
const res3 = await commuteCalc({ request: req3, env: {} });
const data3 = await res3.json();

console.log(`[Commute Calculator]: Status ${res3.status}, Destinations: ${data3.totalDestinationsCalculated}, Time: ${data3.executionTimeMs}ms`);
const hinj1 = data3.destinations.find(d => d.id === 'hinjawadi-phase-1');
console.log(`  Hinjawadi Phase 1: Mamurdi ${hinj1.mamurdiMinutes} mins vs Wakad ${hinj1.wakadMinutes} mins (Annual Savings: ${hinj1.metrics.annualFuelSavingsInr})`);

if (res3.status !== 200 || data3.totalDestinationsCalculated < 8) {
  console.error('✗ Commute Calculator test failed');
  process.exit(1);
}
console.log('  ✓ Commute Calculator passed cleanly.');

// Test 4: RESO Data Dictionary v1.7 Property Feed
const req4 = new Request('https://goyalmyhomesanctuary.in/api/reso-feed', { method: 'GET' });
const res4 = await resoFeed({ request: req4, env: {} });
const data4 = await res4.json();

console.log(`[RESO Property Feed]: Status ${res4.status}, Listings: ${data4['@odata.count']}`);
console.log(`  Listing 1: ${data4.value[0].ListingKey} (${data4.value[0].LivingAreaRange}) - ₹${data4.value[0].ListPrice}`);

if (res4.status !== 200 || data4['@odata.count'] < 6 || !res4.headers.get('X-RESO-Data-Dictionary')) {
  console.error('✗ RESO Property Feed test failed');
  process.exit(1);
}
console.log('  ✓ RESO v1.7 Syndication Feed passed cleanly.');

// Test 5: International Time Zone Desk
const req5 = new Request('https://goyalmyhomesanctuary.in/api/timezone-desk?hub=dubai', { method: 'GET' });
const res5 = await timezoneDesk({ request: req5, env: {} });
const data5 = await res5.json();

console.log(`[Time Zone Desk]: Status ${res5.status}, Current IST: ${data5.currentTimeIST}`);
console.log(`  Dubai Window: ${data5.globalHubs[0].convenientWindowIST}`);

if (res5.status !== 200 || !data5.globalHubs[0].name.includes('Dubai')) {
  console.error('✗ Time Zone Desk test failed');
  process.exit(1);
}
console.log('  ✓ International Time Zone Desk passed cleanly.');

// Test 6: Dynamic Edge OpenGraph Generator
const { onRequest: ogGenerator } = await import('../functions/api/og.js');
const req6 = new Request('https://goyalmyhomesanctuary.in/api/og?market=Chinchwad&config=3+BHK+Premier&price=%E2%82%B997+Lakhs*', { method: 'GET' });
const res6 = await ogGenerator({ request: req6, env: {} });
const svgData = await res6.text();

console.log(`[Dynamic OG Generator]: Status ${res6.status}, Type: ${res6.headers.get('Content-Type')}, Size: ${svgData.length} bytes`);
if (res6.status !== 200 || !svgData.toLowerCase().includes('chinchwad') || !svgData.includes('PR1261012502725')) {
  console.error('✗ Dynamic OG Generator test failed');
  process.exit(1);
}
console.log('  ✓ Dynamic Edge OpenGraph Generator passed cleanly.');

// Test 7: Headless Lead Telemetry & Capture Webhook
const { onRequest: leadCapture } = await import('../functions/api/lead-capture.js');
const req7 = new Request('https://goyalmyhomesanctuary.in/api/lead-capture', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    intent: 'whatsapp-click',
    unitInterest: '3 BHK Signature',
    timezone: 'Asia/Dubai'
  })
});
const res7 = await leadCapture({ request: req7, env: {}, waitUntil: () => {} });
const data7 = await res7.json();

console.log(`[Lead Capture Webhook]: Status ${res7.status}, LeadId: ${data7.leadId}`);
if (res7.status !== 200 || !data7.leadId.startsWith('LEAD-')) {
  console.error('✗ Lead Capture Webhook test failed');
  process.exit(1);
}
console.log('  ✓ Headless Lead Webhook Dispatcher passed cleanly.');

console.log('\n✓ ALL 7 EDGE API TESTS PASSED SUCCESSFULLY!\n');

