"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Copy, CheckCircle, Eye, EyeOff, ChevronRight, ChevronLeft } from "lucide-react";
import { allCountries } from "@/lib/flags";

const TREASURY = process.env.NEXT_PUBLIC_TREASURY_WALLET || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";
const ENTRY_FEE = process.env.NEXT_PUBLIC_ENTRY_FEE_SOL || "0.2";
const TOKEN_REQ = process.env.NEXT_PUBLIC_TOKEN_REQUIRED || "500,000";
const TOKEN_SYM = process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "WCF";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
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
    if (step < 3) { setStep(step + 1); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push("/team");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-primary)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(240,180,41,0.08) 0%, transparent 60%)" }} />

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Trophy size={28} className="text-yellow-400" />
            <span className="text-xl font-black" style={{ color: "#f0b429" }}>WC Fantasy 2026</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Create Your Account</h1>
          <p className="text-slate-400">Join the World Cup Fantasy community</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: s <= step ? "linear-gradient(135deg, #c8921e, #f0b429)" : "rgba(240,180,41,0.1)",
                  color: s <= step ? "#050d1a" : "#f0b429",
                  border: s <= step ? "none" : "1px solid rgba(240,180,41,0.3)",
                }}
              >
                {s}
              </div>
              {s < 3 && <div className="w-8 h-px" style={{ background: s < step ? "#f0b429" : "rgba(240,180,41,0.2)" }} />}
            </div>
          ))}
        </div>

        <div className="card-glass p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <h2 className="text-lg font-bold text-white mb-4">Account Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                    <input type="text" placeholder="ManagerName" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Club Name</label>
                    <input type="text" placeholder="FC Barcelona" value={form.clubName} onChange={(e) => setForm({ ...form, clubName: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input type="email" placeholder="manager@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Favourite Nation</label>
                  <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                    {allCountries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-bold text-white mb-4">Wallet Verification</h2>
                <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)" }}>
                  <p className="text-sm text-slate-300 mb-1">You must hold <strong className="text-yellow-400">{TOKEN_REQ} {TOKEN_SYM} tokens</strong> in your Solana wallet to enter.</p>
                  <p className="text-xs text-slate-400">We will verify this automatically when you submit.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Solana Wallet Address</label>
                  <input type="text" placeholder="7xKX...AsU" value={form.walletAddress} onChange={(e) => setForm({ ...form, walletAddress: e.target.value })} required />
                  <p className="text-xs text-slate-500 mt-1">We only read your balance — never ask for private keys</p>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-bold text-white mb-4">Entry Payment</h2>
                <div className="p-4 rounded-xl" style={{ background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)" }}>
                  <p className="text-sm text-slate-300 mb-3">Send exactly <strong className="text-yellow-400">{ENTRY_FEE} SOL</strong> to the treasury wallet:</p>
                  <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(5,13,26,0.8)", border: "1px solid rgba(240,180,41,0.15)" }}>
                    <code className="text-xs text-yellow-400 flex-1 break-all">{TREASURY}</code>
                    <button type="button" onClick={copyAddress} className="flex-shrink-0 text-slate-400 hover:text-yellow-400">
                      {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Send from the same wallet you entered above. Then paste the transaction signature below.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Transaction Signature</label>
                  <input type="text" placeholder="5xKX...AbC (your tx signature)" value={form.txSignature} onChange={(e) => setForm({ ...form, txSignature: e.target.value })} required />
                </div>
              </>
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="btn-outline px-6 py-3 flex items-center gap-1">
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              <button type="submit" disabled={loading} className="btn-gold flex-1 py-3.5 flex items-center justify-center gap-2" style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? "Processing..." : step < 3 ? (<>Next <ChevronRight size={16} /></>) : "Create Account"}
              </button>
            </div>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "#f0b429" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
