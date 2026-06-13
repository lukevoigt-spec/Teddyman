/* =========================================================
   IN-APP VOICE STUDIO  (Grown-Up Corner ▸ Audio tab)
   A guided, bulletproof workflow for adding the game's voices:
     1) LETTER SOUNDS — record in your own voice, guided one-at-a-time with
        research-based coaching tips (or jump to any single sound to redo it).
     2) TALKING LINES — generate with ElevenLabs (key + voice picks remembered
        on THIS device) or record your own.
     3) SAVE TO ALL DEVICES — publish to the repo, or download a backup file.
   Clips save to this iPad (IndexedDB via VStore/CUSTOM in game.js) and play
   immediately. Reads the game's own LINES manifest, so new lines appear here.
   Relies on globals from game.js: $, LINES, LETTERS, CUSTOM, VStore, Aud, vpMsg.
========================================================= */
(function(){
  "use strict";
  const LS_KEY="stElKey", LS_VOICES="stElVoices";   /* remembered on THIS device only */
  const ROLES=[["A","Mentor / Narrator"],["B","Amelia (Heartguard)"],["C","Vex / robots"],
    ["T","Archie (Tank)"],["F","Ellie (Flip)"],["W","William (Sunny)"],
    ["V","The Vixen (Act 2 villain)"],["N","Noah the Red (Act 2 wizard)"],["P","Mom & Dad"]];

  /* ---- letter-sound order + research-based articulation coaching ----
     Coaching emphasises CLEAN phonemes: continuous sounds are held, STOP sounds
     get NO added 'uh' (the classic /b/→'buh' error that breaks blending). */
  const PH_ORDER="s a t p i n m d g o c k e u r h b f l j v w x y z q".split(" ")
    .concat(["sh","ch","th","wh","ck","ng"])
    .concat(["a_long","e_long","i_long","o_long","u_long"]);
  const LONG_KW={a_long:["cake","🎂"],e_long:["feet","🦶"],i_long:["kite","🪁"],o_long:["home","🏠"],u_long:["cube","🧊"]};
  const PH_COACH={
    s:"Unvoiced hiss. Smile, teeth nearly closed, push air: “ssss.” Hold it — never “suh.”",
    a:"Short A (apple). Open mouth, drop the jaw: “aaa.” Quick and clean.",
    t:"Stop sound. Tongue tip taps behind top teeth — tiny puff: “t.” NOT “tuh.”",
    p:"Stop sound. Press lips, pop a small puff of air: “p.” No “uh” after it.",
    i:"Short I (igloo). Mouth slightly open, relaxed: “ih.” Short.",
    n:"Tongue behind top teeth, hum through the nose: “nnn.” Can hold it.",
    m:"Lips together, hum: “mmm.” Voiced — you can hold it.",
    d:"Stop sound, voiced. Tongue taps behind top teeth: “d.” NOT “duh.”",
    g:"Hard G (goat). Back of tongue, voiced, quick: “g.” NOT “guh.”",
    o:"Short O (octopus). Round, open mouth: “o” (ah).",
    c:"/k/ (cat). Back of tongue, sharp puff: “k.” NOT “kuh.”",
    k:"/k/ (kite). Same as C — back of tongue: “k.” No “uh.”",
    e:"Short E (egg). Mouth open a little, lips relaxed: “eh.”",
    u:"Short U (up). Relaxed, central: “uh.” Short.",
    r:"Like a growl — tongue pulled back, voiced: “rrr.” No “uh.”",
    h:"Just breath, like fogging a mirror: “h.” Very light, unvoiced.",
    b:"Stop sound, voiced. Lips together, small pop: “b.” NOT “buh.”",
    f:"Top teeth on bottom lip, push air: “fff.” Unvoiced — hold it.",
    l:"Tongue tip behind top teeth, voiced: “lll.” Can hold it.",
    j:"/j/ (jam). Quick, voiced: “j.” No “uh.”",
    v:"Top teeth on bottom lip, voiced buzz: “vvv.” Hold it.",
    w:"Round the lips, voiced: “w” (win). No “uh.”",
    x:"Usually /ks/ (fox): “ks” — two quick sounds together.",
    y:"/y/ (yes). Quick, voiced: “y.”",
    z:"Like S but voiced — a buzz: “zzz.” Hold it.",
    q:"/kw/ (queen): “kw” — q almost always travels with u.",
    sh:"One sound: “shhh” (the quiet sign). Lips pushed forward.",
    ch:"One sound: “ch” (chip). Short, no “uh.”",
    th:"Tongue between the teeth, push air: “thhh” (thumb).",
    wh:"“wh” (whale) — a “w” with a little breath in front.",
    ck:"/k/ (duck). Just like K: “k.” No “uh.”",
    ng:"Hum at the back of the mouth: “ng” (ring). One sound.",
    a_long:"Long A — the vowel says its NAME: “ay” (cake).",
    e_long:"Long E — says its NAME: “ee” (feet).",
    i_long:"Long I — says its NAME: “eye” (kite).",
    o_long:"Long O — says its NAME: “oh” (home).",
    u_long:"Long U — says its NAME: “you” (cube)."
  };
  function phonemes(){ return PH_ORDER.filter(g=>LINES["snd_"+g]).map(g=>{
    const lng=/_long$/.test(g), base=lng?g.replace(/_long$/,""):g, L=LETTERS[base]||{};
    const kw = lng ? (LONG_KW[g]||[]) : [L.kw, L.icon];
    return { id:"snd_"+g, g, base, lng, disp: base, kw:kw[0]||"", icon:kw[1]||"", tip:PH_COACH[g]||"" };
  }); }
  /* talking lines = everything that ISN'T a letter sound (those are record-only) */
  function talkLines(){ return Object.keys(LINES).filter(id=>!/^snd_/.test(id)); }

  let elKey=localStorage.getItem(LS_KEY)||"";
  let elVoices=[];   /* loaded voice list from ElevenLabs */
  const esc=s=>(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function setMsg(txt,bad){ const m=$("audStatus"); if(m){ m.textContent=txt; m.style.color=bad?"#ff9d8f":"#9b94c9"; } }
  function hasClip(id){ return !!(CUSTOM[id] || (typeof VOICEPACK!=="undefined" && VOICEPACK[id])); }
  function clipState(id){ return CUSTOM[id] ? "mine" : ((typeof VOICEPACK!=="undefined" && VOICEPACK[id]) ? "ship" : "tts"); }
  function blobToDataURI(b){ return new Promise((res,rej)=>{ const fr=new FileReader();
    fr.onload=()=>res(fr.result); fr.onerror=()=>rej(new Error("read failed")); fr.readAsDataURL(b); }); }
  async function saveClip(id,uri){ CUSTOM[id]=uri; const ok=await VStore.put(id,uri);
    if(!ok)setMsg("Heads up: couldn't save to this iPad's storage — the clip works now but may not persist. Try Download backup.",1);
    return ok; }
  async function delClip(id){ delete CUSTOM[id]; await VStore.del(id); }

  /* ================= DASHBOARD ================= */
  function buildDash(){ const d=$("audDash"); if(!d)return;
    const phs=phonemes(), mine=phs.filter(p=>CUSTOM[p.id]).length;
    const tks=talkLines(), tmine=tks.filter(id=>CUSTOM[id]).length, tany=tks.filter(id=>hasClip(id)).length;
    const robot=tks.length-tany;
    d.innerHTML=
      `<div class="vbar"><div class="vbar-row"><b>Letter sounds</b><span>${mine} / ${phs.length} recorded</span></div>
        <div class="vbar-track"><div class="vbar-fill" style="width:${phs.length?100*mine/phs.length:0}%;background:linear-gradient(90deg,#5fe0a0,#23a35f)"></div></div></div>`+
      `<div class="vbar"><div class="vbar-row"><b>Talking lines</b><span>${tany} / ${tks.length} voiced · ${robot} still robot</span></div>
        <div class="vbar-track"><div class="vbar-fill" style="width:${tks.length?100*tany/tks.length:0}%;background:linear-gradient(90deg,#ffd75e,#f0a82b)"></div></div></div>`;
  }

  /* ================= LETTER-SOUND GRID (power user) ================= */
  function buildPhonGrid(){ const g=$("phonGrid"); if(!g)return; g.innerHTML="";
    const phs=phonemes();
    const bar=$("phonBar"); if(bar){ const mine=phs.filter(p=>CUSTOM[p.id]).length;
      bar.textContent = mine===phs.length ? `All ${phs.length} sounds recorded in your voice ✓` : `${mine} of ${phs.length} recorded — tap a sound to record it, or use Guided record.`; }
    phs.forEach((p,i)=>{ const st=clipState(p.id);
      const chip=document.createElement("button"); chip.className="phonchip s-"+st;
      chip.innerHTML=`<span class="pc-g read">${esc(p.disp)}${p.lng?'<i class="pc-long">long</i>':''}</span>`+
        `<span class="pc-st">${st==="mine"?"yours ✓":st==="ship"?"shipped":"robot"}</span>`;
      chip.title=p.tip; chip.onclick=()=>openRec(i);
      g.appendChild(chip);
    });
  }

  /* ================= GUIDED RECORDER ================= */
  let recList=[], recIx=0, mediaRec=null, recChunks=[], lastTake=null, recStream=null;
  function openRec(i){ recList=phonemes(); recIx=Math.max(0,Math.min(i, recList.length-1));
    $("recOverlay").classList.add("on"); renderRec(); }
  function closeRec(){ stopStream(); $("recOverlay").classList.remove("on");
    buildPhonGrid(); buildDash(); }
  function stopStream(){ try{ if(mediaRec&&mediaRec.state==="recording")mediaRec.stop(); }catch(e){}
    try{ if(recStream)recStream.getTracks().forEach(t=>t.stop()); }catch(e){}
    mediaRec=null; recStream=null; lastTake=null; }
  function renderRec(){ const p=recList[recIx]; if(!p)return;
    $("recProg").innerHTML=recList.map((q,j)=>`<i class="${j===recIx?'on':''} ${CUSTOM[q.id]?'got':''}"></i>`).join("");
    $("recGraph").innerHTML=`${esc(p.disp)}${p.lng?'<span class="rg-long">long</span>':''}`;
    $("recKw").innerHTML=p.kw?`<span class="rk-ic">${p.icon||""}</span> as in <b>${esc(p.kw)}</b>`:"";
    $("recTip").textContent=p.tip;
    const got=!!CUSTOM[p.id];
    $("recState").innerHTML=got?'<span class="ok">✓ recorded in your voice</span>':(clipState(p.id)==="ship"?'<span>using the shipped voice</span>':'<span class="rob">using the robot voice — record it!</span>');
    $("recPlay").style.display=hasClip(p.id)||p.tip?"inline-block":"none";
    $("recPrev").disabled=recIx===0; $("recNext").disabled=recIx===recList.length-1;
    setRecBtn(false);
  }
  function setRecBtn(live){ const b=$("recBtn");
    b.innerHTML=live?'<span class="recdot"></span> Stop':'<span class="recdot idle"></span> Record';
    b.classList.toggle("live",live); }
  function pickMime(){ const c=["audio/mp4","audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/ogg"];
    for(const m of c){ try{ if(window.MediaRecorder&&MediaRecorder.isTypeSupported(m))return m; }catch(e){} } return ""; }
  async function toggleRec(){
    const p=recList[recIx]; if(!p)return;
    if(mediaRec && mediaRec.state==="recording"){ mediaRec.stop(); return; }
    if(!(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){
      setMsg("This browser can't record. Use a voice-memo app, then Restore backup or the 📁 upload.",1); return; }
    try{
      recStream=await navigator.mediaDevices.getUserMedia({audio:true});
      const mime=pickMime(); recChunks=[];
      mediaRec=new MediaRecorder(recStream, mime?{mimeType:mime}:undefined);
      mediaRec.ondataavailable=e=>{ if(e.data&&e.data.size)recChunks.push(e.data); };
      mediaRec.onstop=async()=>{ try{ recStream.getTracks().forEach(t=>t.stop()); }catch(e){} recStream=null;
        const blob=new Blob(recChunks,{type:mediaRec.mimeType||mime||"audio/mp4"}); mediaRec=null; setRecBtn(false);
        if(!blob.size){ setMsg("Hmm, nothing recorded — try again, a bit louder.",1); return; }
        try{ lastTake=await blobToDataURI(blob); }catch(e){ setMsg("Couldn't read that recording — try again.",1); return; }
        // auto-play the take so the parent hears it immediately
        try{ const a=new Audio(lastTake); a.play().catch(()=>{}); }catch(e){}
        $("recState").innerHTML='<span class="ok">Here\'s your take — Keep it, or Record again.</span>';
        showKeep(true);
      };
      mediaRec.start(); setRecBtn(true);
      $("recState").innerHTML='<span class="rec">● recording… say the sound, then tap Stop</span>';
    }catch(e){ stopStream(); setRecBtn(false);
      setMsg("Microphone blocked ("+(e.name||e.message)+"). Allow mic access, or upload a voice memo with 📁.",1); }
  }
  function showKeep(on){ $("recKeep").style.display=on?"inline-block":"none"; }
  async function keepTake(){ const p=recList[recIx]; if(!p||!lastTake)return;
    await saveClip(p.id,lastTake); lastTake=null; showKeep(false);
    Aud.ding(); buildPhonGrid(); buildDash();
    // auto-advance to the next sound that still needs the parent's voice
    let nx=recList.findIndex((q,j)=>j>recIx && !CUSTOM[q.id]);
    if(nx<0)nx=Math.min(recIx+1,recList.length-1);
    if(nx!==recIx){ recIx=nx; renderRec(); } else renderRec();
  }

  /* ================= TALKING-LINE GRID ================= */
  function buildTalkGrid(){ const g=$("talkGrid"); if(!g)return; g.innerHTML="";
    talkLines().forEach(id=>{ const L=LINES[id], st=clipState(id);
      const row=document.createElement("div"); row.className="talkrow s-"+st;
      row.innerHTML=`<div class="tk-meta"><div class="tk-tx">${esc(L.t)}</div><div class="tk-id">${esc(id)} · ${esc(roleName(L.v))}</div></div>`+
        `<span class="tk-st">${st==="mine"?"yours ✓":st==="ship"?"shipped":"robot"}</span>`;
      const acts=document.createElement("div"); acts.className="tk-acts";
      const mk=(t,fn,cls)=>{ const b=document.createElement("button"); b.textContent=t; if(cls)b.className=cls; b.onclick=()=>fn(b); return b; };
      acts.appendChild(mk("▶",()=>Aud.play(id)));
      acts.appendChild(mk("Gen",b=>genOne(id,b)));
      acts.appendChild(mk("📁",()=>pickFile(id)));
      if(CUSTOM[id])acts.appendChild(mk("✕",async b=>{ await delClip(id); buildTalkGrid(); buildDash(); },"tk-del"));
      row.appendChild(acts); g.appendChild(row);
    });
  }
  function roleName(v){ const r=ROLES.find(x=>x[0]===(v||"A")); return r?r[1].split(" (")[0]:"Narrator"; }

  /* per-line file upload (works for any line) */
  let fileTarget=null, fileInp=null;
  function pickFile(id){ fileTarget=id;
    if(!fileInp){ fileInp=document.createElement("input"); fileInp.type="file"; fileInp.accept="audio/*";
      fileInp.style.display="none"; document.body.appendChild(fileInp);
      fileInp.onchange=async()=>{ if(!fileTarget||!fileInp.files[0])return;
        try{ await saveClip(fileTarget, await blobToDataURI(fileInp.files[0]));
          setMsg("Saved your audio for "+fileTarget+" to this iPad."); refreshAll(); }
        catch(e){ setMsg("Couldn't read that file.",1); } fileInp.value=""; }; }
    fileInp.click();
  }

  /* ================= ELEVENLABS ================= */
  /* inline status RIGHT under the Load-voices button (the global #audStatus is at
     the very bottom of the tab, off-screen while you're up here in section 2). */
  function elStatus(txt,bad){ const m=$("elMsg"); if(m){ m.textContent=txt; m.style.color=bad?"#ff9d8f":"#9fe870"; }
    setMsg(txt,bad); }
  function buildVoiceSelects(){ const wrap=$("elVoices"); if(!wrap)return;
    const saved=JSON.parse(localStorage.getItem(LS_VOICES)||"{}");
    wrap.style.display="block";
    wrap.innerHTML='<div class="elvoice-h">🎙️ Pick a voice for each character, then tap “Gen” on a line (or “Generate all”):</div>';
    ROLES.forEach(([k,lbl])=>{ const d=document.createElement("div"); d.className="elvoice";
      const opts='<option value="">— choose a voice —</option>'+elVoices.map(v=>`<option value="${esc(v.voice_id)}"${saved[k]===v.voice_id?" selected":""}>${esc(v.name)}</option>`).join("");
      d.innerHTML=`<label>${esc(lbl)}</label><select id="v_${k}">${opts}</select>`;
      wrap.appendChild(d); });
    ROLES.forEach(([k])=>{ const s=$("v_"+k); if(s)s.onchange=saveVoicePicks; });
    try{ wrap.scrollIntoView({behavior:"smooth",block:"nearest"}); }catch(e){}
  }
  function saveVoicePicks(){ const m={}; ROLES.forEach(([k])=>{ const s=$("v_"+k); if(s&&s.value)m[k]=s.value; });
    localStorage.setItem(LS_VOICES, JSON.stringify(m)); }
  async function elLoad(){ elKey=($("elKey").value||elKey||"").trim();
    if(!elKey){ elStatus("Paste your ElevenLabs API key in the box first.",1); return; }
    elStatus("Contacting ElevenLabs…");
    let r;
    try{ r=await fetch("https://api.elevenlabs.io/v1/voices",{headers:{"xi-api-key":elKey}}); }
    catch(e){ elStatus("Couldn’t reach ElevenLabs. Check the iPad’s internet and try again — if it keeps failing the network may be blocking it.",1); return; }
    if(r.status===401||r.status===403){ elStatus("ElevenLabs didn’t accept that key. Re-copy the whole key from elevenlabs.io ▸ Profile ▸ API Keys (it needs Text-to-Speech access), then Load voices again.",1); return; }
    if(!r.ok){ elStatus("ElevenLabs returned an error (HTTP "+r.status+"). Wait a moment and try again.",1); return; }
    let d; try{ d=await r.json(); }catch(e){ elStatus("Got an unexpected reply from ElevenLabs. Try again.",1); return; }
    elVoices=d.voices||[];
    if(!elVoices.length){ elStatus("Connected, but this account has no voices yet. Add or pick voices in your ElevenLabs ‘Voices’ library, then Load voices again.",1); return; }
    buildVoiceSelects();
    localStorage.setItem(LS_KEY,elKey); const fg=$("btnElForget"); if(fg)fg.style.display="inline-block";
    elStatus("✓ Loaded "+elVoices.length+" voices. Choose one per character below.");
  }
  function elForget(){ localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_VOICES);
    elKey=""; if($("elKey"))$("elKey").value=""; $("btnElForget").style.display="none";
    const w=$("elVoices"); if(w){ w.style.display="none"; w.innerHTML=""; } setMsg("Forgot the ElevenLabs key on this iPad."); }
  async function genOne(id,btn){ const L=LINES[id];
    if(/^snd_/.test(id)){ setMsg("Letter sounds are recorded in your voice (🎤) — robots can't make a clean phoneme.",1); return false; }
    if(!elKey){ setMsg("Add your ElevenLabs key and Load voices first (Talking Lines section).",1); return false; }
    const sel=$("v_"+(L.v||"A")); const voiceId=sel&&sel.value;
    if(!voiceId){ setMsg("Load voices first, then pick one per role.",1); return false; }
    if(btn)btn.disabled=true; setMsg("Generating "+id+"…");
    try{ const r=await fetch("https://api.elevenlabs.io/v1/text-to-speech/"+voiceId,{ method:"POST",
        headers:{"xi-api-key":elKey,"Content-Type":"application/json"},
        body:JSON.stringify({text:L.t,model_id:"eleven_multilingual_v2",
          voice_settings:{stability:.55,similarity_boost:.8,style:.35}}) });
      if(!r.ok)throw new Error("HTTP "+r.status);
      await saveClip(id, await blobToDataURI(await r.blob()));
      setMsg("Generated "+id+" ✓"); buildTalkGrid(); buildDash(); return true;
    }catch(e){ setMsg("Generate failed for "+id+": "+(e.message||e),1); return false; }
    finally{ if(btn)btn.disabled=false; }
  }
  async function genAll(){
    if(!elKey){ setMsg("Add your ElevenLabs key and Load voices first.",1); return; }
    saveVoicePicks();
    const todo=talkLines().filter(id=>!CUSTOM[id]);
    if(!todo.length){ setMsg("Every talking line already has a clip. (Letter sounds are recorded separately.)"); return; }
    const btn=$("btnGenAll"); btn.disabled=true;
    let ok=0; for(let i=0;i<todo.length;i++){ setMsg("Generating talking lines… "+(i+1)+" / "+todo.length);
      if(await genOne(todo[i]))ok++; await new Promise(r=>setTimeout(r,300)); }
    btn.disabled=false; buildTalkGrid(); buildDash();
    setMsg("Generated "+ok+" / "+todo.length+" talking lines. Now record the Letter Sounds in your voice, then Save to all devices.");
  }

  /* ================= EXPORT / IMPORT / PUBLISH ================= */
  function mergedPack(){ return Object.assign({}, (typeof VOICEPACK!=="undefined"?VOICEPACK:{}), CUSTOM); }
  function exportVP(){ const merged=mergedPack(), n=Object.keys(merged).length;
    if(!n){ setMsg("Nothing to save yet — record or generate some voices first.",1); return; }
    const blob=new Blob(["window.VOICEPACK="+JSON.stringify(merged)+";"],{type:"text/javascript"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="voicepack.js"; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    setMsg("Downloaded voicepack.js ("+n+" voices). Keep it safe — Restore it on any device, or commit it to the project.");
  }
  function importVP(file){ const fr=new FileReader();
    fr.onload=async()=>{ try{
        const t=String(fr.result).trim().replace(/^\s*window\.VOICEPACK\s*=\s*/,"").replace(/;?\s*$/,"");
        const obj=JSON.parse(t); const ids=Object.keys(obj);
        if(!ids.length)throw new Error("no clips found");
        for(const id of ids){ CUSTOM[id]=obj[id]; await VStore.put(id,obj[id]); }
        refreshAll(); setMsg("Restored "+ids.length+" voices onto this iPad.");
      }catch(e){ setMsg("Couldn't read that backup: "+(e.message||e),1); } };
    fr.readAsText(file);
  }
  const GH={ owner:"lukevoigt-spec", repo:"Teddyman", branch:"main" };
  async function ghApi(token,path,opts){
    const r=await fetch("https://api.github.com/repos/"+GH.owner+"/"+GH.repo+path,
      Object.assign({headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json","Content-Type":"application/json"}},opts||{}));
    if(!r.ok){ let d=""; try{d=(await r.json()).message||"";}catch(e){} throw new Error(r.status+(d?" "+d:"")); }
    return r.json();
  }
  async function publish(){
    const token=($("ghToken").value||"").trim();
    if(!token){ setMsg("Paste a GitHub fine-grained token (Contents: write) first.",1); return; }
    const merged=mergedPack(), n=Object.keys(merged).length;
    if(!n){ setMsg("Nothing to publish yet — record or generate some voices first.",1); return; }
    const content="window.VOICEPACK="+JSON.stringify(merged)+";";
    const btn=$("btnPublish"); if(btn)btn.disabled=true;
    try{
      setMsg("Publishing "+n+" voices to GitHub…");
      const ref=await ghApi(token,"/git/ref/heads/"+GH.branch); const head=ref.object.sha;
      const headCommit=await ghApi(token,"/git/commits/"+head);
      const blob=await ghApi(token,"/git/blobs",{method:"POST",body:JSON.stringify({content:content,encoding:"utf-8"})});
      const tree=await ghApi(token,"/git/trees",{method:"POST",body:JSON.stringify({base_tree:headCommit.tree.sha,tree:[{path:"voicepack.js",mode:"100644",type:"blob",sha:blob.sha}]})});
      const commit=await ghApi(token,"/git/commits",{method:"POST",body:JSON.stringify({message:"Update voicepack.js from in-app studio ("+n+" voices)",tree:tree.sha,parents:[head]})});
      await ghApi(token,"/git/refs/heads/"+GH.branch,{method:"PATCH",body:JSON.stringify({sha:commit.sha})});
      $("ghToken").value="";
      setMsg("Published ✓ — voicepack.js is on main ("+n+" voices). Live on every device in a minute.");
    }catch(e){ const m=String(e.message||e);
      setMsg("Publish failed: "+(/^401/.test(m)?"token not accepted":/^403/.test(m)?"token lacks Contents: write on this repo":/^404/.test(m)?"repo/branch not found for this token":m),1);
    } finally{ if(btn)btn.disabled=false; }
  }

  /* ================= WIRING ================= */
  function refreshAll(){ buildDash(); buildPhonGrid(); buildTalkGrid();
    const m=$("audStatus"); if(m&&!m.textContent)m.textContent=(typeof vpMsg==="function")?vpMsg():""; }
  window.refreshAudioStudio=refreshAll;   /* called from game.js once IndexedDB clips load */

  function wire(){
    document.querySelectorAll(".tabbtn").forEach(b=>b.onclick=()=>{
      document.querySelectorAll(".tabbtn").forEach(x=>x.classList.toggle("on",x===b));
      document.querySelectorAll(".tabpane").forEach(p=>p.classList.toggle("on",p.id===b.dataset.tab));
      if(b.dataset.tab==="tabAudio")refreshAll();
      if(b.dataset.tab==="tabProgress"&&window.renderProgress)window.renderProgress();
    });
    const on=(id,fn)=>{ const e=$(id); if(e)e.onclick=fn; };
    on("btnGuided",()=>{ const phs=phonemes(); let i=phs.findIndex(p=>!CUSTOM[p.id]); if(i<0)i=0; openRec(i); });
    on("recClose",closeRec); on("recBtn",toggleRec); on("recKeep",keepTake);
    on("recPlay",()=>{ const p=recList[recIx]; if(p)Aud.play(p.id); });
    on("recPrev",()=>{ if(recIx>0){recIx--;showKeep(false);lastTake=null;renderRec();} });
    on("recNext",()=>{ if(recIx<recList.length-1){recIx++;showKeep(false);lastTake=null;renderRec();} });
    on("btnElLoad",elLoad); on("btnElForget",elForget); on("btnGenAll",genAll);
    on("btnExportVP",exportVP); on("btnImportVP",()=>$("vpFile").click()); on("btnPublish",publish);
    const vf=$("vpFile"); if(vf)vf.onchange=()=>{ if(vf.files[0]){ importVP(vf.files[0]); vf.value=""; } };
    const ek=$("elKey"); if(ek&&elKey){ ek.value=elKey; const fg=$("btnElForget"); if(fg)fg.style.display="inline-block"; }
    const gear=$("btnGear"); if(gear)gear.addEventListener("click",()=>setTimeout(refreshAll,0));
  }
  if(document.readyState!=="loading")wire(); else document.addEventListener("DOMContentLoaded",wire);
})();
