/**
 * Headless Multi-Currency & Purchasing Power Engine
 * Goyal My Home Sanctuary, Mamurdi, PCMC
 * 
 * Provides client-side instant conversion across 10 major global currencies
 * without modifying any visual DOM elements or typography.
 */

(function () {
  'use strict';

  var RATES = {
    INR: 1.0,
    USD: 0.01196,
    AED: 0.04393,
    GBP: 0.00921,
    EUR: 0.01096,
    SGD: 0.01567,
    CAD: 0.01626,
    AUD: 0.01792,
    QAR: 0.04357,
    SAR: 0.04484
  };

  var SYMBOLS = {
    INR: "₹",
    USD: "$",
    AED: "AED ",
    GBP: "£",
    EUR: "€",
    SGD: "S$",
    CAD: "CA$",
    AUD: "A$",
    QAR: "QAR ",
    SAR: "SAR "
  };

  window.SanctuaryCurrency = {
    convert: function (inrAmount, targetCurrency) {
      targetCurrency = (targetCurrency || 'USD').toUpperCase();
      var rate = RATES[targetCurrency] || RATES.USD;
      var sym = SYMBOLS[targetCurrency] || "$";
      var converted = Math.round(inrAmount * rate);
      return {
        amount: converted,
        currency: targetCurrency,
        formatted: sym + converted.toLocaleString()
      };
    },
    getRates: function () {
      return Object.assign({}, RATES);
    },
    calculateEmi: function (inrAmount, targetCurrency, tenureYears, rateAnnual) {
      targetCurrency = (targetCurrency || 'USD').toUpperCase();
      tenureYears = tenureYears || 20;
      rateAnnual = rateAnnual || 0.075;

      var conversion = this.convert(inrAmount, targetCurrency);
      var principal = conversion.amount * 0.8; // 80% LTV
      var monthlyRate = rateAnnual / 12;
      var months = tenureYears * 12;

      var emi = Math.round(
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      );

      var sym = SYMBOLS[targetCurrency] || "$";
      return {
        currency: targetCurrency,
        principal: Math.round(principal),
        monthlyEmi: emi,
        formattedEmi: sym + emi.toLocaleString() + ' / mo*'
      };
    }
  };
})();
