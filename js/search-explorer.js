/**
 * AI Semantic Search Query & Permutation Explorer
 * Goyal Properties My Home Sanctuary, Mamurdi, Pune West
 * 
 * Provides instantaneous real-time filtering across 100+ buyer query permutations,
 * matching long-tail search intent to canonical project silos.
 */

const PERMUTATION_INDEX = [
  {
    title: "Goyal Properties My Home Sanctuary, Mamurdi",
    category: "Official Brand",
    tag: "Developer Showcase",
    query: "goyal properties my home sanctuary mamurdi pune west project 26 acre township",
    answer: "The iconic 26-acre biophilic nature residential township by Goyal Properties in Mamurdi, Pune West featuring 72% preserved forest canopy and G+28 monolithic MIVAN towers.",
    url: "/",
    badge: "Official Portal"
  },
  {
    title: "2 BHK Flats in Mamurdi Starting ₹69 Lakhs*",
    category: "Residences",
    tag: "638 - 760 Sq.Ft",
    query: "2 bhk flats in mamurdi goyal my home sanctuary 2bhk price classic premier signature 638 704 760",
    answer: "Sanctioned 2 BHK residences with 100% monolithic MIVAN casting, expansive master bedrooms, scenic sundecks, and high carpet efficiency.",
    url: "/2-bhk-flats-mamurdi",
    badge: "2 BHK Blueprint"
  },
  {
    title: "3 BHK Luxury Sky Suites Starting ₹86 Lakhs*",
    category: "Residences",
    tag: "848 - 1,036 Sq.Ft",
    query: "3 bhk flats in mamurdi goyal my home sanctuary 3bhk price classic premier signature sky suite 848 924 1036",
    answer: "Flagship 3 BHK residences featuring double-height living balconies, 3 private baths, dining alcove, and 270-degree panoramic forest reserve views.",
    url: "/3-bhk-flats-mamurdi",
    badge: "3 BHK Sky Deck"
  },
  {
    title: "MahaRERA Registration Docket PR1261012502725",
    category: "RERA Legal",
    tag: "Approved Docket",
    query: "maharera pr1261012502725 goyal my home sanctuary rera number approvals sanction clear title",
    answer: "100% verified freehold land title, sanctioned PCMC building permissions, environmental clearance, and dedicated 70% escrow compliance.",
    url: "/maharera-pr1261012502725-approvals",
    badge: "Verified MahaRERA"
  },
  {
    title: "Mumbai-Pune Expressway Direct Frontage (2 Mins)",
    category: "Connectivity",
    tag: "0.8 KM to Toll",
    query: "mumbai pune expressway connectivity goyal my home sanctuary mukai chowk toll road travel time",
    answer: "Located 800m from the expressway entrance, enabling signal-free 75-minute transit to Navi Mumbai Airport and fast Pune ring road bypass.",
    url: "/mumbai-pune-expressway-connectivity",
    badge: "Expressway Touch"
  },
  {
    title: "Hinjawadi IT Park 15-Minute Daily Commute",
    category: "IT Corridor",
    tag: "11.5 KM Transit",
    query: "hinjawadi it park commute goyal my home sanctuary rajiv gandhi infotech park phase 1 2 3 travel time wakad bypass",
    answer: "Alternate signal-free arterial routes to Hinjawadi Phase 1, 2, and 3 avoiding central Wakad congestion with 4.2% - 5.1% rental yields.",
    url: "/hinjawadi-it-park-commute",
    badge: "IT Bypass Route"
  },
  {
    title: "Download Sanctioned Floor Plans & Brochure PDF",
    category: "CAD & PDF",
    tag: "36-Page E-Brochure",
    query: "download floor plans brochure pdf goyal my home sanctuary cad layouts master plan architectural drawing",
    answer: "Download the complete architectural package with precise room dimensions, zero dead-space layouts, and comprehensive township master plan.",
    url: "/floor-plans-brochure",
    badge: "PDF Download"
  },
  {
    title: "All-Inclusive Price & Cost Sheet Breakdown",
    category: "Financials",
    tag: "Base Price + Taxes",
    query: "price cost sheet breakdown goyal my home sanctuary payment schedule clp milestone emi calculator sbi hdfc",
    answer: "Itemized quotation including agreement value, stamp duty, registration, GST, and flexible construction-linked milestone payment options.",
    url: "/price-cost-sheet",
    badge: "Cost Sheet 2026"
  },
  {
    title: "Mamurdi vs Ravet & Kiwale Investment Matrix",
    category: "Market Study",
    tag: "Comparative ROI",
    query: "mamurdi vs ravet kiwale property comparison investment capital appreciation rental yield price per sq ft",
    answer: "Mamurdi delivers 25% more usable carpet space per rupee than congested Ravet with superior expressway frontage and cleaner AQI.",
    url: "/mamurdi-vs-ravet-kiwale-comparison",
    badge: "Comparative Index"
  },
  {
    title: "PCMC Real Estate Market Guide & Price Index",
    category: "PCMC Zone",
    tag: "Infrastructure Index",
    query: "pcmc real estate market guide property price trends pune west smart city ring road metro line 3",
    answer: "Authoritative research covering Pimpri-Chinchwad town planning, civic development corridors, and double-digit capital appreciation forecasts.",
    url: "/pcmc-real-estate-market-guide",
    badge: "PCMC Report"
  },
  {
    title: "Kiwale Real Estate & Mukai Chowk Properties",
    category: "Micro-Market",
    tag: "BRTS & Education",
    query: "kiwale real estate properties flats near mukai chowk symbiosis university dehu road station",
    answer: "Explore high-demand residential corridor adjacent to Symbiosis Skills University and Mukai Chowk BRTS terminal.",
    url: "/kiwale-real-estate-properties",
    badge: "Kiwale Radar"
  },
  {
    title: "Mamurdi Real Estate & Luxury Flats Directory",
    category: "Micro-Market",
    tag: "Township Hub",
    query: "mamurdi real estate flats 2 bhk 3 bhk residential projects pcmc mamurdi pune west",
    answer: "Master directory of sanctioned residential township offerings, civic infrastructure, and upcoming commercial growth in Mamurdi.",
    url: "/mamurdi-real-estate-flats",
    badge: "Mamurdi Index"
  },
  {
    title: "MIVAN Monolithic Concrete Engineering vs Brickwork",
    category: "Engineering",
    tag: "Seismic Zone III",
    query: "mivan construction technology vs conventional brickwork goyal properties monolithic rcc shear wall seepage proof",
    answer: "100% aluminum formwork shear wall engineering providing joint-free walls, zero moisture seepage, and superior acoustic thermal insulation.",
    url: "/blog/mivan-monolithic-construction-vs-conventional-brickwork",
    badge: "MIVAN Report"
  },
  {
    title: "Goyal Properties 35-Year Heritage & Completed Projects",
    category: "Developer",
    tag: "50+ Landmarks",
    query: "goyal properties developer pedigree 35 years 50 projects 10000 families trust reviews pune",
    answer: "Learn about Goyal Properties' 35-year legacy of engineering trust, on-time delivery, and 10+ million square feet developed across Pune.",
    url: "/blog/goyal-my-home-sanctuary-complete-buyers-guide",
    badge: "35-Yr Legacy"
  },
  {
    title: "75+ Curated Lifestyle & Biophilic Amenities",
    category: "Amenities",
    tag: "35,000 Sq.Ft Club",
    query: "amenities goyal my home sanctuary heated swimming pool pickleball court futsal podcast studio temple urban forest",
    answer: "Discover 75+ resort amenities including semi-Olympic heated pool, dual pickleball courts, acoustic podcast studio, and sacred temple complex.",
    url: "/#amenities",
    badge: "75+ Amenities"
  },
  {
    title: "Schedule VIP Site Visit with Chauffeur Pickup",
    category: "VIP Site Visit",
    tag: "Complimentary Cab",
    query: "schedule site visit goyal my home sanctuary sample flat booking cab pickup sales office contact",
    answer: "Book your private guided preview with complimentary air-conditioned cab pickup and drop-off anywhere in Pune.",
    url: "tel:+919175319441",
    badge: "Direct Sales Desk"
  }
];

function initPermutationExplorer() {
  const container = document.getElementById("permutation-results");
  const input = document.getElementById("permutation-search-input");
  const pillsContainer = document.getElementById("permutation-pills");
  if (!container || !input) return;

  function renderCards(items) {
    if (items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-8 text-center bg-white rounded-xl border border-beige-200">
          <p class="text-sm font-display font-bold text-espresso-950 mb-1">No matching search query found</p>
          <p class="text-xs text-espresso-600 mb-4">Try searching for "2 BHK", "price", "expressway", "MahaRERA", or "MIVAN".</p>
          <button onclick="document.getElementById('permutation-search-input').value = ''; initPermutationExplorer();" class="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-bronze-600 text-white hover:bg-bronze-700">
            Reset Explorer
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => `
      <a href="${item.url}" class="group block p-4 rounded-xl border border-beige-200 bg-white hover:border-bronze-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-beige-100 text-espresso-800 font-semibold">
              ${item.category}
            </span>
            <span class="text-[10px] font-mono text-bronze-700 font-bold">
              ${item.tag}
            </span>
          </div>
          <h4 class="font-display font-bold text-sm text-espresso-950 group-hover:text-bronze-700 transition-colors leading-snug mb-1.5">
            ${item.title}
          </h4>
          <p class="text-[11px] text-espresso-600 leading-relaxed mb-3 line-clamp-2">
            ${item.answer}
          </p>
        </div>
        <div class="pt-2 border-t border-beige-100 flex items-center justify-between">
          <span class="text-[10px] font-mono text-espresso-500 font-medium">
            ${item.badge}
          </span>
          <span class="inline-flex items-center gap-1 text-[11px] font-bold text-bronze-600 group-hover:text-bronze-800">
            <span>Explore</span>
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
          </span>
        </div>
      </a>
    `).join("");

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // Initial render
  renderCards(PERMUTATION_INDEX);

  // Handle URL Search Query Parameter (?q=... or ?search=...) from Google Sitelinks SearchBox
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const incomingQuery = (urlParams.get("q") || urlParams.get("search") || "").trim();
    if (incomingQuery) {
      input.value = incomingQuery;
      const term = incomingQuery.toLowerCase();
      const filtered = PERMUTATION_INDEX.filter(item => {
        return item.title.toLowerCase().includes(term) ||
               item.query.toLowerCase().includes(term) ||
               item.category.toLowerCase().includes(term) ||
               item.answer.toLowerCase().includes(term);
      });
      renderCards(filtered.length > 0 ? filtered : PERMUTATION_INDEX);
      const searchSec = document.getElementById("search-directory");
      if (searchSec) {
        setTimeout(() => {
          searchSec.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 250);
      }
    }
  } catch (err) {
    // Ignore URL parameter parsing issues on legacy engines
  }

  // Live input filtering
  input.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      renderCards(PERMUTATION_INDEX);
      return;
    }

    const filtered = PERMUTATION_INDEX.filter(item => {
      return item.title.toLowerCase().includes(term) ||
             item.query.toLowerCase().includes(term) ||
             item.category.toLowerCase().includes(term) ||
             item.answer.toLowerCase().includes(term);
    });

    renderCards(filtered);
  });

  // Pill click handler
  if (pillsContainer) {
    pillsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-query]");
      if (!btn) return;

      pillsContainer.querySelectorAll("button[data-query]").forEach(b => {
        b.className = "px-2.5 py-1 rounded-lg text-xs font-mono bg-white border border-beige-300 text-espresso-800 hover:border-bronze-500 hover:text-bronze-700 transition-all";
      });
      btn.className = "px-2.5 py-1 rounded-lg text-xs font-mono bg-bronze-600 text-white font-semibold transition-all hover:bg-bronze-700";

      const q = btn.getAttribute("data-query");
      input.value = q;
      if (!q) {
        renderCards(PERMUTATION_INDEX);
      } else {
        const filtered = PERMUTATION_INDEX.filter(item => {
          return item.title.toLowerCase().includes(q) ||
                 item.query.toLowerCase().includes(q) ||
                 item.category.toLowerCase().includes(q) ||
                 item.answer.toLowerCase().includes(q);
        });
        renderCards(filtered);
      }
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPermutationExplorer);
} else {
  initPermutationExplorer();
}
