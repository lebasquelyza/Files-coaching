
import { signIn } from "@/lib/session";
export default function Page({ searchParams }: { searchParams?: { error?: string }}) {
  return (
    <main className="grid place-items-center min-h-screen px-4">
      <form action={signIn} className="card w-full max-w-sm space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Se connecter</h1>
          {searchParams?.error && <p className="text-red-600 text-sm">Email et mot de passe requis.</p>}
        </div>
        <div><label className="label">Adresse e-mail</label><input className="input" name="email" type="email" required /></div>
        <div><label className="label">Mot de passe</label><input className="input" name="password" type="password" required /></div>
        <button className="btn w-full">Connexion</button>
        <a className="link block text-center" href="/forgot-password">Mot de passe oublié ?</a>
      </form>
    </main>
  );
}
