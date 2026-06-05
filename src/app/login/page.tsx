"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

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
    <main style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-lg)", color: "var(--primary)", textDecoration: "none" }}>
            WC Fantasy
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", color: "var(--ink)", marginTop: "1.5rem", marginBottom: "0.4rem", lineHeight: 1 }}>
            Sign in
          </h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>Welcome back. Manage your squad.</p>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          {error && (
            <div style={{ background: "oklch(0.58 0.20 25 / 0.1)", border: "1px solid oklch(0.58 0.20 25 / 0.3)", borderRadius: "var(--r-md)", padding: "0.65rem 0.875rem", marginBottom: "1.25rem", fontSize: "var(--text-sm)", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label className="label">Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: "2.75rem" }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--ink-3)", cursor: "pointer" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>
            No account?{" "}
            <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Enter now</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
