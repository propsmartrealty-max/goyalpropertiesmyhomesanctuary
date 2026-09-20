/**
 * The Travertine Sanctuary - Architectural Residence Explorer
 * Interactive floor plans featuring authentic sanctioned architectural drawings (1955x1303),
 * CAD vector blueprints, metric switcher (Sq.Ft <-> Sq.M), and high-resolution zoom lightbox.
 */

let currentUnitMetric = "sqft";
let currentActivePlan = "2bhk-classic";
let currentPlanViewMode = "image"; // "image" or "cad"

const floorPlanMatrix = {
  "2bhk-classic": {
    name: "2 BHK Classic Sanctuary",
    type: "2 Bedroom • 2 Bath • Nature Sun Deck",
    carpetSqFt: 638,
    carpetSqM: 59.27,
    deckSqFt: 52,
    deckSqM: 4.83,
    totalSqFt: 690,
    totalSqM: 64.10,
    price: "₹62.50 Lakhs*",
    orientation: "East Facing • Forest Greens",
    image: "assets/images/scraped/plan-2bhk-classic-638.jpg",
    specs: [
      "Zero Dead Space layout with dedicated entry foyer",
      "Full-height acoustic double-glazed balcony slider",
      "Vastu-aligned master suite with morning sun orientation",
      "Integrated dry utility balcony adjoining gourmet kitchen"
    ],
    rooms: [
      { name: "Living & Formal Dining", dimFt: "11'0\" x 17'6\"", sqft: 192.5, sqm: 17.88 },
      { name: "Master Suite", dimFt: "11'0\" x 13'0\"", sqft: 143.0, sqm: 13.28 },
      { name: "Master Spa Bath", dimFt: "7'6\" x 4'6\"", sqft: 33.75, sqm: 3.13 },
      { name: "Bedroom 2 / Guest Suite", dimFt: "10'0\" x 11'0\"", sqft: 110.0, sqm: 10.21 },
      { name: "Common Bath", dimFt: "7'0\" x 4'6\"", sqft: 31.5, sqm: 2.92 },
      { name: "Gourmet Kitchen", dimFt: "8'0\" x 8'6\"", sqft: 68.0, sqm: 6.31 },
      { name: "Forest Sun Deck", dimFt: "10'6\" x 5'0\"", sqft: 52.5, sqm: 4.87 },
      { name: "Dry Utility Yard", dimFt: "4'0\" x 5'6\"", sqft: 22.0, sqm: 2.04 }
    ],
    svg: `
      <svg viewBox="0 0 700 460" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="archGrid1" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(140, 120, 95, 0.1)" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#faf8f4" />
        <rect width="100%" height="100%" fill="url(#archGrid1)" />
        <rect x="50" y="30" width="600" height="400" fill="none" stroke="#2c241d" stroke-width="3" rx="8"/>
        <rect x="54" y="34" width="592" height="392" fill="none" stroke="#d4a648" stroke-width="1.2"/>
        <rect x="60" y="40" width="310" height="225" fill="rgba(184, 134, 40, 0.07)" stroke="#b88628" stroke-width="1.5"/>
        <text x="215" y="140" fill="#1e1a16" font-size="15" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">LIVING &amp; DINING</text>
        <text x="215" y="165" fill="#875e12" font-size="12" font-family="'Space Grotesk', monospace" text-anchor="middle">11'0" x 17'6" • 192.5 SQ.FT</text>
        <rect x="60" y="265" width="310" height="75" fill="rgba(65, 106, 92, 0.12)" stroke="#416a5c" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="215" y="310" fill="#26463c" font-size="13" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="middle">FOREST SUN DECK (10'6" x 5'0")</text>
        <rect x="60" y="340" width="195" height="85" fill="rgba(30, 26, 22, 0.04)" stroke="#7a7065" stroke-width="1.2"/>
        <text x="157" y="388" fill="#1e1a16" font-size="13" font-family="'Outfit', sans-serif" font-weight="600" text-anchor="middle">KITCHEN</text>
        <rect x="255" y="340" width="115" height="85" fill="rgba(30, 26, 22, 0.03)" stroke="#7a7065" stroke-width="1"/>
        <text x="312" y="388" fill="#5c534a" font-size="11" font-family="'Space Grotesk', monospace" text-anchor="middle">UTILITY</text>
        <rect x="370" y="40" width="270" height="190" fill="rgba(184, 134, 40, 0.1)" stroke="#b88628" stroke-width="1.5"/>
        <text x="505" y="125" fill="#1e1a16" font-size="15" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">MASTER SUITE</text>
        <text x="505" y="150" fill="#875e12" font-size="12" font-family="'Space Grotesk', monospace" text-anchor="middle">11'0" x 13'0" • WOODEN FINISH</text>
        <rect x="510" y="230" width="130" height="95" fill="rgba(30, 26, 22, 0.04)" stroke="#7a7065" stroke-width="1"/>
        <text x="575" y="280" fill="#875e12" font-size="11" font-family="'Outfit', sans-serif" font-weight="600" text-anchor="middle">MASTER SPA</text>
        <rect x="370" y="230" width="140" height="195" fill="rgba(30, 26, 22, 0.05)" stroke="#7a7065" stroke-width="1.2"/>
        <text x="440" y="330" fill="#1e1a16" font-size="14" font-family="'Outfit', sans-serif" font-weight="600" text-anchor="middle">BEDROOM 2</text>
        <rect x="510" y="325" width="130" height="100" fill="rgba(30, 26, 22, 0.04)" stroke="#7a7065" stroke-width="1"/>
        <text x="575" y="380" fill="#5c534a" font-size="11" font-family="'Outfit', sans-serif" text-anchor="middle">COMMON BATH</text>
      </svg>
    `
  },

  "2bhk-premier": {
    name: "2 BHK Premier Sanctuary",
    type: "2 Bedroom • 2 Bath • Extended Living & Sun Deck",
    carpetSqFt: 704,
    carpetSqM: 65.40,
    deckSqFt: 56,
    deckSqM: 5.20,
    totalSqFt: 760,
    totalSqM: 70.60,
    price: "₹69.90 Lakhs*",
    orientation: "North-East Facing • Sunrise Garden",
    image: "assets/images/scraped/plan-2bhk-premier-704.jpg",
    specs: [
      "Extended living room proportions for larger family gatherings",
      "Expansive 56 sq.ft. private sunset deck overlooking canopy",
      "Dedicated shoe rack and designer foyer vestibule",
      "Provision for home automation and smart lighting hubs"
    ],
    rooms: [
      { name: "Grand Living & Dining", dimFt: "11'6\" x 18'6\"", sqft: 212.75, sqm: 19.76 },
      { name: "Master Suite with Niche", dimFt: "11'6\" x 13'6\"", sqft: 155.25, sqm: 14.42 },
      { name: "Master En-Suite Spa", dimFt: "8'0\" x 5'0\"", sqft: 40.0, sqm: 3.72 },
      { name: "Children's / Guest Suite", dimFt: "10'6\" x 11'6\"", sqft: 120.75, sqm: 11.22 },
      { name: "Family Common Bath", dimFt: "7'6\" x 4'6\"", sqft: 33.75, sqm: 3.13 },
      { name: "Granite Modular Kitchen", dimFt: "8'6\" x 9'0\"", sqft: 76.5, sqm: 7.11 },
      { name: "Nature Sun Deck", dimFt: "11'0\" x 5'0\"", sqft: 55.0, sqm: 5.11 },
      { name: "Covered Utility Yard", dimFt: "4'6\" x 5'6\"", sqft: 24.75, sqm: 2.30 }
    ],
    svg: `
      <svg viewBox="0 0 700 460" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="archGrid2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(140, 120, 95, 0.1)" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#faf8f4" />
        <rect width="100%" height="100%" fill="url(#archGrid2)" />
        <rect x="40" y="30" width="620" height="400" fill="none" stroke="#2c241d" stroke-width="3" rx="8"/>
        <rect x="44" y="34" width="612" height="392" fill="none" stroke="#d4a648" stroke-width="1.2"/>
        <rect x="50" y="40" width="330" height="230" fill="rgba(184, 134, 40, 0.08)" stroke="#b88628" stroke-width="1.5"/>
        <text x="215" y="140" fill="#1e1a16" font-size="15" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">PREMIER LIVING &amp; DINING</text>
        <text x="215" y="165" fill="#875e12" font-size="12" font-family="'Space Grotesk', monospace" text-anchor="middle">11'6" x 18'6" • 212.7 SQ.FT</text>
        <rect x="50" y="270" width="330" height="75" fill="rgba(65, 106, 92, 0.14)" stroke="#416a5c" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="215" y="315" fill="#26463c" font-size="13" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="middle">SUNSET DECK (11'0" x 5'0")</text>
        <rect x="380" y="40" width="270" height="200" fill="rgba(184, 134, 40, 0.1)" stroke="#b88628" stroke-width="1.5"/>
        <text x="515" y="130" fill="#1e1a16" font-size="15" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">MASTER SUITE</text>
        <rect x="380" y="240" width="140" height="185" fill="rgba(30, 26, 22, 0.05)" stroke="#7a7065" stroke-width="1.2"/>
        <text x="450" y="330" fill="#1e1a16" font-size="14" font-family="'Outfit', sans-serif" font-weight="600" text-anchor="middle">BEDROOM 2</text>
      </svg>
    `
  },

  "2bhk-signature": {
    name: "2 BHK Signature Sanctuary",
    type: "2 Bedroom • 2 Bath • Dual Balconies & Grand Foyer",
    carpetSqFt: 760,
    carpetSqM: 70.60,
    deckSqFt: 64,
    deckSqM: 5.95,
    totalSqFt: 824,
    totalSqM: 76.55,
    price: "₹74.80 Lakhs*",
    orientation: "Corner Unit • 270° Mountain Horizon",
    image: "assets/images/scraped/plan-2bhk-signature-760.jpg",
    specs: [
      "Corner residence offering 270-degree cross-breezes and complete privacy",
      "Private master bedroom balcony in addition to main living sun deck",
      "Dedicated walk-in wardrobe niche with direct bathroom connectivity",
      "Expanded L-shaped kitchen layout with double granite platform"
    ],
    rooms: [
      { name: "Corner Living & Dining", dimFt: "12'0\" x 19'0\"", sqft: 228.0, sqm: 21.18 },
      { name: "Master Suite + Private Deck", dimFt: "12'0\" x 14'0\"", sqft: 168.0, sqm: 15.61 },
      { name: "Master Spa Bathroom", dimFt: "8'6\" x 5'0\"", sqft: 42.5, sqm: 3.95 },
      { name: "Bedroom 2 / Study", dimFt: "11'0\" x 12'0\"", sqft: 132.0, sqm: 12.26 },
      { name: "Common Guest Bath", dimFt: "7'6\" x 5'0\"", sqft: 37.5, sqm: 3.48 },
      { name: "L-Shaped Gourmet Kitchen", dimFt: "9'0\" x 9'6\"", sqft: 85.5, sqm: 7.94 },
      { name: "Main Forest Sun Deck", dimFt: "12'0\" x 5'0\"", sqft: 60.0, sqm: 5.57 },
      { name: "Utility Yard", dimFt: "4'6\" x 6'0\"", sqft: 27.0, sqm: 2.51 }
    ],
    svg: `
      <svg viewBox="0 0 700 460" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#faf8f4" />
        <rect x="40" y="30" width="620" height="400" fill="none" stroke="#2c241d" stroke-width="3" rx="8"/>
        <rect x="50" y="40" width="330" height="230" fill="rgba(184, 134, 40, 0.1)" stroke="#b88628" stroke-width="1.5"/>
        <text x="215" y="140" fill="#1e1a16" font-size="15" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">SIGNATURE CORNER LIVING</text>
        <text x="215" y="165" fill="#875e12" font-size="12" font-family="'Space Grotesk', monospace" text-anchor="middle">12'0" x 19'0" • 228 SQ.FT</text>
        <rect x="50" y="270" width="330" height="75" fill="rgba(65, 106, 92, 0.14)" stroke="#416a5c" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="215" y="315" fill="#26463c" font-size="13" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="middle">270° FOREST DECK (12'0" x 5'0")</text>
        <rect x="380" y="40" width="270" height="200" fill="rgba(184, 134, 40, 0.12)" stroke="#b88628" stroke-width="1.5"/>
        <text x="515" y="130" fill="#1e1a16" font-size="15" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">MASTER SUITE + BALCONY</text>
      </svg>
    `
  },

  "3bhk-classic": {
    name: "3 BHK Classic Sanctuary",
    type: "3 Bedroom • 2 Bath • Wraparound Forest Deck",
    carpetSqFt: 848,
    carpetSqM: 78.78,
    deckSqFt: 72,
    deckSqM: 6.69,
    totalSqFt: 920,
    totalSqM: 85.47,
    price: "₹81.50 Lakhs*",
    orientation: "East Facing • Canopy Vista",
    image: "assets/images/scraped/plan-3bhk-classic-848.jpg",
    specs: [
      "Optimal 3 BHK layout providing independent bedrooms for kids and parents",
      "Deep sun deck extending from living room into the tree canopies",
      "Vastu-compliant East-facing entry with continuous morning natural light",
      "Concealed copper wiring with Schneider modular switches"
    ],
    rooms: [
      { name: "Living Pavilion & Dining", dimFt: "12'0\" x 20'0\"", sqft: 240.0, sqm: 22.30 },
      { name: "Master Suite", dimFt: "12'0\" x 14'0\"", sqft: 168.0, sqm: 15.61 },
      { name: "Master En-Suite", dimFt: "8'6\" x 5'0\"", sqft: 42.5, sqm: 3.95 },
      { name: "Bedroom 2 (Parents)", dimFt: "11'0\" x 12'6\"", sqft: 137.5, sqm: 12.77 },
      { name: "Bedroom 3 (Kids/Study)", dimFt: "10'6\" x 11'6\"", sqft: 120.75, sqm: 11.22 },
      { name: "Common Bathroom", dimFt: "7'6\" x 4'6\"", sqft: 33.75, sqm: 3.13 },
      { name: "Gourmet Kitchen", dimFt: "9'0\" x 10'0\"", sqft: 90.0, sqm: 8.36 },
      { name: "Canopy Sun Deck", dimFt: "13'0\" x 5'6\"", sqft: 71.5, sqm: 6.64 }
    ],
    svg: `
      <svg viewBox="0 0 700 460" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#faf8f4" />
        <rect x="35" y="20" width="630" height="420" fill="none" stroke="#2c241d" stroke-width="3" rx="8"/>
        <rect x="45" y="30" width="280" height="245" fill="rgba(184, 134, 40, 0.08)" stroke="#b88628" stroke-width="1.5"/>
        <text x="185" y="140" fill="#1e1a16" font-size="15" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">LIVING &amp; DINING PAVILION</text>
        <text x="185" y="165" fill="#875e12" font-size="12" font-family="'Space Grotesk', monospace" text-anchor="middle">12'0" x 20'0" • 240 SQ.FT</text>
        <rect x="45" y="275" width="280" height="75" fill="rgba(65, 106, 92, 0.12)" stroke="#416a5c" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="185" y="320" fill="#26463c" font-size="13" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="middle">CANOPY SUN DECK (13'0" x 5'6")</text>
        <rect x="325" y="30" width="200" height="190" fill="rgba(184, 134, 40, 0.1)" stroke="#b88628" stroke-width="1.5"/>
        <text x="425" y="120" fill="#1e1a16" font-size="14" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">MASTER SUITE</text>
        <rect x="525" y="30" width="135" height="190" fill="rgba(30, 26, 22, 0.04)" stroke="#7a7065" stroke-width="1.2"/>
        <text x="592" y="120" fill="#1e1a16" font-size="13" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">BEDROOM 2</text>
        <rect x="325" y="220" width="200" height="135" fill="rgba(30, 26, 22, 0.04)" stroke="#7a7065" stroke-width="1.2"/>
        <text x="425" y="285" fill="#1e1a16" font-size="13" font-family="'Outfit', sans-serif" font-weight="600" text-anchor="middle">BEDROOM 3</text>
      </svg>
    `
  },

  "3bhk-premier": {
    name: "3 BHK Premier Sanctuary",
    type: "3 Bedroom • 3 Bath • Dual En-Suites & Private Dining",
    carpetSqFt: 924,
    carpetSqM: 85.84,
    deckSqFt: 84,
    deckSqM: 7.80,
    totalSqFt: 1008,
    totalSqM: 93.65,
    price: "₹91.20 Lakhs*",
    orientation: "North-East Corner • Hill Skyline",
    image: "assets/images/scraped/plan-3bhk-premier-924.jpg",
    specs: [
      "Dual master suites equipped with private attached luxury spa bathrooms",
      "Spacious dining salon with dedicated bar counter / crockery console nook",
      "Large covered dry balcony with washing machine and dishwasher points",
      "Full height toughened glass deck railing offering seamless horizon views"
    ],
    rooms: [
      { name: "Grand Living Pavilion", dimFt: "13'0\" x 21'0\"", sqft: 273.0, sqm: 25.36 },
      { name: "Master Suite 1", dimFt: "12'6\" x 15'0\"", sqft: 187.5, sqm: 17.42 },
      { name: "Master Spa Bath 1", dimFt: "9'0\" x 5'6\"", sqft: 49.5, sqm: 4.60 },
      { name: "Master Suite 2", dimFt: "11'6\" x 13'6\"", sqft: 155.25, sqm: 14.42 },
      { name: "En-Suite Bath 2", dimFt: "8'0\" x 5'0\"", sqft: 40.0, sqm: 3.72 },
      { name: "Guest Bedroom 3", dimFt: "11'0\" x 12'0\"", sqft: 132.0, sqm: 12.26 },
      { name: "Powder / Common Bath", dimFt: "7'6\" x 4'6\"", sqft: 33.75, sqm: 3.13 },
      { name: "Chef Kitchen & Yard", dimFt: "9'6\" x 11'0\"", sqft: 104.5, sqm: 9.71 },
      { name: "Panoramic Sky Deck", dimFt: "14'0\" x 6'0\"", sqft: 84.0, sqm: 7.80 }
    ],
    svg: `
      <svg viewBox="0 0 700 460" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#faf8f4" />
        <rect x="35" y="20" width="630" height="420" fill="none" stroke="#2c241d" stroke-width="3" rx="8"/>
        <rect x="45" y="30" width="280" height="245" fill="rgba(184, 134, 40, 0.08)" stroke="#b88628" stroke-width="1.5"/>
        <text x="185" y="140" fill="#1e1a16" font-size="15" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">PREMIER 3 BHK LIVING</text>
        <text x="185" y="165" fill="#875e12" font-size="12" font-family="'Space Grotesk', monospace" text-anchor="middle">13'0" x 21'0" • 273 SQ.FT</text>
        <rect x="45" y="275" width="280" height="75" fill="rgba(65, 106, 92, 0.12)" stroke="#416a5c" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="185" y="320" fill="#26463c" font-size="13" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="middle">PANORAMIC SKY DECK (14'0" x 6'0")</text>
      </svg>
    `
  },

  "3bhk-signature": {
    name: "3 BHK Signature Presidential",
    type: "3 Bedroom • 3 Bath • Wraparound Sky Jacuzzi Deck",
    carpetSqFt: 1036,
    carpetSqM: 96.24,
    deckSqFt: 98,
    deckSqM: 9.10,
    totalSqFt: 1134,
    totalSqM: 105.35,
    price: "₹1.02 Crore*",
    orientation: "Highest Floor • 360° Hill & Sky Horizon",
    image: "assets/images/scraped/plan-3bhk-signature-1036.jpg",
    specs: [
      "Exclusive private biometric lift foyer access with zero common corridors",
      "Wraparound botanical sun deck with jacuzzi and outdoor lounge provision",
      "Imported Italian marble-finish vitrified tiles across living, dining & suites",
      "Integrated acoustic work-from-home executive office corner"
    ],
    rooms: [
      { name: "Royal Banquet Living Lounge", dimFt: "14'0\" x 22'6\"", sqft: 315.0, sqm: 29.26 },
      { name: "Presidential Master Suite", dimFt: "13'0\" x 16'0\"", sqft: 208.0, sqm: 19.32 },
      { name: "Master En-Suite Spa Bath", dimFt: "9'0\" x 6'0\"", sqft: 54.0, sqm: 5.02 },
      { name: "Executive Suite 2", dimFt: "12'0\" x 14'0\"", sqft: 168.0, sqm: 15.61 },
      { name: "Bedroom 3 / Office Studio", dimFt: "11'6\" x 12'6\"", sqft: 143.75, sqm: 13.35 },
      { name: "Gourmet Chef Kitchen", dimFt: "10'6\" x 12'0\"", sqft: 126.0, sqm: 11.71 },
      { name: "Private Biometric Foyer", dimFt: "7'6\" x 6'0\"", sqft: 45.0, sqm: 4.18 },
      { name: "Wraparound Sky Jacuzzi Deck", dimFt: "16'0\" x 6'0\"", sqft: 96.0, sqm: 8.92 }
    ],
    svg: `
      <svg viewBox="0 0 700 460" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#faf8f4" />
        <rect x="30" y="20" width="640" height="420" fill="none" stroke="#2c241d" stroke-width="3.5" rx="10"/>
        <rect x="40" y="30" width="310" height="250" fill="rgba(184, 134, 40, 0.12)" stroke="#b88628" stroke-width="2"/>
        <text x="195" y="140" fill="#1e1a16" font-size="16" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">ROYAL BANQUET LIVING</text>
        <text x="195" y="165" fill="#875e12" font-size="12" font-family="'Space Grotesk', monospace" text-anchor="middle">14'0" x 22'6" • 315 SQ.FT</text>
        <rect x="40" y="280" width="310" height="75" fill="rgba(65, 106, 92, 0.16)" stroke="#416a5c" stroke-width="1.8" stroke-dasharray="5,5"/>
        <text x="195" y="325" fill="#26463c" font-size="13" font-family="'Outfit', sans-serif" font-weight="700" text-anchor="middle">WRAPAROUND SKY JACUZZI DECK</text>
        <rect x="350" y="30" width="170" height="200" fill="rgba(184, 134, 40, 0.1)" stroke="#b88628" stroke-width="1.5"/>
        <text x="435" y="120" fill="#1e1a16" font-size="14" font-family="'Cinzel', serif" font-weight="700" text-anchor="middle">PRESIDENTIAL SUITE</text>
      </svg>
    `
  }
};

function renderActivePlan() {
  const data = floorPlanMatrix[currentActivePlan];
  if (!data) return;

  const isSqFt = currentUnitMetric === "sqft";

  const titleEl = document.getElementById("plan-title");
  if (titleEl) titleEl.textContent = data.name;

  const subEl = document.getElementById("plan-type-subtitle");
  if (subEl) subEl.textContent = data.type;

  const faceEl = document.getElementById("plan-facing");
  if (faceEl) faceEl.textContent = data.orientation;

  const priceEl = document.getElementById("plan-price");
  if (priceEl) priceEl.textContent = data.price;

  const carpetEl = document.getElementById("plan-carpet");
  if (carpetEl) carpetEl.textContent = isSqFt ? `${data.carpetSqFt} Sq. Ft.` : `${data.carpetSqM} Sq. M.`;

  const deckEl = document.getElementById("plan-deck");
  if (deckEl) deckEl.textContent = isSqFt ? `${data.deckSqFt} Sq. Ft.` : `${data.deckSqM} Sq. M.`;

  const usableEl = document.getElementById("plan-usable");
  if (usableEl) usableEl.textContent = isSqFt ? `${data.totalSqFt} Sq. Ft.` : `${data.totalSqM} Sq. M.`;

  const specsEl = document.getElementById("plan-highlights");
  if (specsEl) {
    specsEl.innerHTML = data.specs
      .map(
        (s) => `
        <li class="flex items-start gap-2.5 text-xs text-stone-700">
          <span class="w-1.5 h-1.5 rounded-full bg-bronze-500 mt-1.5 shrink-0"></span>
          <span>${s}</span>
        </li>
      `
      )
      .join("");
  }

  const tableEl = document.getElementById("plan-dimensions");
  if (tableEl) {
    tableEl.innerHTML = data.rooms
      .map(
        (r, i) => `
        <tr class="${i % 2 === 0 ? 'bg-stone-50' : 'bg-white'} border-b border-stone-200">
          <td class="py-2.5 px-3 text-xs font-semibold text-stone-900">${r.name}</td>
          <td class="py-2.5 px-3 text-xs font-mono text-stone-600">${r.dimFt}</td>
          <td class="py-2.5 px-3 text-xs font-mono text-amber-800 text-right font-bold">${isSqFt ? r.sqft + ' sq.ft.' : r.sqm + ' sq.m.'}</td>
        </tr>
      `
      )
      .join("");
  }

  // Render Display View (Actual Sanctioned Architectural Image or CAD Vector Blueprint)
  const displayEl = document.getElementById("plan-svg-container");
  if (displayEl) {
    if (currentPlanViewMode === "image") {
      displayEl.innerHTML = `
        <div class="relative w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center group overflow-hidden rounded-xl bg-white cursor-zoom-in" onclick="openFloorplanZoomModal()">
          <img
            src="${data.image}"
            alt="${data.name} Official Sanctioned Architectural Drawing"
            class="max-w-full max-h-[420px] object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 text-white">
            <span class="text-xs font-mono font-bold flex items-center gap-1.5 bg-espresso-950/80 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-bronze-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              Click to Inspect Fullscreen (1955x1303 High-Res)
            </span>
            <span class="text-[10px] font-mono uppercase tracking-widest bg-amber-600/90 px-2.5 py-1 rounded">
              Sanctioned Plan
            </span>
          </div>
        </div>
      `;
    } else {
      displayEl.innerHTML = `
        <div class="w-full flex items-center justify-center p-2">
          ${data.svg}
        </div>
      `;
    }
  }
}

function setPlanViewMode(mode) {
  currentPlanViewMode = mode;
  document.querySelectorAll("[data-plan-view-mode]").forEach((btn) => {
    if (btn.getAttribute("data-plan-view-mode") === mode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  renderActivePlan();
}

function openFloorplanZoomModal() {
  const data = floorPlanMatrix[currentActivePlan];
  if (!data) return;

  const modal = document.getElementById("floorplan-zoom-modal");
  const img = document.getElementById("zoom-plan-img");
  const title = document.getElementById("zoom-plan-title");
  const sub = document.getElementById("zoom-plan-sub");

  if (img) img.src = data.image;
  if (title) title.textContent = `${data.name} — Official Architectural Drawing`;
  if (sub) sub.textContent = `${data.carpetSqFt} Sq.Ft. Carpet • ${data.deckSqFt} Sq.Ft. Nature Deck • MahaRERA PR1261012502725`;

  if (modal) {
    modal.classList.add("open");
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeFloorplanZoomModal() {
  const modal = document.getElementById("floorplan-zoom-modal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const planButtons = document.querySelectorAll("[data-plan-target]");
  planButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      planButtons.forEach((b) => b.classList.remove("active", "font-bold", "bg-espresso-950", "text-white"));
      planButtons.forEach((b) => b.classList.add("text-espresso-600"));

      btn.classList.add("active", "font-bold", "bg-espresso-950", "text-white");
      btn.classList.remove("text-espresso-600");

      currentActivePlan = btn.getAttribute("data-plan-target");
      renderActivePlan();
    });
  });

  const metricButtons = document.querySelectorAll("[data-unit-metric]");
  metricButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      metricButtons.forEach((b) => b.classList.remove("active", "font-bold", "bg-espresso-950", "text-white"));
      metricButtons.forEach((b) => b.classList.add("text-espresso-600"));

      btn.classList.add("active", "font-bold", "bg-espresso-950", "text-white");
      btn.classList.remove("text-espresso-600");

      currentUnitMetric = btn.getAttribute("data-unit-metric");
      renderActivePlan();
    });
  });

  const viewModeButtons = document.querySelectorAll("[data-plan-view-mode]");
  viewModeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-plan-view-mode");
      setPlanViewMode(mode);
    });
  });

  renderActivePlan();
});
