"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { getFlag } from "@/lib/flags";

interface Player { id: string; name: string; position: string; country: string; clubTeam: string; value: number; totalPoints: number; }
interface UserPlayer { slot: number; isSub: boolean; player: Player; }
interface Chip { chipType: string; usedAt: Date | null; gameweekNumber: number | null; }

const posColor: Record<string, string> = {
  GK: "oklch(0.72 0.15 75)", DEF: "oklch(0.62 0.17 145)", MID: "oklch(0.60 0.17 230)", FWD: "oklch(0.60 0.21 25)"
};

const posClass: Record<string, string> = { GK: "pos-gk", DEF: "pos-def", MID: "pos-mid", FWD: "pos-fwd" };

const chipInfo: Record<string, { label: string }> = {
  wildcard: { label: "Wildcard" }, triple_captain: { label: "Triple Captain" },
  bench_boost: { label: "Bench Boost" }, free_hit: { label: "Free Hit" },
};

function stagger(i: number) {
  return { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.35 } };
}

export default function DashboardClient({ user, stats, team, captainName, topScorers, chips, gameweek }: {
  user: { id: string; username: string; clubName: string; country: string; totalPoints: number };
  stats: { globalRank: number; totalManagers: number; totalValue: number };
  team: { formation: string; captainId: string | null; players: UserPlayer[] } | null;
  captainName: string | null;
  topScorers: Player[];
  chips: Chip[];
  gameweek: { number: number; name: string; deadline: string } | null;
}) {
  const deadline = gameweek?.deadline ? new Date(gameweek.deadline) : null;

  return (
    <div className="max-w-7xl mx-auto px-4" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

      {/* Page header */}
      <motion.div {...stagger(0)} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.625rem" }}>
          <span style={{ fontSize: "1.25rem" }}>{getFlag(user.country)}</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", color: "var(--ink)", lineHeight: 1 }}>{user.clubName}</h1>
        </div>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", marginTop: "0.35rem" }}>{user.username}</p>
      </motion.div>

      {/* Stats strip — not hero metrics */}
      <motion.div
        {...stagger(1)}
        style={{ display: "flex", flexWrap: "wrap", gap: "2rem", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", paddingTop: "1rem", paddingBottom: "1rem", marginBottom: "2rem" }}
      >
        {[
          { value: user.totalPoints, label: "Points", amber: true },
          { value: `#${stats.globalRank}`, label: "Global rank" },
          { value: stats.totalManagers.toLocaleString(), label: "Managers" },
          { value: `£${stats.totalValue.toFixed(1)}m`, label: "Squad value" },
        ].map((s, i) => (
          <div key={s.label} style={{ minWidth: 80 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", color: s.amber ? "var(--primary)" : "var(--ink)", lineHeight: 1, fontFeatureSettings: '"tnum"' }}>{s.value}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)", marginTop: "0.2rem", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
        {gameweek && (
          <div style={{ marginLeft: "auto" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", color: "var(--ink)", lineHeight: 1 }}>GW{gameweek.number}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)", marginTop: "0.2rem", fontWeight: 500 }}>
              {deadline ? `Deadline ${deadline.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : gameweek.name}
            </div>
          </div>
        )}
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }} className="lg:grid-cols-[2fr_1fr]" >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Squad */}
          <motion.div {...stagger(2)} className="card" style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.25rem 0" }}>
              <h2 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)" }}>My Squad</h2>
              <Link href="/team" style={{ fontSize: "var(--text-sm)", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
                {team ? "Edit" : "Build squad →"}
              </Link>
            </div>

            {!team ? (
              <div style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", marginBottom: "1.25rem" }}>You haven&apos;t built your squad yet.</p>
                <Link href="/team" className="btn-primary">Build your squad</Link>
              </div>
            ) : (
              <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-base)", color: "var(--ink)" }}>{team.formation}</span>
                  {captainName && <span style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)" }}>· Captain: <strong style={{ color: "var(--primary)" }}>{captainName}</strong></span>}
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--ink-3)" }}>£{stats.totalValue.toFixed(1)}m</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
                  {team.players.filter(p => !p.isSub).map((p, i) => (
                    <motion.div key={p.slot} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}
                      style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.625rem", background: "var(--surface-high)", borderRadius: "var(--r-md)", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", background: "var(--surface)", flexShrink: 0, position: "relative" }}>
                        <img src={`/api/player-image/${p.player.id}`} alt={p.player.name} width={32} height={32} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                          onError={e => { const t = e.target as HTMLImageElement; t.style.display = "none"; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = "flex"; }} />
                        <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: posColor[p.player.position], fontFamily: "var(--font-display)" }}>
                          {p.player.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.player.name.split(" ").slice(-1)[0]}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <span className={`pos-badge ${posClass[p.player.position]}`}>{p.player.position}</span>
                          {team.captainId === p.player.id && <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--primary)" }}>C</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Chips */}
          <motion.div {...stagger(3)} className="card" style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)", marginBottom: "1rem" }}>Chips</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.625rem" }}>
              {["wildcard", "triple_captain", "bench_boost", "free_hit"].map((ct) => {
                const c = chips.find(x => x.chipType === ct);
                const used = c?.usedAt != null;
                return (
                  <div key={ct} style={{ padding: "0.75rem 1rem", borderRadius: "var(--r-md)", background: used ? "var(--surface-high)" : "var(--primary-bg)", border: `1px solid ${used ? "var(--border-subtle)" : "oklch(0.76 0.146 65 / 0.25)"}`, opacity: used ? 0.45 : 1 }}>
                    <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: used ? "var(--ink-3)" : "var(--primary)" }}>{chipInfo[ct].label}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-3)", marginTop: "0.2rem" }}>{used ? `Used GW${c?.gameweekNumber}` : "Available"}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Top players */}
          <motion.div {...stagger(2)} className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.25rem 0", marginBottom: "0.5rem" }}>
              <h2 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)" }}>Top players</h2>
            </div>
            {topScorers.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderTop: i > 0 ? "1px solid var(--border-subtle)" : "none" }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--ink-3)", width: 16, textAlign: "center", fontFeatureSettings: '"tnum"' }}>{i + 1}</span>
                <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", background: "var(--surface-high)", flexShrink: 0, position: "relative" }}>
                  <img src={`/api/player-image/${p.id}`} alt={p.name} width={34} height={34} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    onError={e => { const t = e.target as HTMLImageElement; t.style.display = "none"; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = "flex"; }} />
                  <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: posColor[p.position], fontFamily: "var(--font-display)" }}>
                    {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)" }}>{getFlag(p.country)} {p.position}</div>
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-base)", color: "var(--primary)", fontFeatureSettings: '"tnum"' }}>{p.totalPoints}</span>
              </div>
            ))}
            <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border-subtle)" }}>
              <Link href="/players" style={{ fontSize: "var(--text-xs)", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>All players →</Link>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div {...stagger(3)} className="card" style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.75rem" }}>Go to</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {[
                { href: "/leaderboard", label: "Global Leaderboard" },
                { href: "/leagues", label: "Mini Leagues" },
                { href: "/transfers", label: "Transfers" },
                { href: "/prizes", label: "Prize Pool" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: "block", padding: "0.5rem 0.625rem", fontSize: "var(--text-sm)", color: "var(--ink-2)", textDecoration: "none", borderRadius: "var(--r-md)", transition: "color var(--t-fast), background var(--t-fast)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.background = "var(--surface-high)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--ink-2)"; e.currentTarget.style.background = "transparent"; }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`.lg\\:grid-cols-\\[2fr_1fr\\] { @media (min-width: 1024px) { grid-template-columns: 2fr 1fr; } }`}</style>
    </div>
  );
}
