/* =========================================================
   PLAYTEST FEEDBACK BOX  (Grown-Up Corner ▸ Playtest notes)
   The highest-value signal for this app is Teddy actually using it (AGENTS.md
   "playtest loop"). This is the frictionless capture: the parent types what he
   saw → one tap commits a timestamped note to the repo (playtest/<ISO>.md) and
   opens a trigger Issue for review.

   - Reuses the Voice Studio's device-stored GitHub token (localStorage stGhToken)
     and the same ghApi() shape. Token is DEVICE-ONLY, never committed.
   - A NEW file per note (Contents API PUT) → genuinely race-free: no
     read-modify-write of the branch ref, so two quick notes can't clobber.
   - Resilient like the save layer: optimistic UI; if the network/token fails the
     note is QUEUED in localStorage and retried on the next Grown-Up Corner open.
     Never blocks play, never loses a note, never throws into the game.
   Loaded as a classic <script> AFTER game.js — uses $/showSection/profileName/
   ACTIVE/Aud only at call time. Spec: QA.md (Trinity, 2026-06-15).
========================================================= */
(function(){
  "use strict";
  const GH={ owner:"lukevoigt-spec", repo:"Teddyman", branch:"main" };   /* same target as audio-studio publish() */
  const LS_GH="stGhToken";        /* shared with the Voice Studio (audio-studio.js LS_GH) */
  const LS_QUEUE="ptQueue";       /* notes awaiting a successful send */
  const APP_VER="superteddy-v3";  /* tracks the sw.js CACHE name; bump alongside it */
  const $=id=>document.getElementById(id);

  function ghToken(){ try{ return (localStorage.getItem(LS_GH)||"").trim(); }catch(e){ return ""; } }
  async function ghApi(token,path,opts){
    const r=await fetch("https://api.github.com/repos/"+GH.owner+"/"+GH.repo+path,
      Object.assign({headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json","Content-Type":"application/json"}},opts||{}));
    if(!r.ok){ let d=""; try{ d=(await r.json()).message||""; }catch(e){} throw new Error(r.status+(d?" "+d:"")); }
    return r.json();
  }
  function b64utf8(s){ return btoa(unescape(encodeURIComponent(s))); }   /* UTF-8-safe base64 for the Contents API */
  function fileSafe(ts){ return ts.replace(/[:.]/g,"-"); }               /* ISO → filename-safe */
  function activeProfile(){ try{ return (typeof profileName==="function"&&typeof ACTIVE!=="undefined")?profileName(ACTIVE):"Teddy"; }catch(e){ return "Teddy"; } }

  /* ---- localStorage queue (offline-safe; mirrors the save layer's never-lose rule) ---- */
  function readQ(){ try{ return JSON.parse(localStorage.getItem(LS_QUEUE)||"[]"); }catch(e){ return []; } }
  function writeQ(q){ try{ localStorage.setItem(LS_QUEUE,JSON.stringify(q)); }catch(e){} }
  function enqueue(note){ const q=readQ(); q.push(note); writeQ(q); }

  /* ---- send ONE note: commit the file (record of truth) + open a trigger Issue ---- */
  async function sendNote(note){
    const token=ghToken(); if(!token) throw new Error("no token");
    const md="# Playtest note\n\n- **When:** "+note.ts+"\n- **Player:** "+note.profile+"\n- **App:** "+note.ver+"\n\n"+note.text+"\n";
    /* NEW file via Contents API — race-free, no read-modify-write of the ref */
    await ghApi(token,"/contents/playtest/"+fileSafe(note.ts)+".md",
      {method:"PUT",body:JSON.stringify({message:"Playtest note "+note.ts,content:b64utf8(md),branch:GH.branch})});
    /* trigger Issue — assignable review surface; graceful if the token lacks Issues:write (the file IS the record) */
    const firstLine=(note.text.split("\n")[0]||"note").slice(0,72);
    try{ await ghApi(token,"/issues",
      {method:"POST",body:JSON.stringify({title:"Playtest: "+firstLine,body:note.text+"\n\n— "+note.profile+", "+note.ts+" ("+note.ver+")"})}); }
    catch(e){ /* 403 / Issues disabled → ignore; the committed file already captured it */ }
  }
  /* flush queued notes; keep any that still fail. Returns count sent. */
  async function flushQueue(){
    if(!ghToken())return 0;
    const q=readQ(); if(!q.length)return 0;
    const keep=[]; let sent=0;
    for(let i=0;i<q.length;i++){ try{ await sendNote(q[i]); sent++; }catch(e){ keep.push(q[i]); } }
    writeQ(keep);
    return sent;
  }

  function setMsg(t,warn){ const m=$("ptStatus"); if(m){ m.textContent=t; m.classList.toggle("warn",!!warn); } }

  async function submit(){
    const ta=$("ptText"); const text=(ta&&ta.value||"").trim();
    if(!text){ setMsg("Type a note first.",1); return; }
    /* if the parent pasted a token into the local field, remember it (shared key) */
    const tf=$("ptToken"); if(tf&&tf.value.trim()){ try{ localStorage.setItem(LS_GH,tf.value.trim()); }catch(e){} }
    const note={ ts:new Date().toISOString(), profile:activeProfile(), ver:APP_VER, text:text };
    const btn=$("ptSend"); if(btn)btn.disabled=true;
    try{
      if(!ghToken()){                                   /* no token yet → save locally, tell the parent how to enable sending */
        enqueue(note); if(ta)ta.value="";
        setMsg("Saved on this iPad. Add a GitHub token below (or in Voice Studio ▸ Save) to send it to the team.",1);
        return;
      }
      setMsg("Sending…");
      try{ await sendNote(note); if(ta)ta.value=""; setMsg("Sent ✓ — the team will review."); }
      catch(e){ enqueue(note); if(ta)ta.value=""; setMsg("Saved — will send automatically next time you open this.",1); }
      await flushQueue();                               /* opportunistically clear any older queued notes too */
    } finally { if(btn)btn.disabled=false; }
  }

  /* called when the Playtest section opens: prefill the token field + flush the queue */
  async function onOpen(){
    const tf=$("ptToken"); if(tf)tf.value=ghToken();
    const q=readQ();
    if(q.length)setMsg(q.length+" note"+(q.length>1?"s":"")+" waiting to send…");
    const sent=await flushQueue();
    if(sent>0)setMsg("Synced "+sent+" saved note"+(sent>1?"s":"")+" ✓");
  }

  function wire(){
    const hb=$("hubPlaytest"); if(hb)hb.onclick=()=>{ if(typeof Aud!=="undefined"&&Aud.pick)Aud.pick(); if(typeof showSection==="function")showSection("tabPlaytest"); onOpen(); };
    const sb=$("ptSend"); if(sb)sb.onclick=submit;
    flushQueue();   /* opportunistic flush on load (covers "retry on next open" even before the section is visited) */
  }
  if(document.readyState!=="loading")wire(); else document.addEventListener("DOMContentLoaded",wire);
})();
