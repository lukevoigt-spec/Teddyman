/* =========================================================
   SUPER TEDDY — AUDIO LAYER  (extracted from game.js)
   Loaded as a classic <script> BEFORE game.js, so it shares the global
   scope. Everything here is load-time-safe: the only references to game.js
   symbols ($, LINES, refreshAudioStudio, VOICEPACK) happen inside function
   bodies / async callbacks / event handlers, which run after game.js loads.

   CUSTOM CLIP STORE -> AUDIO ENGINE (Aud) -> flow()/narrate() helpers.
========================================================= */

/* ---------------- CUSTOM CLIP STORE ----------------
   Parent-made clips (recorded or generated in the in-app Audio studio) live
   in IndexedDB on THIS device, keyed by line id. CUSTOM mirrors them in
   memory. Playback order is: CUSTOM clip -> shipped window.VOICEPACK -> TTS.
   Nothing here ever overwrites a committed voicepack.js.                    */
let CUSTOM={};
const VStore={ db:null,
  open(){ return new Promise(res=>{ try{
      const r=indexedDB.open("superTeddyAudio",1);
      r.onupgradeneeded=()=>{ if(!r.result.objectStoreNames.contains("clips"))r.result.createObjectStore("clips"); };
      r.onsuccess=()=>{ this.db=r.result; res(this.db); };
      r.onerror=()=>res(null);
    }catch(e){ res(null); } }); },
  all(){ return new Promise(res=>{ if(!this.db)return res({});
    try{ const out={}, cur=this.db.transaction("clips").objectStore("clips").openCursor();
      cur.onsuccess=e=>{ const c=e.target.result; if(c){ out[c.key]=c.value; c.continue(); } else res(out); };
      cur.onerror=()=>res(out);
    }catch(e){ res({}); } }); },
  put(id,uri){ return new Promise(res=>{ if(!this.db)return res(false);
    try{ const tx=this.db.transaction("clips","readwrite"); tx.objectStore("clips").put(uri,id);
      tx.oncomplete=()=>res(true); tx.onerror=()=>res(false);
    }catch(e){ res(false); } }); },
  del(id){ return new Promise(res=>{ if(!this.db)return res(false);
    try{ const tx=this.db.transaction("clips","readwrite"); tx.objectStore("clips").delete(id);
      tx.oncomplete=()=>res(true); tx.onerror=()=>res(false);
    }catch(e){ res(false); } }); }
};
VStore.open().then(()=>VStore.all()).then(m=>{ CUSTOM=m||{};
  if(typeof refreshAudioStudio==="function")refreshAudioStudio(); });
/* vowel-team phonemes ARE the long-vowel sound (ai=long A, ee=long E, oa=long O),
   so if a parent recorded the long vowels but not ai/ee/oa, reuse those clips
   rather than dropping to TTS. Direct snd_ai/ee/oa clips still win if present. */
const PHON_ALIAS={ snd_ai:"snd_a_long", snd_ee:"snd_e_long", snd_oa:"snd_o_long" };
function clipFor(id){
  let c = CUSTOM[id] || ((typeof VOICEPACK!=="undefined") && VOICEPACK[id]) || null;
  if(!c && PHON_ALIAS[id]){ const a=PHON_ALIAS[id]; c = CUSTOM[a] || ((typeof VOICEPACK!=="undefined") && VOICEPACK[a]) || null; }
  return c;
}

/* ---------------- AUDIO ENGINE ----------------
   Plays a parent clip / studio voicepack clip when present, falls back to
   speech synthesis per line otherwise.                                     */
const Aud={
  voice:null, el:null, token:0, vol:1, _poll:null, _hard:null, _resolve:null,
  hasVP(id){ return !!clipFor(id); },
  pick(){ const vs=speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.startsWith("en"));
    this.voice = vs.find(v=>/samantha/i.test(v.name)) || vs.find(v=>/karen|ava|allison|female/i.test(v.name)) || vs[0]||null; },
  _clear(){ if(this._poll){clearInterval(this._poll);this._poll=null;} if(this._hard){clearTimeout(this._hard);this._hard=null;} },
  /* tear down the current sequence (timers + audio + music duck) and resolve its
     promise, so a superseded flow never hangs and no stray timer crosses into the next play() */
  _settle(){ this._clear(); if(typeof Music!=="undefined" && Music.unduck) Music.unduck();
    const r=this._resolve; this._resolve=null; if(r)r(); },
  stop(){ this.token++;
    if(this.el){ try{this.el.pause();}catch(e){} this.el.onended=null; this.el.onerror=null; }
    try{speechSynthesis.cancel();}catch(e){} this._settle(); },
  /* ONE persistent <audio> element is reused for every clip in a sequence. iOS unlocks
     audio output per element on the first user-gesture play, so reusing the already-unlocked
     element makes chained clips (e.g. prompt → snd_ch) play reliably on the FIRST pass —
     creating a fresh Audio() per clip is what dropped the cold second clip. Each clip advances
     on its OWN ended event (snappy, never caps a long line); a 45s hard timeout only catches a
     clip that never plays at all, and the ⏭ skip covers any edge. */
  play(ids){ this.stop(); const my=this.token;
    const seq=Array.isArray(ids)?ids.slice():[ids];
    if(typeof Music!=="undefined" && Music.duck) Music.duck();   /* dip the music under narration */
    if(!this.el){ try{ this.el=new Audio(); }catch(e){ this.el=null; } }
    const a=this.el;
    return new Promise(resolve=>{
      this._resolve=resolve;
      const next=()=>{
        if(my!==this.token) return;                /* superseded — stop() already settled the promise */
        if(!seq.length){ this._settle(); return; }
        const id=seq.shift(); const L=LINES[id]||{t:id}; const src=clipFor(id);
        if(!src || !a){ this._tts(L,my).then(next); return; }
        let advanced=false;
        const go=()=>{ if(advanced||my!==this.token)return; advanced=true; this._clear(); a.onended=null; a.onerror=null; next(); };
        const fail=()=>{ if(advanced||my!==this.token)return; advanced=true; this._clear(); a.onended=null; a.onerror=null; Aud._tts(L,my).then(next); };
        a.onended=go; a.onerror=fail; a.volume=this.vol;
        try{ a.pause(); }catch(e){}
        try{ a.src=src; a.currentTime=0; }catch(e){}
        this._clear();
        this._poll=setInterval(()=>{ if(my!==this.token)return; if(a.ended)go(); }, 200);
        this._hard=setTimeout(()=>{ if(my===this.token)go(); }, 45000);
        const pr=a.play(); if(pr&&pr.then)pr.catch(fail);
      };
      next();
    });
  },
  _tts(L,my){ return new Promise(res=>{
      if(!("speechSynthesis" in window)){res();return;}
      if(!this.voice)this.pick();
      const u=new SpeechSynthesisUtterance((L.t||"")+"");
      if(this.voice)u.voice=this.voice;
      u.rate=L.r||0.92; u.pitch=1.05; u.volume=this.vol;
      /* resolve when speech ACTUALLY stops (poll speechSynthesis.speaking) rather than
         a guessed length, so a long sentence isn't clipped even if onend is dropped. */
      let done=false, started=false, poll=null, hard=null, sg=null;
      const fin=()=>{ if(done)return; done=true; if(poll)clearInterval(poll); if(hard)clearTimeout(hard); if(sg)clearTimeout(sg); res(); };
      u.onstart=()=>{started=true;}; u.onend=fin; u.onerror=fin;
      try{ speechSynthesis.speak(u); }catch(e){ fin(); return; }
      sg=setTimeout(()=>{ if(!started)fin(); }, 1800);   /* TTS never engaged (no voices) → don't stall */
      poll=setInterval(()=>{ try{ if(speechSynthesis.speaking)started=true; else if(started)fin(); }catch(e){ fin(); } }, 250);
      hard=setTimeout(fin, 30000);
  });},
  ding(){ if(typeof Sfx!=="undefined" && Sfx.correct){ Sfx.correct(); return; }   /* route to the SFX kit (respects its volume/toggle) */
    try{ const ctx=Aud.ctx||(Aud.ctx=new (window.AudioContext||window.webkitAudioContext)());
    const o=ctx.createOscillator(),gn=ctx.createGain();
    o.frequency.value=740;o.type="sine";
    gn.gain.setValueAtTime(0.0001,ctx.currentTime);
    gn.gain.exponentialRampToValueAtTime(0.18,ctx.currentTime+0.03);
    gn.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.4);
    o.connect(gn).connect(ctx.destination);o.start();o.stop(ctx.currentTime+0.42);
  }catch(e){} }
};
if("speechSynthesis" in window){speechSynthesis.onvoiceschanged=()=>Aud.pick();
  setInterval(()=>{try{if(speechSynthesis.speaking)speechSynthesis.resume();}catch(e){}},4000);}
let lastSeq={};
let __cont=null,__skipT=null;
function flow(p,fn){ __cont=fn; clearTimeout(__skipT);
  const sk=$("btnSkip"); sk.style.display="none";
  __skipT=setTimeout(()=>{ if(__cont)sk.style.display="flex"; },2600);
  p.then(()=>{ if(__cont===fn){ __cont=null; sk.style.display="none"; fn(); } });
}
function clearFlow(){ __cont=null; clearTimeout(__skipT); const sk=$("btnSkip"); if(sk)sk.style.display="none"; }
function narrate(key,el,ids,display){ lastSeq[key]=ids;
  const txt=(display!==undefined)?display:(Array.isArray(ids)?ids:[ids]).map(id=>(LINES[id]||{t:id}).t).join(" ");
  el.querySelector("span").textContent=txt;
  return Aud.play(ids);
}
document.addEventListener("click",e=>{
  const ear=e.target.closest(".ear"); if(!ear)return;
  const k=ear.dataset.ear; if(lastSeq[k])Aud.play(lastSeq[k]);
});
