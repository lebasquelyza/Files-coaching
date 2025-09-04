
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [
  { href: "/dashboard", label: "Accueil" },
  { href: "/dashboard/profile", label: "Mon profil" },
  { href: "/dashboard/progress", label: "Mes progrès" },
  { href: "/dashboard/corrector", label: "Files te corrige" },
  { href: "/dashboard/recipes", label: "Recettes" },
  { href: "/dashboard/notifications", label: "Notifications" },
  { href: "/dashboard/connect", label: "Connecte tes données" },
  { href: "/dashboard/pricing", label: "Tarifs" },
  { href: "/dashboard/bmi", label: "IMC" },
  { href: "/dashboard/music", label: "Musique" },
  { href: "/dashboard/settings", label: "Réglages" },
];
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1">
      {items.map(i => (
        <Link key={i.href} href={i.href} className={"block px-3 py-2 rounded-xl " + (pathname === i.href ? "bg-[var(--brand-100)]" : "hover:bg-gray-100")}>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
