import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { countryFlags } from "@/lib/flags";

export const dynamic = "force-dynamic";

const scoring = [
  ["Goal — forward", "+4"], ["Goal — midfielder", "+5"], ["Goal — defender / GK", "+6"],
  ["Assist", "+3"], ["Clean sheet (GK / DEF)", "+4"], ["Penalty save", "+5"],
  ["Playing 90 minutes", "+2"], ["Yellow card", "−1"], ["Red card", "−3"],
  ["Own goal", "−2"], ["Captain", "×2 pts"],
];

const features = [
  { heading: "7 formations", body: "4‑3‑3, 4‑4‑2, 4‑2‑3‑1, 3‑5‑2, 3‑4‑3, 5‑3‑2, 5‑4‑1. Change before every gameweek deadline." },
  { heading: "Captain & chips", body: "Set a captain for ×2 points. Four chips: Wildcard, Triple Captain, Bench Boost, Free Hit." },
  { heading: "Mini leagues", body: "Create a private league with a six-character code and compete with friends." },
  { heading: "On-chain entry", body: "Token balance and entry fee verified on Solana mainnet. No wallet connection required." },
  { heading: "706 players", body: "Full squads from all 48 qualified nations, with updated pricing before kickoff." },
  { heading: "Live prize pool", body: "50% to the winner. Funded by entry fees plus WCF token rewards." },
];

const posTint: Record<string, string> = { GK: "var(--pos-gk)", DEF: "var(--pos-def)", MID: "var(--pos-mid)", FWD: "var(--pos-fwd)" };

function Avatar({ id, name, size, ring }: { id: string; name: string; size: number; ring?: string }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", background: "var(--surface-2)", border: `2px solid ${ring || "var(--border-mid)"}`, flexShrink: 0, boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/player-image/${id}`} alt={name} width={size} height={size} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
    </div>
  );
}

export default async function LandingPage() {
  // Pull real players for imagery
  const lineup = await prisma.player.findMany({
    orderBy: [{ totalPoints: "desc" }, { value: "desc" }],
    take: 16,
    select: { id: true, name: true, position: true, country: true, value: true },
  }).catch(() => []);

  const squadPreview = lineup.slice(0, 5);
  const flags = Object.entries(countryFlags).filter(([, f]) => f.length <= 8).slice(0, 32);

  return (
    <main style={{ background: "var(--ground)", minHeight: "100vh" }}>

      {/* ── Nav ── */}
      <header style={{ background: "var(--ground)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 90 }}>
        <div className="wrap" style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="display" style={{ fontSize: "var(--t-lg)", color: "var(--navy)" }}>
            WC Fantasy <span style={{ color: "var(--magenta)" }}>26</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/login" style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--muted)", textDecoration: "none" }}>Sign in</Link>
            <Link href="/register" className="btn btn-primary">Enter now</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        <div aria-hidden style={{ position: "absolute", top: "-20%", right: "-5%", width: "42%", height: "140%", background: "var(--maroon)", transform: "skewX(-9deg)", opacity: 0.9 }} />
        <div aria-hidden style={{ position: "absolute", top: "-20%", right: "-12%", width: "18%", height: "140%", background: "var(--magenta)", transform: "skewX(-9deg)", opacity: 0.85 }} />

        <div className="wrap" style={{ position: "relative", paddingTop: "4.5rem", paddingBottom: "3.5rem", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2rem", alignItems: "center" }}>
          <div>
            <p className="chip chip-gold fade-up" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
              <span className="live-dot" /> USA · Canada · Mexico — June 2026
            </p>
            <h1 className="display fade-up" data-delay="1" style={{ fontSize: "clamp(2.75rem, 8vw, 6.5rem)", color: "var(--navy)", marginBottom: "1.5rem", maxWidth: "12ch" }}>
              World Cup<br />
              <span style={{ color: "var(--gold)" }}>Fantasy</span> 2026
            </h1>
            <p className="fade-up" data-delay="2" style={{ fontSize: "var(--t-md)", color: "var(--muted)", maxWidth: "40ch", lineHeight: 1.6, marginBottom: "2.5rem" }}>
              Token-gated. On-chain entry. 48 nations, 706 players, one prize pool. Build your squad and run it up the global board.
            </p>
            <div className="fade-up" data-delay="3" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/register" className="btn btn-primary" style={{ padding: "0.85rem 2.25rem", fontSize: "var(--t-base)" }}>Enter now</Link>
              <Link href="/login" className="btn btn-ghost" style={{ padding: "0.85rem 2.25rem", fontSize: "var(--t-base)" }}>Sign in</Link>
            </div>
          </div>

          {/* Player photo cluster */}
          {squadPreview.length >= 5 && (
            <div className="hero-cluster fade-up" data-delay="2" style={{ position: "relative", height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: 260, height: 260 }}>
                {squadPreview.map((p, i) => {
                  const angle = (i / squadPreview.length) * Math.PI * 2 - Math.PI / 2;
                  const r = 95;
                  const x = 130 + Math.cos(angle) * r - 44;
                  const y = 130 + Math.sin(angle) * r - 44;
                  return (
                    <div key={p.id} style={{ position: "absolute", left: x, top: y }}>
                      <Avatar id={p.id} name={p.name} size={88} ring={posTint[p.position]} />
                    </div>
                  );
                })}
                {/* centre badge */}
                <div style={{ position: "absolute", left: 130 - 38, top: 130 - 38, width: 76, height: 76, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", boxShadow: "0 0 30px rgba(204,255,0,0.4)" }}>
                  <span className="display" style={{ fontSize: "1.5rem", color: "#0B0B12", lineHeight: 0.8 }}>XI</span>
                  <span style={{ fontSize: "0.5rem", fontWeight: 800, color: "#0B0B12", letterSpacing: "0.08em" }}>YOUR SQUAD</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stat strip */}
        <div className="wrap" style={{ position: "relative", paddingBottom: "3.5rem" }}>
          <div className="fade-up" data-delay="4" style={{ display: "flex", flexWrap: "wrap", gap: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border-mid)" }}>
            {[["706", "Players"], ["48", "Nations"], ["£100m", "Budget"], ["0.2◎", "Entry"], ["500K", "WCF held"]].map(([v, l]) => (
              <div key={l}>
                <div className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--gold)", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: "var(--t-xs)", color: "var(--muted)", marginTop: "0.35rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flag marquee — World Cup nations ── */}
      <section style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", overflow: "hidden", padding: "1.1rem 0" }}>
        <div className="flag-track" style={{ display: "flex", gap: "2rem", whiteSpace: "nowrap", alignItems: "center" }}>
          {[...flags, ...flags].map(([country, flag], i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              <span style={{ fontSize: "1.5rem" }}>{flag}</span>
              <span style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{country}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <div className="rule-maroon" style={{ marginBottom: "1.25rem" }} />
          <h2 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "0.5rem" }}>How it works</h2>
          <p style={{ color: "var(--muted)", marginBottom: "3rem", fontSize: "var(--t-md)" }}>Four steps from wallet to squad.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }} className="how-grid">
            {[
              { n: "01", heading: "Hold tokens", body: "Your wallet must hold 500,000 WCF. We check the balance — read-only, no signature.", visual: "token" },
              { n: "02", heading: "Pay entry", body: "Send 0.2 SOL to the treasury. Paste your transaction signature, verified on-chain.", visual: "sol" },
              { n: "03", heading: "Pick your squad", body: "15 players from 706 within £100m. Set captain, vice-captain and formation.", visual: "squad" },
              { n: "04", heading: "Earn points", body: "Points per World Cup match. Top the global board or win your mini league.", visual: "points" },
            ].map((s) => (
              <div key={s.n} className="card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column" }}>
                <p className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--maroon)", marginBottom: "1.25rem" }}>{s.n}</p>

                {/* Visual */}
                <div style={{ height: 64, display: "flex", alignItems: "center", marginBottom: "1.25rem" }}>
                  {s.visual === "token" && (
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0B0B12", fontWeight: 800, fontSize: "1.5rem", boxShadow: "0 0 24px rgba(204,255,0,0.35)" }}>◎</div>
                  )}
                  {s.visual === "sol" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span className="display" style={{ fontSize: "2.5rem", color: "var(--magenta)" }}>0.2</span>
                      <span style={{ fontSize: "1.5rem" }}>◎</span>
                    </div>
                  )}
                  {s.visual === "squad" && (
                    <div style={{ display: "flex" }}>
                      {squadPreview.slice(0, 4).map((p, i) => (
                        <div key={p.id} style={{ marginLeft: i === 0 ? 0 : -16 }}>
                          <Avatar id={p.id} name={p.name} size={48} ring={posTint[p.position]} />
                        </div>
                      ))}
                    </div>
                  )}
                  {s.visual === "points" && (
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                      <span className="display" style={{ fontSize: "2.75rem", color: "var(--gold)" }}>247</span>
                      <span style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>pts</span>
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>{s.heading}</h3>
                <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The talent pool — player lineup strip ── */}
      {lineup.length >= 12 && (
        <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--border)" }}>
          <div className="wrap">
            <div className="rule-maroon" style={{ marginBottom: "1.25rem" }} />
            <h2 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "0.5rem" }}>The talent pool</h2>
            <p style={{ color: "var(--muted)", marginBottom: "2.5rem", fontSize: "var(--t-md)" }}>706 players. Every nation. Pick the ones who&apos;ll deliver.</p>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="player-track" style={{ display: "flex", gap: "1rem", padding: "0 2rem", whiteSpace: "nowrap" }}>
              {[...lineup.slice(0, 14), ...lineup.slice(0, 14)].map((p, i) => (
                <div key={i} style={{ flexShrink: 0, width: 130, textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.6rem" }}>
                    <Avatar id={p.id} name={p.name} size={92} ring={posTint[p.position]} />
                  </div>
                  <p style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: "var(--navy)", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name.split(" ").slice(-1)[0]}</p>
                  <p style={{ fontSize: "var(--t-xs)", color: "var(--muted)" }}>{countryFlags[p.country] || "🌍"} <span style={{ color: posTint[p.position], fontWeight: 700 }}>{p.position}</span></p>
                  <p className="display" style={{ fontSize: "var(--t-md)", color: "var(--gold)", marginTop: "0.2rem" }}>£{p.value}m</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Features + Scoring ── */}
      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          <div>
            <div className="rule-maroon" style={{ marginBottom: "1.25rem" }} />
            <h2 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "2rem" }}>What you get</h2>
            <div>
              {features.map((f) => (
                <div key={f.heading} style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "0.25rem" }}>{f.heading}</p>
                  <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", lineHeight: 1.55 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="rule-maroon" style={{ marginBottom: "1.25rem" }} />
            <h2 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "2rem" }}>Points system</h2>
            <div className="card">
              {scoring.map(([action, pts], i) => (
                <div key={action} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.25rem", borderBottom: i < scoring.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: "var(--t-sm)", color: "var(--muted)" }}>{action}</span>
                  <span className="display" style={{ fontSize: "var(--t-md)", fontVariantNumeric: "tabular-nums", color: pts.startsWith("−") ? "var(--magenta)" : "var(--gold)" }}>{pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "var(--maroon)", padding: "5rem 0", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, transparent 60%, var(--magenta) 60%)", opacity: 0.5 }} />
        <div className="wrap" style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <h2 className="display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", marginBottom: "1rem", maxWidth: "16ch" }}>
              Kickoff is<br /><span style={{ color: "var(--gold)" }}>June 11.</span>
            </h2>
            <p style={{ fontSize: "var(--t-md)", color: "rgba(255,255,255,0.85)", maxWidth: "40ch" }}>The prize pool grows with every manager. Get your squad in before the deadline.</p>
          </div>
          <Link href="/register" className="btn" style={{ background: "var(--gold)", color: "#0B0B12", fontSize: "var(--t-md)", padding: "1rem 2.75rem", boxShadow: "0 4px 0 #9ec800" }}>Enter now</Link>
        </div>
      </section>

      <footer style={{ padding: "2rem 0" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span className="display" style={{ fontSize: "var(--t-base)", color: "var(--navy)" }}>WC Fantasy <span style={{ color: "var(--magenta)" }}>26</span></span>
          <span style={{ fontSize: "var(--t-xs)", color: "var(--subtle)" }}>Powered by Solana · WCF Token</span>
        </div>
      </footer>

      <style>{`
        @keyframes scroll-flags { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes scroll-players { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .flag-track   { animation: scroll-flags 40s linear infinite; }
        .player-track { animation: scroll-players 50s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .flag-track, .player-track { animation: none; flex-wrap: wrap; white-space: normal; }
        }
        @media (max-width: 860px) {
          .wrap { padding: 0 1.25rem; }
          .hero-cluster { display: none !important; }
          .wrap[style*="grid-template-columns: 1.3fr 1fr"] { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr 1fr !important; }
          .feat-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
        @media (max-width: 520px) {
          .how-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
