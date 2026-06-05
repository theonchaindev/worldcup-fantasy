"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, TrendingUp, Users, Clock, Star, Zap, ChevronRight, ArrowRight } from "lucide-react";
import { getFlag } from "@/lib/flags";
import { fadeUp, stagger } from "@/lib/motion";

interface Player { id: string; name: string; position: string; country: string; clubTeam: string; value: number; totalPoints: number; sofifaId?: string | null; }
interface UserPlayer { slot: number; isSub: boolean; player: Player; }
interface Chip { chipType: string; usedAt: Date | null; gameweekNumber: number | null; }

const chipLabels: Record<string, { label: string; icon: string }> = {
  wildcard: { label: "Wildcard", icon: "♻️" },
  triple_captain: { label: "Triple Captain", icon: "⭐" },
  bench_boost: { label: "Bench Boost", icon: "💪" },
  free_hit: { label: "Free Hit", icon: "🎯" },
};

const posColors: Record<string, string> = { GK: "#f59e0b", DEF: "#22c55e", MID: "#3b82f6", FWD: "#ef4444" };

export default function DashboardClient({
  user, stats, team, captainName, topScorers, chips, gameweek,
}: {
  user: { id: string; username: string; clubName: string; country: string; totalPoints: number };
  stats: { globalRank: number; totalManagers: number; totalValue: number };
  team: { formation: string; captainId: string | null; players: UserPlayer[] } | null;
  captainName: string | null;
  topScorers: Player[];
  chips: Chip[];
  gameweek: { number: number; name: string; deadline: string } | null;
}) {
  const statCards = [
    { label: "Total Points", value: user.totalPoints, icon: <Trophy size={16} />, color: "#f0b429" },
    { label: "Global Rank", value: `#${stats.globalRank}`, icon: <TrendingUp size={16} />, color: "#3b82f6" },
    { label: "Managers", value: stats.totalManagers.toLocaleString(), icon: <Users size={16} />, color: "#22c55e" },
    { label: "Squad Value", value: `£${stats.totalValue.toFixed(1)}m`, icon: <Star size={16} />, color: "#a855f7" },
  ];

  const deadline = gameweek?.deadline ? new Date(gameweek.deadline) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        variants={stagger(0.06)}
        initial="hidden"
        animate="show"
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{getFlag(user.country)}</span>
            <h1 className="text-2xl font-black text-white">{user.clubName}</h1>
          </div>
          <p className="text-slate-400 text-sm">Welcome back, <span className="text-slate-300">{user.username}</span></p>
        </motion.div>
        {!team && (
          <motion.div variants={fadeUp} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/team" className="btn-gold px-6 py-3 inline-flex items-center gap-2 rounded-xl">
              <Star size={15} /> Build Your Squad
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={stagger(0.07)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            whileHover={{ y: -3, boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}
            className="card-glass p-5 transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
              {s.icon}
              <span className="text-xs text-slate-400">{s.label}</span>
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Squad snapshot */}
        <div className="lg:col-span-2 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-glass p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">My Squad</h2>
              <Link href="/team" className="text-sm font-medium flex items-center gap-1 hover:underline" style={{ color: "#f0b429" }}>
                {team ? "Edit Squad" : "Build Squad"} <ChevronRight size={14} />
              </Link>
            </div>

            {!team ? (
              <div className="text-center py-14">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-5xl mb-3"
                >⚽</motion.div>
                <p className="text-slate-400 mb-5">You haven&apos;t built your squad yet</p>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/team" className="btn-gold px-6 py-2.5 inline-block text-sm rounded-xl">Build Your Squad</Link>
                </motion.div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-slate-400">
                  <span className="font-bold px-2 py-0.5 rounded" style={{ background: "rgba(240,180,41,0.1)", color: "#f0b429" }}>{team.formation}</span>
                  {captainName && <span>Captain: <strong className="text-yellow-400">{captainName}</strong></span>}
                  <span>£{stats.totalValue.toFixed(1)}m used</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {team.players.filter(p => !p.isSub).map((p, i) => (
                    <motion.div
                      key={p.slot}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-2 p-2.5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0a1e38" }}>
                        {p.player.sofifaId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`/api/player-image/${p.player.sofifaId}`} alt={p.player.name} width={36} height={36} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-black" style={{ color: posColors[p.player.position] }}>
                            {p.player.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">{p.player.name.split(" ").slice(-1)[0]}</div>
                        <div className="text-xs text-slate-500">{getFlag(p.player.country)} {p.player.position}</div>
                      </div>
                      {team.captainId === p.player.id && (
                        <span className="text-xs font-black px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "#f0b429", color: "#050d1a" }}>C</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-glass p-6"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" /> My Chips
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {["wildcard", "triple_captain", "bench_boost", "free_hit"].map((chipType, i) => {
                const chip = chips.find((c) => c.chipType === chipType);
                const used = chip?.usedAt != null;
                const info = chipLabels[chipType];
                return (
                  <motion.div
                    key={chipType}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="p-4 rounded-xl flex items-center gap-3"
                    style={{
                      background: used ? "rgba(255,255,255,0.02)" : "rgba(240,180,41,0.07)",
                      border: used ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(240,180,41,0.2)",
                      opacity: used ? 0.45 : 1,
                    }}
                  >
                    <span className="text-xl">{info.icon}</span>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: used ? "#64748b" : "#f0b429" }}>{info.label}</div>
                      <div className="text-xs text-slate-500">{used ? `Used GW${chip?.gameweekNumber}` : "Available"}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Gameweek */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="card-glass p-6"
          >
            <h2 className="text-lg font-bold text-white mb-4">Active Gameweek</h2>
            {gameweek ? (
              <>
                <div className="text-3xl font-black mb-1" style={{ color: "#f0b429" }}>GW{gameweek.number}</div>
                <div className="text-white font-medium mb-3">{gameweek.name}</div>
                {deadline && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={13} />
                    Deadline: {deadline.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </>
            ) : <p className="text-slate-500">No active gameweek</p>}
          </motion.div>

          {/* Top scorers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="card-glass overflow-hidden"
          >
            <div className="p-5 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy size={16} className="text-yellow-400" /> Top Players
              </h2>
            </div>
            <div>
              {topScorers.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-center gap-3 px-5 py-3"
                  style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0a1e38" }}>
                    {p.sofifaId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/api/player-image/${p.sofifaId}`} alt={p.name} width={36} height={36} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-black" style={{ color: posColors[p.position] }}>
                        {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{p.name}</div>
                    <div className="text-xs text-slate-500">{getFlag(p.country)} {p.position}</div>
                  </div>
                  <span className="font-black text-sm" style={{ color: "#f0b429" }}>{p.totalPoints}</span>
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <Link href="/players" className="text-xs flex items-center gap-1 hover:underline" style={{ color: "#f0b429" }}>
                View all players <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="card-glass p-5"
          >
            <h2 className="text-base font-bold text-white mb-3">Quick Links</h2>
            <div className="space-y-1">
              {[
                { href: "/leaderboard", label: "Global Leaderboard", emoji: "🏆" },
                { href: "/leagues", label: "Mini Leagues", emoji: "👥" },
                { href: "/transfers", label: "Make Transfers", emoji: "🔄" },
                { href: "/prizes", label: "Prize Pot", emoji: "💰" },
              ].map((l) => (
                <motion.div key={l.href} whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                  <Link href={l.href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                    <span>{l.emoji}</span> {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
