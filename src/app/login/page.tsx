"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/dashboard");
  }

  return (
    <main style={{ background: "var(--ground)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStyle: "italic", fontSize: "var(--t-lg)", color: "var(--maroon)", textDecoration: "none", display: "block", marginBottom: "2.5rem" }}>
          World Cup Fantasy
        </Link>

        <h1 className="display" style={{ fontSize: "var(--t-3xl)", color: "var(--navy)", marginBottom: "0.35rem" }}>Sign in</h1>
        <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", marginBottom: "2rem" }}>Welcome back. Your squad awaits.</p>

        <div className="card" style={{ padding: "2rem" }}>
          {error && (
            <div style={{ padding: "0.75rem 1rem", borderRadius: 4, background: "rgba(160,26,26,0.07)", border: "1px solid rgba(160,26,26,0.25)", color: "#A01A1A", fontSize: "var(--t-sm)", marginBottom: "1.25rem" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: "2.75rem" }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--subtle)" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", padding: "0.75rem", marginTop: "0.25rem" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "var(--t-sm)", color: "var(--muted)" }}>
            No account?{" "}
            <Link href="/register" style={{ color: "var(--maroon)", fontWeight: 600, textDecoration: "none" }}>Enter the game</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
