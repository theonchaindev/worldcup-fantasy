import Link from "next/link";

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

export default function LandingPage() {
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

      {/* ── Hero — bold colour block ── */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        {/* Background accent blocks */}
        <div aria-hidden style={{ position: "absolute", top: "-20%", right: "-5%", width: "45%", height: "140%", background: "var(--maroon)", transform: "skewX(-9deg)", opacity: 0.9 }} />
        <div aria-hidden style={{ position: "absolute", top: "-20%", right: "-12%", width: "20%", height: "140%", background: "var(--magenta)", transform: "skewX(-9deg)", opacity: 0.85 }} />

        <div className="wrap" style={{ position: "relative", paddingTop: "5.5rem", paddingBottom: "5.5rem" }}>
          <p className="chip chip-gold fade-up" style={{ marginBottom: "1.75rem", display: "inline-flex" }}>
            <span className="live-dot" /> USA · Canada · Mexico — June 2026
          </p>

          <h1 className="display fade-up" data-delay="1" style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", color: "var(--navy)", marginBottom: "1.5rem", maxWidth: "12ch" }}>
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

          {/* Stat strip */}
          <div className="fade-up" data-delay="4" style={{ display: "flex", flexWrap: "wrap", gap: "3rem", marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border-mid)" }}>
            {[
              ["706", "Players"], ["48", "Nations"], ["£100m", "Budget"], ["0.2◎", "Entry"], ["500K", "WCF held"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--gold)", lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: "var(--t-xs)", color: "var(--muted)", marginTop: "0.35rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
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
              { n: "01", heading: "Hold tokens", body: "Your wallet must hold 500,000 WCF. We check the balance — read-only, no signature." },
              { n: "02", heading: "Pay entry", body: "Send 0.2 SOL to the treasury. Paste your transaction signature, verified on-chain." },
              { n: "03", heading: "Pick your squad", body: "15 players from 706 within £100m. Set captain, vice-captain and formation." },
              { n: "04", heading: "Earn points", body: "Points per World Cup match. Top the global board or win your mini league." },
            ].map((s) => (
              <div key={s.n} className="card" style={{ padding: "1.75rem" }}>
                <p className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--maroon)", marginBottom: "1rem" }}>{s.n}</p>
                <h3 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>{s.heading}</h3>
                <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* ── CTA — full colour block ── */}
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
        @media (max-width: 860px) {
          .wrap { padding: 0 1.25rem; }
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
