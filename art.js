/* =========================================================
   ART — shared character renderers (refined flat-vector "Style C").
   Pure SVG-string functions, no game state. Loaded before game.js and
   reused by the style/preview labs so there's a single source of truth.
   Currently: heroSVG (parametric: muscle / weapon / cape / gear).
========================================================= */
let __huid=0;
function heroSVG(w=200,o={}){
const u="h"+(__huid++);
const m=o.muscle||0, sx=1+0.07*m;
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
<defs><linearGradient id="${u}suit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b82f0"/><stop offset="1" stop-color="#2257c4"/></linearGradient>
<linearGradient id="${u}cape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cp[0]}"/><stop offset="1" stop-color="${cp[1]}"/></linearGradient>
<linearGradient id="${u}gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd75e"/><stop offset="1" stop-color="#f0a82b"/></linearGradient></defs>
${o.weapon==="hammer"||o.weapon==="sword"?weapon:""}
<path d="M62 122 Q38 220 30 350 Q28 406 50 448 Q90 426 124 436 Q170 424 200 446 Q224 402 218 346 Q210 218 184 122 Q122 104 62 122Z" fill="url(#${u}cape)" stroke="#150f2e" stroke-width="6"/>
<g stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<path d="M96 288 L90 372 L86 412 L118 412 L124 310Z" fill="url(#${u}suit)"/>
<path d="M150 288 L158 372 L162 412 L130 412 L126 310Z" fill="url(#${u}suit)"/>
<path d="M84 412 L120 412 L120 450 Q120 466 100 466 L70 466 Q60 466 62 454 Q64 440 84 434Z" fill="url(#${u}cape)"/>
<path d="M162 412 L126 412 L126 450 Q126 466 146 466 L176 466 Q186 466 184 454 Q182 440 162 434Z" fill="url(#${u}cape)"/>
<path d="M84 412 L120 412 L120 424 L82 424Z" fill="#ffd75e" stroke-width="4"/>
<path d="M126 412 L162 412 L164 424 L126 424Z" fill="#ffd75e" stroke-width="4"/></g>
${bootFx}
<g transform="translate(123 0) scale(${sx} 1) translate(-123 0)">
<path d="M64 142 Q123 120 182 142 L174 238 Q170 272 152 284 L96 284 Q76 272 72 238Z" fill="url(#${u}suit)" stroke="#150f2e" stroke-width="6"/>
<path d="M74 150 Q96 136 122 134 L120 170 Q96 172 80 184Z" fill="#6ea4f7" opacity=".55"/>
${m>=1?'<path d="M92 168 Q123 152 154 168" stroke="#173f8f" stroke-width="5" fill="none" stroke-linecap="round"/>':''}
${m>=2?'<path d="M100 206 Q123 196 146 206 M104 232 Q123 224 142 232" stroke="#173f8f" stroke-width="4.5" fill="none" stroke-linecap="round"/>':''}
</g>
<g stroke="#150f2e" stroke-width="6" stroke-linejoin="round">
<path d="M66 152 Q34 170 28 212 Q34 242 62 252 L84 264 L92 244 L72 232 Q58 220 60 198 Q66 172 78 162Z" fill="url(#${u}suit)"/>
<path d="M180 152 Q212 170 218 212 Q214 230 202 240 L196 220 Q200 208 192 192 Q184 172 170 162Z" fill="url(#${u}suit)"/>
<path d="M202 208 Q216 226 196 252 L168 266 L158 246 L184 232 Q192 222 190 212Z" fill="url(#${u}gold)"/>
<circle cx="90" cy="260" r="15" fill="#e6453c"/><circle cx="158" cy="260" r="15" fill="url(#${u}gold)"/></g>
${biceps}
<path d="M88 272 L158 272 L154 294 L92 294Z" fill="url(#${u}gold)" stroke="#150f2e" stroke-width="5"/>
${beltGlow}
<g transform="translate(123 198)"><path d="M0 -32 L29 -16 L29 16 L0 32 L-29 16 L-29 -16Z" fill="url(#${u}gold)" stroke="#150f2e" stroke-width="5"/>
<path d="M-15 -15 L15 -15 L15 -6 L5 -6 L5 17 L-5 17 L-5 -6 L-15 -6Z" fill="#d23a31" stroke="#150f2e" stroke-width="3"/></g>
<!-- ===== head (refined Style C) ===== -->
<rect x="111" y="110" width="26" height="26" rx="7" fill="#ffd9b8" stroke="#150f2e" stroke-width="5"/>
<circle cx="124" cy="66" r="54" fill="#ffd9b8" stroke="#150f2e" stroke-width="6"/>
<circle cx="70" cy="70" r="11" fill="#ffd9b8" stroke="#150f2e" stroke-width="5"/>
<circle cx="178" cy="70" r="11" fill="#ffd9b8" stroke="#150f2e" stroke-width="5"/>
<path d="M68 58 Q58 4 124 0 Q190 -2 184 56 Q168 24 144 28 Q164 8 128 14 Q138 0 104 10 Q78 16 82 40 Q70 42 68 58Z" fill="#d8b572" stroke="#150f2e" stroke-width="6" stroke-linejoin="round"/>
<path d="M144 28 Q174 16 184 54 Q170 32 144 38Z" fill="#e8cb8e" stroke="none"/>
<g fill="#cfe6ff" fill-opacity=".4" stroke="#1d4fb8" stroke-width="7" stroke-linejoin="round">
<rect x="82" y="50" width="38" height="32" rx="9"/><rect x="130" y="50" width="38" height="32" rx="9"/><line x1="120" y1="64" x2="130" y2="64"/></g>
<g stroke="none"><circle cx="101" cy="66" r="8.5" fill="#fff"/><circle cx="149" cy="66" r="8.5" fill="#fff"/>
<circle cx="103" cy="67" r="5" fill="#6fa8d8"/><circle cx="151" cy="67" r="5" fill="#6fa8d8"/>
<circle cx="103" cy="67" r="2.4" fill="#150f2e"/><circle cx="151" cy="67" r="2.4" fill="#150f2e"/>
<circle cx="105" cy="64" r="1.7" fill="#fff"/><circle cx="153" cy="64" r="1.7" fill="#fff"/></g>
<g stroke="none" fill="#e89a78" opacity=".5"><circle cx="92" cy="90" r="7"/><circle cx="156" cy="90" r="7"/></g>
<g stroke="none" fill="#d99a6c" opacity=".9"><circle cx="108" cy="91" r="2"/><circle cx="116" cy="94" r="2"/><circle cx="132" cy="94" r="2"/><circle cx="140" cy="91" r="2"/></g>
<path d="M98 97 Q124 120 150 97 Q146 113 124 117 Q102 113 98 97Z" fill="#7c3a3a" stroke="#150f2e" stroke-width="4" stroke-linejoin="round"/>
<path d="M103 99 Q124 110 145 99 Q124 105 103 99Z" fill="#fff" stroke="none"/>
</svg>`;}
