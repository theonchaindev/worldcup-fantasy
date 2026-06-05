/**
 * Pre-populates player image URLs in the DB.
 * Strategy per player:
 *  1. FutBin CDN (uses stored sofifaId numeric FIFA ID) — fast, no rate limit
 *  2. TheSportsDB search with normalized name
 *  3. TheSportsDB search with last name only
 * Run: npx tsx scripts/fetch-player-images.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalize(name: string) {
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function lastName(name: string) {
  return normalize(name).split(" ").slice(-1)[0];
}

async function checkFutBin(fifaId: string): Promise<string | null> {
  try {
    const url = `https://cdn.futbin.com/content/fifa25/img/players/${fifaId}.png`;
    const r = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return r.ok ? url : null;
  } catch { return null; }
}

async function searchSportsDb(term: string): Promise<string | null> {
  try {
    const r = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(term)}`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!r.ok) return null;
    const d = await r.json();
    const p = d?.player?.[0];
    return p?.strCutout || p?.strThumb || null;
  } catch { return null; }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const players = await prisma.player.findMany({
    select: { id: true, name: true, sofifaId: true },
    orderBy: { name: "asc" },
  });

  console.log(`Processing ${players.length} players…\n`);
  let futbin = 0, sportsdb = 0, failed = 0;

  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    const prefix = `[${String(i + 1).padStart(3, " ")}/${players.length}]`;

    // Skip already stored URLs
    if (p.sofifaId?.startsWith("http")) {
      process.stdout.write(`${prefix} ↩ ${p.name} (cached)\n`);
      continue;
    }

    let url: string | null = null;

    // 1. FutBin via numeric ID
    if (p.sofifaId && /^\d+$/.test(p.sofifaId)) {
      url = await checkFutBin(p.sofifaId);
      if (url) { futbin++; process.stdout.write(`${prefix} ✓ ${p.name} [futbin]\n`); }
    }

    // 2. TheSportsDB — normalized full name
    if (!url) {
      url = await searchSportsDb(normalize(p.name));
      if (url) { sportsdb++; process.stdout.write(`${prefix} ✓ ${p.name} [sportsdb]\n`); }
      await sleep(340); // stay under 3 req/s
    }

    // 3. TheSportsDB — last name only
    if (!url) {
      url = await searchSportsDb(lastName(p.name));
      if (url) { sportsdb++; process.stdout.write(`${prefix} ✓ ${p.name} [sportsdb-lastname]\n`); }
      await sleep(340);
    }

    if (!url) { failed++; process.stdout.write(`${prefix} ✗ ${p.name}\n`); continue; }

    await prisma.player.update({ where: { id: p.id }, data: { sofifaId: url } });
  }

  console.log(`\n──────────────────────────────`);
  console.log(`FutBin:      ${futbin}`);
  console.log(`TheSportsDB: ${sportsdb}`);
  console.log(`Not found:   ${failed}`);
  console.log(`Total:       ${players.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
