/**
 * Script: generate-embeddings.js
 * Builds normalized 16-dimensional semantic vector index for client-side sub-millisecond AI vector search.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 16 Semantic Dimensions:
// 0: budget_friendly, 1: luxury_premium, 2: it_commute, 3: expressway_transit,
// 4: greenery_nature, 5: vastu_compliance, 6: family_schools, 7: investment_growth,
// 8: spacious_carpet, 9: high_rise_view, 10: clubhouse_sports, 11: mivan_durability,
// 12: retail_convenience, 13: peaceful_tranquility, 14: nri_appeal, 15: rental_yield

function normalizeVector(vec) {
  const mag = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  return vec.map(v => Math.round((v / (mag || 1)) * 10000) / 10000);
}

const CONCEPTS = {
  // Unit Typologies
  "2bhk-classic": {
    name: "2 BHK Classic (638 sq.ft / ₹69 L*)",
    type: "unit",
    tags: ["2bhk", "entry", "budget", "it-pros", "first-home"],
    vector: normalizeVector([0.95, 0.20, 0.90, 0.85, 0.70, 0.80, 0.75, 0.90, 0.40, 0.50, 0.75, 0.90, 0.70, 0.75, 0.60, 0.92])
  },
  "2bhk-premier": {
    name: "2 BHK Premier (704 sq.ft / ₹76 L*)",
    type: "unit",
    tags: ["2bhk", "balanced", "families", "balcony"],
    vector: normalizeVector([0.80, 0.45, 0.88, 0.85, 0.75, 0.85, 0.85, 0.85, 0.60, 0.65, 0.80, 0.90, 0.75, 0.80, 0.70, 0.88])
  },
  "2bhk-signature": {
    name: "2 BHK Signature (760 sq.ft / ₹82 L*)",
    type: "unit",
    tags: ["2bhk", "corner", "luxury-2bhk", "dual-balcony"],
    vector: normalizeVector([0.65, 0.70, 0.85, 0.88, 0.85, 0.90, 0.85, 0.85, 0.75, 0.80, 0.85, 0.90, 0.75, 0.85, 0.75, 0.82])
  },
  "3bhk-classic": {
    name: "3 BHK Classic (848 sq.ft / ₹86 L*)",
    type: "unit",
    tags: ["3bhk", "value-3bhk", "growing-family", "spacious"],
    vector: normalizeVector([0.60, 0.75, 0.85, 0.85, 0.80, 0.88, 0.95, 0.88, 0.85, 0.75, 0.85, 0.90, 0.80, 0.82, 0.80, 0.80])
  },
  "3bhk-premier": {
    name: "3 BHK Premier (924 sq.ft / ₹94 L*)",
    type: "unit",
    tags: ["3bhk", "executive", "corner", "canopy-view"],
    vector: normalizeVector([0.45, 0.88, 0.82, 0.85, 0.88, 0.92, 0.95, 0.88, 0.92, 0.88, 0.90, 0.90, 0.82, 0.88, 0.88, 0.78])
  },
  "3bhk-signature": {
    name: "3 BHK Signature (1036 sq.ft / ₹1.05 Cr*)",
    type: "unit",
    tags: ["3bhk", "flagship", "luxury", "panoramic-view", "nri"],
    vector: normalizeVector([0.25, 0.98, 0.80, 0.88, 0.95, 0.98, 0.95, 0.90, 0.98, 0.98, 0.95, 0.95, 0.85, 0.92, 0.95, 0.75])
  },

  // Key PCMC Micro-Markets
  "mamurdi": {
    name: "Mamurdi (Project Epicenter)",
    type: "location",
    tags: ["mamurdi", "expressway", "forest", "peaceful", "hub"],
    vector: normalizeVector([0.85, 0.75, 0.92, 0.98, 0.98, 0.95, 0.90, 0.98, 0.80, 0.85, 0.90, 0.95, 0.80, 0.98, 0.85, 0.92])
  },
  "kiwale": {
    name: "Kiwale (Adjacent Arterial Corridor)",
    type: "location",
    tags: ["kiwale", "bypass", "connectivity", "ravet-annex"],
    vector: normalizeVector([0.82, 0.65, 0.90, 0.95, 0.85, 0.88, 0.85, 0.92, 0.75, 0.75, 0.80, 0.90, 0.78, 0.85, 0.75, 0.88])
  },
  "ravet": {
    name: "Ravet (BRTS & Educational Hub)",
    type: "location",
    tags: ["ravet", "brts", "schools", "colleges"],
    vector: normalizeVector([0.70, 0.72, 0.88, 0.90, 0.75, 0.85, 0.92, 0.88, 0.75, 0.75, 0.82, 0.90, 0.85, 0.75, 0.75, 0.85])
  },
  "punawale": {
    name: "Punawale (IT Commuter Pocket)",
    type: "location",
    tags: ["punawale", "hinjawadi-proximity", "rental"],
    vector: normalizeVector([0.75, 0.65, 0.92, 0.82, 0.68, 0.80, 0.82, 0.85, 0.70, 0.70, 0.78, 0.85, 0.80, 0.70, 0.70, 0.90])
  },
  "wakad": {
    name: "Wakad (Central High-Density Commercial/IT Hub)",
    type: "location",
    tags: ["wakad", "metro", "commercial", "high-density"],
    vector: normalizeVector([0.50, 0.85, 0.95, 0.75, 0.50, 0.80, 0.88, 0.82, 0.70, 0.75, 0.82, 0.88, 0.95, 0.50, 0.80, 0.92])
  },
  "hinjawadi": {
    name: "Hinjawadi IT Park (Phases 1, 2, 3)",
    type: "location",
    tags: ["hinjawadi", "tech-park", "tcs", "infosys", "wipro"],
    vector: normalizeVector([0.55, 0.80, 1.00, 0.70, 0.55, 0.75, 0.80, 0.85, 0.65, 0.65, 0.80, 0.85, 0.90, 0.50, 0.78, 0.95])
  },
  "baner": {
    name: "Baner (High-Street Dining & Commercial Corridor)",
    type: "location",
    tags: ["baner", "luxury", "high-street", "lifestyle"],
    vector: normalizeVector([0.30, 0.95, 0.88, 0.78, 0.60, 0.82, 0.88, 0.85, 0.82, 0.85, 0.88, 0.90, 0.98, 0.60, 0.88, 0.85])
  },
  "pcmc-core": {
    name: "PCMC Core Smart City Corridor",
    type: "location",
    tags: ["pcmc", "smart-city", "civic", "metro"],
    vector: normalizeVector([0.72, 0.70, 0.85, 0.88, 0.75, 0.85, 0.88, 0.90, 0.75, 0.75, 0.82, 0.90, 0.90, 0.80, 0.75, 0.88])
  },
  "chinchwad": {
    name: "Chinchwad Commercial Epicenter",
    type: "location",
    tags: ["chinchwad", "railway", "industrial", "heritage"],
    vector: normalizeVector([0.68, 0.72, 0.82, 0.85, 0.70, 0.85, 0.90, 0.88, 0.78, 0.75, 0.82, 0.90, 0.92, 0.75, 0.72, 0.85])
  },
  "nigdi": {
    name: "Nigdi Pradhikaran Planned Layout",
    type: "location",
    tags: ["nigdi", "pradhikaran", "wide-roads", "greenery"],
    vector: normalizeVector([0.65, 0.75, 0.82, 0.90, 0.85, 0.88, 0.92, 0.85, 0.80, 0.75, 0.82, 0.90, 0.88, 0.85, 0.75, 0.82])
  }
};

const payload = {
  version: "1.0",
  dimensions: [
    "budget_friendly", "luxury_premium", "it_commute", "expressway_transit",
    "greenery_nature", "vastu_compliance", "family_schools", "investment_growth",
    "spacious_carpet", "high_rise_view", "clubhouse_sports", "mivan_durability",
    "retail_convenience", "peaceful_tranquility", "nri_appeal", "rental_yield"
  ],
  total_concepts: Object.keys(CONCEPTS).length,
  concepts: CONCEPTS
};

const outPath = path.join(ROOT_DIR, 'embeddings.json');
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
console.log(`✓ embeddings.json generated with ${Object.keys(CONCEPTS).length} normalized semantic vector concepts.`);
