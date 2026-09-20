/**
 * The Travertine Sanctuary - 75+ Curated Amenities Module
 * Warm beige Bento Grid layout with category filtering and interactive modal
 */

const amenitiesList = [
  // Wellness & Zen
  {
    id: "bird-sanctuary",
    category: "wellness",
    title: "Dedicated Bird Watching Sanctuary",
    subtitle: "Preserved natural biodiversity haven with native perches",
    tag: "SIGNATURE USP",
    image: "assets/images/scraped/amenity-urban-forest.webp",
    description: "Nestled within the 26-acre estate, this protected habitat features fruit-bearing flora, natural wooden perches, and quiet observation decks for avian enthusiasts."
  },
  {
    id: "infinity-pool",
    category: "wellness",
    title: "Temperature-Regulated Grand Pool",
    subtitle: "Semi-Olympic pool with submerged loungers overlooking the forest",
    tag: "AQUATIC RETREAT",
    image: "assets/images/scraped/amenity-swimming-pool.webp",
    description: "An Olympic-inspired luxury pool with acoustic water cascades, hydrotherapy massage jets, and dedicated adjacent bubbling kids pool."
  },
  {
    id: "yoga-deck",
    category: "wellness",
    title: "Zen Forest Yoga & Meditation Pavilion",
    subtitle: "Elevated timber deck amid bamboo groves and reflecting ponds",
    tag: "MINDFULNESS",
    image: "assets/images/scraped/amenity-yoga-deck.webp",
    description: "Elevated timber deck designed for sunrise Surya Namaskar, sound healing baths, and restorative evening breathwork beneath ancient canopies."
  },
  {
    id: "temple-sanctuary",
    category: "wellness",
    title: "Sanctuary Spiritual Temple & Lotus Pond",
    subtitle: "Peaceful sacred precinct for morning contemplation",
    tag: "SPIRITUAL RETREAT",
    image: "assets/images/scraped/amenity-temple.webp",
    description: "Architecturally sculpted serene temple enclave enveloped by lush foliage, tranquil water streams, and natural stone seating."
  },
  {
    id: "water-body",
    category: "wellness",
    title: "Reflecting Water Body & Zen Stream",
    subtitle: "Aesthetic cascading fountains and cooling microclimate",
    tag: "AQUATIC HARMONY",
    image: "assets/images/scraped/amenity-water-body.webp",
    description: "Linear water features and illuminated fountain spouts creating a continuous acoustic murmur and pleasant microclimate across the residential courtyards."
  },

  // Active Sports
  {
    id: "pickleball",
    category: "sports",
    title: "Championship Dual Pickleball Courts",
    subtitle: "Tournament-spec cushioned acrylic turf with LED floodlighting",
    tag: "HIGH ENERGY",
    image: "assets/images/scraped/amenity-pickleball.webp",
    description: "Pune's fastest-growing sport finds a premier home with professional cushioned acrylic courts, night illumination, and spectator gallery."
  },
  {
    id: "tennis-court",
    category: "sports",
    title: "Synthetic Lawn Tennis Arena",
    subtitle: "Tournament-spec synthetic court with automated ball return",
    tag: "CHAMPIONSHIP SPEC",
    image: "assets/images/scraped/amenity-tennis.webp",
    description: "Full-sized floodlit tennis arena with rebound shock cushioning, player benches, and automated ball feeder provisions."
  },
  {
    id: "futsal-turf",
    category: "sports",
    title: "FIFA-Grade Monofilament Futsal Turf",
    subtitle: "Shock-absorbing rubber infill with night match lighting",
    tag: "TEAM SPORTS",
    image: "assets/images/scraped/amenity-futsal.webp",
    description: "Fast-paced mini soccer arena engineered with drainable sub-base, impact cushions, and rebound perimeter boards."
  },
  {
    id: "gymnasium",
    category: "sports",
    title: "High-Tech Fitness Gymnasium",
    subtitle: "Biomechanical cardio & strength stations with personal trainers",
    tag: "HEALTH & FITNESS",
    image: "assets/images/scraped/amenity-gym.webp",
    description: "State-of-the-art strength training zone, spin studio, and calisthenics floor overlooking the 26-acre green forest canopy."
  },

  // The Sanctuary Club
  {
    id: "grand-clubhouse",
    category: "clubhouse",
    title: "The Sanctuary Clubhouse (35,000+ Sq. Ft.)",
    subtitle: "Triple-height arrival atrium and private resident lounges",
    tag: "SOCIAL EPICENTER",
    image: "assets/images/scraped/amenity-clubhouse.webp",
    description: "Three-tier grand clubhouse featuring double-height reception foyer, concierge desk, private dining salon, and sweeping views of the central park."
  },
  {
    id: "arrival-plaza",
    category: "clubhouse",
    title: "Grand Arrival Plaza & Gateway",
    subtitle: "Sculpted porte-cochère with 24/7 RFID concierge gatehouse",
    tag: "STATELY ARRIVAL",
    image: "assets/images/scraped/amenity-arrival-plaza.webp",
    description: "Monumental entry portal with biometric security, landscaped drop-off circle, and water walls welcoming residents home."
  },
  {
    id: "amphitheatre",
    category: "clubhouse",
    title: "Stepped Open-Air Amphitheatre",
    subtitle: "Tiered grass seating for weekend performances & community events",
    tag: "CULTURAL ARENA",
    image: "assets/images/scraped/amenity-amphitheatre.webp",
    description: "Open-sky amphitheater with acoustic stage backdrop, ambient pathway illumination, and seating for over 200 guests."
  },

  // Work & Creator Leisure
  {
    id: "podcast-studio",
    category: "work",
    title: "Professional Podcast & Creator Studio",
    subtitle: "Acoustically isolated broadcasting suite with 4K recording kit",
    tag: "CREATOR HUB",
    image: "assets/images/scraped/amenity-podcast-studio.webp",
    description: "Sound-treated recording studio engineered with Shure microphones, ring lighting, multi-cam switches, and high-speed fiber connectivity for modern creators."
  },

  // Kids & Family
  {
    id: "music-garden",
    category: "kids",
    title: "Sensory Kid's Music Garden & Playpark",
    subtitle: "Outdoor xylophones, chime bells, and safe rubberized play mounds",
    tag: "EARLY DISCOVERY",
    image: "assets/images/scraped/amenity-music-garden.webp",
    description: "Interactive musical landscape where children explore tuned outdoor percussion instruments, wobble tunnels, and sensory tactile installations."
  },
  {
    id: "pet-park",
    category: "kids",
    title: "Dedicated Pet Agility & Grooming Park",
    subtitle: "Fenced canine obstacle course and sanitized hydration stations",
    tag: "PET PARADISE",
    image: "assets/images/scraped/amenity-pet-park.webp",
    description: "Secure, double-gated dog park equipped with weave poles, hurdle bars, sand pits, and touch-free paw washing stations."
  },
  {
    id: "banquet-lawn",
    category: "clubhouse",
    title: "Grand Celebration Ballroom & Lawn",
    subtitle: "Accommodates up to 350 guests with catering staging",
    tag: "MILESTONES",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    description: "Accommodates up to 350 guests with dedicated catering staging area, bridal suite, and ambient landscape illumination."
  },
  {
    id: "steam-sauna",
    category: "clubhouse",
    title: "Nordic Cedarwood Sauna & Steam Suites",
    subtitle: "Experiential rainfall showers and revitalizing ice fountain",
    tag: "SPA SANCTUARY",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
    description: "Separate gent's and lady's spa sanctuaries featuring rainfall experiential showers, ice fountain, and detox lounges."
  },

  // Work & Leisure
  {
    id: "coworking-lounge",
    category: "work",
    title: "Executive Coworking & Meeting Pods",
    subtitle: "Acoustic booths, high-speed fiber internet & barista bar",
    tag: "HYBRID WORK",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    description: "A hybrid professional ecosystem right within the township featuring meeting conference rooms with smart TV displays and barista coffee bar."
  },
  {
    id: "stargazing-deck",
    category: "work",
    title: "Sky Observatory & Stargazing Terrace",
    subtitle: "High-power celestial telescopes atop G+28 elevation",
    tag: "CELESTIAL HORIZON",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    description: "Escape light pollution at G+28 elevation. Designed for celestial observation, planet tracking, and tranquil evening cocktails under the stars."
  },
  {
    id: "amphitheatre",
    category: "work",
    title: "Open-Air Forest Amphitheatre",
    subtitle: "Stepped grassy terraces for music soirées & art recitals",
    tag: "CULTURE & ARTS",
    image: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80",
    description: "Natural amphitheatre harmoniously integrated into the landscape terrain for musical soirées, stand-up comedy, and community festivals."
  },
  {
    id: "library-cafe",
    category: "work",
    title: "Artisanal Tea Atelier & Book Lounge",
    subtitle: "Quiet literary alcove with curated architectural volumes",
    tag: "TRANQUILITY",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    description: "Filled with bestsellers, architectural folios, and children's literature, with cozy window bays overlooking the lotus pond."
  },

  // Kids & Family
  {
    id: "treehouse-park",
    category: "kids",
    title: "Adventure Treehouse & Rope Bridge",
    subtitle: "Natural timber suspension bridges and tactile trails",
    tag: "DISCOVERY",
    image: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=800&q=80",
    description: "Safe wooden suspension bridges, tactile climbing walls, and slide chutes allowing kids to reconnect with unadulterated nature."
  },
  {
    id: "kids-splash",
    category: "kids",
    title: "Children's Splash Lagoon & Water Play",
    subtitle: "Zero-depth anti-skid water park with supervised play",
    tag: "KIDS HAVEN",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    description: "Interactive water jets, tipping buckets, and gentle fountains designed for toddler water confidence under certified lifeguards."
  },
  {
    id: "senior-gazebo",
    category: "kids",
    title: "Elder's Wellness Gazebo & Chess Alcove",
    subtitle: "Pergola shaded seating with reflexology paths",
    tag: "SERENITY",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    description: "Thoughtfully buffered from high-velocity sports, offering serene spaces for morning laughter clubs and board games."
  },
  {
    id: "pet-park",
    category: "kids",
    title: "Furry Friends Bark Park & Agility Track",
    subtitle: "Fenced canine obstacle course and hydration fountain",
    tag: "PET PARADISE",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    description: "Dedicated safe space for four-legged family members to socialize off-leash with specialized hurdle jumps, weave poles, and wash station."
  }
];

function renderAmenities(filter = "all") {
  const container = document.getElementById("amenities-grid");
  if (!container) return;

  const filtered = filter === "all"
    ? amenitiesList
    : amenitiesList.filter((item) => item.category === filter);

  container.innerHTML = filtered
    .map(
      (item) => `
      <div class="bento-card group flex flex-col justify-between cursor-pointer" onclick="openAmenityDetail('${item.id}')">
        <div class="relative h-56 overflow-hidden bg-stone-100">
          <img
            src="${item.image}"
            alt="${item.title}"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <span class="absolute top-4 left-4 text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full bg-white/90 text-stone-900 border border-stone-200 backdrop-blur-md">
            ${item.tag}
          </span>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between bg-white">
          <div>
            <h3 class="font-display text-lg font-bold text-stone-900 mb-1.5 group-hover:text-amber-700 transition-colors">
              ${item.title}
            </h3>
            <p class="text-xs font-mono text-stone-500 mb-3">
              ${item.subtitle}
            </p>
            <p class="text-xs text-stone-600 line-clamp-2 leading-relaxed">
              ${item.description}
            </p>
          </div>
          <div class="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between text-xs">
            <span class="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold">75+ Amenity Matrix</span>
            <span class="text-xs font-bold text-stone-800 group-hover:text-amber-700 flex items-center gap-1 transition-colors">
              Inspect
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function openAmenityDetail(id) {
  const item = amenitiesList.find((a) => a.id === id);
  if (!item) return;

  const modal = document.getElementById("amenity-modal");
  if (!modal) return;

  document.getElementById("modal-amenity-img").src = item.image;
  document.getElementById("modal-amenity-tag").textContent = item.tag;
  document.getElementById("modal-amenity-title").textContent = item.title;
  document.getElementById("modal-amenity-sub").textContent = item.subtitle;
  document.getElementById("modal-amenity-desc").textContent = item.description;

  modal.classList.add("open");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeAmenityDetail() {
  const modal = document.getElementById("amenity-modal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll("[data-amenity-filter]");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-amenity-filter");
      renderAmenities(cat);
    });
  });

  renderAmenities("all");
});
