"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Users, Plus, Hash, Trophy, Copy, CheckCircle } from "lucide-react";
import { getFlag } from "@/lib/flags";

interface LeagueMember {
  user: { username: string; clubName: string; totalPoints: number; country: string };
}

interface League {
  id: string; name: string; code: string;
  owner: { username: string };
  members: LeagueMember[];
}

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
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
    loadLeagues();
  }, []);

  function loadLeagues() {
    fetch("/api/leagues").then((r) => r.json()).then((d) => setLeagues(d.leagues || []));
  }

  async function createLeague(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/leagues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", name: createName }),
    });
    const data = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: `League created! Code: ${data.league.code}` }); loadLeagues(); setTab("my"); }
    else setMsg({ type: "err", text: data.error });
    setLoading(false);
  }

  async function joinLeague(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/leagues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", code: joinCode.toUpperCase() }),
    });
    const data = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: "Joined league!" }); loadLeagues(); setTab("my"); }
    else setMsg({ type: "err", text: data.error });
    setLoading(false);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <NavBar clubName={user?.clubName} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Users size={28} className="text-yellow-400" />
          <div>
            <h1 className="text-2xl font-black text-white">Mini Leagues</h1>
            <p className="text-slate-400">Compete privately with friends</p>
          </div>
        </div>

        {msg && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{
            background: msg.type === "ok" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${msg.type === "ok" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: msg.type === "ok" ? "#86efac" : "#fca5a5",
          }}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: "my", label: "My Leagues" }, { key: "create", label: "Create League" }, { key: "join", label: "Join League" }].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "tab-active" : "btn-outline"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "my" && (
          <div className="space-y-6">
            {leagues.length === 0 ? (
              <div className="card-glass p-12 text-center">
                <Users size={40} className="text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">You haven&apos;t joined any leagues yet</p>
                <button onClick={() => setTab("create")} className="btn-gold px-6 py-2.5 text-sm inline-flex items-center gap-2">
                  <Plus size={14} /> Create a League
                </button>
              </div>
            ) : (
              leagues.map((league) => (
                <div key={league.id} className="card-glass p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-black text-white">{league.name}</h2>
                      <p className="text-sm text-slate-400">Created by {league.owner.username}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.2)" }}>
                      <Hash size={12} className="text-yellow-400" />
                      <code className="text-yellow-400 font-bold text-sm">{league.code}</code>
                      <button onClick={() => copyCode(league.code)} className="text-slate-400 hover:text-yellow-400">
                        {copied === league.code ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                    <Users size={12} />
                    {league.members.length} manager{league.members.length !== 1 ? "s" : ""}
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <th className="text-left py-2 px-2 text-slate-400 text-xs">#</th>
                        <th className="text-left py-2 px-2 text-slate-400 text-xs">Manager</th>
                        <th className="text-left py-2 px-2 text-slate-400 text-xs">Club</th>
                        <th className="text-right py-2 px-2 text-slate-400 text-xs">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {league.members
                        .sort((a, b) => b.user.totalPoints - a.user.totalPoints)
                        .map((m, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                            <td className="py-2.5 px-2 text-slate-500 text-xs">
                              {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
                            </td>
                            <td className="py-2.5 px-2 text-white">{m.user.username}</td>
                            <td className="py-2.5 px-2 text-slate-400">
                              {getFlag(m.user.country)} {m.user.clubName}
                            </td>
                            <td className="py-2.5 px-2 text-right font-black" style={{ color: "#f0b429" }}>
                              {m.user.totalPoints}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "create" && (
          <div className="card-glass p-8 max-w-md">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Plus size={18} className="text-yellow-400" /> Create a New League
            </h2>
            <p className="text-slate-400 text-sm mb-6">A unique invite code will be generated for you to share with friends.</p>
            <form onSubmit={createLeague} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">League Name</label>
                <input type="text" placeholder="The Gaffer's League" value={createName} onChange={(e) => setCreateName(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full py-3" style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? "Creating..." : "Create League"}
              </button>
            </form>
          </div>
        )}

        {tab === "join" && (
          <div className="card-glass p-8 max-w-md">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-400" /> Join a League
            </h2>
            <p className="text-slate-400 text-sm mb-6">Enter the 6-character invite code shared by the league creator.</p>
            <form onSubmit={joinLeague} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Invite Code</label>
                <input type="text" placeholder="ABC123" maxLength={6} value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} required className="uppercase tracking-widest text-center font-mono text-lg" />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full py-3" style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? "Joining..." : "Join League"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
