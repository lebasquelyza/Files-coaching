
import { NextRequest, NextResponse } from "next/server";
const API = process.env.OPENWEATHER_API_KEY;
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat"); const lon = searchParams.get("lon");
  if (!lat || !lon || !API) return NextResponse.json({ ok: false });
  const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API}`);
  const data = await r.json();
  return NextResponse.json({ ok: true, data });
}
