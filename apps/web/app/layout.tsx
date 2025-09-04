
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Files — Coaching",
  description: "App Files (web)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">\n<head>
  <meta name="theme-color" content="#16a34a" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
