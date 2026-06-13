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
const th=HERO_THEMES[o.theme||"hero"]||HERO_THEMES.hero;
const capes={red:["#ef5348","#b92f33"],gold:["#ffd75e","#e08f1f"],purple:["#a06ae8","#6b2fa0"]};
const cp=capes[o.cape||"red"]||capes.red;
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
const biceps = m>=1 ? `<ellipse cx="38" cy="178" rx="${14+5*m}" ry="${11+4*m}" fill="#3b82f0" stroke="#150f2e" stroke-width="5"/>
<ellipse cx="206" cy="${182}" rx="${14+5*m}" ry="${11+4*m}" fill="#3b82f0" stroke="#150f2e" stroke-width="5" opacity="${o.weapon&&o.weapon!=="none"?0:1}"/>` : "";
const beltGlow=o.belt2?`<rect x="84" y="268" width="78" height="28" rx="10" fill="none" stroke="#fff3c4" stroke-width="5" opacity=".85"/>`:"";
const bootFx=o.boots2?`<g stroke="#ff8a3d" stroke-width="5" stroke-linecap="round" opacity=".9">
<path d="M86 472 q4 12 -2 22"/><path d="M104 472 q0 14 -4 24"/>
<path d="M148 472 q4 12 -2 22"/><path d="M166 472 q0 14 -4 24"/></g>`:"";
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
<clipPath id="${u}tor"><path d="M64 142 Q123 120 182 142 L174 238 Q170 272 152 284 L96 284 Q76 272 72 238Z"/></clipPath>
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
<g class="hcape">
<path d="M62 122 Q38 220 30 350 Q28 406 50 448 Q90 426 124 436 Q170 424 200 446 Q224 402 218 346 Q210 218 184 122 Q122 104 62 122Z" fill="url(#${u}cape)" stroke="#150f2e" stroke-width="6"/>
<path d="M62 122 Q38 220 30 350 Q28 406 50 448 Q90 426 124 436 Q170 424 200 446 Q224 402 218 346 Q210 218 184 122 Q122 104 62 122Z" fill="url(#${u}capeL)"/>
<g stroke="${cp[1]}" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"><path d="M92 150 Q86 280 78 430"/><path d="M124 142 Q124 280 124 432"/><path d="M156 150 Q162 280 170 430"/></g></g>
<g stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<path d="M96 288 L90 372 L86 412 L118 412 L124 310Z" fill="url(#${u}suit)"/>
<path d="M150 288 L158 372 L162 412 L130 412 L126 310Z" fill="url(#${u}suit)"/>
<path d="M84 412 L120 412 L120 450 Q120 466 100 466 L70 466 Q60 466 62 454 Q64 440 84 434Z" fill="url(#${u}cape)"/>
<path d="M162 412 L126 412 L126 450 Q126 466 146 466 L176 466 Q186 466 184 454 Q182 440 162 434Z" fill="url(#${u}cape)"/>
<path d="M84 412 L120 412 L120 424 L82 424Z" fill="#ffd75e" stroke-width="4"/>
<path d="M126 412 L162 412 L164 424 L126 424Z" fill="#ffd75e" stroke-width="4"/></g>
${bootFx}
<g class="hbreath"><g transform="translate(123 0) scale(${sx} 1) translate(-123 0)">
<path d="M64 142 Q123 120 182 142 L174 238 Q170 272 152 284 L96 284 Q76 272 72 238Z" fill="url(#${u}suit)" stroke="#150f2e" stroke-width="6"/>
<g clip-path="url(#${u}tor)"><path d="M130 128 L190 142 L182 252 Q176 282 150 292 L130 292Z" fill="${th.muscle}" opacity=".32"/><ellipse cx="94" cy="158" rx="34" ry="27" fill="#fff" opacity=".22"/></g>
<path d="M74 150 Q96 136 122 134 L120 170 Q96 172 80 184Z" fill="${th.sheen}" opacity=".55"/>
${m>=1?`<path d="M92 168 Q123 152 154 168" stroke="${th.muscle}" stroke-width="5" fill="none" stroke-linecap="round"/>`:''}
${m>=2?`<path d="M100 206 Q123 196 146 206 M104 232 Q123 224 142 232" stroke="${th.muscle}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`:''}
</g></g>
<g stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<path d="M66 152 Q34 170 28 212 Q34 242 62 252 L84 264 L92 244 L72 232 Q58 220 60 198 Q66 172 78 162Z" fill="url(#${u}suit)"/>
<path d="M180 152 Q212 170 218 212 Q214 230 202 240 L196 220 Q200 208 192 192 Q184 172 170 162Z" fill="url(#${u}suit)"/>
<path d="M202 208 Q216 226 196 252 L168 266 L158 246 L184 232 Q192 222 190 212Z" fill="url(#${u}gold)"/>
<circle cx="90" cy="260" r="15" fill="#e6453c"/><circle cx="158" cy="260" r="15" fill="url(#${u}gold)"/>
<path d="M83 254 a8 8 0 0 1 8 -4" stroke="#ffb3ad" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M151 254 a8 8 0 0 1 8 -4" stroke="#fff0bd" stroke-width="4" fill="none" stroke-linecap="round"/></g>
${biceps}
<path d="M88 272 L158 272 L154 294 L92 294Z" fill="url(#${u}gold)" stroke="#150f2e" stroke-width="5"/>
${beltGlow}
<circle cx="123" cy="198" r="46" fill="url(#${u}embg)"/>
<circle class="haura" cx="123" cy="198" r="36" fill="none" stroke="#fff3c4" stroke-width="2.5" opacity=".5"/>
<g transform="translate(123 198)"><path d="M0 -32 L29 -16 L29 16 L0 32 L-29 16 L-29 -16Z" fill="url(#${u}gold)" stroke="#150f2e" stroke-width="5"/>
<path d="M-22 -12 L-2 -24 L0 -16 L-18 -5Z" fill="#fff" opacity=".4"/>
<path d="M-15 -15 L15 -15 L15 -6 L5 -6 L5 17 L-5 17 L-5 -6 L-15 -6Z" fill="#d23a31" stroke="#150f2e" stroke-width="3"/></g>
${o.theme==="knight"?`<!-- ===== knight helm (Act-2 placeholder) ===== -->
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
</g></g></svg>`}`;}

/* ---- LORD VEX / VEXBOT (refined: angled glowing visor, sharper menace) ---- */
function inkblotSVG(w=240){
return `<svg viewBox="-70 -130 320 360" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="vxm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4f6e"/><stop offset="1" stop-color="#23263b"/></linearGradient>
<linearGradient id="vxd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2f47"/><stop offset="1" stop-color="#15172a"/></linearGradient>
<radialGradient id="vxr" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#ff6b5e"/><stop offset=".6" stop-color="#e62e2e"/><stop offset="1" stop-color="#7a1010"/></radialGradient>
</defs>
<path d="M10 -20 Q-40 60 -28 170 L-6 150 L6 176 L26 150 L40 178 L58 150 L74 172 L96 148 Q132 60 132 -16 Q72 -52 10 -20Z" fill="#1a1030" stroke="#150f2e" stroke-width="6"/>
<ellipse cx="72" cy="208" rx="58" ry="13" fill="#9fe870" opacity=".5"/>
<ellipse cx="72" cy="204" rx="34" ry="8" fill="#d2ffb0" opacity=".8"/>
<path d="M40 150 L104 150 L96 196 L48 196 Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="6"/>
<rect x="52" y="160" width="40" height="10" rx="4" fill="#9fe870" opacity=".75"/>
<path d="M16 30 L128 30 L142 70 L128 150 L16 150 L2 70 Z" fill="url(#vxm)" stroke="#150f2e" stroke-width="7"/>
<path d="M16 30 L72 30 L72 150 L16 150 L2 70Z" fill="#150f2e" opacity=".22"/>
<path d="M30 44 L114 44 L122 66 L112 86 L32 86 L22 66Z" fill="url(#vxd)" stroke="#150f2e" stroke-width="5"/>
<circle cx="72" cy="112" r="21" fill="url(#vxr)" stroke="#150f2e" stroke-width="6"/>
<circle cx="72" cy="112" r="8" fill="#ffd2c9"/>
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
<path d="M32 -25 L70 -14 L66 -3 L34 -8Z" fill="#e62e2e" stroke="#150f2e" stroke-width="4.5"/>
<path d="M112 -25 L74 -14 L78 -3 L110 -8Z" fill="#e62e2e" stroke="#150f2e" stroke-width="4.5"/>
<path d="M40 -19 L60 -12 M104 -19 L84 -12" stroke="#ffd2c9" stroke-width="3" stroke-linecap="round"/>
<g stroke="#150f2e" stroke-width="4"><line x1="56" y1="6" x2="56" y2="22"/><line x1="72" y1="6" x2="72" y2="24"/><line x1="88" y1="6" x2="88" y2="22"/></g>
<g font-family="Andika,sans-serif" font-weight="700" fill="#9fe870" opacity=".85">
<text x="-52" y="-40" font-size="30" transform="rotate(-18 -52 -40)">?</text>
<text x="176" y="96" font-size="28" transform="rotate(-8 176 96)">?</text>
</g>
</svg>`;}

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
return `<svg viewBox="-90 -130 300 360" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="vxhair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e23b6d"/><stop offset="1" stop-color="#7a1442"/></linearGradient>
<linearGradient id="vxgown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a1840"/><stop offset="1" stop-color="#2a0c20"/></linearGradient>
</defs>
<!-- dragon-wing hint behind her (she morphs) -->
<path d="M40 60 Q-70 -10 -78 90 Q-30 60 -8 96 Q-44 90 -40 150 Q-2 110 30 120Z" fill="#3a1030" stroke="#150f2e" stroke-width="5" opacity=".85"/>
<path d="M80 60 Q190 -10 198 90 Q150 60 128 96 Q164 90 160 150 Q122 110 90 120Z" fill="#3a1030" stroke="#150f2e" stroke-width="5" opacity=".85"/>
<!-- gown -->
<path d="M40 150 Q60 120 96 120 Q132 120 140 150 L162 226 L18 226Z" fill="url(#vxgown)" stroke="#150f2e" stroke-width="6"/>
<!-- flowing red hair -->
<path d="M44 18 Q24 70 18 140 Q40 120 52 150 Q56 100 70 70Z" fill="url(#vxhair)" stroke="#150f2e" stroke-width="5"/>
<path d="M136 18 Q156 70 162 140 Q140 120 128 150 Q124 100 110 70Z" fill="url(#vxhair)" stroke="#150f2e" stroke-width="5"/>
<!-- face -->
<circle cx="90" cy="64" r="46" fill="#f6d3c0" stroke="#150f2e" stroke-width="6"/>
<path d="M44 50 Q40 -2 90 -2 Q140 -2 136 50 Q120 22 96 26 Q120 6 84 14 Q104 0 70 12 Q50 20 56 44 Q48 44 44 50Z" fill="url(#vxhair)" stroke="#150f2e" stroke-width="6" stroke-linejoin="round"/>
<!-- cat-green sly eyes -->
<path d="M62 58 Q72 50 84 58 Q74 66 62 58Z" fill="#fff"/><path d="M96 58 Q108 50 118 58 Q106 66 96 58Z" fill="#fff"/>
<ellipse cx="73" cy="58" rx="3" ry="5.5" fill="#3fae6b"/><ellipse cx="107" cy="58" rx="3" ry="5.5" fill="#3fae6b"/>
<path d="M58 52 Q72 44 86 50 M94 50 Q108 44 122 52" stroke="#150f2e" stroke-width="3" fill="none" stroke-linecap="round"/>
<!-- sly grin -->
<path d="M70 84 Q90 98 112 82 Q98 92 70 84Z" fill="#a3243f" stroke="#150f2e" stroke-width="3.5" stroke-linejoin="round"/>
<!-- little dragon horns -->
<path d="M58 8 Q50 -16 64 -20 Q60 -6 70 4Z" fill="#7a1442" stroke="#150f2e" stroke-width="4"/>
<path d="M122 8 Q130 -16 116 -20 Q120 -6 110 4Z" fill="#7a1442" stroke="#150f2e" stroke-width="4"/>
</svg>`;}

/* ---- time portal (static swirl — NO flicker) ---- */
function portalSVG(w=240){
return `<svg viewBox="0 0 200 200" width="${w}" aria-hidden="true">
<defs><radialGradient id="prt" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff7c4"/><stop offset=".35" stop-color="#7ad0ff"/><stop offset=".7" stop-color="#7a4fb6"/><stop offset="1" stop-color="#1a1030"/></radialGradient></defs>
<circle cx="100" cy="100" r="92" fill="url(#prt)" stroke="#150f2e" stroke-width="6"/>
<g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7">
<path d="M100 28 Q150 50 160 100 Q150 150 100 172 Q50 150 40 100 Q50 50 100 28"/>
<path d="M100 50 Q132 64 140 100 Q132 136 100 150 Q68 136 60 100 Q68 64 100 50"/>
<path d="M100 72 Q116 80 120 100 Q116 120 100 128 Q84 120 80 100 Q84 80 100 72"/></g>
<circle cx="100" cy="100" r="12" fill="#fff7c4"/>
<g fill="#9fe870" opacity=".8"><circle cx="46" cy="60" r="4"/><circle cx="158" cy="74" r="4"/><circle cx="60" cy="150" r="4"/><circle cx="150" cy="146" r="4"/></g>
</svg>`;}

/* ---- captured friends (faces TBD — '?' silhouettes in a cage) ---- */
function captiveSVG(w=240){
return `<svg viewBox="0 0 240 180" width="${w}" aria-hidden="true">
<rect x="20" y="20" width="200" height="150" rx="14" fill="#1a1030" stroke="#150f2e" stroke-width="6"/>
<g stroke="#9aa3c4" stroke-width="7"><line x1="56" y1="20" x2="56" y2="170"/><line x1="98" y1="20" x2="98" y2="170"/><line x1="140" y1="20" x2="140" y2="170"/><line x1="182" y1="20" x2="182" y2="170"/></g>
<g fill="#5a4a8c" stroke="#150f2e" stroke-width="4">
<circle cx="70" cy="96" r="22"/><circle cx="120" cy="84" r="24"/><circle cx="170" cy="98" r="22"/></g>
<g font-family="Bangers,sans-serif" fill="#ffc93c" text-anchor="middle" font-size="26">
<text x="70" y="106">?</text><text x="120" y="94">?</text><text x="170" y="108">?</text></g>
<rect x="20" y="20" width="200" height="150" rx="14" fill="none" stroke="#3a2d7d" stroke-width="2"/>
</svg>`;}

/* ---- NOAH THE RED — Act-2 mentor wizard (Gandalf-coded, red hair+beard).
   Placeholder; refine when the parent provides a reference. ---- */
function noahSVG(w=220){
return `<svg viewBox="-20 -40 240 420" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="nrobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8c2f3a"/><stop offset="1" stop-color="#4a1420"/></linearGradient>
<linearGradient id="nhat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9c3540"/><stop offset="1" stop-color="#5a1824"/></linearGradient>
</defs>
<!-- staff -->
<rect x="172" y="40" width="12" height="320" rx="6" fill="#6b4a2b" stroke="#150f2e" stroke-width="5"/>
<circle cx="178" cy="40" r="18" fill="#7fd9ff" stroke="#150f2e" stroke-width="5"/>
<circle cx="178" cy="40" r="7" fill="#fff7c4"/>
<!-- robe -->
<path d="M60 150 Q40 250 30 360 L170 360 Q160 250 140 150 Q100 132 60 150Z" fill="url(#nrobe)" stroke="#150f2e" stroke-width="6"/>
<path d="M100 150 L100 360" stroke="#3a0f18" stroke-width="4" opacity=".5"/>
<!-- sleeves -->
<path d="M62 168 Q30 210 36 262 L60 250 Q60 210 78 186Z" fill="url(#nrobe)" stroke="#150f2e" stroke-width="6"/>
<path d="M138 168 Q170 210 164 262 L140 250 Q140 210 122 186Z" fill="url(#nrobe)" stroke="#150f2e" stroke-width="6"/>
<!-- face -->
<circle cx="100" cy="92" r="40" fill="#f6d3c0" stroke="#150f2e" stroke-width="6"/>
<!-- long red beard -->
<path d="M66 100 Q70 180 100 210 Q130 180 134 100 Q118 128 100 126 Q82 128 66 100Z" fill="#c0392b" stroke="#150f2e" stroke-width="6" stroke-linejoin="round"/>
<path d="M80 112 Q100 122 120 112" stroke="#a93226" stroke-width="4" fill="none"/>
<!-- eyes + kindly brows -->
<g stroke="none"><circle cx="86" cy="90" r="4.5" fill="#2b2233"/><circle cx="114" cy="90" r="4.5" fill="#2b2233"/></g>
<path d="M74 80 Q86 74 96 80 M104 80 Q114 74 126 80" stroke="#c0392b" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M88 102 Q100 108 112 102" stroke="#b06b54" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>
<!-- wizard hat -->
<path d="M58 64 Q100 -46 150 56 Q104 40 58 64Z" fill="url(#nhat)" stroke="#150f2e" stroke-width="6" stroke-linejoin="round"/>
<path d="M50 64 Q100 44 158 60 L150 78 Q100 60 56 80Z" fill="url(#nhat)" stroke="#150f2e" stroke-width="6"/>
<g fill="#ffd75e"><path d="M118 6 l3 7 l7 1 l-5 5 l1 7 l-6 -4 l-6 4 l1 -7 l-5 -5 l7 -1z"/></g>
</svg>`;}

/* ---- DRAGON — Act-2 boss (the Vixen's dragon army). Placeholder. ---- */
function dragonSVG(w=240){
return `<svg viewBox="-30 -40 300 320" width="${w}" aria-hidden="true">
<defs>
<linearGradient id="dbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fae6b"/><stop offset="1" stop-color="#1e6b3e"/></linearGradient>
<linearGradient id="dwing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a1442"/><stop offset="1" stop-color="#3a0f24"/></linearGradient>
</defs>
<!-- wings -->
<path d="M70 110 Q-26 60 -22 170 Q24 130 52 168 Q10 150 26 200 Q60 150 96 156Z" fill="url(#dwing)" stroke="#150f2e" stroke-width="6"/>
<path d="M170 110 Q266 60 262 170 Q216 130 188 168 Q230 150 214 200 Q180 150 144 156Z" fill="url(#dwing)" stroke="#150f2e" stroke-width="6"/>
<!-- body/neck -->
<path d="M86 240 Q70 170 100 140 Q120 120 120 96 Q120 120 140 140 Q170 170 154 240Z" fill="url(#dbody)" stroke="#150f2e" stroke-width="6"/>
<!-- belly scales -->
<g stroke="#9fe870" stroke-width="3" opacity=".5" fill="none"><path d="M108 160 H132 M106 184 H134 M108 208 H132"/></g>
<!-- head -->
<path d="M70 70 Q72 24 120 22 Q168 24 170 70 Q150 96 120 96 Q90 96 70 70Z" fill="url(#dbody)" stroke="#150f2e" stroke-width="6"/>
<!-- snout -->
<path d="M88 72 Q120 110 152 72 Q140 88 120 88 Q100 88 88 72Z" fill="#1e6b3e" stroke="#150f2e" stroke-width="5"/>
<!-- horns -->
<path d="M78 34 Q60 6 76 -6 Q78 14 92 26Z" fill="#e8cfa0" stroke="#150f2e" stroke-width="5"/>
<path d="M162 34 Q180 6 164 -6 Q162 14 148 26Z" fill="#e8cfa0" stroke="#150f2e" stroke-width="5"/>
<!-- glowing eyes -->
<g stroke="none"><path d="M92 56 Q102 48 112 56 Q102 64 92 56Z" fill="#ffd75e"/><path d="M128 56 Q138 48 148 56 Q138 64 128 56Z" fill="#ffd75e"/>
<circle cx="102" cy="56" r="3" fill="#150f2e"/><circle cx="138" cy="56" r="3" fill="#150f2e"/></g>
<!-- nostrils + little flame -->
<circle cx="110" cy="80" r="2.5" fill="#150f2e"/><circle cx="130" cy="80" r="2.5" fill="#150f2e"/>
<path d="M120 92 q-8 14 0 26 q8 -12 0 -26Z" fill="#ff8a3d" stroke="#e6453c" stroke-width="2"/>
</svg>`;}
