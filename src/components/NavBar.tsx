"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Trophy, LogOut } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/team", label: "My Team" },
  { href: "/transfers", label: "Transfers" },
  { href: "/players", label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/leagues", label: "Mini Leagues" },
  { href: "/prizes", label: "Prizes" },
];

export default function NavBar({ clubName }: { clubName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: "rgba(5,13,26,0.95)", backdropFilter: "blur(12px)", borderColor: "rgba(240,180,41,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Trophy size={22} className="text-yellow-400" />
          <span className="font-bold text-lg" style={{ color: "#f0b429" }}>WC Fantasy <span className="text-white font-light">2026</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith(l.href)
                  ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {clubName && (
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full text-yellow-400" style={{ background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.2)" }}>
              {clubName}
            </span>
          )}
          <button onClick={logout} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm">
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile */}
        <button className="md:hidden text-slate-300" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1" style={{ background: "rgba(5,13,26,0.98)" }}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                pathname.startsWith(l.href) ? "bg-yellow-400/10 text-yellow-400" : "text-slate-300"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 text-slate-400 text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
