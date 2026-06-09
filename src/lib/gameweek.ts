import { prisma } from "@/lib/prisma";

export interface GameweekState {
  active: {
    id: string;
    number: number;
    name: string;
    deadline: Date;
  };
  /** True before the first gameweek's deadline — unlimited squad changes. */
  isPreSeason: boolean;
  /** True once the active gameweek's deadline has passed (team locked for it). */
  isLocked: boolean;
}

/**
 * The active gameweek is the first one whose deadline is still in the future.
 * Once every deadline has passed, it's the final gameweek.
 * Pre-season = we're before the very first deadline (unlimited transfers).
 */
export async function getGameweekState(): Promise<GameweekState | null> {
  const gameweeks = await prisma.gameWeek.findMany({ orderBy: { number: "asc" } });
  if (gameweeks.length === 0) return null;

  const now = Date.now();
  const upcoming = gameweeks.find((g) => g.deadline.getTime() > now);
  const active = upcoming ?? gameweeks[gameweeks.length - 1];
  const isPreSeason = now < gameweeks[0].deadline.getTime();
  const isLocked = active.deadline.getTime() <= now;

  return {
    active: { id: active.id, number: active.number, name: active.name, deadline: active.deadline },
    isPreSeason,
    isLocked,
  };
}

export const FREE_TRANSFERS_PER_GW = 3;
