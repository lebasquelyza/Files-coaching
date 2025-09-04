
"use client";
import { useEffect, useRef, useState } from "react";
export default function Page(){
  const [link,setLink]=useState("https://open.spotify.com/playlist/37i9dQZF1DX70RN3TfWWJh");
  const [time,setTime]=useState(0); const [running,setRunning]=useState(false); const ref=useRef<number|null>(null);
  useEffect(()=>{ if(running){ ref.current = window.setInterval(()=>setTime(t=>t+1),1000) as any; } else if(ref.current){ window.clearInterval(ref.current); ref.current=null; } return ()=>{ if(ref.current) window.clearInterval(ref.current); }; },[running]);
  const reset=()=>setTime(0); const mins=String(Math.floor(time/60)).padStart(2,"0"); const secs=String(time%60).padStart(2,"0");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">Musique</h2>
        <label className="label">Lien Spotify</label>
        <input className="input" value={link} onChange={e=>setLink(e.target.value)} />
        <div className="aspect-video rounded-xl overflow-hidden">
          <iframe src={link.replace("open.spotify.com","open.spotify.com/embed")} width="100%" height="100%" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
      </div>
      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">Chronomètre</h2>
        <div className="text-5xl font-bold tabular-nums">{mins}:{secs}</div>
        <div className="flex gap-2"><button className="btn" onClick={()=>setRunning(r=>!r)}>{running?"Pause":"Démarrer"}</button><button className="btn-outline" onClick={reset}>Réinitialiser</button></div>
      </div>
    </div>
  );
}
