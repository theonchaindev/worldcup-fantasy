"use client";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { getFlag } from "@/lib/flags";
import { fadeUp, stagger } from "@/lib/motion";

interface User { id: string; username: string; clubName: string; country: string; totalPoints: number; }

const podiumColors = ["#94a3b8", "#f0b429", "#cd7f32"];
const podiumIcons = ["🥈", "🥇", "🥉"];
const podiumOrder = [1, 0, 2]; // silver, gold, bronze

export default function LeaderboardClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const myRank = users.findIndex((u) => u.id === currentUserId) + 1;
  const me = users.find((u) => u.id === currentUserId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(240,180,41,0.12)" }}>
          <Trophy size={20} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Global Leaderboard</h1>
          <p className="text-slate-400 text-sm">{users.length} managers competing</p>
        </div>
      </motion.div>

      {/* My rank card */}
      {me && myRank > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="card-glass p-5 mb-6 flex items-center gap-4"
          style={{ border: "1px solid rgba(240,180,41,0.3)", background: "linear-gradient(135deg, rgba(240,180,41,0.06), rgba(13,31,60,0.9))" }}
        >
          <div className="text-2xl font-black px-3 py-1 rounded-lg" style={{ background: "rgba(240,180,41,0.12)", color: "#f0b429" }}>
            #{myRank}
          </div>
          <div className="flex-1">
            <div className="font-bold text-white">{me.clubName}</div>
            <div className="text-sm text-slate-400">{me.username} · {getFlag(me.country)} {me.country}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: "#f0b429" }}>{me.totalPoints}</div>
            <div className="text-xs text-slate-500">points</div>
          </div>
        </motion.div>
      )}

      {/* Top 3 podium */}
      {users.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {podiumOrder.map((userIdx, colIdx) => {
            const u = users[userIdx];
            if (!u) return <div key={colIdx} />;
            const rank = userIdx + 1;
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + colIdx * 0.08, type: "spring", stiffness: 180, damping: 20 }}
                whileHover={{ y: -4 }}
                className="card-glass p-5 text-center"
                style={{
                  border: `1px solid ${podiumColors[userIdx]}30`,
                  background: `linear-gradient(160deg, ${podiumColors[userIdx]}08, transparent)`,
                  transform: rank === 1 ? "translateY(-8px)" : undefined,
                }}
              >
                <div className="text-3xl mb-2">{podiumIcons[colIdx]}</div>
                <div className="font-black text-white text-sm truncate">{u.clubName}</div>
                <div className="text-xs text-slate-400 mb-3 truncate">{u.username}</div>
                <div className="text-2xl font-black" style={{ color: podiumColors[userIdx] }}>{u.totalPoints}</div>
                <div className="text-xs text-slate-500">pts</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <motion.div
        variants={stagger(0.025)}
        initial="hidden"
        animate="show"
        className="card-glass overflow-hidden"
      >
        <div className="flex items-center gap-4 px-5 py-3 text-xs text-slate-500 font-medium" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="w-10">Rank</span>
          <span className="flex-1">Manager</span>
          <span className="hidden sm:block w-32">Club</span>
          <span className="hidden sm:block w-24">Nation</span>
          <span className="w-14 text-right">Points</span>
        </div>

        {users.length === 0 ? (
          <div className="px-5 py-14 text-center text-slate-500">
            No managers yet — be the first to build your squad!
          </div>
        ) : (
          users.map((u, i) => (
            <motion.div
              key={u.id}
              variants={fadeUp}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              className="flex items-center gap-4 px-5 py-3.5 transition-colors"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                background: u.id === currentUserId ? "rgba(240,180,41,0.04)" : undefined,
              }}
            >
              <div className="w-10 flex-shrink-0">
                {i < 3 ? (
                  <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span>
                ) : (
                  <span className="text-slate-500 text-sm">#{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`font-semibold text-sm ${u.id === currentUserId ? "text-yellow-400" : "text-white"}`}>
                  {u.username} {u.id === currentUserId && <span className="text-xs text-yellow-400/60">(you)</span>}
                </span>
              </div>
              <div className="hidden sm:block w-32 text-sm text-slate-400 truncate">{u.clubName}</div>
              <div className="hidden sm:block w-24 text-sm text-slate-500">{getFlag(u.country)}</div>
              <div className="w-14 text-right font-black text-sm" style={{ color: i < 3 ? podiumColors[i] : "#f0b429" }}>
                {u.totalPoints}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
