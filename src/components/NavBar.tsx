"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/team", label: "My Team" },
  { href: "/transfers", label: "Transfers" },
  { href: "/players", label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/leagues", label: "Leagues" },
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
    <nav
      className="sticky top-0"
      style={{
        background: "var(--bg)",
        borderBottom: "1px solid var(--border-subtle)",
        zIndex: "var(--z-sticky)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center h-14 gap-6">
        {/* Logo */}
        <Link href="/dashboard" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-lg)", color: "var(--primary)", textDecoration: "none", flexShrink: 0, letterSpacing: "-0.01em" }}>
          WC Fantasy
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  position: "relative",
                  padding: "0.4rem 0.75rem",
                  fontSize: "var(--text-sm)",
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--ink)" : "var(--ink-2)",
                  textDecoration: "none",
                  borderRadius: "var(--r-md)",
                  transition: "color var(--t-fast)",
                  whiteSpace: "nowrap",
                }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "0.75rem",
                      right: "0.75rem",
                      height: 2,
                      background: "var(--primary)",
                      borderRadius: 1,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {clubName && (
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--ink-2)", background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--r-full)", padding: "0.25rem 0.75rem", maxWidth: "14ch", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {clubName}
            </span>
          )}
          <button
            onClick={logout}
            style={{ fontSize: "var(--text-sm)", color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0.5rem", transition: "color var(--t-fast)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-3)")}
          >
            Sign out
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", color: "var(--ink-2)", cursor: "pointer", padding: "0.25rem" }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid var(--border-subtle)", background: "var(--bg)" }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    padding: "0.65rem 0.75rem",
                    fontSize: "var(--text-sm)",
                    fontWeight: pathname.startsWith(l.href) ? 600 : 400,
                    color: pathname.startsWith(l.href) ? "var(--primary)" : "var(--ink-2)",
                    textDecoration: "none",
                    borderRadius: "var(--r-md)",
                    background: pathname.startsWith(l.href) ? "var(--primary-bg)" : "transparent",
                  }}
                >
                  {l.label}
                </Link>
              ))}
              <button onClick={logout} style={{ textAlign: "left", padding: "0.65rem 0.75rem", fontSize: "var(--text-sm)", color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer" }}>
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
