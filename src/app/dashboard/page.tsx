import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Trophy, TrendingUp, Users, Clock, Star, Zap } from "lucide-react";
import { getFlag } from "@/lib/flags";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      team: { include: { players: { include: { player: true } } } },
      chips: true,
    },
  });
  if (!user) redirect("/login");

  const gameweek = await prisma.gameWeek.findFirst({ where: { isActive: true } });
  const globalRank = await prisma.user.count({ where: { totalPoints: { gte: user.totalPoints }, verified: true } });
  const totalManagers = await prisma.user.count({ where: { verified: true } });

  const myPlayers = user.team?.players.map((p) => p.player) || [];
  const totalValue = myPlayers.reduce((s, p) => s + p.value, 0);
  const captainPlayer = user.team?.captainId ? myPlayers.find((p) => p.id === user.team!.captainId) : null;

  const topScorers = await prisma.player.findMany({
    orderBy: { totalPoints: "desc" },
    take: 5,
  });

  const chips = user.chips;
  const chipLabels: Record<string, string> = {
    wildcard: "Wildcard", triple_captain: "Triple Captain", bench_boost: "Bench Boost", free_hit: "Free Hit"
  };

  const deadline = gameweek?.deadline ? new Date(gameweek.deadline) : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <NavBar clubName={user.clubName} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{getFlag(user.country)}</span>
              <h1 className="text-2xl font-black text-white">{user.clubName}</h1>
            </div>
            <p className="text-slate-400">Welcome back, {user.username}</p>
          </div>
          {!user.team && (
            <Link href="/team" className="btn-gold px-6 py-3 inline-flex items-center gap-2">
              <Star size={16} /> Build Your Squad
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Points", value: user.totalPoints, icon: <Trophy size={18} />, color: "#f0b429" },
            { label: "Global Rank", value: `#${globalRank}`, icon: <TrendingUp size={18} />, color: "#3b82f6" },
            { label: "Managers", value: totalManagers.toLocaleString(), icon: <Users size={18} />, color: "#22c55e" },
            { label: "Squad Value", value: `£${totalValue.toFixed(1)}m`, icon: <Star size={18} />, color: "#a855f7" },
          ].map((s) => (
            <div key={s.label} className="card-glass p-5">
              <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
                {s.icon}
                <span className="text-xs text-slate-400">{s.label}</span>
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: My Team snapshot */}
          <div className="lg:col-span-2">
            <div className="card-glass p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">My Squad</h2>
                <Link href="/team" className="text-sm font-medium hover:underline" style={{ color: "#f0b429" }}>
                  {user.team ? "Edit Squad" : "Build Squad →"}
                </Link>
              </div>

              {!user.team ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">⚽</div>
                  <p className="text-slate-400 mb-4">You haven&apos;t built your squad yet</p>
                  <Link href="/team" className="btn-gold px-6 py-2.5 inline-block text-sm">Build Your Squad</Link>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                    <span className="font-semibold text-white">{user.team.formation}</span>
                    {captainPlayer && (
                      <span>Captain: <strong className="text-yellow-400">{captainPlayer.name}</strong></span>
                    )}
                    <span>£{totalValue.toFixed(1)}m / £100m</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["GK", "DEF", "MID", "FWD"].map((pos) => {
                      const posPlayers = user.team!.players.filter((p) => !p.isSub && p.player.position === pos);
                      return posPlayers.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0d2a4a" }}>
                            {p.player.sofifaId ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={`https://cdn.sofifa.net/players/${p.player.sofifaId}/25_120x120.png`} alt={p.player.name} width={32} height={32} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-blue-400">{p.player.name.charAt(0)}</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate">{p.player.name.split(" ").slice(-1)[0]}</div>
                            <div className="text-xs text-slate-500">{getFlag(p.player.country)} {p.player.position}</div>
                          </div>
                          {user.team?.captainId === p.player.id && (
                            <span className="ml-auto text-xs font-black px-1.5 py-0.5 rounded" style={{ background: "#f0b429", color: "#050d1a" }}>C</span>
                          )}
                        </div>
                      ));
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Chips */}
            <div className="card-glass p-6">
              <h2 className="text-lg font-bold text-white mb-4">My Chips</h2>
              <div className="grid grid-cols-2 gap-3">
                {["wildcard", "triple_captain", "bench_boost", "free_hit"].map((chipType) => {
                  const chip = chips.find((c) => c.chipType === chipType);
                  const used = chip?.usedAt !== null && chip?.usedAt !== undefined;
                  return (
                    <div
                      key={chipType}
                      className="p-4 rounded-xl flex items-center gap-3"
                      style={{
                        background: used ? "rgba(255,255,255,0.03)" : "rgba(240,180,41,0.08)",
                        border: used ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(240,180,41,0.25)",
                        opacity: used ? 0.5 : 1,
                      }}
                    >
                      <Zap size={18} style={{ color: used ? "#64748b" : "#f0b429" }} />
                      <div>
                        <div className="text-sm font-semibold" style={{ color: used ? "#64748b" : "#f0b429" }}>{chipLabels[chipType]}</div>
                        <div className="text-xs text-slate-500">{used ? `Used GW${chip?.gameweekNumber}` : "Available"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Gameweek + Top scorers */}
          <div className="space-y-6">
            {/* Active Gameweek */}
            <div className="card-glass p-6">
              <h2 className="text-lg font-bold text-white mb-4">Active Gameweek</h2>
              {gameweek ? (
                <>
                  <div className="text-2xl font-black mb-1" style={{ color: "#f0b429" }}>GW{gameweek.number}</div>
                  <div className="text-white font-medium mb-3">{gameweek.name}</div>
                  {deadline && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock size={14} />
                      Deadline: {deadline.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-slate-400">No active gameweek</p>
              )}
            </div>

            {/* Top Scorers */}
            <div className="card-glass p-6">
              <h2 className="text-lg font-bold text-white mb-4">Top Players</h2>
              <div className="space-y-3">
                {topScorers.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-5 text-center text-xs font-bold text-slate-500">{i + 1}</div>
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0d2a4a" }}>
                      {p.sofifaId ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`https://cdn.sofifa.net/players/${p.sofifaId}/25_120x120.png`} alt={p.name} width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-blue-400">{p.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{p.name}</div>
                      <div className="text-xs text-slate-400">{getFlag(p.country)} {p.position}</div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: "#f0b429" }}>{p.totalPoints}</div>
                  </div>
                ))}
              </div>
              <Link href="/players" className="block text-center text-sm mt-4 hover:underline" style={{ color: "#f0b429" }}>
                View all players →
              </Link>
            </div>

            {/* Quick links */}
            <div className="card-glass p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Links</h2>
              <div className="space-y-2">
                {[
                  { href: "/leaderboard", label: "🏆 Global Leaderboard" },
                  { href: "/leagues", label: "👥 Mini Leagues" },
                  { href: "/transfers", label: "🔄 Make Transfers" },
                  { href: "/prizes", label: "💰 Prize Pot" },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="block px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
