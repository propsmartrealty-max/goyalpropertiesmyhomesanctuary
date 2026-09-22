import { onRequest as aiConcierge } from '../functions/api/ai-concierge.js';
import { onRequest as commuteCalc } from '../functions/api/commute-calculator.js';

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

console.log('\n✓ ALL EDGE API TESTS PASSED SUCCESSFULLY!\n');
