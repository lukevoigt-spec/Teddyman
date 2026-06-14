# Cloud save — one-time setup (~10–15 min, free, then zero maintenance)

This makes Teddy's progress live in the cloud, so it continues on **any** device
and survives clearing Safari. It's a single tiny Cloudflare Worker + a KV store.
You set it up once; after that there's nothing to maintain.

Security: the Worker is locked with a **family sync code** (a secret only you know).
You set that code on the Worker once, then type the *same code* into the game on each
device (Grown-Up Corner ▸ Backup ▸ Cloud sync). The same code on another iPad continues
right where he left off — and **nobody without the code can read or change his save**,
even if they know the Worker URL.

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
6. **Set your family sync code (the password):** same Worker ▸ **Settings** ▸
   **Variables and Secrets** ▸ **Add** ▸ type **Secret**:
   - Variable name: **`AUTH_SECRET`**  (exactly this)
   - Value: a **family code** you choose (a memorable phrase, e.g. `purple-otter-42`).
   ▸ **Save / Deploy**. *Keep this code — you'll type it into the game.*
   (Without `AUTH_SECRET` set, the Worker refuses every request — that's the lock.)
7. **The Worker URL is already baked into the game**, so you don't paste it. (If you
   used a different Worker name, tell Claude the URL once.)
8. **In the game:** Grown-Up Corner (⚙️) ▸ **Backup** tab ▸ type your **family sync
   code** under **Cloud sync** ▸ **Connect / Sync now**. You should see "Connected ✓".
9. **On any other iPad:** open the game ▸ same Grown-Up Corner ▸ type the **same
   family code** ▸ Connect. His progress appears.

## Multiple players (no setup change)
The same single Worker serves every player profile — each player syncs under its
own slot (keyed by name), so Teddy and your test account never collide. You set
up the Worker once; new players need nothing extra.

## Zero URL-pasting (already done)
The Worker URL is **baked into the game** (`DEFAULT_CLOUD_URL` in `state-save.js`), so
nobody ever pastes a URL. The only thing each device needs is the **family sync code**
typed once (Grown-Up Corner ▸ Backup). The code is cached on the device after that —
the child never sees a prompt. (Different Worker URL? Tell Claude and it'll update the
baked value.)

## How it behaves
- Progress always saves to the device first (instant, works offline), then
  syncs to the cloud a couple seconds later. Never blocks play.
- On app open, the **newer** of {cloud, device} wins, so the latest session
  always continues.
- If the cloud is unreachable, it silently falls back to device-only and tries
  again next save.

## Privacy / security
The save is protected by your **family sync code** (`AUTH_SECRET`):
- Every read/write must send the code (`Authorization: Bearer …`); a wrong or missing
  code is rejected (`401`). So even though the Worker URL is public (baked into this
  open-source game), **only someone with your code can read or change his save.**
- His save lives under an **unguessable slot** derived from the code (not his name), so
  the old `?k=teddy`-style guessing no longer works.
- The code is stored **only** as a Cloudflare secret on your Worker + cached locally on
  each device — it is **never** committed to this repo.
- Offline-first is preserved: a missing/wrong code just runs on the device's local save
  and never blocks play.

Pick a code that's memorable but not obvious (avoid the child's name/birthday).

## Wrangler (optional, for the CLI-inclined)
`wrangler.toml`:
```
name = "teddy-save"
main = "worker.js"
compatibility_date = "2024-01-01"
kv_namespaces = [{ binding = "SAVES", id = "<your-kv-id>" }]
```
Set the secret (not in the toml): `wrangler secret put AUTH_SECRET`  →  enter your code.
Then `wrangler deploy`.
