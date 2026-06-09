"use client";
import { useEffect, useState, useCallback } from "react";
import NavBar from "@/components/NavBar";
import PlayerCard from "@/components/PlayerCard";
import { RefreshCw, Search, CheckCircle, ChevronDown, X } from "lucide-react";
import { getFlag } from "@/lib/flags";
import { motion, AnimatePresence } from "framer-motion";

interface Player { id: string; name: string; position: string; country: string; clubTeam: string; value: number; totalPoints: number; sofifaId?: string | null; }
interface Slot   { playerId: string | null; isSub: boolean; slot: number; position?: string; }

const formations: Record<string, { def: number; mid: number; fwd: number }> = {
  "4-3-3": { def: 4, mid: 3, fwd: 3 }, "4-4-2": { def: 4, mid: 4, fwd: 2 },
  "4-2-3-1": { def: 4, mid: 5, fwd: 1 }, "3-5-2": { def: 3, mid: 5, fwd: 2 },
  "3-4-3": { def: 3, mid: 4, fwd: 3 }, "5-3-2": { def: 5, mid: 3, fwd: 2 }, "5-4-1": { def: 5, mid: 4, fwd: 1 },
};

const posColour: Record<string, string> = { GK: "var(--pos-gk)", DEF: "var(--pos-def)", MID: "var(--pos-mid)", FWD: "var(--pos-fwd)" };
const posClass:  Record<string, string> = { GK: "pos-gk", DEF: "pos-def", MID: "pos-mid", FWD: "pos-fwd" };

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
  const [user, setUser]             = useState<{ clubName?: string } | null>(null);
  const [formation, setFormation]   = useState("4-3-3");
  const [slots, setSlots]           = useState<Slot[]>(buildSlots("4-3-3"));
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [captainId, setCaptainId]   = useState<string | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<Slot | null>(null);
  const [contextSlot, setContextSlot] = useState<Slot | null>(null);
  const [search, setSearch]         = useState("");
  const [filterPos, setFilterPos]   = useState("ALL");
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [message, setMessage]       = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user));
    fetch("/api/players").then(r => r.json()).then(d => setAllPlayers(d.players || []));
    fetch("/api/team").then(r => r.json()).then(d => {
      if (!d.team) return;
      setFormation(d.team.formation); setCaptainId(d.team.captainId); setViceCaptainId(d.team.viceCaptainId);
      const ns = buildSlots(d.team.formation);
      for (const up of d.team.players) { const sl = ns.find(s => s.slot === up.slot); if (sl) sl.playerId = up.playerId; }
      setSlots(ns);
    });
  }, []);

  const selectedIds    = slots.map(s => s.playerId).filter(Boolean) as string[];
  const selectedPlayers = allPlayers.filter(p => selectedIds.includes(p.id));
  const totalValue     = selectedPlayers.reduce((s, p) => s + p.value, 0);
  const remaining      = 100 - totalValue;

  const pickerPlayers = allPlayers.filter(p => {
    if (selectedIds.includes(p.id) && p.id !== activeSlot?.playerId) return false;
    if (filterPos !== "ALL" && p.position !== filterPos) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.value - a.value);

  function changeFormation(f: string) {
    const ns = buildSlots(f);
    const gk = slots.find(s => !s.isSub && s.position === "GK");
    if (gk?.playerId) { const ng = ns.find(s => !s.isSub && s.position === "GK"); if (ng) ng.playerId = gk.playerId; }
    slots.filter(s => s.isSub).forEach((os, i) => { if (ns.filter(s => s.isSub)[i]) ns.filter(s => s.isSub)[i].playerId = os.playerId; });
    setFormation(f); setSlots(ns);
  }

  function selectSlot(slot: Slot) { setActiveSlot(slot); setFilterPos(slot.position || "ALL"); setSearch(""); setContextSlot(null); }

  function pickPlayer(player: Player) {
    if (!activeSlot) return;
    if (activeSlot.position && player.position !== activeSlot.position) { setMessage({ type: "err", text: `This slot needs a ${activeSlot.position}` }); return; }
    const curr = activeSlot.playerId ? allPlayers.find(p => p.id === activeSlot.playerId) : null;
    const newTotal = totalValue - (curr?.value || 0) + player.value;
    if (newTotal > 100) { setMessage({ type: "err", text: `Over budget by £${(newTotal - 100).toFixed(1)}m` }); return; }
    if (selectedIds.includes(player.id) && player.id !== activeSlot.playerId) { setMessage({ type: "err", text: `${player.name} is already in your squad` }); return; }
    // Max 3 players from one nation
    const fromNation = selectedPlayers.filter(p => p.country === player.country && p.id !== curr?.id).length;
    if (fromNation >= 3) { setMessage({ type: "err", text: `Max 3 players from one nation — you already have 3 from ${player.country}` }); return; }
    setSlots(prev => prev.map(s => s.slot === activeSlot.slot ? { ...s, playerId: player.id } : s));
    const next = slots.filter(s => !s.playerId && s.position === activeSlot.position && s.slot !== activeSlot.slot);
    if (next.length > 0) { setActiveSlot(next[0]); setFilterPos(next[0].position || "ALL"); } else setActiveSlot(null);
    setMessage(null);
  }

  function removePlayer(slot: Slot) {
    setSlots(prev => prev.map(s => s.slot === slot.slot ? { ...s, playerId: null } : s));
    if (captainId === slot.playerId) setCaptainId(null);
    if (viceCaptainId === slot.playerId) setViceCaptainId(null);
  }

  const autoPick = useCallback(() => {
    const { def, mid, fwd } = formations[formation] || formations["4-3-3"];
    const slotOrder = [
      { pos: "GK", isSub: true }, { pos: "DEF", isSub: true }, { pos: "MID", isSub: true }, { pos: "FWD", isSub: true },
      { pos: "GK", isSub: false },
      ...Array(def).fill(null).map(() => ({ pos: "DEF", isSub: false })),
      ...Array(mid).fill(null).map(() => ({ pos: "MID", isSub: false })),
      ...Array(fwd).fill(null).map(() => ({ pos: "FWD", isSub: false })),
    ];
    const ns = buildSlots(formation); const picked: string[] = []; let budget = 100;
    const natCount: Record<string, number> = {};
    for (let i = 0; i < slotOrder.length; i++) {
      const { pos, isSub } = slotOrder[i];
      const slotsLeft = slotOrder.length - i - 1;
      const maxSpend = budget - slotsLeft * 3.5;
      const pool = [...allPlayers.filter(p =>
        p.position === pos && !picked.includes(p.id) && p.value <= maxSpend && (natCount[p.country] || 0) < 3
      )].sort(() => Math.random() - 0.5);
      if (!pool[0]) continue;
      picked.push(pool[0].id); budget -= pool[0].value;
      natCount[pool[0].country] = (natCount[pool[0].country] || 0) + 1;
      const target = ns.find(s => s.position === pos && s.isSub === isSub && !s.playerId);
      if (target) target.playerId = pool[0].id;
    }
    setSlots(ns);
    const starters = ns.filter(s => !s.isSub && s.playerId).sort((a, b) => (allPlayers.find(p => p.id === b.playerId)?.value || 0) - (allPlayers.find(p => p.id === a.playerId)?.value || 0));
    setCaptainId(starters[0]?.playerId || null);
    setViceCaptainId(starters[1]?.playerId || null);
    setMessage({ type: "ok", text: `Squad picked — £${(100 - budget).toFixed(1)}m spent` });
    setActiveSlot(null);
  }, [allPlayers, formation]);

  async function saveTeam() {
    if (selectedIds.length !== 15) { setMessage({ type: "err", text: "Pick all 15 players first" }); return; }
    const starters = slots.filter(s => !s.isSub && s.playerId).map(s => ({ player: allPlayers.find(p => p.id === s.playerId)!, slot: s })).filter(x => x.player).sort((a, b) => b.player.value - a.player.value);
    const cap = captainId || starters[0]?.player.id || null;
    const vc  = viceCaptainId || starters.find(x => x.player.id !== cap)?.player.id || null;
    setSaving(true);
    const res = await fetch("/api/team", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formation, captainId: cap, viceCaptainId: vc, players: slots.filter(s => s.playerId).map(s => ({ playerId: s.playerId, isSub: s.isSub, slot: s.slot })) }),
    });
    const data = await res.json();
    if (res.ok) { setCaptainId(cap); setViceCaptainId(vc); setMessage({ type: "ok", text: "Team saved!" }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    else setMessage({ type: "err", text: data.detail ? `${data.error}: ${data.detail}` : data.error });
    setSaving(false);
  }

  function getPlayer(id: string | null) { return id ? allPlayers.find(p => p.id === id) || null : null; }

  const gkSlots  = slots.filter(s => !s.isSub && s.position === "GK");
  const defSlots = slots.filter(s => !s.isSub && s.position === "DEF");
  const midSlots = slots.filter(s => !s.isSub && s.position === "MID");
  const fwdSlots = slots.filter(s => !s.isSub && s.position === "FWD");
  const subSlots = slots.filter(s => s.isSub);

  function PitchRow({ rowSlots, label }: { rowSlots: Slot[]; label: string }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0" }}>
        <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>{label}</span>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {rowSlots.map(slot => {
            const player  = getPlayer(slot.playerId);
            const isActive = activeSlot?.slot === slot.slot;
            return (
              <div key={slot.slot} style={{ position: "relative" }}>
                {player ? (
                  <div onClick={() => { setContextSlot(contextSlot?.slot === slot.slot ? null : slot); setActiveSlot(null); }}>
                    <PlayerCard player={player} isCaptain={captainId === player.id} isViceCaptain={viceCaptainId === player.id} isSub={slot.isSub} onRemove={() => removePlayer(slot)} />
                    <AnimatePresence>
                      {contextSlot?.slot === slot.slot && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ duration: 0.15 }} onClick={e => e.stopPropagation()}
                          style={{ position: "absolute", zIndex: 50, top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 0", minWidth: 160, boxShadow: "0 8px 24px rgba(12,29,56,0.15)" }}
                        >
                          {[
                            { label: "Set captain (×2)", action: () => { setCaptainId(player.id); setContextSlot(null); }, color: "var(--maroon)" },
                            { label: "Set vice-captain", action: () => { setViceCaptainId(player.id); setContextSlot(null); }, color: "var(--navy)" },
                            { label: "Swap player",      action: () => { selectSlot(slot); setContextSlot(null); }, color: "var(--navy)" },
                          ].map(item => (
                            <button key={item.label} onClick={item.action} style={{ display: "block", width: "100%", padding: "0.5rem 1rem", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: "var(--t-xs)", color: item.color, fontFamily: "var(--font-body)", fontWeight: 500 }}
                              onMouseEnter={e => e.currentTarget.style.background = "var(--ground)"}
                              onMouseLeave={e => e.currentTarget.style.background = "none"}>
                              {item.label}
                            </button>
                          ))}
                          <div style={{ height: 1, background: "var(--border)", margin: "2px 0" }} />
                          <button onClick={() => { removePlayer(slot); setContextSlot(null); }} style={{ display: "block", width: "100%", padding: "0.5rem 1rem", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: "var(--t-xs)", color: "#A01A1A", fontFamily: "var(--font-body)", fontWeight: 500 }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--ground)"}
                            onMouseLeave={e => e.currentTarget.style.background = "none"}>
                            Remove
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => selectSlot(slot)}
                    style={{ width: 64, height: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 6, border: `2px dashed ${isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)"}`, background: isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)", cursor: "pointer", transition: "all 150ms" }}>
                    <span style={{ fontSize: 18, color: isActive ? "white" : "rgba(255,255,255,0.3)", lineHeight: 1 }}>+</span>
                    <span style={{ fontSize: "0.55rem", color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)", fontWeight: 700, marginTop: 3 }}>{slot.position}</span>
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
    <div style={{ background: "var(--ground)", minHeight: "100vh" }} onClick={() => setContextSlot(null)}>
      <NavBar clubName={user?.clubName} />

      <div className="wrap" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {/* Club name display heading */}
        {user?.clubName && (
          <div style={{ marginBottom: "2rem" }}>
            <h1 className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--navy)", textTransform: "uppercase", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
              {user.clubName}
            </h1>
            <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", marginTop: "0.5rem" }}>
              {selectedIds.length}/15 players selected · £{remaining.toFixed(1)}m remaining
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ position: "relative" }}>
            <select value={formation} onChange={e => changeFormation(e.target.value)} style={{ paddingRight: "2rem", appearance: "none", width: "auto" }}>
              {Object.keys(formations).map(f => <option key={f}>{f}</option>)}
            </select>
            <ChevronDown size={13} style={{ position: "absolute", right: "0.625rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
          </div>

          <button onClick={autoPick} className="btn btn-ghost" style={{ padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <RefreshCw size={13} /> Random pick
          </button>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1.25rem", fontSize: "var(--t-sm)" }}>
            <span style={{ color: remaining < 0 ? "#A01A1A" : remaining < 5 ? "var(--gold)" : "var(--pos-def)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>£{remaining.toFixed(1)}m left</span>
            <span style={{ color: selectedIds.length === 15 ? "var(--pos-def)" : "var(--muted)", fontWeight: 600 }}>{selectedIds.length}/15</span>
          </div>

          <button onClick={saveTeam} disabled={saving} className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <CheckCircle size={13} /> Saved
                </motion.span>
              ) : saving ? "Saving…" : "Save team"}
            </AnimatePresence>
          </button>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: "1rem", padding: "0.75rem 1rem", borderRadius: 4, fontSize: "var(--t-sm)", display: "flex", justifyContent: "space-between", alignItems: "center", background: message.type === "ok" ? "rgba(26,122,62,0.08)" : "rgba(160,26,26,0.08)", border: `1px solid ${message.type === "ok" ? "rgba(26,122,62,0.25)" : "rgba(160,26,26,0.25)"}`, color: message.type === "ok" ? "var(--pos-def)" : "#A01A1A" }}>
              {message.text}
              <button onClick={() => setMessage(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "currentColor", opacity: 0.6 }}><X size={13} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }} className="team-grid">

          {/* Pitch */}
          <div className="pitch-frame">
            <div className="pitch" style={{ padding: "16px 12px 8px", position: "relative" }}>
              {/* Centre line + circle */}
              <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
              <PitchRow rowSlots={fwdSlots} label="FWD" />
              <PitchRow rowSlots={midSlots} label="MID" />
              <PitchRow rowSlots={defSlots} label="DEF" />
              <PitchRow rowSlots={gkSlots}  label="GK" />
            </div>

            {/* Bench */}
            <div style={{ background: "rgba(0,0,0,0.25)", borderTop: "2px solid var(--maroon)", padding: "8px 12px 12px" }}>
              <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 8, textTransform: "uppercase" }}>Substitutes</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                {subSlots.map(slot => {
                  const player  = getPlayer(slot.playerId);
                  const isActive = activeSlot?.slot === slot.slot;
                  return (
                    <div key={slot.slot} onClick={e => { e.stopPropagation(); player ? setContextSlot(contextSlot?.slot === slot.slot ? null : slot) : selectSlot(slot); }}>
                      {player ? (
                        <PlayerCard player={player} isSub onRemove={() => removePlayer(slot)} />
                      ) : (
                        <motion.button whileHover={{ scale: 1.08 }} style={{ width: 64, height: 80, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 6, border: `2px dashed ${isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)"}`, background: isActive ? "rgba(255,255,255,0.1)" : "transparent", cursor: "pointer" }}>
                          <span style={{ fontSize: 18, color: isActive ? "white" : "rgba(255,255,255,0.25)" }}>+</span>
                          <span style={{ fontSize: "0.55rem", color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", fontWeight: 700, marginTop: 3 }}>{slot.position}</span>
                        </motion.button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Player picker panel */}
          <div className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.625rem" }}>
                {activeSlot ? `Picking ${activeSlot.position}` : "Players"}
              </p>
              <div style={{ position: "relative", marginBottom: "0.5rem" }}>
                <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--subtle)", pointerEvents: "none" }} />
                <input type="text" placeholder="Search players…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem", fontSize: "var(--t-sm)" }} />
              </div>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {["ALL", "GK", "DEF", "MID", "FWD"].map(pos => {
                  const isLocked = activeSlot?.position && pos !== "ALL" && pos !== activeSlot.position;
                  return (
                    <button key={pos} onClick={() => !isLocked && setFilterPos(pos)} style={{
                      flex: 1, padding: "0.3rem 0", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.03em",
                      border: `1px solid ${filterPos === pos ? "var(--maroon)" : "var(--border)"}`,
                      borderRadius: 4, cursor: isLocked ? "not-allowed" : "pointer",
                      background: filterPos === pos ? "var(--maroon-tint)" : "transparent",
                      color: filterPos === pos ? "var(--maroon)" : "var(--muted)",
                      opacity: isLocked ? 0.3 : 1, transition: "all 120ms",
                    }}>
                      {pos}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ overflowY: "auto", maxHeight: "min(60vh, 520px)" }}>
              {allPlayers.length === 0 ? (
                <p style={{ padding: "2rem", textAlign: "center", color: "var(--subtle)", fontSize: "var(--t-sm)" }}>Loading…</p>
              ) : pickerPlayers.length === 0 ? (
                <p style={{ padding: "2rem", textAlign: "center", color: "var(--subtle)", fontSize: "var(--t-sm)" }}>No players match</p>
              ) : pickerPlayers.map(p => {
                const inSquad  = selectedIds.includes(p.id) && p.id !== activeSlot?.playerId;
                const curr     = activeSlot?.playerId ? allPlayers.find(x => x.id === activeSlot.playerId) : null;
                const canAfford = totalValue - (curr?.value || 0) + p.value <= 100;
                const clickable = !inSquad && (!activeSlot || canAfford);
                return (
                  <button key={p.id} onClick={() => clickable && activeSlot && pickPlayer(p)}
                    style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.6rem 1rem", width: "100%", background: "transparent", border: "none", borderBottom: "1px solid var(--border)", cursor: clickable && activeSlot ? "pointer" : "default", opacity: inSquad ? 0.3 : !canAfford && activeSlot ? 0.4 : 1, textAlign: "left", transition: "background 120ms" }}
                    onMouseEnter={e => { if (clickable && activeSlot) e.currentTarget.style.background = "var(--maroon-tint)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                    <img src={`/api/player-image/${p.id}`} alt={p.name} width={34} height={34} style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: "var(--ground)", border: "1px solid var(--border)", objectFit: "cover", objectPosition: "top" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--navy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}{inSquad && <span style={{ marginLeft: "0.4rem", color: "var(--pos-def)", fontSize: "0.65rem" }}>✓</span>}</p>
                      <p style={{ fontSize: "var(--t-xs)", color: "var(--muted)" }}>{getFlag(p.country)} {p.clubTeam || p.country}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span className={`pos ${posClass[p.position]}`}>{p.position}</span>
                      <p style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: "var(--gold)", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>£{p.value}m</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", textAlign: "center", marginTop: "0.875rem" }}>
          <strong style={{ color: "var(--maroon)" }}>C</strong> = Captain (×2) · <strong style={{ color: "var(--navy)" }}>V</strong> = Vice-captain (×1.5) · Max 3 players per nation · Click a player to set roles or swap
        </p>
      </div>

      <style>{`
        .team-grid { @media (max-width: 900px) { grid-template-columns: 1fr !important; } }
        .remove-btn { opacity: 0; }
        .player-card-root:hover .remove-btn { opacity: 1; }
      `}</style>
    </div>
  );
}
