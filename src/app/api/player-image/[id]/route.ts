import { prisma } from "@/lib/prisma";
import sharp from "sharp";

export const runtime = "nodejs";

const posColors: Record<string, { bg: string; fg: string }> = {
  GK:  { bg: "#1C1C2B", fg: "#FFB020" },
  DEF: { bg: "#1C1C2B", fg: "#00E08A" },
  MID: { bg: "#1C1C2B", fg: "#2F6BFF" },
  FWD: { bg: "#1C1C2B", fg: "#FF2E93" },
};

function svgResponse(initials: string, position: string): Response {
  const { bg, fg } = posColors[position] || { bg: "#14141F", fg: "#2F6BFF" };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <rect width="80" height="80" fill="${bg}"/>
  <circle cx="40" cy="34" r="15" fill="${fg}" opacity="0.18"/>
  <text x="40" y="40" text-anchor="middle" font-family="Georgia,serif" font-size="20" font-weight="700" fill="${fg}" opacity="0.9" letter-spacing="-0.5">${initials}</text>
  <path d="M16,80 Q40,56 64,80 Z" fill="${fg}" opacity="0.12"/>
</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=604800" },
  });
}

function normalize(name: string): string {
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function lastName(name: string): string {
  const parts = normalize(name).split(" ");
  return parts[parts.length - 1];
}

async function fetchBytes(url: string, timeoutMs = 3500): Promise<Buffer | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const r = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } });
    clearTimeout(t);
    if (!r.ok) return null;
    return Buffer.from(await r.arrayBuffer());
  } catch {
    return null;
  }
}

/**
 * Normalise any source image to a consistent head-and-shoulders square.
 * 1. trim transparent / flat border so the player fills the frame
 * 2. crop a square from the TOP, centred horizontally (head + shoulders)
 * 3. resize to 240×240 PNG
 * Works for both FIFA-card renders (head+torso) and full-body cutouts.
 */
async function cropHead(buf: Buffer): Promise<Buffer | null> {
  try {
    let working = buf;
    let info: sharp.OutputInfo | null = null;
    try {
      const trimmed = await sharp(buf).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
      working = trimmed.data;
      info = trimmed.info;
    } catch {
      const meta = await sharp(buf).metadata();
      info = { width: meta.width ?? 0, height: meta.height ?? 0 } as sharp.OutputInfo;
    }
    const w = info?.width ?? 0;
    const h = info?.height ?? 0;
    if (w < 20 || h < 20) return null;

    // Head-and-shoulders square: side = full width (portrait) or height if wider.
    const side = Math.min(w, h);
    const left = Math.max(0, Math.round((w - side) / 2));
    // Nudge down a touch so we don't clip hair, but keep it a head shot.
    const top = Math.min(Math.round(side * 0.04), Math.max(0, h - side));

    const out = await sharp(working)
      .extract({ left, top, width: side, height: Math.min(side, h - top) })
      .resize(240, 240, { fit: "cover", position: "top" })
      .png()
      .toBuffer();
    return out;
  } catch {
    return null;
  }
}

function imageResponse(buf: Buffer): Response {
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
    },
  });
}

async function sportsDbUrl(searchTerm: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const r = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(searchTerm)}`,
      { signal: ctrl.signal }
    );
    clearTimeout(t);
    if (!r.ok) return null;
    const data = await r.json();
    const p = data?.player?.[0];
    return p?.strCutout || p?.strThumb || null;
  } catch {
    return null;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const player = await prisma.player.findUnique({
    where: { id },
    select: { name: true, position: true, sofifaId: true },
  });

  const name = player?.name || "?";
  const pos = player?.position || "MID";
  const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  // Resolve a source URL (stored URL → FutBin by FIFA id → TheSportsDB by name).
  let sourceUrl: string | null = null;

  if (player?.sofifaId?.startsWith("http")) {
    sourceUrl = player.sofifaId;
  } else if (player?.sofifaId && /^\d+$/.test(player.sofifaId)) {
    sourceUrl = `https://cdn.futbin.com/content/fifa25/img/players/${player.sofifaId}.png`;
  } else if (player) {
    for (const term of [normalize(name), lastName(name)]) {
      const url = await sportsDbUrl(term);
      if (url) {
        sourceUrl = url;
        prisma.player.update({ where: { id }, data: { sofifaId: url } }).catch(() => {});
        break;
      }
    }
  }

  if (sourceUrl) {
    const bytes = await fetchBytes(sourceUrl);
    if (bytes) {
      const cropped = await cropHead(bytes);
      if (cropped) return imageResponse(cropped);
    }
  }

  return svgResponse(initials, pos);
}
