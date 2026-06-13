/* =========================================================
   SUPER TEDDY — BACKGROUND MUSIC  (act-aware looping soundtrack)
   Loaded as a classic <script> AFTER game.js (uses S / currentAct / $ at
   runtime). Plays a gentle looping theme per act — superhero for Act 1, medieval
   for Act 2 — that AUTOMATICALLY DUCKS under any narration (hooked from Aud.play
   in audio.js) so the audio-first instructions are never masked (hard constraint
   #8). Its OWN on/off + volume (S.musicOn / S.musicVol), independent of the voice
   and sound-effect levels.

   DROP-IN: put a track at art/bgm-a1.<mp3|ogg|m4a|wav> for Act 1 and
   art/bgm-a2.* for Act 2. If no file is present the engine stays silent — so
   this module changes nothing audible until you add (or Publish) the tracks.
========================================================= */
const Music={
  el:null, on:true, vol:0.34, ducked:false, act:null, started:false, srcOk:false,
  EXTS:["mp3","ogg","m4a","wav"], _rt:null,
  boot(){
    this.on  = (typeof S!=="undefined" && S.musicOn===false) ? false : true;
    this.vol = (typeof S!=="undefined" && S.musicVol!=null) ? S.musicVol : 0.34;
    try{ this.el=new Audio(); this.el.loop=true; this.el.volume=0; this.el.preload="auto"; }
    catch(e){ this.el=null; }
  },
  /* swap to the act's theme, probing formats (mp3→ogg→m4a→wav); silent if none. */
  setAct(a){ if(a===this.act || !this.el) return; this.act=a; this._tryLoad(a,0); },
  _tryLoad(a,i){
    const el=this.el; if(!el) return;
    if(i>=this.EXTS.length){ this.srcOk=false; return; }   /* no track file for this act */
    const url="art/bgm-a"+a+"."+this.EXTS[i];
    const onErr=()=>{ cleanup(); this._tryLoad(a,i+1); };
    const onOk =()=>{ cleanup(); this.srcOk=true; this._apply(); if(this.started&&this.on)this._play(); };
    const cleanup=()=>{ if(el.removeEventListener){ el.removeEventListener("error",onErr); el.removeEventListener("canplay",onOk); } };
    if(el.addEventListener){ el.addEventListener("error",onErr); el.addEventListener("canplay",onOk); }
    try{ el.src=url; if(el.load)el.load(); }catch(e){ cleanup(); this._tryLoad(a,i+1); }
  },
  /* called on the first user gesture (browsers block autoplay until then) */
  start(){ if(this.started) return; this.started=true; if(this.on&&this.srcOk)this._play(); },
  _play(){ if(!this.el||!this.srcOk) return; try{ const p=this.el.play(); if(p&&p.catch)p.catch(()=>{}); }catch(e){} this._apply(); },
  /* duck/restore around narration (hooked from Aud.play) */
  duck(){ this.ducked=true;  this._apply(); },
  unduck(){ this.ducked=false; this._apply(); },
  _target(){ return !this.on ? 0 : (this.ducked ? this.vol*0.26 : this.vol); },
  _apply(){ this._ramp(this._target()); },
  _ramp(target){ const el=this.el; if(!el) return;
    if(this._rt && typeof clearInterval!=="undefined") clearInterval(this._rt);
    const start=(typeof el.volume==="number")?el.volume:0, d=target-start, t0=Date.now(), dur=280;
    if(typeof setInterval==="undefined"){ el.volume=target; return; }
    this._rt=setInterval(()=>{ const k=Math.min(1,(Date.now()-t0)/dur);
      el.volume=Math.max(0,Math.min(1,start+d*k)); if(k>=1)clearInterval(this._rt); },30);
  },
  /* parent controls (own volume + toggle, separate from voice/SFX) */
  setVol(v){ this.vol=Math.max(0,Math.min(1,v)); if(typeof S!=="undefined")S.musicVol=this.vol; if(typeof save==="function")save(); this._apply(); },
  setOn(on){ this.on=!!on; if(typeof S!=="undefined")S.musicOn=this.on; if(typeof save==="function")save();
    if(this.on){ if(!this.started)this.start(); else this._play(); } else if(this.el&&this.el.pause){ try{this.el.pause();}catch(e){} }
    this._apply(); }
};

/* boot + UI wiring + autoplay-unlock gesture (runs at load, after game.js) */
Music.boot();
if(typeof currentAct==="function") Music.setAct(currentAct());
(function(){
  const slider=(typeof $==="function")?$("musicSlider"):null, pct=(typeof $==="function")?$("musicPct"):null, btn=(typeof $==="function")?$("btnMusicToggle"):null;
  function paintBtn(){ if(btn)btn.textContent=Music.on?"On":"Off"; }
  function paintSlider(){ const v=Math.round(Music.vol*100); if(slider)slider.value=v; if(pct)pct.textContent=v+"%"; }
  paintBtn(); paintSlider();
  if(slider)slider.oninput=()=>{ const v=(+slider.value||0)/100; if(pct)pct.textContent=slider.value+"%"; Music.setVol(v); };
  if(btn)btn.onclick=()=>{ Music.setOn(!Music.on); paintBtn(); if(typeof Aud!=="undefined"&&Aud.ding)Aud.ding(); };
})();
if(typeof document!=="undefined" && document.addEventListener){
  const kick=()=>{ Music.start(); document.removeEventListener("pointerdown",kick,true); document.removeEventListener("click",kick,true); };
  document.addEventListener("pointerdown",kick,true);
  document.addEventListener("click",kick,true);
  document.addEventListener("visibilitychange",()=>{ if(document.hidden){ if(Music.el&&Music.el.pause){try{Music.el.pause();}catch(e){}} }
    else if(Music.on&&Music.started){ Music._play(); } });
}
