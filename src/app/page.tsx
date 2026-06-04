"use client";
import Link from "next/link";
import { Trophy, Star, Users, Zap, Shield, Globe, ChevronRight, Award } from "lucide-react";

const features = [
  { icon: <Star size={24} />, title: "Captain & Chips", desc: "Triple Captain, Bench Boost, Free Hit, Wildcard — strategic tools to maximise your points." },
  { icon: <Users size={24} />, title: "Mini Leagues", desc: "Create private leagues with friends and compete on your own leaderboard." },
  { icon: <Zap size={24} />, title: "Live Points", desc: "Real-time scoring as World Cup 2026 matches unfold across USA, Canada & Mexico." },
  { icon: <Shield size={24} />, title: "Token Gated", desc: "Hold 500K WCF tokens to enter. Our community, our game." },
  { icon: <Globe size={24} />, title: "48 Nations", desc: "400+ players from all World Cup 2026 qualified nations to choose from." },
  { icon: <Award size={24} />, title: "Prize Pot", desc: "Prize pool funded by token rewards + entry fees. Winner takes the glory." },
];

const howItWorks = [
  { step: "01", title: "Hold 500K WCF", desc: "You need 500,000 WCF tokens in your Solana wallet to qualify." },
  { step: "02", title: "Pay Entry Fee", desc: "Send 0.2 SOL to our treasury wallet and paste your transaction ID." },
  { step: "03", title: "Build Your Squad", desc: "Pick 15 players within a £100m budget. Choose your formation and captain." },
  { step: "04", title: "Earn Points", desc: "Earn points from real World Cup performances. Top the leaderboard to win." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(240,180,41,0.12) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 61px)" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium" style={{ background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.3)", color: "#f0b429" }}>
            <Trophy size={14} />
            World Cup 2026 — USA · Canada · Mexico
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none tracking-tight">
            <span className="gold-shimmer">WORLD CUP</span>
            <br />
            <span className="text-white">FANTASY 2026</span>
          </h1>

          <p className="text-xl text-slate-300 mb-3 max-w-2xl mx-auto leading-relaxed">
            The ultimate on-chain fantasy football experience. Pick your squad from 400+ players, compete for the prize pot, and prove you know the beautiful game.
          </p>

          <div className="flex items-center justify-center gap-6 mb-10 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-yellow-400" /> Token-gated entry</span>
            <span className="flex items-center gap-1.5"><Zap size={14} className="text-yellow-400" /> 0.2 SOL entry fee</span>
            <span className="flex items-center gap-1.5"><Award size={14} className="text-yellow-400" /> Prize pot growing daily</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-gold px-8 py-4 text-base flex items-center justify-center gap-2 inline-flex">
              Enter Now <ChevronRight size={18} />
            </Link>
            <Link href="/login" className="btn-outline px-8 py-4 text-base inline-flex items-center justify-center">
              Sign In
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            {[
              { value: "400+", label: "Players" },
              { value: "48", label: "Nations" },
              { value: "£100m", label: "Budget" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black" style={{ color: "#f0b429" }}>{s.value}</div>
                <div className="text-sm text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto px-4 pb-16">
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(240,180,41,0.2)" }}>
            <div className="pitch-bg h-48 flex items-center justify-center relative">
              <div className="absolute top-0 left-0 right-0 bottom-1/2 border-b-2 border-white/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white/20" />
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-2">⚽</div>
                <div className="text-white font-black text-xl">BUILD YOUR SQUAD</div>
                <div className="text-green-300 text-sm">£100m budget · 15 players</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-2">How It Works</h2>
          <p className="text-slate-400 text-center mb-12">Get set up in 4 simple steps</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorks.map((h) => (
              <div key={h.step} className="card-glass p-6 text-center">
                <div className="text-4xl font-black mb-3" style={{ color: "rgba(240,180,41,0.3)" }}>{h.step}</div>
                <h3 className="font-bold text-white mb-2">{h.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-2">Everything You Need</h2>
          <p className="text-slate-400 text-center mb-12">Built for the serious fantasy manager</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-glass p-6 hover:border-yellow-400/30 transition-all">
                <div className="text-yellow-400 mb-4">{f.icon}</div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-2">Scoring System</h2>
          <p className="text-slate-400 text-center mb-12">Points awarded per match</p>
          <div className="card-glass p-8">
            <div className="grid grid-cols-2 gap-x-8 text-sm">
              {[
                ["Playing (45+ min)", "+1"], ["Playing (90 min)", "+2"],
                ["Goal (FWD)", "+4"], ["Goal (MID)", "+5"], ["Goal (DEF/GK)", "+6"],
                ["Assist", "+3"], ["Clean sheet (GK/DEF)", "+4"], ["Clean sheet (MID)", "+1"],
                ["Penalty save", "+5"], ["Yellow card", "-1"], ["Red card", "-3"],
                ["Own goal", "-2"], ["Bonus (top performer)", "+1 to +3"], ["Captain", "×2 points"],
              ].map(([action, points]) => (
                <div key={action} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-slate-300">{action}</span>
                  <span className="font-bold" style={{ color: points.startsWith("+") || points.includes("×") ? "#f0b429" : "#ef4444" }}>{points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center card-glass p-12" style={{ background: "linear-gradient(135deg, rgba(240,180,41,0.08), rgba(13,31,60,0.9))" }}>
          <Trophy size={48} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-3">Ready to Compete?</h2>
          <p className="text-slate-400 mb-8">Join the World Cup Fantasy 2026 community. The prize pot is growing — don&apos;t miss out.</p>
          <Link href="/register" className="btn-gold px-10 py-4 text-base inline-flex items-center gap-2">
            Enter Now <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-slate-500 text-sm" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p>World Cup Fantasy 2026 · Powered by Solana · WCF Token</p>
      </footer>
    </main>
  );
}
