
export default function Page(){
  return (<div className="card max-w-2xl space-y-3">
    <h2 className="text-xl font-semibold">Réglages</h2>
    <div className="flex items-center justify-between"><div><div className="font-medium">Thème</div><div className="text-sm text-gray-600">Couleurs partagées web & mobile</div></div><a className="btn-outline" href="https://github.com">Modifier variables</a></div>
    <div className="flex items-center justify-between"><div><div className="font-medium">Confidentialité</div><div className="text-sm text-gray-600">Gestion des données</div></div><a className="btn-outline" href="/dashboard/connect">Ouvrir</a></div>
  </div>);
}
