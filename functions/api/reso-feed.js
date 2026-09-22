/**
 * Cloudflare Pages Function: functions/api/reso-feed.js
 * 
 * RESO (Real Estate Standards Organization) Data Dictionary v1.7 Compliance Feed
 * International Real Estate Syndication Standard for Global Investors & Aggregators
 * 
 * Complies with RESO Property Resource Specification & Open Data Standards.
 */

const RESO_DATA = {
  "@odata.context": "https://goyalmyhomesanctuary.in/api/$metadata#Property",
  "@odata.count": 8,
  "value": [
    {
      "ListingKey": "GMS-MAMURDI-2BHK-CLS",
      "ListingId": "GMS-2BHK-001",
      "StandardStatus": "Active",
      "MlsStatus": "New Launch",
      "PropertyType": "Residential",
      "PropertySubType": "Apartment",
      "DevelopmentStatus": "Under Construction",
      "StructureType": "High Rise (100% Monolithic MIVAN)",
      "UnparsedAddress": "Goyal My Home Sanctuary, Sector Mamurdi, PCMC, Pune West, Maharashtra 412101",
      "City": "Pimpri-Chinchwad",
      "PostalCity": "Pune",
      "StateOrProvince": "Maharashtra",
      "Country": "IN",
      "PostalCode": "412101",
      "Latitude": 18.66376,
      "Longitude": 73.7137836,
      "ListPrice": 6900000,
      "OriginalListPrice": 6900000,
      "PriceCurrency": "INR",
      "BedroomsTotal": 2,
      "BathroomsTotalInteger": 2,
      "LivingArea": 638,
      "LivingAreaMaximum": 745,
      "LivingAreaUnits": "Square Feet",
      "LivingAreaRange": "638 - 745 sq.ft (59.27 - 69.21 sq.m)",
      "PublicRemarks": "Official 2 BHK Classic residence at Goyal My Home Sanctuary, Mamurdi, Pune West. Features 72% biophilic forest canopy, 35,000 sq.ft clubhouse, zero-km Mumbai-Pune Expressway access, and 15 mins to Hinjawadi IT Park. MahaRERA: PR1261012502725.",
      "MahaReraRegistrationNumber": "PR1261012502725 / P52100077438",
      "DeveloperName": "Goyal Properties",
      "ListOfficeName": "PropSmart Realty",
      "ListOfficePhone": "+919175319441",
      "ListOfficeEmail": "propsmartrealty@gmail.com",
      "AssociationAmenities": [
        "Clubhouse", "Heated Swimming Pool", "Gymnasium", "Zen Garden", "Sky Observatory", "Amphitheater", "EV Charging", "Security 24/7"
      ],
      "PhotosCount": 25,
      "VirtualTourURLUnbranded": "https://goyalmyhomesanctuary.in/floor-plans-brochure",
      "ModificationTimestamp": "2026-09-22T19:30:00Z"
    },
    {
      "ListingKey": "GMS-MAMURDI-2BHK-PRM",
      "ListingId": "GMS-2BHK-002",
      "StandardStatus": "Active",
      "PropertyType": "Residential",
      "PropertySubType": "Apartment",
      "City": "Pimpri-Chinchwad",
      "PostalCity": "Pune",
      "PostalCode": "412101",
      "Country": "IN",
      "ListPrice": 7400000,
      "PriceCurrency": "INR",
      "BedroomsTotal": 2,
      "BathroomsTotalInteger": 2,
      "LivingArea": 704,
      "LivingAreaMaximum": 820,
      "LivingAreaUnits": "Square Feet",
      "PublicRemarks": "Spacious 2 BHK Premier with extended master suite and dual balconies overlooking Sahyadri foothills.",
      "MahaReraRegistrationNumber": "PR1261012502725",
      "DeveloperName": "Goyal Properties",
      "ListOfficeName": "PropSmart Realty"
    },
    {
      "ListingKey": "GMS-MAMURDI-2BHK-SIG",
      "ListingId": "GMS-2BHK-003",
      "StandardStatus": "Active",
      "PropertyType": "Residential",
      "PropertySubType": "Apartment",
      "City": "Pimpri-Chinchwad",
      "PostalCity": "Pune",
      "PostalCode": "412101",
      "Country": "IN",
      "ListPrice": 7900000,
      "PriceCurrency": "INR",
      "BedroomsTotal": 2,
      "BathroomsTotalInteger": 2,
      "LivingArea": 760,
      "LivingAreaMaximum": 895,
      "LivingAreaUnits": "Square Feet",
      "PublicRemarks": "Corner 2 BHK Signature unit with dual open decks and uninterrupted cross-ventilation.",
      "MahaReraRegistrationNumber": "PR1261012502725",
      "DeveloperName": "Goyal Properties",
      "ListOfficeName": "PropSmart Realty"
    },
    {
      "ListingKey": "GMS-MAMURDI-3BHK-CLS",
      "ListingId": "GMS-3BHK-001",
      "StandardStatus": "Active",
      "PropertyType": "Residential",
      "PropertySubType": "Apartment",
      "City": "Pimpri-Chinchwad",
      "PostalCity": "Pune",
      "PostalCode": "412101",
      "Country": "IN",
      "ListPrice": 8600000,
      "PriceCurrency": "INR",
      "BedroomsTotal": 3,
      "BathroomsTotalInteger": 3,
      "LivingArea": 848,
      "LivingAreaMaximum": 1045,
      "LivingAreaUnits": "Square Feet",
      "PublicRemarks": "3 BHK Classic family luxury layout featuring 3 baths, expansive living-dining space, and scenic forest vista.",
      "MahaReraRegistrationNumber": "PR1261012502725",
      "DeveloperName": "Goyal Properties",
      "ListOfficeName": "PropSmart Realty"
    },
    {
      "ListingKey": "GMS-MAMURDI-3BHK-PRM",
      "ListingId": "GMS-3BHK-002",
      "StandardStatus": "Active",
      "PropertyType": "Residential",
      "PropertySubType": "Apartment",
      "City": "Pimpri-Chinchwad",
      "PostalCity": "Pune",
      "PostalCode": "412101",
      "Country": "IN",
      "ListPrice": 9700000,
      "PriceCurrency": "INR",
      "BedroomsTotal": 3,
      "BathroomsTotalInteger": 3,
      "LivingArea": 924,
      "LivingAreaMaximum": 1180,
      "LivingAreaUnits": "Square Feet",
      "PublicRemarks": "3 BHK Premier residence tailored for corporate executives and senior IT managers with grand entrance foyer.",
      "MahaReraRegistrationNumber": "PR1261012502725",
      "DeveloperName": "Goyal Properties",
      "ListOfficeName": "PropSmart Realty"
    },
    {
      "ListingKey": "GMS-MAMURDI-3BHK-SIG",
      "ListingId": "GMS-3BHK-003",
      "StandardStatus": "Active",
      "PropertyType": "Residential",
      "PropertySubType": "Apartment",
      "City": "Pimpri-Chinchwad",
      "PostalCity": "Pune",
      "PostalCode": "412101",
      "Country": "IN",
      "ListPrice": 10500000,
      "PriceCurrency": "INR",
      "BedroomsTotal": 3,
      "BathroomsTotalInteger": 3,
      "LivingArea": 1036,
      "LivingAreaMaximum": 1290,
      "LivingAreaUnits": "Square Feet",
      "PublicRemarks": "Presidential 3 BHK Signature Sky Suite occupying premium highest floor corners with panoramic horizon vistas.",
      "MahaReraRegistrationNumber": "PR1261012502725",
      "DeveloperName": "Goyal Properties",
      "ListOfficeName": "PropSmart Realty"
    },
    {
      "ListingKey": "GMS-MAMURDI-4BHK-DPX",
      "ListingId": "GMS-4BHK-001",
      "StandardStatus": "Active",
      "PropertyType": "Residential",
      "PropertySubType": "Apartment",
      "City": "Pimpri-Chinchwad",
      "PostalCity": "Pune",
      "PostalCode": "412101",
      "Country": "IN",
      "ListPrice": 18500000,
      "PriceCurrency": "INR",
      "BedroomsTotal": 4,
      "BathroomsTotalInteger": 4,
      "LivingArea": 1850,
      "LivingAreaUnits": "Square Feet",
      "PublicRemarks": "Double-height duplex sky villa with internal architectural staircase and dual entertaining lounges.",
      "MahaReraRegistrationNumber": "PR1261012502725",
      "DeveloperName": "Goyal Properties",
      "ListOfficeName": "PropSmart Realty"
    },
    {
      "ListingKey": "GMS-MAMURDI-PENTHOUSE",
      "ListingId": "GMS-PNT-001",
      "StandardStatus": "Active",
      "PropertyType": "Residential",
      "PropertySubType": "Apartment",
      "City": "Pimpri-Chinchwad",
      "PostalCity": "Pune",
      "PostalCode": "412101",
      "Country": "IN",
      "ListPrice": 24000000,
      "PriceCurrency": "INR",
      "BedroomsTotal": 5,
      "BathroomsTotalInteger": 5,
      "LivingArea": 2400,
      "LivingAreaUnits": "Square Feet",
      "PublicRemarks": "Exclusive penthouse sky sanctuary with private open terrace, plunge pool, and 360-degree valley panorama.",
      "MahaReraRegistrationNumber": "PR1261012502725",
      "DeveloperName": "Goyal Properties",
      "ListOfficeName": "PropSmart Realty"
    }
  ]
};

export async function onRequest(context) {
  const { request } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=UTF-8',
    'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
    'X-RESO-Data-Dictionary': 'v1.7',
    'X-Robots-Tag': 'index, follow'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  return new Response(JSON.stringify(RESO_DATA, null, 2), {
    status: 200,
    headers: corsHeaders
  });
}
