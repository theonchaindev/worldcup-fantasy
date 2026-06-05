import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Cup Fantasy 2026",
  description: "Token-gated World Cup fantasy football. Pick your squad, earn points, compete for the prize pot.",
  openGraph: {
    title: "World Cup Fantasy 2026",
    description: "Token-gated fantasy football — WCF holders only.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" style={{ colorScheme: "dark" }}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
