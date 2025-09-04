
export default function Page() {
  async function onSubmit(formData: FormData) { "use server"; console.log("reset for", formData.get("email")); }
  return (
    <main className="grid place-items-center min-h-screen px-4">
      <form action={onSubmit} className="card w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Mot de passe oublié</h1>
        <div><label className="label">Adresse e-mail</label><input className="input" name="email" type="email" required /></div>
        <button className="btn w-full">Envoyer le lien</button>
      </form>
    </main>
  );
}
