/* =========================================================
   SUPER TEDDY — SOUND EFFECTS  (synthesized, no files / no licensing)
   Loaded as a classic <script> AFTER game.js (uses S / $ / save at runtime).
   Every effect is generated live with the Web Audio API — so there are NO audio
   files to host, NO licensing/attribution, it works offline, and it adds nothing
   to the deploy. Its OWN on/off + volume (S.sfxOn / S.sfxVol), independent of the
   voice (S.vol) and music (S.musicVol) levels; parent controls in Settings ▸ Sound.

   Design notes: kid-friendly + NON-harsh (hard constraint #2 — a wrong answer is a
   soft low "nope", never a buzzer). Aud.ding() (audio.js) routes through Sfx.correct
   so every existing "correct" cue now respects the SFX volume + toggle.
========================================================= */
const Sfx={
  ctx:null, master:null, on:true, vol:0.6,
  boot(){ if(typeof S!=="undefined"){ this.on=(S.sfxOn===false?false:true); this.vol=(S.sfxVol==null?0.6:S.sfxVol); } },
  _ac(){ if(this.ctx) return this.ctx;
    try{ const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null;
      const c=new AC(); this.master=c.createGain(); this.master.gain.value=this.vol; this.master.connect(c.destination); this.ctx=c;
    }catch(e){ this.ctx=null; this.master=null; }
    return this.ctx; },
  _resume(){ try{ if(this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume)this.ctx.resume(); }catch(e){} },
  /* a single shaped note (exponential pluck envelope) at +at seconds */
  note(freq,at,dur,type,peak){ const c=this.ctx; if(!c||!c.createOscillator)return; const t0=c.currentTime+at;
    const o=c.createOscillator(), g=c.createGain(); o.type=type||"sine"; o.frequency.setValueAtTime(freq,t0);
    g.gain.setValueAtTime(0.0001,t0); g.gain.exponentialRampToValueAtTime(peak||0.5,t0+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g).connect(this.master); o.start(t0); o.stop(t0+dur+0.03); },
  /* a pitch glide (for the soft "nope") */
  glide(f1,f2,at,dur,type,peak){ const c=this.ctx; if(!c||!c.createOscillator)return; const t0=c.currentTime+at;
    const o=c.createOscillator(), g=c.createGain(); o.type=type||"sine";
    o.frequency.setValueAtTime(f1,t0); o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t0+dur);
    g.gain.setValueAtTime(0.0001,t0); g.gain.exponentialRampToValueAtTime(peak||0.4,t0+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g).connect(this.master); o.start(t0); o.stop(t0+dur+0.03); },
  _go(fn){ if(!this.on) return; if(!this._ac()) return; this._resume(); try{ fn(); }catch(e){} },
  /* small per-play pitch wobble so a repeated cue never sounds IDENTICAL (anti-fatigue) */
  _v(){ return 1 + (Math.random()*2-1)*0.045; },
  /* current answer streak (game.js `combo`) drives the pitch ladder on coins/combo */
  _combo(){ return (typeof combo!=="undefined" && combo>0) ? combo : 0; },
  /* the kit — every cue stays SHORT (never masks the audio-first narration, #8) + synthesized.
     "Reward" cues carry a quiet sub-octave body so they read FATTER without getting louder. */
  correct(){ this._go(()=>{ const b=660*this._v();
    this.note(b*0.5,0,0.12,"sine",0.14);                                   /* sub body = fuller "ding" */
    this.note(b,0,0.12,"sine",0.5); this.note(b*1.5,0.085,0.16,"sine",0.42); }); },
  wrong(){   this._go(()=>{ this.glide(330,235,0,0.20,"sine",0.30); }); },  /* unchanged: soft, low, gentle (#2) */
  /* #170 "your turn" — a soft, quiet two-note rising blip fired when the listen-first gate ARMS (the choices go
     live after the prompt). Gentler than correct/coin (it's a cue, not a reward) so it reads as "ready" without
     competing with the answer feedback; respects S.sfxOn/_v() like every other cue. */
  ready(){   this._go(()=>{ const v=this._v(); this.note(523*v,0,0.08,"sine",0.10); this.note(784*v,0.075,0.12,"sine",0.13); }); },
  combo(n){  this._go(()=>{ n=n||3; const b=(620+Math.min(12,n)*40)*this._v();   /* rises in pitch with the streak */
    this.note(b,0,0.10,"triangle",0.4); this.note(b*1.5,0.055,0.12,"triangle",0.32); if(n>=5)this.note(b*2,0.11,0.13,"triangle",0.28); }); },
  /* MASTERY — the most triumphant cue (a rising arpeggio + sparkle top + sub layer); louder/sweeter
     than coin/gem so "you mastered it" out-sings any cosmetic reward (mastery > participation). */
  mastery(){ this._go(()=>{ [659,880,1047,1319].forEach((f,i)=>{ this.note(f,i*0.07,0.20,"sine",0.46); this.note(f*0.5,i*0.07,0.20,"sine",0.12); }); this.note(1760,0.30,0.34,"triangle",0.3); }); },
  /* RANK-UP — the grandest milestone fanfare (a full rising run + bright sustained top + sub body),
     a step ABOVE win/mastery so leveling up is the loudest, sweetest moment (mastery > participation). */
  rankup(){ this._go(()=>{ [523,659,784,1047,1319,1568].forEach((f,i)=>{ this.note(f,i*0.08,0.24,"sine",0.5); this.note(f*0.5,i*0.08,0.24,"sine",0.13); }); this.note(2093,0.52,0.5,"triangle",0.3); this.note(1568,0.52,0.5,"sine",0.24); }); },
  coin(){    this._go(()=>{ const lad=1+Math.min(this._combo(),10)*0.03, b=988*this._v()*lad;   /* coins climb on a streak */
    this.note(b,0,0.07,"triangle",0.34); this.note(b*1.334,0.07,0.14,"triangle",0.34); }); },
  unlock(){  this._go(()=>{ [523,659,784,1047].forEach((f,i)=>{ this.note(f,i*0.085,0.18,"sine",0.42); this.note(f*0.5,i*0.085,0.18,"sine",0.1); }); }); },
  win(){     this._go(()=>{ [523,659,784,1047,1319].forEach((f,i)=>{ this.note(f,i*0.09,0.22,"sine",0.46); this.note(f*0.5,i*0.09,0.22,"sine",0.11); }); this.note(1568,0.52,0.4,"sine",0.26); }); },
  gem(){     this._go(()=>{ const v=this._v(); this.note(1568*v,0,0.10,"triangle",0.3); this.note(2093*v,0.07,0.14,"triangle",0.24); }); },
  /* cutscene/cinematic cues */
  whoosh(){    this._go(()=>{ this.glide(170,920,0,0.5,"sawtooth",0.16); this.glide(900,200,0.18,0.5,"sine",0.12); }); },
  villain(){   this._go(()=>{ this.note(174,0,0.32,"sawtooth",0.22); this.note(146,0.14,0.46,"sawtooth",0.2); }); },   /* low ominous sting */
  transform(){ this._go(()=>{ [330,440,550,660,880].forEach((f,i)=>this.note(f,i*0.06,0.30,"triangle",0.34)); this.note(1320,0.40,0.5,"sine",0.3); }); },
  /* parent controls */
  setVol(v){ this.vol=Math.max(0,Math.min(1,v)); if(this.master)this.master.gain.value=this.vol; if(typeof S!=="undefined")S.sfxVol=this.vol; if(typeof save==="function")save(); },
  setOn(on){ this.on=!!on; if(typeof S!=="undefined")S.sfxOn=this.on; if(typeof save==="function")save(); }
};
Sfx.boot();
/* Settings wiring (own volume + on/off, separate from voice & music) */
(function(){
  const slider=(typeof $==="function")?$("sfxSlider"):null, pct=(typeof $==="function")?$("sfxPct"):null, btn=(typeof $==="function")?$("btnSfxToggle"):null;
  function paintBtn(){ if(btn)btn.classList.toggle("on",Sfx.on); }
  function paintSlider(){ const v=Math.round(Sfx.vol*100); if(slider)slider.value=v; if(pct)pct.textContent=v+"%"; }
  paintBtn(); paintSlider();
  if(slider)slider.oninput=()=>{ const v=(+slider.value||0)/100; if(pct)pct.textContent=slider.value+"%"; Sfx.setVol(v); };
  if(btn)btn.onclick=()=>{ Sfx.setOn(!Sfx.on); paintBtn(); Sfx.correct(); };   /* preview on toggle */
})();
