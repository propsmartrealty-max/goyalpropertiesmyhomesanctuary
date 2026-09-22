/**
 * Headless Maharashtra Stamp Duty & Total Cost Engine
 * Goyal My Home Sanctuary, Mamurdi, PCMC
 * 
 * Provides client-side instant statutory cost breakdown calculation
 * without modifying any visual DOM elements or typography.
 */

(function () {
  'use strict';

  window.SanctuaryTax = {
    calculateBreakdown: function (agreementValue, options) {
      agreementValue = parseFloat(agreementValue) || 6900000;
      options = options || {};
      var isFemale = Boolean(options.femaleOwner);

      var stampRate = isFemale ? 0.05 : 0.06; // 1% rebate in Maharashtra
      var stampDuty = Math.round(agreementValue * stampRate);
      var regFee = agreementValue > 3000000 ? 30000 : Math.round(agreementValue * 0.01);
      var gst = Math.round(agreementValue * 0.05); // 5% RERA under-construction
      var legal = 15000;

      var totalStatutory = stampDuty + regFee + gst + legal;
      var grandTotal = agreementValue + totalStatutory;

      return {
        agreementValue: agreementValue,
        femaleConcessionApplied: isFemale,
        stampDuty: stampDuty,
        registrationFee: regFee,
        gst: gst,
        legalCharges: legal,
        totalStatutoryDues: totalStatutory,
        grandTotalCost: grandTotal,
        formattedAgreement: '₹' + (agreementValue / 100000).toFixed(2) + ' L*',
        formattedTotalStatutory: '₹' + (totalStatutory / 100000).toFixed(2) + ' L*',
        formattedGrandTotal: '₹' + (grandTotal / 100000).toFixed(2) + ' L*'
      };
    }
  };
})();
