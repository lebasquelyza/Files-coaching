
import { getSession } from "@/lib/session";
const all = [
  { title: "Porridge protéiné", kcal: 420, plan: "BASIC" },
  { title: "Salade poulet avocat", kcal: 520, plan: "PLUS" },
  { title: "Bowl saumon & quinoa", kcal: 600, plan: "PREMIUM" },
] as const;
export default function Page() {
  const s = getSession();
  const rank = (p:string)=> p==="BASIC"?0:p==="PLUS"?1:2;
  const unlocked = all.filter(r=>rank(r.plan)<=rank(s?.plan||"BASIC"));
  const locked = all.filter(r=>!unlocked.includes(r));
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card"><h2 className="text-xl font-semibold mb-3">Recettes accessibles</h2>
        <div className="grid sm:grid-cols-2 gap-3">{unlocked.map((r,i)=>(<div key={i} className="border rounded-xl p-3"><div className="font-medium">{r.title}</div><div className="text-sm text-gray-600">{r.kcal} kcal</div></div>))}</div>
      </div>
      <div className="card"><h2 className="text-xl font-semibold mb-3">Plus avec l'abonnement</h2>
        <div className="grid sm:grid-cols-2 gap-3">{locked.map((r,i)=>(<div key={i} className="border rounded-xl p-3 opacity-60"><div className="font-medium">{r.title}</div><div className="text-sm text-gray-600">{r.kcal} kcal</div><a className="link text-sm" href="/dashboard/pricing">Passer au plan supérieur</a></div>))}</div>
      </div>
    </div>
  );
}
