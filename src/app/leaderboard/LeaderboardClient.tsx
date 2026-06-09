"use client";
import { motion } from "framer-motion";
import { getFlag } from "@/lib/flags";

interface User { id: string; username: string; clubName: string; country: string; totalPoints: number; }

export default function LeaderboardClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const myRank = users.findIndex(u => u.id === currentUserId) + 1;
  const me     = users.find(u => u.id === currentUserId);

  return (
    <div style={{ background: "var(--ground)", minHeight: "100vh" }}>
      {/* Header with rank signature */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div className="wrap" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
          <h1 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "0.25rem" }}>Leaderboard</h1>
          <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", marginBottom: "1.5rem" }}>{users.length} managers competing globally</p>

          {me && myRank > 0 && (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              <p style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--subtle)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Your rank</p>
              <div className="score-bleed-wrap">
                <span className="score-bleed">#{myRank}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginTop: "1rem" }}>
                <div>
                  <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>Club</p>
                  <p style={{ fontSize: "var(--t-lg)", fontWeight: 700, color: "var(--navy)" }}>{me.clubName}</p>
                </div>
                <div>
                  <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>Points</p>
                  <p className="display" style={{ fontSize: "var(--t-lg)", color: "var(--maroon)", fontVariantNumeric: "tabular-nums" }}>{me.totalPoints}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {/* Top 3 podium */}
        {users.length >= 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "2rem" }}>
            {[users[1], users[0], users[2]].map((u, colIdx) => {
              const rank   = colIdx === 0 ? 2 : colIdx === 1 ? 1 : 3;
              const medals = ["🥇", "🥈", "🥉"];
              const sizes  = ["var(--t-3xl)", "var(--t-4xl)", "var(--t-3xl)"];
              return (
                <motion.div key={u.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * colIdx, duration: 0.35 }}
                  className="card" style={{ padding: "1.5rem", textAlign: "center", borderTop: rank === 1 ? "3px solid var(--maroon)" : "3px solid transparent", transform: rank === 1 ? "translateY(-4px)" : undefined }}>
                  <p style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{medals[rank - 1]}</p>
                  <p className="display" style={{ fontSize: sizes[colIdx], color: "var(--maroon)", fontVariantNumeric: "tabular-nums" }}>{u.totalPoints}</p>
                  <p style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "var(--navy)", marginTop: "0.35rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.clubName}</p>
                  <p style={{ fontSize: "var(--t-xs)", color: "var(--muted)" }}>{u.username} {getFlag(u.country)}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card" style={{ overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 48 }}>#</th>
                <th>Manager</th>
                <th>Club</th>
                <th className="hidden sm:table-cell">Nation</th>
                <th style={{ textAlign: "right" }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "var(--subtle)" }}>No managers yet.</td></tr>
              ) : users.map((u, i) => (
                <tr key={u.id} style={{ background: u.id === currentUserId ? "var(--maroon-tint)" : undefined }}>
                  <td style={{ fontWeight: i < 3 ? 700 : 400, color: i < 3 ? "var(--maroon)" : "var(--subtle)", fontVariantNumeric: "tabular-nums" }}>
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                  </td>
                  <td style={{ fontWeight: u.id === currentUserId ? 700 : 500, color: u.id === currentUserId ? "var(--maroon)" : "var(--navy)" }}>
                    {u.username}
                  </td>
                  <td style={{ color: "var(--muted)" }}>{u.clubName}</td>
                  <td className="hidden sm:table-cell" style={{ color: "var(--muted)" }}>{getFlag(u.country)}</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--t-md)", color: i < 3 ? "var(--maroon)" : "var(--navy)", fontVariantNumeric: "tabular-nums" }}>
                    {u.totalPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
