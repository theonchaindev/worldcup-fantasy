"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Search, X, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { getFlag } from "@/lib/flags";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, stagger, modalOverlay, modalContent } from "@/lib/motion";

interface Player {
  id: string; name: string; position: string; country: string; clubTeam: string;
  value: number; totalPoints: number; sofifaId?: string | null; form: number;
  ownership: number; goals: number; assists: number; cleanSheets: number; minutesPlayed: number;
}

const posColors: Record<string, string> = { GK: "#f59e0b", DEF: "#22c55e", MID: "#3b82f6", FWD: "#ef4444" };
const posOrder = { GK: 0, DEF: 1, MID: 2, FWD: 3 };

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [filterPos, setFilterPos] = useState("ALL");
  const [filterCountry, setFilterCountry] = useState("ALL");
  const [sortBy, setSortBy] = useState("value");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Player | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [user, setUser] = useState<{ clubName?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterPos !== "ALL") params.set("position", filterPos);
    if (filterCountry !== "ALL") params.set("country", filterCountry);
    if (search) params.set("search", search);
    params.set("sort", sortBy);
    params.set("order", sortDir);
    fetch(`/api/players?${params}`).then((r) => r.json()).then((d) => {
      const ps: Player[] = d.players || [];
      setPlayers(ps);
      if (countries.length === 0) {
        setCountries(["ALL", ...Array.from(new Set(ps.map((p) => p.country))).sort() as string[]]);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPos, filterCountry, search, sortBy, sortDir]);

  function toggleSort(col: string) {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  }

  const SortIcon = ({ col }: { col: string }) => sortBy === col
    ? (sortDir === "desc" ? <ChevronDown size={13} /> : <ChevronUp size={13} />)
    : null;

  return (
    <div className="min-h-screen" style={{ background: "#050d1a" }}>
      <NavBar clubName={user?.clubName} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-black text-white">All Players</h1>
          <p className="text-slate-400 text-sm mt-0.5">{players.length} players available</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-4 mb-5 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-44">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search players…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32, paddingTop: 8, paddingBottom: 8 }} />
          </div>
          {["ALL", "GK", "DEF", "MID", "FWD"].map((p) => (
            <motion.button
              key={p}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterPos(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: filterPos === p ? (p === "ALL" ? "rgba(240,180,41,0.2)" : `${posColors[p] || "#f0b429"}20`) : "rgba(255,255,255,0.04)",
                border: filterPos === p ? `1px solid ${posColors[p] || "#f0b429"}50` : "1px solid rgba(255,255,255,0.06)",
                color: filterPos === p ? (posColors[p] || "#f0b429") : "#64748b",
              }}
            >
              {p}
            </motion.button>
          ))}
          <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} style={{ padding: "8px 12px", width: "auto" }}>
            {countries.map((c) => <option key={c}>{c}</option>)}
          </select>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="card-glass overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs w-8">#</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs">Player</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs">Pos</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs hidden md:table-cell">Nation</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs hidden lg:table-cell">Club</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium text-xs cursor-pointer hover:text-yellow-400" onClick={() => toggleSort("value")}>
                  <span className="inline-flex items-center gap-1">Value <SortIcon col="value" /></span>
                </th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium text-xs cursor-pointer hover:text-yellow-400" onClick={() => toggleSort("points")}>
                  <span className="inline-flex items-center gap-1">Pts <SortIcon col="points" /></span>
                </th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium text-xs hidden sm:table-cell">Goals</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium text-xs hidden sm:table-cell">Assists</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9}>
                  <div className="flex items-center justify-center py-16">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full" />
                  </div>
                </td></tr>
              ) : players.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.015, 0.4) }}
                  onClick={() => setSelected(p)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0a1e38", border: `1.5px solid ${posColors[p.position]}30` }}>
                        {p.sofifaId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`/api/player-image/${p.sofifaId}`} alt={p.name} width={36} height={36} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-black" style={{ color: posColors[p.position] }}>
                            {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-white text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${posColors[p.position]}18`, color: posColors[p.position] }}>{p.position}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 text-sm hidden md:table-cell">{getFlag(p.country)}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs hidden lg:table-cell truncate max-w-28">{p.clubTeam}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-yellow-400 text-sm">£{p.value}m</td>
                  <td className="px-4 py-2.5 text-right font-bold text-white text-sm">{p.totalPoints}</td>
                  <td className="px-4 py-2.5 text-right text-slate-400 text-sm hidden sm:table-cell">{p.goals}</td>
                  <td className="px-4 py-2.5 text-right text-slate-400 text-sm hidden sm:table-cell">{p.assists}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Player modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              variants={modalContent}
              initial="hidden"
              animate="show"
              exit="exit"
              className="card-glass p-6 max-w-sm w-full"
              style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: "#0a1e38", border: `2px solid ${posColors[selected.position]}40` }}>
                    {selected.sofifaId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/api/player-image/${selected.sofifaId}`} alt={selected.name} width={80} height={80} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-black" style={{ color: posColors[selected.position] }}>
                        {selected.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white leading-tight">{selected.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${posColors[selected.position]}20`, color: posColors[selected.position] }}>{selected.position}</span>
                      <span className="text-sm">{getFlag(selected.country)}</span>
                    </div>
                    <div className="text-slate-400 text-xs mt-1">{selected.clubTeam}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition-colors p-1">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: "Value", value: `£${selected.value}m`, color: "#f0b429" },
                  { label: "Points", value: selected.totalPoints, color: "#22c55e" },
                  { label: "Form", value: (selected.form || 0).toFixed(1), color: "#3b82f6" },
                ].map((s) => (
                  <motion.div
                    key={s.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-center p-3 rounded-xl"
                    style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}
                  >
                    <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-0">
                {[
                  ["Goals", selected.goals],
                  ["Assists", selected.assists],
                  ["Clean Sheets", selected.cleanSheets],
                  ["Minutes Played", selected.minutesPlayed],
                  ["Ownership", `${(selected.ownership || 0).toFixed(1)}%`],
                ].map(([label, val], i) => (
                  <motion.div
                    key={label as string}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className="flex justify-between items-center py-2.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-slate-400 text-sm">{label as string}</span>
                    <span className="font-bold text-white text-sm">{val as string | number}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <TrendingUp size={12} />
                <span>Click a slot on your pitch to add this player</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
