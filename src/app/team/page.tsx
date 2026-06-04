"use client";
import { useEffect, useState, useCallback } from "react";
import NavBar from "@/components/NavBar";
import PlayerCard from "@/components/PlayerCard";
import { RefreshCw, Save, X, Search, ChevronDown, Star, Users } from "lucide-react";
import { getFlag } from "@/lib/flags";

interface Player {
  id: string; name: string; position: string; country: string; clubTeam: string;
  value: number; totalPoints: number; sofifaId?: string | null; form?: number; ownership?: number;
}

interface Slot { playerId: string | null; isSub: boolean; slot: number; position?: string; }

const formations: Record<string, { def: number; mid: number; fwd: number }> = {
  "4-3-3": { def: 4, mid: 3, fwd: 3 },
  "4-4-2": { def: 4, mid: 4, fwd: 2 },
  "4-2-3-1": { def: 4, mid: 5, fwd: 1 },
  "3-5-2": { def: 3, mid: 5, fwd: 2 },
  "3-4-3": { def: 3, mid: 4, fwd: 3 },
  "5-3-2": { def: 5, mid: 3, fwd: 2 },
  "5-4-1": { def: 5, mid: 4, fwd: 1 },
};

const positionColors: Record<string, string> = { GK: "#f59e0b", DEF: "#22c55e", MID: "#3b82f6", FWD: "#ef4444" };

function buildSlots(formation: string): Slot[] {
  const { def, mid, fwd } = formations[formation] || formations["4-3-3"];
  const slots: Slot[] = [];
  let s = 0;
  slots.push({ playerId: null, isSub: false, slot: s++, position: "GK" });
  for (let i = 0; i < def; i++) slots.push({ playerId: null, isSub: false, slot: s++, position: "DEF" });
  for (let i = 0; i < mid; i++) slots.push({ playerId: null, isSub: false, slot: s++, position: "MID" });
  for (let i = 0; i < fwd; i++) slots.push({ playerId: null, isSub: false, slot: s++, position: "FWD" });
  // Subs
  slots.push({ playerId: null, isSub: true, slot: s++, position: "GK" });
  slots.push({ playerId: null, isSub: true, slot: s++, position: "DEF" });
  slots.push({ playerId: null, isSub: true, slot: s++, position: "MID" });
  slots.push({ playerId: null, isSub: true, slot: s++, position: "FWD" });
  return slots;
}

export default function TeamPage() {
  const [user, setUser] = useState<{ clubName?: string } | null>(null);
  const [formation, setFormation] = useState("4-3-3");
  const [slots, setSlots] = useState<Slot[]>(buildSlots("4-3-3"));
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<Slot | null>(null);
  const [search, setSearch] = useState("");
  const [filterPos, setFilterPos] = useState("ALL");
  const [filterCountry, setFilterCountry] = useState("ALL");
  const [sortBy, setSortBy] = useState("value");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ playerId: string; x: number; y: number } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
    fetch("/api/players").then((r) => r.json()).then((d) => setAllPlayers(d.players || []));
    fetch("/api/team").then((r) => r.json()).then((d) => {
      if (d.team) {
        setFormation(d.team.formation);
        setCaptainId(d.team.captainId);
        setViceCaptainId(d.team.viceCaptainId);
        const newSlots = buildSlots(d.team.formation);
        for (const up of d.team.players) {
          const slot = newSlots.find((s) => s.slot === up.slot);
          if (slot) slot.playerId = up.playerId;
        }
        setSlots(newSlots);
      }
    });
  }, []);

  useEffect(() => {
    let filtered = allPlayers;
    if (filterPos !== "ALL") filtered = filtered.filter((p) => p.position === filterPos);
    if (filterCountry !== "ALL") filtered = filtered.filter((p) => p.country === filterCountry);
    if (search) filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    filtered = [...filtered].sort((a, b) =>
      sortBy === "value" ? b.value - a.value : sortBy === "points" ? b.totalPoints - a.totalPoints : b.name.localeCompare(a.name)
    );
    setPlayers(filtered);
  }, [allPlayers, filterPos, filterCountry, search, sortBy]);

  const selectedIds = slots.map((s) => s.playerId).filter(Boolean) as string[];
  const selectedPlayers = allPlayers.filter((p) => selectedIds.includes(p.id));
  const totalValue = selectedPlayers.reduce((s, p) => s + p.value, 0);
  const remaining = 100 - totalValue;
  const countries = ["ALL", ...Array.from(new Set(allPlayers.map((p) => p.country))).sort()];

  function changeFormation(f: string) {
    setFormation(f);
    const newSlots = buildSlots(f);
    const oldSlots = slots;
    // Try to preserve GK
    const gkSlot = oldSlots.find((s) => !s.isSub && s.position === "GK");
    if (gkSlot?.playerId) {
      const newGk = newSlots.find((s) => !s.isSub && s.position === "GK");
      if (newGk) newGk.playerId = gkSlot.playerId;
    }
    // Preserve subs
    const subSlots = oldSlots.filter((s) => s.isSub);
    const newSubSlots = newSlots.filter((s) => s.isSub);
    subSlots.forEach((oldSub, i) => {
      if (newSubSlots[i]) newSubSlots[i].playerId = oldSub.playerId;
    });
    setSlots(newSlots);
  }

  function openPicker(slot: Slot) {
    setPickerSlot(slot);
    setFilterPos(slot.position || "ALL");
    setSearch("");
    setPickerOpen(true);
  }

  function selectPlayer(player: Player) {
    if (!pickerSlot) return;
    // Check budget
    const currentPlayer = pickerSlot.playerId ? allPlayers.find((p) => p.id === pickerSlot.playerId) : null;
    const newTotal = totalValue - (currentPlayer?.value || 0) + player.value;
    if (newTotal > 100) { setMessage({ type: "err", text: `Over budget by £${(newTotal - 100).toFixed(1)}m` }); return; }
    // Check not already selected
    if (selectedIds.includes(player.id) && player.id !== pickerSlot.playerId) {
      setMessage({ type: "err", text: `${player.name} is already in your squad` }); return;
    }
    setSlots((prev) => prev.map((s) => s.slot === pickerSlot.slot ? { ...s, playerId: player.id } : s));
    setPickerOpen(false);
    setMessage(null);
  }

  function removePlayer(slot: Slot) {
    setSlots((prev) => prev.map((s) => s.slot === slot.slot ? { ...s, playerId: null } : s));
    if (captainId === slot.playerId) setCaptainId(null);
    if (viceCaptainId === slot.playerId) setViceCaptainId(null);
  }

  const autoPick = useCallback(() => {
    const sortedPlayers = [...allPlayers].sort((a, b) => b.value - a.value);
    const newSlots = buildSlots(formation);
    let budget = 100;
    for (const slot of newSlots) {
      if (!slot.position) continue;
      const eligible = sortedPlayers.filter((p) =>
        p.position === slot.position &&
        !newSlots.some((s) => s.playerId === p.id) &&
        p.value <= budget - (newSlots.filter((s) => !s.playerId).length - 1) * 1.5
      );
      if (eligible[0]) {
        slot.playerId = eligible[0].id;
        budget -= eligible[0].value;
      }
    }
    setSlots(newSlots);
    const gk = newSlots.find((s) => !s.isSub && s.position === "GK")?.playerId;
    setCaptainId(gk || null);
    setMessage({ type: "ok", text: "Auto-pick complete!" });
  }, [allPlayers, formation]);

  async function saveTeam() {
    if (selectedIds.length !== 15) { setMessage({ type: "err", text: "Pick all 15 players first" }); return; }
    if (!captainId) { setMessage({ type: "err", text: "Select a captain" }); return; }
    if (!viceCaptainId) { setMessage({ type: "err", text: "Select a vice-captain" }); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formation, captainId, viceCaptainId,
          players: slots.filter((s) => s.playerId).map((s) => ({ playerId: s.playerId, isSub: s.isSub, slot: s.slot })),
        }),
      });
      const data = await res.json();
      if (!res.ok) setMessage({ type: "err", text: data.error });
      else setMessage({ type: "ok", text: "Team saved successfully!" });
    } catch {
      setMessage({ type: "err", text: "Failed to save team" });
    } finally {
      setSaving(false);
    }
  }

  function getPlayerById(id: string | null) {
    if (!id) return null;
    return allPlayers.find((p) => p.id === id) || null;
  }

  // Render pitch rows
  const { def, mid, fwd } = formations[formation] || formations["4-3-3"];
  const gkSlots = slots.filter((s) => !s.isSub && s.position === "GK");
  const defSlots = slots.filter((s) => !s.isSub && s.position === "DEF");
  const midSlots = slots.filter((s) => !s.isSub && s.position === "MID");
  const fwdSlots = slots.filter((s) => !s.isSub && s.position === "FWD");
  const subSlots = slots.filter((s) => s.isSub);
  void def; void mid; void fwd;

  function PitchRow({ rowSlots, label }: { rowSlots: Slot[]; label: string }) {
    return (
      <div className="flex flex-col items-center gap-1 py-2">
        <div className="text-xs text-white/40 font-bold tracking-widest">{label}</div>
        <div className="flex justify-center gap-3 flex-wrap">
          {rowSlots.map((slot) => {
            const player = getPlayerById(slot.playerId);
            return (
              <div key={slot.slot} className="relative">
                {player ? (
                  <PlayerCard
                    player={player}
                    isCaptain={captainId === player.id}
                    isViceCaptain={viceCaptainId === player.id}
                    isSub={slot.isSub}
                    onClick={() => setContextMenu({ playerId: player.id, x: 0, y: 0 })}
                    onRemove={() => removePlayer(slot)}
                  />
                ) : (
                  <div
                    onClick={() => openPicker(slot)}
                    className="player-token empty flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105"
                    style={{ width: 64, height: 80, borderRadius: 12, background: "rgba(240,180,41,0.04)" }}
                  >
                    <div className="text-2xl text-yellow-400/30">+</div>
                    <div className="text-xs text-yellow-400/40 mt-1">{slot.position}</div>
                  </div>
                )}
                {/* Context menu for captain selection */}
                {contextMenu?.playerId === player?.id && (
                  <div
                    className="absolute z-50 rounded-xl shadow-2xl py-1 min-w-36"
                    style={{ background: "#0d1f3c", border: "1px solid rgba(240,180,41,0.3)", top: "100%", left: "50%", transform: "translateX(-50%)" }}
                  >
                    <button className="w-full px-4 py-2 text-xs text-left hover:bg-white/5 text-yellow-400" onClick={() => { setCaptainId(player!.id); setContextMenu(null); }}>
                      ⭐ Set as Captain
                    </button>
                    <button className="w-full px-4 py-2 text-xs text-left hover:bg-white/5 text-slate-300" onClick={() => { setViceCaptainId(player!.id); setContextMenu(null); }}>
                      Set as Vice-Captain
                    </button>
                    <button className="w-full px-4 py-2 text-xs text-left hover:bg-white/5 text-slate-300" onClick={() => { openPicker(slot); setContextMenu(null); }}>
                      Swap Player
                    </button>
                    <button className="w-full px-4 py-2 text-xs text-left hover:bg-white/5 text-red-400" onClick={() => { removePlayer(slot); setContextMenu(null); }}>
                      Remove
                    </button>
                    <button className="w-full px-4 py-2 text-xs text-left hover:bg-white/5 text-slate-500" onClick={() => setContextMenu(null)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }} onClick={() => setContextMenu(null)}>
      <NavBar clubName={user?.clubName} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Pitch side */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative">
                <select className="appearance-none pr-8 text-sm" style={{ paddingTop: 8, paddingBottom: 8 }} value={formation} onChange={(e) => changeFormation(e.target.value)}>
                  {Object.keys(formations).map((f) => <option key={f}>{f}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <button onClick={autoPick} className="btn-outline px-4 py-2 text-sm flex items-center gap-1.5">
                <RefreshCw size={14} /> Auto-Pick
              </button>

              <div className="ml-auto flex items-center gap-3">
                <div className="text-sm">
                  <span className="text-slate-400">Budget: </span>
                  <span className={`font-bold ${remaining < 0 ? "text-red-400" : "text-green-400"}`}>
                    £{remaining.toFixed(1)}m left
                  </span>
                  <span className="text-slate-500"> / £100m</span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-400">Players: </span>
                  <span className={`font-bold ${selectedIds.length === 15 ? "text-green-400" : "text-yellow-400"}`}>{selectedIds.length}/15</span>
                </div>
              </div>

              <button onClick={saveTeam} disabled={saving} className="btn-gold px-5 py-2 text-sm flex items-center gap-1.5">
                <Save size={14} /> {saving ? "Saving..." : "Save Team"}
              </button>
            </div>

            {message && (
              <div className="mb-4 p-3 rounded-lg text-sm flex items-center justify-between" style={{
                background: message.type === "ok" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${message.type === "ok" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: message.type === "ok" ? "#86efac" : "#fca5a5",
              }}>
                {message.text}
                <button onClick={() => setMessage(null)}><X size={14} /></button>
              </div>
            )}

            {/* Pitch */}
            <div className="rounded-2xl overflow-hidden pitch-bg shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              {/* Pitch markings overlay */}
              <div className="relative">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "rgba(255,255,255,0.1)" }} />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.12)" }} />
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-12 rounded-b-xl" style={{ border: "1px solid rgba(255,255,255,0.12)", borderTop: "none" }} />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-12 rounded-t-xl" style={{ border: "1px solid rgba(255,255,255,0.12)", borderBottom: "none" }} />
                </div>

                <div className="px-4 pt-4 pb-2">
                  <PitchRow rowSlots={fwdSlots} label="FWD" />
                  <PitchRow rowSlots={midSlots} label="MID" />
                  <PitchRow rowSlots={defSlots} label="DEF" />
                  <PitchRow rowSlots={gkSlots} label="GK" />
                </div>

                {/* Subs bench */}
                <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.25)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="text-xs text-white/40 font-bold tracking-widest text-center mb-2">SUBSTITUTES</div>
                  <div className="flex justify-center gap-3">
                    {subSlots.map((slot) => {
                      const player = getPlayerById(slot.playerId);
                      return (
                        <div key={slot.slot} className="relative">
                          {player ? (
                            <PlayerCard
                              player={player}
                              isSub
                              onClick={() => setContextMenu({ playerId: player.id, x: 0, y: 0 })}
                              onRemove={() => removePlayer(slot)}
                            />
                          ) : (
                            <div
                              onClick={() => openPicker(slot)}
                              className="player-token empty flex flex-col items-center justify-center cursor-pointer"
                              style={{ width: 64, height: 80, borderRadius: 12, background: "rgba(240,180,41,0.03)" }}
                            >
                              <div className="text-xl text-yellow-400/20">+</div>
                              <div className="text-xs text-yellow-400/30 mt-1">{slot.position}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Captain legend */}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 justify-center">
              <span><span className="text-yellow-400 font-bold">C</span> = Captain (×2 pts)</span>
              <span><span className="font-bold text-slate-300">V</span> = Vice-Captain (×1.5 pts)</span>
              <span>Click player to set captain/VC</span>
            </div>
          </div>

          {/* Player picker panel (desktop) */}
          <div className="w-full lg:w-80">
            <div className="card-glass p-4 sticky top-20">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Users size={16} className="text-yellow-400" /> Player List
              </h3>

              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search players..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32, paddingTop: 8, paddingBottom: 8 }} />
              </div>

              <div className="flex gap-2 mb-3">
                <select className="flex-1 text-xs" style={{ padding: "6px 8px" }} value={filterPos} onChange={(e) => setFilterPos(e.target.value)}>
                  {["ALL", "GK", "DEF", "MID", "FWD"].map((p) => <option key={p}>{p}</option>)}
                </select>
                <select className="flex-1 text-xs" style={{ padding: "6px 8px" }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="value">By Value</option>
                  <option value="points">By Points</option>
                  <option value="name">By Name</option>
                </select>
              </div>

              <select className="w-full text-xs mb-3" style={{ padding: "6px 8px" }} value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
                {countries.map((c) => <option key={c}>{c}</option>)}
              </select>

              <div className="space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
                {players.slice(0, 100).map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (!isSelected) {
                          if (pickerSlot) { selectPlayer(p); }
                          else {
                            const emptySlot = slots.find((s) => !s.playerId && s.position === p.position);
                            if (emptySlot) { setPickerSlot(emptySlot); selectPlayer(p); }
                            else setMessage({ type: "err", text: `No empty ${p.position} slot. Click a slot on the pitch first.` });
                          }
                        }
                      }}
                      disabled={isSelected}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all"
                      style={{
                        background: isSelected ? "rgba(240,180,41,0.05)" : "rgba(255,255,255,0.02)",
                        border: isSelected ? "1px solid rgba(240,180,41,0.2)" : "1px solid rgba(255,255,255,0.05)",
                        opacity: isSelected ? 0.5 : 1,
                        cursor: isSelected ? "default" : "pointer",
                      }}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0d2a4a" }}>
                        {p.sofifaId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`https://cdn.sofifa.net/players/${p.sofifaId}/25_120x120.png`} alt={p.name} width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ color: positionColors[p.position] }}>
                            {p.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                        <div className="text-xs text-slate-500">{getFlag(p.country)} {p.clubTeam}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-bold px-1 rounded" style={{ background: `${positionColors[p.position]}20`, color: positionColors[p.position] }}>{p.position}</span>
                        <div className="text-xs font-bold text-yellow-400 mt-0.5">£{p.value}m</div>
                      </div>
                      {isSelected && <Star size={12} className="text-yellow-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="w-full md:max-w-lg max-h-[85vh] rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col" style={{ background: "#0d1f3c", border: "1px solid rgba(240,180,41,0.2)" }}>
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 className="font-bold text-white">Select {pickerSlot?.position}</h3>
              <button onClick={() => setPickerOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-4">
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32 }} />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-1">
              {players.filter((p) => !pickerSlot?.position || p.position === pickerSlot.position).map((p) => {
                const isSelected = selectedIds.includes(p.id) && p.id !== pickerSlot?.playerId;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectPlayer(p)}
                    disabled={isSelected}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", opacity: isSelected ? 0.4 : 1 }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0d2a4a" }}>
                      {p.sofifaId ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`https://cdn.sofifa.net/players/${p.sofifaId}/25_120x120.png`} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold" style={{ color: positionColors[p.position] }}>{p.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-xs text-slate-400">{getFlag(p.country)} {p.clubTeam} · {p.totalPoints} pts</div>
                    </div>
                    <div className="font-bold text-yellow-400">£{p.value}m</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
