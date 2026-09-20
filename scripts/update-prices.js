import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

console.log('--- Updating Real Estate Prices across Goyal My Home Sanctuary ---');
console.log('Pricing Matrix:');
console.log('  638 sq.ft  -> ₹69 Lakhs*');
console.log('  704 sq.ft  -> ₹74 Lakhs*');
console.log('  760 sq.ft  -> ₹79 Lakhs*');
console.log('  848 sq.ft  -> ₹86 Lakhs*');
console.log('  924 sq.ft  -> ₹97 Lakhs*');
console.log('  1036 sq.ft -> ₹1.05 Cr*');

// 1. Update functions/market/[[slug]].js
const marketRouterPath = path.join(ROOT_DIR, 'functions/market/[[slug]].js');
let routerContent = fs.readFileSync(marketRouterPath, 'utf8');

routerContent = routerContent.replace(
  /'2-bhk-classic': { name: '2 BHK Classic', carpet: '638 - 745 sq.ft', price: '₹62 - 68 Lakhs\*'/,
  "'2-bhk-classic': { name: '2 BHK Classic', carpet: '638 - 745 sq.ft', price: '₹69 Lakhs\*'"
);
routerContent = routerContent.replace(
  /'2-bhk-premier': { name: '2 BHK Premier', carpet: '704 - 820 sq.ft', price: '₹71 - 77 Lakhs\*'/,
  "'2-bhk-premier': { name: '2 BHK Premier', carpet: '704 - 820 sq.ft', price: '₹74 Lakhs\*'"
);
routerContent = routerContent.replace(
  /'2-bhk-signature': { name: '2 BHK Signature', carpet: '760 - 895 sq.ft', price: '₹79 - 86 Lakhs\*'/,
  "'2-bhk-signature': { name: '2 BHK Signature', carpet: '760 - 895 sq.ft', price: '₹79 Lakhs\*'"
);
routerContent = routerContent.replace(
  /'3-bhk-classic': { name: '3 BHK Classic', carpet: '848 - 1045 sq.ft', price: '₹94 - 1.05 Cr\*'/,
  "'3-bhk-classic': { name: '3 BHK Classic', carpet: '848 - 1045 sq.ft', price: '₹86 Lakhs\*'"
);
routerContent = routerContent.replace(
  /'3-bhk-premier': { name: '3 BHK Premier', carpet: '924 - 1180 sq.ft', price: '₹1.08 - 1.18 Cr\*'/,
  "'3-bhk-premier': { name: '3 BHK Premier', carpet: '924 - 1180 sq.ft', price: '₹97 Lakhs\*'"
);
routerContent = routerContent.replace(
  /'3-bhk-signature': { name: '3 BHK Signature', carpet: '1036 - 1290 sq.ft', price: '₹1.22 - 1.35 Cr\*'/,
  "'3-bhk-signature': { name: '3 BHK Signature', carpet: '1036 - 1290 sq.ft', price: '₹1.05 Cr\*'"
);

fs.writeFileSync(marketRouterPath, routerContent, 'utf8');
console.log('✓ Updated functions/market/[[slug]].js');

// 2. Update scripts/generate-programmatic-matrix.js
const matrixScriptPath = path.join(ROOT_DIR, 'scripts/generate-programmatic-matrix.js');
let matrixContent = fs.readFileSync(matrixScriptPath, 'utf8');

matrixContent = matrixContent.replace(
  "{ id: '2-bhk-classic', name: '2 BHK Classic', carpet: '638 - 745 sq.ft', price: '₹62 - 68 Lakhs\*'",
  "{ id: '2-bhk-classic', name: '2 BHK Classic', carpet: '638 - 745 sq.ft', price: '₹69 Lakhs\*'"
);
matrixContent = matrixContent.replace(
  "{ id: '2-bhk-premier', name: '2 BHK Premier', carpet: '704 - 820 sq.ft', price: '₹71 - 77 Lakhs\*'",
  "{ id: '2-bhk-premier', name: '2 BHK Premier', carpet: '704 - 820 sq.ft', price: '₹74 Lakhs\*'"
);
matrixContent = matrixContent.replace(
  "{ id: '2-bhk-signature', name: '2 BHK Signature', carpet: '760 - 895 sq.ft', price: '₹79 - 86 Lakhs\*'",
  "{ id: '2-bhk-signature', name: '2 BHK Signature', carpet: '760 - 895 sq.ft', price: '₹79 Lakhs\*'"
);
matrixContent = matrixContent.replace(
  "{ id: '3-bhk-classic', name: '3 BHK Classic', carpet: '848 - 1045 sq.ft', price: '₹94 - 1.05 Cr\*'",
  "{ id: '3-bhk-classic', name: '3 BHK Classic', carpet: '848 - 1045 sq.ft', price: '₹86 Lakhs\*'"
);
matrixContent = matrixContent.replace(
  "{ id: '3-bhk-premier', name: '3 BHK Premier', carpet: '924 - 1180 sq.ft', price: '₹1.08 - 1.18 Cr\*'",
  "{ id: '3-bhk-premier', name: '3 BHK Premier', carpet: '924 - 1180 sq.ft', price: '₹97 Lakhs\*'"
);
matrixContent = matrixContent.replace(
  "{ id: '3-bhk-signature', name: '3 BHK Signature', carpet: '1036 - 1290 sq.ft', price: '₹1.22 - 1.35 Cr\*'",
  "{ id: '3-bhk-signature', name: '3 BHK Signature', carpet: '1036 - 1290 sq.ft', price: '₹1.05 Cr\*'"
);

fs.writeFileSync(matrixScriptPath, matrixContent, 'utf8');
console.log('✓ Updated scripts/generate-programmatic-matrix.js');

// 3. Update index.html
const indexPath = path.join(ROOT_DIR, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Meta description & twitter description
indexContent = indexContent.replaceAll('starting ₹62.50 L*', 'starting ₹69 L*');
indexContent = indexContent.replaceAll('from ₹62.50 L*', 'from ₹69 L*');
indexContent = indexContent.replaceAll('from ₹81.50 L*', 'from ₹86 L*');
indexContent = indexContent.replaceAll('Starts ₹62.5 L*', 'Starts ₹69 L*');
indexContent = indexContent.replaceAll('Starts ₹81.5 L*', 'Starts ₹86 L*');
indexContent = indexContent.replaceAll('₹62,50,000 - ₹1,03,00,000', '₹69,00,000 - ₹1,05,00,000');
indexContent = indexContent.replaceAll('₹62,50,000', '₹69,00,000');
indexContent = indexContent.replaceAll('₹62.50 Lakhs*', '₹69.00 Lakhs*');
indexContent = indexContent.replaceAll('₹62.50 Lakh*', '₹69.00 Lakh*');
indexContent = indexContent.replaceAll('₹81.50 Lakh*', '₹86.00 Lakh*');

// Residences Unit Breakdown Table in index.html
indexContent = indexContent.replace(
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">2 BHK Classic</span>\n                    <span class="text-[11px] text-espresso-600">638 sq. ft. (59.27 sq.m)</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹62.50 L*</span>\n                </div>`,
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">2 BHK Classic</span>\n                    <span class="text-[11px] text-espresso-600">638 sq. ft. (59.27 sq.m)</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹69.00 L*</span>\n                </div>`
);

indexContent = indexContent.replace(
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">2 BHK Premier</span>\n                    <span class="text-[11px] text-espresso-600">704 sq. ft. (65.40 sq.m)</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹69.00 L*</span>\n                </div>`,
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">2 BHK Premier</span>\n                    <span class="text-[11px] text-espresso-600">704 sq. ft. (65.40 sq.m)</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹74.00 L*</span>\n                </div>`
);

indexContent = indexContent.replace(
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">2 BHK Signature</span>\n                    <span class="text-[11px] text-espresso-600">760 sq. ft. (70.60 sq.m) Corner</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹74.50 L*</span>\n                </div>`,
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">2 BHK Signature</span>\n                    <span class="text-[11px] text-espresso-600">760 sq. ft. (70.60 sq.m) Corner</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹79.00 L*</span>\n                </div>`
);

indexContent = indexContent.replace(
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">3 BHK Classic</span>\n                    <span class="text-[11px] text-espresso-600">848 sq. ft. (78.78 sq.m)</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹81.50 L*</span>\n                </div>`,
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">3 BHK Classic</span>\n                    <span class="text-[11px] text-espresso-600">848 sq. ft. (78.78 sq.m)</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹86.00 L*</span>\n                </div>`
);

indexContent = indexContent.replace(
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">3 BHK Premier</span>\n                    <span class="text-[11px] text-espresso-600">924 sq. ft. (85.84 sq.m) + Dining</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹88.75 L*</span>\n                </div>`,
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">3 BHK Premier</span>\n                    <span class="text-[11px] text-espresso-600">924 sq. ft. (85.84 sq.m) + Dining</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹97.00 L*</span>\n                </div>`
);

indexContent = indexContent.replace(
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">3 BHK Signature Sky Suite</span>\n                    <span class="text-[11px] text-espresso-600">1,036 sq. ft. (96.24 sq.m) Deck</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹98.00 L*</span>\n                </div>`,
  `<div class="p-2.5 rounded-xl bg-white border border-beige-200 flex items-center justify-between">\n                  <div>\n                    <span class="font-bold text-espresso-950 block">3 BHK Signature Sky Suite</span>\n                    <span class="text-[11px] text-espresso-600">1,036 sq. ft. (96.24 sq.m) Deck</span>\n                  </div>\n                  <span class="font-mono font-bold text-bronze-700 text-xs">₹1.05 Cr*</span>\n                </div>`
);

// Update footer link in index.html
indexContent = indexContent.replace(
  '<a href="/2-bhk-flats-mamurdi" class="hover:text-amber-400">2 BHK Flats in Mamurdi (₹62.50 L*)</a>',
  '<a href="/2-bhk-flats-mamurdi" class="hover:text-amber-400">2 BHK Flats in Mamurdi (₹69.00 L*)</a>'
);

// Update FAQ in index.html
indexContent = indexContent.replaceAll('₹62.50 Lakh* to ₹74.50 Lakh*', '₹69.00 Lakh* to ₹79.00 Lakh*');
indexContent = indexContent.replaceAll('₹81.50 Lakh* to ₹1.03 Crore*', '₹86.00 Lakh* to ₹1.05 Crore*');

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('✓ Updated index.html');

// 4. Update pages/price-cost-sheet.html
const pricePagePath = path.join(ROOT_DIR, 'pages/price-cost-sheet.html');
let priceContent = fs.readFileSync(pricePagePath, 'utf8');

priceContent = priceContent.replaceAll('₹62.50 L*', '₹69.00 L*');
priceContent = priceContent.replaceAll('₹62.50 Lakh*', '₹69.00 Lakh*');
priceContent = priceContent.replaceAll('₹81.50 L*', '₹86.00 L*');
priceContent = priceContent.replaceAll('₹81.50 Lakh*', '₹86.00 Lakh*');

// Update Table rows in price-cost-sheet.html
priceContent = priceContent.replace(
  `<td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹69.00 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹6.25 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹43,500 / mo*</td>`,
  `<td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹69.00 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹6.90 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹48,000 / mo*</td>`
);

priceContent = priceContent.replace(
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">2 BHK Premier</td>\n              <td class="py-3.5 px-4 font-mono">704 sq. ft. (65.40 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹69.00 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹6.90 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹48,000 / mo*</td>`,
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">2 BHK Premier</td>\n              <td class="py-3.5 px-4 font-mono">704 sq. ft. (65.40 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹74.00 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹7.40 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹51,500 / mo*</td>`
);

priceContent = priceContent.replace(
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">2 BHK Signature</td>\n              <td class="py-3.5 px-4 font-mono">760 sq. ft. (70.60 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹74.50 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹7.45 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹51,800 / mo*</td>`,
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">2 BHK Signature</td>\n              <td class="py-3.5 px-4 font-mono">760 sq. ft. (70.60 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹79.00 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹7.90 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹54,950 / mo*</td>`
);

priceContent = priceContent.replace(
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">3 BHK Classic</td>\n              <td class="py-3.5 px-4 font-mono">848 sq. ft. (78.78 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹86.00 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹8.15 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹56,700 / mo*</td>`,
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">3 BHK Classic</td>\n              <td class="py-3.5 px-4 font-mono">848 sq. ft. (78.78 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹86.00 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹8.60 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹59,800 / mo*</td>`
);

priceContent = priceContent.replace(
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">3 BHK Premier</td>\n              <td class="py-3.5 px-4 font-mono">924 sq. ft. (85.84 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹88.75 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹8.87 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹61,800 / mo*</td>`,
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">3 BHK Premier</td>\n              <td class="py-3.5 px-4 font-mono">924 sq. ft. (85.84 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹97.00 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹9.70 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹67,450 / mo*</td>`
);

priceContent = priceContent.replace(
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">3 BHK Signature Sky Suite</td>\n              <td class="py-3.5 px-4 font-mono">1,036 sq. ft. (96.24 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹98.00 Lakh*</td>\n              <td class="py-3.5 px-4 font-mono">₹9.80 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹68,200 / mo*</td>`,
  `<td class="py-3.5 px-4 font-semibold text-espresso-950">3 BHK Signature Sky Suite</td>\n              <td class="py-3.5 px-4 font-mono">1,036 sq. ft. (96.24 sq.m)</td>\n              <td class="py-3.5 px-4 font-mono font-bold text-bronze-700">₹1.05 Cr*</td>\n              <td class="py-3.5 px-4 font-mono">₹10.50 Lakh</td>\n              <td class="py-3.5 px-4 font-mono">₹73,000 / mo*</td>`
);

fs.writeFileSync(pricePagePath, priceContent, 'utf8');
console.log('✓ Updated pages/price-cost-sheet.html');

// 5. Update pages/2-bhk-flats-mamurdi.html
const twoBhkPath = path.join(ROOT_DIR, 'pages/2-bhk-flats-mamurdi.html');
let twoBhkContent = fs.readFileSync(twoBhkPath, 'utf8');

twoBhkContent = twoBhkContent.replaceAll('from ₹62.50 L*', 'from ₹69.00 L*');
twoBhkContent = twoBhkContent.replaceAll('Starting ₹62.50 L*', 'Starting ₹69.00 L*');
twoBhkContent = twoBhkContent.replaceAll('starting ₹62.50 L*', 'starting ₹69.00 L*');
twoBhkContent = twoBhkContent.replaceAll('₹62.50 Lakh*', '₹69.00 Lakh*');
twoBhkContent = twoBhkContent.replaceAll('₹69.00 Lakh*', '₹74.00 Lakh*'); // Premier
twoBhkContent = twoBhkContent.replaceAll('₹74.50 Lakh*', '₹79.00 Lakh*'); // Signature
twoBhkContent = twoBhkContent.replaceAll('₹62,50,000 - ₹74,50,000', '₹69,00,000 - ₹79,00,000');

fs.writeFileSync(twoBhkPath, twoBhkContent, 'utf8');
console.log('✓ Updated pages/2-bhk-flats-mamurdi.html');

// 6. Update pages/3-bhk-flats-mamurdi.html
const threeBhkPath = path.join(ROOT_DIR, 'pages/3-bhk-flats-mamurdi.html');
let threeBhkContent = fs.readFileSync(threeBhkPath, 'utf8');

threeBhkContent = threeBhkContent.replaceAll('₹81.50 Lakh*', '₹86.00 Lakh*');
threeBhkContent = threeBhkContent.replaceAll('₹81.50 L*', '₹86.00 L*');
threeBhkContent = threeBhkContent.replaceAll('₹88.75 Lakh*', '₹97.00 Lakh*');
threeBhkContent = threeBhkContent.replaceAll('₹98.00 Lakh*', '₹1.05 Cr*');
threeBhkContent = threeBhkContent.replaceAll('₹94 - 1.05 Cr*', '₹86 Lakhs* - ₹1.05 Cr*');
threeBhkContent = threeBhkContent.replaceAll('₹94.00 L*', '₹86.00 L*');
threeBhkContent = threeBhkContent.replaceAll('₹94 Lakhs*', '₹86 Lakhs*');

fs.writeFileSync(threeBhkPath, threeBhkContent, 'utf8');
console.log('✓ Updated pages/3-bhk-flats-mamurdi.html');

// 7. Update 404.html, other pages and blogs
const allOtherFiles = [
  '404.html',
  'pages/floor-plans-brochure.html',
  'pages/pcmc-real-estate-market-guide.html',
  'pages/mamurdi-real-estate-flats.html',
  'pages/mamurdi-vs-ravet-kiwale-comparison.html',
  'pages/kiwale-real-estate-properties.html',
  'pages/hinjawadi-it-park-commute.html',
  'pages/mumbai-pune-expressway-connectivity.html',
  'blog/mamurdi-the-next-growth-corridor-pune-west.html',
  'blog/goyal-my-home-sanctuary-complete-buyers-guide.html',
  'blog/2bhk-3bhk-4bhk-duplex-flats-mamurdi-pune.html',
  'blog/pune-real-estate-market-forecast-2026.html'
];

for (const rel of allOtherFiles) {
  const p = path.join(ROOT_DIR, rel);
  if (!fs.existsSync(p)) continue;
  let txt = fs.readFileSync(p, 'utf8');
  txt = txt.replaceAll('₹62.50 L*', '₹69.00 L*');
  txt = txt.replaceAll('₹62.50 Lakh*', '₹69.00 Lakh*');
  txt = txt.replaceAll('₹62.50 Lakh', '₹69.00 Lakh');
  txt = txt.replaceAll('₹81.50 L*', '₹86.00 L*');
  txt = txt.replaceAll('₹81.50 Lakh*', '₹86.00 Lakh*');
  txt = txt.replaceAll('₹62.50 L* - ₹74.50 L*', '₹69.00 L* - ₹79.00 L*');
  fs.writeFileSync(p, txt, 'utf8');
  console.log(`✓ Updated prices in ${rel}`);
}
