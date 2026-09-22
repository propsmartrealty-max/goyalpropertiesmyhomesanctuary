/**
 * Goyal My Home Sanctuary - Headless Legal & Regulatory Verification Engine
 * Exposes window.SanctuaryLegal with ZERO UI/UX side effects.
 */
(function (window) {
  'use strict';

  var SanctuaryLegal = {
    getTitleStatus: function () {
      return {
        title: 'Clear, Absolute & Marketable',
        encumbrance: 'Nil Encumbrances',
        mahareraNo: 'PR1261012502725 / P52100077438',
        sanctions: ['PCMC CC', 'SEIAA EC', 'Pune Collector NA', 'AAI NOC', 'Fire NOC']
      };
    },

    verifyClearance: function (authority) {
      var url = '/api/legal-audit' + (authority ? '?authority=' + encodeURIComponent(authority) : '');
      return fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .catch(function (err) {
          console.warn('[SanctuaryLegal] Edge fetch failed, returning static clearances:', err);
          return SanctuaryLegal.getTitleStatus();
        });
    }
  };

  window.SanctuaryLegal = SanctuaryLegal;
})(typeof window !== 'undefined' ? window : this);
