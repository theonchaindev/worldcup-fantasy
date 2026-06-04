"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { ArrowLeftRight, Search, CheckCircle } from "lucide-react";
import { getFlag } from "@/lib/flags";

interface Player {
  id: string; name: string; position: string; country: string; clubTeam: string;
  value: number; totalPoints: number; sofifaId?: string | null;
}

interface UserPlayer {
  slot: number; isSub: boolean; player: Player;
}

const posColors: Record<string, string> = { GK: "#f59e0b", DEF: "#22c55e", MID: "#3b82f6", FWD: "#ef4444" };

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
  const [teamData, setTeamData] = useState<{ formation: string; captainId: string | null; viceCaptainId: string | null; players: UserPlayer[] } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
    fetch("/api/players").then((r) => r.json()).then((d) => setAllPlayers(d.players || []));
    fetch("/api/team").then((r) => r.json()).then((d) => {
      if (d.team) {
        setTeamData(d.team);
        setMyPlayers(d.team.players);
      }
    });
  }, []);

  const myPlayerIds = myPlayers.map((p) => p.player.id);
  const teamValue = myPlayers.reduce((s, p) => s + p.player.value, 0);

  const filteredPlayers = allPlayers.filter((p) => {
    if (myPlayerIds.includes(p.id)) return false;
    if (filterPos !== "ALL" && p.position !== filterPos) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function selectOut(up: UserPlayer) {
    setSelectedOut(up);
    setFilterPos(up.player.position);
    setSearch("");
  }

  function selectIn(newPlayer: Player) {
    if (!selectedOut) return;
    const valueDiff = newPlayer.value - selectedOut.player.value;
    if (teamValue + valueDiff > 100) {
      setMsg({ type: "err", text: `Over budget by £${(teamValue + valueDiff - 100).toFixed(1)}m` }); return;
    }
    setTransfers((prev) => [...prev.filter((t) => t.outId !== selectedOut.player.id), { outId: selectedOut.player.id, inId: newPlayer.id }]);
    setMyPlayers((prev) => prev.map((p) =>
      p.player.id === selectedOut.player.id ? { ...p, player: newPlayer } : p
    ));
    setSelectedOut(null);
    setMsg(null);
  }

  async function saveTransfers() {
    if (!teamData || transfers.length === 0) return;
    setSaving(true);
    try {
      const updatedPlayers = myPlayers.map((p) => ({
        playerId: p.player.id, isSub: p.isSub, slot: p.slot,
      }));
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formation: teamData.formation,
          captainId: teamData.captainId,
          viceCaptainId: teamData.viceCaptainId,
          players: updatedPlayers,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "ok", text: `${transfers.length} transfer(s) saved!` });
        setTransfers([]);
      } else setMsg({ type: "err", text: data.error });
    } catch { setMsg({ type: "err", text: "Failed to save" }); }
    setSaving(false);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <NavBar clubName={user?.clubName} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ArrowLeftRight size={24} className="text-yellow-400" /> Transfers
            </h1>
            <p className="text-slate-400 mt-1">Budget: £{teamValue.toFixed(1)}m / £100m — {transfers.length} pending transfer{transfers.length !== 1 ? "s" : ""}</p>
          </div>
          {transfers.length > 0 && (
            <button onClick={saveTransfers} disabled={saving} className="btn-gold px-6 py-2.5 text-sm flex items-center gap-2">
              <CheckCircle size={14} /> {saving ? "Saving..." : `Save ${transfers.length} Transfer${transfers.length !== 1 ? "s" : ""}`}
            </button>
          )}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My squad */}
          <div>
            <h2 className="font-bold text-white mb-3">My Squad — click a player to transfer out</h2>
            {myPlayers.length === 0 ? (
              <div className="card-glass p-8 text-center text-slate-400">
                Build your team first before making transfers.
              </div>
            ) : (
              <div className="space-y-2">
                {["GK", "DEF", "MID", "FWD"].map((pos) => (
                  <div key={pos}>
                    <div className="text-xs font-bold tracking-widest text-slate-500 px-2 py-1">{pos}</div>
                    {myPlayers.filter((p) => p.player.position === pos).map((up) => {
                      const isSelectedOut = selectedOut?.player.id === up.player.id;
                      const isTransferred = transfers.some((t) => t.inId === up.player.id);
                      return (
                        <button
                          key={up.slot}
                          onClick={() => selectOut(up)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl text-left mb-1 transition-all"
                          style={{
                            background: isSelectedOut ? "rgba(240,180,41,0.1)" : "rgba(255,255,255,0.03)",
                            border: isSelectedOut ? "1px solid rgba(240,180,41,0.4)" : "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0d2a4a" }}>
                            {up.player.sofifaId ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={`https://cdn.sofifa.net/players/${up.player.sofifaId}/25_120x120.png`} alt={up.player.name} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold" style={{ color: posColors[pos] }}>{up.player.name.charAt(0)}</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white flex items-center gap-2">
                              {up.player.name}
                              {up.isSub && <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">SUB</span>}
                              {isTransferred && <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/50 text-green-400">NEW</span>}
                            </div>
                            <div className="text-xs text-slate-400">{getFlag(up.player.country)} {up.player.clubTeam} · {up.player.totalPoints} pts</div>
                          </div>
                          <div className="font-bold text-yellow-400">£{up.player.value}m</div>
                          <ArrowLeftRight size={14} className="text-slate-500" />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Player search */}
          <div>
            <h2 className="font-bold text-white mb-3">
              {selectedOut ? `Select replacement for ${selectedOut.player.name}` : "Select a player from your squad first"}
            </h2>

            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search players..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32, paddingTop: 8, paddingBottom: 8 }} disabled={!selectedOut} />
              </div>
              <select value={filterPos} onChange={(e) => setFilterPos(e.target.value)} style={{ padding: "8px 12px", width: "auto" }} disabled={!selectedOut}>
                {["ALL", "GK", "DEF", "MID", "FWD"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>

            {!selectedOut ? (
              <div className="card-glass p-12 text-center text-slate-500">
                Click a player on the left to select them for transfer
              </div>
            ) : (
              <div className="space-y-1 overflow-y-auto" style={{ maxHeight: "60vh" }}>
                {filteredPlayers.map((p) => {
                  const valueDiff = p.value - selectedOut.player.value;
                  const affordable = teamValue + valueDiff <= 100;
                  return (
                    <button
                      key={p.id}
                      onClick={() => affordable && selectIn(p)}
                      disabled={!affordable}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        opacity: affordable ? 1 : 0.4,
                        cursor: affordable ? "pointer" : "not-allowed",
                      }}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0d2a4a" }}>
                        {p.sofifaId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`https://cdn.sofifa.net/players/${p.sofifaId}/25_120x120.png`} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold" style={{ color: posColors[p.position] }}>{p.name.charAt(0)}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-xs text-slate-400">{getFlag(p.country)} {p.clubTeam} · {p.totalPoints} pts</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-400">£{p.value}m</div>
                        <div className={`text-xs font-medium ${valueDiff > 0 ? "text-red-400" : valueDiff < 0 ? "text-green-400" : "text-slate-400"}`}>
                          {valueDiff > 0 ? `+£${valueDiff.toFixed(1)}m` : valueDiff < 0 ? `-£${Math.abs(valueDiff).toFixed(1)}m` : "same"}
                        </div>
                      </div>
                    </button>
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
