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
  2:[[182,600],[432,430],[776,224],[712,360],[548,300],[486,128]]
};
function zMissions(z){ return MISSIONS.filter(m=>m.z===z.id).sort((a,b)=>a.id-b.id); }
function zoneDone(z){ const m=zMissions(z); return m.length>0 && m.every(x=>S.done[x.id]); }
function zoneNext(z){ const m=zMissions(z); return m.find(x=>!S.done[x.id])||m[0]; }
function curZoneIx(zs){ const i=zs.findIndex(z=>!zoneDone(z)); return i<0?zs.length-1:i; }
/* small captive/freed friend figures near their rescue zone (Act-1 league). */
function mapFriends(a, zs, spots){
  const rescues = a===2 ? [{mid:128,kind:"kendall"}]
    : [{mid:3,kind:"tank"},{mid:6,kind:"flip"},{mid:8,kind:"sunny"},{mid:17,kind:"heart"},{mid:48,kind:"leighton"}];
  const byZi={};
  rescues.forEach(r=>{ const m=MISSIONS.find(x=>x.id===r.mid); if(!m)return;
    const zi=zs.findIndex(z=>z.id===m.z); if(zi<0)return; (byZi[zi]=byZi[zi]||[]).push(r); });
  let out="";
  Object.keys(byZi).forEach(zi=>{ const sp=spots[zi]; if(!sp)return; const [x,y]=sp;
    const list=byZi[zi]; const unf=list.find(r=>!S.done[r.mid]); const r=unf||list[list.length-1]; const freed=!unf;
    const fx=x+(x<500?72:-72);
    out+=`<g transform="translate(${fx} ${y-2}) scale(.5)">${allyMapFig(r.kind, freed)}</g>`; });
  return out;
}
function mapPaintSVG(){
  const a=currentAct(), zs=actZones(a), spots=ZONESPOTS[a]||[];
  const cur=curZoneIx(zs);
  let nodes="", hero="";
  zs.forEach((z,zi)=>{
    const [x,y]=spots[zi]||[500,375];
    const st= zoneDone(z)?"done":(zi===cur?"current":"locked");
    const nm=z.name.toUpperCase();
    const pw=Math.min(300,Math.max(150,nm.length*11+26)), R=36;
    nodes+=`<g class="mnode ${st}" data-zi="${zi}">
      <ellipse cx="${x}" cy="${y+32}" rx="32" ry="8" fill="#0a0414" opacity=".5"/>
      <circle class="obloom" cx="${x}" cy="${y}" r="${R+16}" fill="url(#node_${st})" opacity=".5" filter="url(#mglow)"/>
      <circle cx="${x}" cy="${y}" r="${R}" fill="url(#node_${st})" stroke="#0c0820" stroke-width="3"/>
      <circle cx="${x}" cy="${y}" r="${R-1}" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>
      <ellipse cx="${x}" cy="${y+13}" rx="${R*.62}" ry="${R*.36}" fill="#fff" opacity=".1"/>
      <ellipse cx="${x-9}" cy="${y-14}" rx="13" ry="8" fill="#fff" opacity=".5" transform="rotate(-28 ${x-9} ${y-14})"/>
      <circle cx="${x-13}" cy="${y-13}" r="4.5" fill="#fff" opacity=".9"/>
      ${ st==="done" ? `<text x="${x}" y="${y+13}" text-anchor="middle" font-family="Bangers" font-size="36" fill="#0c3f28">✓</text>`
        : st==="locked" ? `<g transform="translate(${x} ${y})" stroke="#150f2e" stroke-width="2.4"><path d="M-6 -1 v-4 a6 6 0 0 1 12 0 v4" fill="none" stroke="#d7d0ee"/><rect x="-10" y="-1" width="20" height="15" rx="3.5" fill="#d7d0ee"/></g>`
        : `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".95"/>` }
      <g transform="translate(${x},${y+R+22})" filter="url(#mpill)">
        <rect x="${-pw/2}" y="-17" width="${pw}" height="34" rx="13" fill="rgba(10,5,24,.82)" stroke="${st==="locked"?"#6a6090":"#ffce3a"}" stroke-width="2.2"/>
        <text x="0" y="6" text-anchor="middle" textLength="${pw-20}" lengthAdjust="spacingAndGlyphs" font-family="Bangers" font-size="17" fill="${st==="done"?"#9fe870":st==="locked"?"#9a92c0":"#ffe08a"}" letter-spacing="1">${nm}</text>
      </g></g>`;
    if(zi===cur) hero=`<g transform="translate(${x-30} ${y-150}) scale(.26)">${heroNow(250).replace(/<svg[^>]*>|<\/svg>/g,"")}</g>`;
  });
  return `<svg viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="node_done" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#bdffdc"/><stop offset=".5" stop-color="#3ec97e"/><stop offset="1" stop-color="#0f6a40"/></radialGradient>
      <radialGradient id="node_current" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#ffce3a"/><stop offset="1" stop-color="#b9760f"/></radialGradient>
      <radialGradient id="node_locked" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#5b5384"/><stop offset=".5" stop-color="#3b3360"/><stop offset="1" stop-color="#211c3a"/></radialGradient>
      <filter id="mglow" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="8"/></filter>
      <filter id="mpill" x="-15%" y="-60%" width="130%" height="220%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".55"/></filter>
      <style>@media (prefers-reduced-motion: no-preference){.mnode.current .obloom{animation:opul 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}}@keyframes opul{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.8;transform:scale(1.14)}}</style>
    </defs>
    <image href="${MAPIMG[a]||MAPIMG[1]}" x="0" y="0" width="1000" height="750" preserveAspectRatio="xMidYMid slice"/>
    ${mapFriends(a, zs, spots)}
    ${nodes}
    ${hero}
  </svg>`;
}
function toMap(){ sessionTick();
  if(!actMissions(currentAct()).length){ actComingSoon(); return; }  /* act with no content yet → safe landing */
  GEO=geomFor(currentAct()); show("scrMap");
  $("hudTitle").textContent=actInfo(currentAct()).city;
  $("mapSVGwrap").innerHTML=mapPaintSVG();
  const zs=actZones(currentAct());
  document.querySelectorAll("#mapSVGwrap .mnode").forEach(n=>{
    n.addEventListener("click",()=>{
      if(n.classList.contains("locked")){ Aud.play("locked_tip"); return; }  /* no skipping ahead */
      const z=zs[+n.dataset.zi]; const m=z&&zoneNext(z); if(m)startMission(m); });
  });
  Aud.play("pick");
}
