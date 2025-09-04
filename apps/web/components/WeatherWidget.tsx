
"use client";
import { useEffect, useState } from "react";
export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!navigator.geolocation) { setError("Géolocalisation indisponible."); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const r = await fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        const j = await r.json();
        if (j.ok) setWeather(j.data); else setError("Clé OpenWeather manquante.");
      } catch { setError("Erreur météo."); }
    }, () => setError("Permission localisation refusée."));
  }, []);
  if (error) return <div className="card">{error}</div>;
  if (!weather) return <div className="card">Météo en cours…</div>;
  return (
    <div className="card">
      <div className="text-sm text-gray-500">Météo</div>
      <div className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</div>
      <div className="text-gray-600 capitalize">{weather.weather?.[0]?.description}</div>
      <div className="text-sm text-gray-500">Lieu: {weather.name}</div>
    </div>
  );
}
