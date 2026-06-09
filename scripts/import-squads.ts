/**
 * Idempotent import of WC2026 squads from data/wc2026_squads.json.
 * Adds only players not already present (matched by accent-insensitive name).
 * New players get a default value by position (real prices to be set later)
 * and no club / image (image resolves by name on first request).
 *
 * Run: npx tsx scripts/import-squads.ts
 */
import "dotenv/config";
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultValue: Record<string, number> = { GK: 4.5, DEF: 5.0, MID: 5.5, FWD: 6.0 };

function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

interface Row { name: string; position: string; country: string; }

async function main() {
  const rows: Row[] = JSON.parse(readFileSync("data/wc2026_squads.json", "utf8"));

  const existing = await prisma.player.findMany({ select: { name: true } });
  const have = new Set(existing.map((p) => norm(p.name)));

  const toAdd = rows.filter((r) => !have.has(norm(r.name)));
  console.log(`Sheet: ${rows.length} · already present: ${rows.length - toAdd.length} · inserting: ${toAdd.length}`);

  let added = 0;
  for (const r of toAdd) {
    await prisma.player.create({
      data: {
        name: r.name,
        position: r.position,
        country: r.country,
        clubTeam: "",
        value: defaultValue[r.position] ?? 5.0,
        sofifaId: null,
      },
    });
    added++;
    if (added % 100 === 0) console.log(`  …${added}/${toAdd.length}`);
  }

  const total = await prisma.player.count();
  console.log(`Done. Added ${added}. Total players: ${total}.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
