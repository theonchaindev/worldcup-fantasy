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
  const [user, setUser]       = useState<{ clubName?: string } | null>(null);
  const [tab, setTab]         = useState<"my" | "create" | "join">("my");
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode]     = useState("");
  const [msg, setMsg]         = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user));
    loadLeagues();
  }, []);

  function loadLeagues() { fetch("/api/leagues").then(r => r.json()).then(d => setLeagues(d.leagues || [])); }

  async function createLeague(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const res = await fetch("/api/leagues", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", name: createName }) });
    const data = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: `League created — code: ${data.league.code}` }); loadLeagues(); setTab("my"); } else setMsg({ type: "err", text: data.error });
    setLoading(false);
  }

  async function joinLeague(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const res = await fetch("/api/leagues", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "join", code: joinCode.toUpperCase() }) });
    const data = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: "Joined!" }); loadLeagues(); setTab("my"); } else setMsg({ type: "err", text: data.error });
    setLoading(false);
  }

  function copy(code: string) { navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 2000); }

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label style={{ display: "block", fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{children}</label>
  );

  return (
    <div style={{ background: "var(--ground)", minHeight: "100vh" }}>
      <NavBar clubName={user?.clubName} />
      <div className="wrap" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "0.25rem" }}>Mini Leagues</h1>
          <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)" }}>Private competitions with friends using a six-character invite code.</p>
        </div>

        {msg && (
          <div style={{ padding: "0.75rem 1rem", borderRadius: 4, marginBottom: "1.25rem", fontSize: "var(--t-sm)", background: msg.type === "ok" ? "rgba(26,122,62,0.08)" : "rgba(160,26,26,0.08)", border: `1px solid ${msg.type === "ok" ? "rgba(26,122,62,0.25)" : "rgba(160,26,26,0.25)"}`, color: msg.type === "ok" ? "var(--pos-def)" : "#A01A1A" }}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, width: "fit-content", overflow: "hidden" }}>
          {[{ key: "my", label: "My leagues" }, { key: "create", label: "Create" }, { key: "join", label: "Join" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)} style={{ padding: "0.5rem 1.25rem", fontSize: "var(--t-sm)", fontWeight: 600, border: "none", cursor: "pointer", background: tab === t.key ? "var(--maroon)" : "transparent", color: tab === t.key ? "#fff" : "var(--muted)", transition: "all var(--t-fast)" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "my" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {leagues.length === 0 ? (
              <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", marginBottom: "1.25rem" }}>No leagues yet.</p>
                <button onClick={() => setTab("create")} className="btn btn-primary">Create a league</button>
              </div>
            ) : leagues.map(league => (
              <motion.div key={league.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <h2 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)" }}>{league.name}</h2>
                    <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", marginTop: "0.2rem" }}>{league.members.length} manager{league.members.length !== 1 ? "s" : ""} · Created by {league.owner.username}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.875rem", background: "var(--ground)", border: "1px solid var(--border)", borderRadius: 4 }}>
                    <code style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "var(--maroon)", letterSpacing: "0.1em", fontFamily: "monospace" }}>{league.code}</code>
                    <button onClick={() => copy(league.code)} style={{ background: "none", border: "none", cursor: "pointer", color: copied === league.code ? "var(--pos-def)" : "var(--subtle)", lineHeight: 0 }}>
                      {copied === league.code ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>
                <table className="data-table">
                  <thead><tr><th style={{ width: 36 }}>#</th><th>Manager</th><th>Club</th><th style={{ textAlign: "right" }}>Points</th></tr></thead>
                  <tbody>
                    {[...league.members].sort((a, b) => b.user.totalPoints - a.user.totalPoints).map((m, i) => (
                      <tr key={i}>
                        <td style={{ color: "var(--subtle)" }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{m.user.username}</td>
                        <td style={{ color: "var(--muted)" }}>{getFlag(m.user.country)} {m.user.clubName}</td>
                        <td style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--t-md)", color: "var(--maroon)", fontVariantNumeric: "tabular-nums" }}>{m.user.totalPoints}</td>
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
            <h2 className="display" style={{ fontSize: "var(--t-xl)", color: "var(--navy)", marginBottom: "0.35rem" }}>Create a league</h2>
            <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", marginBottom: "1.5rem" }}>A unique invite code will be generated to share with friends.</p>
            <form onSubmit={createLeague} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><Label>League name</Label><input type="text" placeholder="The Gaffer's League" value={createName} onChange={e => setCreateName(e.target.value)} required /></div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>{loading ? "Creating…" : "Create league"}</button>
            </form>
          </div>
        )}

        {tab === "join" && (
          <div className="card" style={{ padding: "2rem", maxWidth: 440 }}>
            <h2 className="display" style={{ fontSize: "var(--t-xl)", color: "var(--navy)", marginBottom: "0.35rem" }}>Join a league</h2>
            <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", marginBottom: "1.5rem" }}>Enter the six-character code shared by the league owner.</p>
            <form onSubmit={joinLeague} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><Label>Invite code</Label><input type="text" placeholder="ABC123" maxLength={6} value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} required style={{ textTransform: "uppercase", letterSpacing: "0.15em", textAlign: "center", fontSize: "var(--t-lg)", fontWeight: 700 }} /></div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>{loading ? "Joining…" : "Join league"}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
