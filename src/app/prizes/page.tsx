import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Trophy, DollarSign, Users, Star, Zap, Shield } from "lucide-react";

export default async function PrizesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  const totalManagers = await prisma.user.count({ where: { verified: true } });
  const entryPot = totalManagers * 0.2;
  const estimatedTokenRewards = 50000;
  const totalPot = entryPot;

  const prizes = [
    { place: "1st", share: "50%", emoji: "🥇", color: "#f0b429" },
    { place: "2nd", share: "25%", emoji: "🥈", color: "#94a3b8" },
    { place: "3rd", share: "10%", emoji: "🥉", color: "#cd7f32" },
    { place: "4th–10th", share: "Split 10%", emoji: "🏅", color: "#64748b" },
    { place: "Community Fund", share: "5%", emoji: "💜", color: "#a855f7" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <NavBar clubName={user.clubName} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy size={28} className="text-yellow-400" />
          <div>
            <h1 className="text-2xl font-black text-white">Prize Pot</h1>
            <p className="text-slate-400">Entry fees + token rewards = your prize</p>
          </div>
        </div>

        {/* Prize pot hero */}
        <div className="card-glass p-8 text-center mb-8 trophy-glow" style={{ background: "linear-gradient(135deg, rgba(240,180,41,0.1), rgba(13,31,60,0.9))", border: "1px solid rgba(240,180,41,0.3)" }}>
          <div className="text-6xl mb-3">🏆</div>
          <div className="text-5xl font-black mb-2" style={{ color: "#f0b429" }}>
            {totalPot.toFixed(2)} SOL
          </div>
          <p className="text-slate-400 mb-6">Current Prize Pot (grows with every entry)</p>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="text-center">
              <div className="text-xl font-black text-white">{totalManagers}</div>
              <div className="text-xs text-slate-400">Managers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black" style={{ color: "#f0b429" }}>{entryPot.toFixed(2)}</div>
              <div className="text-xs text-slate-400">SOL (entries)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-purple-400">{estimatedTokenRewards.toLocaleString()}</div>
              <div className="text-xs text-slate-400">WCF tokens</div>
            </div>
          </div>
        </div>

        {/* Prize breakdown */}
        <div className="card-glass p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Prize Distribution</h2>
          <div className="space-y-3">
            {prizes.map((p) => (
              <div key={p.place} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-2xl">{p.emoji}</div>
                <div className="flex-1">
                  <div className="font-bold text-white">{p.place}</div>
                  <div className="text-sm text-slate-400">of total pot</div>
                </div>
                <div className="text-xl font-black" style={{ color: p.color }}>{p.share}</div>
                <div className="text-sm text-slate-500">~{(totalPot * parseFloat(p.share) / 100).toFixed(3)} SOL</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prize rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card-glass p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-yellow-400" /> How Prizes Are Funded
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {[
                ["Entry Fees", `${totalManagers} × 0.2 SOL = ${entryPot.toFixed(2)} SOL`],
                ["Token Rewards", "WCF staking / LP rewards distributed to prize pot"],
                ["Treasury", "Growing with each new participant"],
              ].map(([label, val]) => (
                <li key={label} className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-slate-400">{label}</span>
                  <span className="font-semibold text-white">{val}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-glass p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Star size={18} className="text-yellow-400" /> Tournament Timeline
            </h2>
            <ul className="space-y-3 text-sm">
              {[
                { date: "Jun 11", event: "Group Stage Begins", status: "upcoming" },
                { date: "Jun 11 – Jul 2", event: "Group Stage (3 rounds)", status: "upcoming" },
                { date: "Jul 4 – 6", event: "Round of 32", status: "upcoming" },
                { date: "Jul 9 – 11", event: "Round of 16", status: "upcoming" },
                { date: "Jul 14 – 15", event: "Quarter-Finals", status: "upcoming" },
                { date: "Jul 19", event: "Semi-Finals", status: "upcoming" },
                { date: "Jul 23", event: "🏆 FINAL — Prize Distributed", status: "upcoming" },
              ].map((t) => (
                <li key={t.date} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-28 flex-shrink-0">{t.date}</span>
                  <span className="text-slate-300">{t.event}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fair play */}
        <div className="card-glass p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield size={18} className="text-yellow-400" /> Fair Play & Transparency
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
            {[
              { icon: <Zap size={16} />, title: "On-chain Verification", desc: "Entry fees verified via Solana transaction signatures" },
              { icon: <Users size={16} />, title: "Token-gated Entry", desc: "Only WCF holders can participate, protecting community value" },
              { icon: <Trophy size={16} />, title: "Transparent Scoring", desc: "Points based on official World Cup 2026 match data" },
            ].map((f) => (
              <div key={f.title} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-yellow-400 mb-2">{f.icon}</div>
                <div className="font-semibold text-white mb-1">{f.title}</div>
                <div className="text-slate-400">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
