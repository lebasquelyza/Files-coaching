
import { getSession, updateProfile } from "@/lib/session";
const plans = [
  { key:"BASIC", name:"Basic", price:"9,90 €", features:["Chatbot","Recettes générales","Suivi progrès","Motivation"] },
  { key:"PLUS", name:"Plus", price:"19,90 €", features:["Tout Basic","Recettes personnalisées","3 séances IA","-50% sur la 1ère visio"] },
  { key:"PREMIUM", name:"Premium", price:"39,90 €", features:["Tout Plus","Accès intégral au site","Correction vidéo exos","+ 1 visio offerte à l'achat"] },
] as const;
const options = [
  { name:"1 visio/mois avec coach", price:"+20 €" },
  { name:"1 séance réelle", price:"+40 €" },
  { name:"Pack 4 séances réelles/mois", price:"+140 €" },
  { name:"Pack 8 séances réelles/mois", price:"+240 €" },
];
export default function Page(){
  const s = getSession();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Tarifs</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(p=> (
          <form action={updateProfile} key={p.key} className={"card space-y-3 " + (s?.plan===p.key ? "ring-2 ring-[var(--brand)]" : "")}>
            <input type="hidden" name="plan" value={p.key} />
            <div className="text-xl font-semibold">{p.name}</div>
            <div className="text-3xl font-bold">{p.price}/mois</div>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">{p.features.map((f,i)=><li key={i}>{f}</li>)}</ul>
            <button className="btn w-full" type="submit">{s?.plan===p.key?"Plan actuel":"Choisir"}</button>
          </form>
        ))}
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Option Coaching+</h3>
        <ul className="grid sm:grid-cols-2 gap-2">{options.map((o,i)=>(<li key={i} className="border rounded-xl p-3 flex items-center justify-between"><span>{o.name}</span><b>{o.price}</b></li>))}</ul>
      </div>
    </div>
  );
}
