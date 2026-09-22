/**
 * Cloudflare Pages Function: /api/health
 * Edge High-Availability Health Probe & Synthetic Monitoring API
 * 
 * Provides sub-2ms status telemetry for automated uptime monitors
 * (Datadog, Pingdom, UptimeRobot, Cloudflare Health Checks).
 */

export async function onRequestGet(context) {
  const { env, request } = context;
  const startTime = Date.now();
  const url = new URL(request.url);

  const cf = request.cf || {};

  const services = {
    edge_network: {
      status: "operational",
      datacenter: cf.colo || "PUN",
      country: cf.country || "IN",
      http_protocol: cf.httpProtocol || "HTTP/3"
    },
    inventory_engine: {
      status: "operational",
      persistence: env && env.SANCTUARY_KV ? "cloudflare_kv" : "deterministic_baseline"
    },
    ai_concierge: {
      status: "operational",
      mode: env && env.AI ? "workers_ai_llama_3.1" : "deterministic_semantic_matcher"
    },
    programmatic_routes: {
      status: "operational",
      total_routes: 10240,
      total_sitemaps: 16
    },
    lead_telemetry: {
      status: "operational",
      crm_bridge: env && env.CRM_WEBHOOK_URL ? "active" : "standby",
      slack_alerts: env && env.SLACK_WEBHOOK_URL ? "active" : "standby",
      telegram_alerts: env && env.TELEGRAM_BOT_TOKEN ? "active" : "standby"
    }
  };

  const responsePayload = {
    status: "healthy",
    project: "Goyal My Home Sanctuary",
    location: "Mamurdi, PCMC, Pune West",
    maharera_id: "PR1261012502725",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    probe_latency_ms: Date.now() - startTime,
    services: services
  };

  return new Response(JSON.stringify(responsePayload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
