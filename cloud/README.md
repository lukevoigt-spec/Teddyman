# Cloud save — one-time setup (~10–15 min, free, then zero maintenance)

This makes Teddy's progress live in the cloud, so it continues on **any** device
and survives clearing Safari. It's a single tiny Cloudflare Worker + a KV store.
You set it up once; after that there's nothing to maintain.

You'll paste the resulting **Worker URL** into the game (Grown-Up Corner ▸ Backup ▸
Cloud sync). The *same URL* on another iPad continues right where he left off.

## Steps (all in the Cloudflare dashboard — no command line needed)

1. **Make a free Cloudflare account** at https://dash.cloudflare.com (no card needed).
2. **Create the storage:** left sidebar ▸ **Storage & Databases ▸ KV** ▸ **Create
   namespace**. Name it `TEDDY_SAVES` ▸ Add.
3. **Create the Worker:** left sidebar ▸ **Workers & Pages** ▸ **Create** ▸
   **Create Worker**. Name it e.g. `teddy-save` ▸ **Deploy**.
4. **Paste the code:** on the Worker page ▸ **Edit code**. Delete what's there,
   paste the entire contents of `worker.js` (next to this file) ▸ **Deploy**.
5. **Connect the storage to the Worker:** Worker ▸ **Settings** ▸ **Bindings**
   (or **Variables**) ▸ **Add binding ▸ KV namespace**:
   - Variable name: **`SAVES`**  (exactly this — the code looks for it)
   - KV namespace: **`TEDDY_SAVES`**
   ▸ **Save / Deploy**.
6. **Copy the Worker URL** shown at the top of the Worker page, e.g.
   `https://teddy-save.your-name.workers.dev`.
7. **In the game:** Grown-Up Corner (⚙️) ▸ **Backup** tab ▸ paste the URL under
   **Cloud sync** ▸ **Connect / Sync now**. You should see "Connected ✓".
8. **On any other iPad:** open the game ▸ same Grown-Up Corner ▸ paste the **same
   URL** ▸ Connect. His progress appears.

## How it behaves
- Progress always saves to the device first (instant, works offline), then
  syncs to the cloud a couple seconds later. Never blocks play.
- On app open, the **newer** of {cloud, device} wins, so the latest session
  always continues.
- If the cloud is unreachable, it silently falls back to device-only and tries
  again next save.

## Privacy / security (kept simple on purpose)
The Worker is private to your account and free-tier. The URL is unguessable; the
game stores under a single fixed key. For a child's reading progress this is
plenty. If you ever want a passphrase on top, say so and I'll add one field.

## Wrangler (optional, for the CLI-inclined)
`wrangler.toml`:
```
name = "teddy-save"
main = "worker.js"
compatibility_date = "2024-01-01"
kv_namespaces = [{ binding = "SAVES", id = "<your-kv-id>" }]
```
Then `wrangler deploy`.
