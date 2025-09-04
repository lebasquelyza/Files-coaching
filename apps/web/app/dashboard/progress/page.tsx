
"use client";
import { useEffect, useState } from "react";
export default function Page() {
  const [history, setHistory] = useState<any[]>([]);
  const [form, setForm] = useState({ objectif:"", poids:"", sommeil:"" });
  useEffect(()=>{refresh()},[]);
  async function refresh(){ const j = await (await fetch("/api/progress")).json(); setHistory(j.items||[]); }
  async function save(e:any){ e.preventDefault(); await fetch("/api/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}); setForm({objectif:"",poids:"",sommeil:""}); refresh(); }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card"><h2 className="text-xl font-semibold mb-3">Questionnaire (édition)</h2>
        <form onSubmit={save} className="space-y-3">
          <div><label className="label">Objectif</label><input className="input" value={form.objectif} onChange={e=>setForm(f=>({...f, objectif:e.target.value}))} /></div>
          <div><label className="label">Poids (kg)</label><input className="input" value={form.poids} onChange={e=>setForm(f=>({...f, poids:e.target.value}))} type="number" step="0.1" /></div>
          <div><label className="label">Sommeil (h)</label><input className="input" value={form.sommeil} onChange={e=>setForm(f=>({...f, sommeil:e.target.value}))} type="number" step="0.1" /></div>
          <button className="btn">Sauvegarder</button>
        </form>
        <p className="text-xs text-gray-500 mt-2">L'historique garde toutes les versions.</p>
      </div>
      <div className="card"><h2 className="text-xl font-semibold mb-3">Historique</h2>
        <ul className="space-y-3">{history.map((h,i)=>(
          <li key={i} className="border rounded-xl p-3">
            <div className="text-sm text-gray-500">{new Date(h.createdAt).toLocaleString()}</div>
            <div className="text-sm"><b>Objectif:</b> {h.objectif||"-"}</div>
            <div className="text-sm"><b>Poids:</b> {h.poids||"-"} kg</div>
            <div className="text-sm"><b>Sommeil:</b> {h.sommeil||"-"} h</div>
          </li>))}
        </ul>
      </div>
    </div>
  );
}
