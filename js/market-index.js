/**
 * Headless Market Index & Rental Yield Engine
 * Goyal My Home Sanctuary, Mamurdi, PCMC
 * 
 * Provides client-side investment ROI and rental yield calculation
 * without modifying any visual DOM elements or typography.
 */

(function () {
  'use strict';

  var RENTALS = {
    '2bhk': { min: 22000, max: 27000, avgAnnual: 294000 },
    '3bhk': { min: 30000, max: 38000, avgAnnual: 408000 }
  };

  window.SanctuaryIndex = {
    calculateRoi: function (price, typology, years, assumedCagr) {
      price = parseFloat(price) || 6900000;
      typology = (typology || '2bhk').toLowerCase().indexOf('3') !== -1 ? '3bhk' : '2bhk';
      years = years || 10;
      assumedCagr = assumedCagr || 0.08;

      var rental = RENTALS[typology];
      var grossYield = ((rental.avgAnnual / price) * 100).toFixed(2);
      var futureValue = Math.round(price * Math.pow(1 + assumedCagr, years));
      var totalRental = Math.round(rental.avgAnnual * years * 1.25);
      var totalWealth = futureValue + totalRental;
      var multiple = (totalWealth / price).toFixed(2);

      return {
        price: price,
        typology: typology.toUpperCase(),
        grossYieldPercentage: grossYield + '%',
        monthlyRentalRange: '₹' + rental.min.toLocaleString() + ' - ₹' + rental.max.toLocaleString(),
        projectedValue: futureValue,
        projectedWealth: totalWealth,
        wealthMultiple: multiple + 'x',
        formattedValue: '₹' + (futureValue / 100000).toFixed(2) + ' L*',
        formattedWealth: '₹' + (totalWealth / 100000).toFixed(2) + ' L*'
      };
    },
    getCagrBenchmarks: function () {
      return {
        historicalPeriod: "2020 - 2026",
        baseRate2020: "₹4,800/sq.ft",
        currentRate2026: "₹7,600/sq.ft",
        projectedPossession2028: "₹8,900/sq.ft",
        totalAppreciation: "58.3% Capital Growth"
      };
    }
  };
})();
