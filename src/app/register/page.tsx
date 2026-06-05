"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { allCountries } from "@/lib/flags";
import { motion, AnimatePresence } from "framer-motion";

const TREASURY = process.env.NEXT_PUBLIC_TREASURY_WALLET || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

const steps = ["Account", "Wallet", "Payment"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "", email: "", password: "", clubName: "", country: "England",
    walletAddress: "", txSignature: "",
  });

  function copyAddress() {
    navigator.clipboard.writeText(TREASURY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 2) { setStep(step + 1); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/team");
  }

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "3rem 1rem 4rem" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-lg)", color: "var(--primary)", textDecoration: "none" }}>
            WC Fantasy
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", color: "var(--ink)", marginTop: "1.5rem", marginBottom: "0.4rem", lineHeight: 1 }}>
            Enter the game
          </h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>Three steps to join the competition.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-3 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div style={{
                width: 28, height: 28,
                borderRadius: "var(--r-full)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "var(--text-xs)", fontWeight: 700,
                background: i < step ? "var(--primary)" : i === step ? "var(--surface-high)" : "var(--surface)",
                color: i < step ? "oklch(0.08 0 0)" : i === step ? "var(--ink)" : "var(--ink-3)",
                border: i === step ? "1.5px solid var(--primary)" : "1.5px solid var(--border-subtle)",
                transition: "all var(--t-mid)",
                flexShrink: 0,
              }}>
                {i < step ? <Check size={13} /> : i + 1}
              </div>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: i === step ? "var(--ink)" : "var(--ink-3)" }}>{s}</span>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: "var(--border-subtle)", minWidth: 24 }} />}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          {error && (
            <div style={{ background: "oklch(0.58 0.20 25 / 0.1)", border: "1px solid oklch(0.58 0.20 25 / 0.3)", borderRadius: "var(--r-md)", padding: "0.65rem 0.875rem", marginBottom: "1.25rem", fontSize: "var(--text-sm)", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="flex flex-col gap-4">
                  <div>
                    <label className="label">Username</label>
                    <input type="text" placeholder="TheGaffer" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Club name</label>
                    <input type="text" placeholder="FC Whatever" value={form.clubName} onChange={e => setForm({ ...form, clubName: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPw ? "text" : "password"} placeholder="Min 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: "2.75rem" }} />
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--ink-3)", cursor: "pointer" }}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label">Favourite nation</label>
                    <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                      {allCountries.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="flex flex-col gap-4">
                  <div style={{ background: "var(--primary-bg)", border: "1px solid oklch(0.76 0.146 65 / 0.25)", borderRadius: "var(--r-md)", padding: "1rem" }}>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--ink)" }}>
                      You must hold <strong style={{ color: "var(--primary)" }}>500,000 WCF tokens</strong> to enter. We check your wallet balance — no connection or signing required.
                    </p>
                  </div>
                  <div>
                    <label className="label">Solana wallet address</label>
                    <input type="text" placeholder="7xKX…AsU" value={form.walletAddress} onChange={e => setForm({ ...form, walletAddress: e.target.value })} required />
                    <p style={{ marginTop: "0.4rem", fontSize: "var(--text-xs)", color: "var(--ink-3)" }}>Read-only balance check. We never request a private key.</p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="flex flex-col gap-4">
                  <div>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", marginBottom: "0.75rem" }}>
                      Send exactly <strong style={{ color: "var(--ink)" }}>0.2 SOL</strong> to the treasury wallet, then paste your transaction signature below.
                    </p>
                    <div style={{ background: "var(--surface-high)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "0.875rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                      <code style={{ fontSize: "var(--text-xs)", color: "var(--primary)", wordBreak: "break-all", flex: 1 }}>{TREASURY}</code>
                      <button type="button" onClick={copyAddress} style={{ background: "none", border: "none", color: copied ? "var(--accent)" : "var(--ink-3)", cursor: "pointer", flexShrink: 0 }}>
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label">Transaction signature</label>
                    <input type="text" placeholder="5xKX…AbC" value={form.txSignature} onChange={e => setForm({ ...form, txSignature: e.target.value })} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost" style={{ padding: "0.7rem 1.25rem" }}>
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "0.7rem" }}>
                {loading ? "Processing…" : step < 2 ? "Continue" : "Create account"}
              </button>
            </div>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>
            Already registered?{" "}
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
