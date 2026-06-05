"use client";
import { motion } from "framer-motion";
import { getFlag } from "@/lib/flags";

interface User { id: string; username: string; clubName: string; country: string; totalPoints: number; }

export default function LeaderboardClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const myRank = users.findIndex(u => u.id === currentUserId) + 1;
  const me = users.find(u => u.id === currentUserId);
  const top3 = users.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", color: "var(--ink)", lineHeight: 1, marginBottom: "0.4rem" }}>Leaderboard</h1>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>{users.length} managers competing globally</p>
      </motion.div>

      {/* My rank — inline, not a hero card */}
      {me && myRank > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1.25rem", marginBottom: "1.5rem", background: "var(--primary-bg)", border: "1px solid oklch(0.76 0.146 65 / 0.3)", borderRadius: "var(--r-lg)" }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-2xl)", color: "var(--primary)", lineHeight: 1, minWidth: 48, fontFeatureSettings: '"tnum"' }}>#{myRank}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink)" }}>{me.clubName}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)" }}>{me.username} · {getFlag(me.country)}</div>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-xl)", color: "var(--primary)", fontFeatureSettings: '"tnum"' }}>{me.totalPoints} <span style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--ink-2)", fontFamily: "var(--font-body)" }}>pts</span></div>
        </motion.div>
      )}

      {/* Top 3 */}
      {top3.length >= 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem", marginBottom: "1.5rem" }}>
          {[top3[1], top3[0], top3[2]].map((u, colIdx) => {
            const realRank = colIdx === 0 ? 2 : colIdx === 1 ? 1 : 3;
            const medals = ["🥇", "🥈", "🥉"];
            const colors = ["oklch(0.76 0.146 65)", "oklch(0.55 0 0)", "oklch(0.58 0.10 50)"];
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * colIdx, duration: 0.35 }}
                className="card"
                style={{ padding: "1.25rem", textAlign: "center", transform: realRank === 1 ? "translateY(-6px)" : undefined, border: realRank === 1 ? "1px solid oklch(0.76 0.146 65 / 0.4)" : undefined }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{medals[realRank - 1]}</div>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.clubName}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-3)", marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.username}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-xl)", color: colors[realRank - 1], fontFeatureSettings: '"tnum"' }}>{u.totalPoints}</div>
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
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "var(--ink-3)" }}>No managers yet — be the first to build your squad.</td></tr>
            ) : users.map((u, i) => (
              <tr key={u.id} style={{ background: u.id === currentUserId ? "var(--primary-bg)" : undefined }}>
                <td style={{ color: i < 3 ? "var(--primary)" : "var(--ink-3)", fontWeight: i < 3 ? 700 : 400, fontFeatureSettings: '"tnum"' }}>
                  {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
                </td>
                <td style={{ fontWeight: u.id === currentUserId ? 700 : 500, color: u.id === currentUserId ? "var(--primary)" : "var(--ink)" }}>
                  {u.username}
                </td>
                <td style={{ color: "var(--ink-2)" }}>{u.clubName}</td>
                <td className="hidden sm:table-cell" style={{ color: "var(--ink-2)" }}>{getFlag(u.country)}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 800, color: i < 3 ? "var(--primary)" : "var(--ink)", fontFeatureSettings: '"tnum"' }}>
                  {u.totalPoints}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
