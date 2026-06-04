import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 50;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { verified: true, team: { isNot: null } },
      orderBy: { totalPoints: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, username: true, clubName: true, country: true, totalPoints: true, rank: true },
    }),
    prisma.user.count({ where: { verified: true, team: { isNot: null } } }),
  ]);

  const session = await getSession();
  let myRank = null;
  if (session) {
    const me = await prisma.user.findUnique({ where: { id: session.userId }, select: { totalPoints: true, rank: true, username: true, clubName: true, country: true } });
    myRank = me;
  }

  return Response.json({ users, total, page, myRank });
}
