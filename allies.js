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
const CAGED=[{mid:3,kind:"tank",name:"TANK",real:"ARCHIE"},{mid:6,kind:"flip",name:"FLIP",real:"ELLIE"},{mid:8,kind:"sunny",name:"SUNNY",real:"WILLIAM"}];
/* Hero League: each friend (a REAL person Teddy knows) owns one mission type and
   cheers him BY NAME during it, once freed. Amelia cheers on every win. */
const ALLY={
  tank: {real:"Archie",  owns:"boss",   lines:["cheer_archie1","cheer_archie2"]},
  flip: {real:"Ellie",   owns:"trace",  lines:["cheer_ellie1","cheer_ellie2"]},
  sunny:{real:"William", owns:"patrol", lines:["cheer_will1","cheer_will2"]},
  heart:{real:"Amelia",  owns:"win",    lines:["heart_cheer1","heart_cheer2","heart_cheer3"]}
};
function allyMid(kind){ if(kind==="heart")return 17;
  const c=CAGED.find(x=>x.kind===kind); return c?c.mid:-1; }
function allyFreed(kind){ return !!S.done[allyMid(kind)]; }
function allyLine(kind){ const L=ALLY[kind].lines; return L[Math.floor(Math.random()*L.length)]; }
/* brief celebratory pop of the friend's face + name; auto-removes, no flash */
function allyPop(kind){ const st=$("stage"); if(!st)return;
  const d=document.createElement("div"); d.className="allypop";
  d.innerHTML=`<svg viewBox="-34 -40 68 84" width="76" aria-hidden="true">${allyFace(kind)}</svg>`+
    `<div class="allyname">${(ALLY[kind].real||"").toUpperCase()}!</div>`;
  st.appendChild(d); setTimeout(()=>d.remove(),2200); }
/* Full league roster for the Hero Base shelf (mid = mission that frees them).
   real = the actual person Teddy knows; name = their hero alias. */
const LEAGUE=[...CAGED.map(t=>({mid:t.mid,kind:t.kind,name:t.name,real:t.real})),
  {mid:17,kind:"heart",name:"HEARTGUARD",real:"AMELIA"},
  {mid:48,kind:"leighton",name:"STARLIGHT PRINCESS",real:"LEIGHTON"},
  {mid:128,kind:"kendall",name:"MISS KENDALL",real:"MISS KENDALL"}];
/* a small LIVING friend on the map — recognizable little figure; captive ones
   wave for help with a ball-and-chain, freed ones cheer with arms up. */
const ALLY_COL={tank:"#e6453c", flip:"#3a9bff", sunny:"#ffce3a", heart:"#ff7d9c", leighton:"#a06ae8", kendall:"#5fa86a"};
function allyMapFig(kind, freed){
  /* RESCUED ally with generated art -> show the raster token (feet grounded at ~y50, centred at x0),
     same footprint as the SVG figure so map placement is unchanged. Captive (or no-raster) allies keep
     the SVG figure (the raster is a happy standing pose, wrong for a caged captive). */
  if(freed && typeof RASTER!=="undefined" && RASTER["ally-"+kind]){
    return `<g><ellipse cx="0" cy="50" rx="20" ry="5.5" fill="#000" opacity=".3"/>`
      +`<g transform="translate(-50.4 -42.9) scale(.42)"><image x="8" y="2" width="224" height="224" href="art/ally-${kind}.png"/></g></g>`;
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
