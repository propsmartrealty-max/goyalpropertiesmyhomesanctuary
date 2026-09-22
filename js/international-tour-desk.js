/**
 * Goyal My Home Sanctuary: International Time Zone & Virtual Tour Desk
 * Path: js/international-tour-desk.js
 * 
 * Zero UI/UX Impact - Pure Headless Behavioral Enhancement
 * Automatically detects global visitor time zone and enriches consultation/WhatsApp links
 * with localized time availability and virtual 4K walkthrough requests.
 */

(function () {
  'use strict';

  var GLOBAL_REGIONS = {
    'Asia/Dubai': { region: 'UAE / GCC', label: 'Gulf Standard Time (GST)', offsetHours: 4 },
    'Asia/Riyadh': { region: 'Saudi Arabia', label: 'Arabia Standard Time (AST)', offsetHours: 3 },
    'Europe/London': { region: 'UK & Europe', label: 'London Time (GMT/BST)', offsetHours: 1 },
    'America/New_York': { region: 'US East Coast', label: 'Eastern Time (ET)', offsetHours: -4 },
    'America/Chicago': { region: 'US Central', label: 'Central Time (CT)', offsetHours: -5 },
    'America/Los_Angeles': { region: 'US West Coast', label: 'Pacific Time (PT)', offsetHours: -7 },
    'Asia/Singapore': { region: 'Singapore / SE Asia', label: 'Singapore Time (SGT)', offsetHours: 8 },
    'Australia/Sydney': { region: 'Australia', label: 'Sydney Time (AEST)', offsetHours: 10 }
  };

  function detectUserRegion() {
    try {
      var userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
      var isNRI = userTz !== 'Asia/Kolkata' && !userTz.startsWith('Asia/Calcutta');
      var matchedInfo = GLOBAL_REGIONS[userTz] || {
        region: 'International NRI',
        label: userTz.replace(/_/g, ' '),
        offsetHours: 0
      };

      return {
        isNRI: isNRI,
        timeZone: userTz,
        regionName: matchedInfo.region,
        label: matchedInfo.label
      };
    } catch (e) {
      return { isNRI: false, timeZone: 'Asia/Kolkata', regionName: 'India', label: 'IST' };
    }
  }

  function enrichOutboundLinks() {
    var userContext = detectUserRegion();
    if (!userContext.isNRI) return; // Retain standard local routing for domestic users

    // Find all WhatsApp links on the page and intelligently append local timezone & virtual walkthrough context
    var links = document.querySelectorAll('a[href*="whatsapp.com"]');
    links.forEach(function (link) {
      var currentHref = link.getAttribute('href');
      if (!currentHref) return;

      try {
        var url = new URL(currentHref, window.location.origin);
        var existingText = url.searchParams.get('text') || '';

        // Only append if not already enriched
        if (existingText && !existingText.includes('NRI Virtual Tour')) {
          var nriSuffix = ' [NRI Inquiry from ' + userContext.regionName + ' (' + userContext.label + ') - Requesting Virtual 4K Drone Tour & NRI Repatriation Advisory]';
          url.searchParams.set('text', existingText + nriSuffix);
          link.setAttribute('href', url.toString());
        }
      } catch (err) {
        // Fallback gracefully on relative or malformed URLs
      }
    });
  }

  // Expose as global headless API
  window.SanctuaryGlobalDesk = {
    detect: detectUserRegion,
    enrich: enrichOutboundLinks,
    version: '1.0.0-headless-nri'
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enrichOutboundLinks);
  } else {
    enrichOutboundLinks();
  }
})();
