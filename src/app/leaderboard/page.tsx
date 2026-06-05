import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import LeaderboardClient from "./LeaderboardClient";

export default async function LeaderboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  const allUsers = await prisma.user.findMany({
    where: { verified: true, team: { isNot: null } },
    orderBy: { totalPoints: "desc" },
    take: 100,
    select: { id: true, username: true, clubName: true, country: true, totalPoints: true },
  });

  return (
    <div className="min-h-screen" style={{ background: "#050d1a" }}>
      <NavBar clubName={user.clubName} />
      <LeaderboardClient users={allUsers} currentUserId={session.userId} />
    </div>
  );
}
