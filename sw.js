/* Super Teddy service worker — OFFLINE resilience without staleness.
   Strategy: NETWORK-FIRST for same-origin GET (so a fresh main deploy always
   lands the moment the iPad is online), falling back to the cache only when the
   network fails (offline / spotty wifi). Cross-origin (fonts, cloud sync) is left
   to the browser. Self-updating: skipWaiting + clients.claim, old caches purged. */
const CACHE = "superteddy-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   /* let the browser handle CDNs / cloud sync */
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);                 /* always prefer the network when online */
      if (fresh && fresh.ok) { const c = await caches.open(CACHE); c.put(req, fresh.clone()); }
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);         /* offline → last good copy */
      return cached || caches.match("./index.html") || Response.error();
    }
  })());
});
