/**
 * Fetches TheSportsDB headshot URLs for all players and stores them in the DB.
 * Run with: npx tsx scripts/fetch-player-images.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fetchImageUrl(name: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const player = data?.player?.[0];
    // Prefer cutout (transparent bg headshot), fall back to thumb
    return player?.strCutout || player?.strThumb || null;
  } catch {
    return null;
  }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const players = await prisma.player.findMany({
    select: { id: true, name: true, sofifaId: true },
    orderBy: { name: "asc" },
  });

  console.log(`Fetching images for ${players.length} players…`);
  let updated = 0, skipped = 0;

  for (let i = 0; i < players.length; i++) {
    const p = players[i];

    // Skip if already has a URL stored
    if (p.sofifaId?.startsWith("http")) { skipped++; continue; }

    const url = await fetchImageUrl(p.name);
    if (url) {
      await prisma.player.update({ where: { id: p.id }, data: { sofifaId: url } });
      updated++;
      process.stdout.write(`[${i + 1}/${players.length}] ✓ ${p.name}\n`);
    } else {
      process.stdout.write(`[${i + 1}/${players.length}] - ${p.name} (not found)\n`);
    }

    // 350ms between requests to stay under TheSportsDB rate limit (3 req/s)
    await sleep(350);
  }

  console.log(`\nDone. Updated: ${updated}, Skipped (already had URL): ${skipped}, No result: ${players.length - updated - skipped}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
