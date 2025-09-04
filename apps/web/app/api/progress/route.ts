
import { NextRequest, NextResponse } from "next/server";
let store: any[] = [];
export async function GET() { return NextResponse.json({ ok: true, items: store }); }
export async function POST(req: NextRequest) { const body = await req.json(); const snapshot = { ...body, createdAt: new Date().toISOString() }; store.unshift(snapshot); return NextResponse.json({ ok: true, saved: snapshot }); }
