
export default function Page(){ return (
  <div className="grid gap-6 lg:grid-cols-2">
    <div className="card space-y-2">
      <h2 className="text-xl font-semibold">Connecte tes apps</h2>
      <ul className="space-y-2">
        <li className="border rounded-xl p-3 flex items-center justify-between"><div><b>Apple Santé</b><div className="text-sm text-gray-600">iOS (app native)</div></div><button className="btn-outline" disabled>Indisponible Web</button></li>
        <li className="border rounded-xl p-3 flex items-center justify-between"><div><b>Google Fit</b><div className="text-sm text-gray-600">OAuth — à brancher</div></div><button className="btn-outline">Connecter</button></li>
        <li className="border rounded-xl p-3 flex items-center justify-between"><div><b>Importer un CSV</b><div className="text-sm text-gray-600">Pas de compte requis</div></div><a className="btn-outline" href="#">Importer</a></li>
      </ul>
    </div>
    <div className="card"><h2 className="text-xl font-semibold">Confidentialité</h2><p className="text-sm text-gray-600">Nous ne partageons jamais vos données sans consentement.</p></div>
  </div>
);}
