
import React from "react";
import Link from "next/link";

export default function WebShell({ sidebar, children }: { sidebar: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64 min-h-screen border-r border-gray-200 p-4 flex flex-col gap-2 bg-white">
        <Link href="/dashboard" className="text-2xl font-bold mb-2 text-brand">Files</Link>
        {sidebar}
      </aside>
      <main className="flex-1 p-6 space-y-6 bg-[var(--bg)]">{children}</main>
    </div>
  );
}
