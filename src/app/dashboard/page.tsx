import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { Trophy, TrendingUp, Users, Clock, Star, Zap, ChevronRight } from "lucide-react";
import { getFlag } from "@/lib/flags";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      team: { include: { players: { include: { player: true } } } },
      chips: true,
    },
  });
  if (!user) redirect("/login");

  const gameweek = await prisma.gameWeek.findFirst({ where: { isActive: true } });
  const globalRank = await prisma.user.count({ where: { totalPoints: { gte: user.totalPoints }, verified: true } });
  const totalManagers = await prisma.user.count({ where: { verified: true } });
  const topScorers = await prisma.player.findMany({ orderBy: { totalPoints: "desc" }, take: 5 });

  const myPlayers = user.team?.players.map((p) => p.player) || [];
  const totalValue = myPlayers.reduce((s, p) => s + p.value, 0);
  const captain = user.team?.captainId ? myPlayers.find((p) => p.id === user.team!.captainId) : null;

  return (
    <div className="min-h-screen" style={{ background: "#050d1a" }}>
      <NavBar clubName={user.clubName} />
      <DashboardClient
        user={{
          id: user.id, username: user.username, clubName: user.clubName,
          country: user.country, totalPoints: user.totalPoints,
        }}
        stats={{ globalRank, totalManagers, totalValue }}
        team={user.team ? {
          formation: user.team.formation,
          captainId: user.team.captainId,
          players: user.team.players.map(p => ({ slot: p.slot, isSub: p.isSub, player: p.player })),
        } : null}
        captainName={captain?.name || null}
        topScorers={topScorers}
        chips={user.chips}
        gameweek={gameweek ? { number: gameweek.number, name: gameweek.name, deadline: gameweek.deadline.toISOString() } : null}
      />
    </div>
  );
}
