"use client";
import { useEffect, useState, useCallback } from "react";
import NavBar from "@/components/NavBar";
import PlayerCard from "@/components/PlayerCard";
import { RefreshCw, X, Search, CheckCircle, ChevronDown } from "lucide-react";
import { getFlag } from "@/lib/flags";
import { motion, AnimatePresence } from "framer-motion";

interface Player { id: string; name: string; position: string; country: string; clubTeam: string; value: number; totalPoints: number; sofifaId?: string | null; }
interface Slot { playerId: string | null; isSub: boolean; slot: number; position?: string; }

const formations: Record<string, { def: number; mid: number; fwd: number }> = {
  "4-3-3": { def: 4, mid: 3, fwd: 3 }, "4-4-2": { def: 4, mid: 4, fwd: 2 },
  "4-2-3-1": { def: 4, mid: 5, fwd: 1 }, "3-5-2": { def: 3, mid: 5, fwd: 2 },
  "3-4-3": { def: 3, mid: 4, fwd: 3 }, "5-3-2": { def: 5, mid: 3, fwd: 2 }, "5-4-1": { def: 5, mid: 4, fwd: 1 },
};

const posColor: Record<string, string> = { GK: "#f59e0b", DEF: "#22c55e", MID: "#3b82f6", FWD: "#ef4444" };
const posClass: Record<string, string> = { GK: "pos-gk", DEF: "pos-def", MID: "pos-mid", FWD: "pos-fwd" };

function buildSlots(f: string): Slot[] {
  const { def, mid, fwd } = formations[f] || formations["4-3-3"];
  const slots: Slot[] = []; let s = 0;
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
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<Slot | null>(null);
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

  const selectedIds = slots.map(s => s.playerId).filter(Boolean) as string[];
  const selectedPlayers = allPlayers.filter(p => selectedIds.includes(p.id));
  const totalValue = selectedPlayers.reduce((s, p) => s + p.value, 0);
  const remaining = 100 - totalValue;

  // Filtered player list for the picker panel
  const pickerPlayers = allPlayers.filter(p => {
    if (selectedIds.includes(p.id) && p.id !== activeSlot?.playerId) return false;
    if (filterPos !== "ALL" && p.position !== filterPos) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.value - a.value);

  function changeFormation(f: string) {
    const newSlots = buildSlots(f);
    const gk = slots.find(s => !s.isSub && s.position === "GK");
    if (gk?.playerId) { const ng = newSlots.find(s => !s.isSub && s.position === "GK"); if (ng) ng.playerId = gk.playerId; }
    const oldSubs = slots.filter(s => s.isSub);
    newSlots.filter(s => s.isSub).forEach((ns, i) => { if (oldSubs[i]) ns.playerId = oldSubs[i].playerId; });
    setFormation(f); setSlots(newSlots);
  }

  function selectSlot(slot: Slot) {
    setActiveSlot(slot);
    setFilterPos(slot.position || "ALL");
    setSearch("");
    setContextSlot(null);
  }

  function pickPlayer(player: Player) {
    if (!activeSlot) return;
    const curr = activeSlot.playerId ? allPlayers.find(p => p.id === activeSlot.playerId) : null;
    const newTotal = totalValue - (curr?.value || 0) + player.value;
    if (newTotal > 100) { setMessage({ type: "err", text: `Over budget by £${(newTotal - 100).toFixed(1)}m` }); return; }
    if (selectedIds.includes(player.id) && player.id !== activeSlot.playerId) { setMessage({ type: "err", text: `${player.name} is already in your squad` }); return; }
    setSlots(prev => prev.map(s => s.slot === activeSlot.slot ? { ...s, playerId: player.id } : s));
    // Auto-advance to next empty slot of same position
    const remaining = slots.filter(s => !s.playerId && s.position === activeSlot.position && s.slot !== activeSlot.slot);
    if (remaining.length > 0) { setActiveSlot(remaining[0]); setFilterPos(remaining[0].position || "ALL"); }
    else setActiveSlot(null);
    setMessage(null);
  }

  function removePlayer(slot: Slot) {
    setSlots(prev => prev.map(s => s.slot === slot.slot ? { ...s, playerId: null } : s));
    if (captainId === slot.playerId) setCaptainId(null);
    if (viceCaptainId === slot.playerId) setViceCaptainId(null);
  }

  const autoPick = useCallback(() => {
    const sorted = [...allPlayers].sort((a, b) => b.value - a.value);
    const newSlots = buildSlots(formation); let budget = 100;
    for (const slot of newSlots) {
      if (!slot.position) continue;
      const eligible = sorted.filter(p => p.position === slot.position && !newSlots.some(s => s.playerId === p.id) && p.value <= budget - (newSlots.filter(s => !s.playerId).length - 1) * 1.5);
      if (eligible[0]) { slot.playerId = eligible[0].id; budget -= eligible[0].value; }
    }
    setSlots(newSlots);
    setCaptainId(newSlots.find(s => !s.isSub && s.position === "FWD")?.playerId || null);
    setViceCaptainId(newSlots.filter(s => !s.isSub && s.position === "FWD")[1]?.playerId || null);
    setMessage({ type: "ok", text: "Auto-pick done!" });
    setActiveSlot(null);
  }, [allPlayers, formation]);

  async function saveTeam() {
    if (selectedIds.length !== 15) { setMessage({ type: "err", text: "Pick all 15 players first" }); return; }
    if (!captainId) { setMessage({ type: "err", text: "Set a captain — click a player on the pitch" }); return; }
    if (!viceCaptainId) { setMessage({ type: "err", text: "Set a vice-captain" }); return; }
    setSaving(true);
    const res = await fetch("/api/team", {
      method: "POST", headers: { "Content-Type": "application/json" },
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

  function PitchRow({ rowSlots, label }: { rowSlots: Slot[]; label: string }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0" }}>
        <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{label}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {rowSlots.map(slot => {
            const player = getPlayer(slot.playerId);
            const isActive = activeSlot?.slot === slot.slot;
            return (
              <div key={slot.slot} style={{ position: "relative" }}>
                {player ? (
                  <div onClick={() => { if (isActive) { setActiveSlot(null); setContextSlot(null); } else { setContextSlot(contextSlot?.slot === slot.slot ? null : slot); setActiveSlot(null); } }}>
                    <PlayerCard player={player} isCaptain={captainId === player.id} isViceCaptain={viceCaptainId === player.id} isSub={slot.isSub} onRemove={() => removePlayer(slot)} />
                    <AnimatePresence>
                      {contextSlot?.slot === slot.slot && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                          onClick={e => e.stopPropagation()}
                          style={{ position: "absolute", zIndex: 50, top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 4, background: "var(--surface-high)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "4px 0", minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
                        >
                          <button className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors" style={{ fontSize: "var(--text-xs)", color: "var(--primary)", display: "block", background: "none", border: "none", cursor: "pointer", width: "100%" }} onClick={() => { setCaptainId(player.id); setContextSlot(null); }}>Set as Captain (×2)</button>
                          <button className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors" style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)", display: "block", background: "none", border: "none", cursor: "pointer", width: "100%" }} onClick={() => { setViceCaptainId(player.id); setContextSlot(null); }}>Set as Vice-Captain</button>
                          <button className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors" style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)", display: "block", background: "none", border: "none", cursor: "pointer", width: "100%" }} onClick={() => { selectSlot(slot); setContextSlot(null); }}>Swap Player</button>
                          <div style={{ height: 1, background: "var(--border-subtle)", margin: "2px 0" }} />
                          <button className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors" style={{ fontSize: "var(--text-xs)", color: "var(--danger)", display: "block", background: "none", border: "none", cursor: "pointer", width: "100%" }} onClick={() => { removePlayer(slot); setContextSlot(null); }}>Remove</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    onClick={() => selectSlot(slot)}
                    style={{ width: 64, height: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 12, border: `2px dashed ${isActive ? "var(--primary)" : "rgba(255,255,255,0.2)"}`, background: isActive ? "rgba(240,180,41,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 180ms" }}
                  >
                    <div style={{ fontSize: 20, color: isActive ? "var(--primary)" : "rgba(255,255,255,0.3)" }}>+</div>
                    <div style={{ fontSize: "0.55rem", color: isActive ? "var(--primary)" : "rgba(255,255,255,0.25)", fontWeight: 700 }}>{slot.position}</div>
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} onClick={() => setContextSlot(null)}>
      <NavBar clubName={user?.clubName} />

      <div className="max-w-7xl mx-auto px-4" style={{ paddingTop: "1.5rem", paddingBottom: "4rem" }}>

        {/* Top controls */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div style={{ position: "relative" }}>
            <select value={formation} onChange={e => changeFormation(e.target.value)} style={{ paddingRight: "2rem", appearance: "none" }}>
              {Object.keys(formations).map(f => <option key={f}>{f}</option>)}
            </select>
            <ChevronDown size={13} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", pointerEvents: "none" }} />
          </div>

          <button onClick={autoPick} className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", fontSize: "var(--text-sm)" }}>
            <RefreshCw size={13} /> Auto-pick
          </button>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem", fontSize: "var(--text-sm)" }}>
            <span style={{ color: remaining < 0 ? "var(--danger)" : remaining < 5 ? "var(--primary)" : "var(--accent)", fontWeight: 700 }}>
              £{remaining.toFixed(1)}m left
            </span>
            <span style={{ color: selectedIds.length === 15 ? "var(--accent)" : "var(--ink-2)" }}>
              {selectedIds.length}/15 players
            </span>
          </div>

          <button onClick={saveTeam} disabled={saving} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1.25rem", fontSize: "var(--text-sm)" }}>
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <CheckCircle size={13} /> Saved
                </motion.span>
              ) : saving ? (
                <motion.span key="saving" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} style={{ width: 12, height: 12, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%" }} />
                  Saving…
                </motion.span>
              ) : (
                <motion.span key="idle" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <Save size={13} /> Save Team
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{ background: message.type === "ok" ? "oklch(0.56 0.18 145 / 0.1)" : "oklch(0.58 0.20 25 / 0.1)", border: `1px solid ${message.type === "ok" ? "oklch(0.56 0.18 145 / 0.3)" : "oklch(0.58 0.20 25 / 0.3)"}`, color: message.type === "ok" ? "var(--accent)" : "var(--danger)", borderRadius: "var(--r-md)", padding: "0.65rem 1rem", marginBottom: "1rem", fontSize: "var(--text-sm)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {message.text}
              <button onClick={() => setMessage(null)} style={{ background: "none", border: "none", color: "currentColor", cursor: "pointer", opacity: 0.6 }}><X size={13} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main layout: pitch + player list side by side on lg+ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }} className="lg:two-col">
          {/* Pitch */}
          <div>
            <div className="pitch" style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ padding: "16px 16px 8px" }}>
                <PitchRow rowSlots={fwdSlots} label="FWD" />
                <PitchRow rowSlots={midSlots} label="MID" />
                <PitchRow rowSlots={defSlots} label="DEF" />
                <PitchRow rowSlots={gkSlots} label="GK" />
              </div>
              {/* Bench */}
              <div style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "8px 16px 12px" }}>
                <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textAlign: "center", marginBottom: 8 }}>SUBSTITUTES</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                  {subSlots.map(slot => {
                    const player = getPlayer(slot.playerId);
                    const isActive = activeSlot?.slot === slot.slot;
                    return (
                      <div key={slot.slot} style={{ position: "relative" }} onClick={e => { e.stopPropagation(); player ? setContextSlot(contextSlot?.slot === slot.slot ? null : slot) : selectSlot(slot); }}>
                        {player ? (
                          <PlayerCard player={player} isSub onRemove={() => removePlayer(slot)} />
                        ) : (
                          <motion.button whileHover={{ scale: 1.08 }} style={{ width: 64, height: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 12, border: `2px dashed ${isActive ? "var(--primary)" : "rgba(255,255,255,0.15)"}`, background: isActive ? "rgba(240,180,41,0.1)" : "transparent", cursor: "pointer" }}>
                            <div style={{ fontSize: 18, color: isActive ? "var(--primary)" : "rgba(255,255,255,0.2)" }}>+</div>
                            <div style={{ fontSize: "0.55rem", color: isActive ? "var(--primary)" : "rgba(255,255,255,0.2)", fontWeight: 700 }}>{slot.position}</div>
                          </motion.button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "0.75rem", fontSize: "var(--text-xs)", color: "var(--ink-3)" }}>
              <span><span style={{ color: "var(--primary)", fontWeight: 700 }}>C</span> = Captain (×2)</span>
              <span><span style={{ fontWeight: 700, color: "var(--ink-2)" }}>V</span> = Vice-captain (×1.5)</span>
              <span>Click player to set captain / swap</span>
            </div>
          </div>

          {/* Player picker — always visible */}
          <div className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ padding: "1rem", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.625rem" }}>
                {activeSlot
                  ? <span>Picking <span style={{ color: posColor[activeSlot.position || ""] || "var(--primary)" }}>{activeSlot.position}</span> — click a player below</span>
                  : "Player List — click a slot on the pitch to pick"}
              </div>

              {/* Search */}
              <div style={{ position: "relative", marginBottom: "0.5rem" }}>
                <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="Search players…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: "2.25rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
                />
              </div>

              {/* Position filter tabs */}
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {["ALL", "GK", "DEF", "MID", "FWD"].map(pos => (
                  <button key={pos} onClick={() => setFilterPos(pos)} style={{
                    flex: 1, padding: "0.3rem 0", fontSize: "0.7rem", fontWeight: 700,
                    border: `1px solid ${filterPos === pos ? (posColor[pos] || "var(--primary)") : "var(--border-subtle)"}`,
                    borderRadius: "var(--r-sm)",
                    background: filterPos === pos ? (pos === "ALL" ? "var(--primary-bg)" : `${posColor[pos]}18`) : "transparent",
                    color: filterPos === pos ? (posColor[pos] || "var(--primary)") : "var(--ink-3)",
                    cursor: "pointer", transition: "all 120ms"
                  }}>
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Player list — scrollable */}
            <div style={{ overflowY: "auto", flex: 1, maxHeight: "min(55vh, 520px)" }}>
              {allPlayers.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--ink-3)", fontSize: "var(--text-sm)" }}>Loading players…</div>
              ) : pickerPlayers.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--ink-3)", fontSize: "var(--text-sm)" }}>No players match</div>
              ) : pickerPlayers.map(p => {
                const inSquad = selectedIds.includes(p.id) && p.id !== activeSlot?.playerId;
                const curr = activeSlot?.playerId ? allPlayers.find(x => x.id === activeSlot.playerId) : null;
                const wouldAfford = totalValue - (curr?.value || 0) + p.value <= 100;
                const clickable = !inSquad && (!activeSlot || wouldAfford);
                return (
                  <button
                    key={p.id}
                    onClick={() => clickable && activeSlot && pickPlayer(p)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.625rem",
                      padding: "0.6rem 1rem", width: "100%",
                      background: "transparent", border: "none",
                      borderBottom: "1px solid var(--border-subtle)",
                      cursor: clickable && activeSlot ? "pointer" : "default",
                      opacity: inSquad ? 0.35 : !wouldAfford && activeSlot ? 0.4 : 1,
                      textAlign: "left", transition: "background 120ms",
                    }}
                    onMouseEnter={e => { if (clickable && activeSlot) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* Avatar */}
                    <img src={`/api/player-image/${p.id}`} alt={p.name} width={36} height={36}
                      style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: "var(--surface-high)" }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.name}
                        {inSquad && <span style={{ marginLeft: "0.375rem", fontSize: "0.65rem", color: "var(--accent)", fontWeight: 700 }}>✓</span>}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--ink-2)" }}>{getFlag(p.country)} {p.clubTeam}</div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span className={`pos-badge ${posClass[p.position]}`}>{p.position}</span>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--primary)", marginTop: 2, fontFeatureSettings: '"tnum"' }}>£{p.value}m</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg\\:two-col { grid-template-columns: 1fr 340px !important; }
        }
        .remove-btn { opacity: 0; }
        .player-card-root:hover .remove-btn { opacity: 1; }
      `}</style>
    </div>
  );
}

const Save = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
