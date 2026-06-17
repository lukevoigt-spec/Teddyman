/* =========================================================
   SUPER TEDDY — PAINTED WORLD MAP  (extracted from game.js)
   Loaded as a classic <script> AFTER game.js, so it shares the global scope
   and every game.js symbol it uses ($, show, startMission, heroNow, currentAct,
   actZones, actMissions, actInfo, geomFor/GEO, allyMapFig, sessionTick,
   actComingSoon, Aud) already exists. Only runtime references — no load-time
   call into game.js — so the after-game.js load order is safe.

   One painted image per act (path + landmarks baked in); we overlay a glowing,
   tappable node on each zone's painted spot. Tapping the CURRENT zone plays its
   next mission; done zones replay; locked zones are gated (no skipping ahead).
   The per-mission flow / saves / mastery / finale logic is unchanged.
========================================================= */
const MAPIMG={1:"art/bg-map.jpeg", 2:"art/bg-map-a2.jpeg"};
/* zone landmark positions on the painted map, in a 1000x750 (4:3) space, in
   ZONES play order per act — calibrated by eye to sit on the painted golden path. */
const ZONESPOTS={
  1:[[215,640],[362,432],[298,300],[322,168],[560,212],[592,352],[722,330],[772,206],[838,108]],
  /* 8 zones (101,102,103,104,107,108,105,106 in play order). Legacy map is NOT rendered for Act 2
     (V2 is), but curriculum.test guards a spot per zone — keep parity. */
  2:[[182,620],[372,500],[560,400],[700,300],[640,230],[470,200],[300,150],[486,80]]
};
/* ---- ARENA MAP V2 (Act 1): a Braveland-style living campaign map ----
   The painting is a path-FREE landscape (house = start, Vex's lair = end); we draw the
   single connected dotted route + parchment banner markers as an overlay, in the painting's
   native 1536x1024 space (viewBox+slice fills the 4:3 stage). Node spots calibrated by eye
   onto the open corridor: house -> meadow -> bridge -> canyon -> fortress, 9 zones in order. */
const MAPSPOTS_V2={
  1:[[235,872],[300,712],[252,556],[404,470],[565,540],[690,650],[902,600],[1062,468],[1208,322]],
  /* Act 2 (8 zones): calibrated ONTO the painted dirt road in bg-map-a2 (1536x1024 space) — village
     (bottom-left) -> left-bank road -> the painted STONE BRIDGE crosses the river between idx 2 & 3 ->
     climb the right-bank dirt road -> the Dragon Keep at idx 7. Sits on the road, clear of the river.
     Play order: 101,102,103,104,107(cove),108(bridge),105,106. */
  2:[[360,798],[500,775],[615,750],[760,712],[885,648],[995,565],[1075,470],[1110,315]]
};
/* day/twilight by the DEVICE clock (the iPad is in the family's timezone): 6am-6pm day, else dusk. */
function mapBgFor(a){
  let h=12; try{ h=new Date().getHours(); }catch(e){}
  const day = h>=6 && h<18;
  if(a===1) return day ? "art/bg-map-a1-day.jpeg" : "art/bg-map-a1-twilight.jpeg";
  if(a===2) return day ? "art/bg-map-a2-day.jpeg" : "art/bg-map-a2-twilight.jpeg";
  return MAPIMG[a]||MAPIMG[1];
}
function zMissions(z){ return MISSIONS.filter(m=>m.z===z.id).sort((a,b)=>a.id-b.id); }
function zoneDone(z){ const m=zMissions(z); return m.length>0 && m.every(x=>S.done[x.id]); }
function zoneNext(z){ const m=zMissions(z); return m.find(x=>!S.done[x.id])||m[0]; }
function curZoneIx(zs){ const i=zs.findIndex(z=>!zoneDone(z)); return i<0?zs.length-1:i; }
/* small captive/freed friend figures near their rescue zone (Act-1 league). */
function mapFriends(a, zs, spots){
  /* derive from the LEAGUE roster (by act) so the rescue-pacing re-map lives in ONE place (allies.js) */
  const rescues = LEAGUE.filter(t=>Math.floor(t.mid/100)===(a-1)).map(t=>({mid:t.mid,kind:t.kind}));
  const byZi={};
  rescues.forEach(r=>{ const m=MISSIONS.find(x=>x.id===r.mid); if(!m)return;
    const zi=zs.findIndex(z=>z.id===m.z); if(zi<0)return; (byZi[zi]=byZi[zi]||[]).push(r); });
  let out="";
  Object.keys(byZi).forEach(zi=>{ const sp=spots[zi]; if(!sp)return; const [x,y]=sp;
    const list=byZi[zi]; const unf=list.find(r=>!allyFreed(r.kind)); const r=unf||list[list.length-1]; const freed=!unf;   /* durable freed-state (grandfathered) */
    const fx=x+(x<500?72:-72);
    /* pointer-events:none — decorative figures sit near the nodes and must never steal a node tap (MAP-1). */
    out+=`<g class="mfriend" pointer-events="none" transform="translate(${fx} ${y-2}) scale(.5)">${allyMapFig(r.kind, freed)}</g>`; });
  return out;
}
function mapPaintLegacy(){
  const a=currentAct(), zs=actZones(a), spots=ZONESPOTS[a]||[];
  const cur=curZoneIx(zs);
  let nodes="", hero="";
  const lblFont = a===2 ? "MedievalSharp, Bangers" : "Bangers";   /* medieval lettering on the Magic Kingdom map */
  zs.forEach((z,zi)=>{
    const [x,y]=spots[zi]||[500,375];
    const st= zoneDone(z)?"done":(zi===cur?"current":"locked");
    const nm=z.name.toUpperCase();
    const pw=Math.min(300,Math.max(150,nm.length*11+26)), R=36;
    nodes+=`<g class="mnode ${st}" data-zi="${zi}">
      <ellipse cx="${x}" cy="${y+32}" rx="32" ry="8" fill="#0a0414" opacity=".5"/>
      <circle class="obloom" cx="${x}" cy="${y}" r="${R+16}" fill="url(#node_${st})" opacity=".5" filter="url(#mglow)"/>
      <circle cx="${x}" cy="${y}" r="${R}" fill="url(#node_${st})" stroke="#0c0820" stroke-width="3"/>
      ${st==="current"?`<circle class="mbeacon" cx="${x}" cy="${y}" r="${R+10}" fill="none" stroke="#ffe9b0" stroke-width="4"/>`:""}
      <circle cx="${x}" cy="${y}" r="${R-1}" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>
      <g class="nspec">
        <ellipse cx="${x}" cy="${y+13}" rx="${R*.62}" ry="${R*.36}" fill="#fff" opacity=".1"/>
        <ellipse cx="${x-9}" cy="${y-14}" rx="13" ry="8" fill="#fff" opacity=".5" transform="rotate(-28 ${x-9} ${y-14})"/>
        <circle cx="${x-13}" cy="${y-13}" r="4.5" fill="#fff" opacity=".9"/>
      </g>
      ${ st==="done" ? `<path d="M${x-13} ${y+1} L${x-3} ${y+12} L${x+14} ${y-12}" fill="none" stroke="#0c3f28" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`
        : st==="locked" ? `<g transform="translate(${x} ${y})" stroke="#150f2e" stroke-width="2.4"><path d="M-6 -1 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke="#d7d0ee"/><rect x="-10" y="-1" width="20" height="15" rx="3.5" fill="#d7d0ee"/></g>`
        : `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".95"/>` }
      <g transform="translate(${x},${y+R+22})" filter="url(#mpill)">
        <rect x="${-pw/2}" y="-17" width="${pw}" height="34" rx="13" fill="rgba(10,5,24,.92)" stroke="${st==="locked"?"#8079a8":"#ffce3a"}" stroke-width="2.2"/>
        <text x="0" y="6" text-anchor="middle" font-family="${lblFont}" font-size="18" fill="${st==="done"?"#9fe870":st==="locked"?"#c7c0e6":"#ffe08a"}" letter-spacing="1">${nm}</text>
      </g></g>`;
    if(zi===cur){   /* PAINTED Teddy (heroMarquee, act-aware) standing AT the node — feet at its base, not floating on the disc */
      const s=.62, hx=x-s*120, hy=(y+4)-s*226;   /* seat local feet (120,226) at (x, y+4) */
      /* pointer-events:none — the hero renders ABOVE the current .mnode, so without this it would
         steal the start-mission tap and shrink the touch target (MAP-1 regression, constraint #6). */
      hero=`<g pointer-events="none"><ellipse cx="${x}" cy="${y+6}" rx="42" ry="12" fill="#0a0414" opacity=".5"/>`
        + `<g transform="translate(${hx} ${hy}) scale(${s})">${heroMarquee(250).replace(/<svg[^>]*>|<\/svg>/g,"")}</g></g>`;
    }
  });
  /* TIME PORTAL — opens once the Act-1 finale is cleared (story canon: Teddy follows
     the Vixen through it). Tapping it time-travels between Star Force City (Act 1) and
     the Magic Kingdom (Act 2): swaps map, music, and Teddy's outfit. */
  const portalOn = !!(S.done && S.done[48]) && (actMissions(a===1?2:1).length>0);
  let portal="";
  if(portalOn){ const PX=884, PY=624, PR=36, toCity=(a===1?"MAGIC KINGDOM":"STAR FORCE CITY");
    portal=`<g class="portalnode"><title>Time Portal → ${toCity}</title>
      <ellipse cx="${PX}" cy="${PY+34}" rx="30" ry="7" fill="#0a0414" opacity=".5"/>
      <circle class="pbloom" cx="${PX}" cy="${PY}" r="52" fill="url(#portalGrad)" opacity=".5" filter="url(#mglow)"/>
      <circle cx="${PX}" cy="${PY}" r="${PR}" fill="url(#portalGrad)" stroke="#0c0820" stroke-width="3"/>
      <g class="pspin" style="transform-box:fill-box;transform-origin:${PX}px ${PY}px">
        <path d="M${PX} ${PY-26} A26 26 0 0 1 ${PX+26} ${PY}" fill="none" stroke="#dff3ff" stroke-width="4" stroke-linecap="round" opacity=".85"/>
        <path d="M${PX} ${PY+26} A26 26 0 0 1 ${PX-26} ${PY}" fill="none" stroke="#cdeaff" stroke-width="4" stroke-linecap="round" opacity=".7"/>
        <path d="M${PX} ${PY-15} A15 15 0 0 1 ${PX+15} ${PY}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".95"/></g>
      <circle cx="${PX}" cy="${PY}" r="6" fill="#fffbe0"/>
      <g transform="translate(${PX},${PY+PR+22})" filter="url(#mpill)">
        <rect x="-74" y="-17" width="148" height="34" rx="13" fill="rgba(10,5,24,.82)" stroke="#b78bff" stroke-width="2.2"/>
        <text x="0" y="6" text-anchor="middle" font-family="${lblFont}" font-size="16" fill="#e6d2ff" letter-spacing="1">TIME PORTAL</text>
      </g></g>`; }
  return `<svg viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id="node_done" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#bdffdc"/><stop offset=".5" stop-color="#3ec97e"/><stop offset="1" stop-color="#0f6a40"/></radialGradient>
      <radialGradient id="node_current" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#ffce3a"/><stop offset="1" stop-color="#b9760f"/></radialGradient>
      <radialGradient id="node_locked" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#5b5384"/><stop offset=".5" stop-color="#3b3360"/><stop offset="1" stop-color="#211c3a"/></radialGradient>
      <radialGradient id="portalGrad" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe0"/><stop offset=".35" stop-color="#9be8ff"/><stop offset=".7" stop-color="#7a4fd6"/><stop offset="1" stop-color="#1a0e3a"/></radialGradient>
      <radialGradient id="mapVig" cx=".5" cy=".46" r=".72"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0a0414" stop-opacity=".5"/></radialGradient>
      <filter id="mglow" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="8"/></filter>
      <filter id="mpill" x="-15%" y="-60%" width="130%" height="220%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".55"/></filter>
      <style>@media (prefers-reduced-motion: no-preference){.mnode.current .obloom{animation:opul 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.pbloom{animation:opul 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.pspin{animation:pspin 6s linear infinite}}@keyframes opul{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.8;transform:scale(1.14)}}@keyframes pspin{to{transform:rotate(360deg)}}.portalnode{cursor:pointer}</style>
    </defs>
    <image href="${MAPIMG[a]||MAPIMG[1]}" x="0" y="0" width="1000" height="750" preserveAspectRatio="xMidYMid meet"/>
    <rect class="mapscrim" x="0" y="0" width="1000" height="750" fill="#0b0720" opacity=".26"/>
    <rect x="0" y="0" width="1000" height="750" fill="url(#mapVig)"/>
    ${mapFriends(a, zs, spots)}
    ${nodes}
    ${portal}
    ${hero}
  </svg>`;
}
/* path smoothing: quadratic through midpoints -> one flowing route through the spots */
function mapSmooth(pts){ let d=`M ${pts[0][0]} ${pts[0][1]}`;
  for(let i=1;i<pts.length-1;i++){ const mx=(pts[i][0]+pts[i+1][0])/2, my=(pts[i][1]+pts[i+1][1])/2;
    d+=` Q ${pts[i][0]} ${pts[i][1]} ${mx} ${my}`; }
  d+=` L ${pts[pts.length-1][0]} ${pts[pts.length-1][1]}`; return d; }
/* a parchment quest-banner level marker (Braveland style). Keeps .mnode[data-zi] (+ a
   transparent hit-rect for a big touch target) so toMap()'s click binding is unchanged. */
function mapBanner(x,y,st,zi){
  const band = st==="done"?"#3ec97e":st==="current"?"#ffce3a":"#9a90b0";
  const glow = st==="current"?`<circle cx="${x}" cy="${y-42}" r="58" fill="#ffd23a" opacity=".32" filter="url(#mglow)"/>`:"";
  const icon = st==="done"
    ? `<path d="M${x-12} ${y-42} L${x-3} ${y-33} L${x+13} ${y-52}" fill="none" stroke="#0c5a30" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
    : st==="locked"
    ? `<g transform="translate(${x} ${y-41})"><path d="M-7 -2 v-5 a7 7 0 0 1 14 0 v5" fill="none" stroke="#6a4a12" stroke-width="3.5"/><rect x="-11" y="-2" width="22" height="16" rx="4" fill="#c9b48a" stroke="#6a4a12" stroke-width="2.5"/></g>`
    : `<polygon points="${x},${y-58} ${x+5},${y-46} ${x+18},${y-46} ${x+8},${y-38} ${x+12},${y-26} ${x},${y-33} ${x-12},${y-26} ${x-8},${y-38} ${x-18},${y-46} ${x-5},${y-46}" fill="#fff3b0" stroke="#a06a14" stroke-width="2"/>`;
  return `<g class="mnode ${st}" data-zi="${zi}">
    ${glow}
    <ellipse cx="${x}" cy="${y+7}" rx="26" ry="7" fill="#0a0414" opacity=".4"/>
    <rect x="${x-3.5}" y="${y-68}" width="7" height="74" rx="3.5" fill="#7a5a30" stroke="#3a2614" stroke-width="2.4"/>
    <rect x="${x-25}" y="${y-70}" width="50" height="7" rx="3.5" fill="#7a5a30" stroke="#3a2614" stroke-width="2"/>
    <g filter="url(#bs)">
      <path d="M${x-23} ${y-68} h46 v50 l-9 8 -14 -7 -14 7 -9 -8 Z" fill="#efe0b6" stroke="#7a5a2a" stroke-width="3.4" stroke-linejoin="round"/>
      <rect x="${x-23}" y="${y-68}" width="46" height="14" fill="${band}" stroke="#7a5a2a" stroke-width="2.4"/>
    </g>
    ${icon}
    <rect x="${x-104}" y="${y-132}" width="208" height="208" fill="transparent"/>
    ${"" /* #162 (Morpheus QA / constraint #6): EVERY map node is interactive — current = "play next",
         done = replay, locked = gentle locked_tip cue — so all need a >=96px touch target. The 68×96 SVG-unit
         rect scaled to ≈34×48 CSS px at iPad-portrait (768w → meet scale 0.5), under the floor. A uniform
         208×208 hit area = ≈104 CSS px at 768-portrait (more on wider iPads / landscape). Overlap is harmless:
         the CURRENT node is drawn LAST (mapPaintV2) so it wins any tie (a near-miss launches play-next, never a
         locked-tip mis-tap), and same-state neighbours give the same cue either way. Painted visual untouched. */}
  </g>`;
}
/* which side of each node is WALKABLE GRASS (away from the river), so a captive friend is grounded on
   land — never floating over water. Per act, indexed by node (play order); +1 = right, -1 = left. */
const FRIEND_SIDE={
  1:[ 1, 1, 1, 1,-1, 1, 1,-1, 1],   // Act 1: idx4 left of the bridge, idx7 onto the castle ledge
  2:[-1,-1,-1, 1, 1, 1, 1,-1]       // Act 2: idx0-2 left bank, idx3-6 right bank, idx7 onto the keep path
};
/* exact-placement overrides (act → node idx → [x,y] translate) when the side-fan would land a friend
   awkwardly. Cal's zone node sits at the river crossing → put him on the open grass LEFT of the bridge. */
const FRIEND_POS={ 2:{ 3:[742,706] } };
/* CAPTIVE friends waiting AT the zone where they're freed (V2 scale, 1536-space). Once a friend
   is freed (allyFreed) they leave the map — they're in your league now, not stranded on the trail. */
function mapAlliesV2(a, zs, spots){
  /* derive from the LEAGUE roster (by act) so the rescue-pacing re-map lives in ONE place (allies.js) */
  const rescues = LEAGUE.filter(t=>Math.floor(t.mid/100)===(a-1)).map(t=>({mid:t.mid,kind:t.kind}));
  // group captives by the ZONE they're freed in, so several freed in one zone (e.g. Archie/Ellie/William
   // all in one zone) fan out beside that zone's banner instead of stacking.
  const byZi={};
  rescues.forEach(r=>{ if(allyFreed(r.kind)) return;            // freed → gone from the map
    const m=MISSIONS.find(x=>x.id===r.mid); if(!m)return;
    const zi=zs.findIndex(z=>z.id===m.z); if(zi<0||!spots[zi]) return;
    (byZi[zi]=byZi[zi]||[]).push(r); });
  let out="";
  const sides=FRIEND_SIDE[a], posOv=FRIEND_POS[a];
  Object.keys(byZi).forEach(zik=>{ const zi=+zik, [x,y]=spots[zi], list=byZi[zi];
    const dir = (sides && sides[zi]!=null) ? sides[zi] : (x<768?1:-1);   // push onto grass, not over the river
    const pos = posOv && posOv[zi];
    list.forEach((r,i)=>{ const fx = pos ? pos[0]+i*46 : x+dir*(56+i*46),
                          fy = pos ? pos[1] : y+6+((i%2)?-12:8);          // feet just below-beside the banner, on the path
      out+=`<g class="mfriend" pointer-events="none" transform="translate(${fx} ${fy}) scale(.66)">${allyMapFig(r.kind, false)}</g>`; }); });
  return out;
}
function mapPaintV2(a){
  const zs=actZones(a), spots=MAPSPOTS_V2[a]||[];
  const cur=curZoneIx(zs);
  /* P1 (Codex): the 3:2 painting is full-bleed `slice` in landscape, but in PORTRAIT slice would
     crop the wide map and push the edge nodes (house/fortress) off-screen → untappable. Use `meet`
     in portrait so the whole map + all 9 nodes stay visible; toMap() re-renders on orientation change. */
  const portrait = (typeof window!=="undefined" && window.innerHeight > window.innerWidth);
  const par = portrait ? "xMidYMid meet" : "xMidYMid slice";
  const lblFont = a===2 ? "MedievalSharp, Bangers" : "Bangers";
  const road = spots.length>1 ? mapSmooth(spots) : "";
  const trav = spots.length>1 ? mapSmooth(spots.slice(0, Math.min(cur+1, spots.length))) : "";
  let markers="", curMark=""; zs.forEach((z,zi)=>{ const [x,y]=spots[zi]||[768,512];
    const st = zoneDone(z)?"done":(zi===cur?"current":"locked"); const m=mapBanner(x,y,st,zi);
    if(st==="current") curMark=m; else markers+=m; });
  markers+=curMark;   /* #162: draw the CURRENT node LAST so its enlarged hit area is on top of any neighbour overlap */
  let hero="";
  if(spots[cur]){ const [cx,cy]=spots[cur]; const s=.82, hx=(cx-60)-s*120, hy=(cy+12)-s*226;
    hero=`<g pointer-events="none"><ellipse cx="${cx-60}" cy="${cy+14}" rx="46" ry="13" fill="#0a0414" opacity=".5"/>`
      + `<g transform="translate(${hx} ${hy}) scale(${s})">${heroMarquee(250).replace(/<svg[^>]*>|<\/svg>/g,"")}</g></g>`; }
  const portalOn = !!(S.done && S.done[48]) && (actMissions(a===1?2:1).length>0);
  let portal="";
  if(portalOn){ const PX=1395, PY=470;
    portal=`<g class="portalnode"><title>Time Portal</title>
      <circle class="pbloom" cx="${PX}" cy="${PY}" r="50" fill="url(#portalGrad)" opacity=".5" filter="url(#mglow)"/>
      <circle cx="${PX}" cy="${PY}" r="34" fill="url(#portalGrad)" stroke="#0c0820" stroke-width="3"/>
      <g class="pspin" style="transform-box:fill-box;transform-origin:${PX}px ${PY}px"><path d="M${PX} ${PY-24} A24 24 0 0 1 ${PX+24} ${PY}" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".9"/><path d="M${PX} ${PY+24} A24 24 0 0 1 ${PX-24} ${PY}" fill="none" stroke="#dff3ff" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>
      <circle cx="${PX}" cy="${PY}" r="6" fill="#fffbe0"/></g>`; }
  const qn = (zs[cur]&&zs[cur].name||"").toUpperCase();
  const quest = `<g transform="translate(768 980)" filter="url(#bs)">
    <rect x="-250" y="-27" width="500" height="54" rx="15" fill="url(#questgrad)" stroke="#7a5a2a" stroke-width="3.5"/>
    <rect x="-244" y="-22" width="488" height="12" rx="6" fill="#fff" opacity=".18"/>
    <text x="0" y="10" text-anchor="middle" font-family="${lblFont}" font-size="30" fill="#5a3a14" letter-spacing="1.5">${qn}</text></g>`;
  return `<svg viewBox="0 0 1536 1024" preserveAspectRatio="${par}">
    <defs>
      <linearGradient id="questgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e6bf"/><stop offset="1" stop-color="#d8c188"/></linearGradient>
      <radialGradient id="mapVigV2" cx=".5" cy=".42" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#0a0414" stop-opacity=".42"/></radialGradient>
      <radialGradient id="portalGrad" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe0"/><stop offset=".35" stop-color="#9be8ff"/><stop offset=".7" stop-color="#7a4fd6"/><stop offset="1" stop-color="#1a0e3a"/></radialGradient>
      <filter id="mglow" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id="bs" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="2" dy="4" stdDeviation="2.4" flood-color="#1a1008" flood-opacity=".55"/></filter>
      <style>@media (prefers-reduced-motion:no-preference){.mnode.current{animation:bnPulse 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center bottom}.pspin{animation:pspin 6s linear infinite}}@keyframes bnPulse{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes pspin{to{transform:rotate(360deg)}}body.calm .mnode.current{animation:none}</style>
    </defs>
    <image href="${mapBgFor(a)}" x="0" y="0" width="1536" height="1024" preserveAspectRatio="${par}"/>
    <rect x="0" y="0" width="1536" height="1024" fill="url(#mapVigV2)"/>
    <path d="${road}" fill="none" stroke="#3a2a14" stroke-width="13" stroke-linecap="round" stroke-dasharray="0.1 26" opacity=".4"/>
    <path d="${road}" fill="none" stroke="#f3e6c2" stroke-width="9" stroke-linecap="round" stroke-dasharray="0.1 26" opacity=".55"/>
    <path d="${trav}" fill="none" stroke="#fff6d8" stroke-width="10" stroke-linecap="round" stroke-dasharray="0.1 26" opacity=".95"/>
    ${mapAlliesV2(a, zs, spots)}
    ${markers}
    ${portal}
    ${hero}
    ${quest}
  </svg>`;
}
/* use the ARENA V2 design for any act that has new spots (Act 1 + 2); legacy for the rest. */
function mapPaintSVG(){ const a=currentAct(); return MAPSPOTS_V2[a] ? mapPaintV2(a) : mapPaintLegacy(); }
/* render the map SVG + (re)bind node/portal taps. Split out so an orientation change can re-render. */
function mapRepaint(){
  $("mapSVGwrap").innerHTML=mapPaintSVG();
  const zs=actZones(currentAct());
  document.querySelectorAll("#mapSVGwrap .mnode").forEach(n=>{
    n.addEventListener("click",()=>{
      if(n.classList.contains("locked")){ Aud.play("locked_tip"); return; }  /* no skipping ahead */
      const z=zs[+n.dataset.zi]; const m=z&&zoneNext(z); if(m)startMission(m); });
  });
  const pn=document.querySelector("#mapSVGwrap .portalnode");
  if(pn)pn.addEventListener("click",portalSwitch);
}
function toMap(){ sessionTick();
  if(!actMissions(currentAct()).length){ actComingSoon(); return; }  /* act with no content yet → safe landing */
  GEO=geomFor(currentAct()); show("scrMap");
  mapRepaint();
  if(typeof gemDexFill==="function") gemDexFill($("gemDexMap"));   /* #152: mastery counter on the map hub */
  /* P1: re-render on orientation/resize so landscape (slice, full-bleed) ↔ portrait (meet, no crop)
     stays correct and every node remains on-screen + tappable. Bound once; only repaints on the map. */
  if(typeof window!=="undefined" && !window.__mapResizeBound){ window.__mapResizeBound=true;
    let t=0; window.addEventListener("resize",()=>{ clearTimeout(t); t=setTimeout(()=>{
      const sm=$("scrMap"); if(sm && sm.classList.contains("on")) mapRepaint(); }, 180); }); }
  Aud.play("pick");
}
