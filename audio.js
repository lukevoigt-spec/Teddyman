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
  voice:null, cur:null, token:0, vol:1,
  hasVP(id){ return !!clipFor(id); },
  pick(){ const vs=speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.startsWith("en"));
    this.voice = vs.find(v=>/samantha/i.test(v.name)) || vs.find(v=>/karen|ava|allison|female/i.test(v.name)) || vs[0]||null; },
  stop(){ this.token++; speechSynthesis.cancel(); if(this.cur){try{this.cur.pause();}catch(e){}this.cur=null;} },
  play(ids){ this.stop(); const my=this.token;
    const seq=Array.isArray(ids)?ids.slice():[ids];
    if(typeof Music!=="undefined" && Music.duck) Music.duck();   /* dip the music under narration */
    /* PER-CLIP advance: each clip resolves on its OWN onended (snappy auto-advance),
       with a per-clip watchdog tightened to the clip's real duration as a fallback if
       onended never fires (iPad Safari). No global time cap — so a long recorded line
       is never cut mid-sentence, and the flow still advances right when each clip ends. */
    return new Promise(resolve=>{
      const finish=()=>{ if(typeof Music!=="undefined" && Music.unduck) Music.unduck(); resolve(); };
      const next=()=>{
        if(my!==this.token){ finish(); return; }    /* superseded by a newer play()/stop() */
        if(!seq.length){ finish(); return; }
        const id=seq.shift(); const L=LINES[id]||{t:id}; const src=clipFor(id);
        if(src){
          const a=new Audio(src); this.cur=a; a.volume=this.vol;
          let advanced=false, wd=null;
          const go=()=>{ if(advanced)return; advanced=true; if(wd)clearTimeout(wd); next(); };
          const fail=()=>{ if(advanced)return; advanced=true; if(wd)clearTimeout(wd); Aud._tts(L,my).then(next); };
          a.onended=go; a.onerror=fail;
          wd=setTimeout(go,15000);   /* fallback until we know the real duration */
          const pr=a.play();
          if(pr&&pr.then) pr.then(()=>{ if(advanced)return;
              const d=(isFinite(a.duration)&&a.duration>0)? a.duration*1000+1300 : 15000;
              if(wd)clearTimeout(wd); wd=setTimeout(go,d);
            }).catch(fail);
        } else { this._tts(L,my).then(next); }
      };
      next();
    });
  },
  _tts(L,my){ return new Promise(res=>{
      if(!("speechSynthesis" in window)){res();return;}
      if(!this.voice)this.pick();
      const txt=(L.t||"")+"";
      const u=new SpeechSynthesisUtterance(txt);
      if(this.voice)u.voice=this.voice;
      u.rate=L.r||0.92; u.pitch=1.05; u.volume=this.vol;
      /* text-proportional guard: a flaky onend (iPad) can't stall the flow, but it's
         long enough not to clip a real spoken line. ~75ms/char, 1–11s. */
      const guard=setTimeout(res, Math.min(11000, Math.max(1500, 900+txt.length*75)));
      u.onend=()=>{clearTimeout(guard);res();}; u.onerror=()=>{clearTimeout(guard);res();};
      speechSynthesis.speak(u);
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
