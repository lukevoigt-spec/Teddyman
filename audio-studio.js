/* =========================================================
   IN-APP AUDIO STUDIO  (Grown-Up Corner ▸ Audio tab)
   Record or ElevenLabs-generate the game's voices from inside the app.
   Clips save to this device (IndexedDB via VStore/CUSTOM in game.js) and
   play immediately; Export writes a voicepack.js to make them permanent.
   Reads the game's own LINES manifest, so new lines appear here automatically.
   Relies on globals from game.js: $, LINES, CUSTOM, VStore, Aud, vpMsg.
========================================================= */
(function(){
  const ROLES=[["A","Mentor / Narrator"],["B","Amelia (Heartguard)"],["C","Vex / robots"],
    ["T","Archie (Tank)"],["F","Ellie (Flip)"],["W","William (Sunny)"]];
  let elKey="", audFilter="sounds";
  let mediaRec=null, recId=null, recChunks=[];

  const esc=s=>(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  function setMsg(txt,bad){ const m=$("audStatus"); if(m){ m.textContent=txt; m.style.color=bad?"#ff9d8f":"#9b94c9"; } }
  function clipState(id){ return CUSTOM[id] ? "mine"
    : ((typeof VOICEPACK!=="undefined" && VOICEPACK[id]) ? "ship" : "tts"); }
  function blobToDataURI(b){ return new Promise((res,rej)=>{ const fr=new FileReader();
    fr.onload=()=>res(fr.result); fr.onerror=rej; fr.readAsDataURL(b); }); }

  /* ---- build the line list ---- */
  function build(){ const list=$("audList"); if(!list)return;
    const ids=Object.keys(LINES).filter(id=> audFilter==="sounds" ? LINES[id].rec : true);
    list.innerHTML="";
    ids.forEach(id=>{ const L=LINES[id], st=clipState(id);
      const row=document.createElement("div"); row.className="audline"+(L.rec?" rec":"");
      const stLbl={mine:"yours ✓",ship:"shipped",tts:"robot voice"}[st];
      row.innerHTML=
        `<div class="meta"><div class="lid">${esc(id)}${L.rec?" 🎤":""}</div>`+
        `<div class="ltx">${esc(L.t)}</div></div>`+
        `<span class="st s-${st}">${stLbl}</span>`;
      const mk=(txt,cls,fn,dis)=>{ const b=document.createElement("button");
        b.textContent=txt; if(cls)b.className=cls; if(dis)b.disabled=true; b.onclick=()=>fn(b); return b; };
      row.appendChild(mk("▶","",()=>Aud.play(id),!(CUSTOM[id]||(typeof VOICEPACK!=="undefined"&&VOICEPACK[id])||L.t)));
      if(!L.rec) row.appendChild(mk("Gen","",b=>genOne(id,b)));
      if(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        row.appendChild(mk(recId===id?"⏹":"🎤","rec2"+(recId===id?" live":""),b=>toggleRec(id,b)));
      row.appendChild(mk("📁","",()=>pickFile(id)));
      list.appendChild(row);
    });
  }
  /* refresh hook called from game.js once IndexedDB clips load */
  window.refreshAudioStudio=function(){ const m=$("audStatus"); if(m)m.textContent=vpMsg(); build(); };

  /* ---- per-line file upload ---- */
  let fileTarget=null;
  function pickFile(id){ fileTarget=id; let inp=$("audUpOne");
    if(!inp){ inp=document.createElement("input"); inp.type="file"; inp.accept="audio/*"; inp.id="audUpOne";
      inp.style.display="none"; document.body.appendChild(inp);
      inp.onchange=async()=>{ if(!fileTarget||!inp.files[0])return;
        await saveClip(fileTarget, await blobToDataURI(inp.files[0])); inp.value="";
        setMsg("Saved your recording for "+fileTarget+" to this iPad."); }; }
    inp.click();
  }
  async function saveClip(id,uri){ CUSTOM[id]=uri; await VStore.put(id,uri); build(); }

  /* ---- in-app microphone recording ---- */
  async function toggleRec(id,btn){
    if(mediaRec && mediaRec.state==="recording"){ mediaRec.stop(); return; }
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      recChunks=[]; recId=id;
      const mime = MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4"
        : (MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "");
      mediaRec=new MediaRecorder(stream, mime?{mimeType:mime}:undefined);
      mediaRec.ondataavailable=e=>{ if(e.data&&e.data.size)recChunks.push(e.data); };
      mediaRec.onstop=async()=>{ stream.getTracks().forEach(t=>t.stop());
        const blob=new Blob(recChunks,{type:mediaRec.mimeType||mime||"audio/mp4"});
        recId=null; mediaRec=null;
        await saveClip(id, await blobToDataURI(blob));
        setMsg("Recorded "+id+" ✓ — tap ▶ to hear it. It's live in the game now."); };
      mediaRec.start(); recId=id;
      if(btn){ btn.textContent="⏹"; btn.classList.add("live"); }
      setMsg("Recording "+id+"… tap ⏹ to stop.");
    }catch(e){ recId=null; mediaRec=null;
      setMsg("Microphone unavailable ("+(e.message||e.name)+"). Use 📁 to upload a voice memo instead.",1); }
  }

  /* ---- ElevenLabs ---- */
  function buildVoiceSelects(voices){ const wrap=$("elVoices"); if(!wrap)return;
    wrap.style.display="flex"; wrap.innerHTML="";
    ROLES.forEach(([k,lbl])=>{ const d=document.createElement("div"); d.style.flex="1"; d.style.minWidth="150px";
      const opts=voices.map(v=>`<option value="${esc(v.voice_id)}">${esc(v.name)}</option>`).join("");
      d.innerHTML=`<label>Voice ${k} — ${lbl}</label><select id="v_${k}">${opts}</select>`;
      wrap.appendChild(d); });
  }
  async function elLoad(){ elKey=($("elKey").value||"").trim();
    if(!elKey){ setMsg("Enter your ElevenLabs API key first.",1); return; }
    setMsg("Contacting ElevenLabs…");
    try{ const r=await fetch("https://api.elevenlabs.io/v1/voices",{headers:{"xi-api-key":elKey}});
      if(!r.ok)throw new Error("HTTP "+r.status); const d=await r.json();
      buildVoiceSelects(d.voices||[]);
      setMsg("Loaded "+(d.voices||[]).length+" voices — pick one per role, then Generate.");
    }catch(e){ setMsg("Could not load voices: "+(e.message||e)+" — check the key and connection.",1); }
  }
  async function genOne(id){ const L=LINES[id];
    if(L.rec){ setMsg("That's a letter sound — record it with 🎤 (TTS can't make a pure phoneme).",1); return false; }
    if(!elKey){ setMsg("Enter your API key and Load voices first.",1); return false; }
    const sel=$("v_"+(L.v||"A")); const voiceId=sel&&sel.value;
    if(!voiceId){ setMsg("Load voices first.",1); return false; }
    setMsg("Generating "+id+"…");
    try{ const r=await fetch("https://api.elevenlabs.io/v1/text-to-speech/"+voiceId,{ method:"POST",
        headers:{"xi-api-key":elKey,"Content-Type":"application/json"},
        body:JSON.stringify({text:L.t,model_id:"eleven_multilingual_v2",
          voice_settings:{stability:.55,similarity_boost:.8,style:.35}}) });
      if(!r.ok)throw new Error("HTTP "+r.status);
      await saveClip(id, await blobToDataURI(await r.blob()));
      setMsg("Generated "+id+" ✓"); return true;
    }catch(e){ setMsg("Generate failed for "+id+": "+(e.message||e),1); return false; }
  }
  async function genAll(){
    if(!elKey){ setMsg("Enter your API key and Load voices first.",1); return; }
    const todo=Object.keys(LINES).filter(id=>!LINES[id].rec && !CUSTOM[id]);
    if(!todo.length){ setMsg("All spoken lines already have a clip. (Letter sounds are record-only 🎤.)"); return; }
    const btn=$("btnGenAll"); btn.disabled=true;
    let ok=0; for(let i=0;i<todo.length;i++){ setMsg("Generating "+(i+1)+" / "+todo.length+"…");
      if(await genOne(todo[i]))ok++; await new Promise(r=>setTimeout(r,350)); }
    btn.disabled=false; build();
    setMsg("Generated "+ok+" / "+todo.length+" spoken lines. Record the "+
      Object.keys(LINES).filter(id=>LINES[id].rec).length+" letter sounds 🎤, then Export.");
  }

  /* ---- export / import voicepack.js ---- */
  function exportVP(){ const merged=Object.assign({}, (typeof VOICEPACK!=="undefined"?VOICEPACK:{}), CUSTOM);
    const n=Object.keys(merged).length;
    if(!n){ setMsg("Nothing to export yet — record or generate some lines first.",1); return; }
    const blob=new Blob(["window.VOICEPACK="+JSON.stringify(merged)+";"],{type:"text/javascript"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="voicepack.js"; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    setMsg("Exported voicepack.js ("+n+" lines). Commit it next to index.html to share across every device.");
  }
  function importVP(file){ const fr=new FileReader();
    fr.onload=async()=>{ try{
        const t=String(fr.result).trim().replace(/^\s*window\.VOICEPACK\s*=\s*/,"").replace(/;?\s*$/,"");
        const obj=JSON.parse(t); const ids=Object.keys(obj);
        if(!ids.length)throw new Error("no clips found");
        for(const id of ids){ CUSTOM[id]=obj[id]; await VStore.put(id,obj[id]); }
        build(); setMsg("Imported "+ids.length+" clips onto this iPad.");
      }catch(e){ setMsg("Couldn't read that voicepack.js: "+(e.message||e),1); } };
    fr.readAsText(file);
  }

  /* ---- publish voicepack.js straight to the repo's main branch ----
     Uses a GitHub fine-grained token (Contents: write), entered per use and
     never stored, via the Git Data API (handles multi-MB voicepacks). */
  const GH={ owner:"lukevoigt-spec", repo:"Teddyman", branch:"main" };
  async function ghApi(token,path,opts){
    const r=await fetch("https://api.github.com/repos/"+GH.owner+"/"+GH.repo+path,
      Object.assign({headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json","Content-Type":"application/json"}},opts||{}));
    if(!r.ok){ let d=""; try{d=(await r.json()).message||"";}catch(e){}
      throw new Error(r.status+(d?" "+d:"")); }
    return r.json();
  }
  async function publish(){
    const token=($("ghToken").value||"").trim();
    if(!token){ setMsg("Paste a GitHub fine-grained token (Contents: write) first.",1); return; }
    const merged=Object.assign({}, (typeof VOICEPACK!=="undefined"?VOICEPACK:{}), CUSTOM);
    const n=Object.keys(merged).length;
    if(!n){ setMsg("Nothing to publish yet — record or generate some lines first.",1); return; }
    const content="window.VOICEPACK="+JSON.stringify(merged)+";";
    const btn=$("btnPublish"); if(btn)btn.disabled=true;
    try{
      setMsg("Publishing "+n+" lines to GitHub…");
      const ref=await ghApi(token,"/git/ref/heads/"+GH.branch);
      const head=ref.object.sha;
      const headCommit=await ghApi(token,"/git/commits/"+head);
      const blob=await ghApi(token,"/git/blobs",{method:"POST",body:JSON.stringify({content:content,encoding:"utf-8"})});
      const tree=await ghApi(token,"/git/trees",{method:"POST",body:JSON.stringify({base_tree:headCommit.tree.sha,tree:[{path:"voicepack.js",mode:"100644",type:"blob",sha:blob.sha}]})});
      const commit=await ghApi(token,"/git/commits",{method:"POST",body:JSON.stringify({message:"Update voicepack.js from in-app studio ("+n+" lines)",tree:tree.sha,parents:[head]})});
      await ghApi(token,"/git/refs/heads/"+GH.branch,{method:"PATCH",body:JSON.stringify({sha:commit.sha})});
      $("ghToken").value="";
      setMsg("Published ✓ — voicepack.js is on main ("+n+" lines). Live on every device in a minute.");
    }catch(e){ const m=String(e.message||e);
      setMsg("Publish failed: "+(/^401/.test(m)?"token not accepted":/^403/.test(m)?"token lacks Contents: write on this repo":/^404/.test(m)?"repo/branch not found for this token":m),1);
    } finally{ if(btn)btn.disabled=false; }
  }

  /* ---- wiring ---- */
  function wire(){
    document.querySelectorAll(".tabbtn").forEach(b=>b.onclick=()=>{
      document.querySelectorAll(".tabbtn").forEach(x=>x.classList.toggle("on",x===b));
      document.querySelectorAll(".tabpane").forEach(p=>p.classList.toggle("on",p.id===b.dataset.tab));
      if(b.dataset.tab==="tabAudio")window.refreshAudioStudio();
    });
    document.querySelectorAll(".chipbtn").forEach(b=>b.onclick=()=>{ audFilter=b.dataset.filter;
      document.querySelectorAll(".chipbtn").forEach(x=>x.classList.toggle("on",x===b)); build(); });
    const on=(id,fn)=>{ const e=$(id); if(e)e.onclick=fn; };
    on("btnElLoad",elLoad); on("btnGenAll",genAll); on("btnExportVP",exportVP);
    on("btnImportVP",()=>$("vpFile").click());
    on("btnPublish",publish);
    const vf=$("vpFile"); if(vf)vf.onchange=()=>{ if(vf.files[0]){ importVP(vf.files[0]); vf.value=""; } };
    const gear=$("btnGear"); if(gear)gear.addEventListener("click",()=>setTimeout(window.refreshAudioStudio,0));
  }
  if(document.readyState!=="loading")wire(); else document.addEventListener("DOMContentLoaded",wire);
})();
