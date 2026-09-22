/**
 * Goyal My Home Sanctuary - Headless Carbon & ESG Telemetry Engine
 * Exposes window.SanctuaryGreen with ZERO UI/UX side effects.
 */
(function (window) {
  'use strict';

  var ESG_BENCHMARKS = {
    openSpaceRatio: 0.72,
    annualCo2OffsetTons: 18.4,
    rainwaterCapacityLiters: 2400000,
    solarKwhAnnual: 85000,
    treesPlanted: 1250,
    typologies: {
      '2bhk-classic': { name: '2 BHK Classic', carpet: 638, greenSqft: 446, co2OffsetKg: 520, waterSavedL: 28000 },
      '2bhk-premier': { name: '2 BHK Premier', carpet: 704, greenSqft: 492, co2OffsetKg: 574, waterSavedL: 31000 },
      '2bhk-signature': { name: '2 BHK Signature', carpet: 760, greenSqft: 531, co2OffsetKg: 620, waterSavedL: 33500 },
      '3bhk-classic': { name: '3 BHK Classic', carpet: 848, greenSqft: 593, co2OffsetKg: 692, waterSavedL: 37400 },
      '3bhk-premier': { name: '3 BHK Premier', carpet: 924, greenSqft: 646, co2OffsetKg: 754, waterSavedL: 40700 },
      '3bhk-signature': { name: '3 BHK Signature', carpet: 1036, greenSqft: 724, co2OffsetKg: 845, waterSavedL: 45600 }
    }
  };

  var SanctuaryGreen = {
    getCommunityMetrics: function () {
      return {
        openSpacePercentage: 72,
        annualCo2OffsetTons: ESG_BENCHMARKS.annualCo2OffsetTons,
        rainwaterHarvestingLiters: ESG_BENCHMARKS.rainwaterCapacityLiters,
        solarPhotovoltaicGenerationKwh: ESG_BENCHMARKS.solarKwhAnnual,
        treesPlanted: ESG_BENCHMARKS.treesPlanted,
        igbcCertificationTarget: 'IGBC Green Homes Gold / Platinum Net-Zero Readiness'
      };
    },

    calculateTypologyImpact: function (typologyKey) {
      var key = (typologyKey || '2bhk-classic').toLowerCase().replace(/\s+/g, '-');
      var unit = ESG_BENCHMARKS.typologies[key] || ESG_BENCHMARKS.typologies['2bhk-classic'];
      
      return {
        unit: unit.name,
        carpetAreaSqft: unit.carpet,
        allocatedForestCanopySqft: unit.greenSqft,
        annualHouseholdCo2OffsetKg: unit.co2OffsetKg,
        annualFreshwaterSavedLiters: unit.waterSavedL,
        cleanEnergySolarShareKwh: Math.round(unit.carpet * 0.12 * 100) / 100,
        grade: 'A+ IGBC Net-Zero Ready'
      };
    },

    fetchTelemetryFromEdge: function (typologyKey) {
      var url = '/api/sustainability' + (typologyKey ? '?typology=' + encodeURIComponent(typologyKey) : '');
      return fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .catch(function (err) {
          console.warn('[SanctuaryGreen] Edge fetch failed, falling back to local benchmarks:', err);
          return SanctuaryGreen.calculateTypologyImpact(typologyKey);
        });
    }
  };

  window.SanctuaryGreen = SanctuaryGreen;
})(typeof window !== 'undefined' ? window : this);
