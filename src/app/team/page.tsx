"use client";
import { useEffect, useState, useCallback } from "react";
import NavBar from "@/components/NavBar";
import PlayerCard from "@/components/PlayerCard";
import { RefreshCw, Save, X, Search, ChevronDown, Star, Users, CheckCircle } from "lucide-react";
import { getFlag } from "@/lib/flags";
import { motion, AnimatePresence } from "framer-motion";
import { modalOverlay, mobileSheet } from "@/lib/motion";

interface Player { id: string; name: string; position: string; country: string; clubTeam: string; value: number; totalPoints: number; sofifaId?: string | null; }
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

const posColors: Record<string, string> = { GK: "#f59e0b", DEF: "#22c55e", MID: "#3b82f6", FWD: "#ef4444" };

function buildSlots(formation: string): Slot[] {
  const { def, mid, fwd } = formations[formation] || formations["4-3-3"];
  const slots: Slot[] = [];
  let s = 0;
  slots.push({ playerId: null, isSub: false, slot: s++, position: "GK" });
  for (let i = 0; i < def; i++) slots.push({ playerId: null, isSub: false, slot: s++, position: "DEF" });
  for (let i = 0; i < mid; i++) slots.push({ playerId: null, isSub: false, slot: s++, position: "MID" });
  for (let i = 0; i < fwd; i++) slots.push({ playerId: null, isSub: false, slot: s++, position: "FWD" });
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
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<string | null>(null);
  const [pickerSlot, setPickerSlot] = useState<Slot | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [contextSlot, setContextSlot] = useState<Slot | null>(null);
  const [search, setSearch] = useState("");
  const [filterPos, setFilterPos] = useState("ALL");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user));
    fetch("/api/players").then(r => r.json()).then(d => setAllPlayers(d.players || []));
    fetch("/api/team").then(r => r.json()).then(d => {
      if (!d.team) return;
      setFormation(d.team.formation);
      setCaptainId(d.team.captainId);
      setViceCaptainId(d.team.viceCaptainId);
      const newSlots = buildSlots(d.team.formation);
      for (const up of d.team.players) {
        const slot = newSlots.find(s => s.slot === up.slot);
        if (slot) slot.playerId = up.playerId;
      }
      setSlots(newSlots);
    });
  }, []);

  useEffect(() => {
    let f = allPlayers;
    if (filterPos !== "ALL") f = f.filter(p => p.position === filterPos);
    if (search) f = f.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredPlayers(f.sort((a, b) => b.value - a.value));
  }, [allPlayers, filterPos, search]);

  const selectedIds = slots.map(s => s.playerId).filter(Boolean) as string[];
  const selectedPlayers = allPlayers.filter(p => selectedIds.includes(p.id));
  const totalValue = selectedPlayers.reduce((s, p) => s + p.value, 0);
  const remaining = 100 - totalValue;

  function changeFormation(f: string) {
    const newSlots = buildSlots(f);
    const gk = slots.find(s => !s.isSub && s.position === "GK");
    if (gk?.playerId) { const ng = newSlots.find(s => !s.isSub && s.position === "GK"); if (ng) ng.playerId = gk.playerId; }
    const oldSubs = slots.filter(s => s.isSub);
    const newSubs = newSlots.filter(s => s.isSub);
    oldSubs.forEach((os, i) => { if (newSubs[i]) newSubs[i].playerId = os.playerId; });
    setFormation(f);
    setSlots(newSlots);
  }

  function openPicker(slot: Slot) {
    setPickerSlot(slot);
    setFilterPos(slot.position || "ALL");
    setSearch("");
    setContextSlot(null);
    setPickerOpen(true);
  }

  function selectPlayer(player: Player) {
    if (!pickerSlot) return;
    const curr = pickerSlot.playerId ? allPlayers.find(p => p.id === pickerSlot.playerId) : null;
    const newTotal = totalValue - (curr?.value || 0) + player.value;
    if (newTotal > 100) { setMessage({ type: "err", text: `Over budget by £${(newTotal - 100).toFixed(1)}m` }); return; }
    if (selectedIds.includes(player.id) && player.id !== pickerSlot.playerId) { setMessage({ type: "err", text: `${player.name} already in squad` }); return; }
    setSlots(prev => prev.map(s => s.slot === pickerSlot.slot ? { ...s, playerId: player.id } : s));
    setPickerOpen(false);
    setMessage(null);
  }

  function removePlayer(slot: Slot) {
    setSlots(prev => prev.map(s => s.slot === slot.slot ? { ...s, playerId: null } : s));
    if (captainId === slot.playerId) setCaptainId(null);
    if (viceCaptainId === slot.playerId) setViceCaptainId(null);
  }

  const autoPick = useCallback(() => {
    const sorted = [...allPlayers].sort((a, b) => b.value - a.value);
    const newSlots = buildSlots(formation);
    let budget = 100;
    for (const slot of newSlots) {
      if (!slot.position) continue;
      const eligible = sorted.filter(p => p.position === slot.position && !newSlots.some(s => s.playerId === p.id) && p.value <= budget - (newSlots.filter(s => !s.playerId).length - 1) * 1.5);
      if (eligible[0]) { slot.playerId = eligible[0].id; budget -= eligible[0].value; }
    }
    setSlots(newSlots);
    const gk = newSlots.find(s => !s.isSub && s.position === "GK")?.playerId;
    setCaptainId(gk || null);
    const vc = newSlots.find(s => !s.isSub && s.position === "FWD")?.playerId;
    setViceCaptainId(vc || null);
    setMessage({ type: "ok", text: "Auto-pick complete!" });
  }, [allPlayers, formation]);

  async function saveTeam() {
    if (selectedIds.length !== 15) { setMessage({ type: "err", text: "Pick all 15 players first" }); return; }
    if (!captainId) { setMessage({ type: "err", text: "Select a captain — click a player on the pitch" }); return; }
    if (!viceCaptainId) { setMessage({ type: "err", text: "Select a vice-captain" }); return; }
    setSaving(true);
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formation, captainId, viceCaptainId, players: slots.filter(s => s.playerId).map(s => ({ playerId: s.playerId, isSub: s.isSub, slot: s.slot })) }),
    });
    const data = await res.json();
    if (res.ok) { setMessage({ type: "ok", text: "Team saved!" }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    else setMessage({ type: "err", text: data.error });
    setSaving(false);
  }

  function getPlayer(id: string | null) { return id ? allPlayers.find(p => p.id === id) || null : null; }

  const gkSlots = slots.filter(s => !s.isSub && s.position === "GK");
  const defSlots = slots.filter(s => !s.isSub && s.position === "DEF");
  const midSlots = slots.filter(s => !s.isSub && s.position === "MID");
  const fwdSlots = slots.filter(s => !s.isSub && s.position === "FWD");
  const subSlots = slots.filter(s => s.isSub);

  function PitchRow({ rowSlots, label, rowIndex }: { rowSlots: Slot[]; label: string; rowIndex: number }) {
    return (
      <div className="flex flex-col items-center gap-1 py-3">
        <div className="text-xs font-bold tracking-[0.15em] text-white/30">{label}</div>
        <div className="flex justify-center gap-4 flex-wrap">
          {rowSlots.map((slot, si) => {
            const player = getPlayer(slot.playerId);
            return (
              <div key={slot.slot} className="relative group" onClick={() => player ? setContextSlot(contextSlot?.slot === slot.slot ? null : slot) : openPicker(slot)}>
                {player ? (
                  <>
                    <PlayerCard
                      player={player}
                      isCaptain={captainId === player.id}
                      isViceCaptain={viceCaptainId === player.id}
                      isSub={slot.isSub}
                      animDelay={rowIndex * 0.08 + si * 0.05}
                      onRemove={() => removePlayer(slot)}
                    />
                    {/* Context menu */}
                    <AnimatePresence>
                      {contextSlot?.slot === slot.slot && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 rounded-xl shadow-2xl py-1 min-w-40 left-1/2 -translate-x-1/2"
                          style={{ top: "100%", marginTop: 4, background: "#0d1f3c", border: "1px solid rgba(240,180,41,0.25)", backdropFilter: "blur(8px)" }}
                          onClick={e => e.stopPropagation()}
                        >
                          <button className="w-full px-4 py-2 text-xs text-left hover:bg-yellow-400/10 text-yellow-400 flex items-center gap-2" onClick={() => { setCaptainId(player.id); setContextSlot(null); }}>⭐ Set Captain</button>
                          <button className="w-full px-4 py-2 text-xs text-left hover:bg-white/5 text-slate-300 flex items-center gap-2" onClick={() => { setViceCaptainId(player.id); setContextSlot(null); }}>Set Vice-Captain</button>
                          <button className="w-full px-4 py-2 text-xs text-left hover:bg-white/5 text-slate-300 flex items-center gap-2" onClick={() => { openPicker(slot); }}>🔄 Swap Player</button>
                          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "2px 0" }} />
                          <button className="w-full px-4 py-2 text-xs text-left hover:bg-red-500/10 text-red-400 flex items-center gap-2" onClick={() => { removePlayer(slot); setContextSlot(null); }}>Remove</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center cursor-pointer rounded-xl"
                    style={{ width: 64, height: 84, border: "2px dashed rgba(240,180,41,0.25)", background: "rgba(240,180,41,0.03)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: rowIndex * 0.08 + si * 0.05 }}
                  >
                    <div className="text-xl text-yellow-400/30">+</div>
                    <div className="text-xs text-yellow-400/25 mt-0.5">{slot.position}</div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#050d1a" }} onClick={() => setContextSlot(null)}>
      <NavBar clubName={user?.clubName} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* Pitch */}
          <div className="flex-1 min-w-0">
            {/* Controls bar */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative">
                <select className="appearance-none pr-8 text-sm" style={{ paddingTop: 8, paddingBottom: 8 }} value={formation} onChange={e => changeFormation(e.target.value)}>
                  {Object.keys(formations).map(f => <option key={f}>{f}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={autoPick} className="btn-outline px-4 py-2 text-sm flex items-center gap-1.5">
                <RefreshCw size={13} /> Auto-Pick
              </motion.button>

              <div className="ml-auto flex items-center gap-4 text-sm">
                <span>
                  <span className="text-slate-500">Budget: </span>
                  <span className={`font-bold ${remaining < 0 ? "text-red-400" : remaining < 5 ? "text-yellow-400" : "text-green-400"}`}>£{remaining.toFixed(1)}m</span>
                </span>
                <span>
                  <span className="text-slate-500">Squad: </span>
                  <span className={`font-bold ${selectedIds.length === 15 ? "text-green-400" : "text-yellow-400"}`}>{selectedIds.length}/15</span>
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={saveTeam}
                disabled={saving}
                className="btn-gold px-5 py-2 text-sm flex items-center gap-1.5"
                style={{ opacity: saving ? 0.7 : 1 }}
              >
                <AnimatePresence mode="wait">
                  {saved ? (
                    <motion.span key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5">
                      <CheckCircle size={14} /> Saved!
                    </motion.span>
                  ) : saving ? (
                    <motion.span key="saving" className="flex items-center gap-1.5">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
                      Saving…
                    </motion.span>
                  ) : (
                    <motion.span key="save" className="flex items-center gap-1.5">
                      <Save size={14} /> Save Team
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="rounded-xl px-4 py-3 text-sm flex items-center justify-between overflow-hidden"
                  style={{
                    background: message.type === "ok" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${message.type === "ok" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                    color: message.type === "ok" ? "#86efac" : "#fca5a5",
                  }}
                >
                  {message.text}
                  <button onClick={() => setMessage(null)} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pitch */}
            <div className="rounded-2xl overflow-hidden pitch-bg shadow-2xl relative" style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
              {/* Pitch lines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="absolute left-1/2 top-1/2 w-20 h-20 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-12 rounded-b-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)", borderTop: "none" }} />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-12 rounded-t-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none" }} />
              </div>

              <div className="relative px-4 pt-5 pb-2">
                <PitchRow rowSlots={fwdSlots} label="FWD" rowIndex={0} />
                <PitchRow rowSlots={midSlots} label="MID" rowIndex={1} />
                <PitchRow rowSlots={defSlots} label="DEF" rowIndex={2} />
                <PitchRow rowSlots={gkSlots} label="GK" rowIndex={3} />
              </div>

              {/* Bench */}
              <div className="relative px-4 py-3" style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xs font-bold tracking-widest text-white/25 text-center mb-2">SUBSTITUTES</div>
                <div className="flex justify-center gap-4">
                  {subSlots.map((slot, si) => {
                    const player = getPlayer(slot.playerId);
                    return (
                      <div key={slot.slot} className="relative group" onClick={e => { e.stopPropagation(); player ? setContextSlot(contextSlot?.slot === slot.slot ? null : slot) : openPicker(slot); }}>
                        {player ? (
                          <>
                            <PlayerCard player={player} isSub animDelay={0.3 + si * 0.06} onRemove={() => removePlayer(slot)} />
                            <AnimatePresence>
                              {contextSlot?.slot === slot.slot && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, y: 6 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="absolute z-50 rounded-xl shadow-2xl py-1 min-w-40 left-1/2 -translate-x-1/2"
                                  style={{ bottom: "100%", marginBottom: 4, background: "#0d1f3c", border: "1px solid rgba(240,180,41,0.25)" }}
                                  onClick={e => e.stopPropagation()}
                                >
                                  <button className="w-full px-4 py-2 text-xs text-left hover:bg-white/5 text-slate-300" onClick={() => { openPicker(slot); }}>🔄 Swap Player</button>
                                  <button className="w-full px-4 py-2 text-xs text-left hover:bg-red-500/10 text-red-400" onClick={() => { removePlayer(slot); setContextSlot(null); }}>Remove</button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col items-center justify-center cursor-pointer rounded-xl"
                            style={{ width: 64, height: 84, border: "2px dashed rgba(240,180,41,0.15)", background: "rgba(240,180,41,0.02)" }}
                          >
                            <div className="text-xl text-yellow-400/20">+</div>
                            <div className="text-xs text-yellow-400/20 mt-0.5">{slot.position}</div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 mt-3 text-xs text-slate-500">
              <span><span className="font-black text-yellow-400">C</span> = Captain (×2 pts)</span>
              <span><span className="font-bold text-slate-300">V</span> = Vice-Captain (×1.5 pts)</span>
              <span className="hidden sm:block">Click player to set C/VC or swap</span>
            </div>
          </div>

          {/* Desktop player panel */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="card-glass sticky top-20 overflow-hidden" style={{ maxHeight: "calc(100vh - 100px)" }}>
              <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
                  <Users size={15} className="text-yellow-400" /> Player List
                </h3>
                <div className="relative mb-3">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 28, paddingTop: 7, paddingBottom: 7, fontSize: "0.8rem" }} />
                </div>
                <div className="flex gap-1">
                  {["ALL", "GK", "DEF", "MID", "FWD"].map(pos => (
                    <button
                      key={pos}
                      onClick={() => setFilterPos(pos)}
                      className="flex-1 py-1 rounded text-xs font-bold transition-all"
                      style={{
                        background: filterPos === pos ? (posColors[pos] ? `${posColors[pos]}25` : "rgba(240,180,41,0.15)") : "rgba(255,255,255,0.03)",
                        color: filterPos === pos ? (posColors[pos] || "#f0b429") : "#64748b",
                        border: filterPos === pos ? `1px solid ${posColors[pos] || "#f0b429"}40` : "1px solid transparent",
                      }}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 260px)" }}>
                {filteredPlayers.slice(0, 100).map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <motion.button
                      key={p.id}
                      onClick={() => {
                        if (isSelected) return;
                        const emptySlot = slots.find(s => !s.playerId && s.position === p.position);
                        if (emptySlot) { setPickerSlot(emptySlot); setTimeout(() => { setSlots(prev => prev.map(s => s.slot === emptySlot.slot ? { ...s, playerId: p.id } : s)); setPickerSlot(null); }, 0); }
                        else setMessage({ type: "err", text: `No empty ${p.position} slot. Click one on the pitch.` });
                      }}
                      disabled={isSelected}
                      whileHover={!isSelected ? { backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", opacity: isSelected ? 0.4 : 1, cursor: isSelected ? "default" : "pointer" }}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0a1e38" }}>
                        {p.sofifaId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`/api/player-image/${p.sofifaId}`} alt={p.name} width={32} height={32} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-black" style={{ color: posColors[p.position] }}>
                            {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                        <div className="text-xs text-slate-500">{getFlag(p.country)} {p.clubTeam}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-bold px-1 rounded" style={{ background: `${posColors[p.position]}18`, color: posColors[p.position] }}>{p.position}</span>
                        <div className="text-xs font-bold text-yellow-400 mt-0.5">£{p.value}m</div>
                      </div>
                      {isSelected && <Star size={10} className="text-yellow-400 flex-shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile picker sheet */}
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-50 flex items-end xl:items-center justify-center p-0 xl:p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setPickerOpen(false)}
          >
            <motion.div
              variants={mobileSheet}
              initial="hidden"
              animate="show"
              exit="exit"
              className="w-full xl:max-w-lg max-h-[85vh] rounded-t-2xl xl:rounded-2xl flex flex-col overflow-hidden"
              style={{ background: "#0d1f3c", border: "1px solid rgba(240,180,41,0.2)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/6">
                <h3 className="font-bold text-white">Select {pickerSlot?.position}</h3>
                <button onClick={() => setPickerOpen(false)} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
              </div>
              <div className="p-4 pb-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32 }} />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 px-4 pb-4">
                {filteredPlayers
                  .filter(p => !pickerSlot?.position || p.position === pickerSlot.position)
                  .map((p) => {
                    const isSelected = selectedIds.includes(p.id) && p.id !== pickerSlot?.playerId;
                    return (
                      <motion.button
                        key={p.id}
                        onClick={() => !isSelected && selectPlayer(p)}
                        disabled={isSelected}
                        whileHover={!isSelected ? { backgroundColor: "rgba(255,255,255,0.04)" } : {}}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-left mb-1 transition-colors"
                        style={{ opacity: isSelected ? 0.35 : 1, border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0a1e38" }}>
                          {p.sofifaId ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={`/api/player-image/${p.sofifaId}`} alt={p.name} width={44} height={44} className="w-full h-full object-cover object-top" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black" style={{ color: posColors[p.position] }}>
                              {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-xs text-slate-400">{getFlag(p.country)} {p.clubTeam}</div>
                        </div>
                        <div className="font-bold text-yellow-400">£{p.value}m</div>
                      </motion.button>
                    );
                  })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

