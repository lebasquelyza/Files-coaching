
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const COOKIE = "files_session";
export type Session = { email: string; name: string; plan: "BASIC"|"PLUS"|"PREMIUM"; image?: string; };
export function getSession(): Session | null { const raw = cookies().get(COOKIE)?.value; if(!raw) return null; try { return JSON.parse(raw) } catch { return null } }
export async function signIn(formData: FormData) { "use server"; const email=String(formData.get("email")||""); const password=String(formData.get("password")||""); if(!email||!password) redirect("/sign-in?error=1"); cookies().set(COOKIE, JSON.stringify({email, name: email.split("@")[0], plan:"BASIC"}), { path:"/", httpOnly:true, sameSite:"lax" }); redirect("/dashboard"); }
export async function signOut() { "use server"; cookies().set(COOKIE, "", { path:"/", expires:new Date(0)}); redirect("/sign-in"); }
export async function updateProfile(formData: FormData) { "use server"; const s=getSession(); if(!s) redirect("/sign-in"); const name=String(formData.get("name")||s.name); const image=String(formData.get("image")||s.image||""); const plan=(String(formData.get("plan")||s.plan) as Session["plan"]); cookies().set(COOKIE, JSON.stringify({...s, name, image, plan}), { path:"/", httpOnly:true, sameSite:"lax" }); redirect("/dashboard/profile"); }
