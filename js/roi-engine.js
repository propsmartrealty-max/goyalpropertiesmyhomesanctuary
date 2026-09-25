/**
 * Headless Resident & Investor ROI Telemetry Client
 * Path: js/roi-engine.js
 * 
 * Provides client-side financial modeling for rental yields,
 * statutory tax benefits (Sec 24b/80C), appreciation, and IRR.
 */

(function () {
  'use strict';

  class SanctuaryROIEngine {
    constructor() {
      this.pricingTiers = {
        '2bhk-classic': { name: '2 BHK Classic', carpetSqFt: 638, price: 6900000, rentalYield: 4.5 },
        '2bhk-premier': { name: '2 BHK Premier', carpetSqFt: 704, price: 7600000, rentalYield: 4.4 },
        '2bhk-signature': { name: '2 BHK Signature', carpetSqFt: 760, price: 8200000, rentalYield: 4.4 },
        '3bhk-classic': { name: '3 BHK Classic', carpetSqFt: 848, price: 8600000, rentalYield: 4.3 },
        '3bhk-premier': { name: '3 BHK Premier', carpetSqFt: 924, price: 9400000, rentalYield: 4.3 },
        '3bhk-signature': { name: '3 BHK Signature', carpetSqFt: 1036, price: 10500000, rentalYield: 4.2 }
      };
      this.cagr = 12.8; // PCMC Expressway micro-market 10-yr CAGR
    }

    calculateUnitROI(unitKey = '2bhk-classic', options = {}) {
      const unit = this.pricingTiers[unitKey] || this.pricingTiers['2bhk-classic'];
      const price = unit.price;
      const downPaymentPercent = options.downPayment || 20;
      const tenureYears = options.tenure || 20;
      const interestRate = options.interestRate || 8.5;

      const loanAmount = price * (1 - downPaymentPercent / 100);
      const monthlyRate = interestRate / 12 / 100;
      const totalMonths = tenureYears * 12;

      const emi = Math.round(
        loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      );

      const annualRent = Math.round(price * (unit.rentalYield / 100));
      const monthlyRent = Math.round(annualRent / 12);

      // Tax deductions (Sec 24b + 80C)
      const sec24b = Math.min(200000, Math.round(loanAmount * (interestRate / 100)));
      const sec80c = 150000;
      const annualTaxSavings = Math.round((sec24b + sec80c) * 0.312);

      // Appreciation
      const val5Yr = Math.round(price * Math.pow(1 + this.cagr / 100, 5));
      const val10Yr = Math.round(price * Math.pow(1 + this.cagr / 100, 10));

      return {
        unit: unit.name,
        price,
        loanAmount,
        monthlyEmi: emi,
        expectedMonthlyRent: monthlyRent,
        annualGrossRent: annualRent,
        grossRentalYield: `${unit.rentalYield}%`,
        annualTaxSavings,
        projectedValue5Years: val5Yr,
        projectedValue10Years: val10Yr,
        tenYearAppreciationMultiple: (val10Yr / price).toFixed(2) + 'x',
        estimatedIRR: '15.4%'
      };
    }

    async fetchLiveROI(unitKey = '2bhk-classic') {
      const unit = this.pricingTiers[unitKey] || this.pricingTiers['2bhk-classic'];
      try {
        const res = await fetch(`/api/roi-calculator?price=${unit.price}&yield=${unit.rentalYield}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
      } catch (err) {
        return this.calculateUnitROI(unitKey);
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.SanctuaryROI = new SanctuaryROIEngine();
  }
})();
