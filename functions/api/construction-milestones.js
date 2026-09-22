/**
 * Cloudflare Pages Function: /api/construction-milestones
 * Headless Construction Progress & MahaRERA Milestone Telemetry Engine
 * 
 * Provides verifiable engineering milestone metrics toward the December 2028 possession target.
 */

const PROJECT_MILESTONES = {
  project_name: "Goyal My Home Sanctuary",
  maharera_reg_no: "PR1261012502725 / P52100077438",
  target_possession: "December 2028",
  structural_system: "Mivan Monolithic Aluminum Formwork RCC",
  current_cycle_speed: "7 days per typical floor slab casting",
  overall_project_progress_pct: 32.5,
  last_certified_audit_date: "2026-08-15",
  towers: [
    {
      tower_id: "tower-a",
      name: "Tower A (West Wing)",
      total_floors: 22,
      current_stage: "Typical Floor Slab Casting (Level 12)",
      progress_pct: 54.5,
      foundation_status: "100% Completed on Basalt Bedrock",
      plinth_status: "100% Completed",
      slab_casting_progress: "12 of 22 floors cast",
      mep_roughin_progress: "Levels 1 to 8 completed",
      finishing_stage: "Masonry & Internal Plastering in progress"
    },
    {
      tower_id: "tower-b",
      name: "Tower B (Central Valley View)",
      total_floors: 22,
      current_stage: "Typical Floor Slab Casting (Level 10)",
      progress_pct: 45.4,
      foundation_status: "100% Completed",
      plinth_status: "100% Completed",
      slab_casting_progress: "10 of 22 floors cast",
      mep_roughin_progress: "Levels 1 to 6 completed",
      finishing_stage: "Internal conduits completed to Level 6"
    },
    {
      tower_id: "tower-c",
      name: "Tower C (East Green Canopy)",
      total_floors: 20,
      current_stage: "Podium & Lower Level Slabs (Level 6)",
      progress_pct: 30.0,
      foundation_status: "100% Completed",
      plinth_status: "100% Completed",
      slab_casting_progress: "6 of 20 floors cast",
      mep_roughin_progress: "Levels 1 to 3 completed",
      finishing_stage: "Underground utilities and sump casting complete"
    },
    {
      tower_id: "tower-d",
      name: "Tower D (Clubhouse & Amenities View)",
      total_floors: 20,
      current_stage: "Podium Level Slab Reinforcement (Level 4)",
      progress_pct: 20.0,
      foundation_status: "100% Completed",
      plinth_status: "100% Completed",
      slab_casting_progress: "4 of 20 floors cast",
      mep_roughin_progress: "Basement 1 & 2 MEP rough-ins complete",
      finishing_stage: "Retaining walls & waterproofing 100% certified"
    }
  ],
  infrastructure_milestones: {
    podium_waterproofing_progress_pct: 65.0,
    clubhouse_superstructure_progress_pct: 42.0,
    swimming_pool_civil_structure_pct: 55.0,
    sewage_treatment_plant_civil_pct: 80.0,
    rainwater_harvesting_percolation_pits_pct: 100.0,
    electrical_substation_civil_pct: 70.0
  }
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const towerFilter = url.searchParams.get("tower");

  let result = PROJECT_MILESTONES;
  if (towerFilter) {
    const selectedTower = PROJECT_MILESTONES.towers.find(
      t => t.tower_id.toLowerCase() === towerFilter.toLowerCase() || t.name.toLowerCase().includes(towerFilter.toLowerCase())
    );
    if (selectedTower) {
      result = {
        project_name: PROJECT_MILESTONES.project_name,
        maharera_reg_no: PROJECT_MILESTONES.maharera_reg_no,
        target_possession: PROJECT_MILESTONES.target_possession,
        tower: selectedTower
      };
    }
  }

  return new Response(JSON.stringify(result, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
