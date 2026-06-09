"use client";
import Link from "next/link";
import { getFlag } from "@/lib/flags";
import { motion } from "framer-motion";

interface Player { id: string; name: string; position: string; country: string; clubTeam: string; value: number; totalPoints: number; }
interface UserPlayer { slot: number; isSub: boolean; player: Player; }
interface Chip { chipType: string; usedAt: Date | null; gameweekNumber: number | null; }

const posClass: Record<string, string> = { GK: "pos-gk", DEF: "pos-def", MID: "pos-mid", FWD: "pos-fwd" };

const chipInfo: Record<string, string> = {
  wildcard: "Wildcard", triple_captain: "Triple Captain",
  bench_boost: "Bench Boost", free_hit: "Free Hit",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 },
});

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
    <div style={{ background: "var(--ground)", minHeight: "100vh" }}>

      {/* ── Signature score section ── */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div className="wrap" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>

          {/* Club / user info */}
          <motion.div {...fadeUp(0)} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <span style={{ fontSize: "1.1rem" }}>{getFlag(user.country)}</span>
              <p style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--subtle)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{user.username}</p>
            </div>
            <h1 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", lineHeight: 1.1, marginTop: "0.2rem" }}>{user.clubName}</h1>
          </motion.div>

          {/* Signature: total points bleeds right */}
          <motion.div {...fadeUp(0.08)} style={{ position: "relative" }}>
            <p style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--subtle)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Total points</p>
            <div className="score-bleed-wrap">
              <span className="score-bleed">{user.totalPoints}</span>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div {...fadeUp(0.14)} style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            {[
              { label: "Global rank", value: `#${stats.globalRank}` },
              { label: "Managers", value: stats.totalManagers.toLocaleString() },
              { label: "Squad value", value: `£${stats.totalValue.toFixed(1)}m` },
              gameweek && { label: "Gameweek", value: `GW${gameweek.number}` },
              deadline && { label: "Deadline", value: deadline.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) },
            ].filter((s): s is { label: string; value: string } => Boolean(s)).map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.15rem" }}>{s.label}</p>
                <p style={{ fontSize: "var(--t-lg)", fontWeight: 700, color: "var(--navy)", fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="wrap" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Squad */}
            <motion.div {...fadeUp(0.18)} className="card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.25rem 0" }}>
                <h2 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)" }}>My squad</h2>
                <Link href="/team" style={{ fontSize: "var(--t-sm)", color: "var(--maroon)", fontWeight: 600, textDecoration: "none" }}>
                  {team ? "Edit" : "Build squad →"}
                </Link>
              </div>

              {!team ? (
                <div style={{ padding: "3rem 1.25rem", textAlign: "center" }}>
                  <p style={{ color: "var(--muted)", fontSize: "var(--t-sm)", marginBottom: "1.25rem" }}>You haven&apos;t built your squad yet.</p>
                  <Link href="/team" className="btn btn-primary">Build your squad</Link>
                </div>
              ) : (
                <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
                    <span style={{ fontSize: "var(--t-xs)", fontWeight: 700, padding: "0.2rem 0.65rem", background: "var(--maroon-tint)", color: "var(--maroon)", borderRadius: 4, border: "1px solid rgba(123,28,46,0.2)" }}>{team.formation}</span>
                    {captainName && <span style={{ fontSize: "var(--t-xs)", color: "var(--muted)" }}>Captain: <strong style={{ color: "var(--navy)" }}>{captainName}</strong></span>}
                    <span style={{ fontSize: "var(--t-xs)", color: "var(--muted)", marginLeft: "auto" }}>£{stats.totalValue.toFixed(1)}m</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem" }}>
                    {team.players.filter(p => !p.isSub).map((p, i) => (
                      <motion.div key={p.slot} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.04 * i }}
                        style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.625rem", background: "var(--ground)", borderRadius: 4, border: "1px solid var(--border)" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", background: "var(--surface)", flexShrink: 0, border: "1px solid var(--border)", position: "relative" }}>
                          <img src={`/api/player-image/${p.player.id}`} alt={p.player.name} width={32} height={32} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                            onError={e => { const t = e.target as HTMLImageElement; t.style.display = "none"; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = "flex"; }} />
                          <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, fontFamily: "var(--font-display)" }}>
                            {p.player.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--navy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.player.name.split(" ").slice(-1)[0]}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <span className={`pos ${posClass[p.player.position]}`}>{p.player.position}</span>
                            {team.captainId === p.player.id && <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--maroon)" }}>C</span>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Chips */}
            <motion.div {...fadeUp(0.22)} className="card" style={{ padding: "1.25rem" }}>
              <h2 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)", marginBottom: "1rem" }}>Chips</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.625rem" }}>
                {["wildcard", "triple_captain", "bench_boost", "free_hit"].map(ct => {
                  const c = chips.find(x => x.chipType === ct);
                  const used = c?.usedAt != null;
                  return (
                    <div key={ct} style={{ padding: "0.875rem 1rem", borderRadius: 4, background: used ? "var(--ground)" : "var(--maroon-tint)", border: `1px solid ${used ? "var(--border)" : "rgba(123,28,46,0.2)"}`, opacity: used ? 0.45 : 1 }}>
                      <p style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: used ? "var(--subtle)" : "var(--maroon)" }}>{chipInfo[ct]}</p>
                      <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", marginTop: "0.15rem" }}>{used ? `Used GW${c?.gameweekNumber}` : "Available"}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Top scorers */}
            <motion.div {...fadeUp(0.2)} className="card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)" }}>Top players</h2>
              </div>
              {topScorers.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: i < topScorers.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", width: 16, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", background: "var(--ground)", flexShrink: 0, border: "1px solid var(--border)", position: "relative" }}>
                    <img src={`/api/player-image/${p.id}`} alt={p.name} width={34} height={34} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                      onError={e => { const t = e.target as HTMLImageElement; t.style.display = "none"; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = "flex"; }} />
                    <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, fontFamily: "var(--font-display)" }}>
                      {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--navy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ fontSize: "var(--t-xs)", color: "var(--muted)" }}>{getFlag(p.country)} {p.position}</p>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--t-md)", color: "var(--maroon)", fontVariantNumeric: "tabular-nums" }}>{p.totalPoints}</span>
                </div>
              ))}
              <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border)" }}>
                <Link href="/players" style={{ fontSize: "var(--t-xs)", color: "var(--maroon)", fontWeight: 600, textDecoration: "none" }}>All players →</Link>
              </div>
            </motion.div>

            {/* Quick links */}
            <motion.div {...fadeUp(0.26)} className="card" style={{ padding: "1.25rem" }}>
              <h2 style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Navigate</h2>
              {[
                { href: "/leaderboard", label: "Global Leaderboard" },
                { href: "/leagues",     label: "Mini Leagues" },
                { href: "/transfers",   label: "Transfers" },
                { href: "/prizes",      label: "Prize Pool" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: "block", padding: "0.5rem 0.5rem", fontSize: "var(--t-sm)", color: "var(--muted)", textDecoration: "none", borderRadius: 4, transition: "color var(--t-fast), background var(--t-fast)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--navy)"; e.currentTarget.style.background = "var(--ground)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}>
                  {l.label}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mobile grid override */}
        <style>{`@media (max-width: 900px) { .wrap > div[style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </div>
  );
}
