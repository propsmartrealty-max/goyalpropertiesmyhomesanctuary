/**
 * The Travertine Sanctuary - Master Architectural & Visual Gallery
 * Complete verified media catalog with category filtering, lightbox, and navigation
 */

const galleryItems = [
  // Elevations & Architecture
  {
    id: "elev-1",
    category: "elevations",
    categoryLabel: "Elevation",
    title: "Sanctuary Master Twilight Elevation",
    subtitle: "Iconic G+28 high-rise residential towers illuminated against the Mamurdi evening sky.",
    image: "assets/images/scraped/elevation-main.jpg",
    badge: "MAIN ELEVATION"
  },
  {
    id: "elev-2",
    category: "elevations",
    categoryLabel: "Elevation",
    title: "26-Acre Biophilic Master Aerial",
    subtitle: "Sanctioned panoramic perspective showing 72% pristine forest canopy and central green spine.",
    image: "assets/images/scraped/elevation-aerial.webp",
    badge: "26-ACRE AERIAL"
  },
  {
    id: "elev-3",
    category: "elevations",
    categoryLabel: "Elevation",
    title: "G+28 Monolithic Tower Facade",
    subtitle: "100% monolithic MIVAN engineering with aerodynamic balconies and expansive sun decks.",
    image: "assets/images/scraped/elevation-tower-tall.webp",
    badge: "G+28 TOWER"
  },
  {
    id: "elev-4",
    category: "elevations",
    categoryLabel: "Elevation",
    title: "East-West Cross-Ventilated Architecture",
    subtitle: "Sculpted tower orientation capturing morning light and natural Western Ghats breezes.",
    image: "assets/images/scraped/gallery-elevation-side.jpg",
    badge: "SIDE FACADE"
  },
  {
    id: "elev-5",
    category: "elevations",
    categoryLabel: "Elevation",
    title: "Complete 26-Acre Township Vista",
    subtitle: "Comprehensive master layout with low ground coverage and landscaped podium zones.",
    image: "assets/images/scraped/township-overview.webp",
    badge: "TOWNSHIP OVERVIEW"
  },
  {
    id: "elev-6",
    category: "elevations",
    categoryLabel: "Elevation",
    title: "Geometric Terraces & Architectural Crowns",
    subtitle: "Contemporary biophilic facade lines integrated with living greenery balconies.",
    image: "assets/images/scraped/elevation-facade-1.webp",
    badge: "FACADE GEOMETRY"
  },
  {
    id: "elev-7",
    category: "elevations",
    categoryLabel: "Elevation",
    title: "Double-Height Arrival Port-Cochère",
    subtitle: "Monumental stone entry canopy with dedicated vehicular drop-off loops.",
    image: "assets/images/scraped/elevation-facade-2.webp",
    badge: "ARRIVAL CANOPY"
  },
  {
    id: "elev-8",
    category: "elevations",
    categoryLabel: "Elevation",
    title: "Sunset Horizon & Hill Backdrop",
    subtitle: "Unobstructed Western Ghats ridge views with dramatic golden hour reflections.",
    image: "assets/images/scraped/elevation-facade-3.webp",
    badge: "SUNSET VISTA"
  },
  {
    id: "elev-9",
    category: "elevations",
    categoryLabel: "Elevation",
    title: "Grand Boulevard & Tower Cluster",
    subtitle: "Wide internal avenue bordered by flowering canopy trees and dedicated cycle tracks.",
    image: "assets/images/scraped/elevation-facade-4.webp",
    badge: "TOWER CLUSTER"
  },

  // Sample Flat Interiors
  {
    id: "int-1",
    category: "interiors",
    categoryLabel: "Sample Flat",
    title: "Panoramic Living Lounge",
    subtitle: "600x1200mm marble finish vitrified flooring with full-height acoustic glass slider.",
    image: "assets/images/scraped/interior-living.webp",
    badge: "LIVING LOUNGE"
  },
  {
    id: "int-2",
    category: "interiors",
    categoryLabel: "Sample Flat",
    title: "Family Dining Salon & Balcony Link",
    subtitle: "Fluid open-plan dining space adjoining the forest-facing sun deck.",
    image: "assets/images/scraped/interior-dining.webp",
    badge: "DINING SALON"
  },
  {
    id: "int-3",
    category: "interiors",
    categoryLabel: "Sample Flat",
    title: "Gourmet Chef Modular Kitchen",
    subtitle: "Scratch-resistant polished granite platform with gas leak detector and dry utility yard.",
    image: "assets/images/scraped/interior-kitchen.webp",
    badge: "MODULAR KITCHEN"
  },
  {
    id: "int-4",
    category: "interiors",
    categoryLabel: "Sample Flat",
    title: "Presidential Master Suite",
    subtitle: "King-size bedroom sanctuary with timber flooring finish and split A/C ducting.",
    image: "assets/images/scraped/interior-bedroom.webp",
    badge: "MASTER SUITE"
  },
  {
    id: "int-5",
    category: "interiors",
    categoryLabel: "Sample Flat",
    title: "Dedicated Walk-In Wardrobe Alcove",
    subtitle: "Custom dressing niche engineered with ambient cove lighting and smart storage.",
    image: "assets/images/scraped/interior-wardrobe.webp",
    badge: "DRESSING NICHE"
  },
  {
    id: "int-6",
    category: "interiors",
    categoryLabel: "Sample Flat",
    title: "Spa Bathroom & Jaquar CP Suites",
    subtitle: "Designer anti-skid ceramic tiles, solar hot water line, and premium CP fittings.",
    image: "assets/images/scraped/interior-washroom.webp",
    badge: "SPA BATHROOM"
  },
  {
    id: "int-7",
    category: "interiors",
    categoryLabel: "Sample Flat",
    title: "Private Forest Sun Deck",
    subtitle: "Wide glass balustrade balcony offering 270-degree unbroken hill horizons.",
    image: "assets/images/scraped/gallery-balcony-view.jpg",
    badge: "SUN DECK"
  },
  {
    id: "int-8",
    category: "interiors",
    categoryLabel: "Sample Flat",
    title: "The Sanctuary Family Lifestyle",
    subtitle: "Cherished moments surrounded by 26 acres of unhindered nature and serene tranquility.",
    image: "assets/images/scraped/family-lifestyle.webp",
    badge: "LIFESTYLE"
  },

  // Amenities & Landscape
  {
    id: "amen-1",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "The Sanctuary Pavilion (35,000+ Sq. Ft.)",
    subtitle: "Triple-height arrival atrium, executive resident lounges, and private banqueting.",
    image: "assets/images/scraped/amenity-clubhouse.webp",
    badge: "GRAND CLUBHOUSE"
  },
  {
    id: "amen-2",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Temperature-Regulated Grand Pool",
    subtitle: "Semi-Olympic aquatic retreat with underwater hydrotherapy jets and kids splash pool.",
    image: "assets/images/scraped/amenity-swimming-pool.webp",
    badge: "HEATED POOL"
  },
  {
    id: "amen-3",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Monumental Arrival Gateway",
    subtitle: "Grand stone portal with water cascades, biometric security, and RFID automated barriers.",
    image: "assets/images/scraped/amenity-arrival-plaza.webp",
    badge: "ARRIVAL PORTAL"
  },
  {
    id: "amen-4",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Sanctuary Spiritual Temple & Lotus Pond",
    subtitle: "Architecturally sculpted serene precinct enveloped by tranquil water streams.",
    image: "assets/images/scraped/amenity-temple.webp",
    badge: "TEMPLE & POND"
  },
  {
    id: "amen-5",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Dedicated Bird Watching Sanctuary",
    subtitle: "1.5-acre preserved biodiversity habitat with native fruiting flora and quiet avian hides.",
    image: "assets/images/scraped/amenity-urban-forest.webp",
    badge: "AVIAN SANCTUARY"
  },
  {
    id: "amen-6",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Zen Forest Yoga & Meditation Deck",
    subtitle: "Elevated timber deck amid bamboo groves and reflecting ponds for morning breathwork.",
    image: "assets/images/scraped/amenity-yoga-deck.webp",
    badge: "YOGA PAVILION"
  },
  {
    id: "amen-7",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Sensory Kid's Music Garden & Playpark",
    subtitle: "Interactive musical landscape with outdoor tuned xylophones and rubberized play mounds.",
    image: "assets/images/scraped/amenity-music-garden.webp",
    badge: "MUSIC PLAYPARK"
  },
  {
    id: "amen-8",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Stepped Open-Air Cultural Amphitheatre",
    subtitle: "Tiered grass seating for weekend acoustic concerts and community festivals.",
    image: "assets/images/scraped/amenity-amphitheatre.webp",
    badge: "AMPHITHEATRE"
  },
  {
    id: "amen-9",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Professional Podcast & Creator Studio",
    subtitle: "Acoustically isolated broadcasting suite with 4K recording kit and high-speed fiber.",
    image: "assets/images/scraped/amenity-podcast-studio.webp",
    badge: "CREATOR SUITE"
  },
  {
    id: "amen-10",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Dual Championship Pickleball Courts",
    subtitle: "Tournament-grade synthetic cushioned courts with stadium LED night match lighting.",
    image: "assets/images/scraped/amenity-pickleball.webp",
    badge: "PICKLEBALL"
  },
  {
    id: "amen-11",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Championship Hard Tennis Court",
    subtitle: "Regulation-size hard tennis court with windbreak perimeters and spectator seating.",
    image: "assets/images/scraped/amenity-tennis.webp",
    badge: "TENNIS ARENA"
  },
  {
    id: "amen-12",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "FIFA-Grade Monofilament Futsal Turf",
    subtitle: "Fast-paced mini soccer arena with shock-absorbing sub-base and rebound perimeter boards.",
    image: "assets/images/scraped/amenity-futsal.webp",
    badge: "FUTSAL TURF"
  },
  {
    id: "amen-13",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Technogym Biophilic Fitness Suite",
    subtitle: "Full glass-encased cardio and resistance center overlooking the central forest canopy.",
    image: "assets/images/scraped/amenity-gym.webp",
    badge: "FITNESS CENTER"
  },
  {
    id: "amen-14",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Dedicated Pet Agility & Grooming Park",
    subtitle: "Secure double-gated canine obstacle course with hurdle bars and sanitized washing stations.",
    image: "assets/images/scraped/amenity-pet-park.webp",
    badge: "PET PARK"
  },
  {
    id: "amen-15",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Reflecting Water Body & Zen Stream",
    subtitle: "Aesthetic cascading fountains and cooling microclimate water features along main axis.",
    image: "assets/images/scraped/amenity-water-body.webp",
    badge: "WATER FOUNTAINS"
  },
  {
    id: "amen-16",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Shaded Forest Hammock Retreat",
    subtitle: "Quiet woodland reading grove with heavy-duty weather-proof hanging hammocks.",
    image: "assets/images/scraped/gallery-hammock-garden.webp",
    badge: "HAMMOCK GROVE"
  },
  {
    id: "amen-17",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Executive Coworking & Meeting Pods",
    subtitle: "Acoustic workstations, conference presentation screen, and high-speed fiber.",
    image: "assets/images/scraped/gallery-coworking.webp",
    badge: "COWORKING"
  },
  {
    id: "amen-18",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Montessori Children's Creche Zone",
    subtitle: "Safe, padded floor early learning playhouse supervised by trained attendants.",
    image: "assets/images/scraped/gallery-creche.webp",
    badge: "CRECHE"
  },
  {
    id: "amen-19",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Full-Court Basketball Arena",
    subtitle: "Acrylic sports surface with shock dampening and regulation height glass backboards.",
    image: "assets/images/scraped/gallery-basketball.webp",
    badge: "BASKETBALL"
  },
  {
    id: "amen-20",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Youth Adventure & Obstacle Course",
    subtitle: "Natural timber balance logs, rope cargo climbs, and sensory adventure zones.",
    image: "assets/images/scraped/gallery-adventure-park.webp",
    badge: "ADVENTURE PARK"
  },
  {
    id: "amen-21",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Hydrotherapy Jet Jacuzzi",
    subtitle: "Heated outdoor whirlpool with therapeutic back and calf water massage nozzles.",
    image: "assets/images/scraped/gallery-jacuzzi.webp",
    badge: "JACUZZI"
  },
  {
    id: "amen-22",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Indoor Snooker & Board Games Lounge",
    subtitle: "Championship slate pool tables, table tennis, carrom, and board gaming tables.",
    image: "assets/images/scraped/gallery-game-zone.webp",
    badge: "GAMES LOUNGE"
  },
  {
    id: "amen-23",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Double-Height Air-Conditioned Lobby",
    subtitle: "Hotel-grade arrival salon with concierge desk and Italian marble clad columns.",
    image: "assets/images/scraped/gallery-entrance-lobby.webp",
    badge: "ENTRANCE FOYER"
  },
  {
    id: "amen-24",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Grand Celebration Ballroom & Lawn",
    subtitle: "Accommodates up to 350 guests with dedicated catering kitchen and adjoining party lawn.",
    image: "assets/images/scraped/gallery-multipurpose-hall.jpg",
    badge: "BALLROOM"
  },
  {
    id: "amen-25",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Convenience Retail & High-Street Arcade",
    subtitle: "Daily essentials grocery, organic pharmacy, cafe counter, and salon services.",
    image: "assets/images/scraped/gallery-retail-boulevard.jpg",
    badge: "RETAIL ARCADE"
  },
  {
    id: "amen-26",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Open-Air Alfresco Cafe Deck",
    subtitle: "Casual outdoor dining terrace nestled between the reflecting pool and garden lawns.",
    image: "assets/images/scraped/gallery-alfresco-deck.jpg",
    badge: "ALFRESCO DECK"
  },
  {
    id: "amen-27",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "Curated Medicinal & Botanical Gardens",
    subtitle: "Aromatic herbs, indigenous flowering species, and shaded seating pavilions.",
    image: "assets/images/scraped/gallery-botanical-garden.jpg",
    badge: "BOTANICAL GARDEN"
  },
  {
    id: "amen-28",
    category: "amenities",
    categoryLabel: "Amenity",
    title: "1.2 KM Forest Spine Tree Boardwalk",
    subtitle: "Elevated timber canopy walk weaving through the protected trees of the township.",
    image: "assets/images/scraped/gallery-forest-walkway.jpg",
    badge: "FOREST SPINE"
  }
];

let currentGalleryCategory = "all";
let currentFilteredList = [];
let currentLightboxIndex = 0;

function renderGallery(cat = "all") {
  currentGalleryCategory = cat;
  currentFilteredList = cat === "all" ? galleryItems : galleryItems.filter(item => item.category === cat);

  const container = document.getElementById("gallery-grid");
  if (!container) return;

  const countBadge = document.getElementById("gallery-count-badge");
  if (countBadge) {
    countBadge.textContent = `${currentFilteredList.length} Curated Visual Assets`;
  }

  container.innerHTML = currentFilteredList
    .map((item, index) => `
      <div class="gallery-card group cursor-pointer flex flex-col justify-between" onclick="openMasterLightbox(${index})">
        <div class="relative h-64 sm:h-72 overflow-hidden bg-stone-100">
          <img
            src="${item.image}"
            alt="${item.title} - Goyal My Home Sanctuary, Mamurdi Pune West"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
          
          <div class="absolute top-3.5 left-3.5 flex items-center gap-2">
            <span class="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-espresso-950 border border-beige-300 shadow-sm">
              ${item.badge}
            </span>
          </div>

          <div class="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-espresso-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-bronze-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>

          <div class="absolute bottom-3.5 left-3.5 right-3.5 text-white">
            <span class="text-[10px] font-mono text-bronze-300 uppercase tracking-widest font-semibold block mb-0.5">
              ${item.categoryLabel}
            </span>
            <h3 class="font-display text-base sm:text-lg font-bold leading-tight drop-shadow-sm line-clamp-1">
              ${item.title}
            </h3>
          </div>
        </div>

        <div class="p-4 bg-white border-t border-beige-200">
          <p class="text-xs text-espresso-600 line-clamp-2 leading-relaxed font-normal">
            ${item.subtitle}
          </p>
          <div class="mt-3 pt-2.5 border-t border-beige-100 flex items-center justify-between text-[11px] font-mono text-espresso-500">
            <span>Verified Authentic Asset</span>
            <span class="text-bronze-600 font-bold flex items-center gap-1">
              <span>Inspect</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    `)
    .join("");
}

function openMasterLightbox(index) {
  if (index < 0 || index >= currentFilteredList.length) return;
  currentLightboxIndex = index;
  updateLightboxContent();

  const modal = document.getElementById("gallery-lightbox-modal");
  if (modal) {
    modal.classList.add("open");
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function updateLightboxContent() {
  const item = currentFilteredList[currentLightboxIndex];
  if (!item) return;

  const img = document.getElementById("gallery-lb-img");
  const title = document.getElementById("gallery-lb-title");
  const sub = document.getElementById("gallery-lb-desc");
  const badge = document.getElementById("gallery-lb-badge");
  const counter = document.getElementById("gallery-lb-counter");

  if (img) {
    img.src = item.image;
    img.alt = `${item.title} - Goyal My Home Sanctuary, Mamurdi Pune West`;
  }
  if (title) title.textContent = item.title;
  if (sub) sub.textContent = item.subtitle;
  if (badge) badge.textContent = item.badge;
  if (counter) counter.textContent = `Image ${currentLightboxIndex + 1} of ${currentFilteredList.length}`;
}

function nextGalleryImage() {
  if (currentFilteredList.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentFilteredList.length;
  updateLightboxContent();
}

function prevGalleryImage() {
  if (currentFilteredList.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentFilteredList.length) % currentFilteredList.length;
  updateLightboxContent();
}

function closeGalleryLightbox() {
  const modal = document.getElementById("gallery-lightbox-modal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

// Key bindings for lightbox
document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("gallery-lightbox-modal");
  if (!modal || !modal.classList.contains("open")) return;

  if (e.key === "Escape") closeGalleryLightbox();
  if (e.key === "ArrowRight") nextGalleryImage();
  if (e.key === "ArrowLeft") prevGalleryImage();
});

document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll("[data-gallery-filter]");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active", "bg-espresso-950", "text-white", "font-bold"));
      filterBtns.forEach((b) => b.classList.add("text-espresso-700", "bg-white"));

      btn.classList.add("active", "bg-espresso-950", "text-white", "font-bold");
      btn.classList.remove("text-espresso-700", "bg-white");

      const cat = btn.getAttribute("data-gallery-filter");
      renderGallery(cat);
    });
  });

  renderGallery("all");
});
