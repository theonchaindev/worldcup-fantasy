import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, email: true, clubName: true, country: true, walletAddress: true, totalPoints: true, rank: true, team: { select: { formation: true, captainId: true, viceCaptainId: true } } },
  });
  return Response.json({ user });
}
