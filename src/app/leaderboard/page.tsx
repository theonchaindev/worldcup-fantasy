import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Trophy, Medal } from "lucide-react";
import { getFlag } from "@/lib/flags";

export default async function LeaderboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  const allUsers = await prisma.user.findMany({
    where: { verified: true, team: { isNot: null } },
    orderBy: { totalPoints: "desc" },
    take: 100,
    select: { id: true, username: true, clubName: true, country: true, totalPoints: true },
  });

  const myRank = allUsers.findIndex((u) => u.id === session.userId) + 1;

  const rankColors = ["#f0b429", "#94a3b8", "#cd7f32"];
  const rankIcons = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <NavBar clubName={user.clubName} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy size={28} className="text-yellow-400" />
          <div>
            <h1 className="text-2xl font-black text-white">Global Leaderboard</h1>
            <p className="text-slate-400">{allUsers.length} managers competing</p>
          </div>
        </div>

        {/* My rank card */}
        {myRank > 0 && (
          <div className="card-glass p-5 mb-6 flex items-center gap-4" style={{ border: "1px solid rgba(240,180,41,0.3)", background: "rgba(240,180,41,0.05)" }}>
            <Medal size={24} className="text-yellow-400" />
            <div className="flex-1">
              <div className="text-sm text-slate-400">Your Rank</div>
              <div className="text-xl font-black text-white">#{myRank} — {user.clubName}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black" style={{ color: "#f0b429" }}>{user.totalPoints}</div>
              <div className="text-xs text-slate-400">points</div>
            </div>
          </div>
        )}

        {/* Top 3 podium */}
        {allUsers.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[allUsers[1], allUsers[0], allUsers[2]].map((u, i) => {
              const realIndex = i === 0 ? 2 : i === 1 ? 1 : 3;
              if (!u) return <div key={i} />;
              return (
                <div
                  key={u.id}
                  className="card-glass p-5 text-center"
                  style={{
                    border: `1px solid ${rankColors[realIndex - 1]}40`,
                    background: `linear-gradient(135deg, ${rankColors[realIndex - 1]}08, transparent)`,
                    transform: realIndex === 1 ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <div className="text-3xl mb-2">{rankIcons[realIndex - 1]}</div>
                  <div className="font-black text-white text-sm">{u.clubName}</div>
                  <div className="text-xs text-slate-400 mb-2">{u.username}</div>
                  <div className="text-xl font-black" style={{ color: rankColors[realIndex - 1] }}>{u.totalPoints}</div>
                  <div className="text-xs text-slate-400">pts</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full table */}
        <div className="card-glass overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs">Rank</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs">Manager</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs">Club</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-xs">Nation</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium text-xs">Points</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u, i) => (
                <tr
                  key={u.id}
                  className="transition-all hover:bg-white/5"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                    background: u.id === session.userId ? "rgba(240,180,41,0.04)" : undefined,
                  }}
                >
                  <td className="px-4 py-3 w-12">
                    {i < 3 ? (
                      <span className="text-lg">{rankIcons[i]}</span>
                    ) : (
                      <span className="text-slate-500 text-xs">#{i + 1}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${u.id === session.userId ? "text-yellow-400" : "text-white"}`}>
                      {u.username} {u.id === session.userId && "(you)"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{u.clubName}</td>
                  <td className="px-4 py-3 text-slate-400">{getFlag(u.country)} {u.country}</td>
                  <td className="px-4 py-3 text-right font-black" style={{ color: i < 3 ? rankColors[i] : "#f0b429" }}>
                    {u.totalPoints}
                  </td>
                </tr>
              ))}

              {allUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    No managers yet. Be the first to build your squad!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
