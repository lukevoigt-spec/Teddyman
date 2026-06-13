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
function clipFor(id){ return CUSTOM[id] || ((typeof VOICEPACK!=="undefined") && VOICEPACK[id]) || null; }

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
    const cap=4000+2600*seq.length;
    if(typeof Music!=="undefined" && Music.duck) Music.duck();   /* dip the music under narration */
    const core=new Promise(res=>{
      const next=()=>{ if(my!==this.token){res();return;}
        if(!seq.length){res();return;}
        const id=seq.shift(); const L=LINES[id]||{t:id}; const src=clipFor(id);
        if(src){
          const a=new Audio(src); this.cur=a; a.volume=this.vol;
          a.onended=()=>{this.cur=null;next();}; a.onerror=()=>{this.cur=null;ttsOne();};
          a.play().catch(()=>ttsOne());
          function ttsOne(){ Aud._tts(L,my).then(next); }
        } else { this._tts(L,my).then(next); }
      }; next();
    });
    const race=Promise.race([core,new Promise(r=>setTimeout(r,cap))]);
    race.then(()=>{ if(typeof Music!=="undefined" && Music.unduck) Music.unduck(); });   /* restore after */
    return race;
  },
  _tts(L,my){ return new Promise(res=>{
      const guard=setTimeout(res,8000);
      if(!("speechSynthesis" in window)){res();return;}
      if(!this.voice)this.pick();
      const u=new SpeechSynthesisUtterance(L.t);
      if(this.voice)u.voice=this.voice;
      u.rate=L.r||0.92; u.pitch=1.05; u.volume=this.vol;
      u.onend=()=>{clearTimeout(guard);res();}; u.onerror=()=>{clearTimeout(guard);res();};
      speechSynthesis.speak(u);
  });},
  ding(){ try{ const ctx=Aud.ctx||(Aud.ctx=new (window.AudioContext||window.webkitAudioContext)());
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
