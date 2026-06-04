import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const position = searchParams.get("position");
  const country = searchParams.get("country");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "value";
  const order = searchParams.get("order") || "desc";

  const where: Record<string, unknown> = {};
  if (position && position !== "ALL") where.position = position;
  if (country && country !== "ALL") where.country = country;
  if (search) where.name = { contains: search, mode: "insensitive" };

  const players = await prisma.player.findMany({
    where,
    orderBy: { [sort === "points" ? "totalPoints" : sort === "form" ? "form" : "value"]: order as "asc" | "desc" },
  });
  return Response.json({ players });
}
