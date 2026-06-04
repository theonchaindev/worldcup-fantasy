"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { Search, TrendingUp, X } from "lucide-react";
import { getFlag } from "@/lib/flags";

interface Player {
  id: string; name: string; position: string; country: string; clubTeam: string;
  value: number; totalPoints: number; sofifaId?: string | null; form: number;
  ownership: number; goals: number; assists: number; cleanSheets: number; minutesPlayed: number;
}

const posColors: Record<string, string> = { GK: "#f59e0b", DEF: "#22c55e", MID: "#3b82f6", FWD: "#ef4444" };

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [filterPos, setFilterPos] = useState("ALL");
  const [filterCountry, setFilterCountry] = useState("ALL");
  const [sortBy, setSortBy] = useState("value");
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
    params.set("order", "desc");
    fetch(`/api/players?${params}`).then((r) => r.json()).then((d) => {
      setPlayers(d.players || []);
      if (countries.length === 0) {
        const cs = Array.from(new Set((d.players as Player[]).map((p) => p.country))).sort() as string[];
        setCountries(["ALL", ...cs]);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPos, filterCountry, search, sortBy]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <NavBar clubName={user?.clubName} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white mb-1">All Players</h1>
          <p className="text-slate-400">Browse all {players.length} available players</p>
        </div>

        {/* Filters */}
        <div className="card-glass p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search players..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 32, paddingTop: 8, paddingBottom: 8 }} />
          </div>
          <select value={filterPos} onChange={(e) => setFilterPos(e.target.value)} style={{ padding: "8px 12px", width: "auto" }}>
            {["ALL", "GK", "DEF", "MID", "FWD"].map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} style={{ padding: "8px 12px", width: "auto" }}>
            {countries.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "8px 12px", width: "auto" }}>
            <option value="value">Sort by Value</option>
            <option value="points">Sort by Points</option>
          </select>
        </div>

        {/* Table */}
        <div className="card-glass overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["#", "Player", "Pos", "Nation", "Club", "Value", "Pts", "Goals", "Assists"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
              ) : players.map((p, i) => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="cursor-pointer transition-all hover:bg-white/5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  <td className="px-4 py-3 text-slate-500 text-xs w-8">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#0d2a4a" }}>
                        {p.sofifaId ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={`https://cdn.sofifa.net/players/${p.sofifaId}/25_120x120.png`} alt={p.name} width={36} height={36} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-sm" style={{ color: posColors[p.position] }}>{p.name.charAt(0)}</div>
                        )}
                      </div>
                      <span className="font-semibold text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${posColors[p.position]}20`, color: posColors[p.position] }}>
                      {p.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{getFlag(p.country)} {p.country}</td>
                  <td className="px-4 py-3 text-slate-400">{p.clubTeam}</td>
                  <td className="px-4 py-3 font-bold text-yellow-400">£{p.value}m</td>
                  <td className="px-4 py-3 font-bold text-white">{p.totalPoints}</td>
                  <td className="px-4 py-3 text-slate-300">{p.goals}</td>
                  <td className="px-4 py-3 text-slate-300">{p.assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={() => setSelected(null)}>
          <div className="card-glass p-6 max-w-sm w-full slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden" style={{ background: "#0d2a4a" }}>
                  {selected.sofifaId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`https://cdn.sofifa.net/players/${selected.sofifaId}/25_120x120.png`} alt={selected.name} width={80} height={80} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black" style={{ color: posColors[selected.position] }}>{selected.name.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{selected.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${posColors[selected.position]}20`, color: posColors[selected.position] }}>{selected.position}</span>
                    <span className="text-sm">{getFlag(selected.country)} {selected.country}</span>
                  </div>
                  <div className="text-slate-400 text-sm mt-1">{selected.clubTeam}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Value", value: `£${selected.value}m`, color: "#f0b429" },
                { label: "Points", value: selected.totalPoints, color: "#22c55e" },
                { label: "Form", value: selected.form?.toFixed(1) || "0.0", color: "#3b82f6" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              {[
                ["Goals", selected.goals],
                ["Assists", selected.assists],
                ["Clean Sheets", selected.cleanSheets],
                ["Minutes Played", selected.minutesPlayed],
                ["Ownership", `${selected.ownership?.toFixed(1) || 0}%`],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-slate-400">{label as string}</span>
                  <span className="font-bold text-white">{val as string | number}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <TrendingUp size={12} />
              <span>Click a slot on your pitch to add this player</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
