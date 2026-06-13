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
<defs><linearGradient id="${u}suit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${th.suit[0]}"/><stop offset="1" stop-color="${th.suit[1]}"/></linearGradient>
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
<path d="M74 150 Q96 136 122 134 L120 170 Q96 172 80 184Z" fill="${th.sheen}" opacity=".55"/>
${m>=1?`<path d="M92 168 Q123 152 154 168" stroke="${th.muscle}" stroke-width="5" fill="none" stroke-linecap="round"/>`:''}
${m>=2?`<path d="M100 206 Q123 196 146 206 M104 232 Q123 224 142 232" stroke="${th.muscle}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`:''}
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
${o.theme==="knight"?`<!-- ===== knight helm (Act-2 placeholder) ===== -->
<rect x="111" y="110" width="26" height="20" rx="6" fill="#aeb6c2" stroke="#150f2e" stroke-width="5"/>
<path d="M84 36 Q124 4 164 36 L172 96 Q172 124 124 130 Q76 124 76 96Z" fill="url(#${u}suit)" stroke="#150f2e" stroke-width="6"/>
<path d="M84 36 Q124 4 164 36 L160 50 Q124 26 88 50Z" fill="${th.sheen}" opacity=".5"/>
<rect x="92" y="58" width="64" height="13" rx="5" fill="#1b2330" stroke="#150f2e" stroke-width="4"/>
<g stroke="#150f2e" stroke-width="4"><line x1="124" y1="74" x2="124" y2="120"/><line x1="106" y1="78" x2="106" y2="118"/><line x1="142" y1="78" x2="142" y2="118"/></g>
<g stroke="none"><circle cx="110" cy="64" r="3.4" fill="#9fe0ff"/><circle cx="138" cy="64" r="3.4" fill="#9fe0ff"/></g>
<path d="M124 4 Q124 -24 150 -30 Q138 -16 142 0 Q132 -8 124 4Z" fill="${cp[0]}" stroke="#150f2e" stroke-width="5" stroke-linejoin="round"/>
</svg>`:`<!-- ===== head (refined Style C) ===== -->
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
</svg>`}`;}

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
function allyFace(kind){
  const head=`<circle r="26" fill="#ffd9b8" stroke="#150f2e" stroke-width="4"/>`;
  if(kind==="leighton")return head+
    `<path d="M-26 -2 Q-28 -30 0 -30 Q28 -30 26 -2 Q24 8 18 16 L16 -8 Q14 -22 0 -20 Q-14 -22 -16 -8 L-18 16 Q-24 8 -26 -2Z" fill="#b98a5a" stroke="#150f2e" stroke-width="3"/>`+
    `<path d="M-18 14 Q-22 24 -16 30 M18 14 Q22 24 16 30" stroke="#caa06a" stroke-width="6" fill="none" stroke-linecap="round"/>`+
    `<path d="M-13 -20 Q0 -30 13 -20 Q6 -16 0 -17 Q-6 -16 -13 -20Z" fill="#9ec9ff" stroke="#150f2e" stroke-width="2"/>`+
    `<g fill="#ffd75e" stroke="#150f2e" stroke-width="1.4"><path d="M0 -34 l3 6 l6 0 l-5 4 l2 6 l-6 -4 l-6 4 l2 -6 l-5 -4 l6 0z"/></g>`+
    allyEyes()+
    `<g stroke="none" fill="#d99a6c" opacity=".8"><circle cx="-7" cy="9" r="1.4"/><circle cx="0" cy="11" r="1.4"/><circle cx="7" cy="9" r="1.4"/></g>`+
    `<path d="M-8 12 Q1 19 10 11" stroke="#150f2e" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  if(kind==="heart")return head+
    `<path d="M-24 -4 Q-26 -30 0 -30 Q26 -30 24 -4 Q14 -22 0 -20 Q-14 -22 -24 -4Z" fill="#e8a87c" stroke="#150f2e" stroke-width="3"/>`+
    allyEyes()+
    `<path d="M-9 10 Q1 18 11 9" stroke="#150f2e" stroke-width="3.2" fill="none" stroke-linecap="round"/>`+
    `<path d="M-6 13 L8 12" stroke="#dfe9ff" stroke-width="2" stroke-linecap="round"/>`+
    `<path d="M0 22 q3 -4 6 -1 q3 3 -1 6 l-5 4 -5 -4 q-4 -3 -1 -6 q3 -3 6 1z" fill="#e6453c" stroke="#150f2e" stroke-width="1.6"/>`;
  if(kind==="tank")return head+
    `<path d="M-25 -6 Q-27 -30 0 -30 Q27 -30 25 -4 Q19 -22 6 -18 Q14 -10 4 -7 Q-8 -16 -18 -10 Q-25 -5 -25 -6Z" fill="#d8b572" stroke="#150f2e" stroke-width="3"/>`+
    `<g fill="#e89a78" opacity=".45"><circle cx="-15" cy="9" r="4"/><circle cx="16" cy="9" r="4"/></g>`+
    allyEyes()+
    `<path d="M-9 11 Q1 18 10 10" stroke="#150f2e" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  if(kind==="flip")return head+
    `<circle cx="0" cy="-27" r="10" fill="#9a7448" stroke="#150f2e" stroke-width="3"/>`+
    `<path d="M-24 -10 Q-20 -27 0 -27 Q20 -27 24 -10 Q12 -19 0 -17 Q-12 -19 -24 -10Z" fill="#9a7448" stroke="#150f2e" stroke-width="3"/>`+
    allyEyes()+
    `<path d="M-9 11 Q1 18 10 10" stroke="#150f2e" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  return head+ /* sunny — William, gap-toothed grin, side-swept blonde */
    `<path d="M-24 -6 Q-24 -30 0 -30 Q24 -30 24 -4 Q16 -22 2 -17 Q-12 -22 -20 -8Z" fill="#f2dfae" stroke="#150f2e" stroke-width="3"/>`+
    allyEyes()+
    `<path d="M-10 9 Q1 20 11 9 Q1 15 -10 9Z" fill="#7c3a3a" stroke="#150f2e" stroke-width="2.4"/>`+
    `<rect x="-2" y="10" width="4" height="4" fill="#fff"/>`;
}
