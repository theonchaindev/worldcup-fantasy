"use client";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronRight, Trophy } from "lucide-react";

const scoring = [
  ["Goal (FWD)", "+4"], ["Goal (MID)", "+5"], ["Goal (DEF/GK)", "+6"],
  ["Assist", "+3"], ["Clean sheet (GK/DEF)", "+4"],
  ["Penalty save", "+5"], ["Yellow card", "−1"], ["Red card", "−3"],
  ["Playing 90 min", "+2"], ["Captain", "×2"],
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--font-body)" }}>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="display text-amber" style={{ fontSize: "var(--text-lg)", letterSpacing: "-0.01em" }}>
            WC Fantasy
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost" style={{ padding: "0.4rem 1rem", fontSize: "var(--text-sm)" }}>Sign in</Link>
            <Link href="/register" className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "var(--text-sm)" }}>Enter now</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="chip chip-amber mb-5" style={{ display: "inline-flex" }}>
            <span className="live-dot" style={{ animation: "pulse 2s ease-in-out infinite" }} />
            World Cup 2026 — USA · Canada · Mexico
          </div>

          <h1 className="display" style={{ fontSize: "clamp(3.5rem, 10vw, 7.5rem)", color: "var(--ink)", marginBottom: "1.25rem", maxWidth: "14ch", textWrap: "balance" }}>
            World Cup<br />
            <span className="text-amber">Fantasy</span> 2026
          </h1>

          <p style={{ fontSize: "var(--text-md)", color: "var(--ink-2)", maxWidth: "52ch", lineHeight: 1.65, marginBottom: "2.5rem", textWrap: "pretty" }}>
            Token-gated World Cup fantasy football. Hold 500K WCF, pay 0.2 SOL, pick your squad from 400+ players and compete for the prize pool.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="btn-primary" style={{ fontSize: "var(--text-base)", padding: "0.75rem 2rem" }}>
              Enter now <ChevronRight size={16} />
            </Link>
            <Link href="/login" className="btn-ghost" style={{ fontSize: "var(--text-base)", padding: "0.75rem 2rem" }}>
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Horizontal stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-8 mt-14"
          style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "2rem" }}
        >
          {[
            { value: "400+", label: "Players" },
            { value: "48", label: "Nations" },
            { value: "£100m", label: "Budget" },
            { value: "0.2 SOL", label: "Entry fee" },
            { value: "500K WCF", label: "To qualify" },
          ].map((s) => (
            <div key={s.label}>
              <div className="display text-amber" style={{ fontSize: "var(--text-2xl)" }}>{s.value}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)", marginTop: "0.2rem", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "5rem 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2 className="display" style={{ fontSize: "var(--text-3xl)", marginBottom: "3rem", color: "var(--ink)" }}>
              Four steps to compete
            </h2>
          </FadeIn>

          <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", background: "var(--border-subtle)" }}>
            {[
              { title: "Hold 500K WCF", body: "Verify your Solana wallet holds 500,000 WCF tokens. We check the balance — no connection required." },
              { title: "Pay 0.2 SOL", body: "Send 0.2 SOL to our treasury wallet and paste the transaction signature. Funds the prize pool." },
              { title: "Build your squad", body: "Pick 15 players within a £100m budget across any of 7 formations. Set your captain and vice-captain." },
              { title: "Earn points", body: "Points from real World Cup matches. Lead the global leaderboard or win your mini league." },
            ].map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.07} className="p-8" style={{ background: "var(--bg)" }}>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-3)", fontWeight: 600, marginBottom: "1rem", letterSpacing: "0.06em" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, marginBottom: "0.65rem", color: "var(--ink)" }}>{step.title}</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", lineHeight: 1.6, maxWidth: "36ch" }}>{step.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORING ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "5rem 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-16" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <FadeIn>
              <h2 className="display" style={{ fontSize: "var(--text-3xl)", marginBottom: "1rem", color: "var(--ink)" }}>
                Scoring system
              </h2>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", lineHeight: 1.7, maxWidth: "42ch" }}>
                Points are awarded per World Cup match based on official statistics. Captain earns double points. Vice-captain earns 1.5x.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <div className="chip chip-amber">Wildcard</div>
                <div className="chip chip-amber">Triple Captain</div>
                <div className="chip chip-amber">Bench Boost</div>
                <div className="chip chip-amber">Free Hit</div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="card" style={{ overflow: "hidden" }}>
                {scoring.map(([action, pts], i) => (
                  <div
                    key={action}
                    className="flex items-center justify-between px-5 py-3"
                    style={{
                      borderBottom: i < scoring.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>{action}</span>
                    <span
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: 700,
                        color: pts.startsWith("−") ? "var(--danger)" : "var(--primary)",
                        fontFeatureSettings: '"tnum"',
                      }}
                    >
                      {pts}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "5rem 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="mb-10">
            <h2 className="display" style={{ fontSize: "var(--text-3xl)", color: "var(--ink)" }}>Built for serious play</h2>
          </FadeIn>

          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {[
              { title: "7 formations", body: "4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 3-4-3, 5-3-2, 5-4-1. Change before each gameweek deadline." },
              { title: "Mini leagues", body: "Create a private league with a 6-character code. Invite friends, track the standings, win bragging rights." },
              { title: "On-chain entry", body: "Token balance checked on Solana mainnet. Entry fee verified by transaction signature. No wallet connection required." },
              { title: "Prize pool", body: "50% to first place. Built from 0.2 SOL entry fees plus WCF token rewards distributed during the tournament." },
              { title: "Live points", body: "Points update as World Cup matches finish across all 48 nations competing in USA, Canada, and Mexico." },
              { title: "Transfer window", body: "Make squad changes before each gameweek deadline. Budget enforced — every swap counts." },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.06}>
                <div className="card p-6 h-full">
                  <h3 style={{ fontSize: "var(--text-md)", fontWeight: 700, marginBottom: "0.65rem", color: "var(--ink)" }}>{f.title}</h3>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", lineHeight: 1.65 }}>{f.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "6rem 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "var(--ink)", marginBottom: "1rem", maxWidth: "16ch", textWrap: "balance" }}>
                  The tournament starts <span className="text-amber">June 11.</span>
                </h2>
                <p style={{ fontSize: "var(--text-md)", color: "var(--ink-2)", maxWidth: "44ch" }}>
                  Entries open now. Prize pool grows with every manager who joins.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/register" className="btn-primary" style={{ fontSize: "var(--text-base)", padding: "0.85rem 2.5rem" }}>
                  Enter now <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "2rem 0" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <span className="display text-amber" style={{ fontSize: "var(--text-base)" }}>WC Fantasy 2026</span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--ink-3)" }}>Powered by Solana · WCF Token</span>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </main>
  );
}
