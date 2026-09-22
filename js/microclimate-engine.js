/**
 * Goyal My Home Sanctuary - Headless Microclimate & AQI Engine
 * Exposes window.SanctuaryAir with ZERO UI/UX side effects.
 */
(function (window) {
  'use strict';

  var SanctuaryAir = {
    getAirQualityMetrics: function () {
      return {
        mamurdiAqi: 52,
        status: 'Good / Clean Green Zone',
        coolingDifferential: '-2.8°C lower ambient temp',
        ambientNoiseDb: 46,
        openGreenCanopy: '72%'
      };
    },

    fetchLiveMetrics: function (compareCity) {
      var url = '/api/microclimate' + (compareCity ? '?location=' + encodeURIComponent(compareCity) : '');
      return fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .catch(function (err) {
          console.warn('[SanctuaryAir] Edge fetch failed, returning static metrics:', err);
          return SanctuaryAir.getAirQualityMetrics();
        });
    }
  };

  window.SanctuaryAir = SanctuaryAir;
})(typeof window !== 'undefined' ? window : this);
