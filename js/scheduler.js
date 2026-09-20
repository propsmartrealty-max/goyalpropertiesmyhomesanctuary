/**
 * The Obsidian Sanctuary - VIP Site Visit & Dossier Scheduler
 * Cloudflare Edge Pages Function Integration + Google Analytics 4 (GA4) / GTM Telemetry + Confetti
 */

// Google Analytics 4 Event Dispatch Helper
function trackGoogleEvent(eventName, eventParams = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      project: "Goyal My Home Sanctuary",
      location: "Mamurdi Pune",
      timestamp: new Date().toISOString(),
      ...eventParams
    });
  } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
  }
}

// Canvas Confetti Celebration
function launchConfetti() {
  const count = 120;
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#d4af37", "#f4e8cb", "#52796f", "#ffffff", "#c59b27"];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.5,
      r: Math.random() * 5 + 3,
      dx: (Math.random() - 0.5) * 16,
      dy: (Math.random() - 0.7) * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.35;
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        active = true;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();
      }
    });

    if (active) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  }
  animate();
}

// Notification Toast System
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed top-6 right-6 z-[999999] flex flex-col gap-3 pointer-events-none";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `pointer-events-auto px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono font-semibold transition-all duration-300 transform translate-y-[-20px] opacity-0 ${
    type === "success"
      ? "bg-obsidian-900 text-white border border-bronze-400/40"
      : "bg-red-950 text-white border border-red-500/40"
  }`;

  toast.innerHTML = `
    <span class="w-6 h-6 rounded-full bg-bronze-400/20 text-bronze-300 flex items-center justify-center shrink-0">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
    </span>
    <div>
      <p class="font-bold text-bronze-300 uppercase tracking-wider">Sanctuary Concierge</p>
      <p class="text-slate-300 mt-0.5">${message}</p>
    </div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-[-20px]", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("translate-y-[-20px]", "opacity-0");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4500);
}

// Modal Controllers
function openVisitModal(prefillConfig = "") {
  const modal = document.getElementById("visit-modal");
  if (!modal) return;

  if (prefillConfig) {
    const configSelect = document.getElementById("visit-config");
    if (configSelect) configSelect.value = prefillConfig;
  }

  const dateInput = document.getElementById("visit-date");
  if (dateInput && !dateInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split("T")[0];
  }

  modal.classList.add("open");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  trackGoogleEvent("open_visit_modal", { prefillConfig });
}

function closeVisitModal() {
  const modal = document.getElementById("visit-modal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function openBrochureModal() {
  const modal = document.getElementById("brochure-modal");
  if (modal) {
    modal.classList.add("open");
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
  trackGoogleEvent("open_brochure_modal");
}

function closeBrochureModal() {
  const modal = document.getElementById("brochure-modal");
  if (modal) {
    modal.classList.remove("open");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

// Client-Side Input Sanitizer
function cleanInput(str, max = 100) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>?/gm, "").trim().slice(0, max);
}

function isValidPhoneClient(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleaned) || /^\+?[1-9]\d{7,14}$/.test(cleaned);
}

// Handle Visit Form Submit (dispatches to Cloudflare edge /api/lead + GA4)
async function handleVisitSubmit(e) {
  e.preventDefault();
  const name = cleanInput(document.getElementById("visit-name").value, 80);
  const phone = cleanInput(document.getElementById("visit-phone").value, 20);
  const date = cleanInput(document.getElementById("visit-date").value, 20);
  const time = cleanInput(document.getElementById("visit-time").value, 20);
  const config = cleanInput(document.getElementById("visit-config").value, 50);
  const cabRequested = document.getElementById("visit-cab").checked;
  const pickupAddress = cleanInput(document.getElementById("visit-pickup-address").value, 150);
  const honeypot = document.getElementById("visit-website")?.value || "";

  if (!name || name.length < 2) {
    showToast("Please enter your full name", "error");
    return;
  }

  if (!isValidPhoneClient(phone)) {
    showToast("Please enter a valid 10-digit mobile number", "error");
    return;
  }

  closeVisitModal();
  launchConfetti();

  showToast(`VIP Site Tour reserved for ${name}! Concierge is preparing your voucher.`);

  // GA4 Conversion Telemetry
  trackGoogleEvent("generate_lead", {
    lead_type: "site_visit",
    configuration: config,
    cab_requested: cabRequested,
    currency: "INR",
    value: 1000
  });

  // Post to Cloudflare Pages Serverless Function /api/lead
  try {
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "site-visit",
        name,
        phone,
        date,
        time,
        config,
        cab: cabRequested,
        address: pickupAddress,
        website: honeypot
      })
    }).catch(() => {});
  } catch (err) {}

  // WhatsApp Deep-Link for immediate sales desk dispatch
  const message = `Hello Goyal Properties, I would like to confirm my VIP Site Tour for *Goyal My Home Sanctuary, Mamurdi Pune*.%0a%0a*Name:* ${encodeURIComponent(name)}%0a*Phone:* ${encodeURIComponent(phone)}%0a*Configuration:* ${encodeURIComponent(config)}%0a*Date:* ${encodeURIComponent(date)}%0a*Time Slot:* ${encodeURIComponent(time)}%0a*Cab Pickup:* ${cabRequested ? 'Yes (' + encodeURIComponent(pickupAddress || 'Address will be provided') + ')' : 'Self Drive'}%0a%0aPlease share navigation pin and booking pass.`;

  setTimeout(() => {
    const waUrl = `https://api.whatsapp.com/send?phone=919175319441&text=${message}`;
    const openWa = confirm("Your VIP pass is generated! Would you like to receive the Google Maps navigation pin and booking voucher directly on WhatsApp?");
    if (openWa) {
      trackGoogleEvent("whatsapp_dispatch", { phone });
      window.open(waUrl, "_blank");
    }
  }, 1000);
}

// Handle Brochure Download Submit
async function handleBrochureSubmit(e) {
  e.preventDefault();
  const name = cleanInput(document.getElementById("brochure-name").value, 80);
  const phone = cleanInput(document.getElementById("brochure-phone").value, 20);
  const honeypot = document.getElementById("brochure-website")?.value || "";

  if (!name || name.length < 2) {
    showToast("Please enter your full name", "error");
    return;
  }

  if (!isValidPhoneClient(phone)) {
    showToast("Please enter a valid 10-digit mobile number", "error");
    return;
  }

  closeBrochureModal();
  launchConfetti();
  showToast(`Master Dossier unlocked for ${name}! Generating download...`);

  // GA4 Conversion Telemetry
  trackGoogleEvent("download_brochure", {
    lead_type: "master_dossier",
    currency: "INR",
    value: 500
  });

  // Post to Cloudflare Pages edge /api/lead
  try {
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "brochure-download",
        name,
        phone,
        website: honeypot
      })
    }).catch(() => {});
  } catch (err) {}

  // Trigger Instant Dossier Download
  setTimeout(() => {
    const el = document.createElement("a");
    const brochureText = `
===================================================================
GOYAL MY HOME SANCTUARY - OFFICIAL MASTER ARCHITECTURAL DOSSIER
Survey No. 8(P), Near Mukai Chowk, Mamurdi, Pune - 412101
MahaRERA Registration Number: PR1261012502725
===================================================================

DEVELOPER: Goyal Properties (35+ Years of Built Trust)
LAND PARCEL: 26-Acre Integrated Biophilic Township
CANOPY: 72% Dedicated Open Greens & Native Avian Reserve
STRUCTURE: G+28 Monolithic High-Rise Towers (100% MIVAN Technology)
LIFESTYLE: 75+ Curated Amenities across 2+ Acres
CLUBHOUSE: The Sanctuary Pavilion (35,000+ Sq. Ft.)

RESIDENTIAL PORTFOLIO:
- 2 BHK Luxe: 638 to 760 Sq.Ft Usable | Starts ₹62.50 Lakhs*
- 2 BHK Grande: 760 to 840 Sq.Ft Usable | Starts ₹74.80 Lakhs*
- 3 BHK Grande: 848 to 945 Sq.Ft Usable | Starts ₹82.50 Lakhs*
- 3 BHK Signature: 1,036 to 1,165 Sq.Ft Usable | Starts ₹1.02 Crore*

STRATEGIC LOCATION:
- 2 Mins: Mumbai-Pune Expressway
- 3 Mins: Mukai Chowk & BRTS Terminal
- 5 Mins: Symbiosis Skills & Professional University
- 6 Mins: DMart Kiwale / Ravet
- 15 Mins: Hinjawadi IT Park (Phase 1 & 2)

VIP SALES CONCIERGE:
Phone: +91 91753 19441
Google Maps: https://www.google.com/maps/place/My+Home+Sanctuary/@18.66376,73.7112087,879m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bc2b1002632e9cb:0x85357e0bc6be7a2!8m2!3d18.66376!4d73.7137836!16s%2Fg%2F11yfq11z0t
Official Portal: https://goyalmyhomesanctuary.com
===================================================================
`;
    const blob = new Blob([brochureText], { type: "text/plain;charset=utf-8" });
    el.href = URL.createObjectURL(blob);
    el.download = "Goyal_My_Home_Sanctuary_Master_Dossier.txt";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }, 700);
}

document.addEventListener("DOMContentLoaded", () => {
  const visitForm = document.getElementById("visit-form");
  if (visitForm) visitForm.addEventListener("submit", handleVisitSubmit);

  const brochureForm = document.getElementById("brochure-form");
  if (brochureForm) brochureForm.addEventListener("submit", handleBrochureSubmit);

  const cabCheckbox = document.getElementById("visit-cab");
  const cabAddressWrapper = document.getElementById("cab-address-wrapper");
  if (cabCheckbox && cabAddressWrapper) {
    cabCheckbox.addEventListener("change", () => {
      if (cabCheckbox.checked) {
        cabAddressWrapper.classList.remove("hidden");
      } else {
        cabAddressWrapper.classList.add("hidden");
      }
    });
  }
});
