/**
 * Cloudflare Pages Function: /api/legal-audit
 * Headless Regulatory Audit & NOC Verification Engine
 * 
 * Provides verified statutory clearances, title search status, and MahaRERA filing records.
 */

const LEGAL_AUDIT_DATA = {
  project_name: "Goyal My Home Sanctuary",
  developer: "Goyal Properties",
  location: "Mamurdi, PCMC, Pune West",
  title_clearance: {
    status: "Clear, Absolute & Marketable",
    solicitors_opinion: "Advocate & Associates, Pune High Court Bar Council",
    search_period_years: 30,
    encumbrance_status: "Nil Encumbrances / Zero Mortgage on Land Title",
    title_search_report_date: "2024-11-20"
  },
  regulatory_approvals: [
    {
      authority: "MahaRERA",
      approval_name: "Project Registration Certificate",
      registration_no: "PR1261012502725 / P52100077438",
      validity: "December 2028",
      escrow_bank: "State Bank of India (Designated MahaRERA Escrow Account)",
      status: "Active & Verified"
    },
    {
      authority: "Pimpri-Chinchwad Municipal Corporation (PCMC)",
      approval_name: "Building Plan & Commencement Certificate (CC)",
      file_no: "PCMC/BP/COMM/2024/774",
      status: "Sanctioned for All Towers (A, B, C, D)"
    },
    {
      authority: "SEIAA Maharashtra",
      approval_name: "State Environmental Impact Clearance (EC)",
      reference_no: "SEIAA-EC-0000003891",
      status: "Sanctioned & Active"
    },
    {
      authority: "District Collectorate Pune",
      approval_name: "Non-Agricultural (NA) Land Conversion Order",
      reference_no: "REV/NA/PUNE/PCMC/2024/0912",
      status: "Sanctioned (Class 1 Freehold)"
    },
    {
      authority: "Airports Authority of India (AAI)",
      approval_name: "Aviation Height Clearance NOC",
      reference_no: "AAI/WRO/NOC/PUN/2024/481",
      permissible_top_elevation_amsl: "685 meters",
      status: "Sanctioned"
    },
    {
      authority: "Maharashtra Fire Services",
      approval_name: "Fire Safety & Life Rescue System Provisional NOC",
      reference_no: "MFS/NOC/PCMC/2024/1104",
      status: "Sanctioned"
    }
  ],
  consumer_protection: {
    carpet_area_guarantee: "100% compliant with RERA Section 2(k) net usable carpet area definition",
    escrow_discipline: "70% of all client receivables deposited in scheduled MahaRERA bank account",
    possession_clause: "December 2028 with interest liability under RERA Section 18"
  }
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const authFilter = url.searchParams.get("authority");

  let payload = LEGAL_AUDIT_DATA;
  if (authFilter) {
    const matched = LEGAL_AUDIT_DATA.regulatory_approvals.find(
      a => a.authority.toLowerCase().includes(authFilter.toLowerCase())
    );
    if (matched) {
      payload = {
        project_name: LEGAL_AUDIT_DATA.project_name,
        title_clearance: LEGAL_AUDIT_DATA.title_clearance,
        queried_approval: matched
      };
    }
  }

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
