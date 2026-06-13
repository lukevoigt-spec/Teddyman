/* =========================================================
   ART — shared character renderers (refined flat-vector "Style C").
   Pure SVG-string functions, no game state. Loaded before game.js and
   reused by the style/preview labs so there's a single source of truth.
   Currently: heroSVG (parametric: muscle / weapon / cape / gear).
========================================================= */
let __huid=0;
/* THEMES — per-act costume palette. "hero" = Act-1 blue super-suit; "knight" =
   Act-2 medieval steel armor (the Vixen stole his powers, so he re-suits as a
   knight). Only the suit gradient + the head (super-mask vs helm) differ. */
const HERO_THEMES={
  hero:  {suit:["#3b82f0","#2257c4"], muscle:"#173f8f", sheen:"#6ea4f7"},
  knight:{suit:["#cfd6e0","#79828f"], muscle:"#5b6470", sheen:"#eef2f7"}
};
function heroSVG(w=200,o={}){
const u="h"+(__huid++);
const m=o.muscle||0, sx=1+0.07*m;
/* ACT-2 RANK TIERS — power level 0/1/2 = SQUIRE (leather) → SOLDIER (mail+steel cap)
   → KNIGHT (full steel plate). Firm medieval progression mirroring Act-1 muscle stages. */
const KNIGHT_TIER=[{suit:["#9a6738","#5a3a1f"],muscle:"#4a2f18",sheen:"#caa06a"},
                   {suit:["#9aa3b5","#666e7c"],muscle:"#454c5a",sheen:"#dfe6f0"},
                   {suit:["#cfd6e0","#79828f"],muscle:"#5b6470",sheen:"#eef2f7"}];
const th = o.theme==="knight" ? KNIGHT_TIER[Math.min(2,m)] : (HERO_THEMES[o.theme||"hero"]||HERO_THEMES.hero);
const capes={red:["#ef5348","#b92f33"],gold:["#ffd75e","#e08f1f"],purple:["#a06ae8","#6b2fa0"]};
const cp=capes[o.cape||"red"]||capes.red;
/* Act-2 knights wear NO cape (medieval, not superhero); boots take the tier's armor/leather colour */
const knight=o.theme==="knight";
const bootFill=knight?th.suit[1]:`url(#${u}cape)`;
/* squire wears a cloth TUNIC (green), soldier a mail surcoat (grey); the full knight has plate, no tunic */
const tunic=knight&&m<2 ? (m>=1?"#5a6270":"#5b7a3a") : null;
const tunicHTML=tunic ? `<path d="M88 268 L160 268 L176 346 L72 346Z" fill="${tunic}" stroke="#150f2e" stroke-width="6" stroke-linejoin="round"/><path d="M124 270 L124 344" stroke="#150f2e" stroke-width="2.5" opacity=".35"/><path d="M124 270 L176 346 L130 346Z" fill="#000" opacity=".14"/>` : "";
let weapon="";
if(o.weapon==="hammer"){weapon=`<g transform="translate(196 6) rotate(16)" stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<rect x="-8" y="36" width="16" height="130" rx="8" fill="#8a5a33"/>
<rect x="-52" y="-14" width="104" height="56" rx="14" fill="url(#${u}gold)"/>
<rect x="-52" y="-14" width="20" height="56" rx="10" fill="#fff0bd"/>
<path d="M58 -22 l16 -10 l-6 14 l16 -2 l-14 12" fill="none" stroke="#ffd75e" stroke-width="5" stroke-linecap="round"/></g>`;}
if(o.weapon==="sword"){weapon=`<g transform="translate(206 -8) rotate(10)" stroke="#150f2e" stroke-width="5" stroke-linejoin="round">
<polygon points="0,-120 16,-96 16,60 -16,60 -16,-96" fill="#dfe9ff"/>
<polygon points="0,-120 16,-96 0,-96" fill="#aebfe8"/>
<rect x="-34" y="58" width="68" height="18" rx="8" fill="url(#${u}gold)"/>
<rect x="-9" y="74" width="18" height="46" rx="8" fill="#8a5a33"/>
<circle cx="0" cy="128" r="11" fill="url(#${u}gold)"/></g>`;}
const heldWeapon = o.weapon==="hammer"||o.weapon==="sword";
const biceps = m>=1 ? `<ellipse cx="44" cy="196" rx="${13+5*m}" ry="${11+4*m}" fill="url(#${u}suit)" stroke="#150f2e" stroke-width="5"/>`+(heldWeapon?``:`<ellipse cx="204" cy="196" rx="${13+5*m}" ry="${11+4*m}" fill="url(#${u}suit)" stroke="#150f2e" stroke-width="5"/>`) : "";
/* arms: left fist always on hip; right hand either on hip OR raised gripping the weapon */
const armL=`<path d="M86 150 Q44 160 34 208 Q32 234 54 252 L84 262 L96 248 L70 236 Q54 226 60 206 Q68 172 96 162Z" fill="url(#${u}suit)"/><circle cx="84" cy="258" r="15" fill="#e6453c"/><path d="M76 252 a9 9 0 0 1 9 -5" stroke="#ffb3ad" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const armRhip=`<path d="M162 150 Q204 160 214 208 Q216 234 194 252 L164 262 L152 248 L178 236 Q194 226 188 206 Q180 172 152 162Z" fill="url(#${u}suit)"/><circle cx="164" cy="258" r="15" fill="url(#${u}gold)"/><path d="M156 252 a9 9 0 0 1 9 -5" stroke="#fff0bd" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const armRup=`<path d="M156 152 Q190 150 202 116 Q210 96 205 78 L183 84 Q185 104 173 122 Q165 137 146 156Z" fill="url(#${u}suit)"/><circle cx="201" cy="83" r="15" fill="url(#${u}gold)"/><path d="M193 77 a9 9 0 0 1 9 -5" stroke="#fff0bd" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const armR=heldWeapon?armRup:armRhip;
/* SQUIRE/SOLDIER headgear (face stays visible); the full closed helm is the KNIGHT tier only */
const kgear = (o.theme==="knight" && m<2) ? (m>=1 ?
  `<path d="M70 46 Q124 -10 178 46 Q150 22 124 20 Q98 22 70 46Z" fill="#aeb6c2" stroke="#150f2e" stroke-width="5" stroke-linejoin="round"/><path d="M68 44 L180 44 L178 54 L70 54Z" fill="#7a828f" stroke="#150f2e" stroke-width="3"/><rect x="120" y="48" width="8" height="34" rx="3" fill="#c4ccd6" stroke="#150f2e" stroke-width="3"/><path d="M150 6 Q166 0 176 10 Q162 8 150 16Z" fill="#9c3540" stroke="#150f2e" stroke-width="3"/>`
  :
  `<path d="M72 46 Q124 -8 176 46 Q150 22 124 20 Q98 22 72 46Z" fill="#7a4f2e" stroke="#150f2e" stroke-width="5" stroke-linejoin="round"/><path d="M70 44 L178 44 L176 54 L72 54Z" fill="#5a3a1f" stroke="#150f2e" stroke-width="3"/>` )
  : "";
const beltGlow=o.belt2?`<rect x="86" y="250" width="76" height="30" rx="10" fill="none" stroke="#fff3c4" stroke-width="5" opacity=".85"/>`:"";
const bootFx=o.boots2?`<g stroke="#ff8a3d" stroke-width="5" stroke-linecap="round" opacity=".9">
<path d="M78 470 q4 12 -2 22"/><path d="M96 470 q0 14 -4 24"/>
<path d="M154 470 q4 12 -2 22"/><path d="M172 470 q0 14 -4 24"/></g>`:"";
return `<svg viewBox="-30 -150 310 660" width="${w}" aria-hidden="true">
<defs><linearGradient id="${u}suit" x1=".18" y1="0" x2=".82" y2="1"><stop offset="0" stop-color="${th.sheen}"/><stop offset=".22" stop-color="${th.suit[0]}"/><stop offset=".72" stop-color="${th.suit[1]}"/><stop offset="1" stop-color="${th.muscle}"/></linearGradient>
<linearGradient id="${u}cape" x1=".15" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="${cp[0]}"/><stop offset=".55" stop-color="${cp[1]}"/><stop offset="1" stop-color="${cp[1]}"/></linearGradient>
<linearGradient id="${u}gold" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#fff0bd"/><stop offset=".45" stop-color="#ffd75e"/><stop offset="1" stop-color="#e0901f"/></linearGradient>
<radialGradient id="${u}skin" cx=".42" cy=".34" r=".78"><stop offset="0" stop-color="#ffe6cc"/><stop offset=".65" stop-color="#ffd4af"/><stop offset="1" stop-color="#edb085"/></radialGradient>
<radialGradient id="${u}sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#0a0620" stop-opacity=".55"/><stop offset="1" stop-color="#0a0620" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${th.sheen}" stop-opacity=".55"/><stop offset=".5" stop-color="${th.sheen}" stop-opacity=".18"/><stop offset="1" stop-color="${th.sheen}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}aura2" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe28a" stop-opacity=".5"/><stop offset=".55" stop-color="#ffb938" stop-opacity=".16"/><stop offset="1" stop-color="#ffb938" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}embg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3c4" stop-opacity=".9"/><stop offset=".55" stop-color="#ffd75e" stop-opacity=".45"/><stop offset="1" stop-color="#ffd75e" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}capeL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#150f2e" stop-opacity="0"/><stop offset="1" stop-color="#150f2e" stop-opacity=".35"/></linearGradient>
<clipPath id="${u}face"><circle cx="124" cy="66" r="54"/></clipPath>
<clipPath id="${u}lens"><rect x="82" y="50" width="38" height="32" rx="9"/><rect x="130" y="50" width="38" height="32" rx="9"/></clipPath>
<clipPath id="${u}tor"><path d="M72 148 Q124 116 176 148 L162 226 Q156 262 124 270 Q92 262 86 226Z"/></clipPath>
<radialGradient id="${u}mote" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7d6"/><stop offset=".4" stop-color="#ffd75e" stop-opacity=".9"/><stop offset="1" stop-color="#ffd75e" stop-opacity="0"/></radialGradient>
<!-- sculpted specular lighting: blurs the silhouette, lights its top, clips back to shape -->
<filter id="${u}lit" x="-25%" y="-25%" width="150%" height="150%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="4.5" result="b"/>
  <feSpecularLighting in="b" surfaceScale="5.5" specularConstant=".5" specularExponent="16" lighting-color="#ffffff" result="s"><fePointLight x="50" y="-140" z="170"/></feSpecularLighting>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="sc"/>
  <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="sc"/></feMerge>
</filter>
<!-- soft ambient-occlusion drop for figure separation -->
<filter id="${u}drop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="#080414" flood-opacity=".45"/></filter>
<!-- faint fabric/energy texture -->
<filter id="${u}tex"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"/><feComposite operator="in" in2="SourceGraphic"/></filter>
</defs>
<style>
@media (prefers-reduced-motion: no-preference){
 .hfloat{animation:${u}float 4.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
 .hbreath{animation:${u}breath 3.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
 .hcape{animation:${u}sway 4.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}
 .haura{animation:${u}pulse 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}
 .hglint{animation:${u}glint 5.5s ease-in-out infinite}
 .hlid{animation:${u}blink 5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}
 .hmote{animation:${u}rise 5s ease-in-out infinite}
 .hmote2{animation:${u}rise 6.4s ease-in-out .8s infinite}
 .hmote3{animation:${u}rise 5.7s ease-in-out 1.9s infinite}
}
@keyframes ${u}float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes ${u}breath{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.025)}}
@keyframes ${u}sway{0%,100%{transform:rotate(-1.4deg)}50%{transform:rotate(1.8deg)}}
@keyframes ${u}pulse{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.06);opacity:1}}
@keyframes ${u}glint{0%,12%{transform:translateX(-44px);opacity:0}18%{opacity:.9}26%,100%{transform:translateX(40px);opacity:0}}
@keyframes ${u}blink{0%,94%,100%{transform:scaleY(0)}97%{transform:scaleY(1)}}
@keyframes ${u}rise{0%{transform:translateY(0) scale(.7);opacity:0}25%{opacity:1}100%{transform:translateY(-150px) scale(1.1);opacity:0}}
</style>
<g class="haura"><ellipse cx="124" cy="252" rx="124" ry="206" fill="url(#${u}aura2)"/><ellipse cx="124" cy="240" rx="162" ry="232" fill="url(#${u}aura)"/></g>
<g fill="url(#${u}mote)"><circle class="hmote" cx="58" cy="430" r="7"/><circle class="hmote2" cx="192" cy="452" r="5.5"/><circle class="hmote3" cx="120" cy="462" r="4.5"/></g>
<g fill="#fff7d6"><path class="hmote2" d="M44 350 l2.5 7 7 2.5 -7 2.5 -2.5 7 -2.5 -7 -7 -2.5 7 -2.5z"/><path class="hmote3" d="M206 332 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z"/><path class="hmote" d="M30 250 l2 5.5 5.5 2 -5.5 2 -2 5.5 -2 -5.5 -5.5 -2 5.5 -2z"/></g>
<ellipse cx="123" cy="470" rx="98" ry="20" fill="url(#${u}sh)"/>
<g class="hfloat"><g filter="url(#${u}lit)">
${o.weapon==="hammer"||o.weapon==="sword"?weapon:""}
${knight?"":`<g class="hcape">
<path d="M80 126 Q124 106 168 126 Q190 240 200 350 Q206 416 192 452 L168 426 L148 452 L124 430 L100 452 L80 426 L56 452 Q42 416 48 350 Q58 240 80 126Z" fill="url(#${u}cape)" stroke="#150f2e" stroke-width="6"/>
<path d="M80 126 Q124 106 168 126 Q190 240 200 350 Q206 416 192 452 L168 426 L148 452 L124 430 L100 452 L80 426 L56 452 Q42 416 48 350 Q58 240 80 126Z" fill="url(#${u}capeL)"/>
<g stroke="${cp[1]}" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"><path d="M98 150 Q86 300 74 440"/><path d="M124 140 Q124 290 124 436"/><path d="M150 150 Q162 300 174 440"/></g></g>`}
<g stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<path d="M116 268 L96 366 L88 432 L120 432 L124 292Z" fill="url(#${u}suit)"/>
<path d="M132 268 L152 366 L160 432 L128 432 L124 292Z" fill="url(#${u}suit)"/>
<path d="M82 428 L120 428 L120 452 Q120 468 98 468 L68 468 Q58 468 60 456 Q62 440 82 434Z" fill="${bootFill}"/>
<path d="M166 428 L128 428 L128 452 Q128 468 150 468 L180 468 Q190 468 188 456 Q186 440 166 434Z" fill="${bootFill}"/>
<path d="M82 428 L120 428 L120 440 L80 440Z" fill="#ffd75e" stroke-width="4"/>
<path d="M128 428 L166 428 L168 440 L128 440Z" fill="#ffd75e" stroke-width="4"/></g>
${bootFx}
<g class="hbreath"><g transform="translate(123 0) scale(${sx} 1) translate(-123 0)">
<path d="M72 148 Q124 116 176 148 L162 226 Q156 262 124 270 Q92 262 86 226Z" fill="url(#${u}suit)" stroke="#150f2e" stroke-width="6"/>
<g clip-path="url(#${u}tor)"><path d="M126 120 L184 150 L172 232 Q164 264 150 270 L126 270Z" fill="${th.muscle}" opacity=".30"/><ellipse cx="98" cy="172" rx="32" ry="26" fill="#fff" opacity=".20"/></g>
<path d="M82 156 Q104 140 124 138 L124 176 Q102 178 88 192Z" fill="${th.sheen}" opacity=".5"/>
${m>=1?`<path d="M96 178 Q124 162 152 178" stroke="${th.muscle}" stroke-width="5" fill="none" stroke-linecap="round"/>`:''}
${m>=2?`<path d="M104 208 Q124 200 144 208 M108 232 Q124 226 140 232" stroke="${th.muscle}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`:''}
</g></g>
<g stroke="#150f2e" stroke-width="6" stroke-linejoin="round">${armL}${armR}</g>
${biceps}
${tunicHTML}
<path d="M90 254 L158 254 L153 278 L95 278Z" fill="${knight&&m<1?'#7a4f2e':`url(#${u}gold)`}" stroke="#150f2e" stroke-width="5"/>
${beltGlow}
<circle cx="124" cy="186" r="42" fill="url(#${u}embg)"/>
<circle class="haura" cx="124" cy="186" r="32" fill="none" stroke="#fff3c4" stroke-width="2.5" opacity=".5"/>
<g transform="translate(124 186)"><path d="M0 -28 L25 -14 L25 14 L0 28 L-25 14 L-25 -14Z" fill="url(#${u}gold)" stroke="#150f2e" stroke-width="5"/>
<path d="M-19 -10 L-2 -21 L0 -14 L-16 -4Z" fill="#fff" opacity=".4"/>
<path d="M-13 -13 L13 -13 L13 -5 L4 -5 L4 15 L-4 15 L-4 -5 L-13 -5Z" fill="#d23a31" stroke="#150f2e" stroke-width="3"/></g>
${(o.theme==="knight"&&m>=2)?`<!-- ===== full KNIGHT helm (top rank) ===== -->
<rect x="111" y="110" width="26" height="20" rx="6" fill="#aeb6c2" stroke="#150f2e" stroke-width="5"/>
<path d="M84 36 Q124 4 164 36 L172 96 Q172 124 124 130 Q76 124 76 96Z" fill="url(#${u}suit)" stroke="#150f2e" stroke-width="6"/>
<path d="M84 36 Q124 4 164 36 L160 50 Q124 26 88 50Z" fill="${th.sheen}" opacity=".5"/>
<rect x="92" y="58" width="64" height="13" rx="5" fill="#1b2330" stroke="#150f2e" stroke-width="4"/>
<g stroke="#150f2e" stroke-width="4"><line x1="124" y1="74" x2="124" y2="120"/><line x1="106" y1="78" x2="106" y2="118"/><line x1="142" y1="78" x2="142" y2="118"/></g>
<g stroke="none"><circle cx="110" cy="64" r="3.4" fill="#9fe0ff"/><circle cx="138" cy="64" r="3.4" fill="#9fe0ff"/></g>
<path d="M124 4 Q124 -24 150 -30 Q138 -16 142 0 Q132 -8 124 4Z" fill="${cp[0]}" stroke="#150f2e" stroke-width="5" stroke-linejoin="round"/>
</g></g></svg>`:`<!-- ===== head (refined Style C) ===== -->
<rect x="111" y="110" width="26" height="26" rx="7" fill="url(#${u}skin)" stroke="#150f2e" stroke-width="5"/>
<circle cx="70" cy="70" r="11" fill="url(#${u}skin)" stroke="#150f2e" stroke-width="5"/>
<circle cx="178" cy="70" r="11" fill="url(#${u}skin)" stroke="#150f2e" stroke-width="5"/>
<circle cx="124" cy="66" r="54" fill="url(#${u}skin)" stroke="#150f2e" stroke-width="6"/>
<g clip-path="url(#${u}face)"><ellipse cx="156" cy="80" rx="32" ry="50" fill="#c2855c" opacity=".20"/><ellipse cx="102" cy="44" rx="30" ry="24" fill="#fff" opacity=".16"/></g>
<path d="M68 58 Q58 4 124 0 Q190 -2 184 56 Q168 24 144 28 Q164 8 128 14 Q138 0 104 10 Q78 16 82 40 Q70 42 68 58Z" fill="#d8b572" stroke="#150f2e" stroke-width="6" stroke-linejoin="round"/>
<path d="M144 28 Q174 16 184 54 Q170 32 144 38Z" fill="#e8cb8e" stroke="none"/>
<g fill="#cfe6ff" fill-opacity=".4" stroke="#1d4fb8" stroke-width="7" stroke-linejoin="round">
<rect x="82" y="50" width="38" height="32" rx="9"/><rect x="130" y="50" width="38" height="32" rx="9"/><line x1="120" y1="64" x2="130" y2="64"/></g>
<g stroke="#fff" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"><path d="M88 74 L104 54"/><path d="M136 74 L152 54"/></g>
<g stroke="none"><circle cx="101" cy="66" r="8.5" fill="#fff"/><circle cx="149" cy="66" r="8.5" fill="#fff"/>
<circle cx="103" cy="67" r="5" fill="#6fa8d8"/><circle cx="151" cy="67" r="5" fill="#6fa8d8"/>
<circle cx="103" cy="67" r="2.4" fill="#150f2e"/><circle cx="151" cy="67" r="2.4" fill="#150f2e"/>
<circle cx="105" cy="64" r="1.7" fill="#fff"/><circle cx="153" cy="64" r="1.7" fill="#fff"/></g>
<g fill="url(#${u}skin)"><rect class="hlid" x="92.5" y="55" width="17" height="13" rx="5"/><rect class="hlid" x="140.5" y="55" width="17" height="13" rx="5"/></g>
<g clip-path="url(#${u}lens)"><rect class="hglint" x="74" y="44" width="15" height="46" fill="#fff" opacity=".5" transform="skewX(-22)"/></g>
<g stroke="none" fill="#e89a78" opacity=".5"><circle cx="92" cy="90" r="7"/><circle cx="156" cy="90" r="7"/></g>
<g stroke="none" fill="#d99a6c" opacity=".9"><circle cx="108" cy="91" r="2"/><circle cx="116" cy="94" r="2"/><circle cx="132" cy="94" r="2"/><circle cx="140" cy="91" r="2"/></g>
<path d="M98 97 Q124 120 150 97 Q146 113 124 117 Q102 113 98 97Z" fill="#7c3a3a" stroke="#150f2e" stroke-width="4" stroke-linejoin="round"/>
<path d="M103 99 Q124 110 145 99 Q124 105 103 99Z" fill="#fff" stroke="none"/>
${kgear}
</g></g></svg>`}`;}

/* ---- LORD VEX / VEXBOT (refined: angled glowing visor, sharper menace) ---- */
function inkblotSVG(w=240){
const u="v"+(__huid++);
return `<svg viewBox="-70 -130 320 360" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="vxm" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#5a6080"/><stop offset=".5" stop-color="#3a3f5c"/><stop offset="1" stop-color="#1d2034"/></linearGradient>
<linearGradient id="vxd" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#363b58"/><stop offset="1" stop-color="#0f1122"/></linearGradient>
<radialGradient id="vxr" cx=".42" cy=".4" r=".62"><stop offset="0" stop-color="#fff1ec"/><stop offset=".35" stop-color="#ff6b5e"/><stop offset=".7" stop-color="#e62e2e"/><stop offset="1" stop-color="#5a0c0c"/></radialGradient>
<radialGradient id="${u}aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff2e2e" stop-opacity=".5"/><stop offset=".55" stop-color="#c01020" stop-opacity=".16"/><stop offset="1" stop-color="#c01020" stop-opacity="0"/></radialGradient>
<filter id="${u}lit" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b"/><feSpecularLighting in="b" surfaceScale="5" specularConstant=".55" specularExponent="20" lighting-color="#cfe0ff" result="s"><fePointLight x="40" y="-150" z="160"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="sc"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="sc"/></feMerge></filter>
<filter id="${u}glow" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>
<style>@media (prefers-reduced-motion: no-preference){.vfloat{animation:${u}fl 4.5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}.vglow{animation:${u}gl 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}}@keyframes ${u}fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes ${u}gl{0%,100%{opacity:.6}50%{opacity:1}}</style>
<g class="vaura"><ellipse cx="72" cy="100" rx="148" ry="172" fill="url(#${u}aura)"/></g>
<ellipse class="vglow" cx="72" cy="208" rx="58" ry="13" fill="#9fe870" opacity=".5"/>
<ellipse cx="72" cy="204" rx="34" ry="8" fill="#d2ffb0" opacity=".8"/>
<g class="vfloat"><g filter="url(#${u}lit)">
<path d="M10 -20 Q-40 60 -28 170 L-6 150 L6 176 L26 150 L40 178 L58 150 L74 172 L96 148 Q132 60 132 -16 Q72 -52 10 -20Z" fill="#1a1030" stroke="#150f2e" stroke-width="6"/>
<path d="M40 150 L104 150 L96 196 L48 196 Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="6"/>
<rect x="52" y="160" width="40" height="10" rx="4" fill="#9fe870" opacity=".75"/>
<path d="M16 30 L128 30 L142 70 L128 150 L16 150 L2 70 Z" fill="url(#vxm)" stroke="#150f2e" stroke-width="7"/>
<path d="M16 30 L72 30 L72 150 L16 150 L2 70Z" fill="#150f2e" opacity=".22"/>
<path d="M30 44 L114 44 L122 66 L112 86 L32 86 L22 66Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="5"/>
<circle class="vglow" cx="72" cy="112" r="30" fill="#ff3b3b" filter="url(#${u}glow)"/>
<circle cx="72" cy="112" r="21" fill="url(#vxr)" stroke="#150f2e" stroke-width="6"/>
<circle cx="72" cy="112" r="8" fill="#fff0ec"/>
<path d="M72 86 L72 70 M50 100 L34 92 M94 100 L110 92" stroke="#e62e2e" stroke-width="4" stroke-linecap="round" opacity=".8"/>
<path d="M16 30 L-22 6 L10 2 L26 26Z" fill="url(#vxm)" stroke="#150f2e" stroke-width="6"/>
<path d="M128 30 L166 6 L134 2 L118 26Z" fill="url(#vxm)" stroke="#150f2e" stroke-width="6"/>
<path d="M8 56 Q-34 78 -38 122 Q-36 142 -20 148 L-10 128 Q-22 118 -18 102 Q-12 80 12 70Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="6"/>
<g stroke="#150f2e" stroke-width="5" fill="#6e7494"><path d="M-22 144 L-38 168 L-26 166 L-30 184 L-14 164 L-8 178 L-2 150Z"/></g>
<path d="M136 56 Q178 78 182 122 Q180 142 164 148 L154 128 Q166 118 162 102 Q156 80 132 70Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="6"/>
<g stroke="#150f2e" stroke-width="5" fill="#6e7494"><path d="M166 144 L182 168 L170 166 L174 184 L158 164 L152 178 L146 150Z"/></g>
<path d="M38 -64 L106 -64 L118 -36 L114 14 L100 30 L44 30 L30 14 L26 -36Z" fill="url(#vxm)" stroke="#150f2e" stroke-width="7"/>
<path d="M38 -64 L72 -64 L72 30 L44 30 L30 14 L26 -36Z" fill="#150f2e" opacity=".22"/>
<path d="M40 -62 L22 -102 L52 -72Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="5"/>
<path d="M104 -62 L122 -102 L92 -72Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="5"/>
<ellipse cx="72" cy="-15" rx="46" ry="15" fill="#e62e2e" opacity=".25"/>
<g class="vglow" filter="url(#${u}glow)"><path d="M32 -25 L70 -14 L66 -3 L34 -8Z" fill="#ff3b3b"/><path d="M112 -25 L74 -14 L78 -3 L110 -8Z" fill="#ff3b3b"/></g>
<path d="M32 -25 L70 -14 L66 -3 L34 -8Z" fill="#e62e2e" stroke="#150f2e" stroke-width="4.5"/>
<path d="M112 -25 L74 -14 L78 -3 L110 -8Z" fill="#e62e2e" stroke="#150f2e" stroke-width="4.5"/>
<path d="M40 -19 L60 -12 M104 -19 L84 -12" stroke="#ffd2c9" stroke-width="3" stroke-linecap="round"/>
<g stroke="#150f2e" stroke-width="4"><line x1="56" y1="6" x2="56" y2="22"/><line x1="72" y1="6" x2="72" y2="24"/><line x1="88" y1="6" x2="88" y2="22"/></g>
<g font-family="Andika,sans-serif" font-weight="700" fill="#9fe870" opacity=".85">
<text x="-52" y="-40" font-size="30" transform="rotate(-18 -52 -40)">?</text>
<text x="176" y="96" font-size="28" transform="rotate(-8 176 96)">?</text>
</g>
</g></g></svg>`;}

/* ---- mentors (Mom & Dad chips) — unchanged ---- */
function mentorChips(w=120){
return `<svg viewBox="0 0 130 70" width="${w}" aria-hidden="true">
<circle cx="35" cy="35" r="30" fill="#ffd9b8" stroke="#fff6e3" stroke-width="4"/>
<path d="M10 24 Q14 4 36 4 Q58 4 60 24 Q50 12 36 14 Q20 14 10 24Z" fill="#6b4a2b" stroke="#150f2e" stroke-width="3"/>
<path d="M22 48 Q35 56 48 47" stroke="#150f2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<circle cx="27" cy="34" r="3" fill="#150f2e"/><circle cx="44" cy="34" r="3" fill="#150f2e"/>
<path d="M20 52 Q35 60 50 51 L48 58 Q35 64 22 58Z" fill="#7a5a3a" opacity=".5"/>
<circle cx="95" cy="35" r="30" fill="#ffd9b8" stroke="#fff6e3" stroke-width="4"/>
<path d="M68 28 Q70 4 96 4 Q122 6 122 30 Q112 14 96 16 Q78 16 68 28Z" fill="#d8b572" stroke="#150f2e" stroke-width="3"/>
<circle cx="87" cy="34" r="3" fill="#150f2e"/><circle cx="104" cy="34" r="3" fill="#150f2e"/>
<path d="M82 48 Q95 56 108 47" stroke="#150f2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<g fill="#f2a9c4"><circle cx="78" cy="58" r="3.4"/><circle cx="86" cy="61" r="3.4"/><circle cx="95" cy="62" r="3.4"/><circle cx="104" cy="61" r="3.4"/><circle cx="112" cy="58" r="3.4"/></g>
</svg>`;}

/* ---- intro cityscape — unchanged ---- */
function citySVG(){
return `<svg viewBox="0 0 600 300">
<defs><linearGradient id="cs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#171236"/><stop offset="1" stop-color="#7a4fb6"/></linearGradient></defs>
<rect width="600" height="300" fill="url(#cs)"/>
<circle cx="500" cy="60" r="34" fill="#fff1cf" stroke="#150f2e" stroke-width="4"/>
<g fill="#2c2158"><rect x="20" y="140" width="60" height="160"/><rect x="95" y="100" width="55" height="200"/><rect x="165" y="150" width="70" height="150"/><rect x="420" y="120" width="62" height="180"/><rect x="495" y="150" width="80" height="150"/><polygon points="300,300 300,90 330,60 360,90 360,300"/></g>
<g fill="#ffc93c" opacity=".85"><rect x="32" y="160" width="11" height="14"/><rect x="56" y="190" width="11" height="14"/><rect x="106" y="120" width="11" height="14"/><rect x="128" y="160" width="11" height="14"/><rect x="436" y="140" width="11" height="14"/><rect x="510" y="170" width="11" height="14"/><rect x="540" y="200" width="11" height="14"/></g>
<g fill="#9fe870" opacity=".5"><circle cx="210" cy="55" r="6"/><circle cx="125" cy="78" r="5"/><circle cx="405" cy="48" r="6"/><circle cx="545" cy="108" r="5"/></g>
</svg>`;}

/* ---- Hero League friends (refined faces: catchlight eyes, cleaner) ---- */
function allyEyes(){ return `<circle cx="-8" cy="0" r="3.6" fill="#fff"/><circle cx="9" cy="0" r="3.6" fill="#fff"/>`+
  `<circle cx="-8" cy=".4" r="2.1" fill="#150f2e"/><circle cx="9" cy=".4" r="2.1" fill="#150f2e"/>`+
  `<circle cx="-7" cy="-1.1" r="1" fill="#fff"/><circle cx="10" cy="-1.1" r="1" fill="#fff"/>`; }
/* Real-friend faces — stylized to recognizable traits (hair colour/style +
   expression), built from the parent's photos. Not photoreal; just "clearly them". */
function allyFace(kind){
  const head=`<circle r="26" fill="#ffd9b8" stroke="#150f2e" stroke-width="4"/>`;
  const smile=`<path d="M-9 10 Q1 18 10 9" stroke="#150f2e" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  if(kind==="leighton")return head+   /* Leighton — long flowing light-brown hair + her star */
    `<path d="M-26 -2 Q-28 -32 0 -32 Q28 -32 26 -2 Q26 16 19 24 L16 -8 Q14 -22 0 -20 Q-14 -22 -16 -8 L-19 24 Q-26 16 -26 -2Z" fill="#c6a06a" stroke="#150f2e" stroke-width="3" stroke-linejoin="round"/>`+
    `<path d="M-17 16 Q-22 28 -15 34 M17 16 Q22 28 15 34" stroke="#c6a06a" stroke-width="7" fill="none" stroke-linecap="round"/>`+
    `<path d="M-13 -21 Q0 -31 13 -21 Q6 -17 0 -18 Q-6 -17 -13 -21Z" fill="#d8b27a" stroke="#150f2e" stroke-width="2"/>`+
    `<g fill="#ffd75e" stroke="#150f2e" stroke-width="1.4"><path d="M0 -35 l3 6 l6 0 l-5 4 l2 6 l-6 -4 l-6 4 l2 -6 l-5 -4 l6 0z"/></g>`+
    allyEyes()+
    `<g stroke="none" fill="#d99a6c" opacity=".7"><circle cx="-7" cy="9" r="1.4"/><circle cx="0" cy="11" r="1.4"/><circle cx="7" cy="9" r="1.4"/></g>`+ smile;
  if(kind==="heart")return head+   /* Amelia — dark-blonde pulled back, gentle smile + heart */
    `<path d="M-24 -4 Q-26 -30 0 -30 Q26 -30 24 -4 Q14 -22 0 -20 Q-14 -22 -24 -4Z" fill="#b78f5c" stroke="#150f2e" stroke-width="3"/>`+
    `<path d="M19 -8 Q30 6 23 22 Q19 8 15 -2Z" fill="#a87f50" stroke="#150f2e" stroke-width="2.5"/>`+
    allyEyes()+ smile+
    `<path d="M0 22 q3 -4 6 -1 q3 3 -1 6 l-5 4 -5 -4 q-4 -3 -1 -6 q3 -3 6 1z" fill="#e6453c" stroke="#150f2e" stroke-width="1.6"/>`;
  if(kind==="tank")return head+   /* Archie — longer, shaggy dishwater-blonde hair */
    `<path d="M-26 2 Q-28 -32 0 -33 Q28 -32 26 0 Q22 -18 14 -14 Q18 -27 7 -21 Q9 -31 -3 -22 Q-6 -31 -14 -21 Q-12 -28 -22 -14 Q-26 -8 -26 2Z" fill="#c2a067" stroke="#150f2e" stroke-width="3" stroke-linejoin="round"/>`+
    `<path d="M-25 -2 Q-29 16 -22 25 L-17 -8Z M25 -2 Q29 16 22 25 L17 -8Z" fill="#c2a067" stroke="#150f2e" stroke-width="2.5"/>`+
    allyEyes()+ smile;
  if(kind==="kendall")return head+   /* Miss Kendall — kind teacher (brown hair in a low bun) — placeholder until a photo */
    `<path d="M-25 -2 Q-27 -30 0 -30 Q27 -30 25 -2 Q25 18 18 26 L15 -6 Q14 -22 0 -20 Q-14 -22 -15 -6 L-18 26 Q-25 18 -25 -2Z" fill="#7a5230" stroke="#150f2e" stroke-width="3"/>`+
    `<circle cx="0" cy="22" r="7" fill="#7a5230" stroke="#150f2e" stroke-width="2.5"/>`+
    allyEyes()+
    `<g stroke="none" fill="#d99a6c" opacity=".55"><circle cx="-9" cy="8" r="2"/><circle cx="9" cy="8" r="2"/></g>`+ smile;
  if(kind==="flip")return head+   /* Ellie — light-brown hair, half-up */
    `<path d="M-24 -2 Q-26 -29 0 -29 Q26 -29 24 -2 Q24 17 18 25 L15 -6 Q14 -20 0 -19 Q-14 -20 -15 -6 L-18 25 Q-24 17 -24 -2Z" fill="#b18253" stroke="#150f2e" stroke-width="3"/>`+
    `<path d="M-21 -10 Q-19 -29 0 -29 Q19 -29 21 -10 Q11 -20 0 -19 Q-11 -20 -21 -10Z" fill="#a3744a" stroke="#150f2e" stroke-width="2.5"/>`+
    `<circle cx="0" cy="-31" r="6" fill="#b18253" stroke="#150f2e" stroke-width="2.5"/>`+
    allyEyes()+ smile;
  return head+ /* William (sunny) — spiky blonde, happy squinty eyes, big gap-toothed grin */
    `<path d="M-25 -4 Q-27 -31 -2 -32 Q26 -33 25 -3 Q20 -20 12 -16 Q14 -27 6 -21 Q8 -31 -2 -23 Q-4 -31 -12 -21 Q-12 -29 -20 -16 Q-24 -12 -25 -4Z" fill="#ecd185" stroke="#150f2e" stroke-width="3" stroke-linejoin="round"/>`+
    `<path d="M-13 -1 Q-8 -7 -3 -1" stroke="#150f2e" stroke-width="3" fill="none" stroke-linecap="round"/>`+
    `<path d="M3 -1 Q8 -7 13 -1" stroke="#150f2e" stroke-width="3" fill="none" stroke-linecap="round"/>`+
    `<g fill="#ff9a8a" opacity=".45"><circle cx="-15" cy="9" r="4.4"/><circle cx="15" cy="9" r="4.4"/></g>`+
    `<path d="M-12 8 Q0 22 12 8 Q0 14 -12 8Z" fill="#7c3a3a" stroke="#150f2e" stroke-width="2.6"/>`+
    `<path d="M-9 8 Q0 11 9 8 L9 11 Q0 13 -9 11Z" fill="#fff"/>`+
    `<rect x="-1.5" y="8" width="3" height="4.5" fill="#7c3a3a"/>`;
}

/* =========================================================
   ACT-2 PLACEHOLDER ART (refine when parent provides references).
   The Vixen, the time portal, and the captured friends — used only in the
   Act-1 finale interlude handoff. Flat-vector, no flicker (seizure-safe).
========================================================= */

/* ---- THE VIXEN (Act-2 villain; sly woman who morphs into a dragon) ---- */
function vixenSVG(w=240){
const u="x"+(__huid++);
return `<svg viewBox="-60 -120 280 350" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="${u}hair" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#ff5f93"/><stop offset=".5" stop-color="#c21f57"/><stop offset="1" stop-color="#5c0c32"/></linearGradient>
<linearGradient id="${u}collar" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="#4a1234"/><stop offset="1" stop-color="#140510"/></linearGradient>
<linearGradient id="${u}gown" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#3a0f2a"/><stop offset="1" stop-color="#160510"/></linearGradient>
<linearGradient id="${u}lip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5b78"/><stop offset="1" stop-color="#b21243"/></linearGradient>
<radialGradient id="${u}skin" cx=".42" cy=".32" r=".85"><stop offset="0" stop-color="#fff3ee"/><stop offset=".7" stop-color="#ffe0d2"/><stop offset="1" stop-color="#ecb89f"/></radialGradient>
<radialGradient id="${u}aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff2e7a" stop-opacity=".55"/><stop offset=".55" stop-color="#b0105a" stop-opacity=".16"/><stop offset="1" stop-color="#b0105a" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}eye" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#eaffe2"/><stop offset=".45" stop-color="#46e87d"/><stop offset="1" stop-color="#0f9046"/></radialGradient>
<filter id="${u}lit" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b"/><feSpecularLighting in="b" surfaceScale="4.5" specularConstant=".5" specularExponent="16" lighting-color="#ffe6f2" result="s"><fePointLight x="20" y="-130" z="160"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="sc"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="sc"/></feMerge></filter>
<filter id="${u}glow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="3.4"/></filter>
</defs>
<style>@media (prefers-reduced-motion: no-preference){
.xfloat{animation:${u}fl 5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.xeye{animation:${u}gl 2.4s ease-in-out infinite}
.xhair{animation:${u}sw 6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}
.xember{animation:${u}em 3.2s ease-in-out infinite}}
@keyframes ${u}fl{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-6px) rotate(.5deg)}}
@keyframes ${u}gl{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes ${u}sw{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}
@keyframes ${u}em{0%{opacity:0;transform:translateY(0)}30%{opacity:.9}100%{opacity:0;transform:translateY(-26px)}}</style>
<g class="xaura"><ellipse cx="80" cy="55" rx="150" ry="172" fill="url(#${u}aura)"/></g>
<g class="xfloat"><g filter="url(#${u}lit)">
<path d="M6 150 Q-20 60 14 24 Q20 96 58 120 L58 150Z" fill="url(#${u}collar)" stroke="#150f2e" stroke-width="5"/>
<path d="M154 150 Q180 60 146 24 Q140 96 102 120 L102 150Z" fill="url(#${u}collar)" stroke="#150f2e" stroke-width="5"/>
<path d="M14 26 Q20 96 56 119" fill="none" stroke="#d92f6a" stroke-width="3.2" stroke-linecap="round" opacity=".85"/>
<path d="M146 26 Q140 96 104 119" fill="none" stroke="#d92f6a" stroke-width="3.2" stroke-linecap="round" opacity=".85"/>
<path d="M28 30 Q-2 90 10 168 Q34 130 50 150 Q40 90 64 50Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="5"/>
<path d="M132 30 Q162 90 150 168 Q126 130 110 150 Q120 90 96 50Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="5"/>
<path d="M30 150 Q50 120 80 120 Q110 120 130 150 L150 226 L10 226Z" fill="url(#${u}gown)" stroke="#150f2e" stroke-width="6"/>
<path d="M80 122 L80 200" stroke="#5c163e" stroke-width="3" opacity=".6"/>
<path d="M66 96 Q66 116 60 124 Q80 132 100 124 Q94 116 94 96Z" fill="url(#${u}skin)" stroke="#150f2e" stroke-width="4"/>
<path d="M44 52 Q44 104 80 116 Q116 104 116 52 Q116 12 80 12 Q44 12 44 52Z" fill="url(#${u}skin)" stroke="#150f2e" stroke-width="5.5"/>
<path d="M50 6 Q40 -22 56 -30 Q54 -10 64 2Z" fill="#3a0f2a" stroke="#150f2e" stroke-width="3.5"/>
<path d="M110 6 Q120 -22 104 -30 Q106 -10 96 2Z" fill="#3a0f2a" stroke="#150f2e" stroke-width="3.5"/>
<g class="xhair">
<path d="M44 36 Q34 -28 80 -26 Q126 -28 116 36 Q104 6 92 14 Q108 -8 80 -6 Q52 -8 68 14 Q56 6 44 36Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="5.5" stroke-linejoin="round"/>
<path d="M44 36 Q34 70 40 96 Q50 70 56 56 Q48 46 44 36Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="4"/>
<path d="M116 36 Q126 70 120 96 Q110 70 104 56 Q112 46 116 36Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="4"/></g>
<path d="M52 44 Q66 34 80 42 M80 42 Q94 34 108 44" stroke="#150f2e" stroke-width="3.4" fill="none" stroke-linecap="round"/>
<g class="xeye" filter="url(#${u}glow)"><ellipse cx="66" cy="56" rx="9" ry="7" fill="#46e87d"/><ellipse cx="94" cy="56" rx="9" ry="7" fill="#46e87d"/></g>
<path d="M55 56 Q66 47 78 55 Q67 64 55 56Z" fill="#fff"/><path d="M82 56 Q94 47 105 55 Q94 64 82 56Z" fill="#fff"/>
<ellipse cx="67" cy="56" rx="3.6" ry="6.4" fill="url(#${u}eye)"/><ellipse cx="93" cy="56" rx="3.6" ry="6.4" fill="url(#${u}eye)"/>
<ellipse cx="67" cy="56" rx="1.5" ry="5" fill="#0c1a10"/><ellipse cx="93" cy="56" rx="1.5" ry="5" fill="#0c1a10"/>
<circle cx="68.5" cy="53.5" r="1.3" fill="#fff"/><circle cx="94.5" cy="53.5" r="1.3" fill="#fff"/>
<path d="M55 54 Q66 47 79 53 M81 53 Q94 47 105 54" stroke="#150f2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<path d="M80 60 Q84 72 78 76" stroke="#d79a82" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<path d="M62 90 Q80 100 100 86 Q88 96 80 95 Q72 95 62 90Z" fill="url(#${u}lip)" stroke="#8e1338" stroke-width="2.5" stroke-linejoin="round"/>
<circle cx="104" cy="80" r="1.8" fill="#3a0f2a"/>
<ellipse cx="58" cy="74" rx="6" ry="4" fill="#ff9bb6" opacity=".4"/><ellipse cx="102" cy="74" rx="6" ry="4" fill="#ff9bb6" opacity=".4"/>
</g></g>
<g class="xember" fill="#ff5d8f"><circle cx="18" cy="150" r="3"/><circle cx="150" cy="140" r="2.5"/></g>
<g class="xember" fill="#ffd0e0" style="animation-delay:1.6s"><circle cx="40" cy="172" r="2"/><circle cx="128" cy="166" r="2.5"/></g>
</svg>`;}

/* ---- time portal (swirling vortex) ---- */
function portalSVG(w=240){
const u="p"+(__huid++);
return `<svg viewBox="-12 -12 224 224" width="${w}" aria-hidden="true">
<defs>
<radialGradient id="${u}core" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe0"/><stop offset=".3" stop-color="#9be8ff"/><stop offset=".62" stop-color="#7a4fd6"/><stop offset="1" stop-color="#0e0826"/></radialGradient>
<radialGradient id="${u}cz" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<filter id="${u}b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6"/></filter>
</defs>
<style>@media (prefers-reduced-motion: no-preference){
.${u}s1{animation:${u}sp 12s linear infinite;transform-origin:100px 100px}
.${u}s2{animation:${u}sp2 8s linear infinite;transform-origin:100px 100px}
.${u}pz{animation:${u}pl 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}}
@keyframes ${u}sp{to{transform:rotate(360deg)}}
@keyframes ${u}sp2{to{transform:rotate(-360deg)}}
@keyframes ${u}pl{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.16)}}</style>
<circle cx="100" cy="100" r="96" fill="url(#${u}core)" stroke="#150f2e" stroke-width="6"/>
<g class="${u}s1" fill="none" stroke="#cfe9ff" stroke-linecap="round" opacity=".82">
<path d="M100 16 Q176 44 184 100 Q176 156 100 184" stroke-width="5"/>
<path d="M100 38 Q150 58 156 100 Q150 142 100 162" stroke-width="4" opacity=".8"/></g>
<g class="${u}s2" fill="none" stroke="#e7c6ff" stroke-linecap="round" opacity=".7">
<path d="M100 24 Q24 52 16 100 Q24 148 100 176" stroke-width="4.5"/>
<path d="M100 50 Q58 66 54 100 Q58 134 100 150" stroke-width="3.5" opacity=".8"/></g>
<circle class="${u}pz" cx="100" cy="100" r="22" fill="url(#${u}cz)" filter="url(#${u}b)"/>
<circle cx="100" cy="100" r="9" fill="#fffbe0"/>
<g class="${u}s1" fill="#9fe870"><circle cx="100" cy="14" r="4"/><circle cx="186" cy="100" r="3.5"/><circle cx="100" cy="186" r="3.5"/><circle cx="14" cy="100" r="3"/></g>
</svg>`;}

/* ---- captured friends (faces TBD — '?' silhouettes in a glowing magic cage) ---- */
function captiveSVG(w=240){
const u="c"+(__huid++);
return `<svg viewBox="0 0 240 192" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="${u}bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3ff"/><stop offset=".5" stop-color="#6aa8ff"/><stop offset="1" stop-color="#2a5ad0"/></linearGradient>
<radialGradient id="${u}cell" cx=".5" cy=".35" r=".85"><stop offset="0" stop-color="#2a1f55"/><stop offset="1" stop-color="#0c0820"/></radialGradient>
<filter id="${u}g" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.2"/></filter>
</defs>
<style>@media (prefers-reduced-motion: no-preference){.${u}fl{animation:${u}f 2.6s ease-in-out infinite}.${u}sad{animation:${u}s 5s ease-in-out infinite}}@keyframes ${u}f{0%,100%{opacity:.55}50%{opacity:1}}@keyframes ${u}s{0%,100%{transform:translateY(0)}50%{transform:translateY(2.5px)}}</style>
<rect x="22" y="20" width="196" height="152" rx="16" fill="url(#${u}cell)" stroke="#150f2e" stroke-width="6"/>
<g class="${u}sad" fill="#473a72" stroke="#150f2e" stroke-width="3.5">
<g><circle cx="74" cy="92" r="20"/><path d="M54 152 Q54 116 74 116 Q94 116 94 152Z"/></g>
<g><circle cx="120" cy="82" r="22"/><path d="M97 150 Q97 110 120 110 Q143 110 143 150Z"/></g>
<g><circle cx="166" cy="92" r="20"/><path d="M146 152 Q146 116 166 116 Q186 116 186 152Z"/></g></g>
<g font-family="Bangers,sans-serif" fill="#ffd75e" text-anchor="middle" font-size="24" opacity=".9">
<text x="74" y="100">?</text><text x="120" y="90">?</text><text x="166" y="100">?</text></g>
<g class="${u}fl" filter="url(#${u}g)" stroke="url(#${u}bar)" stroke-width="6" stroke-linecap="round">
<line x1="60" y1="22" x2="60" y2="170"/><line x1="100" y1="22" x2="100" y2="170"/><line x1="140" y1="22" x2="140" y2="170"/><line x1="180" y1="22" x2="180" y2="170"/></g>
<g stroke="#dff0ff" stroke-width="2" stroke-linecap="round" opacity=".7">
<line x1="60" y1="22" x2="60" y2="170"/><line x1="100" y1="22" x2="100" y2="170"/><line x1="140" y1="22" x2="140" y2="170"/><line x1="180" y1="22" x2="180" y2="170"/></g>
<rect x="18" y="14" width="204" height="12" rx="6" fill="#3a2d7d" stroke="#150f2e" stroke-width="4"/>
<rect x="18" y="166" width="204" height="12" rx="6" fill="#3a2d7d" stroke="#150f2e" stroke-width="4"/>
<g transform="translate(120 173)"><rect x="-13" y="-6" width="26" height="22" rx="5" fill="#ffce3a" stroke="#150f2e" stroke-width="3.5"/><path d="M-7 -6 v-6 a7 7 0 0 1 14 0 v6" fill="none" stroke="#150f2e" stroke-width="3.5"/><circle cx="0" cy="3" r="3" fill="#150f2e"/></g>
</svg>`;}

/* ---- NOAH THE RED — Act-2 mentor wizard (Gandalf-coded, red hair+beard).
   Placeholder; refine when the parent provides a reference. ---- */
function noahSVG(w=220){
const u="n"+(__huid++);
return `<svg viewBox="-20 -40 240 420" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="${u}robe" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#a83a44"/><stop offset=".55" stop-color="#7a2230"/><stop offset="1" stop-color="#3f1018"/></linearGradient>
<linearGradient id="${u}hat" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#b03a44"/><stop offset="1" stop-color="#54141f"/></linearGradient>
<radialGradient id="${u}skin" cx=".42" cy=".34" r=".8"><stop offset="0" stop-color="#ffe0cb"/><stop offset=".7" stop-color="#f6cdb6"/><stop offset="1" stop-color="#e3aa8c"/></radialGradient>
<linearGradient id="${u}hair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d57b3b"/><stop offset="1" stop-color="#a3461d"/></linearGradient>
<radialGradient id="${u}aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#5fd0ff" stop-opacity=".45"/><stop offset=".55" stop-color="#3a7fd0" stop-opacity=".14"/><stop offset="1" stop-color="#3a7fd0" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}orb" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#a8ecff"/><stop offset="1" stop-color="#2aa0e0"/></radialGradient>
<filter id="${u}lit" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur in="SourceAlpha" stdDeviation="4.5" result="b"/><feSpecularLighting in="b" surfaceScale="4" specularConstant=".4" specularExponent="14" lighting-color="#fff0dd" result="s"><fePointLight x="40" y="-130" z="150"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="sc"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="sc"/></feMerge></filter>
<filter id="${u}glow" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
<style>@media (prefers-reduced-motion: no-preference){.nfloat{animation:${u}fl 5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}.norb{animation:${u}gl 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}}@keyframes ${u}fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes ${u}gl{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.14)}}</style>
<g class="naura"><ellipse cx="100" cy="200" rx="138" ry="198" fill="url(#${u}aura)"/></g>
<circle class="norb" cx="178" cy="40" r="30" fill="#7fd9ff" filter="url(#${u}glow)"/>
<g class="nfloat"><g filter="url(#${u}lit)">
<rect x="172" y="40" width="12" height="320" rx="6" fill="#6b4a2b" stroke="#150f2e" stroke-width="5"/>
<circle cx="178" cy="40" r="18" fill="url(#${u}orb)" stroke="#150f2e" stroke-width="5"/>
<circle cx="173" cy="34" r="6" fill="#fff" opacity=".85"/>
<path d="M60 150 Q40 250 30 360 L170 360 Q160 250 140 150 Q100 132 60 150Z" fill="url(#${u}robe)" stroke="#150f2e" stroke-width="6"/>
<path d="M100 150 L100 360" stroke="#2a0a12" stroke-width="4" opacity=".5"/>
<path d="M64 302 Q100 312 136 302" stroke="#ffd75e" stroke-width="3" fill="none" opacity=".5"/>
<path d="M62 168 Q30 210 36 262 L60 250 Q60 210 78 186Z" fill="url(#${u}robe)" stroke="#150f2e" stroke-width="6"/>
<path d="M138 168 Q170 210 164 262 L140 250 Q140 210 122 186Z" fill="url(#${u}robe)" stroke="#150f2e" stroke-width="6"/>
<circle cx="100" cy="92" r="40" fill="url(#${u}skin)" stroke="#150f2e" stroke-width="6"/>
<path d="M62 72 Q58 96 70 110 L80 102 Q68 88 70 74Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="3"/>
<path d="M138 72 Q142 96 130 110 L120 102 Q132 88 130 74Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="3"/>
<path d="M62 94 Q62 140 76 168 Q90 200 100 204 Q110 200 124 168 Q138 140 138 94 Q126 122 116 124 Q108 132 100 132 Q92 132 84 124 Q74 122 62 94Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="6" stroke-linejoin="round"/>
<path d="M78 118 Q100 110 122 118 Q112 127 100 127 Q88 127 78 118Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="3"/>
<g stroke="#8f3a1a" stroke-width="3" fill="none" opacity=".5" stroke-linecap="round"><path d="M82 132 Q88 160 96 182"/><path d="M118 132 Q112 160 104 182"/><path d="M100 134 L100 188"/></g>
<g stroke="none"><circle cx="86" cy="88" r="5" fill="#fff"/><circle cx="114" cy="88" r="5" fill="#fff"/><circle cx="86" cy="89" r="3" fill="#5f86a8"/><circle cx="114" cy="89" r="3" fill="#5f86a8"/><circle cx="86" cy="89" r="1.5" fill="#16202c"/><circle cx="114" cy="89" r="1.5" fill="#16202c"/><circle cx="87.5" cy="86.5" r="1" fill="#fff"/><circle cx="115.5" cy="86.5" r="1" fill="#fff"/></g>
<path d="M77 76 Q87 72 96 76 M104 76 Q113 72 123 76" stroke="url(#${u}hair)" stroke-width="3.6" fill="none" stroke-linecap="round"/>
<g fill="#d99a6c" opacity=".7" stroke="none"><circle cx="80" cy="100" r="1.4"/><circle cx="88" cy="103" r="1.4"/><circle cx="112" cy="103" r="1.4"/><circle cx="120" cy="100" r="1.4"/></g>
<path d="M58 64 Q100 -46 150 56 Q104 40 58 64Z" fill="url(#${u}hat)" stroke="#150f2e" stroke-width="6" stroke-linejoin="round"/>
<path d="M50 64 Q100 44 158 60 L150 78 Q100 60 56 80Z" fill="url(#${u}hat)" stroke="#150f2e" stroke-width="6"/>
<path d="M68 62 Q86 50 102 53 Q92 58 82 64Z" fill="url(#${u}hair)" stroke="#150f2e" stroke-width="2.5"/>
<g fill="#ffd75e"><path d="M118 6 l3 7 l7 1 l-5 5 l1 7 l-6 -4 l-6 4 l1 -7 l-5 -5 l7 -1z"/></g>
</g></g>
</svg>`;}

/* ---- DRAGON — Act-2 boss (the Vixen's dragon army). Placeholder. ---- */
function dragonSVG(w=240){
const u="d"+(__huid++);
return `<svg viewBox="-24 -12 348 344" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="dbody" x1=".25" y1="0" x2=".75" y2="1"><stop offset="0" stop-color="#5c7196"/><stop offset=".5" stop-color="#3c4d70"/><stop offset="1" stop-color="#25324e"/></linearGradient>
<linearGradient id="dcream" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#e8dec5"/><stop offset="1" stop-color="#c2b594"/></linearGradient>
<linearGradient id="dwing" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#dccfb0"/><stop offset="1" stop-color="#b3a482"/></linearGradient>
<radialGradient id="${u}aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#5a7ad0" stop-opacity=".4"/><stop offset=".55" stop-color="#2a3a6a" stop-opacity=".14"/><stop offset="1" stop-color="#2a3a6a" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}eye" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd0c0"/><stop offset=".4" stop-color="#ff4a3a"/><stop offset="1" stop-color="#a00000"/></radialGradient>
<filter id="${u}lit" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="b"/><feSpecularLighting in="b" surfaceScale="4" specularConstant=".4" specularExponent="18" lighting-color="#dfe8ff" result="s"><fePointLight x="60" y="-40" z="160"/></feSpecularLighting><feComposite in="s" in2="SourceAlpha" operator="in" result="sc"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="sc"/></feMerge></filter>
<filter id="${u}glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<style>@media (prefers-reduced-motion: no-preference){.dfloat{animation:${u}fl 4.5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}.dwingR{animation:${u}wr 3s ease-in-out infinite;transform-box:fill-box;transform-origin:5% 67%}.dwingL{animation:${u}wl 3s ease-in-out infinite;transform-box:fill-box;transform-origin:95% 67%}.deye{animation:${u}gl 2.4s ease-in-out infinite}.dtail{animation:${u}tw 4s ease-in-out infinite;transform-box:fill-box;transform-origin:18% 82%}}@keyframes ${u}fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes ${u}wr{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(11deg)}}@keyframes ${u}wl{0%,100%{transform:rotate(7deg)}50%{transform:rotate(-11deg)}}@keyframes ${u}gl{0%,100%{opacity:.6}50%{opacity:1}}@keyframes ${u}tw{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(3deg)}}</style>
<g class="daura"><ellipse cx="150" cy="170" rx="180" ry="170" fill="url(#${u}aura)"/></g>
<g class="dfloat">
<g class="dtail">
<path d="M180 240 Q255 252 280 205 Q294 178 282 160 L296 166 Q304 200 284 230 Q256 274 184 266Z" fill="url(#dbody)" stroke="#18202f" stroke-width="5"/>
<path d="M282 160 l16 -9 l-5 14 l13 -2 l-16 12Z" fill="url(#dcream)" stroke="#18202f" stroke-width="4" stroke-linejoin="round"/>
<g fill="url(#dcream)" stroke="#18202f" stroke-width="2.5"><path d="M232 228 l-4 -16 l12 8z"/><path d="M258 212 l-2 -16 l12 9z"/></g>
</g>
<g class="dwingL" filter="url(#${u}lit)"><path d="M122 118 Q44 36 -16 6 Q-12 52 8 76 Q-20 86 6 120 Q-22 134 20 150 Q2 178 46 178 Q88 140 126 156Z" fill="url(#dwing)" stroke="#18202f" stroke-width="5" stroke-linejoin="round"/><g stroke="#9a8c68" stroke-width="2.5" fill="none" opacity=".7"><path d="M120 122 L-16 6"/><path d="M120 138 L8 76"/><path d="M120 150 L6 120"/></g></g>
<g class="dwingR" filter="url(#${u}lit)"><path d="M178 118 Q256 36 316 6 Q312 52 292 76 Q320 86 294 120 Q322 134 280 150 Q298 178 254 178 Q212 140 174 156Z" fill="url(#dwing)" stroke="#18202f" stroke-width="5" stroke-linejoin="round"/><g stroke="#9a8c68" stroke-width="2.5" fill="none" opacity=".7"><path d="M180 122 L316 6"/><path d="M180 138 L292 76"/><path d="M180 150 L294 120"/></g></g>
<g filter="url(#${u}lit)">
<path d="M112 238 Q92 270 102 300 L146 300 Q150 266 140 240Z" fill="url(#dbody)" stroke="#18202f" stroke-width="5"/>
<path d="M188 238 Q208 270 198 300 L154 300 Q150 266 160 240Z" fill="url(#dbody)" stroke="#18202f" stroke-width="5"/>
<g fill="url(#dcream)" stroke="#18202f" stroke-width="2.5" stroke-linejoin="round">
<path d="M102 296 l-7 12 l9 -1z"/><path d="M114 300 l-3 11 l8 -2z"/><path d="M126 300 l2 11 l7 -4z"/>
<path d="M198 296 l7 12 l-9 -1z"/><path d="M186 300 l3 11 l-8 -2z"/><path d="M174 300 l-2 11 l-7 -4z"/></g>
<path d="M100 150 Q150 128 200 150 Q218 200 198 252 Q150 270 102 252 Q82 200 100 150Z" fill="url(#dbody)" stroke="#18202f" stroke-width="6"/>
<path d="M120 170 Q150 160 180 170 Q190 210 176 252 Q150 262 124 252 Q110 210 120 170Z" fill="url(#dcream)" stroke="#18202f" stroke-width="3"/>
<g stroke="#b3a482" stroke-width="2.5" fill="none" opacity=".7"><path d="M122 190 Q150 184 178 190"/><path d="M120 212 Q150 206 180 212"/><path d="M122 234 Q150 228 178 234"/></g>
<path d="M106 156 Q78 172 74 212 Q72 230 90 230 L100 214 Q88 202 94 180 Q100 162 120 162Z" fill="url(#dbody)" stroke="#18202f" stroke-width="5"/>
<g fill="url(#dcream)" stroke="#18202f" stroke-width="2.5" stroke-linejoin="round"><path d="M78 226 l-8 12 l10 -2z"/><path d="M90 230 l-3 13 l9 -3z"/><path d="M100 228 l3 13 l8 -5z"/></g>
<path d="M194 158 Q222 172 224 214 Q224 230 206 230 L198 214 Q210 202 204 182 Q198 164 178 166Z" fill="url(#dbody)" stroke="#18202f" stroke-width="5"/>
<g fill="url(#dcream)" stroke="#18202f" stroke-width="2.5" stroke-linejoin="round"><path d="M220 226 l8 12 l-10 -2z"/><path d="M208 230 l3 13 l-9 -3z"/><path d="M198 228 l-3 13 l-8 -5z"/></g>
<g fill="url(#dcream)" stroke="#18202f" stroke-width="2.5"><path d="M150 130 l-10 -18 l10 5 l10 -5z"/><path d="M126 144 l-9 -15 l10 5 l8 -4z"/><path d="M174 144 l9 -15 l-10 5 l-8 -4z"/></g>
<path d="M92 102 Q86 52 134 40 Q170 32 202 48 Q228 62 224 102 Q224 126 200 138 Q170 150 140 147 Q106 145 96 128 Q90 116 92 102Z" fill="url(#dbody)" stroke="#18202f" stroke-width="6"/>
<path d="M100 60 Q74 18 96 -4 Q98 26 124 54Z" fill="url(#dcream)" stroke="#18202f" stroke-width="5" stroke-linejoin="round"/>
<path d="M216 60 Q242 18 220 -4 Q218 26 192 54Z" fill="url(#dcream)" stroke="#18202f" stroke-width="5" stroke-linejoin="round"/>
<path d="M90 92 Q70 86 60 96 Q74 96 84 106Z" fill="url(#dbody)" stroke="#18202f" stroke-width="4"/>
<path d="M226 92 Q246 86 256 96 Q242 96 232 106Z" fill="url(#dbody)" stroke="#18202f" stroke-width="4"/>
<path d="M108 84 L150 96 L146 108 L108 98Z" fill="#25324e" stroke="#18202f" stroke-width="3" stroke-linejoin="round"/>
<path d="M208 84 L166 96 L170 108 L208 98Z" fill="#25324e" stroke="#18202f" stroke-width="3" stroke-linejoin="round"/>
<g class="deye" filter="url(#${u}glow)"><ellipse cx="128" cy="104" rx="13" ry="9" fill="#ff4a3a"/><ellipse cx="180" cy="104" rx="13" ry="9" fill="#ff4a3a"/></g>
<g stroke="none"><ellipse cx="128" cy="104" rx="9" ry="7" fill="url(#${u}eye)"/><ellipse cx="180" cy="104" rx="9" ry="7" fill="url(#${u}eye)"/><circle cx="128" cy="104" r="3" fill="#2a0808"/><circle cx="180" cy="104" r="3" fill="#2a0808"/></g>
<path d="M100 120 Q150 150 208 120 Q200 142 150 145 Q108 142 100 120Z" fill="#1a1018" stroke="#18202f" stroke-width="5" stroke-linejoin="round"/>
<g fill="#fff" stroke="#18202f" stroke-width="1.5" stroke-linejoin="round"><path d="M118 124 l5 15 l7 -14z"/><path d="M138 130 l5 14 l7 -13z"/><path d="M162 130 l5 13 l7 -14z"/><path d="M184 124 l5 15 l7 -14z"/></g>
<circle cx="138" cy="116" r="2.6" fill="#18202f"/><circle cx="170" cy="116" r="2.6" fill="#18202f"/>
<g stroke="#3c4d70" stroke-width="3" fill="none" stroke-linecap="round"><path d="M98 122 Q60 118 46 132"/><path d="M210 122 Q248 118 262 132"/></g>
</g>
</g>
</svg>`;}

/* =========================================================
   SHARED ART SYSTEM — reusable premium collectibles.
   gemSVG(letter, color, size): a faceted, glowing cut-jewel with a crisp
   outlined letter, used for the Base gem shelf / collectibles. Keeps the
   "letter gems power the hero" motif premium without hurting readability.
========================================================= */
function gemSVG(g, color, w){
  const u="g"+(__huid++);
  return `<svg viewBox="-26 -28 52 56" width="${w||46}" aria-hidden="true">
<defs>
<radialGradient id="${u}b" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${color}" stop-opacity=".7"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}f" cx=".4" cy=".28" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".28" stop-color="${color}"/><stop offset="1" stop-color="#0a0414" stop-opacity=".55"/></radialGradient>
</defs>
<ellipse cx="0" cy="20" rx="15" ry="4" fill="#000" opacity=".35"/>
<circle cx="0" cy="-1" r="25" fill="url(#${u}b)"/>
<polygon points="0,-19 17,-8 17,9 0,20 -17,9 -17,-8" fill="url(#${u}f)" stroke="#150f2e" stroke-width="3" stroke-linejoin="round"/>
<polygon points="0,-19 17,-8 0,3 -17,-8" fill="#fff" opacity=".26"/>
<g stroke="#150f2e" stroke-width="1" opacity=".35" fill="none"><path d="M-17,-8 L0,3 L17,-8 M0,3 L0,20"/></g>
<path d="M-9,-12 L-3,-14 L-5,-7 L-11,-6Z" fill="#fff" opacity=".9"/>
<text y="10" text-anchor="middle" font-family="Andika,sans-serif" font-weight="700" font-size="17" fill="#fff" stroke="#150f2e" stroke-width="3.4" paint-order="stroke" style="paint-order:stroke">${g}</text>
</svg>`;
}
