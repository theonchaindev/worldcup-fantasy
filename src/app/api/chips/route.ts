import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const chips = await prisma.userChip.findMany({ where: { userId: session.userId } });
  return Response.json({ chips });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { chipType, gameweekNumber } = await req.json();

  const chip = await prisma.userChip.findFirst({
    where: { userId: session.userId, chipType, usedAt: null },
  });
  if (!chip) return Response.json({ error: "Chip not available or already used" }, { status: 400 });

  await prisma.userChip.update({
    where: { id: chip.id },
    data: { usedAt: new Date(), gameweekNumber },
  });

  return Response.json({ ok: true });
}
