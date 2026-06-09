import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGameweekState, FREE_TRANSFERS_PER_GW } from "@/lib/gameweek";

/**
 * Sync a team's transfer allowance to the active gameweek.
 * On entering a new in-season gameweek, transfers reset to 3 (they do NOT stack).
 * Returns the (possibly updated) transfersRemaining.
 */
async function syncTransfers(
  teamId: string,
  lastSyncedGw: number,
  transfersRemaining: number,
  activeGwNumber: number,
  isPreSeason: boolean
): Promise<number> {
  if (isPreSeason) return transfersRemaining; // pre-season: allowance irrelevant
  if (lastSyncedGw < activeGwNumber) {
    await prisma.userTeam.update({
      where: { id: teamId },
      data: { transfersRemaining: FREE_TRANSFERS_PER_GW, lastSyncedGw: activeGwNumber },
    });
    return FREE_TRANSFERS_PER_GW;
  }
  return transfersRemaining;
}

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const gw = await getGameweekState();
  let team = await prisma.userTeam.findUnique({
    where: { userId: session.userId },
    include: { players: { include: { player: true } } },
  });

  let transfersRemaining = team?.transfersRemaining ?? FREE_TRANSFERS_PER_GW;
  if (team && gw) {
    transfersRemaining = await syncTransfers(team.id, team.lastSyncedGw, team.transfersRemaining, gw.active.number, gw.isPreSeason);
    if (transfersRemaining !== team.transfersRemaining) {
      team = { ...team, transfersRemaining };
    }
  }

  return Response.json({
    team,
    gameweek: gw ? { number: gw.active.number, name: gw.active.name, deadline: gw.active.deadline, isPreSeason: gw.isPreSeason, isLocked: gw.isLocked } : null,
    transfersRemaining,
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { formation, captainId, viceCaptainId, players } = await req.json();

    if (!players || players.length !== 15) {
      return Response.json({ error: "Squad must have exactly 15 players" }, { status: 400 });
    }

    const playerData = await prisma.player.findMany({
      where: { id: { in: players.map((p: { playerId: string }) => p.playerId) } },
    });

    // Validate sub positions
    const subPlayers = players.filter((p: { isSub: boolean }) => p.isSub);
    const subsByPosition = playerData.filter((p) => subPlayers.some((s: { playerId: string }) => s.playerId === p.id));
    const positions = subsByPosition.map((p) => p.position);
    if (!positions.includes("GK")) return Response.json({ error: "Squad needs a GK sub" }, { status: 400 });
    if (!positions.includes("DEF")) return Response.json({ error: "Squad needs a DEF sub" }, { status: 400 });
    if (!positions.includes("MID")) return Response.json({ error: "Squad needs a MID sub" }, { status: 400 });
    if (!positions.includes("FWD")) return Response.json({ error: "Squad needs a FWD sub" }, { status: 400 });

    // Budget
    const totalValue = playerData.reduce((sum, p) => sum + Number(p.value), 0);
    if (totalValue > 100.1) {
      return Response.json({ error: `Squad value £${totalValue.toFixed(1)}m exceeds £100m budget` }, { status: 400 });
    }

    // Max 3 per nation
    const byNation: Record<string, number> = {};
    for (const p of playerData) {
      byNation[p.country] = (byNation[p.country] || 0) + 1;
      if (byNation[p.country] > 3) {
        return Response.json({ error: `Max 3 players from one nation — too many from ${p.country}` }, { status: 400 });
      }
    }

    const gw = await getGameweekState();
    const existingTeam = await prisma.userTeam.findUnique({
      where: { userId: session.userId },
      include: { players: true },
    });

    const newIds = players.map((p: { playerId: string }) => p.playerId).sort();

    // ── Transfer-limit enforcement ──
    // Free (unlimited) when: pre-season, OR creating the squad for the first time.
    // In-season edits to an existing squad cost 1 transfer per player changed (max 3/GW).
    let transfersRemaining = existingTeam?.transfersRemaining ?? FREE_TRANSFERS_PER_GW;
    let lastSyncedGw = existingTeam?.lastSyncedGw ?? 0;

    if (existingTeam && gw && !gw.isPreSeason) {
      // Reset allowance if we've rolled into a new gameweek (no stacking)
      if (lastSyncedGw < gw.active.number) {
        transfersRemaining = FREE_TRANSFERS_PER_GW;
        lastSyncedGw = gw.active.number;
      }
      const oldIds = existingTeam.players.map((p) => p.playerId);
      const changed = newIds.filter((id: string) => !oldIds.includes(id)).length;
      if (changed > transfersRemaining) {
        return Response.json(
          { error: `Only ${transfersRemaining} free transfer${transfersRemaining === 1 ? "" : "s"} left this gameweek — you tried to make ${changed}.` },
          { status: 400 }
        );
      }
      transfersRemaining -= changed;
    } else if (gw && !gw.isPreSeason) {
      // First squad created in-season — free, allowance ready for next GW
      lastSyncedGw = gw.active.number;
      transfersRemaining = FREE_TRANSFERS_PER_GW;
    }

    // ── Persist ──
    if (existingTeam) {
      await prisma.userPlayer.deleteMany({ where: { teamId: existingTeam.id } });
      await prisma.userTeam.update({
        where: { id: existingTeam.id },
        data: { formation, captainId, viceCaptainId, transfersRemaining, lastSyncedGw },
      });
      await prisma.userPlayer.createMany({
        data: players.map((p: { playerId: string; isSub: boolean; slot: number }) => ({
          teamId: existingTeam.id, playerId: p.playerId, isSub: p.isSub, slot: p.slot,
        })),
      });
    } else {
      await prisma.userTeam.create({
        data: {
          userId: session.userId, formation, captainId, viceCaptainId, transfersRemaining, lastSyncedGw,
          players: {
            create: players.map((p: { playerId: string; isSub: boolean; slot: number }) => ({
              playerId: p.playerId, isSub: p.isSub, slot: p.slot,
            })),
          },
        },
      });
    }

    return Response.json({ ok: true, transfersRemaining, gameweek: gw?.active.number ?? null });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed to save team", detail: String(e).slice(0, 300) }, { status: 500 });
  }
}
