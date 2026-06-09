"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { allCountries } from "@/lib/flags";
import { AnimatePresence, motion } from "framer-motion";

const TREASURY = process.env.NEXT_PUBLIC_TREASURY_WALLET || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";
const steps = ["Account", "Wallet", "Payment"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep]     = useState(0);
  const [copied, setCopied] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [form, setForm] = useState({ username: "", email: "", password: "", clubName: "", country: "England", walletAddress: "", txSignature: "" });

  function copy() {
    navigator.clipboard.writeText(TREASURY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 2) { setStep(step + 1); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/team");
  }

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{ display: "block", fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{children}</label>
  );

  return (
    <main style={{ background: "var(--ground)", minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "3rem 1rem 4rem" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <Link href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStyle: "italic", fontSize: "var(--t-lg)", color: "var(--maroon)", textDecoration: "none", display: "block", marginBottom: "2.5rem" }}>
          World Cup Fantasy
        </Link>

        <h1 className="display" style={{ fontSize: "var(--t-3xl)", color: "var(--navy)", marginBottom: "0.35rem" }}>Enter the game</h1>
        <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", marginBottom: "2rem" }}>Three steps to join the 2026 competition.</p>

        {/* Step bar */}
        <div style={{ display: "flex", marginBottom: "2rem", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0, background: i < step ? "var(--maroon)" : i === step ? "var(--maroon)" : "var(--border)", color: i <= step ? "#fff" : "var(--muted)", transition: "all 200ms" }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: "var(--t-xs)", fontWeight: i === step ? 600 : 400, color: i === step ? "var(--navy)" : "var(--subtle)", whiteSpace: "nowrap" }}>{s}</span>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? "var(--maroon)" : "var(--border)", marginLeft: "0.25rem", transition: "background 200ms" }} />}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          {error && (
            <div style={{ padding: "0.75rem 1rem", borderRadius: 4, background: "rgba(160,26,26,0.07)", border: "1px solid rgba(160,26,26,0.25)", color: "#A01A1A", fontSize: "var(--t-sm)", marginBottom: "1.25rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <Label>Username</Label>
                      <input type="text" placeholder="TheGaffer" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Club name</Label>
                      <input type="text" placeholder="FC Champions" value={form.clubName} onChange={e => setForm({ ...form, clubName: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div style={{ position: "relative" }}>
                      <input type={showPw ? "text" : "password"} placeholder="Min 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: "2.75rem" }} />
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--subtle)" }}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label>Favourite nation</Label>
                    <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                      {allCountries.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ padding: "1rem", background: "var(--maroon-tint)", border: "1px solid rgba(123,28,46,0.2)", borderRadius: 4 }}>
                    <p style={{ fontSize: "var(--t-sm)", color: "var(--navy)", lineHeight: 1.6 }}>
                      You must hold <strong style={{ color: "var(--maroon)" }}>500,000 WCF tokens</strong> in your Solana wallet. We verify the balance on-chain — no connection or signature required.
                    </p>
                  </div>
                  <div>
                    <Label>Solana wallet address</Label>
                    <input type="text" placeholder="7xKX…AsU" value={form.walletAddress} onChange={e => setForm({ ...form, walletAddress: e.target.value })} required />
                    <p style={{ marginTop: "0.4rem", fontSize: "var(--t-xs)", color: "var(--subtle)" }}>Read-only balance check. We never request a private key.</p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", lineHeight: 1.6 }}>
                    Send exactly <strong style={{ color: "var(--navy)" }}>0.2 SOL</strong> to the treasury wallet below, then paste your transaction signature.
                  </p>
                  <div style={{ padding: "0.875rem 1rem", background: "var(--ground)", border: "1px solid var(--border)", borderRadius: 4, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <code style={{ fontSize: "var(--t-xs)", color: "var(--navy)", wordBreak: "break-all", flex: 1, fontFamily: "monospace" }}>{TREASURY}</code>
                    <button type="button" onClick={copy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "var(--pos-def)" : "var(--subtle)", flexShrink: 0 }}>
                      {copied ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                  <div>
                    <Label>Transaction signature</Label>
                    <input type="text" placeholder="Paste your tx signature…" value={form.txSignature} onChange={e => setForm({ ...form, txSignature: e.target.value })} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              {step > 0 && (
                <button type="button" onClick={() => setStep(step - 1)} className="btn btn-ghost" style={{ padding: "0.7rem 1.25rem" }}>
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, padding: "0.7rem" }}>
                {loading ? "Processing…" : step < 2 ? "Continue" : "Create account"}
              </button>
            </div>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "var(--t-sm)", color: "var(--muted)" }}>
            Already registered?{" "}
            <Link href="/login" style={{ color: "var(--maroon)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
