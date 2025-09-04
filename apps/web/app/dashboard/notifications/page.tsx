
"use client";
import { useEffect, useState } from "react";
export default function Page() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [mode, setMode] = useState<"files"|"custom">("files");
  const [message, setMessage] = useState("Lève-toi, respire, bouge 2 min 💪");
  const [interval, setIntervalMin] = useState(180);
  useEffect(()=>{ setPermission(Notification.permission); },[]);
  function askPermission(){ Notification.requestPermission().then(setPermission); }
  function schedule(){
    if(permission!=="granted") return;
    const picks = ["Rappelle-toi pourquoi tu as commencé 🔥","2 min de mouvement maintenant ✅","Hydrate-toi et étire tes hanches 💧","Respire 4-4-4 😌"];
    const text = mode==="files" ? picks[Math.floor(Math.random()*picks.length)] : message;
    new Notification("Motivation Files",{ body: text });
    const ms = Math.max(1, interval)*60*1000;
    window.setInterval(()=> new Notification("Motivation Files", { body: mode==="files"? picks[Math.floor(Math.random()*picks.length)] : message }), ms);
    alert("Notifications programmées tant que l'onglet reste ouvert.");
  }
  return (
    <div className="card max-w-2xl space-y-4">
      <h2 className="text-xl font-semibold">Notifications de motivation</h2>
      <div className="flex gap-3"><button className="btn-outline" onClick={askPermission}>Autoriser</button><span className="text-sm text-gray-600">Statut: {permission}</span></div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="label">Type</label><select className="input" value={mode} onChange={e=>setMode(e.target.value as any)}><option value="files">Notifications Files</option><option value="custom">Message perso</option></select></div>
        <div><label className="label">Intervalle (min)</label><input className="input" type="number" min={1} value={interval} onChange={e=>setIntervalMin(parseInt(e.target.value||"1"))} /></div>
      </div>
      {mode==="custom" && (<div><label className="label">Message</label><input className="input" value={message} onChange={e=>setMessage(e.target.value)} /></div>)}
      <button className="btn" onClick={schedule}>Activer</button>
    </div>
  );
}
