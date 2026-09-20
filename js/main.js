/**
 * The Obsidian Sanctuary - Main Architectural Controller
 * Ambient lighting mode simulator (Day / Golden Hour / Night), HUD navbar, Master Plan Hotspots, Tour
 */

// Ambient Lighting Modes for Hero & Architecture
const lightingModes = {
  day: {
    heroImage: "assets/images/scraped/elevation-main.jpg",
    skyTag: "Daylight Ambience • 26-Acre Forest Canopy (AQI 42)",
    filterClass: "brightness-100 contrast-105"
  },
  sunset: {
    heroImage: "assets/images/scraped/elevation-aerial.webp",
    skyTag: "Golden Hour Glow • 26-Acre Aerial Township Horizon",
    filterClass: "brightness-95 contrast-110"
  },
  night: {
    heroImage: "assets/images/scraped/elevation-tower-tall.webp",
    skyTag: "Starlight Skyline • G+28 Monolithic High-Rise Towers",
    filterClass: "brightness-90 contrast-115"
  }
};

function setLightingMode(mode) {
  const config = lightingModes[mode];
  if (!config) return;

  const heroImg = document.getElementById("hero-lighting-bg");
  const skyLabel = document.getElementById("lighting-mode-label");

  if (heroImg) {
    heroImg.style.opacity = "0.25";
    setTimeout(() => {
      heroImg.src = config.heroImage;
      heroImg.className = `w-full h-full object-cover transition-opacity duration-700 ${config.filterClass}`;
      heroImg.style.opacity = "1";
    }, 200);
  }

  if (skyLabel) skyLabel.textContent = config.skyTag;

  // Active pill state
  document.querySelectorAll("[data-lighting-mode]").forEach((btn) => {
    if (btn.getAttribute("data-lighting-mode") === mode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Sticky HUD Navbar Controller
window.addEventListener("scroll", () => {
  const nav = document.getElementById("hud-nav");
  const scrollBar = document.getElementById("scroll-indicator");

  if (nav) {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  if (scrollBar) {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollBar.style.width = scrolled + "%";
  }
});

// Mobile Navigation Drawer (Google Accessibility & Touch Standards)
function toggleMobileMenu() {
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  const toggleBtn = document.getElementById("mobile-menu-toggle-btn");
  if (!drawer) return;

  const isClosed = drawer.classList.contains("translate-x-full");

  if (isClosed) {
    drawer.classList.remove("translate-x-full");
    drawer.classList.add("translate-x-0");
    if (backdrop) {
      backdrop.classList.remove("opacity-0", "pointer-events-none");
      backdrop.classList.add("opacity-100", "pointer-events-auto");
    }
    document.body.style.overflow = "hidden";
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "true");
  } else {
    drawer.classList.add("translate-x-full");
    drawer.classList.remove("translate-x-0");
    if (backdrop) {
      backdrop.classList.add("opacity-0", "pointer-events-none");
      backdrop.classList.remove("opacity-100", "pointer-events-auto");
    }
    document.body.style.overflow = "";
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
  }
}

// Close drawer on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const drawer = document.getElementById("mobile-drawer");
    if (drawer && drawer.classList.contains("translate-x-0")) {
      toggleMobileMenu();
    }
  }
});

// Master Plan Hotspots Data
const masterHotspots = {
  1: {
    tag: "THE SANCTUARY PAVILION",
    title: "35,000+ Sq. Ft. Luxury Social Clubhouse",
    desc: "Triple-height arrival atrium, temperature-controlled Olympic pool, private Dolby Atmos preview cinema, and Swedish spa hydrotherapy suites."
  },
  2: {
    tag: "CENTRAL GREEN SPINE",
    title: "1.2 KM Biophilic Walking & Cycling Boulevard",
    desc: "Zero-vehicle shaded promenade connecting all residential towers with continuous tree canopies and reflexology pebble paths."
  },
  3: {
    tag: "BIODIVERSITY RESERVE",
    title: "Dedicated Bird Watching Sanctuary",
    desc: "Preserved 1.5-acre natural habitat harboring indigenous fruit-bearing trees, natural waterbodies, and peaceful avian hides."
  },
  4: {
    tag: "CHAMPIONSHIP SPORTS ARENA",
    title: "Floodlit Tennis, Pickleball & Futsal Turf",
    desc: "International tournament-grade synthetic surfaces with automated bowling cricket net and spectator galleries."
  },
  5: {
    tag: "RESIDENTIAL TOWERS A TO C",
    title: "G+28 Iconic Monolithic MIVAN Towers",
    desc: "Engineered with 100% monolithic shear-wall technology, offering unbroken 270-degree cross-ventilation and hill horizons."
  },
  6: {
    tag: "GRAND ARRIVAL PORTAL",
    title: "Biometric Security & RFID Gate Boulevard",
    desc: "High-speed automated barriers, visitor facial recognition, and private chauffeur staging lounge."
  }
};

function selectMasterHotspot(id) {
  const item = masterHotspots[id];
  if (!item) return;

  document.getElementById("hotspot-tag").textContent = item.tag;
  document.getElementById("hotspot-title").textContent = item.title;
  document.getElementById("hotspot-desc").textContent = item.desc;
  document.getElementById("hotspot-badge-num").textContent = `ZONE 0${id}`;

  document.querySelectorAll(".plan-hotspot").forEach((pin) => {
    if (pin.getAttribute("data-spot") == id) {
      pin.classList.add("scale-125", "bg-white", "text-black");
    } else {
      pin.classList.remove("scale-125", "bg-white", "text-black");
    }
  });
}

// 360 Virtual Tour Simulator
const tourViews = {
  living: {
    title: "Panoramic Forest-View Living Lounge",
    specs: "600x1200mm marble finish vitrified flooring, 3-track sliding balcony door, open forest vista.",
    image: "assets/images/scraped/interior-living.webp"
  },
  deck: {
    title: "Spacious Family Dining & Balcony",
    specs: "Seamless open layout connecting living room, dining salon, and wide wooden-finish balcony deck.",
    image: "assets/images/scraped/interior-dining.webp"
  },
  master: {
    title: "Presidential Master Bedroom Suite",
    specs: "Generous carpet area with split A/C electrical piping, solar water bathroom, and scenic views.",
    image: "assets/images/scraped/interior-bedroom.webp"
  },
  kitchen: {
    title: "Modern Modular Kitchen & Utility",
    specs: "Scratch-resistant polished granite platform with gas leak detector, RO water purifier points, and dry yard.",
    image: "assets/images/scraped/interior-kitchen.webp"
  }
};

function switchTourView(viewKey) {
  const data = tourViews[viewKey];
  if (!data) return;

  const bgEl = document.getElementById("tour-display-bg");
  const titleEl = document.getElementById("tour-view-title");
  const specsEl = document.getElementById("tour-view-specs");

  if (bgEl) {
    bgEl.style.opacity = "0.3";
    setTimeout(() => {
      bgEl.src = data.image;
      bgEl.style.opacity = "1";
    }, 200);
  }

  if (titleEl) titleEl.textContent = data.title;
  if (specsEl) specsEl.textContent = data.specs;

  document.querySelectorAll("[data-tour-view]").forEach((btn) => {
    if (btn.getAttribute("data-tour-view") === viewKey) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Hero Quick Lead Handler
function handleHeroLeadSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("hero-lead-name").value.trim();
  const phone = document.getElementById("hero-lead-phone").value.trim();
  const config = document.getElementById("hero-lead-config").value;

  if (!name || !phone) {
    if (typeof showToast === "function") showToast("Please enter your name and phone", "error");
    return;
  }

  if (typeof launchConfetti === "function") launchConfetti();
  if (typeof showToast === "function") {
    showToast(`VIP Priority Dossier for ${config} dispatched to ${name}!`);
  }
  document.getElementById("hero-lead-form").reset();
}

// Proximity Filter
function filterConnectivity(category) {
  document.querySelectorAll("[data-conn-cat]").forEach((btn) => {
    if (btn.getAttribute("data-conn-cat") === category) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.querySelectorAll(".conn-card").forEach((card) => {
    if (category === "all" || card.getAttribute("data-cat") === category) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Master Plan Fullscreen Modal
function openMasterPlanModal() {
  const modal = document.getElementById("master-plan-modal");
  if (modal) {
    modal.classList.add("open");
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeMasterPlanModal() {
  const modal = document.getElementById("master-plan-modal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

// Photo Lightbox Viewer
function openImageModal(src, title, caption) {
  const modal = document.getElementById("image-lightbox-modal");
  const img = document.getElementById("lightbox-img");
  const t = document.getElementById("lightbox-title");
  const c = document.getElementById("lightbox-caption");

  if (img) img.src = src;
  if (t) t.textContent = title || "Sample Flat Showcase";
  if (c) c.textContent = caption || "";

  if (modal) {
    modal.classList.add("open");
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeImageModal() {
  const modal = document.getElementById("image-lightbox-modal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

// Universal backdrop click close
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("arch-modal-backdrop")) {
    e.target.classList.remove("open");
    e.target.classList.add("hidden");
    document.body.style.overflow = "";
  }
});

// Universal Escape key close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".arch-modal-backdrop.open").forEach((modal) => {
      modal.classList.remove("open");
      modal.classList.add("hidden");
    });
    document.body.style.overflow = "";
  }
});


// Official Video Switcher
function switchVideo(ytId, title, desc) {
  const player = document.getElementById("main-video-player");
  const titleEl = document.getElementById("current-video-title");
  const descEl = document.getElementById("current-video-desc");

  if (player) {
    player.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  // Update switcher buttons
  document.querySelectorAll("#videos .mode-pill").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = event ? event.currentTarget : null;
  if (activeBtn) activeBtn.classList.add("active");
}

// Keyboard modal close handler
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMasterPlanModal();
    closeImageModal();
    if (typeof closeVisitModal === "function") closeVisitModal();
    if (typeof closeBrochureModal === "function") closeBrochureModal();
    if (typeof closeAmenityDetail === "function") closeAmenityDetail();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Hero Lead Form
  const heroForm = document.getElementById("hero-lead-form");
  if (heroForm) heroForm.addEventListener("submit", handleHeroLeadSubmit);

  // Lighting Mode Pills
  document.querySelectorAll("[data-lighting-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-lighting-mode");
      setLightingMode(mode);
    });
  });

  // Tour View Buttons
  document.querySelectorAll("[data-tour-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-tour-view");
      switchTourView(view);
    });
  });

  // Connectivity Filter
  document.querySelectorAll("[data-conn-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-conn-cat");
      filterConnectivity(cat);
    });
  });

  // Initial Hotspot
  selectMasterHotspot(1);
});
