/* =========================================================
   Super Teddy — cloud save Worker (Cloudflare Workers + KV)
   One tiny endpoint that stores Teddy's progress so it follows him to any
   device. GET returns the saved JSON; PUT stores it. Keyed by ?k=... .
   AUTH: every request must carry  Authorization: Bearer <family code>  that
   matches the AUTH_SECRET binding (set with `wrangler secret put AUTH_SECRET`,
   NEVER committed). Fails CLOSED — no secret configured or a wrong/missing
   token => 401, so the save slot is never world-readable/writable.
   Needs a KV namespace bound as  SAVES  (see cloud/README.md).
========================================================= */
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    // Require the parent-set family secret. Fail closed (unset secret rejects everything).
    const auth = request.headers.get("Authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!env.AUTH_SECRET || !token || !constantEq(token, env.AUTH_SECRET)) {
      return new Response("unauthorized", { status: 401, headers: cors });
    }

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
// length-checked char compare so a matching token isn't revealed by early-exit timing
function constantEq(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
