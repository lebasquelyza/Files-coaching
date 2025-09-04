
"use client";
import { useState } from "react";
export default function Page(){
  const [size,setSize]=useState("170"); const [weight,setWeight]=useState("70");
  const h=parseFloat(size)/100; const w=parseFloat(weight); const bmi=h>0&&w>0?(w/(h*h)):0; const r=Math.round(bmi*10)/10;
  const status=(v:number)=> !isFinite(v)||v<=0?"-": v<18.5? "Insuffisance pondérale" : v<25? "Corpulence normale" : v<30? "Surpoids":"Obésité";
  return (<div className="card max-w-xl space-y-4"><h2 className="text-xl font-semibold">Calculer mon IMC</h2>
    <div className="grid sm:grid-cols-2 gap-3"><div><label className="label">Taille (cm)</label><input className="input" type="number" value={size} onChange={e=>setSize(e.target.value)} /></div>
    <div><label className="label">Poids (kg)</label><input className="input" type="number" value={weight} onChange={e=>setWeight(e.target.value)} /></div></div>
    <div className="text-3xl font-bold">{isFinite(r)?r:"-"} <span className="text-base font-normal text-gray-600">IMC</span></div>
    <div className="text-sm text-gray-600">{status(r as any)}</div></div>);
}
