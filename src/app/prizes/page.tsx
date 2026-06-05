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
    { place: "1st place", share: "50%", emoji: "🥇" },
    { place: "2nd place", share: "25%", emoji: "🥈" },
    { place: "3rd place", share: "10%", emoji: "🥉" },
    { place: "4th–10th", share: "10% split", emoji: "" },
    { place: "Community", share: "5%", emoji: "" },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <NavBar clubName={user.clubName} />
      <div className="max-w-4xl mx-auto px-4" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-3xl)", color: "var(--ink)", marginBottom: "0.4rem" }}>Prize pool</h1>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>Entry fees plus WCF token rewards. Grows with every new manager.</p>
        </div>

        {/* Live pot */}
        <div className="card" style={{ padding: "2rem", marginBottom: "1.5rem", borderColor: "oklch(0.76 0.146 65 / 0.3)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "1.5rem" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.5rem, 8vw, 4rem)", color: "var(--primary)", lineHeight: 1, fontFeatureSettings: '"tnum"' }}>{pot} SOL</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", marginTop: "0.4rem" }}>Current prize pot — {totalManagers} managers × 0.2 SOL</div>
            </div>
            <div className="chip chip-green" style={{ alignSelf: "flex-start" }}>
              <span className="live-dot" style={{ animation: "pulse 2s ease-in-out infinite" }} />
              Live
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {/* Distribution */}
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--border-subtle)" }}>
              <h2 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)" }}>Distribution</h2>
            </div>
            {breakdown.map((b, i) => (
              <div key={b.place} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.25rem", borderBottom: i < breakdown.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  {b.emoji && <span>{b.emoji}</span>}
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--ink)" }}>{b.place}</span>
                </div>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--primary)" }}>{b.share}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)", marginBottom: "1rem" }}>Tournament schedule</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { date: "Jun 11", event: "Group Stage begins" },
                { date: "Jun 11 – Jul 2", event: "Group Stage (3 rounds)" },
                { date: "Jul 4 – 6", event: "Round of 32" },
                { date: "Jul 9 – 11", event: "Round of 16" },
                { date: "Jul 14 – 15", event: "Quarter-Finals" },
                { date: "Jul 19", event: "Semi-Finals" },
                { date: "Jul 23", event: "Final — prizes distributed" },
              ].map(t => (
                <div key={t.date} style={{ display: "flex", gap: "0.875rem" }}>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--ink-3)", width: 90, flexShrink: 0, paddingTop: "0.1rem" }}>{t.date}</span>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)" }}>{t.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fair play */}
        <div className="card" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "var(--text-md)", fontWeight: 700, color: "var(--ink)", marginBottom: "1rem" }}>How it&apos;s funded</h2>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {[
              { title: "Entry fees", body: `${totalManagers} managers × 0.2 SOL = ${pot} SOL` },
              { title: "Token rewards", body: "WCF staking and LP rewards distributed to the prize pool during the tournament." },
              { title: "On-chain transparency", body: "Entry fees verified by Solana transaction signature. Token balance checked by RPC query." },
            ].map(f => (
              <div key={f.title}>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--ink)", marginBottom: "0.35rem" }}>{f.title}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--ink-2)", lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
