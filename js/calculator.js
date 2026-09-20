/**
 * The Travertine Sanctuary - Financial Investment & Loan Terminal
 * Banking amortized EMI calculations, dynamic canvas donut chart for warm beige theme
 */

function formatRupees(num) {
  if (num === null || isNaN(num)) return "₹0";
  return "₹" + Math.round(num).toLocaleString("en-IN");
}

function calculateFinancials() {
  const propertyVal = parseFloat(document.getElementById("calc-property-value").value) || 6250000;
  const downPaymentPct = parseFloat(document.getElementById("calc-down-payment").value) || 20;
  const interestRate = parseFloat(document.getElementById("calc-interest-rate").value) || 8.5;
  const tenureYears = parseInt(document.getElementById("calc-tenure").value) || 20;

  document.getElementById("disp-prop-val").textContent = formatRupees(propertyVal);
  document.getElementById("disp-down-val").textContent = `${downPaymentPct}% (${formatRupees(propertyVal * (downPaymentPct / 100))})`;
  document.getElementById("disp-rate-val").textContent = `${interestRate.toFixed(2)}% p.a.`;
  document.getElementById("disp-tenure-val").textContent = `${tenureYears} Years (${tenureYears * 12} Months)`;

  const downPaymentAmount = propertyVal * (downPaymentPct / 100);
  const principal = propertyVal - downPaymentAmount;

  const monthlyRate = interestRate / (12 * 100);
  const totalMonths = tenureYears * 12;

  let emi = 0;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    emi = principal * monthlyRate * factor / (factor - 1);
  } else {
    emi = principal / totalMonths;
  }

  const totalRepayment = emi * totalMonths;
  const totalInterest = totalRepayment - principal;

  const estMonthlyRent = (propertyVal * 0.054) / 12;
  const est5YrAppreciation = propertyVal * 0.42;

  document.getElementById("res-monthly-emi").textContent = formatRupees(emi);
  document.getElementById("res-principal-loan").textContent = formatRupees(principal);
  document.getElementById("res-total-interest").textContent = formatRupees(totalInterest);
  document.getElementById("res-total-payable").textContent = formatRupees(totalRepayment + downPaymentAmount);

  const rentEl = document.getElementById("res-est-rent");
  if (rentEl) rentEl.textContent = `${formatRupees(estMonthlyRent)} / mo`;

  const growthEl = document.getElementById("res-est-growth");
  if (growthEl) growthEl.textContent = `+${formatRupees(est5YrAppreciation)} (5-Yr ROI)`;

  drawBeigeChart(principal, totalInterest, downPaymentAmount);
}

function drawBeigeChart(principal, interest, downPayment) {
  const canvas = document.getElementById("emiChartCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 16;
  const innerRadius = radius * 0.68;

  ctx.clearRect(0, 0, width, height);

  const total = principal + interest + downPayment;
  if (total <= 0) return;

  const data = [
    { label: "Principal", value: principal, color: "#b88628" },
    { label: "Interest", value: interest, color: "#5c534a" },
    { label: "Down Payment", value: downPayment, color: "#416a5c" }
  ];

  let startAngle = -0.5 * Math.PI;

  data.forEach((segment) => {
    const sliceAngle = (segment.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = segment.color;
    ctx.fill();

    startAngle = endAngle;
  });

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#1e1a16";
  ctx.font = "bold 13px 'Space Grotesk', monospace";
  ctx.fillText("CAPITAL", centerX, centerY - 8);
  ctx.font = "600 11px 'Space Grotesk', monospace";
  ctx.fillStyle = "#b88628";
  ctx.fillText("BREAKDOWN", centerX, centerY + 10);
}

document.addEventListener("DOMContentLoaded", () => {
  const sliderIds = [
    "calc-property-value",
    "calc-down-payment",
    "calc-interest-rate",
    "calc-tenure"
  ];

  sliderIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", calculateFinancials);
  });

  calculateFinancials();
});
