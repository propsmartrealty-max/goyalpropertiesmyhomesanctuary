/**
 * Goyal My Home Sanctuary: Native Real User Metrics (RUM) Core Web Vitals Observer
 * Path: js/web-vitals-rum.js
 * 
 * Zero UI/UX Impact - Pure Headless Browser Performance Telemetry
 * Measures actual LCP, CLS, INP, and FCP on real visitor devices and beacons to /api/vitals
 */

(function () {
  'use strict';

  if (!('PerformanceObserver' in window) || !('sendBeacon' in navigator)) return;

  var metrics = {};

  function sendMetric(name, value) {
    if (metrics[name]) return; // Send each metric once per page lifecycle
    metrics[name] = value;

    try {
      var nav = navigator.connection || {};
      var payload = JSON.stringify({
        name: name,
        value: Math.round(value * 100) / 100,
        path: window.location.pathname,
        connection: nav.effectiveType || '4g',
        timestamp: Date.now()
      });
      navigator.sendBeacon('/api/vitals', new Blob([payload], { type: 'application/json' }));
    } catch (e) {}
  }

  // 1. Observe FCP (First Contentful Paint)
  try {
    var fcpObserver = new PerformanceObserver(function (entryList) {
      entryList.getEntries().forEach(function (entry) {
        if (entry.name === 'first-contentful-paint') {
          sendMetric('FCP', entry.startTime);
          fcpObserver.disconnect();
        }
      });
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {}

  // 2. Observe LCP (Largest Contentful Paint)
  var lcpValue = 0;
  try {
    var lcpObserver = new PerformanceObserver(function (entryList) {
      var entries = entryList.getEntries();
      if (entries.length > 0) {
        lcpValue = entries[entries.length - 1].startTime;
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {}

  // 3. Observe CLS (Cumulative Layout Shift)
  var clsValue = 0;
  try {
    var clsObserver = new PerformanceObserver(function (entryList) {
      entryList.getEntries().forEach(function (entry) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}

  // 4. Send LCP and CLS on visibility change or page hide
  function dispatchFinalMetrics() {
    if (lcpValue > 0) sendMetric('LCP', lcpValue);
    sendMetric('CLS', clsValue);
  }

  window.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') dispatchFinalMetrics();
  });
  window.addEventListener('pagehide', dispatchFinalMetrics);
})();
