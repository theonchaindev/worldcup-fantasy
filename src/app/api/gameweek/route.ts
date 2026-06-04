import { prisma } from "@/lib/prisma";

export async function GET() {
  const gameweeks = await prisma.gameWeek.findMany({ orderBy: { number: "asc" } });
  const active = gameweeks.find((g) => g.isActive) || gameweeks[0];
  return Response.json({ gameweeks, active });
}
