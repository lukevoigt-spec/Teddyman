/* =========================================================
   Super Teddy — cloud save Worker (Cloudflare Workers + KV)
   One tiny endpoint that stores Teddy's progress so it follows him to any
   device. GET returns the saved JSON; PUT stores it. Keyed by ?k=... (the
   game uses a fixed key, so the same Worker URL on any device = same save).
   Needs a KV namespace bound as  SAVES  (see cloud/README.md).
========================================================= */
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    const url = new URL(request.url);
    const k = url.searchParams.get("k");
    if (!k) return new Response("missing key", { status: 400, headers: cors });
    const id = "save:" + k;

    if (request.method === "GET") {
      const v = await env.SAVES.get(id);
      return new Response(v || "", { headers: { ...cors, "Content-Type": "application/json" } });
    }
    if (request.method === "PUT") {
      const body = await request.text();
      if (body.length > 300000) return new Response("too large", { status: 413, headers: cors });
      await env.SAVES.put(id, body);
      return new Response("ok", { headers: cors });
    }
    return new Response("method not allowed", { status: 405, headers: cors });
  },
};
