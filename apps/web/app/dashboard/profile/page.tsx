
import { getSession, updateProfile } from "@/lib/session";
export default function Page() {
  const s = getSession();
  return (
    <div className="card max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Mon profil</h2>
      <form action={updateProfile} className="space-y-4">
        <div><label className="label">Nom affiché</label><input name="name" className="input" defaultValue={s?.name||""} /></div>
        <div><label className="label">Photo (URL)</label><input name="image" className="input" defaultValue={s?.image||""} placeholder="https://…" /></div>
        <div><label className="label">Formule</label>
          <select name="plan" className="input" defaultValue={s?.plan||"BASIC"}>
            <option value="BASIC">Basic</option><option value="PLUS">Plus</option><option value="PREMIUM">Premium</option>
          </select>
        </div>
        <button className="btn">Enregistrer</button>
      </form>
    </div>
  );
}
