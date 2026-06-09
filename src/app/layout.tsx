import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Cup Fantasy 2026",
  description: "Token-gated World Cup 2026 fantasy football. Build your squad, earn points, compete for the prize pool.",
  openGraph: {
    title: "World Cup Fantasy 2026",
    description: "Hold 500K WCF · Pay 0.2 SOL · Pick your squad.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" style={{ colorScheme: "dark" }}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
