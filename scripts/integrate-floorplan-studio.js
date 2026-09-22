/**
 * scripts/integrate-floorplan-studio.js
 * Injects the Interactive Architectural CAD Blueprint Studio into floor-plans-brochure.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const STUDIO_HTML = `    <!-- Interactive Architectural CAD Blueprint Studio & Comparison Switcher -->
    <section id="residences" class="rounded-3xl bg-white border border-beige-300 p-6 sm:p-10 shadow-lg space-y-8" role="region" aria-label="Interactive Residence Explorer">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-beige-200 pb-6">
        <div>
          <span class="text-xs font-mono uppercase tracking-[0.3em] text-bronze-600 font-bold block mb-1">
            Interactive CAD Blueprint Studio
          </span>
          <h2 class="font-display text-2xl sm:text-4xl font-bold text-espresso-950">
            Compare Sanctioned Floor Plans Side-by-Side
          </h2>
          <p class="text-espresso-700 text-xs sm:text-sm mt-2 max-w-xl">
            Switch between all 6 sanctioned unit configurations. Inspect exact RERA carpet areas, room dimensions, nature deck views, and download official blueprint PDFs.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- View Mode Switcher -->
          <div class="inline-flex p-1 rounded-full bg-beige-100 border border-beige-300 font-mono text-xs shadow-sm" role="group" aria-label="Plan View Mode">
            <button class="plan-view-btn px-3 py-1.5 rounded-full active transition-colors font-bold" data-plan-view-mode="image">Sanctioned Plan</button>
            <button class="plan-view-btn px-3 py-1.5 rounded-full transition-colors" data-plan-view-mode="cad">Vector CAD</button>
          </div>

          <!-- Metric Switcher -->
          <div class="inline-flex p-1 rounded-full bg-beige-100 border border-beige-300 font-mono text-xs shadow-sm" role="group" aria-label="Metric System Toggle">
            <button class="px-3 py-1.5 rounded-full active transition-colors font-bold" data-unit-metric="sqft">Sq. Ft.</button>
            <button class="px-3 py-1.5 rounded-full transition-colors text-espresso-600 font-medium" data-unit-metric="sqm">Sq. Meters</button>
          </div>
        </div>
      </div>

      <!-- Unit Selector Tabs (All 6 Authentic Configurations) -->
      <div class="flex flex-wrap p-1.5 rounded-2xl bg-beige-50 border border-beige-300 font-mono text-xs gap-1.5 shadow-sm max-w-full" role="group" aria-label="Residence Configuration Selector">
        <button class="px-3 py-1.5 rounded-full active transition-colors font-bold bg-espresso-950 text-white" data-plan-target="2bhk-classic">2 BHK Classic (638)</button>
        <button class="px-3 py-1.5 rounded-full transition-colors text-espresso-600 hover:bg-white" data-plan-target="2bhk-premier">2 BHK Premier (704)</button>
        <button class="px-3 py-1.5 rounded-full transition-colors text-espresso-600 hover:bg-white" data-plan-target="2bhk-signature">2 BHK Signature (760)</button>
        <button class="px-3 py-1.5 rounded-full transition-colors text-espresso-600 hover:bg-white" data-plan-target="3bhk-classic">3 BHK Classic (848)</button>
        <button class="px-3 py-1.5 rounded-full transition-colors text-espresso-600 hover:bg-white" data-plan-target="3bhk-premier">3 BHK Premier (924)</button>
        <button class="px-3 py-1.5 rounded-full transition-colors text-espresso-600 hover:bg-white" data-plan-target="3bhk-signature">3 BHK Signature (1036)</button>
      </div>

      <!-- Main Plan Matrix Container -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Plan & CAD Viewport -->
        <div class="lg:col-span-7 bg-beige-50 rounded-2xl p-4 sm:p-6 border border-beige-300 shadow-inner relative">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-beige-200 text-xs font-mono text-espresso-700">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span class="font-bold text-espresso-950">AUTHENTIC ARCHITECTURAL LAYOUT</span>
            </div>
            <button onclick="openFloorplanZoomModal()" class="text-bronze-600 hover:text-bronze-700 font-bold flex items-center gap-1">
              <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
              <span>Fullscreen Zoom (1955x1303)</span>
            </button>
          </div>

          <div id="plan-svg-container" class="min-h-[380px] sm:min-h-[440px] flex items-center justify-center bg-white rounded-xl border border-beige-200 p-2 overflow-hidden shadow-sm">
            <!-- Injected by floorplans.js -->
          </div>

          <div class="pt-3 mt-3 border-t border-beige-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-espresso-600">
            <span>*Sanctioned architectural drawing. MahaRERA: PR1261012502725</span>
            <span class="text-emerald-800 font-bold">100% MIVAN Monolithic Precision</span>
          </div>
        </div>

        <!-- Specifications Column -->
        <div class="lg:col-span-5 space-y-5 font-interface">
          <div>
            <div class="flex items-center justify-between">
              <span id="plan-facing" class="text-[11px] font-mono uppercase tracking-wider text-emerald-900 font-bold px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
                East Facing • Forest Greens
              </span>
              <span id="plan-price" class="font-mono text-2xl font-bold text-espresso-950">
                ₹69.00 Lakhs*
              </span>
            </div>
            <h3 id="plan-title" class="font-display text-2xl font-bold text-espresso-950 mt-2">
              2 BHK Classic Sanctuary
            </h3>
            <p id="plan-type-subtitle" class="text-xs font-mono text-bronze-600 font-semibold mt-1">
              2 Bedroom • 2 Bath • Nature Sun Deck
            </p>
          </div>

          <!-- Area Numbers Strip -->
          <div class="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-beige-50 border border-beige-200 text-center font-mono">
            <div>
              <span class="text-[10px] text-espresso-600 block uppercase font-bold">RERA Carpet</span>
              <span id="plan-carpet" class="text-sm sm:text-base font-bold text-espresso-950">638 Sq. Ft.</span>
            </div>
            <div class="border-x border-beige-200">
              <span class="text-[10px] text-espresso-600 block uppercase font-bold">Nature Deck</span>
              <span id="plan-deck" class="text-sm sm:text-base font-bold text-bronze-600">52 Sq. Ft.</span>
            </div>
            <div>
              <span class="text-[10px] text-espresso-600 block uppercase font-bold">Usable Space</span>
              <span id="plan-usable" class="text-sm sm:text-base font-bold text-emerald-800">690 Sq. Ft.</span>
            </div>
          </div>

          <!-- Highlights Checklist -->
          <div>
            <h4 class="text-[11px] font-mono uppercase tracking-widest text-espresso-700 font-bold mb-2">Architectural Highlights:</h4>
            <ul id="plan-highlights" class="space-y-1.5">
              <!-- Injected by floorplans.js -->
            </ul>
          </div>

          <!-- Dimension Matrix Table -->
          <div class="overflow-hidden rounded-xl border border-beige-300">
            <table class="w-full text-left">
              <thead class="bg-espresso-900 text-beige-100 text-[10px] font-mono uppercase tracking-wider">
                <tr>
                  <th class="py-2 px-3">Space</th>
                  <th class="py-2 px-3">Dimensions</th>
                  <th class="py-2 px-3 text-right">Area</th>
                </tr>
              </thead>
              <tbody id="plan-dimensions">
                <!-- Injected by floorplans.js -->
              </tbody>
            </table>
          </div>

          <!-- Direct 1-Click WhatsApp CTA with Dynamic Intent Pre-Fill -->
          <div class="pt-2">
            <a id="plan-whatsapp-cta" href="https://wa.me/919175319441?text=Hi%20Propsmart%20Realty%2C%20please%20share%20the%20official%20sanctioned%20PDF%20floor%20plan%20and%20cost%20sheet%20for%202%20BHK%20Classic%20Sanctuary%20(638%20sq.ft.)%20at%20Goyal%20My%20Home%20Sanctuary%20Mamurdi." target="_blank" rel="noopener noreferrer" class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.588 1.961.92 3.16.92 3.182 0 5.768-2.587 5.769-5.766.001-3.181-2.586-5.767-5.769-5.767zm7.558 5.766c-.001 4.168-3.391 7.558-7.559 7.558-1.332 0-2.58-.35-3.67-1.002l-4.108 1.077 1.097-4.008c-.732-1.144-1.127-2.477-1.127-3.855.001-4.168 3.392-7.558 7.56-7.558 4.168 0 7.559 3.391 7.56 7.558z"/></svg>
              <span>Instant WhatsApp Floor Plan &amp; Cost Sheet PDF</span>
            </a>
          </div>
        </div>

      </div>
    </section>`;

const ZOOM_MODAL_HTML = `  <!-- Floor Plan Fullscreen Zoom Lightbox Modal -->
  <div id="floorplan-zoom-modal" class="arch-modal-backdrop fixed inset-0 z-50 hidden flex items-center justify-center p-2 sm:p-6 bg-espresso-950/85 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Floor Plan Zoom Viewer">
    <div class="arch-modal-content bento-card border border-beige-300 w-full max-w-6xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl relative bg-white flex flex-col">
      <div class="p-4 sm:px-6 bg-beige-100 border-b border-beige-300 flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono uppercase tracking-widest text-bronze-600 font-bold block">
            OFFICIAL SANCTIONED ARCHITECTURAL DRAWING • 1955 x 1303 HIGH RESOLUTION
          </span>
          <h3 id="zoom-plan-title" class="font-display text-lg sm:text-xl font-bold text-espresso-950">
            Residence Floor Plan
          </h3>
          <p id="zoom-plan-sub" class="text-xs font-mono text-espresso-600 mt-0.5"></p>
        </div>
        <button onclick="closeFloorplanZoomModal()" class="text-espresso-600 hover:text-espresso-950 p-2 rounded-xl bg-white border border-beige-300 shadow-sm" aria-label="Close Floor Plan Viewer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <div class="flex-1 overflow-auto p-4 bg-stone-100 flex items-center justify-center min-h-[420px]">
        <img
          id="zoom-plan-img"
          src=""
          alt="High Resolution Floor Plan"
          class="max-w-full max-h-[72vh] object-contain rounded-xl shadow-lg border border-beige-200 bg-white p-2"
          width="1955"
          height="1303"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="p-4 sm:px-6 bg-white border-t border-beige-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-espresso-800">
        <div class="flex items-center gap-3">
          <span class="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-bronze-600 font-bold">MahaRERA: PR1261012502725</span>
          <span class="text-stone-600">Monolithic MIVAN Precision • Vastu-Aligned</span>
        </div>
        <div class="flex items-center gap-2">
          <a href="https://wa.me/919175319441?text=Hello%20Goyal%20Properties,%20please%20send%20the%20official%20high-res%20blueprint%20PDF" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-bronze-600 hover:bg-bronze-700 text-white font-bold text-xs flex items-center gap-1.5">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>Download High-Res PDF</span>
          </a>
        </div>
      </div>
    </div>
  </div>`;

const targets = [
  'floor-plans-brochure.html',
  'pages/floor-plans-brochure.html'
];

for (const relPath of targets) {
  const filePath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('id="residences"')) {
    console.log(`Already has residences studio: ${relPath}`);
    continue;
  }

  // Insert before <!-- 6 Unit CAD Blueprints Grid -->
  const targetMarker = '<!-- 6 Unit CAD Blueprints Grid -->';
  if (content.includes(targetMarker)) {
    content = content.replace(targetMarker, `${STUDIO_HTML}\n\n    ${targetMarker}`);
  }

  // Insert zoom modal before </body>
  if (!content.includes('id="floorplan-zoom-modal"')) {
    content = content.replace('</body>', `${ZOOM_MODAL_HTML}\n  <script src="/js/floorplans.js"></script>\n</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Integrated Interactive Floor Plan Studio into ${relPath}`);
}
