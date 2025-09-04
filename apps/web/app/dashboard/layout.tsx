
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/session";
export default function Layout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  return (
    <div className="flex">
      <aside className="w-64 min-h-screen border-r border-gray-200 p-4 flex flex-col gap-2 bg-white">
        <a className="text-2xl font-bold mb-2 text-brand" href="/dashboard">Files</a>
        <Sidebar />
        <form action={"/api/signout"} method="post">
          <button className="btn-outline w-full" formAction="/api/signout">Se déconnecter</button>
        </form>
      </aside>
      <main className="flex-1 p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Bonjour {session?.name || "!"}</h1><p className="text-gray-600">Heureux de vous revoir 👋</p></div>
        </header>
        {children}
      </main>
    </div>
  );
}
