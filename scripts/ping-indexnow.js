/**
 * Automated IndexNow Dispatcher for Instant Search Engine Indexing
 * Submits all core production URLs to Bing, Yandex, Seznam & Naver via IndexNow API
 */

const HOST = 'goyalmyhomesanctuary.in';
const KEY = 'e5a8f7c91b3d4e62a0f8b1c7d3e95a2f';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/market`,
  `https://${HOST}/2-bhk-flats-mamurdi`,
  `https://${HOST}/3-bhk-flats-mamurdi`,
  `https://${HOST}/price-cost-sheet`,
  `https://${HOST}/floor-plans-brochure`,
  `https://${HOST}/mumbai-pune-expressway-connectivity`,
  `https://${HOST}/hinjawadi-it-park-commute`,
  `https://${HOST}/maharera-pr1261012502725-approvals`,
  `https://${HOST}/mamurdi-vs-ravet-kiwale-comparison`,
  `https://${HOST}/pcmc-real-estate-market-guide`,
  `https://${HOST}/kiwale-real-estate-properties`,
  `https://${HOST}/mamurdi-real-estate-flats`,
  `https://${HOST}/blog`,
  `https://${HOST}/blog/pune-real-estate-market-forecast-2026`,
  `https://${HOST}/blog/mamurdi-the-next-growth-corridor-pune-west`,
  `https://${HOST}/blog/goyal-my-home-sanctuary-complete-buyers-guide`,
  `https://${HOST}/blog/2bhk-3bhk-4bhk-duplex-flats-mamurdi-pune`,
  `https://${HOST}/blog/mivan-monolithic-construction-vs-conventional-brickwork`,
  `https://${HOST}/market/pcmc-2-bhk-classic-price-cost-sheet-it-professionals`,
  `https://${HOST}/market/chinchwad-3-bhk-premier-floor-plans-brochure-families-top-schools`,
  `https://${HOST}/market/pimpri-2-bhk-classic-price-cost-sheet-it-professionals`,
  `https://${HOST}/market/nigdi-3-bhk-premier-floor-plans-brochure-families-top-schools`,
  `https://${HOST}/market/akurdi-2-bhk-classic-price-cost-sheet-it-professionals`,
  `https://${HOST}/market/moshi-3-bhk-premier-floor-plans-brochure-families-top-schools`,
  `https://${HOST}/market/bhosari-2-bhk-classic-price-cost-sheet-it-professionals`,
  `https://${HOST}/market/pimple-saudagar-3-bhk-premier-floor-plans-brochure-families-top-schools`,
  `https://${HOST}/market/pimple-nilakh-2-bhk-classic-price-cost-sheet-it-professionals`,
  `https://${HOST}/market/thergaon-3-bhk-premier-floor-plans-brochure-families-top-schools`,
  `https://${HOST}/ai-facts.json`,
  `https://${HOST}/.well-known/ai.txt`,
  `https://${HOST}/sitemap-market-images.xml`,
  `https://${HOST}/catalog.jsonld`,
  `https://${HOST}/embeddings.json`,
  `https://${HOST}/api/inventory`,
  `https://${HOST}/api/solar-vastu`,
  `https://${HOST}/api/currency`,
  `https://${HOST}/api/push-subscribe`,
  `https://${HOST}/tour.jsonld`,
  `https://${HOST}/loans.jsonld`,
  `https://${HOST}/api/tax-calculator`,
  `https://${HOST}/api/health`,
  `https://${HOST}/api/market-index`
];

async function submitIndexNow() {
  console.log(`Submitting ${URLS.length} URLs to IndexNow API for ${HOST}...`);
  
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log(`IndexNow Response: ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      console.log('✓ Successfully broadcasted all URLs to IndexNow (Bing, Yandex, Seznam, Naver)!');
    } else {
      const text = await res.text();
      console.log('Response body:', text);
    }
  } catch (err) {
    console.error('Error broadcasting to IndexNow:', err.message);
  }
}

submitIndexNow();
