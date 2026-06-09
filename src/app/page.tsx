import Link from "next/link";

const scoring = [
  ["Goal — forward", "+4"], ["Goal — midfielder", "+5"], ["Goal — defender / GK", "+6"],
  ["Assist", "+3"], ["Clean sheet (GK / DEF)", "+4"], ["Penalty save", "+5"],
  ["Playing 90 minutes", "+2"], ["Yellow card", "−1"], ["Red card", "−3"],
  ["Own goal", "−2"], ["Captain", "×2 pts"],
];

const features = [
  { heading: "7 formations", body: "4‑3‑3, 4‑4‑2, 4‑2‑3‑1, 3‑5‑2, 3‑4‑3, 5‑3‑2, 5‑4‑1. Change before every gameweek deadline." },
  { heading: "Captain & chips", body: "Set a captain for ×2 points. Four chips per tournament: Wildcard, Triple Captain, Bench Boost, Free Hit." },
  { heading: "Mini leagues", body: "Create a private league with a six-character code. Compete with friends on a dedicated leaderboard." },
  { heading: "On-chain entry", body: "Token balance checked on Solana mainnet. Entry fee verified by transaction signature. No wallet connection required." },
  { heading: "706 players", body: "Full squads from all 48 qualified nations. Updated pricing before the tournament opens." },
  { heading: "Live prize pool", body: "50% of the pot to the winner. Funded by entry fees plus WCF token rewards distributed during the tournament." },
];

export default function LandingPage() {
  return (
    <main style={{ background: "var(--ground)", minHeight: "100vh" }}>

      {/* ── Nav ── */}
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: "var(--z-nav)" }}>
        <div className="wrap" style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="display-italic" style={{ fontSize: "var(--t-lg)", color: "var(--maroon)" }}>
            World Cup Fantasy
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/login" style={{ fontSize: "var(--t-sm)", fontWeight: 500, color: "var(--muted)", textDecoration: "none" }}>Sign in</Link>
            <Link href="/register" className="btn btn-primary">Enter now</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="wrap" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "end" }}>

          {/* Left: display headline */}
          <div>
            <p className="chip chip-maroon fade-up" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
              <span className="live-dot" />
              USA · Canada · Mexico — June 2026
            </p>
            <h1 className="display fade-up" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "var(--navy)", lineHeight: 0.92, marginBottom: "1.5rem" }} data-delay="1">
              World Cup<br />
              <em style={{ fontStyle: "italic", color: "var(--maroon)" }}>Fantasy</em><br />
              2026
            </h1>
            <p className="fade-up" style={{ fontSize: "var(--t-md)", color: "var(--muted)", maxWidth: "38ch", lineHeight: 1.65, marginBottom: "2.5rem" }} data-delay="2">
              Token-gated. On-chain entry. 48 nations, 706 players, one prize pool.
            </p>
            <div className="fade-up" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }} data-delay="3">
              <Link href="/register" className="btn btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "var(--t-base)" }}>Enter now</Link>
              <Link href="/login" className="btn btn-ghost" style={{ padding: "0.75rem 2rem", fontSize: "var(--t-base)" }}>Sign in</Link>
            </div>
          </div>

          {/* Right: requirements metadata */}
          <div className="fade-up" style={{ borderLeft: "1px solid var(--border)", paddingLeft: "3rem" }} data-delay="2">
            <p style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--subtle)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Entry requirements</p>
            {[
              ["Token balance", "500,000 WCF"],
              ["Entry fee", "0.2 SOL"],
              ["Squad budget", "£100 million"],
              ["Squad size", "15 players (11 + 4 subs)"],
              ["Nations", "All 48 World Cup qualifiers"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "var(--t-sm)", color: "var(--muted)" }}>{label}</span>
                <span style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--navy)" }}>{value}</span>
              </div>
            ))}
            <div style={{ marginTop: "1.5rem" }}>
              <div className="rule-maroon" />
              <p style={{ marginTop: "1rem", fontSize: "var(--t-xs)", color: "var(--subtle)", lineHeight: 1.6 }}>
                No wallet connection required. We verify your token balance and entry payment by reading the Solana blockchain directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ borderTop: "1px solid var(--border)", padding: "5rem 0", background: "var(--surface)" }}>
        <div className="wrap">
          <h2 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "0.5rem" }}>How it works</h2>
          <p style={{ color: "var(--muted)", marginBottom: "3rem", fontSize: "var(--t-md)" }}>Four steps from wallet to squad.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}>
            {[
              { n: "01", heading: "Hold tokens", body: "Your Solana wallet must hold 500,000 WCF tokens. We check the balance — read-only, no signature." },
              { n: "02", heading: "Pay entry", body: "Send 0.2 SOL to our treasury wallet. Paste your transaction signature. We verify it on-chain." },
              { n: "03", heading: "Pick your squad", body: "Select 15 players from 706 across 48 nations within a £100m budget. Set captain and formation." },
              { n: "04", heading: "Earn points", body: "Points awarded per World Cup match. Top the global leaderboard or win your mini league." },
            ].map((step) => (
              <div key={step.n} style={{ padding: "2rem", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                <p className="display" style={{ fontSize: "3rem", color: "var(--border-mid)", marginBottom: "1rem" }}>{step.n}</p>
                <h3 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)", marginBottom: "0.5rem" }}>{step.heading}</h3>
                <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", lineHeight: 1.65 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features + Scoring ── */}
      <section style={{ padding: "5rem 0" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
          {/* Features */}
          <div>
            <h2 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "0.5rem" }}>What you get</h2>
            <p style={{ color: "var(--muted)", marginBottom: "2.5rem" }}>Everything built for serious play.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {features.map((f) => (
                <div key={f.heading} style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "0.25rem", fontSize: "var(--t-base)" }}>{f.heading}</p>
                  <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", lineHeight: 1.6 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring */}
          <div>
            <h2 className="display" style={{ fontSize: "var(--t-2xl)", color: "var(--navy)", marginBottom: "0.5rem" }}>Points system</h2>
            <p style={{ color: "var(--muted)", marginBottom: "2.5rem" }}>Awarded per World Cup match.</p>
            <div className="card">
              {scoring.map(([action, pts], i) => (
                <div key={action} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1.25rem", borderBottom: i < scoring.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: "var(--t-sm)", color: "var(--muted)" }}>{action}</span>
                  <span style={{ fontSize: "var(--t-sm)", fontWeight: 700, fontFamily: "var(--font-body)", fontVariantNumeric: "tabular-nums", color: pts.startsWith("−") ? "#A01A1A" : "var(--gold)" }}>{pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderTop: "1px solid var(--border)", padding: "6rem 0", background: "var(--surface)" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <h2 className="display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--navy)", marginBottom: "1rem", maxWidth: "18ch" }}>
              The tournament opens{" "}
              <em style={{ color: "var(--maroon)", fontStyle: "italic" }}>June 11.</em>
            </h2>
            <p style={{ fontSize: "var(--t-md)", color: "var(--muted)", maxWidth: "40ch" }}>Prize pool grows with every manager who enters. Build your squad before the deadline.</p>
          </div>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: "var(--t-md)", padding: "0.875rem 2.5rem", flexShrink: 0 }}>Enter now</Link>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "1.75rem 0" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span className="display-italic" style={{ fontSize: "var(--t-base)", color: "var(--maroon)" }}>World Cup Fantasy 2026</span>
          <span style={{ fontSize: "var(--t-xs)", color: "var(--subtle)" }}>Powered by Solana · WCF Token</span>
        </div>
      </footer>

      {/* Mobile responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .wrap { padding: 0 1.25rem; }
          section > .wrap > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 2rem !important; }
          section > .wrap > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="paddingLeft: 3rem"] { padding-left: 0 !important; border-left: none !important; border-top: 1px solid var(--border) !important; padding-top: 2rem !important; }
        }
        @media (max-width: 480px) {
          section > .wrap > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
