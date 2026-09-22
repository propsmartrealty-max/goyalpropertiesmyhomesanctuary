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

// Test 8: Native Real User Metrics (RUM) Core Web Vitals
const { onRequest: vitalsReceiver } = await import('../functions/api/vitals.js');
const req8 = new Request('https://goyalmyhomesanctuary.in/api/vitals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'LCP',
    value: 1200,
    path: '/market/chinchwad-3-bhk-premier-floor-plans-brochure-families-top-schools'
  })
});
const res8 = await vitalsReceiver({ request: req8, env: {} });
const data8 = await res8.json();

console.log(`[RUM Web Vitals]: Status ${res8.status}, Metric: ${data8.metric}, Rating: ${data8.rating}`);
if (res8.status !== 200 || data8.rating !== 'good') {
  console.error('✗ RUM Web Vitals test failed');
  process.exit(1);
}
console.log('  ✓ Real User Metrics Core Web Vitals Endpoint passed cleanly.');

// Test 9: Live Inventory & Cloudflare KV API
const { onRequestGet: inventoryGet, onRequestPost: inventoryPost } = await import('../functions/api/inventory.js');
const req9Get = new Request('https://goyalmyhomesanctuary.in/api/inventory?type=3bhk');
const res9Get = await inventoryGet({ request: req9Get, env: {} });
const data9Get = await res9Get.json();

console.log(`[Live Inventory GET]: Status ${res9Get.status}, 3 BHK Units: ${data9Get.total_matching_units}, Available: ${data9Get.total_available_units}`);
if (res9Get.status !== 200 || data9Get.total_matching_units !== 3) {
  console.error('✗ Inventory GET test failed');
  process.exit(1);
}

const req9Post = new Request('https://goyalmyhomesanctuary.in/api/inventory', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    unit_code: '3BHK-SIG',
    customer_name: 'NRI Investor Dubai',
    customer_phone: '+971501234567'
  })
});
const res9Post = await inventoryPost({ request: req9Post, env: {} });
const data9Post = await res9Post.json();

console.log(`[Live Inventory POST]: Status ${res9Post.status}, Hold ID: ${data9Post.hold_id}`);
if (res9Post.status !== 200 || !data9Post.hold_id.startsWith('HOLD-')) {
  console.error('✗ Inventory POST test failed');
  process.exit(1);
}
console.log('  ✓ Live Inventory & KV State Endpoint passed cleanly.');

// Test 10: Solar Sunlight Trajectory & Vastu Compliance API
const { onRequestGet: solarVastuGet } = await import('../functions/api/solar-vastu.js');
const req10 = new Request('https://goyalmyhomesanctuary.in/api/solar-vastu?facing=east');
const res10 = await solarVastuGet({ request: req10, env: {} });
const data10 = await res10.json();

console.log(`[Solar & Vastu API]: Status ${res10.status}, Daylight: ${data10.solar_metrics.daylight_hours}h, Sunrise: ${data10.solar_metrics.sunrise}, Score: ${data10.vastu_analysis.composite_score}`);
if (res10.status !== 200 || !data10.vastu_analysis.composite_score.includes('98.7%')) {
  console.error('✗ Solar & Vastu test failed');
  process.exit(1);
}
console.log('  ✓ Solar Trajectory & Vedic Vastu Engine passed cleanly.');

// Test 11: Multi-Currency & NRI Purchasing Power API
const { onRequestGet: currencyGet } = await import('../functions/api/currency.js');
const req11 = new Request('https://goyalmyhomesanctuary.in/api/currency?amount=6900000&to=AED');
const res11 = await currencyGet({ request: req11 });
const data11 = await res11.json();

console.log(`[Currency API]: Status ${res11.status}, Converted: ${data11.formatted_display}, EMI: ${data11.nri_financing_estimate.formatted_emi}`);
if (res11.status !== 200 || data11.target_currency !== 'AED' || !data11.converted_amount) {
  console.error('✗ Currency API test failed');
  process.exit(1);
}
console.log('  ✓ Multi-Currency & NRI Financing Endpoint passed cleanly.');

// Test 12: VAPID Web Push Subscription API
const { onRequestGet: pushGet, onRequestPost: pushPost } = await import('../functions/api/push-subscribe.js');
const req12Get = new Request('https://goyalmyhomesanctuary.in/api/push-subscribe');
const res12Get = await pushGet();
const data12Get = await res12Get.json();

console.log(`[Web Push GET]: Status ${res12Get.status}, Key: ${data12Get.vapid_public_key.substring(0, 15)}...`);
if (res12Get.status !== 200 || !data12Get.vapid_public_key) {
  console.error('✗ Web Push GET test failed');
  process.exit(1);
}

const req12Post = new Request('https://goyalmyhomesanctuary.in/api/push-subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAAB...',
    keys: {
      p256dh: 'BIPUL1rIIslS8vTM54A3G84...',
      auth: 'n8z4wExtK2...'
    },
    topics: ['rera_milestones', 'construction_updates']
  })
});
const res12Post = await pushPost({ request: req12Post, env: {} });
const data12Post = await res12Post.json();

console.log(`[Web Push POST]: Status ${res12Post.status}, SubId: ${data12Post.subId}`);
if (res12Post.status !== 200 || !data12Post.subId.startsWith('SUB-')) {
  console.error('✗ Web Push POST test failed');
  process.exit(1);
}
console.log('  ✓ Native VAPID Web Push Subscription Endpoint passed cleanly.');

// Test 13: Maharashtra Stamp Duty & Total Cost Calculator API
const { onRequestGet: taxGet } = await import('../functions/api/tax-calculator.js');
const req13 = new Request('https://goyalmyhomesanctuary.in/api/tax-calculator?amount=6900000&female_owner=true');
const res13 = await taxGet({ request: req13 });
const data13 = await res13.json();

console.log(`[Tax Calculator API]: Status ${res13.status}, Statutory: ${data13.formatted_total_statutory}, Grand Total: ${data13.formatted_grand_total}`);
if (res13.status !== 200 || !data13.female_ownership_concession_applied || data13.statutory_breakdown.stamp_duty.total_stamp_duty_inr !== 345000) {
  console.error('✗ Tax Calculator API test failed');
  process.exit(1);
}
console.log('  ✓ Maharashtra Stamp Duty & Cost Engine passed cleanly.');

// Test 14: Edge High-Availability Health Probe API
const { onRequestGet: healthGet } = await import('../functions/api/health.js');
const req14 = new Request('https://goyalmyhomesanctuary.in/api/health');
const res14 = await healthGet({ request: req14, env: {} });
const data14 = await res14.json();

console.log(`[Health Probe API]: Status ${res14.status}, System Status: ${data14.status}, Latency: ${data14.probe_latency_ms}ms`);
if (res14.status !== 200 || data14.status !== 'healthy' || data14.services.programmatic_routes.total_routes !== 10240) {
  console.error('✗ Health Probe API test failed');
  process.exit(1);
}
console.log('  ✓ Edge Synthetic Health Probe Endpoint passed cleanly.');

// Test 15: PCMC Market Appreciation & Rental Yield Index API
const { onRequestGet: marketIndexGet } = await import('../functions/api/market-index.js');
const req15 = new Request('https://goyalmyhomesanctuary.in/api/market-index?type=2bhk&price=6900000');
const res15 = await marketIndexGet({ request: req15 });
const data15 = await res15.json();

console.log(`[Market Index API]: Status ${res15.status}, Gross Yield: ${data15.rental_yield_analysis.gross_rental_yield}, 10-Yr Multiple: ${data15.ten_year_wealth_projection.total_investment_multiple}`);
if (res15.status !== 200 || !data15.rental_yield_analysis.gross_rental_yield || !data15.cagr_track_record.historical_milestones) {
  console.error('✗ Market Index API test failed');
  process.exit(1);
}
console.log('  ✓ PCMC Market Capital Growth & Rental Yield Engine passed cleanly.');

// Test 16: Educational & Healthcare Transit Matrix API
const { onRequestGet: transitGet } = await import('../functions/api/transit-matrix.js');
const req16 = new Request('https://goyalmyhomesanctuary.in/api/transit-matrix?category=school');
const res16 = await transitGet({ request: req16 });
const data16 = await res16.json();

console.log(`[Transit Matrix API]: Status ${res16.status}, Filtered Schools: ${data16.total_institutions}`);
if (res16.status !== 200 || data16.total_institutions < 3) {
  console.error('✗ Transit Matrix API test failed');
  process.exit(1);
}
console.log('  ✓ Educational & Healthcare Transit Matrix Engine passed cleanly.');

// Test 17: IGBC Green Building & Carbon Footprint Telemetry API
const { onRequestGet: sustainabilityGet } = await import('../functions/api/sustainability.js');
const req17 = new Request('https://goyalmyhomesanctuary.in/api/sustainability?typology=3bhk-signature');
const res17 = await sustainabilityGet({ request: req17 });
const data17 = await res17.json();

console.log(`[Sustainability API]: Status ${res17.status}, Project: ${data17.project}, Typology: ${data17.typology_esg_assessment?.selected_typology}, CO2 Offset: ${data17.typology_esg_assessment?.household_annual_co2_offset_kg}kg`);
if (res17.status !== 200 || data17.community_metrics.landscaping.total_open_space_percentage !== 72 || !data17.typology_esg_assessment) {
  console.error('✗ Sustainability API test failed');
  process.exit(1);
}
console.log('  ✓ Green Building & Carbon Offset Telemetry Engine passed cleanly.');

// Test 18: Edge Bot Attribution & AI Crawler Telemetry API
const { onRequestGet: botTelemetryGet } = await import('../functions/api/bot-telemetry.js');
const req18 = new Request('https://goyalmyhomesanctuary.in/api/bot-telemetry?ua=Mozilla/5.0+(compatible;+GPTBot/1.2;+%2Bhttps://openai.com/gptbot)');
const res18 = await botTelemetryGet({ request: req18, env: {} });
const data18 = await res18.json();

console.log(`[Bot Telemetry API]: Status ${res18.status}, Category: ${data18.category}, Is AI: ${data18.is_ai_agent}, Bot: ${data18.bot_details?.name}`);
if (res18.status !== 200 || !data18.is_ai_agent || data18.bot_details?.provider !== 'OpenAI') {
  console.error('✗ Bot Telemetry API test failed');
  process.exit(1);
}
console.log('  ✓ Edge Bot Attribution & AI Crawler Telemetry passed cleanly.');

// Test 19: Construction Milestones & RERA Telemetry API
const { onRequestGet: milestonesGet } = await import('../functions/api/construction-milestones.js');
const req19 = new Request('https://goyalmyhomesanctuary.in/api/construction-milestones?tower=tower-a');
const res19 = await milestonesGet({ request: req19 });
const data19 = await res19.json();

console.log(`[Construction Milestones API]: Status ${res19.status}, Possession: ${data19.target_possession}, Tower: ${data19.tower?.name}, Progress: ${data19.tower?.progress_pct}%`);
if (res19.status !== 200 || !data19.tower || data19.target_possession !== 'December 2028') {
  console.error('✗ Construction Milestones API test failed');
  process.exit(1);
}
console.log('  ✓ Construction Milestones & RERA Telemetry Engine passed cleanly.');

// Test 20: Smart Amenity Capacity & Co-Working Scheduler API
const { onRequestGet: amenityCapacityGet } = await import('../functions/api/amenity-capacity.js');
const req20 = new Request('https://goyalmyhomesanctuary.in/api/amenity-capacity?amenity=coworking_pods');
const res20 = await amenityCapacityGet({ request: req20 });
const data20 = await res20.json();

console.log(`[Amenity Capacity API]: Status ${res20.status}, Amenity: ${data20.amenity?.name}, Available Pods: ${data20.amenity?.current_available_pods}`);
if (res20.status !== 200 || !data20.amenity || data20.amenity.current_available_pods < 1) {
  console.error('✗ Amenity Capacity API test failed');
  process.exit(1);
}
console.log('  ✓ Smart Co-Working & Clubhouse Amenity Capacity Engine passed cleanly.');

// Test 21: Multi-Unit Portfolio Optimization API
const { onRequestGet: portfolioGet } = await import('../functions/api/portfolio-optimizer.js');
const req21 = new Request('https://goyalmyhomesanctuary.in/api/portfolio-optimizer');
const res21 = await portfolioGet({ request: req21 });
const data21 = await res21.json();

console.log(`[Portfolio Optimizer API]: Status ${res21.status}, Strategy A Yield: ${data21.strategy_a_single_luxury.metrics.gross_rental_yield_pct}%, Strategy B Yield: ${data21.strategy_b_dual_portfolio.metrics.gross_rental_yield_pct}%`);
if (res21.status !== 200 || !data21.comparative_analysis || data21.strategy_b_dual_portfolio.metrics.units_count !== 2) {
  console.error('✗ Portfolio Optimizer API test failed');
  process.exit(1);
}
console.log('  ✓ Multi-Unit Portfolio Optimization Engine passed cleanly.');

// Test 22: Edge Cryptographic Lead Verification API
const { onRequestPost: verifyLeadPost } = await import('../functions/api/verify-lead.js');
const req22 = new Request('https://goyalmyhomesanctuary.in/api/verify-lead', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ leadId: 'LEAD-PROD-TEST-01', phone: '9822033333', name: 'Invest User', source: 'organic_nri' })
});
const res22 = await verifyLeadPost({ request: req22, env: {} });
const data22 = await res22.json();

console.log(`[Lead Verification API]: Status ${res22.status}, Seal: ${data22.tamper_proof_seal}, Token: ${data22.integrity_token?.slice(0, 16)}...`);
if (res22.status !== 200 || data22.status !== 'verified' || !data22.integrity_token) {
  console.error('✗ Lead Verification API test failed');
  process.exit(1);
}
console.log('  ✓ Edge Cryptographic Lead Verification passed cleanly.');

console.log('\n✓ ALL 22 EDGE API TESTS PASSED SUCCESSFULLY!\n');


