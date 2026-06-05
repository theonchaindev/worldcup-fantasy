import { prisma } from "@/lib/prisma";

const cache = new Map<string, { url: string; ts: number }>();
const TTL = 1000 * 60 * 60 * 24; // 24h

async function resolveImageUrl(name: string): Promise<string | null> {
  const cached = cache.get(name);
  if (cached && Date.now() - cached.ts < TTL) return cached.url;

  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const player = data?.player?.[0];
    const url: string | null = player?.strCutout || player?.strThumb || null;
    if (url) cache.set(name, { url, ts: Date.now() });
    return url;
  } catch {
    return null;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // id is the player DB id
  const player = await prisma.player.findUnique({
    where: { id },
    select: { name: true, sofifaId: true },
  });

  if (!player) return new Response(null, { status: 404 });

  // sofifaId stores a direct image URL if it starts with http
  let imageUrl: string | null = null;
  if (player.sofifaId?.startsWith("http")) {
    imageUrl = player.sofifaId;
  } else {
    imageUrl = await resolveImageUrl(player.name);
  }

  if (!imageUrl) return new Response(null, { status: 404 });

  try {
    const imgRes = await fetch(imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; bot/1.0)" },
      next: { revalidate: 86400 },
    });
    if (!imgRes.ok) return new Response(null, { status: 404 });
    const buf = await imgRes.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": imgRes.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
