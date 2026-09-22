/**
 * Goyal My Home Sanctuary - Headless Portfolio Optimization Engine
 * Exposes window.SanctuaryPortfolio with ZERO UI/UX side effects.
 */
(function (window) {
  'use strict';

  var SanctuaryPortfolio = {
    compareStrategies: function () {
      return fetch('/api/portfolio-optimizer')
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .catch(function (err) {
          console.warn('[SanctuaryPortfolio] Edge fetch failed, returning static model:', err);
          return {
            status: 'fallback',
            single3BhkYield: 4.8,
            dual2BhkYield: 5.12,
            cagr: '12.8%'
          };
        });
    }
  };

  window.SanctuaryPortfolio = SanctuaryPortfolio;
})(typeof window !== 'undefined' ? window : this);
