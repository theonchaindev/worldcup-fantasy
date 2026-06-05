"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Copy, Check } from "lucide-react";
import { getFlag } from "@/lib/flags";
import { motion } from "framer-motion";

interface Member { user: { username: string; clubName: string; totalPoints: number; country: string }; }
interface League { id: string; name: string; code: string; owner: { username: string }; members: Member[]; }

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [user, setUser] = useState<{ clubName?: string } | null>(null);
  const [tab, setTab] = useState<"my" | "create" | "join">("my");
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user));
    loadLeagues();
  }, []);

  function loadLeagues() { fetch("/api/leagues").then(r => r.json()).then(d => setLeagues(d.leagues || [])); }

  async function createLeague(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/leagues", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", name: createName }) });
    const data = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: `Created! Code: ${data.league.code}` }); loadLeagues(); setTab("my"); } else setMsg({ type: "err", text: data.error });
    setLoading(false);
  }

  async function joinLeague(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/leagues", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "join", code: joinCode.toUpperCase() }) });
    const data = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: "Joined!" }); loadLeagues(); setTab("my"); } else setMsg({ type: "err", text: data.error });
    setLoading(false);
  }

  function copyCode(code: string) { navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 2000); }

  const tabs = [{ key: "my", label: "My leagues" }, { key: "create", label: "Create" }, { key: "join", label: "Join" }] as const;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <NavBar clubName={user?.clubName} />
      <div className="max-w-4xl mx-auto px-4" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", color: "var(--ink)", marginBottom: "0.4rem" }}>Mini Leagues</h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>Compete privately with friends using an invite code.</p>
        </div>

        {msg && (
          <div style={{ padding: "0.75rem 1rem", marginBottom: "1.25rem", borderRadius: "var(--r-md)", fontSize: "var(--text-sm)", background: msg.type === "ok" ? "oklch(0.56 0.18 145 / 0.1)" : "oklch(0.58 0.20 25 / 0.1)", border: `1px solid ${msg.type === "ok" ? "oklch(0.56 0.18 145 / 0.3)" : "oklch(0.58 0.20 25 / 0.3)"}`, color: msg.type === "ok" ? "var(--accent)" : "var(--danger)" }}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", background: "var(--surface)", borderRadius: "var(--r-md)", padding: "0.25rem", width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "0.5rem 1.25rem", fontSize: "var(--text-sm)", fontWeight: 600, borderRadius: "var(--r-sm)", border: "none", cursor: "pointer", background: tab === t.key ? "var(--surface-high)" : "transparent", color: tab === t.key ? "var(--ink)" : "var(--ink-3)", transition: "all var(--t-fast)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "my" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {leagues.length === 0 ? (
              <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", marginBottom: "1.25rem" }}>No leagues yet. Create one or join with a code.</p>
                <button onClick={() => setTab("create")} className="btn-primary">Create a league</button>
              </div>
            ) : leagues.map(league => (
              <motion.div key={league.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem", borderBottom: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)" }}>{league.name}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-3)", marginTop: "0.2rem" }}>Created by {league.owner.username} · {league.members.length} manager{league.members.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.875rem", background: "var(--surface-high)", border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
                    <code style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.08em" }}>{league.code}</code>
                    <button onClick={() => copyCode(league.code)} style={{ background: "none", border: "none", cursor: "pointer", color: copied === league.code ? "var(--accent)" : "var(--ink-3)", lineHeight: 0 }}>
                      {copied === league.code ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 36 }}>#</th>
                      <th>Manager</th>
                      <th>Club</th>
                      <th style={{ textAlign: "right" }}>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...league.members].sort((a, b) => b.user.totalPoints - a.user.totalPoints).map((m, i) => (
                      <tr key={i}>
                        <td style={{ color: "var(--ink-3)" }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{m.user.username}</td>
                        <td style={{ color: "var(--ink-2)" }}>{getFlag(m.user.country)} {m.user.clubName}</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--primary)" }}>{m.user.totalPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "create" && (
          <div className="card" style={{ padding: "2rem", maxWidth: 440 }}>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>Create a league</h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", marginBottom: "1.5rem" }}>A unique invite code will be generated for you to share.</p>
            <form onSubmit={createLeague} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="label">League name</label>
                <input type="text" placeholder="The Gaffer's League" value={createName} onChange={e => setCreateName(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center" }}>
                {loading ? "Creating…" : "Create league"}
              </button>
            </form>
          </div>
        )}

        {tab === "join" && (
          <div className="card" style={{ padding: "2rem", maxWidth: 440 }}>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>Join a league</h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", marginBottom: "1.5rem" }}>Enter the 6-character invite code shared by the league owner.</p>
            <form onSubmit={joinLeague} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="label">Invite code</label>
                <input type="text" placeholder="ABC123" maxLength={6} value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} required style={{ textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", fontSize: "var(--text-lg)", fontWeight: 700 }} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: "center" }}>
                {loading ? "Joining…" : "Join league"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
