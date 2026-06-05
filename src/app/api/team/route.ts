import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const team = await prisma.userTeam.findUnique({
    where: { userId: session.userId },
    include: { players: { include: { player: true } } },
  });
  return Response.json({ team });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { formation, captainId, viceCaptainId, players } = await req.json();
    // players: [{ playerId, isSub, slot }]

    if (!players || players.length !== 15) {
      return Response.json({ error: "Squad must have exactly 15 players" }, { status: 400 });
    }

    const playerData = await prisma.player.findMany({
      where: { id: { in: players.map((p: { playerId: string }) => p.playerId) } },
    });

    // Validate positions for subs
    const subPlayers = players.filter((p: { isSub: boolean }) => p.isSub);
    const subsByPosition = playerData.filter(p => subPlayers.some((s: { playerId: string }) => s.playerId === p.id));
    const positions = subsByPosition.map(p => p.position);
    if (!positions.includes("GK")) return Response.json({ error: "Squad needs a GK sub" }, { status: 400 });
    if (!positions.includes("DEF")) return Response.json({ error: "Squad needs a DEF sub" }, { status: 400 });
    if (!positions.includes("MID")) return Response.json({ error: "Squad needs a MID sub" }, { status: 400 });
    if (!positions.includes("FWD")) return Response.json({ error: "Squad needs a FWD sub" }, { status: 400 });

    // Validate budget (0.1 tolerance for floating point)
    const totalValue = playerData.reduce((sum, p) => sum + Number(p.value), 0);
    if (totalValue > 100.1) {
      return Response.json({ error: `Squad value £${totalValue.toFixed(1)}m exceeds £100m budget` }, { status: 400 });
    }

    // Upsert team
    const existingTeam = await prisma.userTeam.findUnique({ where: { userId: session.userId } });

    if (existingTeam) {
      await prisma.userPlayer.deleteMany({ where: { teamId: existingTeam.id } });
      await prisma.userTeam.update({
        where: { id: existingTeam.id },
        data: { formation, captainId, viceCaptainId },
      });
      await prisma.userPlayer.createMany({
        data: players.map((p: { playerId: string; isSub: boolean; slot: number }) => ({
          teamId: existingTeam.id,
          playerId: p.playerId,
          isSub: p.isSub,
          slot: p.slot,
        })),
      });
    } else {
      await prisma.userTeam.create({
        data: {
          userId: session.userId,
          formation,
          captainId,
          viceCaptainId,
          players: {
            create: players.map((p: { playerId: string; isSub: boolean; slot: number }) => ({
              playerId: p.playerId,
              isSub: p.isSub,
              slot: p.slot,
            })),
          },
        },
      });
    }

    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed to save team" }, { status: 500 });
  }
}
