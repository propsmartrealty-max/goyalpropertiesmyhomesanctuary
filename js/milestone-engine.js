/**
 * Goyal My Home Sanctuary - Headless Construction Milestone Engine
 * Exposes window.SanctuaryMilestones with ZERO UI/UX side effects.
 */
(function (window) {
  'use strict';

  var MILESTONES_CACHE = {
    targetPossession: 'December 2028',
    mahareraNo: 'PR1261012502725 / P52100077438',
    overallProgress: 32.5,
    methodology: 'Mivan Monolithic Aluminum Formwork'
  };

  var SanctuaryMilestones = {
    getOverview: function () {
      return {
        targetPossession: MILESTONES_CACHE.targetPossession,
        mahareraNo: MILESTONES_CACHE.mahareraNo,
        overallProgressPct: MILESTONES_CACHE.overallProgress,
        structuralSystem: MILESTONES_CACHE.methodology,
        possessionCountdownMonths: 27
      };
    },

    fetchLatestMilestones: function (towerId) {
      var url = '/api/construction-milestones' + (towerId ? '?tower=' + encodeURIComponent(towerId) : '');
      return fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .catch(function (err) {
          console.warn('[SanctuaryMilestones] Edge fetch failed, falling back to cached overview:', err);
          return SanctuaryMilestones.getOverview();
        });
    }
  };

  window.SanctuaryMilestones = SanctuaryMilestones;
})(typeof window !== 'undefined' ? window : this);
