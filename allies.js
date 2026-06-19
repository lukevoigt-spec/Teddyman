/* =========================================================
   SUPER TEDDY — HERO LEAGUE / ALLIES  (extracted from game.js)
   The real family/friends Teddy frees from the villain's cages: roster data
   (CAGED/ALLY/LEAGUE/ALLY_COL) + the small helpers that voice their cheers
   (allyLine/allyPop) and draw their little map figures (allyMapFig).

   Loaded as a classic <script> BEFORE game.js — it only declares data + funcs
   and references game.js / art.js symbols ($, S, allyFace) at runtime, so the
   before-game.js load order is safe. Used by missions (allyPop/allyLine), the
   Hero Base shelf (LEAGUE) and the map (allyMapFig/mapFriends in map.js).
========================================================= */
/* RESCUE PACING (parent 2026-06-15): one ally freed per zone, ~every 2 zones (was clustered in
   zone 1). tank=zone1(m8), flip=zone3(m26), sunny=zone5(m30), heart=zone7(m36), leighton=finale(m48).
   Save-safe: grandfather() seeds S.freed from the FROZEN legacy mids (LEGACY_RESCUE_MID, game.js) so
   anyone who already freed a friend under the old mids keeps them. */
/* name === real for everyone: Teddy knows his friends by their REAL names, not hero aliases (parent
   2026-06-16) — the old aliases (Tank/Flip/Sunny) confused him. Voice lines re-recorded to match. */
/* JJ re-added (parent 2026-06-19): freed in Act 1 like the others, at the zone-2 forge milestone (m17,
   a rescue-free zone — right after Archie's zone-1 rescue, fitting the two buddies). Quiet CAGED rescue
   (not rescue:true), exactly like Archie/Ellie/William; his freed line plays via the FREE map (game.js).
   Save-safe: existing mid, no new id; grandfather() seeds S.freed.jj for anyone who already cleared m17. */
const CAGED=[{mid:8,kind:"tank",name:"ARCHIE",real:"ARCHIE"},{mid:26,kind:"flip",name:"ELLIE",real:"ELLIE"},{mid:30,kind:"sunny",name:"WILLIAM",real:"WILLIAM"},{mid:17,kind:"jj",name:"JJ",real:"JJ"}];
/* Hero League: each friend (a REAL person Teddy knows) owns one mission type and
   cheers him BY NAME during it, once freed. Amelia cheers on every win. */
const ALLY={
  tank: {real:"Archie",  owns:"boss",   lines:["cheer_archie1","cheer_archie2"]},
  flip: {real:"Ellie",   owns:"trace",  lines:["cheer_ellie1","cheer_ellie2"]},
  sunny:{real:"William", owns:"patrol", lines:["cheer_will1","cheer_will2"]},
  heart:{real:"Amelia",  owns:"win",    lines:["heart_cheer1","heart_cheer2","heart_cheer3"]},
  /* JJ uses Archie's VOICE + LINES (parent 2026-06-19): role-T clips, Archie's cheer lines — no new
     audio to record. No owned mission cheer (owns:null) so his face never pops over an "Archie"-named
     line mid-task; he appears captive→freed on the map + speaks his own freed line in Archie's voice. */
  jj:   {real:"JJ",      owns:null,     lines:["cheer_archie1","cheer_archie2"]}
};
/* the mission that frees this friend — resolved from LEAGUE so EVERY kind (incl. leighton/kendall,
   which aren't in CAGED) maps correctly. Used only as the derived fallback below. */
function allyMid(kind){ const m=LEAGUE.find(x=>x.kind===kind); return m?m.mid:-1; }
/* freed = durably recorded (S.freed, survives a rescue-mid re-pacing) OR the rescue mission is done
   (the derived fallback, true for any save that pre-dates the grandfather seed). */
function allyFreed(kind){ return !!(S.freed&&S.freed[kind]) || !!S.done[allyMid(kind)]; }
function allyLine(kind){ const L=ALLY[kind].lines; return L[Math.floor(Math.random()*L.length)]; }
/* brief celebratory pop of the friend's face + name; auto-removes, no flash */
function allyPop(kind){ const st=$("stage"); if(!st)return;
  const d=document.createElement("div"); d.className="allypop";
  /* #60: cheer pops use the PAINTED RASTER portrait (ally-<kind>.png) for cast consistency with the
     league shelf + win face; SVG allyFace only as a fallback for kinds without a raster yet. */
  const raster=(typeof allyRasterImg==="function") && allyRasterImg(kind,76);
  d.innerHTML=(raster||`<svg viewBox="-34 -40 68 84" width="76" aria-hidden="true">${allyFace(kind)}</svg>`)+
    `<div class="allyname">${(ALLY[kind].real||"").toUpperCase()}!</div>`;
  st.appendChild(d); setTimeout(()=>d.remove(),2200); }
/* Full league roster for the Hero Base shelf (mid = mission that frees them).
   real = the actual person Teddy knows; name = their hero alias. */
const LEAGUE=[...CAGED.map(t=>({mid:t.mid,kind:t.kind,name:t.name,real:t.real})),
  {mid:36,kind:"heart",name:"AMELIA",real:"AMELIA"},
  {mid:48,kind:"leighton",name:"LEIGHTON",real:"LEIGHTON"},
  /* ACT 2 captured friends — rescued like the Act-1 league, spread across zones for fun progression
     (parent 2026-06-16): Brody at the Iron Forge (m118), Daisy at the Enchanter's Tower (m127), Cal at
     the Singing Glade (m137), Bryce at the Pirate Cove (m159), Nora at the Giant's Bridge (m172);
     Miss Kendall at the Dragon Keep finale (m128). NO hero aliases — Teddy knows them by their REAL
     names (parent 2026-06-16), so name === real. (JJ is back in ACT 1 via CAGED above — parent 2026-06-19.) */
  {mid:118,kind:"brody",name:"BRODY",real:"BRODY"},
  {mid:127,kind:"daisy",name:"DAISY",real:"DAISY"},
  {mid:137,kind:"cal",name:"CAL",real:"CAL"},
  {mid:159,kind:"bryce",name:"BRYCE",real:"BRYCE"},
  {mid:172,kind:"nora",name:"NORA",real:"NORA"},
  {mid:128,kind:"kendall",name:"MISS KENDALL",real:"MISS KENDALL"}];
/* a small LIVING friend on the map — recognizable little figure; captive ones
   wave for help with a ball-and-chain, freed ones cheer with arms up. */
const ALLY_COL={tank:"#e6453c", flip:"#3a9bff", sunny:"#ffce3a", heart:"#ff7d9c", leighton:"#a06ae8", kendall:"#e2574b", cal:"#2bb5a6", nora:"#b79be0", brody:"#4f9e4f", daisy:"#f2b6c6", bryce:"#3a7bd6", jj:"#ff8a3a"};
/* the newer RASTER ally art (real-photo-based standing token) for the WHOLE current cast
   (tank/flip/sunny/heart/leighton/cal/nora/brody/daisy/bryce/kendall); SVG fallback only if a png is missing.
   Used for the FULL-FIGURE showcases (hero card, homecoming) so they no longer show the old
   parametric SVG body. Small face-buttons keep allyFace (real-photo SVG likeness, reads fine tiny). */
function allyRasterImg(kind, w){
  /* Mom/Dad ship as mom.png/dad.png (not ally-*.png); allies as ally-<kind>.png */
  const file=(kind==="mom"||kind==="dad") ? kind : ("ally-"+kind);
  return (typeof RASTER!=="undefined" && RASTER[file])
    ? `<img src="art/${file}.png" width="${w}" height="${w}" alt="" style="display:block;object-fit:contain;" aria-hidden="true">` : null; }
function allyMapFig(kind, freed){
  /* Use the GENERATED RASTER token (real likeness) wherever it exists — for BOTH freed and captive
     friends (parent 2026-06-16: show the real image on the map, not the SVG). Feet grounded at ~y50,
     centred at x0, same footprint as the SVG figure so map placement is unchanged. A captive keeps a
     small ball-and-chain so it still reads as "needs rescuing"; freed shows the clean token. Only kinds
     without a raster (e.g. JJ until his art lands) fall back to the parametric SVG figure below. */
  if(typeof RASTER!=="undefined" && RASTER["ally-"+kind]){
    const chain = freed ? '' : `<g stroke="#5a5570" stroke-width="3"><line x1="7" y1="47" x2="21" y2="53"/></g><circle cx="25" cy="55" r="7" fill="#4a455e" stroke="#150f2e" stroke-width="2.5"/>`;
    return `<g><ellipse cx="0" cy="50" rx="20" ry="5.5" fill="#000" opacity=".3"/>`
      +`<g transform="translate(-50.4 -42.9) scale(.42)"><image x="8" y="2" width="224" height="224" href="art/ally-${kind}.png"/></g>${chain}</g>`;
  }
  const c=ALLY_COL[kind]||"#7a6fb0", u="mf"+(__huid++);
  const arms = freed
    ? `<path d="M-15 4 q-12 -12 -8 -26" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M15 4 q12 -12 8 -26" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`
    : `<path d="M15 2 q15 -2 14 -24" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-15 4 q-9 8 -7 17" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  const chain = freed ? '' : `<g stroke="#5a5570" stroke-width="3"><line x1="5" y1="47" x2="20" y2="53"/></g><circle cx="24" cy="55" r="7" fill="#4a455e" stroke="#150f2e" stroke-width="2.5"/>`;
  const torso=`M-15 2 q-3 30 4 42 l22 0 q7 -12 4 -42 q-15 -8 -30 0z`;
  return `<g>
    <defs><linearGradient id="${u}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>
    <ellipse cx="0" cy="50" rx="22" ry="6" fill="#000" opacity=".32"/>
    ${arms}
    <path d="${torso}" fill="${c}" stroke="#150f2e" stroke-width="4"/>
    <path d="${torso}" fill="url(#${u}t)"/>
    <circle cx="0" cy="20" r="4.6" fill="#fff" opacity=".9" stroke="#150f2e" stroke-width="2"/>
    <rect x="-11" y="40" width="9" height="13" rx="4" fill="#2a2440" stroke="#150f2e" stroke-width="3"/>
    <rect x="2" y="40" width="9" height="13" rx="4" fill="#2a2440" stroke="#150f2e" stroke-width="3"/>
    ${chain}
    <g transform="translate(0 -20) scale(.9)">${allyFace(kind)}</g>
  </g>`;
}
