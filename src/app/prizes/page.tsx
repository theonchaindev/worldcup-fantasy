import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";

export default async function PrizesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");
  const totalManagers = await prisma.user.count({ where: { verified: true } });
  const pot = (totalManagers * 0.2).toFixed(2);

  const breakdown = [
    { place: "1st place",       share: "50%", medal: "🥇" },
    { place: "2nd place",       share: "25%", medal: "🥈" },
    { place: "3rd place",       share: "10%", medal: "🥉" },
    { place: "4th–10th place",  share: "10% split", medal: "" },
    { place: "Community fund",  share: "5%", medal: "" },
  ];

  return (
    <div style={{ background: "var(--ground)", minHeight: "100vh" }}>
      <NavBar clubName={user.clubName} />

      {/* Header with signature prize number */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
        <div className="wrap" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
          <p style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--subtle)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Current prize pool</p>
          <div className="score-bleed-wrap">
            <span className="score-bleed">{pot} SOL</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            <div>
              <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>Managers</p>
              <p style={{ fontSize: "var(--t-lg)", fontWeight: 700, color: "var(--navy)", fontVariantNumeric: "tabular-nums" }}>{totalManagers}</p>
            </div>
            <div>
              <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>Entry fee</p>
              <p style={{ fontSize: "var(--t-lg)", fontWeight: 700, color: "var(--navy)" }}>0.2 SOL</p>
            </div>
            <div>
              <p style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.15rem" }}>Distribution</p>
              <p style={{ fontSize: "var(--t-lg)", fontWeight: 700, color: "var(--navy)" }}>After the Final</p>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>

          {/* Breakdown */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)" }}>Prize distribution</h2>
            </div>
            {breakdown.map((b, i) => (
              <div key={b.place} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.25rem", borderBottom: i < breakdown.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  {b.medal && <span>{b.medal}</span>}
                  <span style={{ fontSize: "var(--t-sm)", color: "var(--navy)" }}>{b.place}</span>
                </div>
                <span style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: "var(--maroon)" }}>{b.share}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)", marginBottom: "1rem" }}>Tournament schedule</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {[
                ["Jun 11", "Group stage begins"],
                ["Jun 11 – Jul 2", "Group stage — 3 rounds"],
                ["Jul 4 – 6", "Round of 32"],
                ["Jul 9 – 11", "Round of 16"],
                ["Jul 14 – 15", "Quarter-finals"],
                ["Jul 19", "Semi-finals"],
                ["Jul 23", "Final — prizes distributed"],
              ].map(([date, event]) => (
                <div key={date} style={{ display: "flex", gap: "1rem" }}>
                  <span style={{ fontSize: "var(--t-xs)", color: "var(--subtle)", width: 96, flexShrink: 0, paddingTop: "0.1rem" }}>{date}</span>
                  <span style={{ fontSize: "var(--t-sm)", color: "var(--muted)" }}>{event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Funding */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "var(--t-md)", fontWeight: 700, color: "var(--navy)", marginBottom: "1rem" }}>How it is funded</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { title: "Entry fees", body: `${totalManagers} managers × 0.2 SOL = ${pot} SOL` },
                { title: "WCF token rewards", body: "Staking and LP rewards distributed to the pool during the tournament." },
                { title: "On-chain transparency", body: "Entry fees verified by transaction signature. Token balance verified by RPC query. No trust required." },
              ].map(f => (
                <div key={f.title} style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "0.25rem", fontSize: "var(--t-sm)" }}>{f.title}</p>
                  <p style={{ fontSize: "var(--t-sm)", color: "var(--muted)", lineHeight: 1.6 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
