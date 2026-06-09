"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/dashboard",   label: "Dashboard" },
  { href: "/team",        label: "My Team" },
  { href: "/transfers",   label: "Transfers" },
  { href: "/players",     label: "Players" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/leagues",     label: "Leagues" },
  { href: "/prizes",      label: "Prizes" },
];

export default function NavBar({ clubName }: { clubName?: string }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <nav
      style={{
        background:   "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position:     "sticky",
        top:          0,
        zIndex:       "var(--z-nav)",
      }}
    >
      <div className="wrap" style={{ height: 56, display: "flex", alignItems: "center", gap: "2rem" }}>
        {/* Logo */}
        <Link
          href="/dashboard"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStyle: "italic", fontSize: "var(--t-lg)", color: "var(--maroon)", textDecoration: "none", flexShrink: 0, lineHeight: 1 }}
        >
          WCF
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 0, flex: 1 }}>
          {navLinks.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  position:    "relative",
                  padding:     "0 0.75rem",
                  height:      56,
                  display:     "flex",
                  alignItems:  "center",
                  fontSize:    "var(--t-sm)",
                  fontWeight:  active ? 600 : 400,
                  color:       active ? "var(--maroon)" : "var(--muted)",
                  textDecoration: "none",
                  transition:  "color var(--t-fast)",
                  borderBottom: active ? "2px solid var(--maroon)" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right: club name + sign out */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "1rem", marginLeft: "auto", flexShrink: 0 }}>
          {clubName && (
            <span style={{
              fontSize:   "var(--t-xs)",
              fontWeight: 600,
              color:      "var(--maroon)",
              padding:    "0.25rem 0.75rem",
              background: "var(--maroon-tint)",
              border:     "1px solid rgba(123,28,46,0.18)",
              borderRadius: 4,
              maxWidth:   "16ch",
              overflow:   "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {clubName}
            </span>
          )}
          <button
            onClick={logout}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--t-sm)", color: "var(--subtle)", fontFamily: "var(--font-body)" }}
          >
            Sign out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--navy)", marginLeft: "auto", padding: "0.25rem" }}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <div className="wrap" style={{ padding: "0.75rem 1.25rem", display: "flex", flexDirection: "column", gap: 2 }}>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display:     "block",
                    padding:     "0.625rem 0.75rem",
                    fontSize:    "var(--t-sm)",
                    fontWeight:  pathname.startsWith(l.href) ? 600 : 400,
                    color:       pathname.startsWith(l.href) ? "var(--maroon)" : "var(--muted)",
                    background:  pathname.startsWith(l.href) ? "var(--maroon-tint)" : "transparent",
                    borderRadius: 4,
                    textDecoration: "none",
                  }}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={logout}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "var(--t-sm)", color: "var(--subtle)", fontFamily: "var(--font-body)", textAlign: "left", padding: "0.625rem 0.75rem", marginTop: 4 }}
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
