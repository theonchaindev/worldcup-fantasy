"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Search, ArrowRight } from "lucide-react";
import { getFlag } from "@/lib/flags";
import { motion } from "framer-motion";

interface Player { id: string; name: string; position: string; country: string; clubTeam: string; value: number; totalPoints: number; sofifaId?: string | null; }
interface UserPlayer { slot: number; isSub: boolean; player: Player; }

const posColors: Record<string, string> = { GK: "oklch(0.72 0.15 75)", DEF: "oklch(0.62 0.17 145)", MID: "oklch(0.60 0.17 230)", FWD: "oklch(0.60 0.21 25)" };
const posClass: Record<string, string> = { GK: "pos-gk", DEF: "pos-def", MID: "pos-mid", FWD: "pos-fwd" };

export default function TransfersPage() {
  const [user, setUser] = useState<{ clubName?: string } | null>(null);
  const [myPlayers, setMyPlayers] = useState<UserPlayer[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedOut, setSelectedOut] = useState<UserPlayer | null>(null);
  const [search, setSearch] = useState("");
  const [filterPos, setFilterPos] = useState("ALL");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [transfers, setTransfers] = useState<{ outId: string; inId: string }[]>([]);
  const [teamData, setTeamData] = useState<{ formation: string; captainId: string | null; viceCaptainId: string | null } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user));
    fetch("/api/players").then(r => r.json()).then(d => setAllPlayers(d.players || []));
    fetch("/api/team").then(r => r.json()).then(d => {
      if (d.team) { setTeamData(d.team); setMyPlayers(d.team.players); }
    });
  }, []);

  const myIds = myPlayers.map(p => p.player.id);
  const teamValue = myPlayers.reduce((s, p) => s + p.player.value, 0);
  const filteredIn = allPlayers.filter(p => {
    if (myIds.includes(p.id)) return false;
    if (filterPos !== "ALL" && p.position !== filterPos) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function selectOut(up: UserPlayer) { setSelectedOut(up); setFilterPos(up.player.position); setSearch(""); setMsg(null); }

  function selectIn(np: Player) {
    if (!selectedOut) return;
    const diff = np.value - selectedOut.player.value;
    if (teamValue + diff > 100) { setMsg({ type: "err", text: `Over budget by £${(teamValue + diff - 100).toFixed(1)}m` }); return; }
    setTransfers(prev => [...prev.filter(t => t.outId !== selectedOut.player.id), { outId: selectedOut.player.id, inId: np.id }]);
    setMyPlayers(prev => prev.map(p => p.player.id === selectedOut.player.id ? { ...p, player: np } : p));
    setSelectedOut(null);
    setMsg(null);
  }

  async function save() {
    if (!teamData || transfers.length === 0) return;
    setSaving(true);
    const res = await fetch("/api/team", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formation: teamData.formation, captainId: teamData.captainId, viceCaptainId: teamData.viceCaptainId, players: myPlayers.map(p => ({ playerId: p.player.id, isSub: p.isSub, slot: p.slot })) }),
    });
    const data = await res.json();
    if (res.ok) { setMsg({ type: "ok", text: `${transfers.length} transfer${transfers.length !== 1 ? "s" : ""} saved.` }); setTransfers([]); }
    else setMsg({ type: "err", text: data.error });
    setSaving(false);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <NavBar clubName={user?.clubName} />
      <div className="max-w-7xl mx-auto px-4" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", color: "var(--ink)", marginBottom: "0.3rem" }}>Transfers</h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>
              Budget: <span style={{ color: "var(--ink)", fontWeight: 600 }}>£{teamValue.toFixed(1)}m / £100m</span>
              {transfers.length > 0 && <span style={{ color: "var(--primary)", fontWeight: 600 }}> · {transfers.length} pending</span>}
            </p>
          </div>
          {transfers.length > 0 && (
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? "Saving…" : `Save ${transfers.length} transfer${transfers.length !== 1 ? "s" : ""}`}
            </button>
          )}
        </div>

        {msg && (
          <div style={{ padding: "0.75rem 1rem", marginBottom: "1.25rem", borderRadius: "var(--r-md)", fontSize: "var(--text-sm)", background: msg.type === "ok" ? "oklch(0.56 0.18 145 / 0.1)" : "oklch(0.58 0.20 25 / 0.1)", border: `1px solid ${msg.type === "ok" ? "oklch(0.56 0.18 145 / 0.3)" : "oklch(0.58 0.20 25 / 0.3)"}`, color: msg.type === "ok" ? "var(--accent)" : "var(--danger)" }}>
            {msg.text}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {/* My squad */}
          <div>
            <h2 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.875rem" }}>My squad — select to transfer out</h2>
            {myPlayers.length === 0 ? (
              <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>Build your squad first.</p>
              </div>
            ) : (
              <div className="card" style={{ overflow: "hidden" }}>
                {["GK", "DEF", "MID", "FWD"].map(pos => {
                  const posPlayers = myPlayers.filter(p => p.player.position === pos);
                  if (!posPlayers.length) return null;
                  return (
                    <div key={pos}>
                      <div style={{ padding: "0.4rem 1rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--ink-3)", background: "var(--surface-high)", borderBottom: "1px solid var(--border-subtle)", letterSpacing: "0.06em" }}>{pos}</div>
                      {posPlayers.map(up => {
                        const isOut = selectedOut?.player.id === up.player.id;
                        const isNew = transfers.some(t => t.inId === up.player.id);
                        return (
                          <motion.button
                            key={up.slot}
                            onClick={() => selectOut(up)}
                            whileHover={{ backgroundColor: "oklch(0.95 0 0 / 0.03)" }}
                            style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", width: "100%", background: isOut ? "var(--primary-bg)" : "transparent", border: "none", cursor: "pointer", borderBottom: "1px solid var(--border-subtle)", borderLeft: `3px solid ${isOut ? "var(--primary)" : "transparent"}`, textAlign: "left", transition: "background var(--t-fast)" }}
                          >
                            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: "var(--surface-high)", flexShrink: 0, position: "relative" }}>
                              <img src={`/api/player-image/${up.player.id}`} alt={up.player.name} width={36} height={36} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                                onError={e => { const t = e.target as HTMLImageElement; t.style.display = "none"; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = "flex"; }} />
                              <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: posColors[pos], fontFamily: "var(--font-display)" }}>
                                {up.player.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                              </div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{up.player.name}</span>
                                {up.isSub && <span className="chip chip-muted">SUB</span>}
                                {isNew && <span className="chip chip-green">NEW</span>}
                              </div>
                              <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)" }}>{getFlag(up.player.country)} {up.player.clubTeam}</div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--primary)" }}>£{up.player.value}m</div>
                              <ArrowRight size={12} style={{ color: "var(--ink-3)", marginTop: 2 }} />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Player search */}
          <div>
            <h2 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.875rem" }}>
              {selectedOut ? `Replace ${selectedOut.player.name}` : "Select a player to transfer out first"}
            </h2>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.625rem" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", pointerEvents: "none" }} />
                <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} disabled={!selectedOut} style={{ paddingLeft: "2.25rem" }} />
              </div>
              <select value={filterPos} onChange={e => setFilterPos(e.target.value)} disabled={!selectedOut} style={{ width: "auto" }}>
                {["ALL", "GK", "DEF", "MID", "FWD"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            {!selectedOut ? (
              <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-3)" }}>Click a player on the left to select them for transfer.</p>
              </div>
            ) : (
              <div className="card" style={{ overflow: "hidden", maxHeight: "65vh", overflowY: "auto" }}>
                {filteredIn.map(p => {
                  const diff = p.value - selectedOut.player.value;
                  const canAfford = teamValue + diff <= 100;
                  return (
                    <motion.button
                      key={p.id}
                      onClick={() => canAfford && selectIn(p)}
                      disabled={!canAfford}
                      whileHover={canAfford ? { backgroundColor: "oklch(0.95 0 0 / 0.03)" } : {}}
                      style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", width: "100%", background: "transparent", border: "none", borderBottom: "1px solid var(--border-subtle)", cursor: canAfford ? "pointer" : "not-allowed", opacity: canAfford ? 1 : 0.35, textAlign: "left", transition: "background var(--t-fast)" }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: "var(--surface-high)", flexShrink: 0, position: "relative" }}>
                        <img src={`/api/player-image/${p.id}`} alt={p.name} width={36} height={36} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                          onError={e => { const t = e.target as HTMLImageElement; t.style.display = "none"; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = "flex"; }} />
                        <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: posColors[p.position], fontFamily: "var(--font-display)" }}>
                          {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)" }}>{getFlag(p.country)} {p.clubTeam}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--primary)" }}>£{p.value}m</div>
                        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: diff > 0 ? "var(--danger)" : diff < 0 ? "var(--accent)" : "var(--ink-3)" }}>
                          {diff > 0 ? `+£${diff.toFixed(1)}m` : diff < 0 ? `−£${Math.abs(diff).toFixed(1)}m` : "same"}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
