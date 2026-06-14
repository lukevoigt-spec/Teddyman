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
if(o.weapon==="lasso"){weapon=`<g transform="translate(202 -2) rotate(8)" stroke-linejoin="round" fill="none">
<ellipse cx="0" cy="-78" rx="46" ry="60" stroke="#150f2e" stroke-width="13"/><ellipse cx="0" cy="-78" rx="46" ry="60" stroke="#cf9a5a" stroke-width="9"/><ellipse cx="0" cy="-78" rx="46" ry="60" stroke="#e9c187" stroke-width="3"/>
<path d="M0 -18 Q-8 52 6 132" stroke="#150f2e" stroke-width="13" stroke-linecap="round"/><path d="M0 -18 Q-8 52 6 132" stroke="#cf9a5a" stroke-width="9" stroke-linecap="round"/><path d="M0 -18 Q-8 52 6 132" stroke="#e9c187" stroke-width="3" stroke-linecap="round"/></g>`;}
if(o.weapon==="bow"){weapon=`<g transform="translate(214 78) rotate(4)" stroke-linejoin="round">
<path d="M0 -112 Q48 -56 0 0 Q48 56 0 112" fill="none" stroke="#150f2e" stroke-width="13"/><path d="M0 -112 Q48 -56 0 0 Q48 56 0 112" fill="none" stroke="#8a5a33" stroke-width="9"/><path d="M0 -112 Q48 -56 0 0 Q48 56 0 112" fill="none" stroke="#c98a4a" stroke-width="3"/>
<line x1="0" y1="-112" x2="0" y2="112" stroke="#150f2e" stroke-width="5"/><line x1="0" y1="-112" x2="0" y2="112" stroke="#eef2ff" stroke-width="2.4"/>
<line x1="-2" y1="0" x2="-66" y2="0" stroke="#150f2e" stroke-width="9"/><line x1="-2" y1="0" x2="-66" y2="0" stroke="#a0703a" stroke-width="6"/>
<polygon points="-66,0 -52,-8 -52,8" fill="#dfe9ff" stroke="#150f2e" stroke-width="3"/><polygon points="6,0 18,-7 18,7" fill="#ff7d3a" stroke="#150f2e" stroke-width="2.5"/></g>`;}
if(o.weapon==="mace"){weapon=`<g transform="translate(202 4) rotate(14)" stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<rect x="-7" y="18" width="14" height="150" rx="7" fill="#6b6f7a"/>
<polygon points="0,-82 9,-58 32,-66 16,-46 34,-30 9,-38 0,-12 -9,-38 -34,-30 -16,-46 -32,-66 -9,-58" fill="#9aa0ad"/>
<circle cx="0" cy="-48" r="20" fill="url(#${u}gold)"/><circle cx="-7" cy="-55" r="6" fill="#fff0bd" stroke="none"/></g>`;}
if(o.weapon==="lance"){weapon=`<g transform="translate(208 80) rotate(-24)" stroke="#150f2e" stroke-width="5" stroke-linejoin="round">
<rect x="-6" y="-96" width="12" height="208" rx="6" fill="#8a5a33"/>
<polygon points="0,-150 15,-96 -15,-96" fill="url(#${u}gold)"/><polygon points="0,-150 6,-114 -6,-114" fill="#fff0bd"/>
<rect x="-20" y="-94" width="40" height="13" rx="6" fill="#b0b6c4"/>
<rect x="-13" y="104" width="26" height="20" rx="8" fill="#6b6f7a"/></g>`;}
const heldWeapon = ["hammer","sword","lasso","bow","mace","lance"].includes(o.weapon);
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
${heldWeapon?weapon:""}
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

/* ---- GENERATED-RASTER cast (Trinity's charArt resolver, QA 2026-06-14) ----
   RASTER = a manifest: flip a flag the moment a character's PNG lands in art/ (authored on a
   uniform 560² canvas — transparent, centered, feet near the baseline). rasterArt() wraps any
   such PNG identically (soft aura + contact shadow + idle bob), and teddyArt/allyBody consult the
   manifest so generated raster replaces the old SVG per-character, with the SVG as a safe fallback
   (a half-finished rollout never breaks a screen). Villain rasters (vex/vixen) live directly in
   inkblotSVG/vixenSVG. ---- */
const RASTER={ "teddy-m0":true,"teddy-m1":true,"teddy-m2":true,
  "teddy-knight-m0":true,"teddy-knight-m1":true,"teddy-knight-m2":true,
  "ally-tank":true, "ally-sunny":true, "ally-heart":true, "ally-flip":true, "ally-leighton":true };
function rasterArt(file,w=210,a0="#ffce3a",a1="#3a7bff"){
const u="r"+(__huid++);
return `<svg viewBox="0 0 240 256" width="${w}" aria-hidden="true">
<defs><radialGradient id="${u}a" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${a0}" stop-opacity=".4"/><stop offset=".5" stop-color="${a1}" stop-opacity=".16"/><stop offset="1" stop-color="${a1}" stop-opacity="0"/></radialGradient></defs>
<style>@media (prefers-reduced-motion: no-preference){.${u}f{animation:${u}k 4.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}}@keyframes ${u}k{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}</style>
<g><ellipse cx="120" cy="117" rx="127" ry="141" fill="url(#${u}a)"/></g>
<ellipse cx="120" cy="240" rx="65" ry="13" fill="#0a0a18" opacity=".4"/>
<g class="${u}f"><image x="8" y="2" width="224" height="224" href="art/${file}.png"/></g>
</svg>`;}
/* PAINTED Super Teddy by muscle tier — hero (teddy-m*) / Act-2 knight (teddy-knight-m*). */
function teddyArt(w=210, muscle=1, theme="hero"){
  const m=Math.max(0,Math.min(2,muscle|0));
  return theme==="knight" ? rasterArt("teddy-knight-m"+m, w, "#ffba4a", "#c77a2a")
                          : rasterArt("teddy-m"+m, w, "#ffce3a", "#3a7bff"); }

/* ---- LORD VEX / VEXBOT (refined: angled glowing visor, sharper menace) ---- */
function inkblotSVG(w=240){
const u="v"+(__huid++);
/* Lord Vex marquee: generated raster (art/vex.png, transparent). Wrapped in an <svg> so it keeps a
   sinister red aura, contact shadow + idle bob and the same sizing API the intro/boss/cage all call. */
return `<svg viewBox="0 0 240 252" width="${w}" aria-hidden="true">
<defs><radialGradient id="${u}a" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff2e2e" stop-opacity=".5"/><stop offset=".5" stop-color="#c01020" stop-opacity=".18"/><stop offset="1" stop-color="#c01020" stop-opacity="0"/></radialGradient></defs>
<style>@media (prefers-reduced-motion: no-preference){.vfloat{animation:${u}fl 4.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}}@keyframes ${u}fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}</style>
<g class="vaura"><ellipse cx="120" cy="116" rx="130" ry="142" fill="url(#${u}a)"/></g>
<ellipse cx="120" cy="240" rx="64" ry="13" fill="#0a0510" opacity=".42"/>
<g class="vfloat"><image x="6" y="0" width="228" height="228" href="art/vex.png"/></g>
</svg>`;}

/* ---- mentors (Mom & Dad chips) — unchanged ---- */
function mentorChips(w=120){
const u="mc"+(__huid++);
/* Mom & Dad mentors — generated rasters (art/dad.png + art/mom.png) side by side, each with a
   soft signature aura + contact shadow. Used in the intro + interlude cutscenes; the cutscene's
   faceSpeak bobs the whole portrait during narration, so no per-figure idle here. */
return `<svg viewBox="0 0 460 250" width="${w}" aria-hidden="true">
<defs>
<radialGradient id="${u}d" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#3a7bff" stop-opacity=".28"/><stop offset="1" stop-color="#3a7bff" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}m" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff7d9c" stop-opacity=".28"/><stop offset="1" stop-color="#ff7d9c" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="118" cy="120" rx="118" ry="126" fill="url(#${u}d)"/>
<ellipse cx="342" cy="120" rx="118" ry="126" fill="url(#${u}m)"/>
<ellipse cx="118" cy="234" rx="60" ry="12" fill="#0a0a18" opacity=".38"/>
<ellipse cx="342" cy="234" rx="60" ry="12" fill="#0a0a18" opacity=".38"/>
<image x="6" y="6" width="224" height="224" href="art/dad.png"/>
<image x="230" y="6" width="224" height="224" href="art/mom.png"/>
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
function allyEyes(){ return `<g stroke="#4a3526" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"><path d="M-12 -6 Q-8 -8.5 -4 -6.5"/><path d="M4 -6.5 Q8 -8.5 12 -6"/></g>`+
  `<circle cx="-8" cy="0" r="3.8" fill="#fff"/><circle cx="9" cy="0" r="3.8" fill="#fff"/>`+
  `<circle cx="-8" cy=".4" r="2.2" fill="#150f2e"/><circle cx="9" cy=".4" r="2.2" fill="#150f2e"/>`+
  `<circle cx="-7" cy="-1.1" r="1" fill="#fff"/><circle cx="10" cy="-1.1" r="1" fill="#fff"/>`; }
/* Real-friend faces — stylized to recognizable traits (hair colour/style +
   expression), built from the parent's photos. Not photoreal; just "clearly them". */
function allyFace(kind){
  const u="af"+(__huid++);
  const head=`<defs><radialGradient id="${u}sk" cx=".4" cy=".3" r=".78"><stop offset="0" stop-color="#ffeada"/><stop offset=".68" stop-color="#ffd3b0"/><stop offset="1" stop-color="#e3a57e"/></radialGradient>`+
    `<radialGradient id="${u}rm" cx=".5" cy=".42" r=".6"><stop offset=".68" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#7a3a1a" stop-opacity=".24"/></radialGradient></defs>`+
    `<circle r="26" fill="url(#${u}sk)" stroke="#150f2e" stroke-width="4"/><circle r="26" fill="url(#${u}rm)"/>`;
  const smile=`<path d="M-8 10 Q1 17 9 9" stroke="#9c4a3a" stroke-width="3.2" fill="none" stroke-linecap="round"/>`+
    `<path d="M-1 1 Q3 7 -2 9" stroke="#d2926a" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"/>`+
    `<g fill="#ff9a8a" opacity=".3"><circle cx="-13" cy="6" r="3.8"/><circle cx="13" cy="6" r="3.8"/></g>`;
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
  if(kind==="tank")return head+   /* Archie — golden-blond, longer tousled/shaggy, side-swept (from his photo) */
    `<path d="M-28 4 Q-35 -35 -2 -38 Q31 -37 29 0 Q25 -13 18 -13 Q23 -28 8 -26 Q14 -35 -2 -31 Q4 -37 -13 -29 Q-9 -35 -23 -25 Q-28 -14 -28 4Z" fill="#ddb968" stroke="#150f2e" stroke-width="3" stroke-linejoin="round"/>`+
    `<path d="M-27 -3 Q-35 15 -26 30 Q-23 17 -18 9 L-21 -11Z" fill="#ddb968" stroke="#150f2e" stroke-width="2.4" stroke-linejoin="round"/>`+
    `<path d="M27 -3 Q35 15 26 30 Q23 17 18 9 L21 -11Z" fill="#d6af60" stroke="#150f2e" stroke-width="2.4" stroke-linejoin="round"/>`+
    `<path d="M21 -25 Q2 -8 -23 -14 Q-11 -12 -2 -16 Q-17 -10 -22 -2 Q-5 -18 15 -17 Q20 -23 21 -25Z" fill="#e9ce80" stroke="#150f2e" stroke-width="2.4" stroke-linejoin="round"/>`+
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
  if(kind==="jj")return head+   /* JJ — small, dark spiky hair, wild energy, big grin */
    `<path d="M-25 -4 Q-27 -33 -2 -34 Q26 -35 25 -3 Q19 -22 11 -17 Q14 -29 5 -22 Q8 -33 -3 -24 Q-5 -33 -13 -22 Q-13 -30 -21 -16 Q-24 -12 -25 -4Z" fill="#2e2014" stroke="#150f2e" stroke-width="3" stroke-linejoin="round"/>`+
    allyEyes()+
    `<path d="M-12 8 Q0 22 12 8 Q0 15 -12 8Z" fill="#7c3a3a" stroke="#150f2e" stroke-width="2.6"/>`+
    `<path d="M-9 8 Q0 11 9 8 L9 10 Q0 12 -9 10Z" fill="#fff"/>`;
  if(kind==="cal")return head+   /* Cal — strawberry-blonde, freckles, mischievous smirk */
    `<path d="M-25 -2 Q-27 -31 0 -32 Q27 -31 25 -2 Q20 -20 12 -16 Q15 -27 6 -21 Q8 -31 -3 -23 Q-5 -31 -13 -21 Q-13 -28 -21 -15 Q-24 -10 -25 -2Z" fill="#e8a85e" stroke="#150f2e" stroke-width="3" stroke-linejoin="round"/>`+
    allyEyes()+
    `<g stroke="none" fill="#d98a5a" opacity=".75"><circle cx="-12" cy="6" r="1.5"/><circle cx="-7" cy="9" r="1.5"/><circle cx="7" cy="9" r="1.5"/><circle cx="12" cy="6" r="1.5"/><circle cx="0" cy="10" r="1.4"/></g>`+
    `<path d="M-9 9 Q2 18 12 7" stroke="#9c4a3a" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  if(kind==="nora")return head+   /* Nora — very petite, hair in a neat bun */
    `<path d="M-24 -2 Q-26 -29 0 -29 Q26 -29 24 -2 Q24 14 18 22 L15 -6 Q14 -20 0 -19 Q-14 -20 -15 -6 L-18 22 Q-24 14 -24 -2Z" fill="#5a4030" stroke="#150f2e" stroke-width="3"/>`+
    `<circle cx="0" cy="-26" r="8" fill="#5a4030" stroke="#150f2e" stroke-width="2.5"/>`+
    allyEyes()+
    `<path d="M-7 10 Q0 15 7 10" stroke="#9c4a3a" stroke-width="3" fill="none" stroke-linecap="round"/>`+
    `<g fill="#ff9a8a" opacity=".3"><circle cx="-12" cy="7" r="3.4"/><circle cx="12" cy="7" r="3.4"/></g>`;
  if(kind==="mom")return head+   /* Mom — warm, long auburn hair, kind smile */
    `<path d="M-26 0 Q-28 -32 0 -32 Q28 -32 26 0 Q26 20 19 30 L16 -8 Q14 -22 0 -20 Q-14 -22 -16 -8 L-19 30 Q-26 20 -26 0Z" fill="#8a4b2e" stroke="#150f2e" stroke-width="3" stroke-linejoin="round"/>`+
    `<path d="M-19 18 Q-24 32 -16 38 M19 18 Q24 32 16 38" stroke="#8a4b2e" stroke-width="7" fill="none" stroke-linecap="round"/>`+
    `<path d="M-14 -20 Q0 -30 14 -20 Q7 -16 0 -17 Q-7 -16 -14 -20Z" fill="#9c5638" stroke="#150f2e" stroke-width="2"/>`+
    allyEyes()+ smile;
  if(kind==="dad")return head+   /* Dad — strong jaw, short dark hair, confident */
    `<path d="M-25 -6 Q-26 -30 0 -31 Q26 -30 25 -6 Q24 -16 18 -16 Q16 -24 6 -21 Q4 -26 -4 -22 Q-8 -25 -16 -19 Q-22 -17 -25 -6Z" fill="#2e2218" stroke="#150f2e" stroke-width="3" stroke-linejoin="round"/>`+
    `<path d="M-13 -3 Q-8 -7 -3 -3 M3 -3 Q8 -7 13 -3" stroke="#150f2e" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".55"/>`+
    allyEyes()+
    `<path d="M-9 10 Q0 16 9 10" stroke="#9c4a3a" stroke-width="3.4" fill="none" stroke-linecap="round"/>`+
    `<path d="M-7 1 Q-4 5 -7 8 M7 1 Q4 5 7 8" stroke="#caa07a" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".45"/>`;
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
   FULL-BODY ALLY ART — a heroic standing figure per friend, for the
   Hero Base "trading card" popup. Parametric (one template, per-kind config):
   reuses allyFace(kind) for the head, draws a caped super-suit torso + arms in
   a confident pose. Pure SVG string, no game state. ========================= */
function _shade(hex,p){ const n=parseInt(hex.slice(1),16); const r=Math.round(((n>>16)&255)*(1-p)),
  g=Math.round(((n>>8)&255)*(1-p)), b=Math.round((n&255)*(1-p));
  return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1); }
const BODY_CFG={
  tank:    {col:"#e6453c", pose:"flex",  init:"T"},
  flip:    {col:"#3a9bff", pose:"hips",  init:"F"},
  sunny:   {col:"#ffce3a", pose:"stand", init:"S"},
  heart:   {col:"#ff7d9c", pose:"hips",  init:"♥"},
  leighton:{col:"#a06ae8", pose:"stand", init:"★"},
  kendall: {col:"#5fa86a", pose:"stand", init:"K"},
  jj:      {col:"#ff8a3a", pose:"flex",  init:"J"},
  cal:     {col:"#2bb5a6", pose:"hips",  init:"C"},
  nora:    {col:"#b79be0", pose:"stand", init:"N"},
  mom:     {col:"#ff7a6b", pose:"stand", init:"M"},
  dad:     {col:"#2c5fb0", pose:"flex",  init:"D"}
};
/* dispatch: characters with a real-life outfit get a bespoke body; the rest use
   the generic caped super-suit template. */
function allyBody(kind,w=200){
  if(RASTER["ally-"+kind]){ const ac=(typeof ALLY_COL!=="undefined"&&ALLY_COL[kind])||"#ffb43a"; return rasterArt("ally-"+kind, w, ac, ac); }   /* generated raster, aura in the ally's signature colour */
  if(kind==="tank")return archieBody(w);
  if(kind==="flip")return ellieBody(w);
  if(kind==="heart")return ameliaBody(w);
  if(kind==="leighton")return leightonBody(w);
  return genericBody(kind,w);
}
function _flower(x,y,s,c){ let p=""; for(let i=0;i<5;i++){ const a=i/5*6.283; p+=`<circle cx="${(Math.cos(a)*s).toFixed(1)}" cy="${(Math.sin(a)*s).toFixed(1)}" r="${(s*0.62).toFixed(1)}" fill="${c}"/>`; }
  return `<g transform="translate(${x} ${y})">${p}<circle r="${(s*0.5).toFixed(1)}" fill="#ffd75e"/></g>`; }
/* ELLIE — gymnast: sparkly leotard, graceful arms-up finish pose, ballet slippers. */
function ellieBody(w=200){ const u="el"+(__huid++), skin="#ffd9bd", leo="#e84d9c", leoD="#a8276b";
  const armS=d=>`<path d="${d}" fill="none" stroke="#150f2e" stroke-width="14" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${skin}" stroke-width="9" stroke-linecap="round"/>`;
  return `<svg viewBox="-72 -116 144 256" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="${u}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${leo}"/><stop offset="1" stop-color="${leoD}"/></linearGradient>
<radialGradient id="${u}au" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff7ec0" stop-opacity=".4"/><stop offset="1" stop-color="#ff7ec0" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="0" cy="116" rx="38" ry="9" fill="#000" opacity=".32"/>
<ellipse cx="0" cy="-6" rx="78" ry="116" fill="url(#${u}au)"/>
${armS("M-25 -38 Q-44 -64 -52 -92")}${armS("M25 -38 Q44 -64 52 -92")}
<circle cx="-53" cy="-94" r="5.5" fill="${skin}" stroke="#150f2e" stroke-width="3"/>
<circle cx="53" cy="-94" r="5.5" fill="${skin}" stroke="#150f2e" stroke-width="3"/>
<path d="M-15 34 Q-13 82 -8 104 L-1 104 L-2 34Z" fill="${skin}" stroke="#150f2e" stroke-width="4"/>
<path d="M15 34 Q13 82 8 104 L1 104 L2 34Z" fill="${skin}" stroke="#150f2e" stroke-width="4"/>
<path d="M-10 102 Q-15 114 -5 116 Q1 114 0 106Z" fill="${leoD}" stroke="#150f2e" stroke-width="3"/>
<path d="M10 102 Q15 114 5 116 Q-1 114 0 106Z" fill="${leoD}" stroke="#150f2e" stroke-width="3"/>
<path d="M-26 -42 Q-33 -8 -18 24 Q-10 40 0 40 Q10 40 18 24 Q33 -8 26 -42 Q12 -50 0 -50 Q-12 -50 -26 -42Z" fill="url(#${u}l)" stroke="#150f2e" stroke-width="5"/>
<path d="M-24 -34 L22 10" stroke="#ffd75e" stroke-width="5" stroke-linecap="round" opacity=".9"/>
<g fill="#fff"><circle cx="-10" cy="-18" r="1.7"/><circle cx="9" cy="-6" r="1.7"/><circle cx="-3" cy="8" r="1.5"/><circle cx="14" cy="-28" r="1.4"/><circle cx="2" cy="-30" r="1.3"/></g>
<g transform="translate(0 -80) scale(1.02)">${allyFace("flip")}</g>
</svg>`;
}
/* AMELIA — petite, cute teal dress with a pink sash + hair bow (not a super-suit). */
function ameliaBody(w=200){ const u="am"+(__huid++), skin="#ffdcc2", dr="#37b8c4", drD="#1d7e8c", bow="#ff7d9c";
  const armS=d=>`<path d="${d}" fill="none" stroke="#150f2e" stroke-width="12" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${skin}" stroke-width="7.5" stroke-linecap="round"/>`;
  return `<svg viewBox="-72 -116 144 256" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="${u}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dr}"/><stop offset="1" stop-color="${drD}"/></linearGradient>
<radialGradient id="${u}au" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7fe8f0" stop-opacity=".4"/><stop offset="1" stop-color="#7fe8f0" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="0" cy="104" rx="36" ry="8" fill="#000" opacity=".32"/>
<ellipse cx="0" cy="4" rx="68" ry="100" fill="url(#${u}au)"/>
<rect x="-12" y="40" width="10" height="34" rx="5" fill="${skin}" stroke="#150f2e" stroke-width="3.5"/>
<rect x="2" y="40" width="10" height="34" rx="5" fill="${skin}" stroke="#150f2e" stroke-width="3.5"/>
<path d="M-14 70 Q-16 78 -7 79 L-1 79 L-1 70Z" fill="${bow}" stroke="#150f2e" stroke-width="3"/>
<path d="M14 70 Q16 78 7 79 L1 79 L1 70Z" fill="${bow}" stroke="#150f2e" stroke-width="3"/>
<path d="M-18 -4 Q-36 32 -30 50 Q0 42 30 50 Q36 32 18 -4Z" fill="url(#${u}d)" stroke="#150f2e" stroke-width="5"/>
<path d="M-20 -38 Q-23 -18 -18 -4 L18 -4 Q23 -18 20 -38 Q10 -45 0 -45 Q-10 -45 -20 -38Z" fill="url(#${u}d)" stroke="#150f2e" stroke-width="5"/>
<rect x="-18" y="-8" width="36" height="6" rx="3" fill="${bow}" stroke="#150f2e" stroke-width="2.5"/>
${armS("M-22 -30 Q-32 -8 -13 11")}${armS("M22 -30 Q32 -8 13 11")}
<circle cx="0" cy="13" r="6.5" fill="${skin}" stroke="#150f2e" stroke-width="3"/>
<g transform="translate(0 -80) scale(.98)">${allyFace("heart")}</g>
<g transform="translate(-13 -100)"><path d="M0 0 Q-9 -6 -9 2 Q-9 7 0 4 Q9 7 9 2 Q9 -6 0 0Z" fill="${bow}" stroke="#150f2e" stroke-width="2.4"/><circle r="2.2" fill="#fff"/></g>
</svg>`;
}
/* LEIGHTON — flowery princess: flowing lavender gown, flower crown + bouquet (not a super-suit). */
function leightonBody(w=200){ const u="lg"+(__huid++), skin="#ffdcc2", gown="#c89be6", gownD="#8e5fc0", petal="#ff9ec7";
  const armS=d=>`<path d="${d}" fill="none" stroke="#150f2e" stroke-width="13" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${skin}" stroke-width="8" stroke-linecap="round"/>`;
  return `<svg viewBox="-72 -116 144 256" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${gown}"/><stop offset="1" stop-color="${gownD}"/></linearGradient>
<radialGradient id="${u}au" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d9aef0" stop-opacity=".45"/><stop offset="1" stop-color="#d9aef0" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="0" cy="116" rx="48" ry="11" fill="#000" opacity=".34"/>
<ellipse cx="0" cy="-4" rx="82" ry="120" fill="url(#${u}au)"/>
<path d="M-22 -36 Q-30 22 -46 106 Q0 96 46 106 Q30 22 22 -36 Q10 -44 0 -44 Q-10 -44 -22 -36Z" fill="url(#${u}g)" stroke="#150f2e" stroke-width="5.5"/>
<path d="M-15 2 Q-19 56 -22 102 M0 2 L0 100 M15 2 Q19 56 22 102" stroke="${gownD}" stroke-width="2.4" fill="none" opacity=".55"/>
<path d="M-20 -38 Q-22 -16 -16 -2 L16 -2 Q22 -16 20 -38 Q10 -45 0 -45 Q-10 -45 -20 -38Z" fill="url(#${u}g)" stroke="#150f2e" stroke-width="5"/>
<g>${_flower(-14,-4,4,petal)}${_flower(0,-1,4,"#fff")}${_flower(14,-4,4,petal)}</g>
${armS("M-22 -32 Q-34 -8 -20 14")}${armS("M22 -32 Q33 -6 16 16")}
<g transform="translate(18 18)">${_flower(0,0,5,petal)}${_flower(-9,4,4.5,"#fff")}${_flower(8,5,4.5,petal)}<path d="M-2 6 L-4 22 M4 6 L6 22" stroke="#7bd08a" stroke-width="2.4"/></g>
<g transform="translate(0 -80) scale(1.03)">${allyFace("leighton")}</g>
<g transform="translate(0 -104)">${_flower(-12,2,4,petal)}${_flower(0,-2,4.5,"#fff")}${_flower(12,2,4,petal)}</g>
</svg>`;
}
/* ARCHIE — sporty athlete: team jersey (#7), athletic shorts, crew socks + sneakers. */
function archieBody(w=200){ const u="ar"+(__huid++), skin="#f3c79c",
  jer="#ff7a2f", jerD="#c9501a", sho="#26407a", shoD="#15234a";
  const armS=d=>`<path d="${d}" fill="none" stroke="#150f2e" stroke-width="16" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${skin}" stroke-width="11" stroke-linecap="round"/>`;
  return `<svg viewBox="-72 -116 144 256" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="${u}j" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${jer}"/><stop offset="1" stop-color="${jerD}"/></linearGradient>
<linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sho}"/><stop offset="1" stop-color="${shoD}"/></linearGradient>
<radialGradient id="${u}au" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff9a4f" stop-opacity=".42"/><stop offset="1" stop-color="#ff9a4f" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="0" cy="118" rx="46" ry="11" fill="#000" opacity=".34"/>
<ellipse cx="0" cy="-4" rx="80" ry="118" fill="url(#${u}au)"/>
${armS("M-30 -34 Q-48 -8 -42 28")}${armS("M30 -34 Q48 -8 42 28")}
<circle cx="-42" cy="30" r="6.5" fill="${skin}" stroke="#150f2e" stroke-width="3.5"/>
<circle cx="42" cy="30" r="6.5" fill="${skin}" stroke="#150f2e" stroke-width="3.5"/>
<rect x="-21" y="58" width="15" height="42" rx="6.5" fill="${skin}" stroke="#150f2e" stroke-width="4"/>
<rect x="6" y="58" width="15" height="42" rx="6.5" fill="${skin}" stroke="#150f2e" stroke-width="4"/>
<rect x="-22" y="95" width="17" height="17" rx="3.5" fill="#fff" stroke="#150f2e" stroke-width="3.5"/>
<rect x="5" y="95" width="17" height="17" rx="3.5" fill="#fff" stroke="#150f2e" stroke-width="3.5"/>
<rect x="-22" y="99" width="17" height="3.4" fill="${jer}"/><rect x="5" y="99" width="17" height="3.4" fill="${jer}"/>
<path d="M-22 110 L-4 110 L-4 116 Q-4 121 -11 121 L-28 121 Q-31 111 -22 110Z" fill="#f0f0f2" stroke="#150f2e" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M22 110 L4 110 L4 116 Q4 121 11 121 L28 121 Q31 111 22 110Z" fill="#f0f0f2" stroke="#150f2e" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M-26 117 h17 M9 117 h17" stroke="#150f2e" stroke-width="2" opacity=".5"/>
<path d="M-22 30 L22 30 L22 50 Q12 57 2 55 L0 42 L-2 55 Q-12 57 -22 50Z" fill="url(#${u}s)" stroke="#150f2e" stroke-width="5"/>
<path d="M-34 -42 Q-43 -16 -23 34 L23 34 Q43 -16 34 -42 Q24 -47 18 -44 Q0 -34 -18 -44 Q-24 -47 -34 -42Z" fill="url(#${u}j)" stroke="#150f2e" stroke-width="5.5"/>
<path d="M-18 -44 Q0 -33 18 -44" fill="none" stroke="${jerD}" stroke-width="3.4" stroke-linecap="round"/>
<text x="0" y="2" text-anchor="middle" font-family="Bangers,sans-serif" font-size="28" fill="#fff" stroke="${jerD}" stroke-width="1.2">7</text>
<g transform="translate(0 -80) scale(1.04)">${allyFace("tank")}</g>
</svg>`;
}
function genericBody(kind,w=200){
  const cfg=BODY_CFG[kind]||BODY_CFG.tank, col=cfg.col, dk=_shade(col,.40), u="bd"+(__huid++), skin="#ffd3b0";
  const fist=(x,y)=>`<circle cx="${x}" cy="${y}" r="6.5" fill="${skin}" stroke="#150f2e" stroke-width="3.5"/>`;
  const limb=d=>`<path d="${d}" fill="none" stroke="#150f2e" stroke-width="17" stroke-linecap="round"/>`+
    `<path d="${d}" fill="none" stroke="${col}" stroke-width="11" stroke-linecap="round"/>`;
  let arms;
  if(cfg.pose==="flex") arms=limb("M-30 -36 Q-52 -40 -50 -62 Q-49 -74 -40 -76")+limb("M30 -36 Q52 -40 50 -62 Q49 -74 40 -76")+fist(-40,-78)+fist(40,-78);
  else if(cfg.pose==="hips") arms=limb("M-30 -36 Q-50 -18 -44 2 Q-41 9 -24 8")+limb("M30 -36 Q50 -18 44 2 Q41 9 24 8")+fist(-23,9)+fist(23,9);
  else arms=limb("M-30 -36 Q-44 -6 -40 30")+limb("M30 -36 Q44 -6 40 30")+fist(-40,33)+fist(40,33);
  const torso="M-36 -44 Q-46 -18 -22 38 L22 38 Q46 -18 36 -44 Q12 -52 0 -52 Q-12 -52 -36 -44Z";
  return `<svg viewBox="-72 -116 144 256" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}"/><stop offset="1" stop-color="${dk}"/></linearGradient>
<linearGradient id="${u}sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
<radialGradient id="${u}au" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${col}" stop-opacity=".5"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>
</defs>
<ellipse cx="0" cy="118" rx="46" ry="11" fill="#000" opacity=".34"/>
<ellipse cx="0" cy="-4" rx="80" ry="118" fill="url(#${u}au)"/>
<path d="M-28 -42 Q-56 24 -38 104 Q-6 86 0 92 Q6 86 38 104 Q56 24 28 -42 Q0 -32 -28 -42Z" fill="${dk}" stroke="#150f2e" stroke-width="5"/>
${arms}
<rect x="-22" y="36" width="15" height="78" rx="7.5" fill="${dk}" stroke="#150f2e" stroke-width="4.5"/>
<rect x="7" y="36" width="15" height="78" rx="7.5" fill="${dk}" stroke="#150f2e" stroke-width="4.5"/>
<rect x="-26" y="104" width="22" height="22" rx="7" fill="#2a2440" stroke="#150f2e" stroke-width="4.5"/>
<rect x="4" y="104" width="22" height="22" rx="7" fill="#2a2440" stroke="#150f2e" stroke-width="4.5"/>
<path d="${torso}" fill="url(#${u}b)" stroke="#150f2e" stroke-width="5.5"/>
<path d="${torso}" fill="url(#${u}sh)"/>
<rect x="-24" y="30" width="48" height="13" rx="4" fill="#ffce3a" stroke="#150f2e" stroke-width="4"/>
<circle cx="0" cy="36.5" r="5.5" fill="${col}" stroke="#150f2e" stroke-width="3"/>
<g transform="translate(0 -8)"><path d="M0 -13 l11 6 v13 l-11 6 -11 -6 v-13z" fill="#fff" opacity=".94" stroke="#150f2e" stroke-width="3"/><text y="5.5" text-anchor="middle" font-family="Bangers,sans-serif" font-size="15" fill="${dk}">${cfg.init}</text></g>
<g transform="translate(0 -80) scale(1.04)">${allyFace(kind)}</g>
</svg>`;
}

/* =========================================================
   ACT-2 PLACEHOLDER ART (refine when parent provides references).
   The Vixen, the time portal, and the captured friends — used only in the
   Act-1 finale interlude handoff. Flat-vector, no flicker (seizure-safe).
========================================================= */

/* ---- THE VIXEN (Act-2 villain; sly woman who morphs into a dragon) ---- */
function vixenSVG(w=240){
const u="x"+(__huid++);
// Marquee art: generated raster (art/vixen.png, transparent). Kept as an <svg>
// wrapper so the signature, magenta aura, idle-bob + contact shadow still apply
// at every call site. Raster is cheaper than the old specular filters, so it's
// fine on the Lite tier too (no SVG fallback needed).
return `<svg viewBox="0 0 240 252" width="${w}" aria-hidden="true">
<defs>
<radialGradient id="${u}aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff2e7a" stop-opacity=".5"/><stop offset=".55" stop-color="#b0105a" stop-opacity=".18"/><stop offset="1" stop-color="#b0105a" stop-opacity="0"/></radialGradient>
</defs>
<style>@media (prefers-reduced-motion: no-preference){
.xfloat{animation:${u}fl 5s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
.xember{animation:${u}em 3.2s ease-in-out infinite}}
@keyframes ${u}fl{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-6px) rotate(.5deg)}}
@keyframes ${u}em{0%{opacity:0;transform:translateY(0)}30%{opacity:.9}100%{opacity:0;transform:translateY(-26px)}}</style>
<g class="xaura"><ellipse cx="120" cy="116" rx="132" ry="146" fill="url(#${u}aura)"/></g>
<ellipse cx="120" cy="236" rx="62" ry="12" fill="#160410" opacity=".4"/>
<g class="xfloat"><image x="6" y="-6" width="228" height="228" href="art/vixen.png"/></g>
<g class="xember" fill="#ff5d8f"><circle cx="30" cy="150" r="3"/><circle cx="210" cy="138" r="2.5"/></g>
<g class="xember" fill="#ffd0e0" style="animation-delay:1.6s"><circle cx="50" cy="176" r="2"/><circle cx="192" cy="168" r="2.5"/></g>
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

/* ---- NOAH THE RED — Act-2 mentor wizard (Gandalf-coded, real Uncle Noah's red hair+beard).
   Generated raster (art/noah.png), warm gold/crimson mage aura. ---- */
function noahSVG(w=220){ return rasterArt("noah", w, "#ffce6a", "#c0301a"); }

/* ---- DRAGON — Act-2 boss (the Vixen's dragon army). Generated raster (art/dragon.png), fiery aura. ---- */
function dragonSVG(w=240){ return rasterArt("dragon", w, "#ff6a2a", "#c0301a"); }

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

/* MOUTH CUE (research rec #3): a small, friendly articulatory-cue mouth for the Learn screen — a
   handful of shapes by place/manner, NOT a realistic mouth (low art cost). data-content.js MOUTHCUE
   maps each taught grapheme -> a shape id + a kid cue line. Pure SVG string, no game state. */
function mouthCue(shape, size){ size=size||72;
  const LIP="#e07d72", LIP2="#c25b52", DARK="#5e2330", TEETH="#fff7f0", TONGUE="#f29bad";
  const almond=`<path d="M14,42 Q50,20 86,42 Q50,64 14,42 Z" fill="${LIP}"/>`;
  const outline=`<path d="M14,42 Q50,20 86,42 Q50,64 14,42 Z" fill="none" stroke="${LIP2}" stroke-width="3"/>`;
  let body;
  switch(shape){
    case "open":   body=`${almond}<ellipse cx="50" cy="42" rx="24" ry="20" fill="${DARK}"/><ellipse cx="50" cy="56" rx="16" ry="8" fill="${TONGUE}"/>${outline}`; break;
    case "mid":    body=`${almond}<ellipse cx="50" cy="42" rx="22" ry="12" fill="${DARK}"/><ellipse cx="50" cy="48" rx="14" ry="5" fill="${TONGUE}"/>${outline}`; break;
    case "round":  body=`<circle cx="50" cy="42" r="22" fill="${LIP}"/><circle cx="50" cy="42" r="21" fill="none" stroke="${LIP2}" stroke-width="3"/><circle cx="50" cy="42" r="12" fill="${DARK}"/>`; break;
    case "lips":   body=`<path d="M16,42 Q50,33 84,42 Q50,51 16,42 Z" fill="${LIP}" stroke="${LIP2}" stroke-width="2.6"/><path d="M18,42 Q50,45 82,42" stroke="${LIP2}" stroke-width="2.4" fill="none"/>`; break;
    case "teeth":  body=`${almond}<ellipse cx="50" cy="45" rx="22" ry="12" fill="${DARK}"/><rect x="31" y="33" width="38" height="10" rx="3" fill="${TEETH}"/>${outline}`; break;
    case "tongue": body=`${almond}<ellipse cx="50" cy="44" rx="23" ry="15" fill="${DARK}"/><rect x="33" y="32" width="34" height="8" rx="2.5" fill="${TEETH}"/><ellipse cx="50" cy="47" rx="12" ry="7" fill="${TONGUE}"/>${outline}`; break;
    case "back":   body=`${almond}<ellipse cx="50" cy="44" rx="23" ry="16" fill="${DARK}"/><ellipse cx="50" cy="37" rx="11" ry="7" fill="#3a121c"/><ellipse cx="50" cy="55" rx="17" ry="7" fill="${TONGUE}"/>${outline}`; break;
    default:       body=`${almond}<ellipse cx="50" cy="42" rx="20" ry="12" fill="${DARK}"/>${outline}`;
  }
  return `<svg viewBox="0 0 100 84" width="${size}" height="${Math.round(size*0.84)}" aria-hidden="true">${body}</svg>`;
}

/* PICTURE ICONS (U5): consistent flat-vector icons for the READWORDS picture-match tiles, so the
   "tap what it means" choices match the premium painted/raster look instead of OS emoji. RESOLVER
   pattern (like charArt): picIcon(word, emojiFallback) returns a custom <svg> if PICONS[word] exists,
   else the emoji — so this rolls out one word at a time with zero risk to the rest. Matching stays on
   dataset.w (the visual is cosmetic), so swapping art never affects answer-checking. INK outline +
   bold flat fills keep them recognizable for a 7-year-old. Sample batch: the earliest READWORDS. */
const PI_INK="#1a1430";
const PICONS={
  sun:()=>`<svg class="picicon" viewBox="0 0 100 100" fill="none"><g stroke="#ffb300" stroke-width="7" stroke-linecap="round"><line x1="50" y1="6" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="94"/><line x1="6" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="94" y2="50"/><line x1="18" y1="18" x2="28" y2="28"/><line x1="72" y1="72" x2="82" y2="82"/><line x1="82" y1="18" x2="72" y2="28"/><line x1="28" y1="72" x2="18" y2="82"/></g><circle cx="50" cy="50" r="26" fill="#ffd23a" stroke="${PI_INK}" stroke-width="4"/></svg>`,
  hat:()=>`<svg class="picicon" viewBox="0 0 100 100"><ellipse cx="50" cy="76" rx="42" ry="9" fill="#2b2438" stroke="${PI_INK}" stroke-width="4"/><rect x="30" y="24" width="40" height="52" rx="4" fill="#2b2438" stroke="${PI_INK}" stroke-width="4"/><rect x="31" y="58" width="38" height="9" fill="#e0457b"/></svg>`,
  cup:()=>`<svg class="picicon" viewBox="0 0 100 100"><line x1="58" y1="8" x2="65" y2="34" stroke="#ffd23a" stroke-width="6" stroke-linecap="round"/><path d="M31 36 L69 36 L63 86 Q61 92 53 92 L47 92 Q39 92 37 86 Z" fill="#ff5e57" stroke="${PI_INK}" stroke-width="4" stroke-linejoin="round"/><rect x="28" y="29" width="44" height="10" rx="3" fill="#fff" stroke="${PI_INK}" stroke-width="3"/></svg>`,
  cat:()=>`<svg class="picicon" viewBox="0 0 100 100"><path d="M22 30 L36 52 L20 56 Z" fill="#f4a83a" stroke="${PI_INK}" stroke-width="4" stroke-linejoin="round"/><path d="M78 30 L64 52 L80 56 Z" fill="#f4a83a" stroke="${PI_INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="58" r="30" fill="#f9b94e" stroke="${PI_INK}" stroke-width="4"/><circle cx="40" cy="54" r="4" fill="${PI_INK}"/><circle cx="60" cy="54" r="4" fill="${PI_INK}"/><path d="M50 61 l-5 5 5 3 5-3z" fill="#e0457b"/><g stroke="${PI_INK}" stroke-width="2.5" stroke-linecap="round"><line x1="32" y1="64" x2="14" y2="60"/><line x1="32" y1="68" x2="14" y2="72"/><line x1="68" y1="64" x2="86" y2="60"/><line x1="68" y1="68" x2="86" y2="72"/></g></svg>`,
  dog:()=>`<svg class="picicon" viewBox="0 0 100 100"><ellipse cx="24" cy="46" rx="13" ry="22" fill="#8a5a2b" stroke="${PI_INK}" stroke-width="4"/><ellipse cx="76" cy="46" rx="13" ry="22" fill="#8a5a2b" stroke="${PI_INK}" stroke-width="4"/><circle cx="50" cy="54" r="30" fill="#b07b3e" stroke="${PI_INK}" stroke-width="4"/><circle cx="40" cy="50" r="4" fill="${PI_INK}"/><circle cx="60" cy="50" r="4" fill="${PI_INK}"/><ellipse cx="50" cy="65" rx="12" ry="9" fill="#f2e3c8" stroke="${PI_INK}" stroke-width="3"/><ellipse cx="50" cy="62" rx="5" ry="3.5" fill="${PI_INK}"/></svg>`,
  pig:()=>`<svg class="picicon" viewBox="0 0 100 100"><path d="M30 28 L41 41 L26 45 Z" fill="#f4a0c0" stroke="${PI_INK}" stroke-width="4" stroke-linejoin="round"/><path d="M70 28 L59 41 L74 45 Z" fill="#f4a0c0" stroke="${PI_INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="56" r="30" fill="#f7b6d2" stroke="${PI_INK}" stroke-width="4"/><circle cx="40" cy="51" r="4" fill="${PI_INK}"/><circle cx="60" cy="51" r="4" fill="${PI_INK}"/><ellipse cx="50" cy="65" rx="14" ry="10" fill="#ef8fb8" stroke="${PI_INK}" stroke-width="3"/><circle cx="45" cy="65" r="2.6" fill="${PI_INK}"/><circle cx="55" cy="65" r="2.6" fill="${PI_INK}"/></svg>`
};
function picIcon(word, fallbackEmoji){ const f=PICONS[word]; return f ? f() : (fallbackEmoji!=null ? String(fallbackEmoji) : ""); }
