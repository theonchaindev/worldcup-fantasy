"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Trophy, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50"
      style={{
        background: scrolled ? "rgba(5,13,26,0.97)" : "rgba(5,13,26,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(240,180,41,0.12)",
        transition: "background 0.3s",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 400 }}>
            <Trophy size={22} className="text-yellow-400" />
          </motion.div>
          <span className="font-black text-lg tracking-tight" style={{ color: "#f0b429" }}>
            WC Fantasy <span className="text-white font-light">2026</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: active ? "#f0b429" : "#94a3b8" }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.18)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {clubName && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.2)", color: "#f0b429" }}
            >
              {clubName}
            </motion.span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <LogOut size={15} /> Logout
          </motion.button>
        </div>

        <button className="md:hidden text-slate-300 p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: "rgba(5,13,26,0.99)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                      pathname.startsWith(l.href)
                        ? "text-yellow-400 bg-yellow-400/8"
                        : "text-slate-300"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 text-slate-400 text-sm">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
