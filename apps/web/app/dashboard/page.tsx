
import WeatherWidget from "@/components/WeatherWidget";
const exercises = [
  { title: "Respiration 4-4-4", desc: "Inspirez 4s, bloquez 4s, expirez 4s (5 reps)", time: "3 min" },
  { title: "Squats lents", desc: "3 × 10 répétitions contrôlées", time: "6 min" },
  { title: "Planche", desc: "2 × 30 secondes", time: "2 min" },
];
const recipes = [
  { title: "Porridge protéiné", kcal: 420 },
  { title: "Salade poulet avocat", kcal: 520 },
  { title: "Bowl saumon & quinoa", kcal: 600 },
];
export default function Page() {
  return (
    <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
      <div className="space-y-4 col-span-2">
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Exercices simples</h2>
          <ul className="space-y-3">{exercises.map((e,i)=> (
            <li key={i} className="border rounded-xl p-3">
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-gray-600">{e.desc}</div>
              <div className="text-xs text-gray-500">{e.time}</div>
            </li>))}
          </ul>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-3">Recettes (aperçu)</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {recipes.map((r,i)=> (
              <div key={i} className="border rounded-xl p-3">
                <div className="font-medium">{r.title}</div>
                <div className="text-sm text-gray-600">{r.kcal} kcal</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <WeatherWidget />
        <div className="card">
          <h2 className="text-lg font-semibold">Motivation</h2>
          <p className="text-sm text-gray-600">Active tes notifications pour un boost 💪</p>
          <a className="btn mt-3 inline-block" href="/dashboard/notifications">Configurer</a>
        </div>
      </div>
    </div>
  );
}
