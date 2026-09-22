/**
 * Headless Institutional Transit & School Proximity Engine
 * Goyal My Home Sanctuary, Mamurdi, PCMC
 * 
 * Provides client-side transit matrix calculation for top schools and hospitals
 * without modifying any visual DOM elements or typography.
 */

(function () {
  'use strict';

  var DATA = [
    { name: "Symbiosis Skills University (SSPU)", distanceKm: 2.5, driveTimeMins: 5, category: "University" },
    { name: "Akshara International School", distanceKm: 6.0, driveTimeMins: 12, category: "CBSE School" },
    { name: "Indira National School", distanceKm: 5.5, driveTimeMins: 10, category: "K-12 Campus" },
    { name: "D.Y. Patil International University", distanceKm: 6.5, driveTimeMins: 14, category: "University" },
    { name: "Blossom Public School", distanceKm: 4.2, driveTimeMins: 8, category: "CBSE School" },
    { name: "Aditya Birla Memorial Hospital", distanceKm: 7.5, driveTimeMins: 14, category: "Quaternary Care Hospital" },
    { name: "Ojas Multi-Specialty Hospital", distanceKm: 3.8, driveTimeMins: 7, category: "Multi-Specialty Hospital" }
  ];

  window.SanctuaryTransit = {
    getTransitList: function (category) {
      if (!category) return DATA.slice();
      var catLower = category.toLowerCase();
      return DATA.filter(function (item) {
        return item.category.toLowerCase().indexOf(catLower) !== -1;
      });
    },
    getClosestHospital: function () {
      return DATA.filter(function (i) { return i.category.indexOf('Hospital') !== -1; })[0];
    },
    getClosestSchool: function () {
      return DATA.filter(function (i) { return i.category.indexOf('School') !== -1; })[0];
    }
  };
})();
