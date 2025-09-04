
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const base = [
    "Gaine ton tronc et respire régulièrement.",
    "Allonge la nuque, épaules basses.",
    "Concentre-toi sur le muscle cible."
  ];
  const tips = [...base];
  const t = String(text||"").toLowerCase();
  if (t.includes("genou")) tips.unshift("Genoux alignés avec orteils, pas vers l'intérieur.");
  if (t.includes("dos")) tips.unshift("Buste fier, évite l'hypercambrure lombaire.");
  return NextResponse.json({ ok: true, tips });
}
