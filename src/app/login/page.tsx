"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: "#050d1a" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(240,180,41,0.12) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-md">
        <motion.div variants={stagger(0.08)} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Trophy size={28} className="text-yellow-400" />
              <span className="text-xl font-black" style={{ color: "#f0b429" }}>WC Fantasy 2026</span>
            </Link>
            <h1 className="text-3xl font-black text-white mb-1">Welcome Back</h1>
            <p className="text-slate-400">Sign in to manage your squad</p>
          </motion.div>

          <motion.div variants={fadeUp} className="card-glass p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-5 p-3 rounded-xl flex items-center gap-2 text-sm"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
              >
                <AlertCircle size={15} /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={fadeUp}>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input type="email" placeholder="manager@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-3.5 text-base flex items-center justify-center gap-2"
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                      Signing in…
                    </>
                  ) : "Sign In"}
                </button>
              </motion.div>
            </form>

            <motion.p variants={fadeUp} className="text-center text-slate-400 text-sm mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold hover:underline" style={{ color: "#f0b429" }}>Register now</Link>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
