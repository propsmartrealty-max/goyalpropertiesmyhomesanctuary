/**
 * Goyal My Home Sanctuary: Headless Dynamic Commute & Transit Intelligence Engine
 * Path: js/commute-engine.js
 * 
 * Zero UI/UX Impact - Pure Headless Computational Utility
 * Exposes window.SanctuaryCommute for client-side queries, analytics, and lead pre-qualification.
 */

(function () {
  'use strict';

  var COMMUTE_MATRIX = {
    'hinjawadi-phase-1': { name: 'Hinjawadi Phase 1 (Infosys/Wipro)', distance: '12.8 km', mamurdiTime: 15, wakadTime: 28, signalsSaved: 6 },
    'hinjawadi-phase-2': { name: 'Hinjawadi Phase 2 (Tech Mahindra/TCS)', distance: '14.5 km', mamurdiTime: 18, wakadTime: 32, signalsSaved: 8 },
    'hinjawadi-phase-3': { name: 'Hinjawadi Phase 3 (Megapolis)', distance: '16.0 km', mamurdiTime: 20, wakadTime: 38, signalsSaved: 9 },
    'talawade': { name: 'Talawade Mindspace IT Park', distance: '13.2 km', mamurdiTime: 18, wakadTime: 35, signalsSaved: 7 },
    'bhosari': { name: 'Bhosari MIDC Industrial Belt', distance: '16.5 km', mamurdiTime: 22, wakadTime: 42, signalsSaved: 8 },
    'chakan': { name: 'Chakan Auto Hub', distance: '24.0 km', mamurdiTime: 30, wakadTime: 55, signalsSaved: 11 },
    'talegaon': { name: 'Talegaon Industrial Cluster', distance: '14.0 km', mamurdiTime: 12, wakadTime: 35, signalsSaved: 5 },
    'balewadi': { name: 'Balewadi High Street', distance: '16.2 km', mamurdiTime: 20, wakadTime: 25, signalsSaved: 4 },
    'symbiosis': { name: 'Symbiosis Skill University', distance: '2.8 km', mamurdiTime: 5, wakadTime: 22, signalsSaved: 4 }
  };

  function calculateAnnualSavings(hubKey) {
    var hub = COMMUTE_MATRIX[hubKey];
    if (!hub) return null;
    var dailyMinutesSaved = (hub.wakadTime - hub.mamurdiTime) * 2;
    var annualHours = Math.round((dailyMinutesSaved * 240) / 60);
    var annualFuelInr = Math.round(((hub.signalsSaved * 0.08) + 0.5) * 105 * 240);
    return {
      destination: hub.name,
      distance: hub.distance,
      transitMinutes: hub.mamurdiTime,
      roundTripMinutesSavedDaily: dailyMinutesSaved,
      annualProductivityHoursSaved: annualHours,
      estimatedAnnualFuelSavedInr: annualFuelInr,
      expresswayAdvantage: 'Zero traffic bottlenecks at Bhumkar & Dange Chowks'
    };
  }

  function getAllDestinations() {
    return Object.keys(COMMUTE_MATRIX).map(function (k) {
      return calculateAnnualSavings(k);
    });
  }

  // Expose as global headless API
  window.SanctuaryCommute = {
    matrix: COMMUTE_MATRIX,
    getSavings: calculateAnnualSavings,
    listAll: getAllDestinations,
    version: '1.0.0-headless'
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.SanctuaryCommute;
  }
})();
