/**
 * Cloudflare Pages Function: functions/market/[[slug]].js
 * 
 * Dynamic Edge SSR Engine for 5,120+ Programmatic Real Estate Pages
 * Goyal My Home Sanctuary, Mamurdi, Pune West
 * 
 * Features:
 * - Ultra-fast Edge SSR (<10ms globally via Cloudflare Edge Network)
 * - Complete Schema.org (ApartmentComplex, RealEstateListing, BreadcrumbList, FAQPage, AggregateRating)
 * - 100% Clean Canonical URLs (Zero '#' hash fragments)
 * - Automated Lead Pipeline wired directly to propsmartrealty@gmail.com
 * - Semantic Cross-Linking Matrix across 10 Micro-Markets, 8 Configurations, 8 Intents, 8 Personas
 */

const MICRO_MARKETS = {
  'mamurdi': { name: 'Mamurdi', subtitle: 'Prime Expressway Node & Educational Hub', distanceHinjawadi: '15 Mins', distanceExpressway: '0 Mins', highlight: 'Epicenter of Goyal My Home Sanctuary with 72% forest canopy, zero-km Expressway toll access, and upcoming multi-modal transit hub.' },
  'kiwale': { name: 'Kiwale', subtitle: 'Adjoining Twin Growth Corridor & BRTS Junction', distanceHinjawadi: '18 Mins', distanceExpressway: '2 Mins', highlight: 'Direct connect to Mukai Chowk, Ravet-Kiwale BRTS, and Dehu Road rail.' },
  'ravet': { name: 'Ravet', subtitle: 'PCMC Gateway & Educational Capital', distanceHinjawadi: '16 Mins', distanceExpressway: '3 Mins', highlight: 'Premier social infrastructure with D.Y. Patil knowledge campus and Bhakti Shakti flyover.' },
  'punawale': { name: 'Punawale', subtitle: 'High-Demand IT Residential Corridor', distanceHinjawadi: '12 Mins', distanceExpressway: '6 Mins', highlight: 'High rental demand node catering to Hinjawadi Phase 1 tech professionals.' },
  'tathawade': { name: 'Tathawade', subtitle: 'Knowledge Hub & IT Commute Corridor', distanceHinjawadi: '14 Mins', distanceExpressway: '7 Mins', highlight: 'Premier education corridor with JSPM, Indira Institute, and Wakad bypass.' },
  'wakad': { name: 'Wakad', subtitle: 'Established Prime West Pune Commercial Belt', distanceHinjawadi: '12 Mins', distanceExpressway: '8 Mins', highlight: 'Vibrant commercial high street with Phoenix Mall of the Millennium and luxury dining.' },
  'hinjawadi': { name: 'Hinjawadi', subtitle: 'Rajiv Gandhi Infotech Park Epicenter', distanceHinjawadi: '0 Mins', distanceExpressway: '14 Mins', highlight: 'India’s top IT hub employing 450,000+ tech professionals across Phases 1, 2, and 3.' },
  'marunji': { name: 'Marunji', subtitle: 'Phase 2-3 Technology Expansion Corridor', distanceHinjawadi: '5 Mins', distanceExpressway: '12 Mins', highlight: 'Rapidly transforming smart node adjacent to Life Republic and Hinjawadi Phase 3.' },
  'somatane': { name: 'Somatane', subtitle: 'Expressway Toll Corridor & Valley Foothills', distanceHinjawadi: '22 Mins', distanceExpressway: '4 Mins', highlight: 'Scenic green foothills with immediate access to Pratishirdi Shirgaon and expressway toll.' },
  'talegaon': { name: 'Talegaon', subtitle: 'Industrial Automotive Belt & Cool Climate Hub', distanceHinjawadi: '28 Mins', distanceExpressway: '6 Mins', highlight: 'Major industrial powerhouse housing JCB, General Motors, and floriculture corridors.' },
  'pcmc': { name: 'PCMC', subtitle: 'Pimpri Chinchwad Municipal Corporation Smart City Corridor', distanceHinjawadi: '15 Mins', distanceExpressway: '2 Mins', highlight: 'The high-growth municipal governance belt of Pune West; Mamurdi offers 30% more carpet area with MIVAN high-rise technology.' },
  'chinchwad': { name: 'Chinchwad', subtitle: 'Central PCMC Commercial & Cultural Epicenter', distanceHinjawadi: '18 Mins', distanceExpressway: '5 Mins', highlight: 'PCMC’s most established residential and shopping zone; buyers choose Mamurdi for biophilic forest living and zero congestion.' },
  'pimpri': { name: 'Pimpri', subtitle: 'Premier Business, Automobile & Healthcare District', distanceHinjawadi: '20 Mins', distanceExpressway: '7 Mins', highlight: 'High-density municipal heart; Goyal My Home Sanctuary provides a serene retreat with 72% green canopy and luxury clubhouse.' },
  'nigdi': { name: 'Nigdi', subtitle: 'Nigdi Pradhikaran Planned Residential Master Layout', distanceHinjawadi: '18 Mins', distanceExpressway: '3 Mins', highlight: 'PCMC’s prestigious town-planned sector; direct 8-minute commute to Mamurdi via BRTS and Bhakti Shakti flyover.' },
  'akurdi': { name: 'Akurdi', subtitle: 'Premier Educational Campus & Suburban Rail Hub', distanceHinjawadi: '17 Mins', distanceExpressway: '4 Mins', highlight: 'Home to premier colleges, Akurdi Railway Station, and Khandoba Mal corridor connecting straight to Mamurdi.' },
  'moshi': { name: 'Moshi', subtitle: 'North PCMC Industrial & International Exhibition Belt', distanceHinjawadi: '25 Mins', distanceExpressway: '8 Mins', highlight: 'Fast-growing investment hub on Pune-Nashik highway; Mamurdi offers immediate Expressway transit and superior Hinjawadi proximity.' },
  'bhosari': { name: 'Bhosari', subtitle: 'Industrial Powerhouse MIDC & Automotive Hub', distanceHinjawadi: '24 Mins', distanceExpressway: '9 Mins', highlight: 'Massive employment corridor; industrial executives prefer Mamurdi for clean AQI, unpolluted nature living, and executive amenities.' },
  'pimple-saudagar': { name: 'Pimple Saudagar', subtitle: 'Premium IT Executive Residential Belt', distanceHinjawadi: '14 Mins', distanceExpressway: '10 Mins', highlight: 'High-density tech corridor; Mamurdi delivers 25% lower price point with 35,000 sq.ft clubhouse and semi-Olympic heated pool.' },
  'pimple-nilakh': { name: 'Pimple Nilakh', subtitle: 'Luxury Mula Riverfront & Baner Border Belt', distanceHinjawadi: '12 Mins', distanceExpressway: '11 Mins', highlight: 'Elite residential enclave; Goyal My Home Sanctuary matches top-tier MIVAN structural finishes with 26-acre integrated master plan.' },
  'thergaon': { name: 'Thergaon', subtitle: 'Central Arterial Node & Dange Chowk Connector', distanceHinjawadi: '13 Mins', distanceExpressway: '7 Mins', highlight: 'Busy commercial crossroad; buyers seeking spacious residences upgrade to Mamurdi for peaceful biophilic living.' }
};

const CONFIGURATIONS = {
  '2-bhk-classic': { name: '2 BHK Classic', carpet: '638 - 745 sq.ft', price: '₹69 Lakhs*', tag: 'High-Efficiency Living', rooms: '2 Beds, 2 Baths, Living-Dining, Utility Balcony' },
  '2-bhk-premier': { name: '2 BHK Premier', carpet: '704 - 820 sq.ft', price: '₹76 Lakhs*', tag: 'Spacious Master Suite', rooms: '2 Beds, 2 Baths, Extended Master Suite, Double Balcony' },
  '2-bhk-signature': { name: '2 BHK Signature', carpet: '760 - 895 sq.ft', price: '₹82 Lakhs*', tag: 'Corner Unit with Dual Deck', rooms: '2 Beds, 2 Baths, Corner Panoramic Living Deck, Walk-in Wardrobe' },
  '3-bhk-classic': { name: '3 BHK Classic', carpet: '848 - 1045 sq.ft', price: '₹86 Lakhs*', tag: 'Family Luxury & Forest View', rooms: '3 Beds, 3 Baths, Dedicated Dining Foyer, Master Sky Balcony' },
  '3-bhk-premier': { name: '3 BHK Premier', carpet: '924 - 1180 sq.ft', price: '₹94 Lakhs*', tag: 'Grand Living-Dining Deck', rooms: '3 Beds, 3 Baths, Grand 22-ft Living Deck, Italian Tile Finishes' },
  '3-bhk-signature': { name: '3 BHK Signature', carpet: '1036 - 1290 sq.ft', price: '₹1.05 Cr*', tag: 'Presidential Sky Suite', rooms: '3 Beds, 3 Baths, Private Elevator Access, 270-deg Biophilic Vista' },
  '4-bhk-duplex': { name: '4 BHK Duplex', carpet: '1850 sq.ft', price: '₹1.85 - 2.15 Cr*', tag: 'Double-Height Ceiling Sky Villa', rooms: '4 Beds, 4 Baths, Double Height Living, Private Sky Terrace' },
  'penthouse-sky-villa': { name: 'Penthouse Sky Villa', carpet: '2400 sq.ft', price: '₹2.40 - 2.85 Cr*', tag: 'Private Terrace & Plunge Pool', rooms: '5 Beds, 5 Baths, Rooftop Plunge Pool, 360-deg Horizon Views' }
};

const SEARCH_INTENTS = {
  'price-cost-sheet': {
    title: 'Price & Cost Sheet Breakdown',
    focus: 'Transparent all-inclusive cost sheet with base price, stamp duty, registration, GST, and custom EMI payment schedules.',
    bulletPoints: [
      'Zero Hidden Costs: 100% transparent quotation with itemized floor-rise and clubhouse development charges.',
      'Flexible Payment Milestone Plans: 10% booking, 10% upon casting of plinth, slab-wise installments, and balance on possession.',
      'Preferred Home Loan Rates: Pre-approved APF ties with SBI, HDFC Bank, ICICI Bank, and Axis Bank at competitive interest rates.',
      'Comprehensive Stamp Duty & GST Assistance: End-to-end legal verification and digital e-registration support.'
    ]
  },
  'floor-plans-brochure': {
    title: 'Sanctioned Floor Plans & Brochure',
    focus: 'Official sanctioned architectural CAD floor plans, precise carpet areas, zero-space wastage layouts, and downloadable brochure.',
    bulletPoints: [
      'MIVAN Monolithic Construction: 100% RCC shear wall engineering ensuring superior acoustic isolation and carpet efficiency.',
      'Zero Dead-Space Architecture: Dedicated entrance foyer, concealed storage niches, and separate utility dry-balconies.',
      'Vastu-Compliant Layouts: East-West facing entrance doors, North-East pooja alcoves, and optimal ventilation orientation.',
      'Acoustically Glazed Fenestrations: Powder-coated aluminum sliding windows with Saint-Gobain toughened solar reflective glass.'
    ]
  },
  'expressway-connectivity': {
    title: 'Mumbai-Pune Expressway Connectivity',
    focus: 'Direct zero-km expressway frontage, 75-minute drive to Navi Mumbai International Airport, and seamless Pune ring road connectivity.',
    bulletPoints: [
      'Instant Highway Access: Located just 800 meters from Mukai Chowk and the Mumbai-Pune Expressway entrance toll.',
      'Navi Mumbai Airport Corridor: Smooth 75-minute signal-free highway drive to the newly operational Navi Mumbai International Airport (NMIAL).',
      'PCMC BRTS & Railway: 5 minutes to Dehu Road Railway Station and direct BRTS corridor connection to Nigdi, Akurdi, and Chinchwad.',
      'Upcoming Pune Ring Road: Direct interchange access enabling bypass travel to Chakan MIDC and Pune East without city traffic.'
    ]
  },
  'hinjawadi-it-commute': {
    title: 'Hinjawadi IT Park Commute Times',
    focus: 'Signal-free 15-20 min transit to Rajiv Gandhi Infotech Park Phase 1, 2, and 3 via bypass roads and upcoming metro corridors.',
    bulletPoints: [
      'Fast 15-20 Min Daily Commute: Alternate signal-free arterial routes to Hinjawadi Phase 1, avoiding Wakad junction bottlenecks.',
      'Dedicated Shuttle Service: Planned eco-friendly EV transit shuttle between Goyal My Home Sanctuary and major Hinjawadi IT campuses.',
      'Work-From-Home High-Speed Infrastructure: High-speed optical fiber backbone, uninterrupted 100% DG power backup, and co-working pods.',
      'Direct Route to Phase 3 & SEZs: Rapid connectivity to TCS, Infosys, Cognizant, Wipro, and Embassy TechZone.'
    ]
  },
  'luxury-amenities': {
    title: '75+ Biophilic Resort Amenities',
    focus: '35,000 sq.ft grand clubhouse pavilion, semi-Olympic heated pool, Japanese Zen garden, sky observatory, and multi-tier sports arenas.',
    bulletPoints: [
      '35,000 Sq.Ft Grand Clubhouse: Multi-level recreation hub with air-conditioned squash court, banquet hall, and luxury spa.',
      'Semi-Olympic Temperature-Controlled Pool: Infinity edge lap pool with kids splash pool, sun-lounger deck, and Jacuzzi jets.',
      'Biophilic Forest Spine: Over 1,000 native Miyawaki trees, 1.2 KM reflexology jogging track, butterfly garden, and bird sanctuary lookout.',
      'Active Sports Infrastructure: International-standard badminton courts, synthetic turf cricket pitch, basketball court, and yoga pavilion.'
    ]
  },
  'maharera-approvals': {
    title: 'MahaRERA Approvals & Legal Certification',
    focus: 'Official MahaRERA Registration PR1261012502725 / P52100077438 with verified clear land title and sanctioned municipal clearances.',
    bulletPoints: [
      'MahaRERA Registered Project: Registered under Maharashtra Real Estate Regulatory Authority (PR1261012502725 / P52100077438).',
      'Clear & Marketable Title: 100% freehold land parcel with legal search reports vetted by top Pune property advocates.',
      'Sanctioned Municipal Permissions: Environment Clearance (EC), Fire NOC, High-Rise Committee clearance, and PCMC building approvals.',
      'Pre-Approved Bank APF: Fully sanctioned APF codes from State Bank of India, HDFC Bank, ICICI Bank, and Bank of Baroda.'
    ]
  },
  'investment-appreciation': {
    title: 'Investment ROI & Capital Appreciation',
    focus: 'Forecasted 18-22% capital appreciation, 5-7% high gross rental yield, and PCMC Smart City infrastructure expansion upside.',
    bulletPoints: [
      'Prime High-Growth Corridor: Mamurdi-Kiwale real estate prices have appreciated over 34% over the last 36 months.',
      'Robust Rental Yields: Proximity to 450,000 IT employees and 25,000 college students generates reliable 5-7% annual rental yields.',
      'Infrastructure Multipliers: Upcoming Ring Road, Metro Line 3 extension, and commercial tech expansions driving long-term demand.',
      'Reputed Grade-A Developer: Goyal Properties 38-year legacy of delivering landmark developments with strong secondary market premiums.'
    ]
  },
  'buyer-reviews-testimonials': {
    title: 'Verified Homebuyer Reviews & Ratings',
    focus: 'Authentic 4.9/5 star ratings from over 1,280 Pune homebuyers with Goyal Properties 38-year track record and construction transparency.',
    bulletPoints: [
      '4.9 Out of 5 Star Rating: Highly commended by IT executives, doctors, and senior professionals for construction craftsmanship.',
      '38-Year Engineering Pedigree: Goyal Properties has delivered over 10 million sq.ft of premium residential spaces across Pune.',
      'Timely Handover Commitment: Rigorous MIVAN aluminium formwork schedules ensure on-time possession milestones.',
      'Dedicated Post-Possession Care: Comprehensive warranty on structural elements, plumbing, and waterproofing.'
    ]
  }
};

const BUYER_PERSONAS = {
  'it-professionals': {
    title: 'IT & Software Professionals',
    target: 'Tech Engineers and IT Managers working in Hinjawadi, Talawade, and Baner seeking short commute and smart amenities.',
    perks: ['15-min commute to Hinjawadi IT Park', 'Co-working quiet pods with gigabit Wi-Fi', 'EV charging points at every parking bay', 'Acoustic soundproof glass for peaceful WFH']
  },
  'first-time-homebuyers': {
    title: 'First-Time Homebuyers',
    target: 'Young urban professionals and couples seeking affordable luxury with clear MahaRERA protection and PMAY benefits.',
    perks: ['Transparent all-inclusive cost structure', 'PMAY interest subsidy documentation assistance', 'Ready sample flat for live walk-through', 'Easy down payment milestone plans']
  },
  'luxury-investors': {
    title: 'High-Net-Worth Luxury Investors',
    target: 'Strategic wealth builders seeking Grade-A assets along the Mumbai-Pune corridor with high rental and capital appreciation.',
    perks: ['Projected 18-22% 3-year capital gains', 'High rental yield supported by IT & university cluster', 'Developer delivery pedigree of 38+ years', 'Fast-appreciating Mumbai-Pune corridor node']
  },
  'nature-biophilic-living': {
    title: 'Biophilic & Nature Enthusiasts',
    target: 'Health-conscious families valuing 72% lush forest canopy, zero pollution, clean AQI, and bird sanctuary serenity.',
    perks: ['72% lush native forest canopy', 'Air Quality Index 40% cleaner than central Pune', '1,000+ indigenous trees and herbal gardens', 'Natural birds and butterfly sanctuary reserve']
  },
  'nri-real-estate-investment': {
    title: 'NRI Property Investors',
    target: 'Non-Resident Indians seeking transparent, trusted developer delivery with high rental yields and seamless documentation.',
    perks: ['Complete digital video walkthroughs & e-KYC', 'NRE/NRO rupee bank loan approvals', 'End-to-end tenant sourcing & property management', 'MahaRERA regulated escrow account protection']
  },
  'retiree-peaceful-living': {
    title: 'Senior Citizens & Retirees',
    target: 'Retirees desiring peaceful, senior-friendly gated community with 24/7 medical support, flat pathways, and fresh air.',
    perks: ['Zero-staircase wheelchair accessible ramps', '24/7 on-campus first-aid clinic & ambulance tie-up', 'Acupressure walking paths & reflexology gardens', 'Serene temple pavilion and senior citizen club']
  },
  'families-top-schools': {
    title: 'Families with School-Going Children',
    target: 'Parents prioritizing immediate proximity to premier schools (Symbiosis, Akshara, Indira, Blossom) and sports coaching.',
    perks: ['Symbiosis Skills University right across the street', '5-10 mins to top ICSE/CBSE schools', 'Kids adventure play park with safety rubber flooring', 'Kids splash pool and indoor gaming lounge']
  },
  'expressway-commuters': {
    title: 'Dual-City & Expressway Commuters',
    target: 'Executives regularly travelling between Mumbai and Pune who require instant, congestion-free expressway access.',
    perks: ['Zero-KM frontage to Mumbai-Pune Expressway', '75 mins to Navi Mumbai International Airport', 'Direct bypass to PCMC and Talegaon Industrial Hub', 'Avoid internal city traffic jams completely']
  }
};

function parseSlug(slugParam) {
  if (!slugParam) return null;
  const raw = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;
  const clean = raw.replace(/^\/+|\/+$/g, '');
  if (!clean || clean === 'index' || clean === 'market') return null;

  // Attempt to match known keys in the slug
  let matchedMarket = 'mamurdi';
  let matchedConfig = '2-bhk-classic';
  let matchedIntent = 'price-cost-sheet';
  let matchedPersona = 'it-professionals';

  const sortedMarkets = Object.keys(MICRO_MARKETS).sort((a, b) => b.length - a.length);
  for (const mKey of sortedMarkets) {
    if (clean.includes(mKey)) {
      matchedMarket = mKey;
      break;
    }
  }

  for (const cKey of Object.keys(CONFIGURATIONS)) {
    if (clean.includes(cKey)) {
      matchedConfig = cKey;
      break;
    }
  }

  for (const iKey of Object.keys(SEARCH_INTENTS)) {
    if (clean.includes(iKey)) {
      matchedIntent = iKey;
      break;
    }
  }

  for (const pKey of Object.keys(BUYER_PERSONAS)) {
    if (clean.includes(pKey)) {
      matchedPersona = pKey;
      break;
    }
  }

  return {
    slug: clean,
    market: MICRO_MARKETS[matchedMarket],
    marketKey: matchedMarket,
    config: CONFIGURATIONS[matchedConfig],
    configKey: matchedConfig,
    intent: SEARCH_INTENTS[matchedIntent],
    intentKey: matchedIntent,
    persona: BUYER_PERSONAS[matchedPersona],
    personaKey: matchedPersona
  };
}

export function renderDirectoryHub() {
  return `<!DOCTYPE html>
<html lang="en-IN" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <meta name="format-detection" content="telephone=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="My Home Sanctuary">
  <title>Pune Real Estate Market Hub | Goyal My Home Sanctuary Mamurdi</title>
  <meta name="description" content="Master Pune Real Estate Index for Goyal My Home Sanctuary in Mamurdi. Explore 5,000+ curated configurations, micro-market commute guides, cost sheets, and floor plans.">
  <link rel="canonical" href="https://goyalmyhomesanctuary.in/market">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  
  <!-- Open Graph -->
  <meta property="og:locale" content="en_IN">
  <meta property="og:site_name" content="Goyal My Home Sanctuary, Mamurdi">
  <meta property="og:title" content="Pune Real Estate Market Hub | Goyal My Home Sanctuary Mamurdi">
  <meta property="og:description" content="Master Pune Real Estate Index for Goyal My Home Sanctuary in Mamurdi. Explore 5,000+ curated configurations, micro-market commute guides, cost sheets, and floor plans.">
  <meta property="og:image" content="https://goyalmyhomesanctuary.in/assets/images/scraped/elevation-main.jpg">
  <meta property="og:url" content="https://goyalmyhomesanctuary.in/market">
  <meta property="og:type" content="website">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@GoyalSanctuary">
  <meta name="twitter:creator" content="@GoyalSanctuary">
  <meta name="twitter:title" content="Pune Real Estate Market Hub | Goyal My Home Sanctuary Mamurdi">
  <meta name="twitter:description" content="Master Pune Real Estate Index for Goyal My Home Sanctuary in Mamurdi. Explore 5,000+ curated configurations, micro-market commute guides, cost sheets, and floor plans.">
  <meta name="twitter:image" content="https://goyalmyhomesanctuary.in/assets/images/scraped/elevation-main.jpg">

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="alternate" type="application/json" href="/ai-facts.json" title="Goyal My Home Sanctuary AI Knowledge Graph">
  <meta name="theme-color" content="#0c1410">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://goyalmyhomesanctuary.in/market#collection",
        "name": "Pune Real Estate Market Hub | Goyal My Home Sanctuary",
        "description": "Comprehensive real estate intelligence matrix for Goyal My Home Sanctuary in Mamurdi, PCMC Pune West.",
        "url": "https://goyalmyhomesanctuary.in/market"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://goyalmyhomesanctuary.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Pune Real Estate Market Hub",
            "item": "https://goyalmyhomesanctuary.in/market"
          }
        ]
      }
    ]
  }
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0c1410; color: #f3f5f4; }
    .font-serif { font-family: 'Playfair Display', serif; }
    .gold-gradient { background: linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #aa7c11 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .gold-border { border-color: rgba(212, 175, 55, 0.3); }
    .gold-bg { background: linear-gradient(135deg, #d4af37 0%, #aa7c11 100%); }
    .card-glass { background: rgba(18, 30, 24, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(212, 175, 55, 0.15); }
    .card-glass:hover { border-color: rgba(212, 175, 55, 0.4); }
  </style>
</head>
<body class="antialiased min-h-screen flex flex-col">
  <!-- Top Bar -->
  <header class="sticky top-0 z-50 bg-[#0c1410]/95 backdrop-blur-md border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3 text-white">
        <div class="w-10 h-10 rounded-full gold-bg flex items-center justify-center font-bold text-black text-xl">S</div>
        <div>
          <span class="block font-serif text-lg font-bold tracking-wide">GOYAL MY HOME SANCTUARY</span>
          <span class="block text-xs uppercase tracking-widest text-[#d4af37]">Mamurdi, Pune West</span>
        </div>
      </a>
      <div class="flex items-center gap-4">
        <a href="tel:+919175319441" class="hidden sm:inline-flex items-center gap-2 text-sm text-[#d4af37] font-semibold hover:underline">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          +91 91753 19441
        </a>
        <a href="/" class="text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition">Back to Main Sanctuary</a>
      </div>
    </div>
  </header>

  <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumbs -->
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
        <li><a href="/" class="hover:text-[#d4af37]">Home</a></li>
        <li><span>/</span></li>
        <li class="text-[#d4af37] font-medium">Pune Real Estate Market Index</li>
      </ol>
    </nav>

    <!-- Header Section -->
    <section class="mb-12 text-center max-w-3xl mx-auto">
      <span class="inline-block px-3 py-1 text-xs uppercase tracking-widest bg-[#d4af37]/10 text-[#d4af37] rounded-full border border-[#d4af37]/30 mb-4">Pune Real Estate Dominance Hub</span>
      <h1 class="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">Pune Market Intelligence & Permutations Matrix</h1>
      <p class="text-gray-300 text-base sm:text-lg">Access complete hyper-targeted analyses across 20 PCMC &amp; Pune Micro-Markets, 8 Luxury Configurations, 8 Search Intents, and 8 Buyer Profiles for Goyal My Home Sanctuary.</p>
    </section>

    <!-- Micro-Markets Grid -->
    <section class="mb-16">
      <h2 class="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
        <span class="w-2.5 h-6 rounded-full gold-bg"></span>
        20 Prime PCMC &amp; West Pune Micro-Markets
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${Object.entries(MICRO_MARKETS).map(([k, m]) => `
          <div class="card-glass p-6 rounded-2xl">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-xl font-bold text-white">${m.name}</h3>
              <span class="text-xs px-2.5 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] font-mono">${m.distanceHinjawadi} to IT Park</span>
            </div>
            <p class="text-sm text-gray-400 mb-4">${m.subtitle}</p>
            <p class="text-xs text-gray-300 mb-5">${m.highlight}</p>
            <div class="border-t border-white/10 pt-4 flex flex-wrap gap-2">
              <a href="/market/${k}-2-bhk-classic-price-cost-sheet-it-professionals" class="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-black transition">2 BHK Price</a>
              <a href="/market/${k}-3-bhk-premier-floor-plans-brochure-families-top-schools" class="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-black transition">3 BHK Plans</a>
              <a href="/market/${k}-2-bhk-signature-expressway-connectivity-expressway-commuters" class="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-black transition">Expressway Route</a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Core Configurations Matrix -->
    <section class="mb-16">
      <h2 class="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
        <span class="w-2.5 h-6 rounded-full gold-bg"></span>
        8 Architectural Configurations
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${Object.entries(CONFIGURATIONS).map(([k, c]) => `
          <div class="card-glass p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <span class="text-xs font-mono uppercase tracking-wider text-[#d4af37]">${c.tag}</span>
              <h3 class="text-lg font-bold text-white mt-1 mb-2">${c.name}</h3>
              <p class="text-2xl font-bold text-[#d4af37] mb-2">${c.price}</p>
              <p class="text-xs text-gray-400 mb-2">Carpet Area: <strong class="text-white">${c.carpet}</strong></p>
              <p class="text-xs text-gray-400 mb-4">${c.rooms}</p>
            </div>
            <a href="/market/mamurdi-${k}-price-cost-sheet-it-professionals" class="text-center text-xs font-semibold py-2.5 rounded-xl gold-bg text-black hover:opacity-90 transition">
              View Cost Sheet &amp; Plans
            </a>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Canonical Pillars -->
    <section class="card-glass p-8 rounded-3xl border border-[#d4af37]/30 text-center">
      <h2 class="text-2xl font-serif font-bold text-white mb-3">Explore Primary High-Authority Guides</h2>
      <p class="text-gray-300 text-sm max-w-2xl mx-auto mb-6">Access official Sanctioned Floor Plans, Verified MahaRERA Certificates, Expressway Transit Maps, and PCMC Smart City Investment Whitepapers.</p>
      <div class="flex flex-wrap justify-center gap-3">
        <a href="/price-cost-sheet" class="text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">Price &amp; Cost Sheet</a>
        <a href="/floor-plans-brochure" class="text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">Floor Plans &amp; Brochure</a>
        <a href="/mumbai-pune-expressway-connectivity" class="text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">Expressway Connectivity</a>
        <a href="/hinjawadi-it-park-commute" class="text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">Hinjawadi Commute Guide</a>
        <a href="/maharera-pr1261012502725-approvals" class="text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">MahaRERA Approvals</a>
        <a href="/pcmc-real-estate-market-guide" class="text-xs font-semibold px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">PCMC Real Estate Guide</a>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-[#070b09] border-t border-white/10 py-8 text-center text-xs text-gray-500">
    <div class="max-w-7xl mx-auto px-4">
      <p class="mb-2">MahaRERA Project Registration No.: <strong>PR1261012502725 / P52100077438</strong> | Authorized Marketing by PropSmart Realty.</p>
      <p>Inquiries: <a href="mailto:propsmartrealty@gmail.com" class="text-[#d4af37] underline">propsmartrealty@gmail.com</a> | Helpline: <a href="tel:+919175319441" class="text-[#d4af37] underline">+91 91753 19441</a></p>
    </div>
  </footer>
  <script src="/js/commute-engine.js" defer></script>
  <script src="/js/international-tour-desk.js" defer></script>
  <script src="/js/lead-telemetry.js" defer></script>
  <script src="/js/web-vitals-rum.js" defer></script>
</body>
</html>`;
}

function renderProgrammaticLandingPage(data) {
  const { slug, market, marketKey, config, configKey, intent, intentKey, persona, personaKey } = data;
  const pageTitle = `${config.name} in ${market.name} Pune | ${intent.title} | Goyal My Home Sanctuary`;
  const pageDescription = `Explore ${config.name} (${config.carpet}) at Goyal My Home Sanctuary, ${market.name} Pune West. ${intent.focus} Specially tailored for ${persona.title}. Starting ${config.price}. MahaRERA: PR1261012502725.`;
  const canonicalUrl = `https://goyalmyhomesanctuary.in/market/${slug}`;

  // Structured Data (JSON-LD)
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ApartmentComplex",
        "@id": "https://goyalmyhomesanctuary.in/#project",
        "name": "Goyal My Home Sanctuary",
        "alternateName": "My Home Sanctuary Mamurdi",
        "description": "26-acre luxury biophilic residential development by Goyal Properties in Mamurdi, Pune West featuring 72% green canopy, 75+ world-class amenities and MIVAN high-rise towers.",
        "url": "https://goyalmyhomesanctuary.in",
        "telephone": "+919175319441",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Goyal My Home Sanctuary, Opp. Symbiosis Skills & Professional University, Kiwale-Mamurdi Road",
          "addressLocality": "Mamurdi, PCMC",
          "addressRegion": "Maharashtra",
          "postalCode": "412101",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 18.66376,
          "longitude": 73.7137836
        },
        "hasMap": "https://www.google.com/maps/place/My+Home+Sanctuary/@18.66376,73.7112087,879m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bc2b1002632e9cb:0x85357e0bc6be7a2!8m2!3d18.66376!4d73.7137836!16s%2Fg%2F11yfq11z0t",
        "area": {
          "@type": "GeoShape",
          "polygon": "18.6625,73.7125 18.6650,73.7125 18.6650,73.7150 18.6625,73.7150 18.6625,73.7125"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "1280"
        }
      },
      {
        "@type": "RealEstateListing",
        "@id": `${canonicalUrl}#listing`,
        "name": `${config.name} - ${market.name} Pune Investment Matrix`,
        "description": pageDescription,
        "url": canonicalUrl,
        "datePosted": "2026-09-22",
        "validThrough": "2027-12-31",
        "price": config.price,
        "priceCurrency": "INR",
        "about": [
          {
            "@type": "Place",
            "name": "Mamurdi, Pune West",
            "sameAs": "https://en.wikipedia.org/wiki/Pimpri-Chinchwad"
          },
          {
            "@type": "City",
            "name": "Pimpri-Chinchwad",
            "sameAs": [
              "https://en.wikipedia.org/wiki/Pimpri-Chinchwad",
              "https://www.wikidata.org/wiki/Q11854492"
            ]
          },
          {
            "@type": "City",
            "name": "Pune",
            "sameAs": [
              "https://en.wikipedia.org/wiki/Pune",
              "https://www.wikidata.org/wiki/Q892"
            ]
          }
        ],
        "mentions": [
          {
            "@type": "Thing",
            "name": "Mumbai–Pune Expressway",
            "sameAs": [
              "https://en.wikipedia.org/wiki/Mumbai%E2%80%93Pune_Expressway",
              "https://www.wikidata.org/wiki/Q3525167"
            ]
          },
          {
            "@type": "Thing",
            "name": "Hinjawadi IT Park Rajiv Gandhi Infotech Park",
            "sameAs": [
              "https://en.wikipedia.org/wiki/Hinjawadi",
              "https://www.wikidata.org/wiki/Q5767221"
            ]
          },
          {
            "@type": "GovernmentOrganization",
            "name": "Maharashtra Real Estate Regulatory Authority (MahaRERA)",
            "sameAs": "https://maharera.mahaonline.gov.in"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://goyalmyhomesanctuary.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Pune Real Estate Hub",
            "item": "https://goyalmyhomesanctuary.in/market"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${market.name} Properties`,
            "item": `https://goyalmyhomesanctuary.in/pages/${marketKey === 'mamurdi' ? 'mamurdi-real-estate-flats' : 'kiwale-real-estate-properties'}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": config.name,
            "item": `https://goyalmyhomesanctuary.in/pages/${configKey.startsWith('2-bhk') ? '2-bhk-flats-mamurdi' : '3-bhk-flats-mamurdi'}`
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": intent.title,
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What is the price and carpet area of ${config.name} at Goyal My Home Sanctuary in ${market.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${config.name} offers a sanctioned carpet area of ${config.carpet} with all-inclusive pricing starting from ${config.price}. This includes MIVAN engineering, Italian marble flooring, and smart home automation.`
            }
          },
          {
            "@type": "Question",
            "name": `How long is the commute from ${market.name} to Hinjawadi IT Park and Mumbai-Pune Expressway?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Residents enjoy a fast ${market.distanceHinjawadi} signal-free commute to Hinjawadi IT Park Phase 1, 2, and 3. The Mumbai-Pune Expressway entrance is just ${market.distanceExpressway} away via Mukai Chowk.`
            }
          },
          {
            "@type": "Question",
            "name": `Is Goyal My Home Sanctuary registered with MahaRERA?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes, the project is officially registered with Maharashtra Real Estate Regulatory Authority under registration number PR1261012502725 / P52100077438, ensuring complete legal safety and bank loan pre-approvals.`
            }
          },
          {
            "@type": "Question",
            "name": `Why is this development ideal for ${persona.title}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${persona.target} It provides dedicated features such as ${persona.perks.join(', ')}.`
            }
          }
        ]
      }
    ]
  };

  // Other adjacent micro-markets for cross-linking
  const otherMarkets = Object.keys(MICRO_MARKETS)
    .filter(k => k !== marketKey)
    .slice(0, 4);

  // Other configurations for cross-linking
  const otherConfigs = Object.keys(CONFIGURATIONS)
    .filter(k => k !== configKey)
    .slice(0, 4);

  return `<!DOCTYPE html>
<html lang="en-IN" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <meta name="format-detection" content="telephone=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="My Home Sanctuary">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  
  <!-- Open Graph / Social Tags -->
  <meta property="og:locale" content="en_IN">
  <meta property="og:site_name" content="Goyal My Home Sanctuary, Mamurdi">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDescription}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://goyalmyhomesanctuary.in/api/og?market=${encodeURIComponent(market.name)}&amp;config=${encodeURIComponent(config.name)}&amp;price=${encodeURIComponent(config.price)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${pageTitle}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@GoyalSanctuary">
  <meta name="twitter:creator" content="@GoyalSanctuary">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${pageDescription}">
  <meta name="twitter:image" content="https://goyalmyhomesanctuary.in/api/og?market=${encodeURIComponent(market.name)}&amp;config=${encodeURIComponent(config.name)}&amp;price=${encodeURIComponent(config.price)}">
  
  <meta name="theme-color" content="#0c1410">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="alternate" type="application/json" href="/ai-facts.json" title="Goyal My Home Sanctuary AI Knowledge Graph">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  
  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schemaJsonLd, null, 2)}
  </script>

  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0c1410; color: #f3f5f4; }
    .font-serif { font-family: 'Playfair Display', serif; }
    .gold-gradient { background: linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #aa7c11 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .gold-border { border-color: rgba(212, 175, 55, 0.3); }
    .gold-bg { background: linear-gradient(135deg, #d4af37 0%, #aa7c11 100%); }
    .card-glass { background: rgba(18, 30, 24, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(212, 175, 55, 0.15); }
    .card-glass:hover { border-color: rgba(212, 175, 55, 0.4); }
  </style>
</head>
<body class="antialiased min-h-screen flex flex-col">
  <!-- Top Bar -->
  <header class="sticky top-0 z-50 bg-[#0c1410]/95 backdrop-blur-md border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3 text-white">
        <div class="w-10 h-10 rounded-full gold-bg flex items-center justify-center font-bold text-black text-xl">S</div>
        <div>
          <span class="block font-serif text-lg font-bold tracking-wide">GOYAL MY HOME SANCTUARY</span>
          <span class="block text-xs uppercase tracking-widest text-[#d4af37]">Mamurdi, Pune West</span>
        </div>
      </a>
      <div class="flex items-center gap-4">
        <a href="tel:+919175319441" class="hidden sm:inline-flex items-center gap-2 text-sm text-[#d4af37] font-semibold hover:underline">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          +91 91753 19441
        </a>
        <a href="#lead-form" class="text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg gold-bg text-black hover:opacity-90 transition">Download Price Sheet</a>
      </div>
    </div>
  </header>

  <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumbs (Clean URLs, Zero Hash Fragments) -->
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
        <li><a href="/" class="hover:text-[#d4af37]">Home</a></li>
        <li><span>/</span></li>
        <li><a href="/market" class="hover:text-[#d4af37]">Pune Real Estate</a></li>
        <li><span>/</span></li>
        <li><a href="/${marketKey === 'mamurdi' ? 'mamurdi-real-estate-flats' : (marketKey === 'kiwale' ? 'kiwale-real-estate-properties' : 'pcmc-real-estate-market-guide')}" class="hover:text-[#d4af37]">${market.name}</a></li>
        <li><span>/</span></li>
        <li><a href="/${configKey.startsWith('2-bhk') ? '2-bhk-flats-mamurdi' : '3-bhk-flats-mamurdi'}" class="hover:text-[#d4af37]">${config.name}</a></li>
        <li><span>/</span></li>
        <li class="text-[#d4af37] font-medium truncate max-w-xs">${intent.title}</li>
      </ol>
    </nav>

    <!-- Hero & Lead Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
      <!-- Left Column: Hero Narrative -->
      <div class="lg:col-span-7">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold mb-5">
          <span class="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
          ${market.name} Market Analysis • ${persona.title} Focus
        </div>
        <h1 class="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight mb-4">
          ${config.name} in <span class="gold-gradient">${market.name}</span>
        </h1>
        <p class="text-lg text-gray-300 mb-6 leading-relaxed">
          ${intent.focus} Engineered with 100% monolithic MIVAN concrete in West Pune's premier 26-acre biophilic forest township.
        </p>

        
        <!-- Unit & Elevation Architectural Showcase Image -->
        <div class="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl mb-8 group">
          <img
            id="hero-programmatic-img"
            src="/assets/images/scraped/elevation-main.jpg"
            alt="${config.name} at Goyal My Home Sanctuary in ${market.name}, Pune West - MIVAN High-Rise Tower"
            class="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0c1410] via-transparent to-transparent opacity-80"></div>
          <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
            <span class="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#d4af37] font-semibold border border-[#d4af37]/30">
              ${config.name} • ${config.carpet}
            </span>
            <span class="text-gray-300 font-mono text-[11px] bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm">
              MahaRERA: PR1261012502725
            </span>
          </div>
        </div>

        <!-- Quick Spec Matrix -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 mb-8">
          <div>
            <span class="block text-xs uppercase text-gray-400">Configuration</span>
            <strong class="text-base sm:text-lg text-white">${config.name}</strong>
          </div>
          <div>
            <span class="block text-xs uppercase text-gray-400">Carpet Area</span>
            <strong class="text-base sm:text-lg text-white">${config.carpet}</strong>
          </div>
          <div>
            <span class="block text-xs uppercase text-gray-400">All-Inclusive</span>
            <strong class="text-base sm:text-lg text-[#d4af37]">${config.price}</strong>
          </div>
          <div>
            <span class="block text-xs uppercase text-gray-400">To Hinjawadi</span>
            <strong class="text-base sm:text-lg text-white">${market.distanceHinjawadi}</strong>
          </div>
        </div>

        <!-- Persona Specific Benefits -->
        <div class="card-glass p-6 rounded-2xl mb-8">
          <h2 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Why This Is Calibrated for ${persona.title}
          </h2>
          <p class="text-sm text-gray-300 mb-4">${persona.target}</p>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-200">
            ${persona.perks.map(p => `
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                ${p}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Right Column: Lead Capture Form (Propsmart Realty Direct Dispatch) -->
      <div id="lead-form" class="lg:col-span-5">
        <div class="card-glass p-7 sm:p-8 rounded-3xl border-2 border-[#d4af37]/40 shadow-2xl relative">
          <div class="absolute -top-3 right-6 bg-[#d4af37] text-black text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow">
            Direct Developer Price
          </div>
          <h2 class="text-xl font-serif font-bold text-white mb-2">Request Exclusive Pricing &amp; Brochure</h2>
          <p class="text-xs text-gray-400 mb-6">Receive sanctioned architectural plans, payment milestone breakdown, and official cost sheet on WhatsApp.</p>

          <form id="programmaticLeadForm" class="space-y-4">
            <input type="hidden" name="source_url" value="${canonicalUrl}">
            <input type="hidden" name="micro_market" value="${market.name}">
            <input type="hidden" name="configuration" value="${config.name}">
            <input type="hidden" name="intent" value="${intent.title}">
            <input type="hidden" name="persona" value="${persona.title}">
            <input type="hidden" name="campaign" value="programmatic_pune_seo_matrix">
            <input type="hidden" name="project_name" value="Goyal My Home Sanctuary">

            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">Full Name *</label>
              <input type="text" name="name" required placeholder="e.g. Rahul Sharma" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none text-sm">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">Phone Number (WhatsApp) *</label>
              <input type="tel" name="phone" required pattern="[0-9]{10}" placeholder="10-digit mobile number" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none text-sm">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
              <input type="email" name="email" placeholder="rahul.sharma@gmail.com" class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none text-sm">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1">Preferred Time for Site Visit</label>
              <select name="visit_schedule" class="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/15 text-white text-sm focus:border-[#d4af37] focus:outline-none">
                <option value="This Weekend (Saturday/Sunday)">This Weekend (Saturday/Sunday)</option>
                <option value="Today / Tomorrow (Fast Track)">Today / Tomorrow (Fast Track)</option>
                <option value="Virtual Video Walkthrough First">Virtual Video Walkthrough First</option>
                <option value="Just Need Cost Sheet on WhatsApp">Just Need Cost Sheet on WhatsApp</option>
              </select>
            </div>

            <button type="submit" id="submitBtn" class="w-full py-4 rounded-xl gold-bg text-black font-bold text-sm tracking-wide uppercase shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2">
              <span>Send Cost Sheet &amp; Floor Plans</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>

            <div id="formFeedback" class="hidden text-center text-xs p-3 rounded-xl"></div>

            <p class="text-[11px] text-gray-400 text-center mt-3">
              🔒 Your privacy is 100% protected. Leads directly routed to propsmartrealty@gmail.com. Zero spam.
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- Intent Deep-Dive Section -->
    <section class="card-glass p-8 sm:p-10 rounded-3xl mb-16">
      <div class="max-w-3xl">
        <span class="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Technical Analysis</span>
        <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 mb-4">${intent.title} for ${config.name}</h2>
        <p class="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">${intent.focus}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        ${intent.bulletPoints.map(point => {
          const parts = point.split(':');
          return `
            <div class="p-5 rounded-2xl bg-white/5 border border-white/10">
              <h3 class="text-base font-bold text-[#d4af37] mb-2">${parts[0]}</h3>
              <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">${parts[1] || ''}</p>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- Micro-Market & Connectivity Matrix -->
    <section class="mb-16">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span class="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">Strategic Location</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">Commute &amp; Proximity from ${market.name}</h2>
        </div>
        <p class="text-xs text-gray-400 max-w-md mt-2 md:mt-0">Positioned at the sweet spot of West Pune connecting Hinjawadi, PCMC, and Mumbai.</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="card-glass p-5 rounded-2xl text-center">
          <span class="block text-2xl sm:text-3xl font-bold text-[#d4af37]">${market.distanceExpressway}</span>
          <span class="block text-xs uppercase text-gray-400 mt-1">Expressway Toll Frontage</span>
        </div>
        <div class="card-glass p-5 rounded-2xl text-center">
          <span class="block text-2xl sm:text-3xl font-bold text-white">${market.distanceHinjawadi}</span>
          <span class="block text-xs uppercase text-gray-400 mt-1">Hinjawadi IT Phase 1</span>
        </div>
        <div class="card-glass p-5 rounded-2xl text-center">
          <span class="block text-2xl sm:text-3xl font-bold text-white">2 Mins</span>
          <span class="block text-xs uppercase text-gray-400 mt-1">Symbiosis University</span>
        </div>
        <div class="card-glass p-5 rounded-2xl text-center">
          <span class="block text-2xl sm:text-3xl font-bold text-white">75 Mins</span>
          <span class="block text-xs uppercase text-gray-400 mt-1">Navi Mumbai Airport</span>
        </div>
      </div>
    </section>

    <!-- FAQs Section with Schema Compliant Structure -->
    <section class="card-glass p-8 rounded-3xl mb-16">
      <h2 class="text-2xl font-serif font-bold text-white mb-6">Frequently Asked Questions: ${config.name} in ${market.name}</h2>
      <div class="space-y-4">
        <details class="group p-4 rounded-xl bg-white/5 border border-white/10 open:bg-white/10 transition">
          <summary class="font-semibold text-white cursor-pointer flex justify-between items-center text-sm sm:text-base">
            <span>What is the exact carpet area and layout of ${config.name}?</span>
            <span class="text-[#d4af37] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
            ${config.name} features a RERA-carpet of ${config.carpet} configured with ${config.rooms}. Every unit includes MIVAN monolithic construction, anti-skid ceramic deck tiles, and branded sanitary fixtures.
          </p>
        </details>

        <details class="group p-4 rounded-xl bg-white/5 border border-white/10 open:bg-white/10 transition">
          <summary class="font-semibold text-white cursor-pointer flex justify-between items-center text-sm sm:text-base">
            <span>What are the total charges included in the ${config.price} price?</span>
            <span class="text-[#d4af37] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
            The quoted price reflects standard agreement value. Our team will provide an itemized cost sheet outlining base price, floor rise, parking allotment, infrastructure charges, stamp duty, registration, and GST.
          </p>
        </details>

        <details class="group p-4 rounded-xl bg-white/5 border border-white/10 open:bg-white/10 transition">
          <summary class="font-semibold text-white cursor-pointer flex justify-between items-center text-sm sm:text-base">
            <span>How does Goyal My Home Sanctuary ensure construction quality?</span>
            <span class="text-[#d4af37] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
            The project employs 100% monolithic MIVAN aluminium formwork concrete technology, eliminating hollow brick joints and delivering seismic resilience, seamless walls, and lifetime zero-seepage protection.
          </p>
        </details>

        <details class="group p-4 rounded-xl bg-white/5 border border-white/10 open:bg-white/10 transition">
          <summary class="font-semibold text-white cursor-pointer flex justify-between items-center text-sm sm:text-base">
            <span>What MahaRERA approvals are in place?</span>
            <span class="text-[#d4af37] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
            The project is fully registered under MahaRERA No. PR1261012502725 / P52100077438 with 100% freehold land title, environmental approvals, and verified APF codes from leading nationalized banks.
          </p>
        </details>
      </div>
    </section>

    <!-- Cross-Linking Permutation Hub (SEO Anchor Power) -->
    <section class="card-glass p-8 rounded-3xl border border-white/10">
      <h2 class="text-xl font-serif font-bold text-white mb-6">Explore Related Configurations &amp; Adjacent Markets</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-3">Other Configurations in ${market.name}</h3>
          <ul class="space-y-2 text-xs">
            ${otherConfigs.map(c => `
              <li>
                <a href="/market/${marketKey}-${c}-${intentKey}-${personaKey}" class="text-gray-300 hover:text-[#d4af37] flex items-center justify-between py-1 border-b border-white/5">
                  <span>${CONFIGURATIONS[c].name} in ${market.name}</span>
                  <span class="text-gray-500">${CONFIGURATIONS[c].price}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>

        <div>
          <h3 class="text-xs uppercase tracking-wider text-[#d4af37] font-semibold mb-3">${config.name} in Adjacent Pune Hubs</h3>
          <ul class="space-y-2 text-xs">
            ${otherMarkets.map(m => `
              <li>
                <a href="/market/${m}-${configKey}-${intentKey}-${personaKey}" class="text-gray-300 hover:text-[#d4af37] flex items-center justify-between py-1 border-b border-white/5">
                  <span>${config.name} in ${MICRO_MARKETS[m].name}</span>
                  <span class="text-gray-500">${MICRO_MARKETS[m].distanceHinjawadi} to IT Park</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10 mt-8 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <span class="font-medium text-white">Core Architectural Pillar Guides:</span>
        <div class="flex flex-wrap gap-3">
          <a href="/price-cost-sheet" class="hover:text-[#d4af37] underline">Price &amp; Cost Sheet</a>
          <a href="/floor-plans-brochure" class="hover:text-[#d4af37] underline">Floor Plans Brochure</a>
          <a href="/mumbai-pune-expressway-connectivity" class="hover:text-[#d4af37] underline">Expressway Connectivity</a>
          <a href="/hinjawadi-it-park-commute" class="hover:text-[#d4af37] underline">Hinjawadi IT Commute</a>
          <a href="/maharera-pr1261012502725-approvals" class="hover:text-[#d4af37] underline">MahaRERA PR1261012502725</a>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-[#070b09] border-t border-white/10 py-10 text-xs text-gray-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <span class="block font-serif text-white font-bold text-base mb-2">GOYAL MY HOME SANCTUARY</span>
          <p class="text-[11px] text-gray-500">26-Acre Biophilic Living Township with 75+ Luxury Amenities near Mumbai-Pune Expressway, Mamurdi Pune.</p>
        </div>
        <div>
          <span class="block font-semibold text-white mb-2">Direct Contact</span>
          <p class="text-[11px] text-gray-400 mb-1">Email: <a href="mailto:propsmartrealty@gmail.com" class="text-[#d4af37]">propsmartrealty@gmail.com</a></p>
          <p class="text-[11px] text-gray-400">Sales Desk: <a href="tel:+919175319441" class="text-[#d4af37]">+91 91753 19441</a></p>
        </div>
        <div>
          <span class="block font-semibold text-white mb-2">Project Site</span>
          <p class="text-[11px] text-gray-400">Opp. Symbiosis Skills &amp; Professional University, Kiwale-Mamurdi Road, PCMC, Pune - 412101</p>
        </div>
        <div>
          <span class="block font-semibold text-white mb-2">MahaRERA Registration</span>
          <p class="text-[11px] text-gray-400">MahaRERA Registration No.: <strong class="text-[#d4af37]">PR1261012502725 / P52100077438</strong></p>
          <p class="text-[10px] text-gray-500 mt-1">Details available on maharera.mahaonline.gov.in</p>
        </div>
      </div>
      <div class="border-t border-white/5 pt-6 text-center text-[11px] text-gray-500">
        &copy; 2026 Goyal Properties &amp; PropSmart Realty. All Rights Reserved. Rendered globally on Cloudflare Edge HTTP/3.
      </div>
    </div>
  </footer>

  <!-- Lead Form Script -->
  <script>
    document.getElementById('programmaticLeadForm')?.addEventListener('submit', async function(e) {
      e.preventDefault();
      const form = e.target;
      const btn = document.getElementById('submitBtn');
      const feedback = document.getElementById('formFeedback');
      
      btn.disabled = true;
      btn.innerHTML = 'Sending Details...';

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json();
        feedback.classList.remove('hidden', 'bg-red-900/40', 'text-red-300', 'bg-green-900/40', 'text-green-300');

        if (res.ok && result.success) {
          feedback.classList.add('bg-green-900/40', 'text-green-300', 'border', 'border-green-500/30');
          feedback.innerHTML = '✓ Success! The official cost sheet and floor plans have been dispatched to your email & WhatsApp. A senior sales advisor will connect shortly.';
          form.reset();
        } else {
          feedback.classList.add('bg-red-900/40', 'text-red-300', 'border', 'border-red-500/30');
          feedback.innerHTML = '⚠ ' + (result.message || 'Could not submit. Please call us directly at +91 91753 19441.');
        }
      } catch (err) {
        feedback.classList.remove('hidden');
        feedback.classList.add('bg-red-900/40', 'text-red-300', 'border', 'border-red-500/30');
        feedback.innerHTML = '⚠ Network error. Please call +91 91753 19441 or email propsmartrealty@gmail.com';
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Send Cost Sheet &amp; Floor Plans';
      }
    });
  </script>
  <!-- Mobile Sticky Action Bar -->
  <aside aria-label="Quick Mobile Actions" class="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b09]/95 backdrop-blur-md border-t border-[#d4af37]/30 px-3 py-2.5 flex items-center justify-between gap-2 shadow-2xl safe-area-pb">
    <a href="https://wa.me/919175319441?text=Hello%20Goyal%20Properties,%20I%20am%20interested%20in%20the%20${encodeURIComponent(config.name)}%20in%20${encodeURIComponent(market.name)}%20at%20Goyal%20My%20Home%20Sanctuary.%20Please%20share%20the%20cost%20sheet." target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-3 rounded-xl shadow-md active:scale-95 transition-all">
      <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.588 1.961.92 3.16.92 3.182 0 5.768-2.587 5.769-5.766.001-3.181-2.586-5.767-5.769-5.767zm7.558 5.766c-.001 4.168-3.391 7.558-7.559 7.558-1.332 0-2.58-.35-3.67-1.002l-4.108 1.077 1.097-4.008c-.732-1.144-1.127-2.477-1.127-3.855.001-4.168 3.392-7.558 7.56-7.558 4.168 0 7.559 3.391 7.56 7.558z"/></svg>
      <span>WhatsApp Quote</span>
    </a>
    <a href="tel:+919175319441" class="flex-1 inline-flex items-center justify-center gap-1.5 gold-bg text-black font-bold text-xs py-2.5 px-3 rounded-xl shadow-md active:scale-95 transition-all">
      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z"/></svg>
      <span>Call Desk</span>
    </a>
    <a href="#lead-form" class="inline-flex items-center justify-center p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10" aria-label="Cost Sheet">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
    </a>
  </aside>
  <script src="/js/commute-engine.js" defer></script>
  <script src="/js/international-tour-desk.js" defer></script>
  <script src="/js/lead-telemetry.js" defer></script>
  <script src="/js/web-vitals-rum.js" defer></script>
</body>
</html>`;
}

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  // If root /market or no specific slug, render directory hub
  const parsed = parseSlug(params.slug);
  let html = '';

  if (!parsed) {
    html = renderDirectoryHub();
  } else {
    html = renderProgrammaticLandingPage(parsed);
  }

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'public, max-age=0, s-maxage=604800, stale-while-revalidate=86400',
      'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      'X-Programmatic-SEO': 'Goyal-Sanctuary-Matrix-v1',
      'Link': `<https://goyalmyhomesanctuary.in${url.pathname}>; rel="canonical"`
    }
  });
}
