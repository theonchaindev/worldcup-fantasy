"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { getFlag } from "@/lib/flags";
import { motion, AnimatePresence } from "framer-motion";

interface Player { id: string; name: string; position: string; country: string; clubTeam: string; value: number; totalPoints: number; form: number; ownership: number; goals: number; assists: number; cleanSheets: number; minutesPlayed: number; }

const posClass: Record<string, string> = { GK: "pos-gk", DEF: "pos-def", MID: "pos-mid", FWD: "pos-fwd" };

export default function PlayersPage() {
  const [players, setPlayers]       = useState<Player[]>([]);
  const [search, setSearch]         = useState("");
  const [filterPos, setFilterPos]   = useState("ALL");
  const [filterCountry, setFilterCountry] = useState("ALL");
  const [sortBy, setSortBy]         = useState("value");
  const [sortDir, setSortDir]       = useState<"asc" | "desc">("desc");
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<Player | null>(null);
  const [countries, setCountries]   = useState<string[]>([]);
  const [user, setUser]             = useState<{ clubName?: string } | null>(null);

  useEffect(() => { fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user)); }, []);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams();
    if (filterPos !== "ALL") p.set("position", filterPos);
    if (filterCountry !== "ALL") p.set("country", filterCountry);
    if (search) p.set("search", search);
    p.set("sort", sortBy); p.set("order", sortDir);
    fetch(`/api/players?${p}`).then(r => r.json()).then(d => {
      const ps: Player[] = d.players || [];
      setPlayers(ps);
      if (countries.length === 0) setCountries(["ALL", ...Array.from(new Set(ps.map(x => x.country))).sort() as string[]]);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPos, filterCountry, search, sortBy, sortDir]);

  function toggleSort(col: string) {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  }

  const SortIcon = ({ col }: { col: string }) => sortBy !== col ? null :
    sortDir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />;

  return (
    <div style={{ background: "var(--ground)", minHeight: "100vh" }}>
      <NavBar clubName={user?.clubName} />

      <div className="wrap" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <h1 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "0.25rem" }}>Players</h1>
          <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)" }}>{players.length} available across 48 nations</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", marginBottom: "1.25rem", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 200px", minWidth: 160 }}>
            <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--subtle)", pointerEvents: "none" }} />
            <input type="text" placeholder="Search players…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "2.25rem" }} />
          </div>

          <div style={{ display: "flex", gap: "0.25rem" }}>
            {["ALL", "GK", "DEF", "MID", "FWD"].map(pos => (
              <button key={pos} onClick={() => setFilterPos(pos)} style={{
                padding: "0.5rem 0.75rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em",
                border: `1px solid ${filterPos === pos ? "var(--maroon)" : "var(--border)"}`,
                borderRadius: 4, cursor: "pointer",
                background: filterPos === pos ? "var(--maroon)" : "var(--surface)",
                color: filterPos === pos ? "#fff" : "var(--muted)",
                transition: "all 120ms",
              }}>
                {pos}
              </button>
            ))}
          </div>

          <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} style={{ flex: "0 1 160px", width: "auto" }}>
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>#</th>
                <th>Player</th>
                <th>Pos</th>
                <th className="hidden md:table-cell">Nation</th>
                <th className="hidden lg:table-cell">Club</th>
                <th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => toggleSort("value")}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>Value <SortIcon col="value" /></span>
                </th>
                <th style={{ textAlign: "right", cursor: "pointer" }} onClick={() => toggleSort("points")}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>Pts <SortIcon col="points" /></span>
                </th>
                <th className="hidden sm:table-cell" style={{ textAlign: "right" }}>Goals</th>
                <th className="hidden sm:table-cell" style={{ textAlign: "right" }}>Ast</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: "3rem", color: "var(--subtle)" }}>Loading…</td></tr>
              ) : players.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.008, 0.3) }}
                  onClick={() => setSelected(p)} style={{ cursor: "pointer" }}>
                  <td style={{ color: "var(--subtle)", fontVariantNumeric: "tabular-nums" }}>{i + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", background: "var(--ground)", flexShrink: 0, border: "1px solid var(--border)", position: "relative" }}>
                        <img src={`/api/player-image/${p.id}`} alt={p.name} width={34} height={34} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                          onError={e => { const t = e.target as HTMLImageElement; t.style.display = "none"; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = "flex"; }} />
                        <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, fontFamily: "var(--font-display)" }}>
                          {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--navy)" }}>{p.name}</span>
                    </div>
                  </td>
                  <td><span className={`pos ${posClass[p.position]}`}>{p.position}</span></td>
                  <td className="hidden md:table-cell" style={{ color: "var(--muted)" }}>{getFlag(p.country)}</td>
                  <td className="hidden lg:table-cell" style={{ color: "var(--subtle)", maxWidth: "10rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.clubTeam}</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "var(--gold)", fontVariantNumeric: "tabular-nums" }}>£{p.value}m</td>
                  <td style={{ textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--t-md)", color: "var(--maroon)", fontVariantNumeric: "tabular-nums" }}>{p.totalPoints}</td>
                  <td className="hidden sm:table-cell" style={{ textAlign: "right", color: "var(--muted)" }}>{p.goals}</td>
                  <td className="hidden sm:table-cell" style={{ textAlign: "right", color: "var(--muted)" }}>{p.assists}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(12,29,56,0.5)", backdropFilter: "blur(4px)", zIndex: "var(--z-modal)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }} className="card" style={{ maxWidth: 380, width: "100%", overflow: "hidden" }} onClick={e => e.stopPropagation()}>

              <div style={{ display: "flex", gap: "1rem", padding: "1.5rem", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}>
                <div style={{ width: 80, height: 80, borderRadius: 6, overflow: "hidden", background: "var(--ground)", flexShrink: 0, border: "1px solid var(--border)", position: "relative" }}>
                  <img src={`/api/player-image/${selected.id}`} alt={selected.name} width={80} height={80} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    onError={e => { const t = e.target as HTMLImageElement; t.style.display = "none"; const fb = t.nextElementSibling as HTMLElement | null; if (fb) fb.style.display = "flex"; }} />
                  <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, fontFamily: "var(--font-display)" }}>
                    {selected.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="display" style={{ fontSize: "var(--t-lg)", color: "var(--navy)", marginBottom: "0.35rem", lineHeight: 1.2 }}>{selected.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span className={`pos ${posClass[selected.position]}`}>{selected.position}</span>
                    <span style={{ fontSize: "var(--t-xs)", color: "var(--muted)" }}>{getFlag(selected.country)} {selected.country}</span>
                  </div>
                  <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)" }}>{selected.clubTeam}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--subtle)" }}><X size={18} /></button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--border)" }}>
                {[
                  { label: "Value", value: `£${selected.value}m`, highlight: true },
                  { label: "Points", value: selected.totalPoints },
                  { label: "Form", value: (selected.form || 0).toFixed(1) },
                ].map(s => (
                  <div key={s.label} style={{ background: "var(--surface)", padding: "1rem", textAlign: "center" }}>
                    <p className="display" style={{ fontSize: "var(--t-xl)", color: s.highlight ? "var(--gold)" : "var(--maroon)", fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
                    <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", marginTop: "0.2rem" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ padding: "0.25rem 0" }}>
                {[["Goals", selected.goals], ["Assists", selected.assists], ["Clean sheets", selected.cleanSheets], ["Minutes played", selected.minutesPlayed], ["Ownership", `${(selected.ownership || 0).toFixed(1)}%`]].map(([label, val]) => (
                  <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "0.65rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "var(--t-sm)", color: "var(--muted)" }}>{label as string}</span>
                    <span style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--navy)" }}>{val as string | number}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
