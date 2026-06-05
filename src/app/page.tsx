"use client";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Star, Users, Zap, Shield, Globe, ChevronRight, Award } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";

function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-black" style={{ color: "#f0b429" }}>{value}{suffix}</div>
    </motion.div>
  );
}

const features = [
  { icon: <Star size={22} />, title: "Captain & Chips", desc: "Triple Captain, Bench Boost, Free Hit, Wildcard — strategic tools to maximise your points." },
  { icon: <Users size={22} />, title: "Mini Leagues", desc: "Create private leagues with friends and compete on your own leaderboard." },
  { icon: <Zap size={22} />, title: "Live Points", desc: "Real-time scoring as World Cup 2026 matches unfold across USA, Canada & Mexico." },
  { icon: <Shield size={22} />, title: "Token Gated", desc: "Hold 500K WCF tokens to enter. Our community, our game." },
  { icon: <Globe size={22} />, title: "48 Nations", desc: "400+ players from all World Cup 2026 qualified nations to choose from." },
  { icon: <Award size={22} />, title: "Prize Pot", desc: "Prize pool funded by token rewards + entry fees. Winner takes the glory." },
];

const howItWorks = [
  { step: "01", title: "Hold 500K WCF", desc: "You need 500,000 WCF tokens in your Solana wallet to qualify." },
  { step: "02", title: "Pay Entry Fee", desc: "Send 0.2 SOL to our treasury wallet and paste your transaction ID." },
  { step: "03", title: "Build Your Squad", desc: "Pick 15 players within a £100m budget. Choose formation and captain." },
  { step: "04", title: "Earn Points", desc: "Earn points from real World Cup performances and top the leaderboard." },
];

const scoring = [
  ["Playing (45+ min)", "+1"], ["Playing (90 min)", "+2"],
  ["Goal (FWD)", "+4"], ["Goal (MID)", "+5"], ["Goal (DEF/GK)", "+6"],
  ["Assist", "+3"], ["Clean sheet (GK/DEF)", "+4"], ["Clean sheet (MID)", "+1"],
  ["Penalty save", "+5"], ["Yellow card", "-1"], ["Red card", "-3"],
  ["Own goal", "-2"], ["Bonus (top performer)", "+1 to +3"], ["Captain", "×2 points"],
];

export default function LandingPage() {
  const featRef = useRef(null);
  const featInView = useInView(featRef, { once: true, margin: "-80px" });
  const howRef = useRef(null);
  const howInView = useInView(howRef, { once: true, margin: "-80px" });
  const scoreRef = useRef(null);
  const scoreInView = useInView(scoreRef, { once: true, margin: "-80px" });

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: "#050d1a" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pb-16">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(240,180,41,0.18) 0%, transparent 70%)" }}
          />
          {/* Grid */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.04) 80px, rgba(255,255,255,0.04) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.04) 80px, rgba(255,255,255,0.04) 81px)" }} />
        </div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? "#f0b429" : i % 3 === 1 ? "#22c55e" : "#3b82f6",
              opacity: 0.4,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium"
            style={{ background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.3)", color: "#f0b429" }}
          >
            <Trophy size={13} />
            World Cup 2026 — USA · Canada · Mexico
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-5xl sm:text-7xl md:text-8xl font-black mb-4 leading-none tracking-tight"
          >
            <span className="gold-shimmer">WORLD CUP</span>
            <br />
            <span className="text-white">FANTASY</span>{" "}
            <span className="text-slate-500">2026</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            The ultimate on-chain fantasy football experience. Pick your squad from 400+ players, compete for the prize pot, and prove you know the beautiful game.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/register" className="btn-gold px-8 py-4 text-base inline-flex items-center gap-2 rounded-xl">
                Enter Now <ChevronRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/login" className="btn-outline px-8 py-4 text-base inline-flex items-center justify-center rounded-xl">
                Sign In
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-6 max-w-xs mx-auto"
          >
            {[
              { value: "400+", label: "Players" },
              { value: "48", label: "Nations" },
              { value: "£100m", label: "Budget" },
            ].map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center" custom={i}>
                <div className="text-2xl md:text-3xl font-black" style={{ color: "#f0b429" }}>{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Pitch preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="relative z-10 w-full max-w-2xl mx-auto mt-16 px-4"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(240,180,41,0.18)", boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(240,180,41,0.06)" }}>
            <div className="pitch-bg h-44 flex items-center justify-center relative">
              <div className="absolute top-0 left-0 right-0 h-1/2 border-b border-white/15" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/15" />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 text-center"
              >
                <div className="text-5xl mb-1">⚽</div>
                <div className="text-white font-black text-lg tracking-wide">BUILD YOUR SQUAD</div>
                <div className="text-green-300/80 text-sm">£100m budget · 15 players</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-slate-600 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-slate-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={howRef} className="py-24 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={howInView ? "show" : "hidden"} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">How It Works</h2>
            <p className="text-slate-400">Get set up in 4 simple steps</p>
          </motion.div>
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            animate={howInView ? "show" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
          >
            {howItWorks.map((h) => (
              <motion.div
                key={h.step}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}
                className="card-glass p-6 text-center transition-shadow"
              >
                <div className="text-5xl font-black mb-3" style={{ color: "rgba(240,180,41,0.2)", fontVariantNumeric: "tabular-nums" }}>{h.step}</div>
                <h3 className="font-bold text-white mb-2">{h.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featRef} className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={featInView ? "show" : "hidden"} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Everything You Need</h2>
            <p className="text-slate-400">Built for the serious fantasy manager</p>
          </motion.div>
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            animate={featInView ? "show" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -4, borderColor: "rgba(240,180,41,0.3)" }}
                className="card-glass p-6 transition-all"
              >
                <div className="text-yellow-400 mb-4 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(240,180,41,0.1)" }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SCORING ── */}
      <section ref={scoreRef} className="py-24 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={scoreInView ? "show" : "hidden"} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Scoring System</h2>
            <p className="text-slate-400">Points awarded per match</p>
          </motion.div>
          <motion.div
            variants={stagger(0.03)}
            initial="hidden"
            animate={scoreInView ? "show" : "hidden"}
            className="card-glass overflow-hidden"
          >
            {scoring.map(([action, pts], i) => (
              <motion.div
                key={action}
                variants={fadeUp}
                className="flex justify-between items-center px-6 py-3"
                style={{ borderBottom: i < scoring.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              >
                <span className="text-slate-300 text-sm">{action}</span>
                <span className="font-bold text-sm" style={{ color: pts.startsWith("+") || pts.includes("×") ? "#f0b429" : "#ef4444" }}>{pts}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="card-glass p-12 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(240,180,41,0.08), rgba(13,31,60,0.95))", border: "1px solid rgba(240,180,41,0.25)" }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% -20%, rgba(240,180,41,0.12), transparent 70%)" }} />
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative text-5xl mb-5"
            >
              🏆
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-3 relative">Ready to Compete?</h2>
            <p className="text-slate-400 mb-8 relative">Join the World Cup Fantasy 2026 community. The prize pot is growing — don&apos;t miss out.</p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/register" className="btn-gold px-10 py-4 text-base inline-flex items-center gap-2 rounded-xl">
                Enter Now <ChevronRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="text-center py-8 text-slate-600 text-sm" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        World Cup Fantasy 2026 · Powered by Solana · WCF Token
      </footer>
    </main>
  );
}
