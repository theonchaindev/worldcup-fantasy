import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const leagues = await prisma.leagueMember.findMany({
    where: { userId: session.userId },
    include: {
      league: {
        include: {
          members: {
            include: { user: { select: { username: true, clubName: true, totalPoints: true, country: true } } },
            orderBy: { user: { totalPoints: "desc" } },
          },
          owner: { select: { username: true } },
        },
      },
    },
  });

  return Response.json({ leagues: leagues.map((l) => l.league) });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { action, name, code } = await req.json();

  if (action === "create") {
    const league = await prisma.league.create({
      data: {
        name,
        code: generateCode(),
        ownerId: session.userId,
        members: { create: { userId: session.userId } },
      },
    });
    return Response.json({ league });
  }

  if (action === "join") {
    const league = await prisma.league.findUnique({ where: { code } });
    if (!league) return Response.json({ error: "League not found" }, { status: 404 });

    const existing = await prisma.leagueMember.findUnique({
      where: { leagueId_userId: { leagueId: league.id, userId: session.userId } },
    });
    if (existing) return Response.json({ error: "Already a member" }, { status: 409 });

    await prisma.leagueMember.create({ data: { leagueId: league.id, userId: session.userId } });
    return Response.json({ ok: true, league });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
